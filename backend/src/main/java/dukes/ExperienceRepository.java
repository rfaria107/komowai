package dukes;

import jakarta.data.repository.By;
import jakarta.data.repository.DataRepository;
import jakarta.data.repository.Find;
import jakarta.data.repository.Repository;
import java.util.List;

@Repository
public interface ExperienceRepository extends DataRepository<Experience, Long> {
    @Find
    List<Experience> findByUserProfile(@By("userProfile") UserProfile profile);

    @Find
    List<Experience> findAll();
}
