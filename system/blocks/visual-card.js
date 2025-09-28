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

        h2 {
          margin: 0 0 12px 0;
          font-size: 1.6rem;
          font-weight: 700;
          z-index: 2;
        }

        p {
          margin: 0 0 25px 0;
          font-size: 1rem;
          line-height: 1.4;
          color: #cfcfcf;
          z-index: 2;
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
        <h2>Produzione Visiva</h2>
        <p>Foto di interni, fotografie del prodotto, dronate e storie da raccontare.</p>
        <div class="image-container">
          <img src="./assets/images/canon.png" alt="camera lens">
        </div>
      </div>
    `;
  }
}

customElements.define("visual-card", VisualCard);
