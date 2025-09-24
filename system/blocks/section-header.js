class SectionHeader extends HTMLElement {
  static get observedAttributes() {
    return ['label'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const label = this.getAttribute('label') || '';

    this.shadowRoot.innerHTML = `
      <style>
        .header-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          position: relative;
        }

        .section-header {
          display: flex;
          z-index: 10;
          padding: .3rem 1.1rem;
          justify-content: center;
          align-items: center;
          position: relative;
          background: rgba(255, 139, 38, 0.2);
          height: 26px;
        }

        .section-header p {
          color: #FFD9B8;
          font-weight: 600;
          letter-spacing: 1.2px;
          margin: 0;
        }

        .side {
          background: rgba(255, 139, 38, 0.1);
          position: absolute;
          width: 10px;
          height: 27px;
        }

        .side.left {
          left: -10px;
        }

        .side.right {
          right: -10px;
        }

        .sfumatura {
          background: rgba(255, 139, 38, 0.6);
          position: absolute;
          filter: blur(8px);
          width: 92px;
          height: 38px;
          z-index: 1;
        }
      </style>

      <div class="header-wrapper">
        <div class="section-header">
          <p>${label}</p>
          <div class="side left"></div>
          <div class="side right"></div>
        </div>
        <div class="sfumatura"></div>
      </div>
    `;
  }
}

customElements.define('section-header', SectionHeader);
