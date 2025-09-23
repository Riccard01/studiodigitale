class MyTitle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._render();
  }

  static get observedAttributes() {
    return [
      'title','subtitle','alignment','title-size','subtitle-size',
      'position','top','left','right','bottom','z-index','heading-level',
      'title-color','subtitle-color','max-width','gap',
      'font-weight-title','font-weight-subtitle','shadow','apple-style'
    ];
  }

  attributeChangedCallback() {
    this._render();
  }

  _applyHostPositioning() {
    const position = this.getAttribute('position') || 'static';
    const hasTop = this.hasAttribute('top');
    const hasLeft = this.hasAttribute('left');
    const hasRight = this.hasAttribute('right');
    const hasBottom = this.hasAttribute('bottom');
    const zIndex = this.getAttribute('z-index') || '';

    this.style.position = '';
    this.style.top = '';
    this.style.left = '';
    this.style.right = '';
    this.style.bottom = '';
    this.style.zIndex = '';

    if (position === 'absolute') {
      this.style.position = 'absolute';
      if (hasTop)    this.style.top = this.getAttribute('top');
      if (hasLeft)   this.style.left = this.getAttribute('left');
      if (hasRight)  this.style.right = this.getAttribute('right');
      if (hasBottom) this.style.bottom = this.getAttribute('bottom');
      if (zIndex)    this.style.zIndex = zIndex;
    }
  }

  _render() {
    const title = this.getAttribute('title') || 'Titolo di esempio';
    const subtitle = this.getAttribute('subtitle') || 'Questa è una descrizione di esempio.';
    const alignment = this.getAttribute('alignment') || 'center';
    const titleSize = this.getAttribute('title-size') || '2.5rem';
    const subtitleSize = this.getAttribute('subtitle-size') || '1rem';
    const headingLevel = this.getAttribute('heading-level') || 'h2';
    const safeHeading = ['h1','h2','h3','h4','h5','h6'].includes(headingLevel.toLowerCase())
      ? headingLevel.toLowerCase()
      : 'h2';

    const titleColor = this.getAttribute('title-color');
    const subtitleColor = this.getAttribute('subtitle-color');
    const maxWidth = this.getAttribute('max-width') || '640px';
    const gap = this.getAttribute('gap') || '.5rem';
    const fontWeightTitle = this.getAttribute('font-weight-title') || '700';
    const fontWeightSubtitle = this.getAttribute('font-weight-subtitle') || '400';
    const shadow = this.getAttribute('shadow') || '0 2px 6px rgba(0,0,0,0.25)';
    const appleStyle = this.hasAttribute('apple-style');

    this._applyHostPositioning();

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }

        :host([position="absolute"]) .wrapper {
          margin: 0;
        }

        .wrapper {
          display: flex;
          flex-direction: column;
          align-items: ${alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center'};
          gap: ${gap};
          margin: 3rem 1rem;
          max-width: ${maxWidth};
        }

        .title {
          font-size: ${titleSize};
          font-weight: ${fontWeightTitle};
          line-height: 1.2;
          margin: 0;
          text-align: ${alignment};
          text-shadow: ${shadow};

          ${appleStyle 
            ? `background: linear-gradient(to bottom, #fff 0%, #ddd 100%);
               -webkit-background-clip: text;
               -webkit-text-fill-color: transparent;
               background-clip: text;
               color: transparent;`
            : titleColor
              ? `color: ${titleColor};`
              : `background: linear-gradient(to bottom, #ffffff 0%, #adadadff 100%);
                 -webkit-background-clip: text;
                 -webkit-text-fill-color: transparent;
                 background-clip: text;
                 color: transparent;`
          }
        }

        .subtitle {
          font-size: ${subtitleSize};
          font-weight: ${fontWeightSubtitle};
          margin: 0;
          text-align: ${alignment};
          color: ${subtitleColor || 'var(--my-subtitle-color, #D1D5DB)'};
        }
      </style>

      <div class="wrapper">
        <${safeHeading} class="title">${title}</${safeHeading}>
        <p class="subtitle">${subtitle}</p>
      </div>
    `;
  }
}

customElements.define('my-title', MyTitle);
