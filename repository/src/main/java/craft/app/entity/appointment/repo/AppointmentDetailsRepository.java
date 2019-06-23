package craft.app.entity.appointment.repo;

import craft.app.entity.appointment.AppointmentDetails;
import org.springframework.data.repository.CrudRepository;

import java.time.ZonedDateTime;
import java.util.Set;

public interface AppointmentDetailsRepository extends CrudRepository<AppointmentDetails, Integer> {

    public Set<AppointmentDetails> findAllByOrderByIdAsc();

    public Set<AppointmentDetails> findAllByStartBetweenOrderByIdAsc(ZonedDateTime startDate, ZonedDateTime endDate);
}
