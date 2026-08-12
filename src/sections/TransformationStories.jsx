import Reveal from '../components/Reveal.jsx';
import Card from '../components/Card.jsx';
import LazyVideo from '../components/LazyVideo.jsx';
import { VIDEO_ASSETS } from '../lib/videoAssets.js';

const FEATURED_STORY = {
  name: 'Karishma',
  location: 'Delhi NCR, India',
  outcome: 'Found lasting relief from anxiety.',
  asset: VIDEO_ASSETS.testimonialKarishma,
  poster: '/posters/testimonial-karishma.jpg',
};

const LEFT_QUOTES = [
  {
    quote:
      'Grand Master Prashant helped me break emotional patterns I had carried for years. I feel lighter, calmer and more confident than ever before.',
    author: 'Meera, Senior Vice President, Scotland',
  },
  {
    quote:
      "What impressed me most was the structured, science-backed approach. This wasn't about motivation—it was genuine transformation.",
    author: 'Dr. Meenakshi',
  },
];

const RIGHT_QUOTES = [
  {
    quote:
      'I finally understood why I kept repeating the same patterns. HypnoReiki helped me move forward in both my career and personal life.',
    author: 'Mr. Vaishnav',
  },
  {
    quote:
      "The sessions didn't just reduce my stress—they transformed the way I respond to life's challenges.",
    author: 'Sreenivas',
  },
];

const STORIES = [
  { name: 'Rahul', location: 'Mumbai, India', outcome: 'Overcame chronic work stress and regained focus.', asset: VIDEO_ASSETS.testimonialRahul, poster: '/posters/testimonial-rahul.jpg' },
  { name: 'Shweta', location: 'Mumbai, India', outcome: 'Resolved long-standing confidence challenges.', asset: VIDEO_ASSETS.testimonialShweta, poster: '/posters/testimonial-shweta.jpg' },
  { name: 'Rajesh', location: 'Bengaluru, India', outcome: 'Broke a cycle of limiting beliefs around leadership.', asset: VIDEO_ASSETS.testimonialRajesh, poster: '/posters/testimonial-rajesh.jpg' },
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

        <div className="featured-testimonial">
          <div className="featured-testimonial__quotes">
            {LEFT_QUOTES.map((item) => (
              <QuoteCard key={item.author} {...item} />
            ))}
          </div>

          <Reveal delay={80} as={Card} className="story-card featured-testimonial__video">
            <LazyVideo
              asset={FEATURED_STORY.asset}
              mode="content"
              poster={FEATURED_STORY.poster}
              aria-label={`${FEATURED_STORY.name}'s transformation story`}
            />
            <h3 className="story-card__name">{FEATURED_STORY.name}</h3>
            <p className="story-card__location">{FEATURED_STORY.location}</p>
            <p className="story-card__outcome">{FEATURED_STORY.outcome}</p>
          </Reveal>

          <div className="featured-testimonial__quotes">
            {RIGHT_QUOTES.map((item) => (
              <QuoteCard key={item.author} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function QuoteCard({ quote, author }) {
  return (
    <Reveal as={Card} className="quote-card">
      <p className="quote-card__text">&ldquo;{quote}&rdquo;</p>
      <p className="quote-card__author">— {author}</p>
    </Reveal>
  );
}
