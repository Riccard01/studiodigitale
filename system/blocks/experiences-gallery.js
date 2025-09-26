// /system/blocks/experiences-gallery.js
(() => {
  if (customElements.get('experiences-gallery')) return;

  const ENTER_DUR = 280; // ms
  const STAGGER   = 60;  // ms

  class ExperiencesGallery extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });

      this._onScroll = this._onScroll.bind(this);
      this._raf = null;

      // Dati demo: un solo array
      this._items = [
        { id:'rainbow', title:'Full Day', price:'€650', img:'./assets/images/portofino.jpg', desc:'Una giornata intera di esplorazione nel golfo di Portofino' },
        { id:'gourmet', title:'Gourmet Sunset', price:'€390', img:'./assets/images/genovese.jpg', desc:'Tramonto con degustazione a bordo.' },
        { id:'stella',  title:'Stella Maris', price:'€1200', img:'./assets/images/special.jpg', desc:'Camogli e San Fruttuoso con aperitivo.' },
        { id:'firew',   title:'Recco Fireworks', price:'€1200', img:'./assets/images/fireworks.jpg', desc:'Notte di fuochi dal mare.' },
      ];

      this.shadowRoot.innerHTML = `
        <style>
          :host {
            --falloff: 260px;
            --scale-min: 0.92;
            --scale-max: 1.06;
            --opacity-min: 0.9;
            --gap: 32px;
            --pad-inline: 16px;
            --pad-top: 3rem;
            --pad-bottom: 7.5rem;
            --enter-dur: ${ENTER_DUR}ms;
            --stagger: ${STAGGER}ms;

            display:block;
            width:100%;
            box-sizing:border-box;
            font-family: "Plus Jakarta Sans", system-ui, sans-serif;
          }
          *{ font-family:"Plus Jakarta Sans" !important; }

          .wrap{ position:relative; }
          .scroller{
            display:flex; flex-direction:row; gap:var(--gap);
            padding:var(--pad-top) var(--pad-inline) var(--pad-bottom);
            overflow-x:auto; overflow-y:hidden;
            scroll-snap-type:x mandatory;
            -webkit-overflow-scrolling:touch;
          }
          .scroller::-webkit-scrollbar{ display:none; }
          .scroller > *{ flex:0 0 auto; scroll-snap-align:center; }

          .scroller > :not(.spacer){
            position:relative;
            transform:scale(var(--_scale,1));
            opacity:var(--_opacity,1);
            transition:transform 0s, opacity 0s;
            will-change:transform, opacity;
            z-index:var(--_z,0);
          }
          .spacer{ flex:0 0 12px; pointer-events:none; }

          .dots{
            position:absolute; left:0; right:0; bottom:40px;
            display:flex; justify-content:center; gap:8px;
          }
          .dot{
            width:6px; height:6px; border-radius:50%;
            background:rgba(255,255,255,.28);
            transition: transform .18s ease, background-color .18s ease, opacity .18s;
          }
          .dot[aria-current="true"]{
            background:#fff; transform:scale(1.25);
          }

          @keyframes card-in{ from{opacity:0; translate:0 8px;} to{opacity:1; translate:0 0;} }
          .card-enter{
            animation:card-in var(--enter-dur) cubic-bezier(.2,.7,.2,1) both;
            animation-delay:calc(var(--stagger-idx,0) * var(--stagger));
          }
        </style>

        <div class="wrap">
          <div class="scroller" id="scroller">
            <div class="spacer"></div>
            <!-- cards -->
            <div class="spacer"></div>
          </div>
          <div class="dots" id="dots"></div>
        </div>
      `;
    }

    connectedCallback(){
      this._renderItems();

      const scroller = this.shadowRoot.getElementById('scroller');
      scroller.addEventListener('scroll', this._onScroll, {passive:true});

      this._ro = new ResizeObserver(()=>{ this._updateSpacers(); this._updateVisuals(); });
      this._ro.observe(scroller);

      requestAnimationFrame(()=>{ this._updateSpacers(); this._updateVisuals(); });
    }
    disconnectedCallback(){
      this.shadowRoot.getElementById('scroller')?.removeEventListener('scroll', this._onScroll);
      this._ro?.disconnect();
      if(this._raf) cancelAnimationFrame(this._raf);
    }

    _renderItems(){
      const scroller=this.shadowRoot.getElementById('scroller');
      const anchor=scroller.lastElementChild;
      const frag=document.createDocumentFragment();

      this._items.forEach((item,idx)=>{
        const card=document.createElement('experience-card');
        card.setAttribute('id',item.id);
        card.setAttribute('image',item.img);
        card.setAttribute('title',item.title);
        if(item.price) card.setAttribute('price',item.price);
        if(item.desc) card.setAttribute('description',item.desc);
        card.classList.add('card-enter');
        card.style.setProperty('--stagger-idx',idx.toString());
        frag.appendChild(card);
      });
      scroller.insertBefore(frag,anchor);
      this._renderDots(this._items.length);

      setTimeout(()=>{
        scroller.querySelectorAll('.card-enter').forEach(el=>el.classList.remove('card-enter'));
      }, ENTER_DUR + (this._items.length-1)*STAGGER + 20);
    }

    _onScroll(){
      if(this._raf) return;
      this._raf=requestAnimationFrame(()=>{this._raf=null; this._updateVisuals();});
    }
    _updateSpacers(){
      const scroller=this.shadowRoot.getElementById('scroller');
      const items=Array.from(scroller.children).filter(el=>el.tagName.includes('-'));
      if(!items.length) return;

      const hostRect=scroller.getBoundingClientRect();
      const firstRect=items[0].getBoundingClientRect();
      const lastRect=items[items.length-1].getBoundingClientRect();
      const leftNeeded=(hostRect.width-firstRect.width)/2;
      const rightNeeded=(hostRect.width-lastRect.width)/2;
      scroller.querySelectorAll('.spacer')[0].style.flexBasis=`${leftNeeded}px`;
      scroller.querySelectorAll('.spacer')[1].style.flexBasis=`${rightNeeded}px`;
    }
    _updateVisuals(){
      const scroller=this.shadowRoot.getElementById('scroller');
      const hostRect=scroller.getBoundingClientRect();
      const hostCenter=hostRect.left+hostRect.width/2;

      const falloff=260, sMin=0.92, sMax=1.06, oMin=0.9;
      const children=Array.from(scroller.children).filter(el=>el.tagName.includes('-'));

      let best=null,bestDist=Infinity;
      for(const el of children){
        const r=el.getBoundingClientRect();
        const center=r.left+r.width/2;
        const dist=Math.abs(center-hostCenter);
        const t=1-Math.min(dist/falloff,1);
        const eased=1-(1-t)*(1-t);
        const scale=sMin+(sMax-sMin)*eased;
        const opacity=oMin+(1-oMin)*eased;
        el.style.setProperty('--_scale',scale.toFixed(4));
        el.style.setProperty('--_opacity',opacity.toFixed(4));
        el.style.setProperty('--_z',Math.round(eased*100));
        if(dist<bestDist){bestDist=dist; best=el;}
      }
      if(best){
        const idx=children.indexOf(best);
        this._updateDots(idx);
      }
    }

    _renderDots(count){
      const dots=this.shadowRoot.getElementById('dots');
      dots.innerHTML='';
      for(let i=0;i<count;i++){
        const d=document.createElement('i');
        d.className='dot';
        dots.appendChild(d);
      }
      this._updateDots(0);
    }
    _updateDots(active){
      const dots=this.shadowRoot.getElementById('dots').children;
      Array.from(dots).forEach((el,i)=>{ 
        if(i===active) el.setAttribute('aria-current','true');
        else el.removeAttribute('aria-current');
      });
    }
  }

  customElements.define('experiences-gallery', ExperiencesGallery);
})();
