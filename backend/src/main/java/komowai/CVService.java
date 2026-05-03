package komowai;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import java.util.concurrent.CompletableFuture;
import jakarta.annotation.Resource;
import jakarta.enterprise.concurrent.ManagedExecutorService;

@ApplicationScoped
public class CVService {

    @Inject
    private ExtractorAgent extractor;

    @Inject
    private UserProfileRepository profileRepo;

    @PersistenceContext
    private EntityManager em;

    @Resource
    private ManagedExecutorService executor;

    @Transactional
    public UserProfile processCV(String cvText) {
        UserProfile profile = extractStructuredData(cvText);
        return profileRepo.save(profile);
    }

    @Transactional
    public void deleteProfile(Long id) {
        UserProfile profile = em.find(UserProfile.class, id);
        if (profile != null) {
            em.remove(profile);
        }
    }

    public UserProfile extractStructuredData(String cvText) {
        ExtractedProfile extracted = extractor.extract(cvText);
        
        UserProfile profile = new UserProfile();
        profile.setName(extracted.name());
        profile.setEmail(extracted.email());
        
        if (extracted.skills() != null) {
            extracted.skills().forEach(s -> {
                Skill skill = new Skill();
                skill.setName(s.name());
                skill.setLevel(s.level());
                skill.setContext(s.context());
                skill.setUserProfile(profile);
                profile.getSkills().add(skill);
            });
        }
        
        if (extracted.experiences() != null) {
            extracted.experiences().forEach(e -> {
                Experience exp = new Experience();
                exp.setTitle(e.title());
                exp.setCompany(e.company());
                exp.setDescription(e.description());
                exp.setUserProfile(profile);
                profile.getExperiences().add(exp);
            });
        }
        
        if (extracted.projects() != null) {
            extracted.projects().forEach(p -> {
                Project proj = new Project();
                proj.setTitle(p.title());
                proj.setDescription(p.description());
                proj.setTechnologies(p.technologies());
                proj.setUserProfile(profile);
                profile.getProjects().add(proj);
            });
        }
        
        return profile;
    }

    public CompletableFuture<UserProfile> processCVAsync(String cvText) {
        return CompletableFuture.supplyAsync(() -> processCV(cvText), executor);
    }
}
