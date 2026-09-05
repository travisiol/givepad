/**
 * The clouds behind every page. Fixed, pointer-transparent, sitting under the
 * body gradient's stacking context — they sail left to right for minutes at a
 * time so the page reads as a place with weather rather than a background.
 */
const clouds = [
  { top: "9%", width: 620, height: 250, blur: 9, opacity: 1, duration: 150, delay: -40 },
  { top: "3%", width: 450, height: 180, blur: 9, opacity: 0.82, duration: 205, delay: -120 },
  { top: "26%", width: 700, height: 280, blur: 9, opacity: 0.7, duration: 178, delay: -75 },
  { top: "58%", width: 900, height: 360, blur: 12, opacity: 0.9, duration: 240, delay: -190 },
  { top: "74%", width: 780, height: 330, blur: 11, opacity: 0.95, duration: 196, delay: -20 },
  { top: "42%", width: 520, height: 210, blur: 10, opacity: 0.8, duration: 220, delay: -150 },
];

export function Sky() {
  return (
    <div className="sky-clouds" aria-hidden="true">
      {clouds.map((c, i) => (
        <span
          key={i}
          className="cloud"
          style={{
            top: c.top,
            width: c.width,
            height: c.height,
            filter: `blur(${c.blur}px)`,
            opacity: c.opacity,
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
