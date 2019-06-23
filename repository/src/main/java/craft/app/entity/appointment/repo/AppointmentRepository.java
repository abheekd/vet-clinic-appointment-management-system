package craft.app.entity.appointment.repo;

import craft.app.entity.appointment.Appointment;
import org.springframework.data.repository.CrudRepository;

import java.time.ZonedDateTime;
import java.util.Set;

public interface AppointmentRepository extends CrudRepository<Appointment, Integer> {
    public Set<Appointment> findAllByStartBetweenOrderByIdAsc(ZonedDateTime startDate, ZonedDateTime endDate);
}
