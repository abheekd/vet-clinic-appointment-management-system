package craft.app.entity.vet.repo;

import craft.app.entity.vet.VetDetails;
import org.springframework.data.repository.CrudRepository;

import java.util.Set;

public interface VetDetailsRepository extends CrudRepository<VetDetails, Integer> {
    public Set<VetDetails> findAllByOrderByIdAsc();
}
