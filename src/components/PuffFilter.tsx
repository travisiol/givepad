/**
 * The filters that turn flat type into inflated foil.
 *
 * The recipe, in order: blur the alpha into a height field so the middle of a
 * stroke reads as the top of a tube, shade the body with that field so the
 * sides roll away from the light, add a hard specular streak (the giveaway
 * that it is mylar and not plastic), bounce a soft warm sheen back up from
 * below, and finally darken the silhouette so the two sheets look welded.
 *
 * Blur radii are in user units, so the same numbers read differently at 168px
 * and at 40px — hence three tunings of the same filter rather than one.
 */

type Tuning = {
  id: string;
  /** height field radius — roughly a third of the stroke width */
  bump: number;
  /** how tall the tube stands */
  scale: number;
  /** silhouette weld */
  seam: number;
};

const TUNINGS: Tuning[] = [
  { id: "puff", bump: 6.5, scale: 7, seam: 2.6 },
  { id: "puff-md", bump: 4.5, scale: 4, seam: 1.6 },
  { id: "puff-sm", bump: 3, scale: 2.6, seam: 1 },
];

function Puff({ id, bump, scale, seam }: Tuning) {
  return (
    <filter id={id} x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
      <feGaussianBlur in="SourceAlpha" stdDeviation={bump} result="bump" />

      {/* body shading — the tube turns away from the light at its edges */}
      <feDiffuseLighting
        in="bump"
        surfaceScale={scale}
        diffuseConstant="0.98"
        lightingColor="#ffffff"
        result="diff"
      >
        <feDistantLight azimuth="228" elevation="38" />
      </feDiffuseLighting>
      <feComposite in="diff" in2="SourceAlpha" operator="in" result="diffIn" />
      <feBlend in="SourceGraphic" in2="diffIn" mode="multiply" result="shaded" />

      {/* the hard highlight running along the top left of every stroke */}
      <feSpecularLighting
        in="bump"
        surfaceScale={scale}
        specularConstant="2.4"
        specularExponent="90"
        lightingColor="#ffffff"
        result="spec"
      >
        <feDistantLight azimuth="228" elevation="60" />
      </feSpecularLighting>
      <feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn" />
      <feComposite
        in="specIn"
        in2="shaded"
        operator="arithmetic"
        k1="0"
        k2="1"
        k3="1"
        k4="0"
        result="lit"
      />

      {/* bounce light off the ground, low and warm, so the underside isn't dead */}
      <feSpecularLighting
        in="bump"
        surfaceScale={scale * 0.8}
        specularConstant="0.3"
        specularExponent="10"
        lightingColor="#ffe2ef"
        result="bounce"
      >
        <feDistantLight azimuth="70" elevation="16" />
      </feSpecularLighting>
      <feComposite in="bounce" in2="SourceAlpha" operator="in" result="bounceIn" />
      <feComposite
        in="bounceIn"
        in2="lit"
        operator="arithmetic"
        k1="0"
        k2="1"
        k3="1"
        k4="0"
        result="lit2"
      />

      {/* the weld: a dark line hugging the silhouette where the sheets meet */}
      <feMorphology in="SourceAlpha" operator="erode" radius={seam} result="core" />
      <feComposite in="SourceAlpha" in2="core" operator="out" result="edge" />
      <feGaussianBlur in="edge" stdDeviation={seam * 0.85} result="edgeSoft" />
      <feFlood floodColor="#7d0f42" floodOpacity="0.7" result="seamColor" />
      <feComposite in="seamColor" in2="edgeSoft" operator="in" result="seamLine" />
      <feComposite in="seamLine" in2="lit2" operator="over" />
    </filter>
  );
}

export function PuffFilter() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <defs>
        {TUNINGS.map((t) => (
          <Puff key={t.id} {...t} />
        ))}
      </defs>
    </svg>
  );
}
