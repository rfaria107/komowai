package komowai;

import jakarta.data.repository.By;
import jakarta.data.repository.DataRepository;
import jakarta.data.repository.Find;
import jakarta.data.repository.Repository;
import java.util.List;

@Repository
public interface SkillRepository extends DataRepository<Skill, Long> {
    @Find
    List<Skill> findByUserProfile(@By("userProfile") UserProfile profile);

    @Find
    java.util.Optional<Skill> findById(@By("id") Long id);

    @Find
    List<Skill> findAll();
}
