import Hero from '../sections/Hero.jsx';
import InvisibleBarrier from '../sections/InvisibleBarrier.jsx';
import WhatIsHypnoReiki from '../sections/WhatIsHypnoReiki.jsx';
import WhyChooseIoce from '../sections/WhyChooseIoce.jsx';
import JourneyRoadmap from '../sections/JourneyRoadmap.jsx';
import WhoCanBenefit from '../sections/WhoCanBenefit.jsx';
import TransformationStories from '../sections/TransformationStories.jsx';
import TransformationEcosystem from '../sections/TransformationEcosystem.jsx';
import ConsultationOptions from '../sections/ConsultationOptions.jsx';
import FaqSection from '../sections/FaqSection.jsx';
import IocePromise from '../sections/IocePromise.jsx';
import BookingFlow from '../sections/booking/BookingFlow.jsx';
import ContactSection from '../sections/ContactSection.jsx';

const businessSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'IOCE — Institute Of Consciousness Engineering',
  description:
    'IOCE integrates internationally accredited Clinical Hypnotherapy with Authentic Usui Reiki to consciously re-engineer the thoughts within the subconscious, creating meaningful and lasting transformations.',
  areaServed: 'Worldwide',
  priceRange: '₹₹',
  parentOrganization: 'ChemBridge Global',
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json">{JSON.stringify(businessSchema)}</script>
      <Hero />
      <WhoCanBenefit />
      <InvisibleBarrier />
      <WhatIsHypnoReiki />
      <WhyChooseIoce />
      <JourneyRoadmap />
      <TransformationStories />
      <ConsultationOptions />
      <TransformationEcosystem />
      <FaqSection />
      <IocePromise />
      <BookingFlow />
      <ContactSection />
    </>
  );
}
