/**
 * A foil-balloon renderer.
 *
 * The SVG-filter approach this replaces used a blurred alpha as its height
 * field, which is why it read as gel: a Gaussian is soft everywhere, and a
 * balloon is not. A balloon is a tube with a circular cross-section and a hard
 * crease where the two sheets are welded.
 *
 * So: take the exact euclidean distance from every pixel to the edge of its
 * glyph, turn that distance into a circular profile, shade it with real
 * Blinn-Phong, and darken the last sliver into a seam. Each letter is rendered
 * and lit on its own and then painted left to right, so where two letters
 * overlap you see the front one's seam and a contact shadow — the way balloons
 * in a bunch sit against each other, rather than melting into one blob.
 *
 * Everything is derived from the string, so the wordmark still renames itself.
 *
 * The per-pixel loop is written for speed rather than elegance — no `hypot`,
 * no `pow`, no closures, no bounds checks — and the letters are rendered one
 * per task, so the main thread is never held for more than a few milliseconds
 * at a time.
 */

export type BalloonOptions = {
  /** rendered height of one em, in device pixels; everything scales off this */
  fontSize?: number;
  fontFamily?: string;
  /** fraction of an em the letters overlap by */
  tracking?: number;
  /** body colour and the tint its creases fall towards */
  base?: [number, number, number];
  deep?: [number, number, number];
};

const DEFAULTS = {
  fontSize: 420,
  tracking: -0.055,
  base: [252, 118, 176] as [number, number, number],
  deep: [158, 20, 92] as [number, number, number],
};

const yieldToBrowser = () => new Promise<void>((r) => setTimeout(r, 0));

/**
 * Scratch canvases, made once and resized per glyph.
 *
 * `willReadFrequently` is the whole ballgame here: without it the browser puts
 * the surface on the GPU and every getImageData is a synchronous readback,
 * which costs more than all the maths on this page put together.
 */
let scratch: { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } | null = null;
let probeCtx: CanvasRenderingContext2D | null = null;

function scratchCtx(w: number, h: number): CanvasRenderingContext2D | null {
  if (!scratch) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    scratch = { canvas, ctx };
  }
  scratch.canvas.width = w;
  scratch.canvas.height = h;
  scratch.ctx.clearRect(0, 0, w, h);
  return scratch.ctx;
}

function probe(font: string): CanvasRenderingContext2D | null {
  if (!probeCtx) {
    probeCtx = document.createElement("canvas").getContext("2d");
  }
  if (probeCtx) probeCtx.font = font;
  return probeCtx;
}

/* ------------------------------------------------------------------ *
 * exact euclidean distance transform (Felzenszwalb & Huttenlocher)
 * ------------------------------------------------------------------ */

const INF = 1e20;

function edt1d(f: Float64Array, d: Float64Array, v: Int32Array, z: Float64Array, n: number) {
  v[0] = 0;
  z[0] = -INF;
  z[1] = INF;
  let k = 0;

  for (let q = 1; q < n; q++) {
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    while (s <= z[k]) {
      k--;
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    }
    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = INF;
  }

  k = 0;
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++;
    const dx = q - v[k];
    d[q] = dx * dx + f[v[k]];
  }
}

/** distance from each inside pixel to the nearest outside pixel */
function distanceField(inside: Uint8Array, w: number, h: number): Float32Array {
  const grid = new Float32Array(w * h);
  for (let i = 0; i < grid.length; i++) grid[i] = inside[i] ? INF : 0;

  const n = Math.max(w, h);
  const f = new Float64Array(n);
  const d = new Float64Array(n);
  const v = new Int32Array(n);
  const z = new Float64Array(n + 1);

  for (let y = 0; y < h; y++) {
    const row = y * w;
    for (let x = 0; x < w; x++) f[x] = grid[row + x];
    edt1d(f, d, v, z, w);
    for (let x = 0; x < w; x++) grid[row + x] = d[x];
  }

  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) f[y] = grid[y * w + x];
    edt1d(f, d, v, z, h);
    for (let y = 0; y < h; y++) grid[y * w + x] = Math.sqrt(d[y]);
  }

  return grid;
}

/* ------------------------------------------------------------------ *
 * lighting
 * ------------------------------------------------------------------ */

function norm3(x: number, y: number, z: number): [number, number, number] {
  const l = Math.sqrt(x * x + y * y + z * z) || 1;
  return [x / l, y / l, z / l];
}

