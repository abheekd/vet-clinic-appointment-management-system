package craft.app.controller;

import craft.app.entity.pet.Pet;
import craft.app.entity.pet.PetDetails;
import craft.app.entity.pet.repo.PetDetailsRepository;
import craft.app.entity.pet.repo.PetRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;

import java.util.Optional;
import java.util.Set;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(path = "/api/v1/pet", produces = APPLICATION_JSON_VALUE)
@AllArgsConstructor
public class PetController {

    private PetRepository        petRepository;
    private PetDetailsRepository petDetailsRepository;

    @GetMapping
    public Set<PetDetails> listAllPets() {
        return petDetailsRepository.findAllByOrderByIdAsc();
    }

    @GetMapping("{id}")
    public PetDetails getPetById(@PathVariable("id") Integer id) {
        Optional<PetDetails> pet = petDetailsRepository.findById(id);
        if (!pet.isPresent()) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Unknown PET ID");
        }

        return pet.get();
    }

    @PostMapping(consumes = APPLICATION_JSON_VALUE)
    public Pet register(@RequestBody Pet pet) {
        validatePetName(pet);
        return petRepository.save(pet);
    }

    private void validatePetName(@RequestBody Pet pet) {
        if (StringUtils.isEmpty(pet.getName())) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Pet name can not be empty.");
        }
    }
}