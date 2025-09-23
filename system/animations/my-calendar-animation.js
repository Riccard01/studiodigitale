class MyCalendarAnimation extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.seed = { dayIdx: 1, date: 15, statusIdx: 0 };
    this.days = ["LUN", "MAR", "MER", "GIO", "VEN", "SAB", "DOM"];
    this.statuses = ["x", "x", "ok"]; // due X e poi OK
    this.cards = [this.nextCard(), this.nextCard(), this.nextCard()];
    this.tearing = false;
  }

  static get observedAttributes() {
    return ["scale"];
  }

  attributeChangedCallback() {
    this.render();
  }

  get scale() {
    return parseFloat(this.getAttribute("scale")) || 1;
  }

  connectedCallback() {
    this.render();
    this.startLoop();
  }

  disconnectedCallback() {
    clearTimeout(this.timer);
  }

  nextCard() {
    const s = this.seed;
    const card = {
      day: this.days[s.dayIdx % this.days.length],
      num: s.date,
      status: this.statuses[s.statusIdx % this.statuses.length],
    };
    s.dayIdx = (s.dayIdx + 1) % this.days.length;
    s.date = s.date >= 31 ? 1 : s.date + 1;
    s.statusIdx = (s.statusIdx + 1) % this.statuses.length;
    return card;
  }

  startLoop() {
    const tearDuration = 600;
    const pause = 250;

    const loop = () => {
      this.tearing = true;
      this.render();
      setTimeout(() => {
        const [bottom, middle, top] = this.cards;
        const newBottom = this.nextCard();
        this.cards = [newBottom, bottom, middle];
        this.tearing = false;
        this.render();
        this.timer = setTimeout(loop, pause);
      }, tearDuration);
    };

    this.timer = setTimeout(loop, 300);
  }

  render() {
    const rotations = [-8, -5, -2];
    const getSymbol = (s) => (s === "ok" ? "✅" : "❌");
    const getColor = (s) => (s === "ok" ? "#F9CD80" : "#9CA3AF");

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          transform: scale(${this.scale});
          transform-origin: center center;
        }
        .stack {
          position: relative;
          width: 180px;
          height: 180px;
          overflow: visible;
          filter: drop-shadow(0 6px 18px rgba(0,0,0,0.45));
        }
        .page {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          padding-top: 0.8rem;
          font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
          background: rgba(30,31,37,0.55);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: inset 0 1px 2px rgba(255,255,255,0.05);
          backdrop-filter: blur(12px) saturate(180%);
          transform-origin: top left;
          transform: rotate(var(--rot)) translate(0, 0);
          opacity: 1;
        }
        .page .pin {
          position: absolute;
          width: 10px;
          height: 10px;
          top: 6px;
          left: 6px;
          background: #F9CD80;
          border-radius: 50%;
          box-shadow: 0 0 6px rgba(249,205,128,0.7);
        }
        .page .day {
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 0.08em;
          color: #E5E7EB;
          margin-top: 20px;
        }
        .page .date {
          font-weight: 800;
          font-size: 2.2rem;
          line-height: 1;
          color: #fff;
          margin: 6px 0 10px 0;
          text-shadow: 0 2px 6px rgba(0,0,0,0.45);
        }
        .page .caption {
          position: absolute;
          right: 10px;
          bottom: 8px;
          font-size: 1.1rem;
          font-weight: 700;
        }
        .tearing {
          animation: tear 600ms cubic-bezier(0.25, 0.8, 0.3, 1) forwards;
        }
        @keyframes tear {
          0% { opacity: 1; filter: blur(0px); transform: rotate(var(--rot)) translate(0,0); }
          35% { opacity: 1; filter: blur(1px); transform: rotate(calc(var(--rot) - 6deg)) translate(-15%, 10%); }
          100% { opacity: 0; filter: blur(6px); transform: rotate(calc(var(--rot) - 18deg)) translate(-140%, 100%); }
        }
      </style>

      <div class="stack">
        ${this.cards
          .map((card, i) => {
            const zIndex = i + 1;
            const tearingClass = i === 2 && this.tearing ? "tearing" : "";
            return `
              <div class="page ${tearingClass}" style="--rot: ${rotations[i]}deg; z-index:${zIndex}">
                <div class="pin"></div>
                <div class="day">${card.day}</div>
                <div class="date">${String(card.num).padStart(2, "0")}</div>
                <div class="caption" style="color:${getColor(card.status)}">${getSymbol(card.status)}</div>
              </div>
            `;
          })
          .join("")}
      </div>
    `;
  }
}

customElements.define("my-calendar-animation", MyCalendarAnimation);
