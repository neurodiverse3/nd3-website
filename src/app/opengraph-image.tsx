import { ImageResponse } from 'next/og';

export const alt = 'neurodivers³';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#121212',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '80px',
        }}
      >
        {/* Background Grid Accent */}
        <div
          style={{
            position: 'absolute',
            top: '28%',
            left: 0,
            right: 0,
            height: '2px',
            background: 'rgba(255, 255, 255, 0.08)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '28%',
            top: 0,
            bottom: 0,
            width: '2px',
            background: 'rgba(255, 255, 255, 0.08)',
          }}
        />

        {/* Branding Centered Box */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: '4px solid #F4F4F2',
            padding: '60px 80px',
            background: '#121212',
            boxShadow: '12px 12px 0px #FF2E88',
          }}
        >
          <h1
            style={{
              fontSize: '80px',
              fontWeight: 900,
              color: '#F4F4F2',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'flex-start',
            }}
          >
            neurodivers
            <span
              style={{
                color: '#FF2E88',
                fontSize: '48px',
                marginLeft: '4px',
                fontWeight: 900,
              }}
            >
              3
            </span>
          </h1>
          <p
            style={{
              fontSize: '22px',
              fontFamily: 'monospace',
              color: '#A1A1AA',
              margin: '20px 0 0 0',
              textTransform: 'uppercase',
              letterSpacing: '0.25em',
            }}
          >
            Unmasked · Unfiltered · Unapologetic
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
