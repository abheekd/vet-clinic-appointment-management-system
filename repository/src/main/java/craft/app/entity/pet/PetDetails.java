package craft.app.entity.pet;

import craft.app.entity.appointment.Appointment;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "pet")
public class PetDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String  name;
    private String  ownerFirstName;
    private String  ownerLastName;
    private Long    ownerPhoneNo;
    private String  ownerEmailId;

    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "pet_id", foreignKey = @ForeignKey(name = "FK_APPOINTMENT_PET_ID"))
    private List<Appointment> appointments;
}
