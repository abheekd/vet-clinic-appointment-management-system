package craft.app.entity.vet.repo;

import craft.app.entity.vet.Vet;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface VetRepository extends CrudRepository<Vet, Integer> {
    public List<Vet> findAllByOrderByIdAsc();
}
