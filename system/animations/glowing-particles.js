class GlowingParticles extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["index"];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "index") {
      this.updateIndex(newVal);
    }
  }

  connectedCallback() {
    const particleCount = 80; 
    const colors = ["#F9CD80"];
    const sizes = [2, 1.2, 0.8]; // più grandi di prima
    const blurs = ["6px", "3px", "0px"]; // blur più deciso

    const particles = Array.from({ length: particleCount }, () => {
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      const blur = blurs[Math.floor(Math.random() * blurs.length)];
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = 15 + Math.random() * 15;
      const delay = Math.random() * -20;
      return { size, blur, x, y, duration, delay, color: colors[0] };
    });

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: ${this.getAttribute("index") || -1};
        }
        .particle {
          position: absolute;
          border-radius: 50%;
          background: #F9CD80;
          animation: float linear infinite;
          box-shadow: 0 0 6px rgba(249,205,128,0.9),
                      0 0 12px rgba(249,205,128,0.8),
                      0 0 20px rgba(249,205,128,0.7);
        }
        @keyframes float {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(-120vh) translateX(20px); opacity: 0; }
        }
      </style>
      ${particles
        .map(
          (p) => `
        <div class="particle"
          style="
            width:${p.size}px;
            height:${p.size}px;
            left:${p.x}%;
            top:${p.y}%;
            filter: blur(${p.blur});
            background:${p.color};
            animation-duration:${p.duration}s;
            animation-delay:${p.delay}s;
          ">
        </div>
      `
        )
        .join("")}
    `;
  }

  updateIndex(value) {
    if (this.shadowRoot) {
      this.shadowRoot.querySelector("style").textContent =
        this.shadowRoot.querySelector("style").textContent.replace(
          /z-index:.*;/,
          `z-index: ${value};`
        );
    }
  }
}

customElements.define("glowing-particles", GlowingParticles);
