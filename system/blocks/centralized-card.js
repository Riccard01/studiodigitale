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
          height: 480px;
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
          background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 80%);
          z-index: 0;
        }



        .apps {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          margin-bottom: 5px;
          z-index: 2;
        }

        .wrapper-title {
        display:flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        z-index: 2;
        
        }



        my-title {
          margin-top: 15px;
          z-index: 2;
        }


    .ellisse {
      position: absolute;
      top: 50px;
      left: 80px;
      width: 300px;
      height: 300px;
      z-index: 1; /* sotto tutto */
      overflow: visible;
    }

    .ellisse ellipse {
      fill: #FFFFFF;
      fill-opacity: 0.07;
      filter: blur(30px);
    }

    .main-icon {

      position: absolute;
      top: 38%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 120px;
      height: 120px;
      z-index: 2;
    }



      </style>



      
      <div class="card">
  <svg class="ellisse" xmlns="http://www.w3.org/2000/svg">
    <ellipse 
      cx="125.36" 
      cy="122.115" 
      rx="125.36" 
      ry="122.115"/>
  </svg>

      <linea-element
          path-d="M 40 170 A 170 170 0 0 0 210 340"
          line-width="1"
          pulse-radius="15"
          speed="3"
          impulse="true"
          impulse-number="6"
          color="#FFFFFF"
          back-and-forth="shot"
          ease="out"
          loop
          top="-365px"
          left="-70px"
          style="width:533px; height:600px;"
      ></linea-element>

      <linea-element
        path-d="M 40 170 A 170 170 0 0 0 210 340"
        line-width="1"
        pulse-radius="15"
        speed="3"
        impulse="true"
        impulse-number="6"
        color="#45ff31ff"
        back-and-forth="shot"
        ease="out"
        loop
        top="-365px"
        left="-43px"
        style="width:533px; height:600px; transform:scaleX(-1);"
      ></linea-element>




        <div class="circle-bg"></div>

        <img class="main-icon" src="./assets/icons/center.svg" alt="">

        <wrapper-title>
              <div class="apps">
                <img src="./assets/icons/deliveroo.svg" alt="app1">
                <img src="./assets/icons/paypal.svg" alt="app1">
                <img src="./assets/icons/trip.svg" alt="app1">
                <img src="./assets/icons/air.svg" alt="app1">
              </div>

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
        </wrapper-title>
      </div>
    `;
  }
}

customElements.define("centralized-card", CentralizedCard);
