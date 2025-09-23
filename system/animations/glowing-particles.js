class GlowingParticles extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const particleCount = 80; // totale particelle
    const colors = ["#F9CD80"];
    const sizes = [1, 0.7, 0.4]; // 3 grandezze
    const blurs = ["4px", "2px", "0px"]; // 3 livelli

    const particles = Array.from({ length: particleCount }, () => {
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      const blur = blurs[Math.floor(Math.random() * blurs.length)];
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = 20 + Math.random() * 20; // velocità random
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
          z-index: -1;
        }
        .particle {
          position: absolute;
          border-radius: 50%;
          background: #F9CD80;
          animation: float linear infinite;
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
}

customElements.define("glowing-particles", GlowingParticles);
