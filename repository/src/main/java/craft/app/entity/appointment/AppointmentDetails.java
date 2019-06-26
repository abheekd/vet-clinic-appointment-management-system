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
    private Integer id;

    @Column(nullable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssXXX")
    private ZonedDateTime start;

    @Column(nullable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssXXX")
    private ZonedDateTime end;

    @Column(nullable = false) private Boolean deleted   = false;
    @Column(nullable = false) private Boolean running   = false;
    @Column(nullable = false) private Boolean completed = false;
    @Column(nullable = false) private Boolean scheduled = false;

    @OneToOne
    @JoinColumn(name = "pet_id", foreignKey = @ForeignKey(name = "FK_APPOINTMENT_PET_ID"), nullable = false)
    private Pet pet;

    @OneToOne
    @JoinColumn(name = "vet_id", foreignKey = @ForeignKey(name = "FK_APPOINTMENT_VET_ID"), nullable = false)
    private Vet vet;
}
