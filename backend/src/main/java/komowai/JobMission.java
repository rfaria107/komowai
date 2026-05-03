package komowai;

import jakarta.persistence.*;

@Entity
@Table(name = "job_missions")
public class JobMission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String company;
    
    @Column(length = 1024)
    private String url;

    @Column(length = 16384)
    private String jobText;
    
    private int score;
    
    @Column(length = 4096)
    private String rationale;
    
    @Column(length = 4096)
    private String tips;
    
    @Column(length = 8192)
    private String coverLetter;

    private String status = "DISCOVERED"; // "DISCOVERED", "ANALYZING", "ANALYZED", "FAILED"

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getJobText() { return jobText; }
    public void setJobText(String jobText) { this.jobText = jobText; }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public String getRationale() { return rationale; }
    public void setRationale(String rationale) { this.rationale = rationale; }

    public String getTips() { return tips; }
    public void setTips(String tips) { this.tips = tips; }

    public String getCoverLetter() { return coverLetter; }
    public void setCoverLetter(String coverLetter) { this.coverLetter = coverLetter; }
    
    @Override
    public String toString() {
        return "JobMission{title='" + title + "', company='" + company + "', score=" + score + "}";
    }
}
