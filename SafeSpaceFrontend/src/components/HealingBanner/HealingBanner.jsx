import { Component } from 'react';
import './HealingBanner.css';

export class HealingBanner extends Component {

  handleBooking(url) {
    window.open(url, '_blank');
  }

  render() {
    return (
      <section className="healing-banner">

        <h2 className="healing-title">

          <span className="title-part-1">
            Healing <br />
          </span>

          <span className="title-part-2">
            doesn't begin with having all the answers
          </span>

        </h2>

        <br />
        <br />
        

        <div className="button-group">

          <button
            className="cta-btn cta-btn--outline"
            onClick={() =>
              this.handleBooking(
                'https://cal.com/safe-space-qolbcw/15-minutes-free-introductory-session'
              )
            }
          >
            Book Free Intro Session
          </button>

          <button
            className="cta-btn cta-btn--primary"
            onClick={() =>
              this.handleBooking(
                'https://cal.com/safe-space-qolbcw/therapy-session'
              )
            }
          >
            Book Therapy Session →
          </button>

        </div>

      </section>
    );
  }
}

export default HealingBanner;