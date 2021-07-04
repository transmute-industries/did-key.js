import { ParticlesBlock, params } from '../components/Particles';
import { Theme } from '../components/Theme';

import { KeySummariesPanel } from '../components/KeySummariesPanel';
import { MethodSummaryPanel } from '../components/MethodSummaryPanel';
import { Footer } from '../components/Footer';

import { Hero } from '../components/Hero';

export function Home() {
  return (
    <div className="Home">
      <Theme>
        <div
          style={{
            position: 'absolute',
            width: '100%',
            color: 'white',
          }}
        >
          <Hero />
        </div>
        <div
          style={{
            backgroundImage: "url('./splash-1.png')",
            backgroundSize: 'cover',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backgroundBlendMode: 'darken',
            backgroundRepeat: 'none',
            width: '100%',
          }}
        >
          <ParticlesBlock params={params} />
        </div>
        <KeySummariesPanel />
        <MethodSummaryPanel />
        <Footer />
      </Theme>
    </div>
  );
}
