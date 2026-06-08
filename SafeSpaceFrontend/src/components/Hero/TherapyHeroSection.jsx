import './therapyHeroSection.css'
import Logo from '../Navbar/NavbarLogo.PNG'

function TherapyHeroSection() {

  const handleBooking = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="therapyHero" id="about">

      <div className="therapyHero__banner">

        <h1 className="therapyHero__title">
          For emotions you <br /> never truly navigate
        </h1>

        <p className="therapyHero__subtitle">
          We provide virtual therapy and counseling through{' '}
          <span>qualified mental health professionals.</span>
        </p>

        <div className="therapyHero__buttons">

          <button
            className="cta-btn cta-btn--white"
            type="button"
            onClick={() =>
              handleBooking('https://cal.com/safe-space-qolbcw/15-minutes-free-introductory-session')
            }
          >
            Book Free Intro Session
          </button>

          <button
            className="cta-btn cta-btn--primary"
            type="button"
            onClick={() =>
              handleBooking('https://cal.com/safe-space-qolbcw/therapy-session')
            }
          >
            Book Therapy Session
          </button>

        </div>
      </div>

      <div className="therapyHero__content">

        <div className="therapyHero__text">

          <p>
            <strong>SafeSpace</strong> is a virtual counselling and therapy
            platform that helps you manage emotions, behavioural issues, and
            past traumatic life experiences, and improve your quality of life.
          </p>

          <p>
            With our 50-minute therapy and counselling sessions, our therapist
            will explore the challenges you're facing and guide you towards
            healthier, lasting resolutions.
          </p>

          <button
            className="cta-btn cta-btn--primary"
            type="button"
            onClick={() =>
              handleBooking('https://cal.com/safe-space-qolbcw/therapy-session')
            }
          >
            Book Therapy Session
          </button>

        </div>

        <div className="therapyHero__logoWrapper">
          <div className="therapyHero__logoRing">
            <img src={Logo} alt="SafeSpace Logo" className="therapyHero__logo" />
          </div>
        </div>

      </div>
    </section>
  )
}

export default TherapyHeroSection