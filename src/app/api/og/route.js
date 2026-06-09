import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

const getPillarLabel = (pillar) => {
  if (!pillar) return '';
  const p = pillar.toLowerCase();
  if (p === 'tiny-systems' || p === 'tools & templates' || p === 'tools-and-templates') return 'TOOLS & TEMPLATES';
  if (p === 'glitchwork' || p === 'digital life') return 'DIGITAL LIFE';
  if (p === 'unmasked-life' || p === 'unmasked life') return 'UNMASKED LIFE';
  return pillar.toUpperCase();
};

const getPillarColor = (pillar, override) => {
  if (override) return override;
  if (!pillar) return '#9E0048';
  const p = pillar.toLowerCase();
  if (p === 'tiny-systems' || p === 'tools & templates' || p === 'tools-and-templates') return '#F0E8D8';
  if (p === 'glitchwork' || p === 'digital life') return '#0E5A6B';
  return '#9E0048';
};

const getBrainStateLabel = (state) => {
  if (!state) return '';
  const s = state.toLowerCase().replace('_', '-');
  if (s === 'burned-out') return 'BURNED OUT';
  if (s === 'hyperfocus') return 'HYPERFOCUS';
  if (s === 'masking') return 'MASKING';
  if (s === 'spiraling' || s === 'spiralling') return 'SPIRALLING';
  if (s === 'on-a-roll') return 'ON A ROLL';
  return state.toUpperCase();
};

const getHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'neurodivers³';
    const pillar = searchParams.get('pillar') || '';
    const brainState = searchParams.get('brainState') || '';
    const accentWord = searchParams.get('accentWord') || '';
    const accentOverride = searchParams.get('accentOverride') || '';

    const readTime = searchParams.get('readTime') || '5 MIN';
    const date = searchParams.get('date') || '24 MAY 2026';
    const postNumber = searchParams.get('postNumber') || '';

    const pillarColor = getPillarColor(pillar, accentOverride);
    const pillarLabel = getPillarLabel(pillar);
    const stateLabel = getBrainStateLabel(brainState);
    const eyebrow = [pillarLabel, stateLabel].filter(Boolean).join(' · ');

    let themeBg = pillarColor;
    let themeTextColor = '#FFFFFF';
    let watermarkColor = 'rgba(255, 255, 255, 0.05)';
    let gridLineColor = 'rgba(255, 255, 255, 0.1)';
    let textMutedColor = 'rgba(255, 255, 255, 0.7)';
    let textMutedStrongColor = 'rgba(255, 255, 255, 0.8)';
    let themeAccentColor = '#FF007F';

    const p = pillar?.toLowerCase() || '';
    if (p === 'unmasked-life' || p === 'unmasked life') {
      themeBg = '#9E0048';
      themeTextColor = '#FFFFFF';
      watermarkColor = 'rgba(255, 255, 255, 0.05)';
      gridLineColor = 'rgba(255, 255, 255, 0.1)';
      textMutedColor = 'rgba(255, 255, 255, 0.7)';
      textMutedStrongColor = 'rgba(255, 255, 255, 0.8)';
      themeAccentColor = '#FF007F';
    } else if (p === 'glitchwork' || p === 'digital life') {
      themeBg = '#0E5A6B';
      themeTextColor = '#FFFFFF';
      watermarkColor = 'rgba(255, 255, 255, 0.05)';
      gridLineColor = 'rgba(255, 255, 255, 0.1)';
      textMutedColor = 'rgba(255, 255, 255, 0.7)';
      textMutedStrongColor = 'rgba(255, 255, 255, 0.8)';
      themeAccentColor = '#00E5FF';
    } else if (p === 'tiny-systems' || p === 'tools & templates' || p === 'tools-and-templates') {
      themeBg = '#F0E8D8';
      themeTextColor = '#000000';
      watermarkColor = 'rgba(0, 0, 0, 0.05)';
      gridLineColor = 'rgba(0, 0, 0, 0.1)';
      textMutedColor = 'rgba(0, 0, 0, 0.7)';
      textMutedStrongColor = 'rgba(0, 0, 0, 0.8)';
      themeAccentColor = '#FF007F';
    } else {
      themeBg = '#9E0048';
      themeTextColor = '#FFFFFF';
      watermarkColor = 'rgba(255, 255, 255, 0.05)';
      gridLineColor = 'rgba(255, 255, 255, 0.1)';
      textMutedColor = 'rgba(255, 255, 255, 0.7)';
      textMutedStrongColor = 'rgba(255, 255, 255, 0.8)';
      themeAccentColor = '#FF007F';
    }

    const displayPostNumber = postNumber 
      ? `№ ${postNumber.toString().padStart(3, '0')}` 
      : `№ ${(getHash(title) % 100 + 1).toString().padStart(3, '0')}`;

    const words = title.trim().split(/\s+/);
    const cleanWord = (w) => w.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    const target = accentWord ? cleanWord(accentWord) : '';

    let accentIndex = -1;
    if (target) {
      accentIndex = words.findIndex(w => cleanWord(w) === target);
    }
    if (accentIndex === -1 && words.length > 0) {
      accentIndex = words.length - 1;
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: themeBg,
            color: themeTextColor,
            padding: '80px',
            boxSizing: 'border-box',
            position: 'relative',
          }}
        >
          {/* Background ³ watermark */}
          <div
            style={{
              position: 'absolute',
              bottom: '-40px',
              right: '80px',
              fontSize: '340px',
              fontWeight: 900,
              color: watermarkColor,
              lineHeight: 1,
            }}
          >
            ³
          </div>

          {/* Brutalist Grid blueprint lines */}
          <div
            style={{
              position: 'absolute',
              top: '28%',
              left: 0,
              right: 0,
              height: '1px',
              backgroundColor: gridLineColor,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '28%',
              top: 0,
              bottom: 0,
              width: '1px',
              backgroundColor: gridLineColor,
            }}
          />

          {/* Top Header Row (Eyebrow on left, POST № on right) */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              zIndex: 10,
            }}
          >
            {/* Eyebrow */}
            <div
              style={{
                display: 'flex',
                fontSize: '18px',
                fontFamily: 'monospace',
                letterSpacing: '0.2em',
                color: textMutedColor,
                textTransform: 'uppercase',
                fontWeight: 'bold',
              }}
            >
              {eyebrow ? eyebrow : 'TRANSMISSION'}
            </div>

            {/* Replaced technical log block with simple POST № 001 line */}
            <div
              style={{
                fontSize: '18px',
                fontFamily: 'monospace',
                color: textMutedStrongColor,
                textTransform: 'uppercase',
                fontWeight: 'bold',
              }}
            >
              {displayPostNumber}
            </div>
          </div>

          {/* The hairline rule between eyebrow and title */}
          <div
            style={{
              width: '100%',
              height: '1px',
              backgroundColor: gridLineColor,
              marginTop: '20px',
              marginBottom: '20px',
              zIndex: 10,
            }}
          />

          {/* Main Title Align Top-Left */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              fontSize: '76px',
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              maxWidth: '92%',
              marginTop: '20px',
              marginBottom: '20px',
              zIndex: 10,
            }}
          >
            {words.map((word, idx) => {
              const isAccented = idx === accentIndex;
              return (
                <span
                  key={idx}
                  style={{
                    color: isAccented ? themeAccentColor : themeTextColor,
                    marginRight: '22px',
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>

          {/* Bottom Row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              width: '100%',
              zIndex: 10,
            }}
          >
            {/* Meta strip bottom left */}
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '12px',
                color: textMutedColor,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
              }}
            >
              {readTime.toUpperCase()} · {date.toUpperCase()}
            </div>

            {/* Bottom Right Brand Signature */}
            <div
              style={{
                display: 'flex',
                fontSize: '24px',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: themeTextColor,
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>
                neurodivers<span style={{ color: themeTextColor, marginLeft: '2px' }}>³</span>
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('OG generation failed:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
