

import "./App.css";
import Navbar from "./components/Navbar";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import {
  getPortfolioContent,
  submitContactMessage,
  type PortfolioContent,
  type Project,
  type PortfolioDocument,
} from "./api";

type DocumentType = "resume" | "degree" | "medical" | null;
type Theme = "dark" | "light";

type DocumentDetails = {
  title: string;
  file: string;
  downloadName: string;
  type: "pdf" | "image";
};

type ProjectDetails = {
  title: string;
  icon: string;
  image: string;
  description: string;
  technologies: string[];
  features: string[];
  liveUrl: string;
  githubUrl: string;
};

function App() {
  /* =========================================
     COMPLETE PORTFOLIO BACKEND CONNECTION
  ========================================= */

  const [portfolioData, setPortfolioData] =
    useState<PortfolioContent | null>(null);

  const [isPortfolioLoading, setIsPortfolioLoading] =
    useState(true);

  const [portfolioError, setPortfolioError] =
    useState("");

  useEffect(() => {
    const fetchPortfolioContent = async () => {
      try {
        setIsPortfolioLoading(true);
        setPortfolioError("");

        const data = await getPortfolioContent();
        setPortfolioData(data);
      } catch (error) {
        console.error("Portfolio API Error:", error);

        setPortfolioError(
          "Unable to load portfolio content. Please check whether the Django backend is running."
        );
      } finally {
        setIsPortfolioLoading(false);
      }
    };

    fetchPortfolioContent();
  }, []);

  // All portfolio content from Django
  const profile = portfolioData?.profile;
  const about = portfolioData?.about;
  const projects = portfolioData?.projects ?? [];
  const skills = portfolioData?.skills ?? [];
  const experiences = portfolioData?.experiences ?? [];
  const education = portfolioData?.education ?? [];
  const documents = portfolioData?.documents ?? [];
  const services = portfolioData?.services ?? [];

  /* =========================================
     THEME
  ========================================= */

  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("portfolio-theme");
    return savedTheme === "light" ? "light" : "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark"
    );
  };

  /* =========================================
     ABOUT ME VOICE
  ========================================= */

  const aboutAudioRef = useRef<HTMLAudioElement | null>(null);

  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [isVoicePaused, setIsVoicePaused] = useState(false);

  const playAboutVoice = () => {
    const audio = aboutAudioRef.current;
    if (!audio) return;

    if (audio.ended) {
      audio.currentTime = 0;
    }

    audio
      .play()
      .then(() => {
        setIsVoicePlaying(true);
        setIsVoicePaused(false);
      })
      .catch((error) => {
        console.error("Voice playback error:", error);
        alert("Unable to play the voice recording.");
      });
  };

  const pauseAboutVoice = () => {
    const audio = aboutAudioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      setIsVoicePlaying(true);
      setIsVoicePaused(true);
    }
  };

  const stopAboutVoice = () => {
    const audio = aboutAudioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setIsVoicePlaying(false);
    setIsVoicePaused(false);
  };

  const handleAboutVoiceEnded = () => {
    setIsVoicePlaying(false);
    setIsVoicePaused(false);
  };

  /* =========================================
     DOCUMENTS
     DJANGO BACKEND CONNECTION
  ========================================= */

  const [activeDocument, setActiveDocument] =
    useState<DocumentType>(null);

  const getDocument = (
    documentType: DocumentType
  ): PortfolioDocument | undefined => {
    if (!documentType) return undefined;

    return documents.find(
      (document) => document.document_type === documentType
    );
  };

  const openDocument = (documentType: DocumentType) => {
    stopAboutVoice();
    setActiveDocument(documentType);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const closeDocument = () => {
    stopAboutVoice();
    setActiveDocument(null);

    setTimeout(() => {
      document.getElementById("documents")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  };

  const activeDocumentData = getDocument(activeDocument);

  const documentDetails: DocumentDetails | null =
    activeDocumentData?.file
      ? {
          title: activeDocumentData.title,
          file: activeDocumentData.file,
          downloadName: activeDocumentData.download_name,
          type:
            activeDocumentData.file_type === "pdf"
              ? "pdf"
              : "image",
        }
      : null;

  const resumeDocument = getDocument("resume");

  /* =========================================
     PROJECTS
     DJANGO BACKEND CONNECTION
  ========================================= */

  const [activeProject, setActiveProject] =
    useState<Project | null>(null);

  const [currentProjectIndex, setCurrentProjectIndex] =
    useState(0);

  const goToPreviousProject = () => {
    setCurrentProjectIndex((current) =>
      current === 0 ? projects.length - 1 : current - 1
    );
  };

  const goToNextProject = () => {
    setCurrentProjectIndex((current) =>
      current === projects.length - 1 ? 0 : current + 1
    );
  };

  // Automatically change the gallery image every 3 seconds.
  useEffect(() => {
    if (projects.length <= 1 || activeProject) return;

    const sliderInterval = window.setInterval(() => {
      setCurrentProjectIndex((current) =>
        current === projects.length - 1 ? 0 : current + 1
      );
    }, 3000);

    return () => window.clearInterval(sliderInterval);
  }, [projects.length, activeProject]);

  // Keep selected index valid.
  useEffect(() => {
    if (currentProjectIndex >= projects.length) {
      setCurrentProjectIndex(0);
    }
  }, [projects.length, currentProjectIndex]);

  const openProject = (project: Project) => {
    stopAboutVoice();
    setActiveProject(project);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const closeProject = () => {
    stopAboutVoice();
    setActiveProject(null);

    setTimeout(() => {
      document.getElementById("projects")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  };

  const getProjectIcon = (project: Project) => {
    return project.icon || "bi-code-slash";
  };

  const getProjectImage = (project: Project) => {
    return project.image || "/pro.png";
  };

  const projectDetails: ProjectDetails | null = activeProject
    ? {
        title: activeProject.title,
        icon: getProjectIcon(activeProject),
        image: getProjectImage(activeProject),
        description: activeProject.description,
        technologies: activeProject.technologies
          .split(",")
          .map((technology) => technology.trim())
          .filter(Boolean),
        features: activeProject.features || [],
        liveUrl:
          activeProject.live_url ||
          activeProject.github_url ||
          "",
        githubUrl: activeProject.github_url || "",
      }
    : null;

  /* =========================================
     SKILLS
     DJANGO BACKEND CONNECTION
  ========================================= */

  const getSkillsByCategory = (category: string) => {
    return skills.filter(
      (skill) => skill.category === category
    );
  };

  const getSkillIcon = (
    icon: string | null | undefined,
    fallback: string
  ) => {
    if (!icon) return `bi ${fallback}`;

    return icon.startsWith("bi ")
      ? icon
      : `bi ${icon}`;
  };

  /* =========================================
     CONTACT FORM
     DJANGO BACKEND CONNECTION
  ========================================= */

  const handleContactSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !email || !subject || !message) {
      alert("Please fill in all the fields.");
      return;
    }

    try {
      const responseData = await submitContactMessage({
        name,
        email,
        subject,
        message,
      });

      if (responseData?.email_sent === true) {
        form.reset();

        alert(
          "Thank you! Your message has been sent successfully. I will get back to you soon."
        );

        return;
      }

      if (responseData?.email_sent === false) {
        alert(
          "Your message was saved, but email delivery failed. Please try again later."
        );

        return;
      }

      form.reset();
      alert("Your message has been submitted successfully.");
    } catch (error) {
      console.error("Contact Submission Error:", error);

      alert(
        "Unable to send your message. Please check your connection and try again."
      );
    }
  };

  /* =========================================
     COMMON LOADING / ERROR
  ========================================= */

  if (isPortfolioLoading) {
    return (
      <div
        className={`portfolio ${
          theme === "light" ? "light-theme" : "dark-theme"
        }`}
      >
        <div className="aurora aurora-one"></div>
        <div className="aurora aurora-two"></div>
        <div className="aurora aurora-three"></div>
        <div className="background-grid"></div>

        <div className="projects-status">
          Loading portfolio...
        </div>
      </div>
    );
  }

  if (portfolioError) {
    return (
      <div
        className={`portfolio ${
          theme === "light" ? "light-theme" : "dark-theme"
        }`}
      >
        <div className="aurora aurora-one"></div>
        <div className="aurora aurora-two"></div>
        <div className="aurora aurora-three"></div>
        <div className="background-grid"></div>

        <div className="projects-status">
          {portfolioError}
        </div>
      </div>
    );
  }

  /* =========================================
     DOCUMENT VIEWER
  ========================================= */

  if (activeDocument && documentDetails) {
    return (
      <div
        className={`portfolio ${
          theme === "light" ? "light-theme" : "dark-theme"
        }`}
      >
        <div className="aurora aurora-one"></div>
        <div className="aurora aurora-two"></div>
        <div className="aurora aurora-three"></div>
        <div className="background-grid"></div>

        <div className="document-viewer">
          <div className="document-viewer-header">
            <button
              className="back-document-btn"
              onClick={closeDocument}
            >
              <i className="bi bi-arrow-left"></i>
              Back to Portfolio
            </button>

            <div className="document-viewer-title">
              {documentDetails.title}
            </div>

            <a
              className="viewer-download-btn"
              href={documentDetails.file}
              download={documentDetails.downloadName}
            >
              <i className="bi bi-download"></i>
              Download
            </a>
          </div>

          <div className="document-viewer-content">
            {documentDetails.type === "pdf" ? (
              <iframe
                src={documentDetails.file}
                title={documentDetails.title}
              />
            ) : (
              <img
                src={documentDetails.file}
                alt={documentDetails.title}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  /* =========================================
     PROJECT VIEWER
  ========================================= */

  if (activeProject && projectDetails) {
    return (
      <div
        className={`portfolio ${
          theme === "light" ? "light-theme" : "dark-theme"
        }`}
      >
        <div className="aurora aurora-one"></div>
        <div className="aurora aurora-two"></div>
        <div className="aurora aurora-three"></div>
        <div className="background-grid"></div>

        <div className="project-viewer">
          <div className="project-viewer-header">
            <button
              className="back-document-btn"
              onClick={closeProject}
            >
              <i className="bi bi-arrow-left"></i>
              Back to Portfolio
            </button>

            <div className="project-viewer-title">
              {projectDetails.title}
            </div>

            <a
              className="viewer-download-btn"
              href={
                projectDetails.liveUrl ||
                projectDetails.githubUrl
              }
              target="_blank"
              rel="noreferrer"
            >
              <i className="bi bi-box-arrow-up-right"></i>
              View Project
            </a>
          </div>

          <div className="project-detail-content">
            <div className="project-detail-hero">
              <div className="project-detail-image">
                <img
                  src={projectDetails.image}
                  alt={projectDetails.title}
                />
              </div>

              <div className="project-detail-info">
                <div className="project-detail-icon">
                  <i className={`bi ${projectDetails.icon}`}></i>
                </div>

                <span className="detail-label">
                  FEATURED PROJECT
                </span>

                <h1>{projectDetails.title}</h1>
                <p>{projectDetails.description}</p>

                <a
                  className="primary-btn"
                  href={
                    projectDetails.liveUrl ||
                    projectDetails.githubUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  View Project
                  <i className="bi bi-arrow-up-right"></i>
                </a>
              </div>
            </div>

            <div className="project-detail-grid">
              <div className="detail-card">
                <div className="detail-card-heading">
                  <i className="bi bi-code-slash"></i>
                  <h3>Technologies</h3>
                </div>

                <div className="technology-list">
                  {projectDetails.technologies.map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>
              </div>

              <div className="detail-card">
                <div className="detail-card-heading">
                  <i className="bi bi-stars"></i>
                  <h3>Key Features</h3>
                </div>

                <ul className="feature-list">
                  {projectDetails.features.map((feature) => (
                    <li key={feature}>
                      <i className="bi bi-check-circle-fill"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="project-detail-actions">
              <button
                className="secondary-btn"
                onClick={closeProject}
              >
                <i className="bi bi-arrow-left"></i>
                Back
              </button>

              <a
                className="primary-btn"
                href={
                  projectDetails.liveUrl ||
                  projectDetails.githubUrl
                }
                target="_blank"
                rel="noreferrer"
              >
                View Project
                <i className="bi bi-arrow-up-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================
     MAIN PORTFOLIO
  ========================================= */

  return (
    <div
      className={`portfolio ${
        theme === "light" ? "light-theme" : "dark-theme"
      }`}
    >
      <div className="aurora aurora-one"></div>
      <div className="aurora aurora-two"></div>
      <div className="aurora aurora-three"></div>
      <div className="background-grid"></div>

      <Navbar />

      {/* THEME BUTTON */}

      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label="Toggle theme"
        title={
          theme === "dark"
            ? "Switch to Light Mode"
            : "Switch to Dark Mode"
        }
      >
        {theme === "dark" ? (
          <>
            <i className="bi bi-sun-fill"></i>
            <span>Light</span>
          </>
        ) : (
          <>
            <i className="bi bi-moon-stars-fill"></i>
            <span>Dark</span>
          </>
        )}
      </button>

      {/* =========================================
          HERO
      ========================================= */}

      <section className="hero section" id="home">
        <div className="hero-content">
          <div className="availability">
            <span className="availability-dot"></span>
            {profile?.availability_text}
          </div>

          <p className="hero-small-title">
            {profile?.greeting}
          </p>

          <h1>
            {profile?.name}
          </h1>

          <h2>{profile?.role}</h2>

          <p className="hero-description">
            {profile?.hero_description}
          </p>

          <div className="hero-buttons">
            <a href="#projects" className="primary-btn">
              View My Work
              <i className="bi bi-arrow-up-right"></i>
            </a>

            <a href="#contact" className="secondary-btn">
              Let's Connect
              <i className="bi bi-envelope"></i>
            </a>

            {resumeDocument?.file && (
              <a
                href={resumeDocument.file}
                download={resumeDocument.download_name}
                className="resume-btn"
              >
                <i className="bi bi-download"></i>
                Resume
              </a>
            )}
          </div>

          <div className="social-links">
            {profile?.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <i className="bi bi-github"></i>
              </a>
            )}

            {profile?.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <i className="bi bi-linkedin"></i>
              </a>
            )}

            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                aria-label="Email"
              >
                <i className="bi bi-envelope-fill"></i>
              </a>
            )}
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-glow"></div>

          <div className="hero-image-wrapper">
            <div className="hero-image-border"></div>

            <img
              src={profile?.profile_image || "/pro.png"}
              alt={profile?.name || "Portfolio profile"}
              className="hero-image"
            />

            <div className="floating-card floating-card-one">
              <i className="bi bi-code-slash"></i>
              <div>
                <strong>
                  {profile?.hero_card_one}
                </strong>
                <span>Developer</span>
              </div>
            </div>

            <div className="floating-card floating-card-two">
              <i className="bi bi-patch-check-fill"></i>
              <div>
                <strong>
                  {profile?.hero_card_two}
                </strong>
                <span>Professional</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          ABOUT
      ========================================= */}

      <section className="section about-section" id="about">
        <div className="section-heading">
          <span>01</span>
          <div>
            <p>ABOUT ME</p>
            <h2>
              {about?.heading || "About Me"}
            </h2>
          </div>
        </div>

        <div className="about-grid">
          <div className="about-text">
            {(about?.paragraphs || []).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}

            <div className="voice-card">
              <audio
                ref={aboutAudioRef}
                src={about?.voice_audio || undefined}
                onEnded={handleAboutVoiceEnded}
              />

              <div className="voice-icon">
                <i className="bi bi-mic-fill"></i>
              </div>

              <div className="voice-content">
                <span>{about?.voice_label}</span>
                <br />
                <strong>{about?.voice_title}</strong>
              </div>

              <div className="voice-controls">
                <button
                  onClick={playAboutVoice}
                  title="Play"
                  className={
                    isVoicePlaying && !isVoicePaused ? "active" : ""
                  }
                  disabled={!about?.voice_audio}
                >
                  <i className="bi bi-play-fill"></i>
                </button>

                <button
                  onClick={pauseAboutVoice}
                  title="Pause"
                  className={isVoicePaused ? "active" : ""}
                  disabled={!about?.voice_audio}
                >
                  <i className="bi bi-pause-fill"></i>
                </button>

                <button
                  onClick={stopAboutVoice}
                  title="Stop"
                  disabled={!about?.voice_audio}
                >
                  <i className="bi bi-stop-fill"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="about-card">
            <div className="about-card-top">
              <span>WHAT I BRING</span>
              <i className="bi bi-stars"></i>
            </div>

            <div className="about-tags">
              {(about?.tags || []).map((tag, index) => (
                <span key={index}>{tag}</span>
              ))}
            </div>

            <div className="about-highlight">
              <i className="bi bi-lightbulb-fill"></i>
              <div>
                <strong>{about?.learning_heading}</strong>
                <p>{about?.learning_text}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          SKILLS
      ========================================= */}

      <section className="section" id="skills">
        <div className="section-heading">
          <span>02</span>
          <div>
            <p>MY SKILLS</p>
            <h2>
              Skills that turn ideas
              <br />
              into experiences.
            </h2>
          </div>
        </div>

        <div className="skills-grid">
          {/* FRONTEND */}

          <div className="skill-card">
            <div className="skill-card-header">
              <div className="skill-main-icon">
                <i className="bi bi-code-square"></i>
              </div>
              <div>
                <span>01 / FRONTEND</span>
                <h3>Frontend Development</h3>
              </div>
            </div>

            <div className="skill-bars">
              {getSkillsByCategory("Frontend").map((skill) => {
                const proficiency = Math.min(
                  100,
                  Math.max(0, skill.proficiency)
                );

                return (
                  <div className="skill-item" key={skill.id}>
                    <div>
                      <span>{skill.name}</span>
                      <b>{proficiency}%</b>
                    </div>

                    <div className="skill-track">
                      <span
                        style={{
                          width: `${proficiency}%`,
                        }}
                      ></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BACKEND */}

          <div className="skill-card">
            <div className="skill-card-header">
              <div className="skill-main-icon">
                <i className="bi bi-server"></i>
              </div>
              <div>
                <span>02 / BACKEND</span>
                <h3>Backend Development</h3>
              </div>
            </div>

            <div className="tools-grid">
              {getSkillsByCategory("Backend").map((skill) => (
                <div key={skill.id}>
                  <i className={getSkillIcon(skill.icon, "bi-code-slash")}></i>
                  <span>{skill.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DATABASE */}

          <div className="skill-card">
            <div className="skill-card-header">
              <div className="skill-main-icon">
                <i className="bi bi-database-fill"></i>
              </div>
              <div>
                <span>03 / DATABASE</span>
                <h3>Database Management</h3>
              </div>
            </div>

            <div className="tools-grid">
              {getSkillsByCategory("Database").map((skill) => (
                <div key={skill.id}>
                  <i className={getSkillIcon(skill.icon, "bi-database")}></i>
                  <span>{skill.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI AND MACHINE LEARNING */}

          <div className="skill-card">
            <div className="skill-card-header">
              <div className="skill-main-icon">
                <i className="bi bi-robot"></i>
              </div>
              <div>
                <span>04 / AI &amp; MACHINE LEARNING</span>
                <h3>AI &amp; GenAI Technologies</h3>
              </div>
            </div>

            <div className="tools-grid">
              {getSkillsByCategory("AI & Machine Learning").map(
                (skill) => (
                  <div key={skill.id}>
                    <i className={getSkillIcon(skill.icon, "bi-cpu")}></i>
                    <span>{skill.name}</span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* TOOLS AND DEPLOYMENT */}

          <div className="skill-card">
            <div className="skill-card-header">
              <div className="skill-main-icon">
                <i className="bi bi-cloud-arrow-up"></i>
              </div>
              <div>
                <span>05 / TOOLS &amp; DEPLOYMENT</span>
                <h3>Tools &amp; Technologies</h3>
              </div>
            </div>

            <div className="tools-grid">
              {getSkillsByCategory("Tools & Deployment").map(
                (skill) => (
                  <div key={skill.id}>
                    <i className={getSkillIcon(skill.icon, "bi-code-slash")}></i>
                    <span>{skill.name}</span>
                  </div>
                )
              )}
            </div>

            <div className="learning-box">
              <i className="bi bi-mortarboard-fill"></i>
              <div>
                <span>CURRENTLY LEARNING</span>
                <br />
                <strong>
                  {about?.learning_text}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          PROJECTS
      ========================================= */}

      <section className="section" id="projects">
        <div className="section-heading">
          <span>03</span>
          <div>
            <p>MY PROJECTS</p>
            <h2>
              Selected work &amp;
              <br />
              creative builds.
            </h2>
          </div>
        </div>

        <div className="project-carousel">
          {projects.length === 0 && (
            <p className="projects-status">
              No projects available yet.
            </p>
          )}

          {projects.length > 0 && (
            <>
              <div
                className="project-cards-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "28px",
                  width: "100%",
                  alignItems: "stretch",
                }}
              >
                {projects.map((project, index) => (
                  <div className="project-card" key={project.id}>
                    <span className="project-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="project-image">
                      <img
                        src={getProjectImage(project)}
                        alt={`${project.title} project`}
                      />
                    </div>

                    <div className="project-icon">
                      <i className={`bi ${getProjectIcon(project)}`}></i>
                    </div>

                    <h3>{project.title}</h3>
                    <p>{project.description}</p>

                    <div className="project-tech">
                      {project.technologies
                        .split(",")
                        .map((technology) => technology.trim())
                        .filter(Boolean)
                        .map((technology) => (
                          <span key={technology}>{technology}</span>
                        ))}
                    </div>

                    <button
                      className="project-link"
                      onClick={() => openProject(project)}
                    >
                      View Project
                      <i className="bi bi-arrow-up-right"></i>
                    </button>
                  </div>
                ))}
              </div>

              {/* PROJECT IMAGE SLIDER */}

              <div
                className="project-image-gallery"
                style={{
                  width: "100%",
                  margin: "70px auto 0",
                  textAlign: "center",
                }}
              >
                <div style={{ marginBottom: "24px" }}>
                  <span
                    style={{
                      display: "block",
                      color: "#a78bfa",
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "3px",
                      marginBottom: "10px",
                    }}
                  >
                    PROJECT GALLERY
                  </span>

                  <h3
                    style={{
                      fontSize: "25px",
                      fontWeight: 700,
                    }}
                  >
                    A glimpse of my work
                  </h3>
                </div>

                <div
                  className="project-image-gallery-stage"
                  style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "1050px",
                    height: "440px",
                    margin: "0 auto",
                    overflow: "hidden",
                    borderRadius: "22px",
                    background: "rgba(255,255,255,0.04)",
                  }}
                >
                  <img
                    key={projects[currentProjectIndex].id}
                    src={getProjectImage(projects[currentProjectIndex])}
                    alt={`${projects[currentProjectIndex].title} project preview`}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      borderRadius: "22px",
                      animation: "projectImageFade 0.6s ease",
                    }}
                  />

                  <button
                    type="button"
                    className="project-slider-arrow"
                    onClick={goToPreviousProject}
                    aria-label="Previous project image"
                    title="Previous image"
                    style={{
                      position: "absolute",
                      left: "18px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 2,
                    }}
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>

                  <button
                    type="button"
                    className="project-slider-arrow"
                    onClick={goToNextProject}
                    aria-label="Next project image"
                    title="Next image"
                    style={{
                      position: "absolute",
                      right: "18px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 2,
                    }}
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>

                <div
                  className="project-slider-dots"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "9px",
                    marginTop: "22px",
                  }}
                >
                  {projects.map((project, index) => (
                    <button
                      type="button"
                      key={project.id}
                      className={`project-slider-dot ${
                        index === currentProjectIndex ? "active" : ""
                      }`}
                      onClick={() => setCurrentProjectIndex(index)}
                      aria-label={`Show image ${index + 1}`}
                      title={`Project image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* =========================================
          EXPERIENCE
      ========================================= */}

      <section className="section" id="experience">
        <div className="section-heading">
          <span>04</span>
          <div>
            <p>EXPERIENCE</p>
            <h2>
              Experience that
              <br />
              shapes my approach.
            </h2>
          </div>
        </div>

        <div className="timeline">
          {experiences.map((experience, index) => (
            <div className="timeline-item" key={experience.id}>
              <div className="timeline-dot">
                <i
                  className={
                    index === 0
                      ? "bi bi-briefcase-fill"
                      : "bi bi-code-square"
                  }
                ></i>
              </div>

              <div className="timeline-card">
                <span>{experience.section_label}</span>
                <h3>{experience.title}</h3>
                <h4>{experience.organization}</h4>
                <p>{experience.description}</p>
                {experience.period && (
                  <small>{experience.period}</small>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================
          EDUCATION
      ========================================= */}

      <section className="section" id="education">
        <div className="section-heading">
          <span>05</span>
          <div>
            <p>EDUCATION &amp; LEARNING</p>
            <h2>
              My educational
              <br />
              background.
            </h2>
          </div>
        </div>

        <div className="education-grid">
          {education.map((item) => (
            <div className="education-card" key={item.id}>
              <div className="education-icon">
                <i className={`bi ${item.icon || "bi-mortarboard-fill"}`}></i>
              </div>

              <span>{item.category}</span>
              <h3>{item.title}</h3>
              <p>{item.institution}</p>
              <small>{item.year}</small>

              {item.details && (
                <small>{item.details}</small>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* =========================================
          DOCUMENTS
      ========================================= */}

      <section className="section" id="documents">
        <div className="section-heading">
          <span>06</span>
          <div>
            <p>MY DOCUMENTS</p>
            <h2>
              Certificates &amp;
              <br />
              Resume
            </h2>
          </div>
        </div>

        <div className="documents-grid">
          {documents.map((item) => (
            <div className="document-card" key={item.id}>
              <div className="document-image">
                {item.preview_image && (
                  <img
                    src={item.preview_image}
                    alt={item.title}
                  />
                )}
              </div>

              <div className="document-content">
                <div className="document-icon">
                  <i
                    className={
                      item.document_type === "resume"
                        ? "bi bi-file-person"
                        : item.document_type === "degree"
                        ? "bi bi-mortarboard-fill"
                        : "bi bi-heart-pulse-fill"
                    }
                  ></i>
                </div>

                <h3>{item.title}</h3>
                <p>{item.description}</p>

                <button
                  className="document-btn"
                  onClick={() => openDocument(item.document_type)}
                  disabled={!item.file}
                >
                  <i className="bi bi-eye"></i>
                  View {item.document_type === "resume" ? "Resume" : "Certificate"}
                </button>

                {item.file && (
                  <a
                    className="document-download-btn"
                    href={item.file}
                    download={item.download_name}
                  >
                    <i className="bi bi-download"></i>
                    Download
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================
          SERVICES
      ========================================= */}

      <section className="section" id="services">
        <div className="section-heading">
          <span>07</span>
          <div>
            <p>WHAT I DO</p>
            <h2>
              Services I can
              <br />
              contribute to.
            </h2>
          </div>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div className="service-card" key={service.id}>
              <div className="service-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <i className={`bi ${service.icon || "bi-code-square"}`}></i>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================
          CONTACT
      ========================================= */}

      <section className="section contact-section" id="contact">
        <div className="section-heading">
          <span>08</span>
          <div>
            <p>GET IN TOUCH</p>
            <h2>
              Let's build something
              <br />
              meaningful together.
            </h2>
          </div>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <p className="contact-intro">
              {profile?.contact_intro}
            </p>

            {profile?.email && (
              <div className="contact-item">
                <div>
                  <i className="bi bi-envelope-fill"></i>
                </div>
                <section>
                  <span>EMAIL</span>
                  <br />
                  <a href={`mailto:${profile.email}`}>
                    {profile.email}
                  </a>
                </section>
              </div>
            )}

            {profile?.phone && (
              <div className="contact-item">
                <div>
                  <i className="bi bi-telephone-fill"></i>
                </div>
                <section>
                  <span>PHONE</span>
                  <br />
                  <a href={`tel:${profile.phone.replace(/\s/g, "")}`}>
                    {profile.phone}
                  </a>
                </section>
              </div>
            )}

            {profile?.location && (
              <div className="contact-item">
                <div>
                  <i className="bi bi-geo-alt-fill"></i>
                </div>
                <section>
                  <span>LOCATION</span>
                  <p>{profile.location}</p>
                </section>
              </div>
            )}
          </div>

          <form
            className="contact-form"
            onSubmit={handleContactSubmit}
          >
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">YOUR NAME</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">EMAIL ADDRESS</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">SUBJECT</label>
              <input
                id="subject"
                name="subject"
                type="text"
                placeholder="What would you like to discuss?"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">MESSAGE</label>
              <textarea
                id="message"
                name="message"
                rows={6}
                placeholder="Tell me about your project or opportunity..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="submit-btn"
            >
              Send Message
              <i className="bi bi-arrow-up-right"></i>
            </button>
          </form>
        </div>
      </section>

      {/* =========================================
          FOOTER
      ========================================= */}

      <footer className="footer">
        <div className="footer-main">
          <div className="footer-brand">
            <h3>
              {profile?.footer_brand || profile?.name}
            </h3>
            <p>{profile?.footer_description}</p>
          </div>

          <div className="footer-links">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="footer-social">
            {profile?.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <i className="fab fa-github"></i>
              </a>
            )}

            {profile?.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            )}

            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                aria-label="Email"
              >
                <i className="bi bi-envelope-fill"></i>
              </a>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            {profile?.copyright_text}
          </span>
          <span>
            {profile?.footer_credit}
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
