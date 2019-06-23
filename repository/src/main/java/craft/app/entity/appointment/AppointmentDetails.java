package craft.app.entity.appointment;

import com.fasterxml.jackson.annotation.JsonFormat;
import craft.app.entity.pet.Pet;
import craft.app.entity.vet.Vet;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import java.time.ZonedDateTime;

@Setter
@Getter
@Entity
@Table(name = "appointment")
public class AppointmentDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer       id;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssZ")
    private ZonedDateTime start;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssZ")
    private ZonedDateTime end;

    @OneToOne
    @JoinColumn(name = "pet_id", foreignKey = @ForeignKey(name = "FK_APPOINTMENT_PET_ID"))
    private Pet pet;

    @OneToOne
    @JoinColumn(name = "vet_id", foreignKey = @ForeignKey(name = "FK_APPOINTMENT_VET_ID"))
    private Vet vet;
}
