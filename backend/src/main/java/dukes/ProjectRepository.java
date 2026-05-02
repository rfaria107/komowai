package dukes;

import jakarta.data.repository.By;
import jakarta.data.repository.DataRepository;
import jakarta.data.repository.Find;
import jakarta.data.repository.Repository;
import java.util.List;

@Repository
public interface ProjectRepository extends DataRepository<Project, Long> {
    @Find
    List<Project> findByUserProfile(@By("userProfile") UserProfile profile);
}
