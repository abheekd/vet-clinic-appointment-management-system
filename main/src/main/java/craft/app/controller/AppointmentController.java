package craft.app.controller;

import craft.app.data.structure.IntervalSearchTree;
import craft.app.entity.appointment.Appointment;
import craft.app.entity.appointment.AppointmentDetails;
import craft.app.entity.appointment.repo.AppointmentDetailsRepository;
import craft.app.entity.appointment.repo.AppointmentRepository;
import craft.app.entity.pet.Pet;
import craft.app.entity.pet.repo.PetRepository;
import craft.app.entity.vet.Vet;
import craft.app.entity.vet.repo.VetRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;

import javax.annotation.PostConstruct;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoField;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(
        path = "/api/v1/appointment",
        produces = {APPLICATION_JSON_VALUE}
)
@AllArgsConstructor
public class AppointmentController {

    private PetRepository                petRepository;
    private VetRepository                vetRepository;
    private AppointmentRepository        appointmentRepository;
    private AppointmentDetailsRepository appointmentDetailsRepository;

    private Map<String, IntervalSearchTree> dailyAppointmentTreeMap;

    @PostConstruct
    public void populateDailyAppointmentSearchTrees() {
        initializeDaliyIntervalSearchTrees();
    }

    @Scheduled(cron = "0 0 * * * *")
    private void initializeDaliyIntervalSearchTrees() {
        ZoneId zoneId = ZoneId.of("+00:00");
        ZonedDateTime startDate = ZonedDateTime.from(Instant.now()
                                                            .atZone(zoneId)
                                                            .truncatedTo(ChronoUnit.DAYS))
                                               .minusDays(1L);
        ZonedDateTime    endDate         = startDate.plusDays(30L);
        Set<Appointment> allAppointments = appointmentRepository.findAllByStartBetweenOrderByIdAsc(startDate, endDate);
        allAppointments.stream()
                       .forEach(appointment -> {
                           ZonedDateTime appointmentStartDate = appointment.getStart();
                           ZonedDateTime appointmentEndDate   = appointment.getEnd();

                           updateIntervalSearchTree(appointmentStartDate, appointmentEndDate);
                       });
    }

    @GetMapping
    public Set<AppointmentDetails> listAllAppointments() {
        return appointmentDetailsRepository.findAllByOrderByIdAsc();
    }

    @GetMapping("current")
    public Set<AppointmentDetails> listCurrentAppointments(@RequestParam(name = "timeZone", required = false) String timeZone) {
        ZoneId zoneId = ZoneId.of("+00:00");
        if (timeZone != null) {
            zoneId = ZoneId.of(timeZone);
        }

        ZonedDateTime startDate = ZonedDateTime.from(Instant.now()
                                                            .atZone(zoneId)
                                                            .truncatedTo(ChronoUnit.DAYS));
        ZonedDateTime endDate = startDate.plusHours(24);
        return appointmentDetailsRepository.findAllByStartBetweenOrderByIdAsc(startDate, endDate);
    }

    @GetMapping(value = "{id}")
    public AppointmentDetails getAppointmentById(@PathVariable("id") Integer id) {
        Optional<AppointmentDetails> appointment = appointmentDetailsRepository.findById(id);
        if (!appointment.isPresent()) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Unknown Appointment ID");
        }

        return appointment.get();
    }

    @PostMapping(consumes = {APPLICATION_JSON_VALUE})
    public AppointmentDetails createAppointment(@RequestBody Appointment appointment) {
        ZonedDateTime appointmentStart = appointment.getStart();
        ZonedDateTime appointmentEnd   = appointment.getEnd();

        Appointment savedAppointment = null;
        if (isValidateAppointmentSlot(appointmentStart, appointmentEnd)) {

            validateVet(appointment);
            validatePet(appointment);

            savedAppointment = appointmentRepository.save(appointment);
            updateIntervalSearchTree(appointmentStart, appointmentEnd);
        }

        return appointmentDetailsRepository.findById(savedAppointment.getId())
                                           .get();
    }

    private void validateVet(Appointment appointment) {
        Integer requestedVetId = appointment.getVetId();
        if (requestedVetId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Requested Vet ID can not be empty.");
        }

        Optional<Vet> vet = vetRepository.findById(requestedVetId);
        if (!vet.isPresent()) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Unknown Vet ID");
        }
    }

    private void validatePet(Appointment appointment) {
        Integer requestingPetId = appointment.getPetId();
        if (requestingPetId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Requesting Pet ID can not be empty");
        }

        Optional<Pet> pet = petRepository.findById(requestingPetId);
        if (!pet.isPresent()) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Unknown Pet ID");
        }
    }

    private boolean isValidateAppointmentSlot(ZonedDateTime appointmentStart, ZonedDateTime appointmentEnd) {
        Duration requestedAppointmentDuration = Duration.between(appointmentStart, appointmentEnd);
        Duration appointmentDuration          = Duration.ofMinutes(60L);

        long diffBetweenNowAndStart = Duration.between(ZonedDateTime.now(), appointmentStart)
                                              .get(ChronoUnit.SECONDS);
        if (diffBetweenNowAndStart > (720 * 60 * 60)) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Bookings till 30 days in the future is allowed.");
        }

        if (!requestedAppointmentDuration.equals(appointmentDuration)) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Requested duration does not match the allowed duration of 60 minutes.");
        }

        IntervalSearchTree intervalSearchTree = getIntervalSearchTree(appointmentStart);
        if (intervalSearchTree.overlap(appointmentStart.getLong(ChronoField.INSTANT_SECONDS), appointmentEnd.getLong(ChronoField.INSTANT_SECONDS))) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Overlap detected for the requested appointment slot");
        }

        return true;
    }

    private void updateIntervalSearchTree(ZonedDateTime appointmentStart, ZonedDateTime appointmentEnd) {
        IntervalSearchTree intervalSearchTree    = getIntervalSearchTree(appointmentStart);
        String             appointmentTreeMapKey = getAppointmentTreeMapKey(appointmentStart);
        intervalSearchTree.add(appointmentStart.getLong(ChronoField.INSTANT_SECONDS), appointmentEnd.getLong(ChronoField.INSTANT_SECONDS));
        dailyAppointmentTreeMap.put(appointmentTreeMapKey, intervalSearchTree);
    }

    private IntervalSearchTree getIntervalSearchTree(ZonedDateTime appointmentStart) {
        String             appointmentTreeMapKey = getAppointmentTreeMapKey(appointmentStart);
        IntervalSearchTree intervalSearchTree    = dailyAppointmentTreeMap.get(appointmentTreeMapKey);
        if (intervalSearchTree == null) {
            intervalSearchTree = new IntervalSearchTree();
        }
        return intervalSearchTree;
    }

    private String getAppointmentTreeMapKey(ZonedDateTime appointmentStart) {
        int requestedDay = appointmentStart.getDayOfMonth();
        int requestedMonth = appointmentStart.getMonth()
                                             .getValue();
        int requestedYear = appointmentStart.getYear();
        return requestedYear + "-" + requestedMonth + "-" + requestedDay;
    }
}
