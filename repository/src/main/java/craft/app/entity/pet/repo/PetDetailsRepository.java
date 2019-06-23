package craft.app.entity.pet.repo;

import craft.app.entity.pet.PetDetails;
import org.springframework.data.repository.CrudRepository;

import java.util.Set;

public interface PetDetailsRepository extends CrudRepository<PetDetails, Integer> {
    public Set<PetDetails> findAllByOrderByIdAsc();
}
