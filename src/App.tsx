

import "./App.css";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";

type DocumentType = "resume" | "degree" | "medical" | null;

type ProjectType = "groco" | "hopehands" | "foodflow" | null;

function App() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [activeDocument, setActiveDocument] =
    useState<DocumentType>(null);

  const [activeProject, setActiveProject] =
    useState<ProjectType>(null);

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  /*
    =========================================
    YOUR EMAIL ADDRESS
    =========================================

    Replace this with your real email address.

    Example:
    const recruiterEmail = "yourname@gmail.com";
  */
  const recruiterEmail = "asmiraseed15@gmail.com";

  useEffect(() => {
    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };

    loadVoices();

    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speakText = (text: string) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    const englishVoice =
      voices.find(
        (voice) =>
          voice.lang.toLowerCase().startsWith("en") &&
          voice.name.toLowerCase().includes("female")
      ) ||
      voices.find((voice) =>
        voice.lang.toLowerCase().startsWith("en")
      );

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.rate = 0.95;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const pauseVoice = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resumeVoice = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stopVoice = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const speakSection = (text: string) => {
    speakText(text);
  };

  /* =========================================
     DOCUMENT FUNCTIONS
  ========================================= */

  const openDocument = (documentType: DocumentType) => {
    stopVoice();
    setActiveDocument(documentType);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeDocument = () => {
    stopVoice();
    setActiveDocument(null);

    setTimeout(() => {
      document
        .getElementById("documents")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const getDocumentDetails = () => {
    if (activeDocument === "resume") {
      return {
        title: "My Resume",
        file: "/Asmina_Resume.pdf",
        downloadName: "Asmina_Resume.pdf",
        type: "pdf",
      };
    }

    if (activeDocument === "degree") {
      return {
        title: "Degree Certificate",
        file: "/degree.png",
        downloadName: "degree.png",
        type: "image",
      };
    }

    if (activeDocument === "medical") {
      return {
        title: "Medical Coding Certificate",
        file: "/medical.png",
        downloadName: "medical.png",
        type: "image",
      };
    }

    return null;
  };

  /* =========================================
     PROJECT DETAILS
  ========================================= */

  const openProjectDetails = (project: ProjectType) => {
    stopVoice();
    setActiveProject(project);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const closeProjectDetails = () => {
    stopVoice();
    setActiveProject(null);

    setTimeout(() => {
      document
        .getElementById("projects")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const getProjectDetails = () => {
    if (activeProject === "groco") {
      return {
        title: "GroCo",
        icon: "bi-cart3",
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
        liveUrl: "https://groco-mu.vercel.app",
      };
    }

    if (activeProject === "hopehands") {
      return {
        title: "HopeHands Foundation",
        icon: "bi-heart-pulse",
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
          "Mobile responsive experience",
        ],
        liveUrl: "https://github.com/",
      };
    }

    return null;
  };

  /* =========================================
     CONTACT EMAIL
  ========================================= */

  const handleContactSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      !contactName.trim() ||
      !contactEmail.trim() ||
      !contactSubject.trim() ||
      !contactMessage.trim()
    ) {
      alert("Please enter all contact details before submitting.");
      return;
    }

    /*
      Create the contact message PDF.
    */

    const pdf = new jsPDF();

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.text("Portfolio Contact Message", 20, 25);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);

    pdf.text("Contact Details", 20, 42);

    pdf.setFont("helvetica", "bold");
    pdf.text("Name:", 20, 55);

    pdf.setFont("helvetica", "normal");
    pdf.text(contactName, 55, 55);

    pdf.setFont("helvetica", "bold");
    pdf.text("Email:", 20, 67);

    pdf.setFont("helvetica", "normal");
    pdf.text(contactEmail, 55, 67);

    pdf.setFont("helvetica", "bold");
    pdf.text("Subject:", 20, 79);

    pdf.setFont("helvetica", "normal");
    pdf.text(contactSubject, 55, 79);

    pdf.setFont("helvetica", "bold");
    pdf.text("Message:", 20, 95);

    pdf.setFont("helvetica", "normal");

    const messageLines = pdf.splitTextToSize(
      contactMessage,
      165
    );

    pdf.text(messageLines, 20, 107);

    pdf.setFontSize(9);
    pdf.text(
      `Generated from Asmina's Portfolio`,
      20,
      285
    );

    pdf.save("portfolio-contact-message.pdf");

    /*
      =========================================
      EMAIL
      =========================================

      This opens the visitor's default email application.

      Replace recruiterEmail above with your real email.
    */

    const emailBody = `
Hello Asmina,

You have received a new message from your portfolio.

Name:
${contactName}

Email:
${contactEmail}

Subject:
${contactSubject}

Message:
${contactMessage}

--------------------------------
Sent from Asmina's Portfolio
`;

    const mailtoLink =
      `mailto:${recruiterEmail}` +
      `?subject=${encodeURIComponent(
        contactSubject
      )}` +
      `&body=${encodeURIComponent(emailBody)}`;

    window.location.href = mailtoLink;

    speakText(
      `Thank you ${contactName}. Your message has been prepared successfully for email.`
    );

    alert(
      "Your message has been prepared successfully.\nYour email application will open so the message can be sent."
    );

    setContactName("");
    setContactEmail("");
    setContactSubject("");
    setContactMessage("");
  };

  const documentDetails = getDocumentDetails();
  const projectDetails = getProjectDetails();

  /* =========================================
     DOCUMENT VIEWER
  ========================================= */

  if (activeDocument && documentDetails) {
    return (
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
    );
  }

  /* =========================================
     PROJECT DETAILS VIEWER
  ========================================= */

  if (activeProject && projectDetails) {
    return (
      <div className="project-details-page">
        <div className="project-details-header">
          <button
            className="back-project-btn"
            onClick={closeProjectDetails}
          >
            <i className="bi bi-arrow-left"></i>
            Back to Portfolio
          </button>

          <div className="project-details-header-title">
            Project Details
          </div>

          <a
            href={projectDetails.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="project-live-btn"
          >
            View Project
            <i className="bi bi-arrow-up-right"></i>
          </a>
        </div>

        <main className="project-details-content">
          <div className="project-details-hero">
            <div className="project-details-icon">
              <i
                className={`bi ${projectDetails.icon}`}
              ></i>
            </div>

            <span className="project-details-label">
              PROJECT DETAILS
            </span>

            <h1>{projectDetails.title}</h1>

            <p>{projectDetails.description}</p>
          </div>

          <div className="project-details-grid">
            <div className="project-details-card">
              <div className="project-details-card-title">
                <i className="bi bi-code-square"></i>
                <h2>Technologies Used</h2>
              </div>

              <div className="project-details-tags">
                {projectDetails.technologies.map(
                  (technology) => (
                    <span key={technology}>
                      {technology}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="project-details-card">
              <div className="project-details-card-title">
                <i className="bi bi-check2-circle"></i>
                <h2>Key Features</h2>
              </div>

              <div className="project-features">
                {projectDetails.features.map(
                  (feature) => (
                    <div
                      className="project-feature"
                      key={feature}
                    >
                      <i className="bi bi-check-circle"></i>
                      <span>{feature}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="project-details-bottom">
            <button
              className="back-project-large-btn"
              onClick={closeProjectDetails}
            >
              <i className="bi bi-arrow-left"></i>
              Back to Portfolio
            </button>

            <a
              href={projectDetails.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="project-open-large-btn"
            >
              View Project
              <i className="bi bi-arrow-up-right"></i>
            </a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="portfolio">
      <div className="aurora aurora-one"></div>
      <div className="aurora aurora-two"></div>
      <div className="aurora aurora-three"></div>
      <div className="background-grid"></div>

      <Navbar />

      {/* =========================================
          HERO
      ========================================= */}

      <section className="section hero" id="home">
        <div className="hero-glow"></div>

        <div className="hero-content">
          <div className="availability">
            <span className="availability-dot"></span>
            Available for opportunities
          </div>

          <div className="hello-text">
            HELLO, I'M
          </div>

          <h1>
            Asmina <span>Parveen</span>
          </h1>

          <h2>
            Frontend Developer &amp; Medical Coding Professional
          </h2>

          <p className="hero-description">
            I create modern, responsive and user-friendly web
            applications using HTML, CSS, JavaScript, React and
            TypeScript. I also have a background in Microbiology,
            Medical Coding and customer service.
          </p>

          <div className="hero-buttons">
            <a
              href="#projects"
              className="primary-btn"
            >
              <i className="bi bi-code-slash"></i>
              View My Work
            </a>

            <a
              href="#contact"
              className="secondary-btn"
            >
              <i className="bi bi-chat-dots"></i>
              Let's Connect
            </a>

            <button
              className="resume-btn"
              onClick={() => openDocument("resume")}
            >
              <i className="bi bi-file-earmark-person"></i>
              Resume
            </button>
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
              href="https://www.linkedin.com/"
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
              <i className="bi bi-envelope"></i>
            </a>
          </div>
        </div>

        <div className="hero-image-area">
          <div className="profile-glow"></div>

          <div className="profile-ring">
            <img
              src="/pro.png"
              alt="Asmina"
              className="profile-image"
            />
          </div>

          <div className="floating-tech react-floating">
            <i className="bi bi-code-square"></i>
            <div>
              <strong>React</strong>
              <small>Frontend</small>
            </div>
          </div>

          <div className="floating-tech js-floating">
            <span className="js-icon">JS</span>
            <div>
              <strong>JavaScript</strong>
              <small>Programming</small>
            </div>
          </div>

          <div className="tech-column">
            <button
              onClick={() =>
                speakSection(
                  "HTML is used to structure the content of a web page."
                )
              }
            >
              <i className="bi bi-filetype-html"></i>
              HTML
            </button>

            <button
              onClick={() =>
                speakSection(
                  "CSS is used to style websites and create responsive layouts."
                )
              }
            >
              <i className="bi bi-filetype-css"></i>
              CSS
            </button>

            <button
              onClick={() =>
                speakSection(
                  "JavaScript adds logic and interactivity to web applications."
                )
              }
            >
              <span className="small-js">JS</span>
              JavaScript
            </button>

            <button
              onClick={() =>
                speakSection(
                  "React is a JavaScript library used to build reusable user interfaces."
                )
              }
            >
              <i className="bi bi-code-square"></i>
              React
            </button>
          </div>
        </div>
      </section>

      {/* =========================================
          ABOUT
      ========================================= */}

      <section className="section" id="about">
        <div className="section-heading">
          <span>01</span>

          <div>
            <p>GET TO KNOW ME</p>
            <h2>About Me</h2>
          </div>
        </div>

        <div className="about-grid">
          <div className="about-text">
            <h3>
              Building digital experiences with{" "}
              <span>purpose.</span>
            </h3>

            <p>
              I am a passionate frontend developer who enjoys
              transforming ideas into clean, modern and responsive
              web applications.
            </p>

            <p>
              My technical journey includes HTML, CSS, JavaScript,
              React, TypeScript and Python. Along with technology,
              my educational background in Microbiology and Medical
              Coding gives me a unique combination of technical and
              healthcare knowledge.
            </p>

            <button
              className="voice-btn"
              onClick={() =>
                speakSection(
                  "I am a passionate frontend developer who enjoys transforming ideas into clean, modern and responsive web applications. My technical journey includes HTML, CSS, JavaScript, React, TypeScript and Python. Along with technology, my educational background in Microbiology and Medical Coding gives me a unique combination of technical and healthcare knowledge."
                )
              }
            >
              <i className="bi bi-volume-up"></i>
              Listen About Me
            </button>
          </div>

          <div className="about-card">
            <div className="about-card-icon">
              <i className="bi bi-person-workspace"></i>
            </div>

            <h3>What I Bring</h3>

            <p>
              A combination of frontend development, healthcare
              knowledge, communication skills and a continuous
              learning mindset.
            </p>

            <div className="tag-container">
              <span>Frontend</span>
              <span>React</span>
              <span>TypeScript</span>
              <span>Medical Coding</span>
              <span>Python</span>
              <span>Communication</span>
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
            <p>MY EXPERTISE</p>
            <h2>Skills</h2>
          </div>
        </div>

        <div className="skills-grid">
          <div className="skills-card">
            <div className="card-title">
              <i className="bi bi-code-square"></i>
              <h3>Frontend Development</h3>
            </div>

            <div className="skill-item">
              <div className="skill-header">
                <span>HTML</span>
                <i className="bi bi-filetype-html"></i>
              </div>

              <div className="skill-bar">
                <div className="skill-progress html-progress"></div>
              </div>

              <button
                onClick={() =>
                  speakSection(
                    "HTML is used to structure web pages and their content."
                  )
                }
              >
                Why HTML?
              </button>
            </div>

            <div className="skill-item">
              <div className="skill-header">
                <span>CSS</span>
                <i className="bi bi-filetype-css"></i>
              </div>

              <div className="skill-bar">
                <div className="skill-progress css-progress"></div>
              </div>

              <button
                onClick={() =>
                  speakSection(
                    "CSS is used to style web pages, create layouts, animations and responsive designs."
                  )
                }
              >
                Why CSS?
              </button>
            </div>

            <div className="skill-item">
              <div className="skill-header">
                <span>JavaScript</span>
                <i className="bi bi-filetype-js"></i>
              </div>

              <div className="skill-bar">
                <div className="skill-progress javascript-progress"></div>
              </div>

              <button
                onClick={() =>
                  speakSection(
                    "JavaScript is used to add logic, dynamic behavior and interactivity to web applications."
                  )
                }
              >
                Why JavaScript?
              </button>
            </div>

            <div className="skill-item">
              <div className="skill-header">
                <span>React</span>
                <i className="bi bi-code-square"></i>
              </div>

              <div className="skill-bar">
                <div className="skill-progress react-progress"></div>
              </div>

              <button
                onClick={() =>
                  speakSection(
                    "React helps developers build reusable components and dynamic user interfaces."
                  )
                }
              >
                Why React?
              </button>
            </div>

            <div className="skill-item">
              <div className="skill-header">
                <span>TypeScript</span>
                <i className="bi bi-braces"></i>
              </div>

              <div className="skill-bar">
                <div className="skill-progress typescript-progress"></div>
              </div>

              <button
                onClick={() =>
                  speakSection(
                    "TypeScript adds static typing to JavaScript and helps create more reliable applications."
                  )
                }
              >
                Why TypeScript?
              </button>
            </div>
          </div>

          <div className="skills-card">
            <div className="card-title">
              <i className="bi bi-tools"></i>
              <h3>Tools &amp; Technologies</h3>
            </div>

            <div className="tools-grid">
              <button
                onClick={() =>
                  speakSection(
                    "Visual Studio Code is a source code editor used for developing applications."
                  )
                }
              >
                <i className="bi bi-code-square"></i>
                VS Code
              </button>

              <button
                onClick={() =>
                  speakSection(
                    "Git is a version control system used to track code changes."
                  )
                }
              >
                <i className="bi bi-git"></i>
                Git
              </button>

              <button
                onClick={() =>
                  speakSection(
                    "GitHub is used to store, manage and collaborate on source code."
                  )
                }
              >
                <i className="bi bi-github"></i>
                GitHub
              </button>

              <button
                onClick={() =>
                  speakSection(
                    "Figma is a design and prototyping tool used for creating user interface designs."
                  )
                }
              >
                <i className="bi bi-bezier2"></i>
                Figma
              </button>
            </div>

            <div className="learning-box">
              <span>Currently Learning</span>
              <h4>Python &amp; Full Stack Development</h4>
              <p>
                Continuously improving my programming knowledge and
                exploring modern technologies to become a stronger
                full-stack developer.
              </p>
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
            <p>MY RECENT WORK</p>
            <h2>Projects</h2>
          </div>
        </div>

        <div className="projects-grid">
          <div className="project-card">
            <span className="project-number">01</span>

            <div className="project-icon">
              <i className="bi bi-cart3"></i>
            </div>

            <h3>GroCo</h3>

            <p>
              A modern grocery shopping website built with React
              and TypeScript with product browsing, cart,
              checkout and payment flow.
            </p>

            <div className="project-tech">
              <span>React</span>
              <span>TypeScript</span>
              <span>CSS</span>
            </div>

            <button
              className="project-link project-details-trigger"
              onClick={() =>
                openProjectDetails("groco")
              }
            >
              View Project
              <i className="bi bi-arrow-up-right"></i>
            </button>
          </div>

          <div className="project-card">
            <span className="project-number">02</span>

            <div className="project-icon">
              <i className="bi bi-heart-pulse"></i>
            </div>

            <h3>HopeHands Foundation</h3>

            <p>
              A charity website designed to present causes,
              volunteering opportunities, donations and community
              impact in a clean responsive interface.
            </p>

            <div className="project-tech">
              <span>React</span>
              <span>TypeScript</span>
              <span>CSS</span>
            </div>

            <button
              className="project-link project-details-trigger"
              onClick={() =>
                openProjectDetails("hopehands")
              }
            >
              View Project
              <i className="bi bi-arrow-up-right"></i>
            </button>
          </div>

          <div className="project-card">
            <span className="project-number">03</span>

            <div className="project-icon">
              <i className="bi bi-phone"></i>
            </div>

            <h3>FoodFlow</h3>

            <p>
              A food delivery mobile application concept built
              with Expo and React Native with authentication,
              cart and checkout experiences.
            </p>

            <div className="project-tech">
              <span>React Native</span>
              <span>Expo</span>
              <span>JavaScript</span>
            </div>

            <button
              className="project-link project-details-trigger"
              onClick={() =>
                openProjectDetails("foodflow")
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

      <section className="section" id="experience">
        <div className="section-heading">
          <span>04</span>

          <div>
            <p>MY JOURNEY</p>
            <h2>Experience</h2>
          </div>
        </div>

        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-dot"></div>

            <div className="timeline-card">
              <span className="timeline-date">
                PROFESSIONAL EXPERIENCE
              </span>

              <h3>Customer Service / BPO</h3>

              <h4>Insuremile Insurance Company</h4>

              <p>
                Worked in a professional BPO environment and
                developed communication, customer handling,
                problem-solving and teamwork skills.
              </p>

              <div className="experience-tags">
                <span>Communication</span>
                <span>Customer Support</span>
                <span>Teamwork</span>
                <span>Problem Solving</span>
              </div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"></div>

            <div className="timeline-card">
              <span className="timeline-date">
                CURRENT LEARNING
              </span>

              <h3>Frontend &amp; Python Development</h3>

              <h4>Continuous Learning</h4>

              <p>
                Building practical projects using React,
                TypeScript, JavaScript, CSS and Python while
                continuously improving my development skills.
              </p>

              <div className="experience-tags">
                <span>React</span>
                <span>TypeScript</span>
                <span>Python</span>
                <span>GitHub</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          EDUCATION
      ========================================= */}

      <section className="section" id="education">
        <div className="section-heading">
          <span>05</span>

          <div>
            <p>MY QUALIFICATIONS</p>
            <h2>Education</h2>
          </div>
        </div>

        <div className="education-grid">
          <div className="education-card">
            <div className="education-icon">
              <i className="bi bi-mortarboard"></i>
            </div>

            <span>2024</span>

            <h3>B.Sc Microbiology</h3>

            <p>
              Annamalai University
            </p>
          </div>

          <div className="education-card">
            <div className="education-icon">
              <i className="bi bi-file-medical"></i>
            </div>

            <span>CERTIFICATION</span>

            <h3>Medical Coding</h3>

            <p>
              Medical Coding Certification
            </p>
          </div>

          <div className="education-card">
            <div className="education-icon">
              <i className="bi bi-laptop"></i>
            </div>

            <span>TECHNICAL LEARNING</span>

            <h3>Frontend Development</h3>

            <p>
              React, JavaScript, TypeScript, HTML &amp; CSS
            </p>
          </div>
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
            <h2>Certificates &amp; Resume</h2>
          </div>
        </div>

        <p className="documents-intro">
          Explore my resume, degree certificate and medical coding
          certificate.
        </p>

        <div className="documents-grid">
          <div className="document-card">
            <div className="document-preview resume-preview">
              <i className="bi bi-file-earmark-pdf"></i>

              <span>PDF DOCUMENT</span>

              <h3>My Resume</h3>
            </div>

            <div className="document-content">
              <div className="document-icon">
                <i className="bi bi-file-person"></i>
              </div>

              <h3>Resume</h3>

              <p>
                View my professional resume and download it for
                future reference.
              </p>

              <button
                className="document-btn"
                onClick={() => openDocument("resume")}
              >
                <i className="bi bi-eye"></i>
                View Resume
              </button>

              <a
                className="document-download-btn"
                href="/Asmina_Resume.pdf"
                download="Asmina_Resume.pdf"
              >
                <i className="bi bi-download"></i>
                Download Resume
              </a>
            </div>
          </div>

          <div className="document-card">
            <div className="document-image">
              <img
                src="/convocation.png"
                alt="Degree Certificate"
              />
            </div>

            <div className="document-content">
              <div className="document-icon">
                <i className="bi bi-mortarboard"></i>
              </div>

              <h3>Degree Certificate</h3>

              <p>
                My degree certificate from my academic
                qualification.
              </p>

              <button
                className="document-btn"
                onClick={() => openDocument("degree")}
              >
                <i className="bi bi-eye"></i>
                View Certificate
              </button>

              <a
                className="document-download-btn"
                href="/degree.png"
                download="degree.png"
              >
                <i className="bi bi-download"></i>
                Download Certificate
              </a>
            </div>
          </div>

          <div className="document-card">
            <div className="document-image">
              <img
                src="/coding.png"
                alt="Medical Coding Certificate"
              />
            </div>

            <div className="document-content">
              <div className="document-icon">
                <i className="bi bi-file-medical"></i>
              </div>

              <h3>Medical Coding Certificate</h3>

              <p>
                My professional medical coding certification
                supporting my healthcare knowledge.
              </p>

              <button
                className="document-btn"
                onClick={() => openDocument("medical")}
              >
                <i className="bi bi-eye"></i>
                View Certificate
              </button>

              <a
                className="document-download-btn"
                href="/medical.png"
                download="medical.png"
              >
                <i className="bi bi-download"></i>
                Download Certificate
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          SERVICES
      ========================================= */}

      <section className="section" id="services">
        <div className="section-heading">
          <span>07</span>

          <div>
            <p>WHAT I CAN DO</p>
            <h2>Services</h2>
          </div>
        </div>

        <div className="services-grid">
          <button
            className="service-card"
            onClick={() =>
              speakSection(
                "Frontend Development uses HTML, CSS, JavaScript and React to build modern responsive websites."
              )
            }
          >
            <i className="bi bi-code-slash"></i>

            <h3>Frontend Development</h3>

            <p>
              Building modern, responsive and user-friendly
              interfaces using HTML, CSS, JavaScript and React.
            </p>

            <span>
              Learn More
              <i className="bi bi-arrow-right"></i>
            </span>
          </button>

          <button
            className="service-card"
            onClick={() =>
              speakSection(
                "React Development helps create reusable components and dynamic web applications."
              )
            }
          >
            <i className="bi bi-react"></i>

            <h3>React Development</h3>

            <p>
              Creating reusable React components and dynamic
              interfaces for modern web applications.
            </p>

            <span>
              Learn More
              <i className="bi bi-arrow-right"></i>
            </span>
          </button>

          <button
            className="service-card"
            onClick={() =>
              speakSection(
                "Responsive Web Design ensures websites work smoothly on desktops, tablets and mobile devices."
              )
            }
          >
            <i className="bi bi-phone"></i>

            <h3>Responsive Web Design</h3>

            <p>
              Designing responsive layouts that work smoothly
              across desktop, tablet and mobile devices.
            </p>

            <span>
              Learn More
              <i className="bi bi-arrow-right"></i>
            </span>
          </button>
        </div>
      </section>

      {/* =========================================
          CONTACT
      ========================================= */}

      <section className="section" id="contact">
        <div className="section-heading">
          <span>08</span>

          <div>
            <p>LET'S CONNECT</p>
            <h2>Contact</h2>
          </div>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <h3>
              Let's build something{" "}
              <span>great together.</span>
            </h3>

            <p>
              Have a project, opportunity or question? Fill out
              the form and send me a message.
            </p>

            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="bi bi-envelope"></i>
                </div>

                <div>
                  <small>EMAIL</small>
                  <p>asmiraseed15@gmail.com</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="bi bi-telephone"></i>
                </div>

                <div>
                  <small>PHONE</small>
                  <p>+91 93444 18518</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="bi bi-geo-alt"></i>
                </div>

                <div>
                  <small>LOCATION</small>
                  <p>Puducherry, India</p>
                </div>
              </div>
            </div>
          </div>

          <form
            className="contact-form"
            onSubmit={handleContactSubmit}
          >
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contact-name">
                  Your Name
                </label>

                <input
                  id="contact-name"
                  type="text"
                  placeholder="Enter your name"
                  value={contactName}
                  onChange={(e) =>
                    setContactName(e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-email">
                  Email Address
                </label>

                <input
                  id="contact-email"
                  type="email"
                  placeholder="Enter your email"
                  value={contactEmail}
                  onChange={(e) =>
                    setContactEmail(e.target.value)
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="contact-subject">
                Subject
              </label>

              <input
                id="contact-subject"
                type="text"
                placeholder="Enter subject"
                value={contactSubject}
                onChange={(e) =>
                  setContactSubject(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-message">
                Message
              </label>

              <textarea
                id="contact-message"
                rows={7}
                placeholder="Write your message..."
                value={contactMessage}
                onChange={(e) =>
                  setContactMessage(e.target.value)
                }
              ></textarea>
            </div>

            <button
              type="submit"
              className="submit-btn"
            >
              <i className="bi bi-send"></i>
              Submit Message
            </button>
          </form>
        </div>
      </section>

      {/* =========================================
          FOOTER
      ========================================= */}

      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <h2>
              Asmina<span> Parveen</span>
            </h2>

            <p>
              Frontend Developer &amp; Medical Coding
              Professional creating meaningful digital
              experiences.
            </p>
          </div>

          <div className="footer-links">
            <h3>Quick Links</h3>

            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#projects">Projects</a>
            <a href="#experience">Experience</a>
            <a href="#education">Education</a>
            <a href="#documents">Documents</a>
            <a href="#services">Services</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="footer-social">
            <h3>Follow Me</h3>

            <div className="footer-social-icons">
              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <i className="bi bi-github"></i>
              </a>

              <a
                href="https://www.linkedin.com/"
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
                <i className="bi bi-envelope"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © 2026 Asmina Parveen. All Rights Reserved.
          </p>

          <button
            className="stop-voice-footer"
            onClick={stopVoice}
          >
            <i className="bi bi-stop-circle"></i>
            Stop Voice
          </button>
        </div>
      </footer>

      {/* =========================================
          VOICE CONTROLLER
      ========================================= */}

      {isSpeaking && (
        <div className="voice-controller">
          <div className="voice-status">
            <div className="voice-animation">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div>
              <strong>AI Voice Assistant</strong>

              <small>
                {isPaused
                  ? "Voice paused"
                  : "Speaking..."}
              </small>
            </div>
          </div>

          <div className="voice-buttons">
            <button
              onClick={pauseVoice}
              disabled={isPaused}
              aria-label="Pause voice"
            >
              <i className="bi bi-pause-fill"></i>
            </button>

            <button
              onClick={resumeVoice}
              disabled={!isPaused}
              aria-label="Resume voice"
            >
              <i className="bi bi-play-fill"></i>
            </button>

            <button
              onClick={stopVoice}
              aria-label="Stop voice"
            >
              <i className="bi bi-stop-fill"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;


