

import "./App.css";
import Navbar from "./components/Navbar";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { jsPDF } from "jspdf";

type DocumentType = "resume" | "degree" | "medical" | null;

type ProjectType =
  | "groco"
  | "hopehands"
  | "foodflow"
  | "photography"
  | null;

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
};

function App() {
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
     ONLY VOICE FEATURE IN THE PORTFOLIO
  ========================================= */

  const aboutAudioRef = useRef<HTMLAudioElement | null>(null);

  const [isVoicePlaying, setIsVoicePlaying] =
    useState(false);

  const [isVoicePaused, setIsVoicePaused] =
    useState(false);

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
      .catch(() => {
        alert(
          "Unable to play the voice recording. Please make sure Voice.mp3 exists inside the public folder."
        );
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
  ========================================= */

  const [activeDocument, setActiveDocument] =
    useState<DocumentType>(null);

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
      document
        .getElementById("documents")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 100);
  };

  const getDocumentDetails =
    (): DocumentDetails | null => {
      if (activeDocument === "resume") {
        return {
          title: "My Resume",
          file: "/resume.png",
          downloadName: "Asmina_Resume.png",
          type: "image",
        };
      }

      if (activeDocument === "degree") {
        return {
          title: "Degree Certificate",
          file: "/degree.png",
          downloadName: "Asmina_Degree.png",
          type: "image",
        };
      }

      if (activeDocument === "medical") {
        return {
          title: "Medical Coding Certificate",
          file: "/medical.png",
          downloadName: "Asmina_Medical_Coding.png",
          type: "image",
        };
      }

      return null;
    };

  const documentDetails = getDocumentDetails();

  /* =========================================
     PROJECTS
  ========================================= */

  const [activeProject, setActiveProject] =
    useState<ProjectType>(null);

  const openProject = (project: ProjectType) => {
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
      document
        .getElementById("projects")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 100);
  };

  const getProjectDetails =
    (): ProjectDetails | null => {
      if (activeProject === "groco") {
        return {
          title: "GroCo",
          icon: "bi-cart3",
          image: "/gro.png",
          description:
            "A modern grocery shopping website built with React and TypeScript with product browsing, cart, checkout and payment flow.",
          technologies: [
            "React",
            "TypeScript",
            "CSS",
          ],
          features: [
            "Product browsing",
            "Product categories",
            "Product details",
            "Shopping cart",
            "Quantity management",
            "Coupon functionality",
            "Checkout flow",
            "Payment flow",
            "Responsive design",
          ],
          liveUrl:
            "https://groco-mu.vercel.app",
        };
      }

      if (activeProject === "hopehands") {
        return {
          title: "HopeHands Foundation",
          icon: "bi-heart-pulse",
          image: "/char.png",
          description:
            "A charity website designed to present causes, volunteering opportunities, donations and community impact in a clean responsive interface.",
          technologies: [
            "React",
            "TypeScript",
            "CSS",
          ],
          features: [
            "Responsive charity website",
            "Causes section",
            "Donation flow",
            "Volunteer section",
            "Volunteer form",
            "Thank-you page",
            "Impact section",
            "Community stories",
          ],
          liveUrl:
            "https://charity1-one.vercel.app/",
        };
      }

      if (activeProject === "foodflow") {
        return {
          title: "FoodFlow",
          icon: "bi-phone",
          image: "/food.png",
          description:
            "A food delivery mobile application concept built with Expo and React Native with authentication, cart and checkout experiences.",
          technologies: [
            "React Native",
            "Expo",
            "JavaScript",
          ],
          features: [
            "Authentication",
            "Login and signup",
            "Food browsing",
            "Shopping cart",
            "Cart quantity management",
            "Checkout",
            "Address management",
            "Payment selection",
            "Mobile-friendly experience",
          ],
          liveUrl:
            "https://github.com/",
        };
      }

      if (activeProject === "photography") {
        return {
          title: "Photography Portfolio",
          icon: "bi-camera",
          image: "/photo.png",
          description:
            "A stylish photography portfolio website created to showcase photographs through a clean, responsive and visually engaging interface.",
          technologies: [
            "HTML",
            "CSS",
            "Bootstrap",
            "JavaScript",
          ],
          features: [
            "Responsive photography portfolio",
            "Modern landing page",
            "Photography gallery",
            "Bootstrap responsive layout",
            "Image showcase",
            "Interactive navigation",
            "JavaScript functionality",
            "Mobile-friendly design",
          ],
          liveUrl:
            "https://github.com/",
        };
      }

      return null;
    };

  const projectDetails = getProjectDetails();

  /* =========================================
     CONTACT FORM
  ========================================= */

  const handleContactSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const form = event.currentTarget;

    const formData = new FormData(form);

    const name = String(
      formData.get("name") || ""
    ).trim();

    const email = String(
      formData.get("email") || ""
    ).trim();

    const subject = String(
      formData.get("subject") || ""
    ).trim();

    const message = String(
      formData.get("message") || ""
    ).trim();

    if (!name || !email || !subject || !message) {
      alert("Please fill in all the fields.");
      return;
    }

    /* CREATE PDF */

    const pdf = new jsPDF();

    pdf.setFontSize(20);

    pdf.text(
      "Portfolio Contact Message",
      20,
      25
    );

    pdf.setFontSize(12);

    pdf.text(
      `Name: ${name}`,
      20,
      45
    );

    pdf.text(
      `Email: ${email}`,
      20,
      55
    );

    pdf.text(
      `Subject: ${subject}`,
      20,
      65
    );

    pdf.text(
      "Message:",
      20,
      80
    );

    const messageLines =
      pdf.splitTextToSize(
        message,
        170
      );

    pdf.text(
      messageLines,
      20,
      90
    );

    pdf.save(
      "portfolio-contact-message.pdf"
    );

    /* OPEN EMAIL */

    const mailtoLink =
      `mailto:asmiraseed15@gmail.com` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\n${message}`
      )}`;

    window.location.href = mailtoLink;

    form.reset();
  };

  /* =========================================
     DOCUMENT VIEWER
  ========================================= */

  if (
    activeDocument &&
    documentDetails
  ) {
    return (
      <div
        className={`portfolio ${
          theme === "light"
            ? "light-theme"
            : "dark-theme"
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
              download={
                documentDetails.downloadName
              }
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

  if (
    activeProject &&
    projectDetails
  ) {
    return (
      <div
        className={`portfolio ${
          theme === "light"
            ? "light-theme"
            : "dark-theme"
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
              href={projectDetails.liveUrl}
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
                  <i
                    className={`bi ${projectDetails.icon}`}
                  ></i>
                </div>

                <span className="detail-label">
                  FEATURED PROJECT
                </span>

                <h1>
                  {projectDetails.title}
                </h1>

                <p>
                  {projectDetails.description}
                </p>

                <a
                  className="primary-btn"
                  href={projectDetails.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Live Project
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

                  {projectDetails.technologies.map(
                    (technology) => (
                      <span key={technology}>
                        {technology}
                      </span>
                    )
                  )}

                </div>

              </div>

              <div className="detail-card">

                <div className="detail-card-heading">
                  <i className="bi bi-stars"></i>
                  <h3>Key Features</h3>
                </div>

                <ul className="feature-list">

                  {projectDetails.features.map(
                    (feature) => (
                      <li key={feature}>
                        <i className="bi bi-check-circle-fill"></i>
                        {feature}
                      </li>
                    )
                  )}

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
                href={projectDetails.liveUrl}
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
        theme === "light"
          ? "light-theme"
          : "dark-theme"
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

      <section
        className="hero section"
        id="home"
      >

        <div className="hero-content">

          <div className="availability">
            <span className="availability-dot"></span>
            Available for opportunities
          </div>

          <p className="hero-small-title">
            HELLO, I'M
          </p>

          <h1>
            Asmina <span>Parveen</span>
          </h1>

          <h2>
            Frontend Developer &amp;
            <br />
            Medical Coding Professional
          </h2>

          <p className="hero-description">
            I create clean, responsive and
            user-friendly digital experiences
            using HTML, CSS, JavaScript, React
            and TypeScript, while bringing a
            professional background in
            Microbiology, Medical Coding and
            customer service.
          </p>

          <div className="hero-buttons">

            <a
              href="#projects"
              className="primary-btn"
            >
              View My Work
              <i className="bi bi-arrow-up-right"></i>
            </a>

            <a
              href="#contact"
              className="secondary-btn"
            >
              Let's Connect
              <i className="bi bi-envelope"></i>
            </a>

            <a
              href="/resume.png"
              download="Asmina_Resume.png"
              className="resume-btn"
            >
              <i className="bi bi-download"></i>
              Resume
            </a>

          </div>

          <div className="social-links">

            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <i className="bi bi-github"></i>
            </a>

            <a
  href="https://www.linkedin.com/in/asmi-raseed-160320436/"
  target="_blank"
  rel="noreferrer"
  aria-label="LinkedIn"
>
  <i className="bi bi-linkedin"></i>
</a>

            <a
              href="mailto:asmiraseed15@gmail.com"
              aria-label="Email"
            >
              <i className="bi bi-envelope-fill"></i>
            </a>

          </div>

        </div>

        <div className="hero-visual">

          <div className="hero-glow"></div>

          <div className="hero-image-wrapper">

            <div className="hero-image-border"></div>

            <img
              src="/pro.png"
              alt="Asmina Parveen"
              className="hero-image"
            />

            <div className="floating-card floating-card-one">

              <i className="bi bi-code-slash"></i>

              <div>
                <strong>Frontend</strong>
                <span>Developer</span>
              </div>

            </div>

            <div className="floating-card floating-card-two">

              <i className="bi bi-patch-check-fill"></i>

              <div>
                <strong>Medical</strong>
                <span>Coder</span>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =========================================
          ABOUT
      ========================================= */}

      <section
        className="section about-section"
        id="about"
      >

        <div className="section-heading">

          <span>01</span>

          <div>
            <p>ABOUT ME</p>

            <h2>
              Building digital
              <br />
              experiences with purpose.
            </h2>
          </div>

        </div>

        <div className="about-grid">

          <div className="about-text">

            <p>
              I am Asmina Parveen, a passionate
              Frontend Developer and Medical
              Coding Professional who enjoys
              combining technology, creativity
              and attention to detail.
            </p>

            <p>
              With a background in B.Sc
              Microbiology and Medical Coding,
              along with professional BPO
              experience, I bring strong
              communication, problem-solving
              and analytical skills into my
              development journey.
            </p>

            <p>
              I enjoy creating responsive
              websites and applications that
              are simple to use, visually
              engaging and meaningful.
            </p>

            {/* ONLY VOICE SECTION */}

            <div className="voice-card">

              <audio
                ref={aboutAudioRef}
                src="/Voice.mp3"
                onEnded={handleAboutVoiceEnded}
              />

              <div className="voice-icon">
                <i className="bi bi-mic-fill"></i>
              </div>

              <div className="voice-content">

                <span>
                  LISTEN TO MY INTRODUCTION
                </span> <br />

                <strong>
                  My Voice
                </strong>

              </div>

              <div className="voice-controls">

                <button
                  onClick={playAboutVoice}
                  title="Play"
                  className={
                    isVoicePlaying &&
                    !isVoicePaused
                      ? "active"
                      : ""
                  }
                >
                  <i className="bi bi-play-fill"></i>
                </button>

                <button
                  onClick={pauseAboutVoice}
                  title="Pause"
                  className={
                    isVoicePaused
                      ? "active"
                      : ""
                  }
                >
                  <i className="bi bi-pause-fill"></i>
                </button>

                <button
                  onClick={stopAboutVoice}
                  title="Stop"
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

              <span>Frontend</span>
              <span>React</span>
              <span>TypeScript</span>
              <span>Medical Coding</span>
              <span>Python</span>
              <span>Communication</span>

            </div>

            <div className="about-highlight">

              <i className="bi bi-lightbulb-fill"></i>

              <div>

                <strong>
                  Always learning.
                </strong>

                <p>
                  Currently expanding my
                  skills in Python and Full
                  Stack Development.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =========================================
          SKILLS
      ========================================= */}

      <section
        className="section"
        id="skills"
      >

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

          <div className="skill-card">

            <div className="skill-card-header">

              <div className="skill-main-icon">
                <i className="bi bi-code-square"></i>
              </div>

              <div>
                <span>01 / FRONTEND</span>
                <h3>
                  Frontend Development
                </h3>
              </div>

            </div>

            <div className="skill-bars">

              <div className="skill-item">
                <div>
                  <span>HTML</span>
                  <b>90%</b>
                </div>

                <div className="skill-track">
                  <span
                    style={{
                      width: "90%",
                    }}
                  ></span>
                </div>
              </div>

              <div className="skill-item">
                <div>
                  <span>CSS</span>
                  <b>88%</b>
                </div>

                <div className="skill-track">
                  <span
                    style={{
                      width: "88%",
                    }}
                  ></span>
                </div>
              </div>

              <div className="skill-item">
                <div>
                  <span>JavaScript</span>
                  <b>90%</b>
                </div>

                <div className="skill-track">
                  <span
                    style={{
                      width: "90%",
                    }}
                  ></span>
                </div>
              </div>

              <div className="skill-item">
                <div>
                  <span>React</span>
                  <b>97%</b>
                </div>

                <div className="skill-track">
                  <span
                    style={{
                      width: "97%",
                    }}
                  ></span>
                </div>
              </div>

              <div className="skill-item">
                <div>
                  <span>TypeScript</span>
                  <b>90%</b>
                </div>

                <div className="skill-track">
                  <span
                    style={{
                      width: "90%",
                    }}
                  ></span>
                </div>
              </div>

            </div>

          </div>

          <div className="skill-card">

            <div className="skill-card-header">

              <div className="skill-main-icon">
                <i className="bi bi-tools"></i>
              </div>

              <div>
                <span>02 / TOOLS</span>

                <h3>
                  Tools &amp; Technologies
                </h3>
              </div>

            </div>

            <div className="tools-grid">

              <div>
                <i className="bi bi-code-slash"></i>
                <span>VS Code</span>
              </div>

              <div>
                <i className="bi bi-git"></i>
                <span>Git</span>
              </div>

              <div>
                <i className="bi bi-github"></i>
                <span>GitHub</span>
              </div>

              <div>
                <i className="bi bi-vector-pen"></i>
                <span>Figma</span>
              </div>

              <div>
                <i className="bi bi-cloud-check"></i>
                <span>Vercel</span>
              </div>

            </div>

            <div className="learning-box">

              <i className="bi bi-mortarboard-fill"></i>

              <div>

                <span>
                  CURRENTLY LEARNING
                </span> <br />

                <strong>
                  Python &amp; Full Stack Development
                </strong>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =========================================
          PROJECTS
      ========================================= */}

      <section
        className="section"
        id="projects"
      >

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

        <div className="projects-grid">

          {/* GROCO */}

          <div className="project-card">

            <span className="project-number">
              01
            </span>

            <div className="project-image">
              <img
                src="/gro.png"
                alt="GroCo project"
              />
            </div>

            <div className="project-icon">
              <i className="bi bi-cart3"></i>
            </div>

            <h3>GroCo</h3>

            <p>
              Modern grocery shopping website
              with product browsing, cart,
              checkout and payment flow.
            </p>

            <div className="project-tech">
              <span>React</span>
              <span>TypeScript</span>
              <span>CSS</span>
            </div>

            <button
              className="project-link"
              onClick={() =>
                openProject("groco")
              }
            >
              View Project
              <i className="bi bi-arrow-up-right"></i>
            </button>

          </div>

          {/* HOPEHANDS */}

          <div className="project-card">

            <span className="project-number">
              02
            </span>

            <div className="project-image">
              <img
                src="/char.png"
                alt="HopeHands Foundation project"
              />
            </div>

            <div className="project-icon">
              <i className="bi bi-heart-pulse"></i>
            </div>

            <h3>
              HopeHands Foundation
            </h3>

            <p>
              Charity website featuring
              causes, donations, volunteering
              opportunities and community
              impact.
            </p>

            <div className="project-tech">
              <span>React</span>
              <span>TypeScript</span>
              <span>CSS</span>
            </div>

            <button
              className="project-link"
              onClick={() =>
                openProject("hopehands")
              }
            >
              View Project
              <i className="bi bi-arrow-up-right"></i>
            </button>

          </div>

          {/* FOODFLOW */}

          <div className="project-card">

            <span className="project-number">
              03
            </span>

            <div className="project-image">
              <img
                src="/food.png"
                alt="FoodFlow project"
              />
            </div>

            <div className="project-icon">
              <i className="bi bi-phone"></i>
            </div>

            <h3>FoodFlow</h3>

            <p>
              Food delivery mobile application
              concept with authentication,
              cart, address and checkout.
            </p>

            <div className="project-tech">
              <span>React Native</span>
              <span>Expo</span>
              <span>JavaScript</span>
            </div>

            <button
              className="project-link"
              onClick={() =>
                openProject("foodflow")
              }
            >
              View Project
              <i className="bi bi-arrow-up-right"></i>
            </button>

          </div>

          {/* PHOTOGRAPHY */}

          <div className="project-card">

            <span className="project-number">
              04
            </span>

            <div className="project-image">
              <img
                src="/photo.png"
                alt="Photography Portfolio project"
              />
            </div>

            <div className="project-icon">
              <i className="bi bi-camera"></i>
            </div>

            <h3>
              Photography Portfolio
            </h3>

            <p>
              Stylish photography portfolio
              website designed to showcase
              photographs in a clean and
              engaging layout.
            </p>

            <div className="project-tech">
              <span>HTML</span>
              <span>CSS</span>
              <span>Bootstrap</span>
              <span>JavaScript</span>
            </div>

            <button
              className="project-link"
              onClick={() =>
                openProject("photography")
              }
            >
              View Project
              <i className="bi bi-arrow-up-right"></i>
            </button>

          </div>

        </div>

      </section>

      {/* =========================================
          EXPERIENCE
      ========================================= */}

      <section
        className="section"
        id="experience"
      >

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

          <div className="timeline-item">

            <div className="timeline-dot">
              <i className="bi bi-briefcase-fill"></i>
            </div>

            <div className="timeline-card">

              <span>
                PROFESSIONAL EXPERIENCE
              </span>

              <h3>
                BPO / Customer Service
              </h3>

              <h4>
                Insuremile Insurance Company
              </h4>

              <p>
                Developed strong communication,
                customer handling, documentation
                and problem-solving skills through
                professional experience.
              </p>

            </div>

          </div>

          <div className="timeline-item">

            <div className="timeline-dot">
              <i className="bi bi-code-square"></i>
            </div>

            <div className="timeline-card">

              <span>
                CURRENT LEARNING
              </span>

              <h3>
                Frontend &amp; Python Development
              </h3>

              <h4>
                Continuous Skill Development
              </h4>

              <p>
                Building practical projects using
                React, TypeScript, JavaScript and
                Python while improving my full-stack
                development knowledge.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =========================================
          EDUCATION
      ========================================= */}

      <section
        className="section"
        id="education"
      >

        <div className="section-heading">

          <span>05</span>

          <div>

            <p>EDUCATION</p>

            <h2>
              Education &amp;
              <br />
              professional learning.
            </h2>

          </div>

        </div>

        <div className="education-grid">

          <div className="education-card">

            <div className="education-icon">
              <i className="bi bi-mortarboard-fill"></i>
            </div>

            <span>2024</span>

            <h3>
              B.Sc Microbiology
            </h3>

            <p>
              Annamalai University
            </p>

            <small>
              Bachelor's Degree
            </small>

          </div>

          <div className="education-card">

            <div className="education-icon">
              <i className="bi bi-patch-check-fill"></i>
            </div>

            <span>
              CERTIFICATION
            </span>

            <h3>
              Medical Coding
            </h3>

            <p>
              Professional Certification
            </p>

            <small>
              Medical Coding Training
            </small>

          </div>

          <div className="education-card">

            <div className="education-icon">
              <i className="bi bi-laptop"></i>
            </div>

            <span>
              CURRENT
            </span>

            <h3>
              Frontend Development
            </h3>

            <p>
              Technical Learning
            </p>

            <small>
              React, TypeScript &amp; JavaScript
            </small>

          </div>

        </div>

      </section>

      {/* =========================================
          DOCUMENTS
      ========================================= */}

      <section
        className="section"
        id="documents"
      >

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

          {/* RESUME */}

          <div className="document-card">

            <div className="document-image">
              <img
                src="/resumepdf.png"
                alt="Asmina Parveen Resume"
              />
            </div>

            <div className="document-content">

              <div className="document-icon">
                <i className="bi bi-file-person"></i>
              </div>

              <h3>Resume</h3>

              <p>
                View my professional resume and
                download it for future reference.
              </p>

              <button
                className="document-btn"
                onClick={() =>
                  openDocument("resume")
                }
              >
                <i className="bi bi-eye"></i>
                View Resume
              </button>

              <a
                className="document-download-btn"
                href="/resume.png"
                download="Asmina_Resume.png"
              >
                <i className="bi bi-download"></i>
                Download Resume
              </a>

            </div>

          </div>

          {/* DEGREE */}

          <div className="document-card">

            <div className="document-image">
              <img
                src="/convocation.png"
                alt="Degree Certificate"
              />
            </div>

            <div className="document-content">

              <div className="document-icon">
                <i className="bi bi-mortarboard-fill"></i>
              </div>

              <h3>
                Degree Certificate
              </h3>

              <p>
                My B.Sc Microbiology degree
                certificate.
              </p>

              <button
                className="document-btn"
                onClick={() =>
                  openDocument("degree")
                }
              >
                <i className="bi bi-eye"></i>
                View Certificate
              </button>

              <a
                className="document-download-btn"
                href="/degree.png"
                download="Asmina_Degree.png"
              >
                <i className="bi bi-download"></i>
                Download
              </a>

            </div>

          </div>

          {/* MEDICAL */}

          <div className="document-card">

            <div className="document-image">
              <img
                src="/coding.png"
                alt="Medical Coding Certificate"
              />
            </div>

            <div className="document-content">

              <div className="document-icon">
                <i className="bi bi-heart-pulse-fill"></i>
              </div>

              <h3>
                Medical Coding
              </h3>

              <p>
                My professional Medical Coding
                certification.
              </p>

              <button
                className="document-btn"
                onClick={() =>
                  openDocument("medical")
                }
              >
                <i className="bi bi-eye"></i>
                View Certificate
              </button>

              <a
                className="document-download-btn"
                href="/medical.png"
                download="Asmina_Medical_Coding.png"
              >
                <i className="bi bi-download"></i>
                Download
              </a>

            </div>

          </div>

        </div>

      </section>

      {/* =========================================
          SERVICES
      ========================================= */}

      <section
        className="section"
        id="services"
      >

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

          <div className="service-card">

            <div className="service-number">
              01
            </div>

            <i className="bi bi-window-stack"></i>

            <h3>
              Frontend Development
            </h3>

            <p>
              Creating responsive and
              user-friendly websites with modern
              frontend technologies.
            </p>

          </div>

          <div className="service-card">

            <div className="service-number">
              02
            </div>

            <i className="bi bi-code-square"></i>

            <h3>
              React Development
            </h3>

            <p>
              Building reusable React components
              and interactive application
              interfaces.
            </p>

          </div>

          <div className="service-card">

            <div className="service-number">
              03
            </div>

            <i className="bi bi-phone"></i>

            <h3>
              Responsive Web Design
            </h3>

            <p>
              Designing layouts that work smoothly
              across desktop, tablet and mobile
              devices.
            </p>

          </div>

        </div>

      </section>

      {/* =========================================
          CONTACT
      ========================================= */}

      <section
        className="section contact-section"
        id="contact"
      >

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
              Have a project, opportunity or simply
              want to connect? I'd love to hear from
              you.
            </p>

            <div className="contact-item">

              <div>
                <i className="bi bi-envelope-fill"></i>
              </div>

              <section>

                <span>EMAIL</span> <br />

                <a href="mailto:asmiraseed15@gmail.com">
                  asmiraseed15@gmail.com
                </a>

              </section>

            </div>

            <div className="contact-item">

              <div>
                <i className="bi bi-telephone-fill"></i>
              </div>

              <section>

                <span>PHONE</span> <br />

                <a href="tel:+919344418518">
                  +91 93444 18518
                </a>

              </section>

            </div>

            <div className="contact-item">

              <div>
                <i className="bi bi-geo-alt-fill"></i>
              </div>

              <section>

                <span>LOCATION</span>

                <p>
                  Puducherry, India
                </p>

              </section>

            </div>

          </div>

          <form
            className="contact-form"
            onSubmit={handleContactSubmit}
          >

            <div className="form-row">

              <div className="form-group">

                <label htmlFor="name">
                  YOUR NAME
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                />

              </div>

              <div className="form-group">

                <label htmlFor="email">
                  EMAIL ADDRESS
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                />

              </div>

            </div>

            <div className="form-group">

              <label htmlFor="subject">
                SUBJECT
              </label>

              <input
                id="subject"
                name="subject"
                type="text"
                placeholder="What would you like to discuss?"
              />

            </div>

            <div className="form-group">

              <label htmlFor="message">
                MESSAGE
              </label>

              <textarea
                id="message"
                name="message"
                rows={6}
                placeholder="Tell me about your project or opportunity..."
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
              Asmina<span>Parveen</span>
            </h3>

            <p>
              Frontend Developer &amp; Medical
              Coding Professional.
            </p>

          </div>

          <div className="footer-links">

            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>

          </div>

          <div className="footer-social">

            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
            >
              <i className="bi bi-github"></i>
            </a>

            <a
  href="https://www.linkedin.com/in/asmi-raseed-160320436/"
  target="_blank"
  rel="noreferrer"
  aria-label="LinkedIn"
>
  <i className="bi bi-linkedin"></i>
</a>

            <a href="mailto:asmiraseed15@gmail.com">
              <i className="bi bi-envelope-fill"></i>
            </a>

          </div>

        </div>

        <div className="footer-bottom">

          <span>
            © 2026 Asmina Parveen. All rights reserved.
          </span>

          <span>
            Designed &amp; Built with React
          </span>

        </div>

      </footer>

    </div>
  );
}

export default App;