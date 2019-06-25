package craft.app.entity.pet;

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
@Table(name = "pet")
public class PetDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false) private String name;
    @Column(nullable = false) private String ownerFirstName;
    @Column(nullable = false) private String ownerLastName;
    @Column(nullable = false) private Long   ownerPhoneNo;
    @Column(nullable = false) private String ownerEmailId;

    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "pet_id", foreignKey = @ForeignKey(name = "FK_APPOINTMENT_PET_ID"), insertable = false, updatable = false, nullable = false)
    private List<Appointment> appointments;
}