// canvas y runs down, so a negative y points up towards the window light
const [KX, KY, KZ] = norm3(-0.42, -0.78, 0.46);
const [FX, FY, FZ] = norm3(0.55, 0.62, 0.38);
const [HX, HY, HZ] = norm3(-0.42, -0.78, 1.46);

/* ------------------------------------------------------------------ *
 * one letter
 * ------------------------------------------------------------------ */

type Glyph = {
  lit: HTMLCanvasElement;
  shadow: HTMLCanvasElement;
  /** where the pen sits inside this canvas — letters line up on these, not on
   *  their bounding boxes, or an l sinks below an o */
  x: number;
  baseline: number;
  advance: number;
};

function renderGlyph(
  char: string,
  font: string,
  fontSize: number,
  base: [number, number, number],
  deep: [number, number, number]
): Glyph | null {
  const pc = probe(font);
  if (!pc) return null;
  const m = pc.measureText(char);
  const advance = m.width;

  const left = Math.ceil(m.actualBoundingBoxLeft ?? 0);
  const right = Math.ceil(m.actualBoundingBoxRight ?? advance);
  const asc = Math.ceil(m.actualBoundingBoxAscent ?? fontSize);
  const desc = Math.ceil(m.actualBoundingBoxDescent ?? fontSize * 0.3);

  // the inflation radius: half a stem, so a stem becomes one full round tube
  const R = fontSize * 0.115;
  const stroke = fontSize * 0.045;
  const pad = Math.ceil(stroke + 8);

  const w = left + right + pad * 2;
  const h = asc + desc + pad * 2;
  if (w <= 2 || h <= 2) return null;

  // the mask: the letter, fattened by a stroke so the limbs swell and the
  // counters close up the way an inflated one does
  const mc = scratchCtx(w, h);
  if (!mc) return null;
  mc.font = font;
  mc.textBaseline = "alphabetic";
  mc.fillStyle = "#fff";
  mc.strokeStyle = "#fff";
  mc.lineWidth = stroke;
  mc.lineJoin = "round";
  mc.lineCap = "round";
  mc.strokeText(char, pad + left, pad + asc);
  mc.fillText(char, pad + left, pad + asc);

  const px = mc.getImageData(0, 0, w, h).data;

  // the scratch canvas is about to be reused by the next letter, so take the
  // silhouette now: a flat copy in the shadow tint, for the contact shadow
  const shadow = document.createElement("canvas");
  shadow.width = w;
  shadow.height = h;
  const sc = shadow.getContext("2d");
  if (!sc) return null;
  const shadowImg = sc.createImageData(w, h);
  const sd = shadowImg.data;

  const inside = new Uint8Array(w * h);
  for (let i = 0, p = 3; i < inside.length; i++, p += 4) {
    const a = px[p];
    inside[i] = a > 127 ? 1 : 0;
    sd[p - 3] = deep[0];
    sd[p - 2] = deep[1];
    sd[p - 1] = deep[2];
    sd[p] = a;
  }
  sc.putImageData(shadowImg, 0, 0);

  const dist = distanceField(inside, w, h);

  // height field: a circular cross-section, flat once we are a radius deep
  const height = new Float32Array(w * h);
  for (let i = 0; i < height.length; i++) {
    if (!inside[i]) continue;
    const u = dist[i] < R ? 1 - dist[i] / R : 0;
    height[i] = Math.sqrt(1 - u * u) * R;
  }

  const lit = document.createElement("canvas");
  lit.width = w;
  lit.height = h;
  const lc = lit.getContext("2d");
  if (!lc) return null;
  const out = lc.createImageData(w, h);
  const o = out.data;

  const [br, bg, bb] = base;
  const [dr, dg, db] = deep;
  const seamR = R * 0.17;

  // the padding guarantees no glyph pixel touches the border, so the 4-way
  // gradient below never needs a bounds check
  for (let y = 1; y < h - 1; y++) {
    const row = y * w;
    for (let x = 1; x < w - 1; x++) {
      const i = row + x;
      const a = px[i * 4 + 3];
      if (a === 0) continue;

      // surface normal from the height field
      const nx = (height[i - 1] - height[i + 1]) * 0.5;
      const ny = (height[i - w] - height[i + w]) * 0.5;
      const inv = 1 / Math.sqrt(nx * nx + ny * ny + 1);
      const Nx = nx * inv;
      const Ny = ny * inv;
      const Nz = inv;

      let key = Nx * KX + Ny * KY + Nz * KZ;
      if (key < 0) key = 0;
      let fill = Nx * FX + Ny * FY + Nz * FZ;
      if (fill < 0) fill = 0;
      let hd = Nx * HX + Ny * HY + Nz * HZ;
      if (hd < 0) hd = 0;

      // one tight glint for the mylar, one broad sheen for the body —
      // by repeated squaring, because pow() per pixel is not free
      const h2 = hd * hd;
      const h4 = h2 * h2;
      const h8 = h4 * h4;
      const h16 = h8 * h8;
      const h32 = h16 * h16;
      const h64 = h32 * h32;
      const glint = h64 * h16 * h4; // hd^84
      const sheen = h16 * h4; // hd^20
      const white = 255 * (1.05 * glint + 0.4 * sheen);

      // the weld: only the last sliver before the silhouette rolls off, or the
      // whole letter goes muddy
      const d = dist[i];
      const seam = d < seamR ? d / seamR : 1;
      const shade = (0.54 + 0.6 * key + 0.18 * fill) * (0.54 + 0.46 * seam);

      let r = br * shade + white;
      let g = bg * shade + white;
      let b = bb * shade + white;

      // the crease itself picks up the shadow tint rather than just going grey
      if (seam < 0.32) {
        const k = (1 - seam / 0.32) * 0.8;
        const j = 1 - k;
        r = r * j + dr * k;
        g = g * j + dg * k;
        b = b * j + db * k;
      }

      const p = i * 4;
      o[p] = r > 255 ? 255 : r;
      o[p + 1] = g > 255 ? 255 : g;
      o[p + 2] = b > 255 ? 255 : b;
      o[p + 3] = a;
    }
  }

  lc.putImageData(out, 0, 0);
  return { lit, shadow, x: pad + left, baseline: pad + asc, advance };
}

