class MacDockAnimation extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // attributi (con default)
    this.items = parseInt(this.getAttribute("items") || "7", 10);
    this.iconSize = parseFloat(this.getAttribute("icon-size") || "28"); // px
    this.maxScale = parseFloat(this.getAttribute("max-scale") || "1.8");
    this.gap = this.getAttribute("gap") || "10px";
    this.sweepMs = parseInt(this.getAttribute("sweep-ms") || "1200", 10);
    this.lift = parseFloat(this.getAttribute("lift") || "14"); // px
    this.sigma = parseFloat(this.getAttribute("sigma") || "0.9"); // in "icone"
  }

  connectedCallback() {
    this.render();
    this._icons = [...this.shadowRoot.querySelectorAll(".icon")];
    this._rafId = null;
    this._dir = 1; // 1 = verso destra, -1 = verso sinistra
    this._from = 0;
    this._to = this.items - 1;
    this._last = performance.now();
    this._prog = 0; // 0..1 progress della sweep
    this._step = this._step.bind(this);
    this._rafId = requestAnimationFrame(this._step);
  }

  disconnectedCallback() {
    if (this._rafId) cancelAnimationFrame(this._rafId);
  }

  // easing tipo Apple (ease-in-out morbido)
  _easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  _applyWave(position) {
    // posizione continua del "mouse" invisibile in [0, items-1]
    const amp = this.maxScale - 1; // ampiezza extra della scala
    const twoSigma2 = 2 * this.sigma * this.sigma;

    for (let i = 0; i < this.items; i++) {
      const d = Math.abs(i - position); // distanza in icone
      const g = Math.exp(-(d * d) / twoSigma2); // gaussiana

      const s = 1 + amp * g;                // scale
      const y = -this.lift * g;             // translateY (negativo = su)
      const glow = 4 + 10 * g;              // intensità bagliore
      const alpha = 0.25 + 0.55 * g;        // opacità glow
      const border = g > 0.25 ? "#F9CD80" : "#3a3a42";

      const el = this._icons[i];
      el.style.transform = `translateY(${y}px) scale(${s})`;
      el.style.filter = `drop-shadow(0 0 ${glow}px rgba(249,205,128,${alpha}))`;
      el.style.borderColor = border;
    }
  }

  _step(now) {
    const dt = now - this._last;
    this._last = now;

    // avanza progress della sweep
    this._prog += dt / this.sweepMs;
    if (this._prog >= 1) {
      this._prog = 0;
      // inverti direzione (solo destra ⇄ sinistra)
      if (this._dir === 1) {
        this._from = this.items - 1;
        this._to = 0;
        this._dir = -1;
      } else {
        this._from = 0;
        this._to = this.items - 1;
        this._dir = 1;
      }
    }

    const t = this._easeInOut(this._prog);
    const p = this._from + (this._to - this._from) * t; // posizione continua
    this._applyWave(p);

    this._rafId = requestAnimationFrame(this._step);
  }

  render() {
    const slotSize = this.iconSize * this.maxScale; // contenitore fisso = grandezza massima
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: flex; justify-content: center; align-items: center; width: 100%; }

        .dock {
          display: flex;
          gap: ${this.gap};                   /* GAP costante */
          padding: 0.6rem 1rem;
          border-radius: 16px;
          backdrop-filter: blur(12px) saturate(180%);
          background: rgba(30, 31, 37, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: inset 0 1px 2px rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.4);
          position: relative;
          overflow: hidden;
        }

        /* linea gradiente dorata (il tuo snippet) */
        .dock::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          height: 3px;
          background: linear-gradient(
            90deg,
            rgba(249,205,128,0) 0%,
            #F9CD80 50%,
            rgba(249,205,128,0) 100%
          );
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
          z-index: 2;
          pointer-events: none;
        }

        /* Contenitore fisso: larghezza = dimensione massima scalata → nessuna sovrapposizione */
        .dock-item {
          width: ${slotSize}px;
          height: ${slotSize}px;
          display: flex;
          align-items: flex-end;   /* crescita dal basso (feeling dock) */
          justify-content: center;
          flex-shrink: 0;          /* non comprimere, gap resta fisso */
        }

        /* Icona interna che si scala */
        .icon {
          width: ${this.iconSize}px;
          height: ${this.iconSize}px;
          border-radius: 8px;
          background: #2b2b30;
          border: 1px solid #3a3a42;
          transform-origin: bottom center;
          will-change: transform, filter, border-color;
          transition: border-color 0.18s ease-in-out; /* il resto via JS per massima fluidità */
        }
      </style>

      <div class="dock">
        ${Array.from({ length: this.items }).map(() => `
          <div class="dock-item">
            <div class="icon"></div>
          </div>
        `).join("")}
      </div>
    `;
  }
}

customElements.define("mac-dock-animation", MacDockAnimation);
