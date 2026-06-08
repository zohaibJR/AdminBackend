import { Component } from 'react';
import './Footer.css';

import LinkedINLogo from "../Assets/LinkedINLogo2.png";
import WhatsappLogo from "../Assets/WhatsappLogo1.png";

export class Footer extends Component {

  handleBooking = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  render() {
    return (
      <footer className="site-footer" id="contact">

        <div className="footer-container">

          {/* ───────── LEFT ───────── */}
          <div className="footer-column footer-left">

            <div className="footer-brand-block">
              <p className="footer-brand-name">SafeSpace</p>
              <p className="footer-tagline-small">
                A virtual therapy & counselling platform
              </p>
            </div>

            <a
              href="mailto:safespace.counselandtherapy@gmail.com"
              className="footer-email"
            >
              safespace.counselandtherapy@gmail.com
            </a>

            {/* ───────── SOCIAL BUTTONS ───────── */}
            <div className="social-buttons">

              {/* WhatsApp */}
              <a
                href="https://wa.me/923315828122"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn social-btn--whatsapp"
              >
                <img
                  src={WhatsappLogo}
                  alt="WhatsApp"
                  className="whatsapp-logo"
                />

                <span className="social-text">WhatsApp</span>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/sana-iftikhar-0546a92ba/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn social-btn--linkedin"
              >
                <img
                  src={LinkedINLogo}
                  alt="LinkedIn"
                  className="linkedin-logo"
                />

                <span className="social-text">LinkedIn</span>
              </a>

            </div>

          </div>

          {/* ───────── CENTER ───────── */}
          <div className="footer-column footer-center">

            <p className="platform-tagline">
              "Your healing journey begins<br />
              with a single conversation."
            </p>

            <div className="footer-cta-group">

              <button
                className="footer-btn btn-outline-light"
                onClick={() =>
                  this.handleBooking(
                    'https://cal.com/safe-space-qolbcw/15-minutes-free-introductory-session'
                  )
                }
              >
                Book Free Intro Session
              </button>

              <button
                className="footer-btn btn-solid-light"
                onClick={() =>
                  this.handleBooking(
                    'https://cal.com/safe-space-qolbcw/therapy-session'
                  )
                }
              >
                Book Therapy Session
              </button>

            </div>

          </div>

          {/* ───────── RIGHT ───────── */}
          <div className="footer-column footer-right">

            <p className="footer-links-label">Quick Links</p>

            <a href="#terms" className="footer-link">Terms &amp; Conditions</a>
            <a href="#privacy" className="footer-link">Privacy Policy</a>
            <a href="#faq" className="footer-link">FAQ</a>
            <a href="#contact" className="footer-link">Contact Us</a>

          </div>

        </div>

        {/* ───────── BOTTOM ───────── */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} SafeSpace. All rights reserved.
          </p>
        </div>

      </footer>
    );
  }
}

export default Footer;