class MyMatrixEffect extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.canvas = document.createElement("canvas");
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.display = "block";
    this.shadowRoot.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");

    this.letters =
      "アァイィウヴエェオカガキギクグケゲコゴサザシジスズセゼソゾABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    this.fontSize = 16;
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

  resizeCanvas() {
    const rect = this.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;

    const minSide = Math.min(rect.width, rect.height);
    this.fontSize = Math.max(10, Math.floor(minSide / 25));
    this.maxTrailLength = Math.max(5, Math.floor(rect.height / this.fontSize));

    const columns = Math.floor(this.canvas.width / this.fontSize);
    this.drops = [];
    for (let x = 0; x < columns; x++) {
      this.drops[x] = Math.random() * -this.maxTrailLength;
    }
  }

  draw() {
    const ctx = this.ctx;

    // 👉 Fading trasparente: mantieni la scia, ma senza colorare lo sfondo
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

      // Corpo scia: verde
      ctx.fillStyle = "#F9CD80";
      ctx.fillText(text, x, y);

      // Ultimo carattere glow
      ctx.shadowColor = "#f5e9d3ff";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#F9CD80";
      ctx.fillText(text, x, y);
      ctx.shadowBlur = 0;

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
