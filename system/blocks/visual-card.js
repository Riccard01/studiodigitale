class VisualCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._render();
  }

  _render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 420px;
          font-family: system-ui, sans-serif;
        }

        .card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          text-align: center;
          height: 350px;
          background-color: #404040;
          border-radius: 10px;
          border: 0.75px solid #666;
          padding: 40px;
          color: white;
          box-sizing: border-box;
          overflow: hidden;
        }

        .card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at top, rgba(255,255,255,0.05), transparent 70%);
          z-index: 0;
        }

        .image-container {
          width: 100%;
          display: flex;
          justify-content: center;
          position: relative;
          position: absolute;
          bottom: 12px;
          z-index: 2;
        }

        .image-container img {
          max-width: 80%;
          height: auto;
          scale: 1.2;
        }
      </style>

      <div class="card">
              <my-title
                title="Sistemi centralizzati"
                subtitle="Collegati a centinaia di piattaforme e centralizza la gestione dei dati."
                alignment="center"
                title-size="1.8rem"
                subtitle-size="1.2rem"
                title-color="#ff4444"
                subtitle-color="#CFCFCF"
                max-width="500px"
                gap=".5rem"
                font-weight-title="800"
                font-weight-subtitle="400"
                shadow="0 3px 8px rgba(0,0,0,0.35)"
                apple-style
                heading-level="h2"
                no-shadow
                line-height-title="1"
                line-height-subtitle="1.6"
              ></my-title>
        <div class="image-container">
          <img src="./assets/images/canon.png" alt="camera lens">
        </div>
      </div>
    `;
  }
}

customElements.define("visual-card", VisualCard);
