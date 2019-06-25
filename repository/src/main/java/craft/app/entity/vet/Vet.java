package craft.app.entity.vet;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Setter
@Getter
@Entity
@Table(name = "vet")
public class Vet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false) private String firstName;
    @Column(nullable = false) private String lastName;
    @Column(nullable = false) private Long   phoneNo;
    @Column(nullable = false) private String emailId;
}
