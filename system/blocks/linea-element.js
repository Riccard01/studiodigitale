class LineaElement extends HTMLElement {
  static get observedAttributes() {
    return [
      "impulse", "impulse-number", "back-and-forth", "speed",
      "line-width", "path-d", "pulse-radius", "color", "ease",
      "loop", "top", "bottom", "left", "right"
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
    const impulsesOn   = (this.getAttribute("impulse") !== "false");
    const count        = Math.max(1, parseInt(this.getAttribute("impulse-number") || "1", 10));
    const backAndForth = this.getAttribute("back-and-forth") || "backshot";
    const speed        = parseFloat(this.getAttribute("speed") || "2");
    const lineWidth    = parseFloat(this.getAttribute("line-width") || "6");
    const pathD        = this.getAttribute("path-d") || "M20 150 L380 150";
    const pulseRadius  = parseFloat(this.getAttribute("pulse-radius") || (lineWidth * 1.2));
    const color        = this.getAttribute("color") || "#FFFFFF";
    const ease         = this.getAttribute("ease") || "none";
    const loop         = this.hasAttribute("loop");

    this._cfg = { impulsesOn, count, backAndForth, speed, lineWidth, pathD, pulseRadius, ease, loop };

    const rays = impulsesOn
      ? Array.from({ length: count }, (_, i) => `
          <circle class="ray" data-index="${i}"
                  r="${pulseRadius}"
                  fill="${color}"
                  filter="url(#pallinaBlur)"
                  mask="url(#lineaTwoMask)"></circle>
        `).join("")
      : "";

    // CSS dinamico per la posizione assoluta
    const top    = this.getAttribute("top");
    const bottom = this.getAttribute("bottom");
    const left   = this.getAttribute("left");
    const right  = this.getAttribute("right");

    let positionStyle = "";
    if (top !== null || bottom !== null || left !== null || right !== null) {
      positionStyle = "position:absolute;";
      if (top    !== null) positionStyle += `top:${top};`;
      if (bottom !== null) positionStyle += `bottom:${bottom};`;
      if (left   !== null) positionStyle += `left:${left};`;
      if (right  !== null) positionStyle += `right:${right};`;
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: inline-block; ${positionStyle} }

        svg { width: 100%; height: 100%; }

        #lineaOne {
          stroke: rgba(255,255,255,0.3);
          stroke-width: ${lineWidth};
          stroke-linecap: round;
          stroke-dasharray: 10 8;
          fill: none;
        }
      </style>

      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="lineaTwoBlur">
            <feGaussianBlur stdDeviation="3"/>
          </filter>
          <filter id="pallinaBlur">
            <feGaussianBlur stdDeviation="8"/>
          </filter>
          <mask id="lineaTwoMask">
            <path d="${pathD}" stroke="white"
                  stroke-width="${lineWidth}" stroke-linecap="round"
                  fill="none" filter="url(#lineaTwoBlur)"/>
          </mask>
        </defs>

        <path id="lineaOne" d="${pathD}"></path>
        ${rays}
      </svg>
    `;
  }

  _setup() {
    if (this._raf) cancelAnimationFrame(this._raf);
    this._running = false;

    const path  = this.shadowRoot.querySelector("#lineaOne");
    const nodes = Array.from(this.shadowRoot.querySelectorAll(".ray"));

    if (path && nodes.length && this._cfg.impulsesOn) {
      if (this._cfg.loop) {
        this._animateLoop(path, nodes, this._cfg);
      } else {
        this._animateMany(path, nodes, this._cfg);
      }
    }
  }

  _applyEase(t, mode) {
    if (mode === "in")   return t * t;
    if (mode === "out")  return t * (2 - t);
    if (mode === "both") return (t < 0.5) ? 2 * t * t : -1 + (4 - 2 * t) * t;
    return t; // linear
  }

  _animateMany(path, nodes, cfg) {
    const length = path.getTotalLength();
    if (!Number.isFinite(length) || length <= 0) return;

    const gap   = length / cfg.count;
    const prog  = nodes.map((_, i) => i * gap);
    let   dir   = 1;

    this._running = true;

    const step = () => {
      if (!this._running) return;

      nodes.forEach((node, i) => {
        let rawT = prog[i] / length;
        let easedT = this._applyEase(Math.max(0, Math.min(1, rawT)), cfg.ease);
        const p = path.getPointAtLength(easedT * length);

        node.setAttribute("cx", String(p.x));
        node.setAttribute("cy", String(p.y));

        prog[i] += cfg.speed * dir;
      });

      const head = Math.max(...prog);
      const tail = Math.min(...prog);
      if (head >= length && cfg.backAndForth === "backshot") dir = -1;
      if (tail <= 0     && cfg.backAndForth === "backshot") dir =  1;

      this._raf = requestAnimationFrame(step);
    };

    this._raf = requestAnimationFrame(step);
  }

  _animateLoop(path, nodes, cfg) {
    const length = path.getTotalLength();
    if (!Number.isFinite(length) || length <= 0) return;

    const animateSingle = (node) => {
      let prog = 0;
      const dir = 1;

      const step = () => {
        if (!this._running) return;

        let rawT = prog / length;
        let easedT = this._applyEase(Math.max(0, Math.min(1, rawT)), cfg.ease);
        const p = path.getPointAtLength(easedT * length);

        node.setAttribute("cx", String(p.x));
        node.setAttribute("cy", String(p.y));

        prog += cfg.speed * dir;

        if (prog <= length) {
          requestAnimationFrame(step);
        } else {
          // restart with random delay
          setTimeout(() => animateSingle(node), Math.random() * 1000 + 300);
        }
      };

      requestAnimationFrame(step);
    };

    this._running = true;
    nodes.forEach((node) => animateSingle(node));
  }
}

customElements.define("linea-element", LineaElement);
