package craft.app.entity.vet;

import craft.app.entity.appointment.Appointment;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
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

    @Column(nullable = false) private String firstName;
    @Column(nullable = false) private String lastName;
    @Column(nullable = false) private Long   phoneNo;
    @Column(nullable = false) private String emailId;

    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "vet_id", foreignKey = @ForeignKey(name = "FK_APPOINTMENT_VET_ID"), insertable = false, updatable = false, nullable = false)
    private List<Appointment> appointments;
}
