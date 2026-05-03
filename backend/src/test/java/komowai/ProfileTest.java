package komowai;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class ProfileTest {

    @Test
    public void testProfileCreation() {
        UserProfile profile = new UserProfile();
        profile.setName("Duke");
        profile.setEmail("duke@jakarta.ee");

        Experience exp = new Experience();
        exp.setTitle("Java Developer");
        exp.setCompany("Oracle");
        exp.setUserProfile(profile);
        profile.getExperiences().add(exp);

        assertEquals("Duke", profile.getName());
        assertEquals(1, profile.getExperiences().size());
        assertEquals("Oracle", profile.getExperiences().get(0).getCompany());
    }
}
