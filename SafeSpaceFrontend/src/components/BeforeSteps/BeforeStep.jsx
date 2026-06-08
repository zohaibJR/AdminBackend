import { Component } from 'react';
import './BeforeStep.css';

const faqs = [
  {
    q: "How many sessions do I have to take?",
    a: "It depends on no. of concerns you are coming with and their severity level. your therapist will help you decide this. but typically 6-8 sessions are more than enough"
  },
  {
    q: "How often do I need to book a session?",
    a: "Once a week is generally recommended. Regular sessions with a gap of around 5–7 days are considered most effective. Depending on your needs and availability, you and your therapist may decide on a different session frequency."
  },
  {
    q: "How do payments work?",
    a: "You pay for each session independently. but based on your trust on safespace, you can pay for 2 sessions in advance, as per your convenience. we don’t take advance payment for more than 2 sessions right now."
  },
  {
    q: "Can my session time exceed 50 minutes?",
    a: "Sessions typically last 45–55 minutes in accordance with professional APA guidelines. Extending sessions beyond this duration is generally avoided to maintain therapeutic effectiveness and structure."
  }
];

export class BeforeStep extends Component {
  render() {
    return (
      <section className="info-section" id="faq">
        <h2 className="section-heading">
          Before You Take the Next Step
        </h2>

        <div className="info-grid">
          {faqs.map((faq, i) => (
            <div className="info-card" key={i}>
              <h3 className="card-question">{faq.q}</h3>

              <p className="card-answer">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }
}

export default BeforeStep;