package craft.app.entity.appointment.repo;

import craft.app.entity.appointment.AppointmentDetails;
import org.springframework.data.repository.CrudRepository;

import java.util.Set;

public interface AppointmentDetailsRepository extends CrudRepository<AppointmentDetails, Integer> {

    public Set<AppointmentDetails> findAllByOrderByIdDesc();
}
