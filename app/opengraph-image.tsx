import { ImageResponse } from 'next/og';

export const alt = 'JT2J';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a1728',
        color: '#d3b677',
        fontSize: 160,
        border: '20px solid #d3b677',
      }}
    >
      JT2J
    </div>,
    size,
  );
}
