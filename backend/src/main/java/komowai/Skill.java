package komowai;

import jakarta.persistence.*;

@Entity
@Table(name = "skills")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String level;
    private String context;

    @jakarta.json.bind.annotation.JsonbTransient
    @ManyToOne
    @JoinColumn(name = "user_profile_id")
    private UserProfile userProfile;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public String getContext() { return context; }
    public void setContext(String context) { this.context = context; }

    public UserProfile getUserProfile() { return userProfile; }
    public void setUserProfile(UserProfile userProfile) { this.userProfile = userProfile; }

    @Override
    public String toString() {
        return "Skill{name='" + name + "', level='" + level + "', context='" + context + "'}";
    }
}
