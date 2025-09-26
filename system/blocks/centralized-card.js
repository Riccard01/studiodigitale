class CentralizedCard extends HTMLElement {
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
          gap: 20px;
          height: 450px;
          align-items: center;
          justify-content: flex-end;
          background-color: #404040;
          border-radius: 10px;
          border: 0.75px solid #666;
          padding: 25px;
          color: white;
          box-sizing: border-box;
          overflow: hidden;
        }

        .circle-bg {
          position: absolute;
          top: -405px;
          left: 50%;
          transform: translateX(-50%);
          width: 490px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          z-index: 0;
        }

        .main-icon {
          position: relative;
          z-index: 2;
          width: 70px;
          height: 70px;
          border-radius: 20px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(255,255,255,0.5);
        }

        .main-icon img {
          width: 36px;
          height: 36px;
        }

        .apps {
          display: flex;
          gap: 12px;
          margin-top: 15px;
          z-index: 2;
        }

        .app-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow: 0 0 8px rgba(0,0,0,0.15);
        }

        .app-icon img {
          width: 60%;
          height: 60%;
          object-fit: contain;
        }

        my-title {
          margin-top: 15px;
          z-index: 2;
        }
      </style>

      <div class="card">
<linea-element
    path-d="M 40 170 A 170 170 0 0 0 380 170"
    line-width="1"
    pulse-radius="15"
    speed="3"
    impulse="true"
    impulse-number="6"
    color="#FFFFFF"
    back-and-forth="shot"
    ease="out"
    loop
    top="-357px"
    left="-70px"
    style="width:533px; height:600px;"
></linea-element>
        <div class="circle-bg"></div>

        <div class="main-icon">
          <img src="${this.getAttribute("icon") || "./assets/images/logo.png"}" alt="main icon">
        </div>

        <div class="apps">
          <div class="app-icon"><img src="./assets/images/app1.png" alt="app1"></div>
          <div class="app-icon"><img src="./assets/images/app2.png" alt="app2"></div>
          <div class="app-icon"><img src="./assets/images/app3.png" alt="app3"></div>
          <div class="app-icon"><img src="./assets/images/app4.png" alt="app4"></div>
        </div>

        <my-title
          title="Sistemi centralizzati"
          subtitle="Collegati a centinaia di piattaforme e centralizza la gestione dei dati."
          alignment="center"
          title-size="1.8rem"
          subtitle-size="1.1rem"
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
        ></my-title>
      </div>
    `;
  }
}

customElements.define("centralized-card", CentralizedCard);
