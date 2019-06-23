package craft.app.entity.pet.repo;

import craft.app.entity.pet.Pet;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface PetRepository extends CrudRepository<Pet, Integer> {
    public List<Pet> findAllByOrderByIdAsc();
}
