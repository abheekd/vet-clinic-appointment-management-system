package craft.app.entity.pet;

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
@Table(name = "pet")
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false) private String  name;
    @Column(nullable = false) private String  ownerFirstName;
    @Column(nullable = false) private String  ownerLastName;
    @Column(nullable = false) private Long    ownerPhoneNo;
    @Column(nullable = false) private String  ownerEmailId;
}
