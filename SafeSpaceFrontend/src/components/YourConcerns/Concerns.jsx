import "./Concerns.css";

const concerns = [
  "I feel anxious and don't know what to do",
  "I don't know what to do with my life",
  "I feel overwhelmed in public",
  "I struggle with low self-esteem",
  "People drain my energy",
  "Can I find a therapist I trust?",
  "Why can't I shake my anxiety?",
  "I feel stuck in old patterns",
  "My relationships keep breaking down",
  "I'm grieving and need support",
];

const ConcernsYouAreComingWithSection = () => {
  return (
    <section className="concernsContainer">
      <h2 className="section-heading">Concerns You Are Coming With</h2>
      {/* <p className="concerns__sub">
        You are not alone. Many people come to us with these same feelings.
      </p> */}
      <div className="concernsGrid">
        {concerns.map((item, index) => (
          <button key={index} className="concernBtn">
            {item}
          </button>
        ))}
      </div>
    </section>
  );
};

export default ConcernsYouAreComingWithSection;
