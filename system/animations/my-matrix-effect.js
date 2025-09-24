class MyMatrixEffect extends HTMLElement {
  static get observedAttributes() {
    return ["speed", "width", "height", "font-size"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.canvas = document.createElement("canvas");
    this.canvas.style.display = "block";
    this.shadowRoot.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");

    this.letters =
      "アァイィウヴエェオカガキギクグケゲコゴサザシジスズセゼソゾABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    
    this.fontSize = parseInt(this.getAttribute("font-size")) || 16;
    this.drops = [];
    this.animationId = null;
    this.maxTrailLength = 20;
    this.speed = parseFloat(this.getAttribute("speed")) || 1;
  }

  connectedCallback() {
    this.resizeCanvas();
    window.addEventListener("resize", this.resizeCanvas.bind(this));
    this.start();
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this.resizeCanvas.bind(this));
    this.stop();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "speed") this.speed = parseFloat(newValue) || 1;
    if (name === "font-size") {
      this.fontSize = parseInt(newValue) || 16;
      this.resetDrops();
    }
    if (name === "width" || name === "height") {
      this.resizeCanvas();
    }
  }

  parseSize(value, parentSize) {
    if (!value) return parentSize;
    if (value.endsWith("px")) return parseFloat(value);
    if (value.endsWith("vw")) return (parseFloat(value) / 100) * window.innerWidth;
    return parseFloat(value);
  }

  resizeCanvas() {
    const rect = this.getBoundingClientRect();
    const widthAttr = this.getAttribute("width");
    const heightAttr = this.getAttribute("height");

    this.canvas.width = this.parseSize(widthAttr, rect.width);
    this.canvas.height = this.parseSize(heightAttr, rect.height);

    this.resetDrops();
  }

  resetDrops() {
    const columns = Math.floor(this.canvas.width / this.fontSize);
    this.maxTrailLength = Math.max(5, Math.floor(this.canvas.height / this.fontSize));
    this.drops = [];
    for (let x = 0; x < columns; x++) {
      this.drops[x] = Math.random() * -this.maxTrailLength;
    }
  }

  draw() {
    const ctx = this.ctx;

    // Fading trasparente: mantiene la scia ma senza accumulare glow
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.globalCompositeOperation = "source-over";

    ctx.font = this.fontSize + "px monospace";

    for (let i = 0; i < this.drops.length; i++) {
      const text = this.letters.charAt(
        Math.floor(Math.random() * this.letters.length)
      );
      const x = i * this.fontSize;
      const y = this.drops[i] * this.fontSize;

      // Corpo scia: colore principale
      ctx.fillStyle = "#F9CD80";
      ctx.fillText(text, x, y);

      // Glow solo per l'ultimo carattere
      if (Math.random() > 0.8) { // puoi regolare la frequenza del glow
        ctx.save();
        ctx.shadowColor = "#f5e9d3ff";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "#F9CD80";
        ctx.fillText(text, x, y);
        ctx.restore();
      }

      if (this.drops[i] * this.fontSize > this.canvas.height) {
        if (Math.random() > 0.975) {
          this.drops[i] = Math.random() * -this.maxTrailLength;
        }
      }

      this.drops[i] += this.speed;
    }

    this.animationId = requestAnimationFrame(this.draw.bind(this));
  }

  start() {
    if (!this.animationId) this.draw();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}

customElements.define("my-matrix-effect", MyMatrixEffect);
