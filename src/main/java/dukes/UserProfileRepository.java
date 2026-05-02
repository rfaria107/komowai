package dukes;

import jakarta.data.repository.By;
import jakarta.data.repository.DataRepository;
import jakarta.data.repository.Find;
import jakarta.data.repository.Repository;
import jakarta.data.repository.Save;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserProfileRepository extends DataRepository<UserProfile, Long> {

    @Save
    UserProfile save(UserProfile profile);

    @Find
    Optional<UserProfile> findById(@By("id") Long id);

    @Find
    List<UserProfile> findAll();
}
