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
import lombok.extern.slf4j.Slf4j;
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

import static craft.app.utils.ValidatorUtils.validateAppointmentDayOfWeek;
import static craft.app.utils.ValidatorUtils.validateAppointmentDuration;
import static craft.app.utils.ValidatorUtils.validateAppointmentHourOfDay;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(
        path = "/api/v1/appointment",
        produces = {APPLICATION_JSON_VALUE}
)
@Slf4j
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

    /**
     * Scheduled job to repopulate the IntervalSearchTrees
     */
    //@Scheduled(cron = "0 0/1 * 1/1 * ? *")
    @Scheduled(fixedDelay = 60000)
    private void initializeDaliyIntervalSearchTrees() {
        Set<Appointment> allAppointments = appointmentRepository.findAllByScheduledAndCompletedOrderByIdAsc(true,
                                                                                                            false);
        allAppointments.forEach(appointment -> {
            Integer       vetId                = appointment.getVetId();
            ZonedDateTime appointmentStartDate = appointment.getStart();
            ZonedDateTime appointmentEndDate   = appointment.getEnd();

            updateIntervalSearchTree(vetId, appointmentStartDate, appointmentEndDate);
        });
        log.info("dailyAppointmentTreeMap refreshed : {}", dailyAppointmentTreeMap);
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
        return appointmentDetailsRepository.findAllByScheduledAndStartBetweenOrderByIdAsc(true, startDate, endDate);
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
        appointmentStart = appointmentStart.withZoneSameInstant(ZoneId.of(appointment.getTimeZone()));


        ZonedDateTime appointmentEnd   = appointment.getEnd();
        appointmentEnd = appointmentEnd.withZoneSameInstant(ZoneId.of(appointment.getTimeZone()));

        validateVet(appointment);
        validatePet(appointment);
        Integer vetId = appointment.getVetId();

        AppointmentDetails response = null;
        if (isValidateAppointmentSlot(vetId, appointmentStart, appointmentEnd)) {

            appointment.setScheduled(true);
            Appointment savedAppointment = appointmentRepository.save(appointment);

            Optional<AppointmentDetails> optionalAppointmentDetails = appointmentDetailsRepository.findById(savedAppointment.getId());
            if (optionalAppointmentDetails.isPresent()) {
                response = optionalAppointmentDetails.get();
                updateIntervalSearchTree(vetId, appointmentStart, appointmentEnd);
            }

        }

        return response;
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

    private boolean isValidateAppointmentSlot(Integer vetId, ZonedDateTime appointmentStart, ZonedDateTime appointmentEnd) {
        Duration requestedAppointmentDuration = Duration.between(appointmentStart, appointmentEnd);

        boolean isValid = validateAppointmentHourOfDay(appointmentStart, appointmentEnd);
        isValid = isValid && validateAppointmentDayOfWeek(appointmentStart);
        isValid = isValid && validateAppointmentOverlap(vetId, appointmentStart, appointmentEnd);

        //isValid = isValid && validateAppointmentDuration(requestedAppointmentDuration);
        return isValid;
    }

    private boolean validateAppointmentOverlap(Integer vetId, ZonedDateTime appointmentStart, ZonedDateTime appointmentEnd) {
        IntervalSearchTree intervalSearchTree = getIntervalSearchTree(vetId, appointmentStart);
        if (intervalSearchTree.overlap(appointmentStart.getLong(ChronoField.INSTANT_SECONDS), appointmentEnd.getLong(ChronoField.INSTANT_SECONDS))) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Overlap detected for the requested appointment slot");
        } else {
            return true;
        }
    }

    private void updateIntervalSearchTree(Integer vetId, ZonedDateTime appointmentStart, ZonedDateTime appointmentEnd) {
        IntervalSearchTree intervalSearchTree    = getIntervalSearchTree(vetId, appointmentStart);
        String             appointmentTreeMapKey = getAppointmentTreeMapKey(vetId, appointmentStart);
        intervalSearchTree.add(appointmentStart.getLong(ChronoField.INSTANT_SECONDS), appointmentEnd.getLong(ChronoField.INSTANT_SECONDS));
        dailyAppointmentTreeMap.put(appointmentTreeMapKey, intervalSearchTree);
    }

    private IntervalSearchTree getIntervalSearchTree(Integer vetId, ZonedDateTime appointmentStart) {
        String             appointmentTreeMapKey = getAppointmentTreeMapKey(vetId, appointmentStart);
        IntervalSearchTree intervalSearchTree    = dailyAppointmentTreeMap.get(appointmentTreeMapKey);
        if (intervalSearchTree == null) {
            intervalSearchTree = new IntervalSearchTree();
        }
        return intervalSearchTree;
    }

    private String getAppointmentTreeMapKey(Integer vetId, ZonedDateTime appointmentStart) {
        int requestedDay = appointmentStart.getDayOfMonth();
        int requestedMonth = appointmentStart.getMonth()
                                             .getValue();
        int requestedYear = appointmentStart.getYear();
        return vetId + "-" + requestedYear + "-" + requestedMonth + "-" + requestedDay;
    }
}
