class LineaElement extends HTMLElement {
  static get observedAttributes() {
    return [
      "impulse", "impulse-number", "ray", "back-and-forth", "speed",
      "line-width", "path-d", "pulse-radius",
      "color", "gradient-start", "gradient-mid", "gradient-end"
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._raf = null;
    this._running = false;
    this._render();
  }

  connectedCallback() { this._setup(); }
  disconnectedCallback() { if (this._raf) cancelAnimationFrame(this._raf); }
  attributeChangedCallback() { this._render(); this._setup(); }

  _render() {
    // --- Config letta dagli attributi ---
    const impulseAttr     = this.getAttribute("impulse");
    const rayAttr         = this.getAttribute("ray"); // compat
    const impulsesOn      = (impulseAttr === null || impulseAttr === "" || impulseAttr === "true") || (rayAttr === "true");
    const count           = Math.max(1, parseInt(this.getAttribute("impulse-number") || "1", 10));
    const backAndForth    = this.getAttribute("back-and-forth") || "backshot";
    const speed           = parseFloat(this.getAttribute("speed") || "2");
    const lineWidth       = parseFloat(this.getAttribute("line-width") || "6");
    const pathD           = this.getAttribute("path-d") || "M20 150 L380 150";
    const pulseRadius     = parseFloat(this.getAttribute("pulse-radius") || (lineWidth * 1.2));
    const color           = this.getAttribute("color") || "#00FFC8";
    // Se specificati, i gradient-* vincono su color. Altrimenti usiamo 'color' con opacità.
    const gStart          = this.getAttribute("gradient-start") || color;
    const gMid            = this.getAttribute("gradient-mid")   || color;
    const gEnd            = this.getAttribute("gradient-end")   || color;

    this._cfg = { impulsesOn, count, backAndForth, speed, lineWidth, pathD, pulseRadius };

    // --- Markup ---
    // costruiamo N cerchi impulso
    const rays = impulsesOn
      ? Array.from({ length: count }, (_, i) =>
          `<circle class="ray" data-index="${i}"
                   r="${pulseRadius}"
                   fill="url(#pulseGradient)"
                   filter="url(#glow)"
                   mask="url(#pathMask)"></circle>`).join("")
      : "";

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: inline-block; }
        svg { width: 100%; height: 100%; }

        /* linea base visibile */
        #basePath {
          stroke: rgba(255,255,255,0.3);
          stroke-width: ${lineWidth};
          stroke-linecap: round;
          stroke-dasharray: 10 8;
          fill: none;
        }
      </style>

      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
        <defs>
          <!-- Blur glow -->
          <filter id="glow" filterUnits="userSpaceOnUse" x="-200%" y="-200%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="8" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <!-- Sfumatura radiale per l'impulso -->
          <radialGradient id="pulseGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stop-color="${gMid}"   stop-opacity="1"/>
            <stop offset="60%"  stop-color="${gMid}"   stop-opacity="0.9"/>
            <stop offset="100%" stop-color="${gStart}" stop-opacity="0"/>
          </radialGradient>

          <!-- Maschera: confina gli impulsi nello spessore del path -->
          <mask id="pathMask" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">
            <path id="maskPath" d="${pathD}" stroke="white"
                  stroke-width="${lineWidth}" stroke-linecap="round" fill="none"/>
          </mask>
        </defs>

        <!-- Tracciato visibile -->
        <path id="basePath" d="${pathD}"></path>

        <!-- Impulsi -->
        ${rays}
      </svg>
    `;
  }

  _setup() {
    if (this._raf) cancelAnimationFrame(this._raf);
    this._running = false;

    const path  = this.shadowRoot.querySelector("#basePath");
    const nodes = Array.from(this.shadowRoot.querySelectorAll(".ray"));

    if (path && nodes.length && this._cfg.impulsesOn) {
      this._animateMany(path, nodes, this._cfg);
    }
  }

  _animateMany(path, nodes, cfg) {
    const length = path.getTotalLength();
    if (!Number.isFinite(length) || length <= 0) return;

    // progressi iniziali equispaziati lungo il path
    const gap   = length / cfg.count;
    const prog  = nodes.map((_, i) => i * gap);
    const alive = nodes.map(() => true);
    let dir     = 1; // tutti nella stessa direzione per coerenza

    this._running = true;

    const step = () => {
      if (!this._running) return;

      let anyAlive = false;

      nodes.forEach((node, i) => {
        if (!alive[i]) return;

        const p = path.getPointAtLength(Math.max(0, Math.min(length, prog[i])));
        node.setAttribute("cx", String(p.x));
        node.setAttribute("cy", String(p.y));

        prog[i] += cfg.speed * dir;

        if (prog[i] >= length) {
          prog[i] = length;
          this.dispatchEvent(new CustomEvent("ray-complete", { bubbles: true, detail: { index: i, at: "end" } }));
          if (cfg.backAndForth === "backshot") {
            // invertiamo per tutti una volta che il front tocca l'estremo
            dir = -1;
          } else {
            alive[i] = false; // ferma questo impulso
          }
        } else if (prog[i] <= 0) {
          prog[i] = 0;
          this.dispatchEvent(new CustomEvent("ray-complete", { bubbles: true, detail: { index: i, at: "start" } }));
          if (cfg.backAndForth === "backshot") {
            dir = 1;
          } else {
            alive[i] = false;
          }
        }

        anyAlive = anyAlive || alive[i];
      });

      if (!anyAlive) { this._running = false; return; }
      this._raf = requestAnimationFrame(step);
    };

    this._raf = requestAnimationFrame(step);
  }
}

customElements.define("linea-element", LineaElement);
