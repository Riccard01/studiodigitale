class MyChatAnimation extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.text1 = "";
    this.text2 = "";
    this.fullText1 = "Ciao! Sei disponibile?";
    this.fullText2 = "Certo, chiamami quando vuoi!";
    this.showFirst = false;
    this.showSecond = false;
  }

  static get observedAttributes() {
    return ["bubble-height"];
  }

  attributeChangedCallback() {
    this.updateBubbleHeight();
  }

  get bubbleHeight() {
    return this.getAttribute("bubble-height") || "39px";
  }

  connectedCallback() {
    this.render();

    // Avvio animazioni
    setTimeout(() => {
      this.showFirst = true;
      this.updateVisibility();
      this.typeWriter(1, this.fullText1, 25, () => {
        setTimeout(() => {
          this.showSecond = true;
          this.updateVisibility();
          this.animatePushUp();
          this.typeWriter(2, this.fullText2, 25);
        }, 300);
      });
    }, 200);
  }

  updateBubbleHeight() {
    if (this.shadowRoot) {
      const container = this.shadowRoot.querySelector(".scene-container");
      if (container) container.style.setProperty("--bubble-height", this.bubbleHeight);
    }
  }

  updateVisibility() {
    if (!this.shadowRoot) return;
    if (this.showFirst) {
      const firstMsg = this.shadowRoot.querySelector(".left");
      if (firstMsg) firstMsg.style.display = "flex";
    }
    if (this.showSecond) {
      const secondMsg = this.shadowRoot.querySelector(".right");
      if (secondMsg) secondMsg.style.display = "flex";
    }
  }

  typeWriter(msgNum, fullText, speed, callback) {
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        if (msgNum === 1) {
          this.text1 = fullText.slice(0, i + 1);
          const el = this.shadowRoot.querySelector("#msg1");
          if (el) el.textContent = this.text1;
        } else {
          this.text2 = fullText.slice(0, i + 1);
          const el = this.shadowRoot.querySelector("#msg2");
          if (el) el.textContent = this.text2;
        }
        i++;
      } else {
        clearInterval(interval);
        if (callback) callback();
      }
    }, speed);
  }

  animatePushUp() {
    const firstMsg = this.shadowRoot.querySelector(".left");
    if (firstMsg) {
      firstMsg.classList.add("push-up");
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600&display=swap');

.scene-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 400px;   /* FIX larghezza */
  height: 300px;  /* FIX altezza */
}


        .scene-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 300px;
          padding: 1rem;
          border-radius: 16px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12 px;
          font-weight: 600;
          overflow: hidden;
        }

        @keyframes bubble {
          0% { transform: scale(0.7); opacity: 0; }
          60% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        .animate-bubble {
          animation: bubble 0.18s ease-in-out forwards;
        }

        .push-up {
          animation: pushUp 0.45s ease-out forwards;
        }

        @keyframes pushUp {
          0% { margin-bottom: 0; }
          70% { margin-bottom: 35px; }
          100% { margin-bottom: 30px; }
        }

        .msg {
          padding: 0.5rem 1rem;
          max-width: 280px;
          height: var(--bubble-height, 39px);
          display: flex;
          align-items: center;
        }

        .client-bubble {
          background: #D7D7D7;
          border: 1px solid #FFFFFF;
          color: #535353;
          box-shadow: inset 0 1px 3px rgba(255,255,255,0.6);
          border-radius: 16px 16px 16px 1px;
        }

        .you-bubble {
          background: #F9CD80;
          border: 1px solid #E9C07A;
          color: #513607;
          box-shadow: inset 0 1px 3px rgba(255,255,255,0.4);
          border-radius: 16px 16px 1px 16px;
        }

        .left, .right {
          display: none;
          flex-direction: column;
          width: 100%;
        }
        .left { align-items: flex-start; }
        .right { align-items: flex-end; }

        .label {
          font-size: 12px;
          margin-top: 4px;
        }

        .label-client {
          color: #9ca3af; /* grigio */
          text-align: left;
        }

        .label-you {
          color: #F9CD80; /* dorato */
          text-align: right;
        }
      </style>

      <div class="scene-wrapper">
        <div class="scene-container" style="--bubble-height: ${this.bubbleHeight}">
          <div class="left animate-bubble">
            <div id="msg1" class="msg client-bubble"></div>
            <span class="label label-client">Cliente</span>
          </div>

          <div class="right animate-bubble">
            <div id="msg2" class="msg you-bubble"></div>
            <span class="label label-you">Tu</span>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("my-chat-animation", MyChatAnimation);
