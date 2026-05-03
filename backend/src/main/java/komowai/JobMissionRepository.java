package komowai;

import jakarta.data.repository.By;
import jakarta.data.repository.DataRepository;
import jakarta.data.repository.Delete;
import jakarta.data.repository.Find;
import jakarta.data.repository.Repository;
import jakarta.data.repository.Save;
import java.util.List;
import java.util.Optional;

@Repository
public interface JobMissionRepository extends DataRepository<JobMission, Long> {

    @Save
    JobMission save(JobMission mission);

    @Find
    List<JobMission> findAll();

    @Find
    Optional<JobMission> findByUrl(@By("url") String url);

    @Find
    Optional<JobMission> findById(@By("id") Long id);

    @Delete
    void delete(JobMission mission);

    @Delete
    void deleteAll(List<JobMission> missions);
}
