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
    const getSymbol = s => (s === "ok" ? "✅" : "❌");
    const getColor = s => (s === "ok" ? "#22c55e" : "#9CA3AF");

    this.shadowRoot.innerHTML = `
      <style>
        .stack {
          position: relative;
          width: 180px;   /* quadrato */
          height: 180px;  /* quadrato */
          overflow: visible;
          filter: drop-shadow(0 6px 18px rgba(0,0,0,0.35));
        }
        .page {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.15);
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
          transform-origin: top left;
          transform: rotate(var(--rot)) translate(0, 0);
          opacity: 1;
        }
        .page .pin {
          position: absolute;
          width: 10px;
          height: 10px;
          top: 4px;
          left: 4px;
          background: #555;
          border-radius: 50%;
          box-shadow: inset 0 0 2px #000;
        }
        .page .day {
          font-weight: 800;
          font-size: 0.85rem;
          letter-spacing: 0.08em;
          color: #111827; /* tinta unita grigio scuro */
          margin-top: 20px;
        }
        .page .date {
          font-weight: 800;
          font-size: 2.2rem;
          line-height: 1;
          color: #111827; /* tinta unita grigio scuro */
          margin: 6px 0 10px 0;
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
