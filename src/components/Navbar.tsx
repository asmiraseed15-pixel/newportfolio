import { useEffect, useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-container">

        {/* Logo */}
        <a href="#home" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-symbol">&lt;/&gt;</span>
          <span>Asmina<span className="logo-dot">.</span></span>
        </a>

        {/* Desktop Navigation */}
        <div className={`navbar-menu ${menuOpen ? "menu-active" : ""}`}>
          <a href="#home" onClick={closeMenu}>Home</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#skills" onClick={closeMenu}>Skills</a>
          <a href="#projects" onClick={closeMenu}>Projects</a>
          <a href="#experience" onClick={closeMenu}>Experience</a>
          <a href="#education" onClick={closeMenu}>Education</a>
          <a href="#services" onClick={closeMenu}>Services</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </div>

        {/* Resume Button */}
        <a
          href="/Asmina-Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="navbar-resume"
        >
          <i className="bi bi-download"></i>
          Resume
        </a>

        {/* Mobile Menu Button */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <i className={`bi ${menuOpen ? "bi-x-lg" : "bi-list"}`}></i>
        </button>

      </div>
    </nav>
  );
}

export default Navbar;