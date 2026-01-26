import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";
import logo from "../assets/RepoVault.svg";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <img src={logo} alt="RepoVault Logo" className="footer-logo" />
          <span className="footer-copyright">© {new Date().getFullYear()} RepoVault, Inc.</span>
        </div>
        
        <div className="footer-links">
          <a href="https://www.npmjs.com/package/repovault" target="_blank" rel="noopener noreferrer">CLI</a>
          <a href="https://github.com/ShubhamV-Codes/repovault" target="_blank" rel="noopener noreferrer">Source-Code</a>
          <a href="https://www.linkedin.com/in/shubhamvishwakarma-swe">Developer</a>
          <a href="https://vistara-lime.vercel.app" target="_blank" rel="noopener noreferrer">Vistara</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;