/* ------------------------------------------------------------------ *
 * the word
 * ------------------------------------------------------------------ */

export async function drawBalloonWord(
  canvas: HTMLCanvasElement,
  text: string,
  options: BalloonOptions = {}
): Promise<boolean> {
  const fontSize = options.fontSize ?? DEFAULTS.fontSize;
  const tracking = (options.tracking ?? DEFAULTS.tracking) * fontSize;
  const base = options.base ?? DEFAULTS.base;
  const deep = options.deep ?? DEFAULTS.deep;
  const family = options.fontFamily ?? '"Baloo 2", sans-serif';
  const font = `800 ${fontSize}px ${family}`;

  const chars = [...text];
  const glyphs: (Glyph | null)[] = [];

  for (const c of chars) {
    glyphs.push(c.trim() ? renderGlyph(c, font, fontSize, base, deep) : null);
    // one letter per task: nothing here is worth a dropped frame
    await yieldToBrowser();
  }

  const layout = probe(font);
  if (!layout) return false;

  // everything hangs off one shared baseline
  const baseline = Math.max(...glyphs.map((g) => g?.baseline ?? 0));
  const placed: { g: Glyph; left: number; top: number }[] = [];
  let pen = 0;
  let minX = Infinity;
  let maxX = -Infinity;
  let maxBottom = 0;

  for (let i = 0; i < chars.length; i++) {
    const g = glyphs[i];
    if (g) {
      const left = pen - g.x;
      const top = baseline - g.baseline;
      placed.push({ g, left, top });
      minX = Math.min(minX, left);
      maxX = Math.max(maxX, left + g.lit.width);
      maxBottom = Math.max(maxBottom, top + g.lit.height);
      pen += g.advance + tracking;
    } else {
      pen += layout.measureText(chars[i]).width + tracking;
    }
  }

  if (!placed.length) return false;

  const margin = Math.ceil(fontSize * 0.06);
  canvas.width = Math.ceil(maxX - minX) + margin * 2;
  canvas.height = Math.ceil(maxBottom) + margin * 2;

  const ctx = canvas.getContext("2d");
  if (!ctx) return false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const shadowBlur = fontSize * 0.05;
  const shadowOffset = fontSize * 0.022;

  for (const { g, left, top } of placed) {
    const x = left - minX + margin;
    const y = top + margin;

    // contact shadow, so a letter in front sits *on* the one behind it
    ctx.save();
    ctx.globalAlpha = 0.26;
    ctx.filter = `blur(${shadowBlur}px)`;
    ctx.globalCompositeOperation = "source-atop";
    ctx.drawImage(g.shadow, x + shadowOffset, y + shadowOffset);
    ctx.restore();

    ctx.drawImage(g.lit, x, y);
  }

  return true;
}

