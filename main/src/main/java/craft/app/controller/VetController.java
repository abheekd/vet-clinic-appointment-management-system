package craft.app.controller;

import craft.app.entity.pet.repo.PetDetailsRepository;
import craft.app.entity.vet.Vet;
import craft.app.entity.vet.VetDetails;
import craft.app.entity.vet.repo.VetDetailsRepository;
import craft.app.entity.vet.repo.VetRepository;
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

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.springframework.http.MediaType.ALL_VALUE;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(path = "/api/v1/vet", produces = APPLICATION_JSON_VALUE)
@AllArgsConstructor
public class VetController {

    private VetRepository        vetRepository;
    private VetDetailsRepository vetDetailsRepository;

    @GetMapping
    public Set<VetDetails> listAllVets() {
        return vetDetailsRepository.findAllByOrderByIdAsc();
    }

    @GetMapping("{id}")
    public VetDetails getVetById(@PathVariable("id") Integer id) {
        Optional<VetDetails> vet = vetDetailsRepository.findById(id);
        if (!vet.isPresent()) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Unknown Vet ID");
        }

        return vet.get();
    }

    @PostMapping(consumes = APPLICATION_JSON_VALUE)
    public Vet register(@RequestBody Vet vet) {
        validatePetName(vet);
        return vetRepository.save(vet);
    }

    private void validatePetName(@RequestBody Vet vet) {
        if (StringUtils.isEmpty(vet.getFirstName())) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Vet first name can not be empty.");
        }

        if (StringUtils.isEmpty(vet.getLastName())) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Vet last name can not be empty.");
        }

        if (StringUtils.isEmpty(vet.getEmailId())) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Vet emailId can not be empty.");
        }

        if (StringUtils.isEmpty(vet.getPhoneNo())) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Vet phone# can not be empty.");
        }
    }
}