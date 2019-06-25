package craft.app.entity.appointment;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.ZonedDateTime;

@Setter
@Getter
@Entity
@Table(name = "appointment")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false) private ZonedDateTime start;
    @Column(nullable = false) private ZonedDateTime end;
    @Column(nullable = false) private Boolean       deleted   = false;
    @Column(nullable = false) private Boolean       running   = false;
    @Column(nullable = false) private Boolean       completed = false;
    @Column(nullable = false) private Boolean       scheduled = false;

    @Column(name = "pet_id", nullable = false)
    private Integer petId;

    @Column(name = "vet_id", nullable = false)
    private Integer vetId;
}
