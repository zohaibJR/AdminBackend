import { useState } from 'react'
import './navbar.css'
import NavbarLogo from '../Assets/LogoCropped.png'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const menuItems = [
    { label: 'About', href: '#about' },
    { label: 'Our Services', href: '#our-services' },
    { label: 'Our Therapists', href: '#our-therapists' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <a className="navbar__brand" href="#about" aria-label="SafeSpace home">
          <img
            src={NavbarLogo}
            alt="SafeSpace Logo"
            className="navbar__logo"
          />
        </a>

        <button
          className={`navbar__toggle${menuOpen ? ' open' : ''}`}
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav
          id="primary-navigation"
          className={`navbar__menu${menuOpen ? ' mobile-open' : ''}`}
          aria-label="Main navigation"
        >
          {menuItems.map((item) => (
            <a
              className="navbar__link"
              href={item.href}
              key={item.href}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
  className="navbar__cta"
  href="https://cal.com/safe-space-qolbcw/therapy-session"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => setMenuOpen(false)}
>
  Book a Session
</a>
      </div>
    </header>
  )
}

export default Navbar
