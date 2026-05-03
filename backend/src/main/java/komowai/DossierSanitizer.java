package komowai;

import java.util.List;

public class DossierSanitizer {

    /**
     * ULTRA-STRICT SANITIZER (ASCII ONLY)
     * Strips all non-standard characters to prevent Liberty CWWKD0203E rollbacks.
     */
    public static String sanitize(String input) {
        if (input == null) return null;
        
        StringBuilder sb = new StringBuilder(input.length());
        
        for (int i = 0; i < input.length(); i++) {
            char c = input.charAt(i);
            
            // Allow only Basic Whitespace and Printable ASCII (32-126)
            if (c == 9 || c == 10 || c == 13 || (c >= 32 && c <= 126)) {
                sb.append(c);
            }
            // All high-range Unicode, Accents, and Smart Quotes are DROPPED here.
        }
        
        return sb.toString();
    }

    public static void sanitizeMission(JobMission mission) {
        if (mission == null) return;
        mission.setTitle(sanitize(mission.getTitle()));
        mission.setCompany(sanitize(mission.getCompany()));
        mission.setUrl(sanitize(mission.getUrl()));
        mission.setRationale(sanitize(mission.getRationale()));
        mission.setTips(sanitize(mission.getTips()));
        mission.setCoverLetter(sanitize(mission.getCoverLetter()));
    }

    public static void sanitizeProfile(UserProfile profile) {
        if (profile == null) return;
        
        profile.setName(sanitize(profile.getName()));
        profile.setEmail(sanitize(profile.getEmail()));

        if (profile.getSkills() != null) {
            profile.getSkills().forEach(s -> {
                s.setName(sanitize(s.getName()));
                s.setLevel(sanitize(s.getLevel()));
                s.setContext(sanitize(s.getContext()));
            });
        }

        if (profile.getExperiences() != null) {
            profile.getExperiences().forEach(e -> {
                e.setTitle(sanitize(e.getTitle()));
                e.setCompany(sanitize(e.getCompany()));
                e.setDescription(sanitize(e.getDescription()));
            });
        }

        if (profile.getProjects() != null) {
            profile.getProjects().forEach(p -> {
                p.setTitle(sanitize(p.getTitle()));
                p.setDescription(sanitize(p.getDescription()));
                p.setTechnologies(sanitize(p.getTechnologies()));
            });
        }
    }
}
