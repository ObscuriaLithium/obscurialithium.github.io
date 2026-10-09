interface Mote {
  x: number; y: number; vx: number; vy: number;
  life: number; ttl: number; size: number; hue: number; phase: number; star: boolean; rot: number; spin: number;
}

interface Orbiter {
  angle: number; speed: number; rx: number; ry: number; tilt: number;
  size: number; phase: number; trail: { x: number; y: number }[];
}

const TAU = Math.PI * 2;
const MAX_MOTES = 140;
const ORBITERS = 9;
const TRAIL = 7;
const PX = 3;
const COLORS = ['#7f64f0', '#b46cf2', '#ff7ad9', '#ffc2ee'];
const CORE = '#ffe3f6';

export function initHeroMagic(hero: HTMLElement, canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const glow = makeGlow('200,110,240');
  let spawnDebt = 0;
  const motes: Mote[] = [];
  const orbiters: Orbiter[] = [];
  let w = 0, h = 0, dpr = 1;
  let logo = { x: 0, y: 0, r: 0 };
  let title = { x: 0, y: 0, w: 0, h: 0 };
  let running = false, last = 0, raf = 0, burstAt = 3;
  let t = 0;

  function makeGlow(rgb: string) {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d')!;
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, `rgba(${rgb},1)`);
    grad.addColorStop(0.25, `rgba(${rgb},.35)`);
    grad.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    return c;
  }

  function measure() {
    const box = hero.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = box.width; h = box.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

    const img = hero.querySelector('.ob-hero-logo')?.getBoundingClientRect();
    const head = hero.querySelector('.ob-hero-titles')?.getBoundingClientRect();
    if (img) logo = { x: img.left - box.left + img.width / 2, y: img.top - box.top + img.height / 2, r: img.width / 2 };
    if (head) title = { x: head.left - box.left, y: head.top - box.top, w: head.width, h: head.height };

    if (!orbiters.length) {
      for (let i = 0; i < ORBITERS; i++) {
        orbiters.push({
          angle: (i / ORBITERS) * TAU,
          speed: (0.35 + Math.random() * 0.45) * (i % 2 ? 1 : -1),
          rx: 1.05 + Math.random() * 0.45,
          ry: 0.45 + Math.random() * 0.5,
          tilt: Math.random() * Math.PI,
          size: 5 + Math.random() * 6,
          phase: Math.random() * TAU,
          trail: [],
        });
      }
    }
  }

  function spawn(x: number, y: number, vx: number, vy: number, ttl: number, size: number, hue = Math.random()) {
    if (motes.length >= MAX_MOTES) motes.shift();
    motes.push({ x, y, vx, vy, life: 0, ttl, size, hue, phase: Math.random() * TAU, star: size > 2.8 && Math.random() < 0.18, rot: Math.random() * TAU, spin: (Math.random() - 0.5) * 1.2 });
  }

  function spawnRiser() {
    const fromLogo = Math.random() < 0.5;
    if (fromLogo) {
      const a = Math.random() * TAU, d = Math.sqrt(Math.random()) * logo.r * 0.9;
      spawn(logo.x + Math.cos(a) * d, logo.y + Math.sin(a) * d * 0.9,
        (Math.random() - 0.5) * 8, -(10 + Math.random() * 18), 2.5 + Math.random() * 2.5, 2 + Math.random() * 3.5);
    } else {
      spawn(title.x + Math.random() * title.w, title.y + title.h * (0.35 + Math.random() * 0.65),
        (Math.random() - 0.5) * 6, -(6 + Math.random() * 14), 2.2 + Math.random() * 2.2, 1.5 + Math.random() * 3);
    }
  }

  function burst() {
    const n = 22;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU + Math.random() * 0.3;
      const s = 40 + Math.random() * 50;
      spawn(logo.x + Math.cos(a) * logo.r * 0.7, logo.y + Math.sin(a) * logo.r * 0.7,
        Math.cos(a) * s, Math.sin(a) * s, 1.2 + Math.random() * 0.8, 2 + Math.random() * 3, 0.9);
    }
  }

  function step(dt: number) {
    t += dt;
    burstAt -= dt;
    if (burstAt <= 0) { burst(); burstAt = 5 + Math.random() * 4; }

    spawnDebt += 14 * dt;
    while (spawnDebt >= 1) { spawnRiser(); spawnDebt--; }

    for (let i = motes.length - 1; i >= 0; i--) {
      const m = motes[i];
      m.life += dt;
      if (m.life >= m.ttl) { motes.splice(i, 1); continue; }
      m.vx += Math.sin(t * 1.6 + m.phase) * 14 * dt;
      m.vy -= 4 * dt;
      m.vx *= 1 - 0.8 * dt; m.vy *= 1 - 0.5 * dt;

      m.x += m.vx * dt; m.y += m.vy * dt;
      m.rot += m.spin * dt;
    }

    for (const o of orbiters) {
      o.angle += o.speed * dt;
      const r = logo.r;
      const ex = Math.cos(o.angle) * r * o.rx, ey = Math.sin(o.angle) * r * o.ry;
      const ct = Math.cos(o.tilt), st = Math.sin(o.tilt);
      const x = logo.x + ex * ct - ey * st, y = logo.y + ex * st + ey * ct;
      o.trail.unshift({ x, y });
      if (o.trail.length > TRAIL) o.trail.pop();
    }
  }

  function cell(x: number, y: number, color: string, alpha: number) {
    if (alpha <= 0.01) return;
    ctx!.globalAlpha = Math.min(1, alpha);
    ctx!.fillStyle = color;
    ctx!.fillRect(x * PX - PX / 2, y * PX - PX / 2, PX, PX);
  }

  function at(x: number, y: number, rot: number, scale: number, draw: () => void) {
    ctx!.save();
    ctx!.translate(x, y);
    ctx!.rotate(rot);
    ctx!.scale(scale, scale);
    draw();
    ctx!.restore();
  }

  function sparkle(color: string, alpha: number) {
    cell(0, 0, CORE, alpha);
    cell(1, 0, CORE, alpha); cell(-1, 0, CORE, alpha);
    cell(0, 1, CORE, alpha); cell(0, -1, CORE, alpha);
    for (let i = 2; i <= 4; i++) {
      const a = alpha * (1 - (i - 1) * 0.25);
      cell(i, 0, color, a); cell(-i, 0, color, a);
      cell(0, i, color, a); cell(0, -i, color, a);
    }
    cell(1, 1, color, alpha * 0.45); cell(-1, 1, color, alpha * 0.45);
    cell(1, -1, color, alpha * 0.45); cell(-1, -1, color, alpha * 0.45);
  }

  function chip(n: number, color: string, alpha: number) {
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      cell(i - (n - 1) / 2, j - (n - 1) / 2, color, alpha);
    }
  }

  function halo(x: number, y: number, size: number, alpha: number) {
    ctx!.globalAlpha = alpha;
    ctx!.drawImage(glow, x - size, y - size, size * 2, size * 2);
  }

  function draw() {
    ctx!.clearRect(0, 0, w, h);
    ctx!.globalCompositeOperation = 'lighter';

    const pulse = 0.5 + 0.5 * Math.sin(t * 1.2);
    halo(logo.x, logo.y, logo.r * 1.4, 0.05 + pulse * 0.04);

    for (const m of motes) {
      const k = m.life / m.ttl;
      const fade = Math.sin(Math.min(1, k) * Math.PI);
      const twinkle = 0.8 + 0.2 * Math.sin(t * 3 + m.phase);
      const color = COLORS[Math.min(COLORS.length - 1, Math.floor(m.hue * COLORS.length))];
      const a = fade * twinkle;
      if (m.star) {
        halo(m.x, m.y, PX * 7, a * 0.1);
        at(m.x, m.y, m.rot, (0.6 + 0.8 * fade) * (m.size / 3.5 + 0.5) * 0.5, () => sparkle(color, a * 0.7));
      } else {
        halo(m.x, m.y, PX * 4, a * 0.05);
        at(m.x, m.y, m.rot, 0.7, () => chip(m.size > 2.6 ? 2 : 1, color, a));
      }
    }

    orbiters.forEach((o, idx) => {
      const depth = 0.5 + 0.5 * Math.sin(o.angle + o.phase);
      for (let i = o.trail.length - 1; i >= 1; i--) {
        const p = o.trail[i];
        at(p.x, p.y, o.angle, 1, () => chip(1, COLORS[0], (1 - i / o.trail.length) * (0.3 + depth * 0.5)));
      }
      const head = o.trail[0];
      if (head) {
        halo(head.x, head.y, PX * 5, 0.08 + depth * 0.06);
        if (idx % 3 === 0) at(head.x, head.y, o.angle * 2, (0.5 + depth * 0.4) * 0.5, () => sparkle(COLORS[3], 0.5 + depth * 0.3));
        else at(head.x, head.y, o.angle, 0.7, () => chip(depth > 0.5 ? 2 : 1, COLORS[3], 0.5 + depth * 0.4));
      }
    });
    ctx!.globalAlpha = 1;
    ctx!.globalCompositeOperation = 'source-over';
  }

  function frame(now: number) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    step(dt);
    draw();
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true; last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function stop() { running = false; cancelAnimationFrame(raf); }

  measure();
  if (reduced) {
    for (let i = 0; i < 40; i++) {
      spawnRiser();
      motes[motes.length - 1].life = Math.random() * motes[motes.length - 1].ttl;
    }
    t = 1;
    draw();
    return;
  }

  new ResizeObserver(measure).observe(hero);
  hero.querySelector('.ob-hero-logo')?.addEventListener('load', measure);
  document.fonts?.ready.then(measure);
  new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop())).observe(hero);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
}
