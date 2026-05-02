package dukes;

import java.util.List;

public class DossierSanitizer {

    /**
     * ULTRA-STRICT SANITIZER (ASCII ONLY)
     * To diagnose which character is triggering the Liberty rollback.
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
