const ACCREDITATIONS = [
  {
    name: 'American Hypnosis Association',
    src: '/accreditations/american-hypnosis-association.png',
  },
  {
    name: "Australian Hypnotherapists Association",
    src: '/accreditations/australian-hypnotherapists-association.png',
  },
  {
    name: 'IPHM Worldwide Accreditation',
    src: '/accreditations/iphm-accreditation.png',
  },
];

export default function AccreditationBar() {
  return (
    <div className="accreditation-bar" role="complementary" aria-label="Professional accreditations">
      <div className="accreditation-bar__inner">
        <span className="accreditation-bar__label">Accredited &amp; Certified By</span>
        <ul className="accreditation-bar__list">
          {ACCREDITATIONS.map((item) => (
            <li key={item.name}>
              <img src={item.src} alt={item.name} loading="lazy" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
