import Reveal from '../components/Reveal.jsx';
import Card from '../components/Card.jsx';
import LazyVideo from '../components/LazyVideo.jsx';
import { VIDEO_ASSETS } from '../lib/videoAssets.js';

const STORIES = [
  { name: 'Rahul', location: 'Mumbai, India', outcome: 'Overcame chronic work stress and regained focus.', asset: VIDEO_ASSETS.testimonialRahul, poster: '/posters/testimonial-rahul.jpg' },
  { name: 'Shweta', location: 'Mumbai, India', outcome: 'Resolved long-standing confidence challenges.', asset: VIDEO_ASSETS.testimonialShweta, poster: '/posters/testimonial-shweta.jpg' },
  { name: 'Rajesh', location: 'Bengaluru, India', outcome: 'Broke a cycle of limiting beliefs around leadership.', asset: VIDEO_ASSETS.testimonialRajesh, poster: '/posters/testimonial-rajesh.jpg' },
  { name: 'Karishma', location: 'Delhi NCR, India', outcome: 'Found lasting relief from anxiety.', asset: VIDEO_ASSETS.testimonialKarishma, poster: '/posters/testimonial-karishma.jpg' },
];

export default function TransformationStories() {
  return (
    <section className="section" aria-labelledby="stories-heading">
      <div className="container">
        <Reveal as="h2" id="stories-heading" className="section-heading section-heading--center">
          Transformation Stories
        </Reveal>

        <div className="card-grid stories-grid">
          {STORIES.map((story, index) => (
            <Reveal key={story.name} as={Card} delay={index * 100} className="story-card">
              <LazyVideo
                asset={story.asset}
                mode="content"
                poster={story.poster}
                aria-label={`${story.name}'s transformation story`}
              />
              <h3 className="story-card__name">{story.name}</h3>
              <p className="story-card__location">{story.location}</p>
              <p className="story-card__outcome">{story.outcome}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
