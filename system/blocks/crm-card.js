class CrmCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._render();
  }

  _render() {
    const userSize = "78px"; // dimensione avatar utente
    const replySize = this.getAttribute("reply-size") || "80px"; // personalizzabile

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 420px;
          font-family: system-ui, sans-serif;
        }

        .card {
          display: flex;
          flex-direction: column;
          gap: 30px;
          align-items: center;
          justify-content: center;
          background-color: #404040;
          border-radius: 10px;
          border: 0.75px solid #666;
          padding: 25px;
          color: white;
          box-sizing: border-box;
        }

        .chat {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
        }

        .row {
          display: flex;
          gap: 12px;
          align-items: center;
          opacity: 0;
          transform: scale(0.8) translateX(-60px);
          animation: enter-left 0.45s ease-out forwards;
        }

        .row.right {
          justify-content: flex-end;
          transform: scale(0.8) translateX(60px);
          animation: enter-right 0.45s ease-out forwards;
          animation-delay: 0.05s;
        }

        @keyframes enter-left {
          to {
            opacity: 1;
            transform: scale(1) translateX(0);
          }
        }

        @keyframes enter-right {
          to {
            opacity: 1;
            transform: scale(1) translateX(0);
          }
        }

        .avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .avatar.user {
          width: ${userSize};
          height: ${userSize};
        }

        .avatar.reply {
          width: ${replySize};
          height: ${replySize};
        }

        .avatar img {
          max-width: 100%;
          max-height: 100%;
          object-fit: cover;
          display: block;
        }

        .bubble {
          padding: 10px 15px;
          border-radius: 6px;
          font-size: 14px;
          line-height: 1.2;
          box-shadow: 0px 4px 6px rgba(0,0,0,0.25),
                      inset 0px 10.5px 19.8px rgba(255,255,255,0.4);
        }

        .bubble.user {
          background: #5E5E5E;
          color: white;
          width: 240px;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: left;
        }

        .bubble.reply {
          background: #C5C5C5;
          color: #1B1515;
        }
      </style>

      <div class="card">
        <my-title
          title="Automatizzazione CRM"
          subtitle="Da Whatsapp Business all’email marketing, automatizza i tuoi leads."
          alignment="left"
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

        <div class="chat">
          <div class="row">
            <div class="avatar user">
              <img src="${this.getAttribute("user-img") || "./assets/images/tipo.png"}" alt="user avatar">
            </div>
            <div class="bubble user">
              Buonasera, avrebbe disponibilità per una consulenza?
            </div>
          </div>

          <div class="row right">
            <div class="bubble reply">
              Certo! Può prenotare dal sito!
            </div>
            <div class="avatar reply">
              <img src="${this.getAttribute("reply-img") || "./assets/images/tipa.png"}" alt="reply avatar">
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("crm-card", CrmCard);
