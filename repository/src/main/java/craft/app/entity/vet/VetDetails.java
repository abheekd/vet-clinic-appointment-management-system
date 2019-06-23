package craft.app.entity.vet;

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
@Table(name = "vet")
public class VetDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String  firstName;
    private String  lastName;
    private Long    phoneNo;
    private String  emailId;

    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "vet_id", foreignKey = @ForeignKey(name = "FK_APPOINTMENT_VET_ID"))
    private List<Appointment> appointments;
}
