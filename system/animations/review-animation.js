class ReviewAnimation extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.originalLines = [
      'consol.log("H3llo W0rld");',
      'functon greet(name){',
      '  retrn "Hi, " + name;',
      '}',
      'const user = "Alce";',
      'if (usr) {',
      '  console.log(greet(user));',
    ];
    this.correctedLines = [
      'console.log("Hello World");',
      'function greet(name) {',
      '  return "Hi, " + name;',
      '}',
      'const user = "Alice";',
      'if (user) {',
      '  console.log(greet(user));',
    ];
    this.displayLines = [...this.originalLines];
    this.scanIndex = -1;
    this.glowIndices = [];
  }

  static get observedAttributes() {
    return ["scale"];
  }

  attributeChangedCallback() {
    this.render();
  }

  connectedCallback() {
    this.render();
    this.runScanner();
  }

  diffIndices(a, b) {
    const out = [];
    const n = Math.max(a.length, b.length);
    for (let i = 0; i < n; i++) {
      const ca = a[i] ?? "";
      const cb = b[i] ?? "";
      if (ca !== cb && i < a.length) out.push(i);
    }
    return out;
  }

  runScanner() {
    const hold = Number(this.getAttribute("hold-ms")) || 150;
    const gap = Number(this.getAttribute("gap-ms")) || 40;
    const startDelay = Number(this.getAttribute("start-delay-ms")) || 120;

    let i = 0;
    const step = () => {
      if (i >= this.originalLines.length) return;
      this.scanIndex = i;
      this.glowIndices = this.diffIndices(this.originalLines[i], this.correctedLines[i]);
      this.render();

      setTimeout(() => {
        this.displayLines[i] = this.correctedLines[i];
        this.glowIndices = [];
        this.render();
        i++;
        setTimeout(step, gap);
      }, hold);
    };

    setTimeout(step, startDelay);
  }

  render() {
    const L = this.originalLines.length;
    const LINE_H = 26;
    const PAD_Y = 12;
    const containerH = PAD_Y * 2 + L * LINE_H;
    const scale = parseFloat(this.getAttribute("scale")) || 1;

    this.shadowRoot.innerHTML = `
      <style>
        .scale-wrapper {
          transform: scale(${scale});
          transform-origin: top left;
          display: inline-block;
        }
        .code-wrap {
          position: relative;
          width: fit-content;
          height: ${containerH}px;
          padding: ${PAD_Y}px 14px;
          border-radius: 12px;
          background: #1e1f2557;
          border: 1px solid #2a2b32;
          box-shadow: inset 0 1px 2px rgba(255,255,255,0.05);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
          color: #e5e7eb;
          overflow: hidden;
        }
        .lines { position: relative; z-index: 1; }
        .code-line {
          display: flex;
          gap: 12px;
          align-items: center;
          white-space: pre;
        }
        .ln {
          width: 28px;
          color: #9aa0a6;
          text-align: right;
          user-select: none;
          opacity: .7;
        }
        .scanner {
          position: absolute;
          left: 0;
          width: 100%;
          background: linear-gradient(90deg,
            rgba(249,205,128,0) 0%,
            rgba(249,205,128,0.20) 18%,
            rgba(249,205,128,0.40) 48%,
            rgba(249,205,128,0.20) 82%,
            rgba(249,205,128,0) 100%);
          box-shadow:
            0 0 22px rgba(249,205,128,0.65),
            0 0 36px rgba(249,205,128,0.9),
            inset 0 0 14px rgba(249,205,128,0.5);
          border-radius: 6px;
          z-index: 0;
          mix-blend-mode: screen;
          pointer-events: none;
          backdrop-filter: blur(3px);
          animation: shimmer 0.2s linear infinite;
        }
        @keyframes shimmer {
          0% { filter: brightness(1); }
          50% { filter: brightness(1.1); }
          100% { filter: brightness(1); }
        }
        .glow-err {
          color: #3b82f6;
          text-shadow: 0 0 12px rgba(59,130,246,1),
                       0 0 24px rgba(59,130,246,0.95),
                       0 0 36px rgba(59,130,246,0.85);
          transition: color .2s ease, text-shadow .2s ease;
        }
      </style>
      <div class="scale-wrapper">
        <div class="code-wrap">
          ${this.scanIndex >= 0 ? `<div class="scanner" style="top:${PAD_Y + this.scanIndex * LINE_H}px;height:${LINE_H}px"></div>` : ""}
          <div class="lines">
            ${this.displayLines.map((line, i) => `
              <div class="code-line" style="height:${LINE_H}px;line-height:${LINE_H}px">
                <span class="ln">${String(i+1).padStart(2,"0")}</span>
                <span class="code">
                  ${i === this.scanIndex
                    ? line.split("").map((ch,j)=>`<span class="${this.glowIndices.includes(j)?"glow-err":""}">${ch}</span>`).join("")
                    : line}
                </span>
              </div>`).join("")}
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("review-animation", ReviewAnimation);
