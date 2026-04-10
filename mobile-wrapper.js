/**
 * mobile-wrapper.js
 * Simule un écran mobile dans le navigateur sans iframe.
 * Le contenu est isolé via Shadow DOM pour éviter toute fuite de styles.
 *
 * Options via window.MobileWrapper (avant ce script) :
 *   device  : 'iphone15' | 'samsung'  (défaut: 'iphone15')
 *   bgColor : couleur fond scène       (défaut: '#0f172a')
 *   scale   : zoom fixe (ex: 0.85)    (défaut: auto)
 */
(function () {
  'use strict';

  const cfg = Object.assign(
    { device: 'iphone15', bgColor: '#0f172a', scale: null },
    window.MobileWrapper || {}
  );

  const DEVICES = {
    iphone15: {
      label: 'iPhone 15 Pro',
      w: 393, h: 852,
      frame: '#1c1c1e', accent: '#3a3a3c',
      radius: 47, bezel: 12,
      islandW: 120, islandH: 34, islandR: 20,
      statusH: 54, silent: true
    },
    samsung: {
      label: 'Samsung Galaxy S24',
      w: 393, h: 852,
      frame: '#1a1a1a', accent: '#3d3d3d',
      radius: 40, bezel: 10,
      islandW: 14, islandH: 14, islandR: 7,
      statusH: 28, silent: false
    }
  };

  const D    = DEVICES[cfg.device] || DEVICES.iphone15;
  const isSS = cfg.device === 'samsung';

  /* ── Calcul scale auto ────────────────────────────────────── */
  function computeScale() {
    if (cfg.scale) return cfg.scale;
    const tw = D.w + D.bezel * 2 + 40;
    const th = D.h + D.bezel * 2 + 120;
    return Math.min((window.innerWidth - 40) / tw, (window.innerHeight - 40) / th, 1);
  }

  /* ── SVG icônes status bar ────────────────────────────────── */
  const SVG_SIGNAL  = `<svg width="17" height="12" viewBox="0 0 17 12" fill="white"><rect x="0" y="7" width="3" height="5" rx="1"/><rect x="4.5" y="5" width="3" height="7" rx="1"/><rect x="9" y="2" width="3" height="10" rx="1"/><rect x="13.5" y="0" width="3" height="12" rx="1"/></svg>`;
  const SVG_WIFI    = `<svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" fill="white"/><path d="M3.5 6.5a6.5 6.5 0 0 1 9 0" stroke="white" stroke-width="1.5" stroke-linecap="round"/><path d="M1 4a10 10 0 0 1 14 0" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity=".6"/></svg>`;
  const SVG_BATTERY = `<svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x=".5" y=".5" width="21" height="11" rx="3.5" stroke="white" stroke-opacity=".35"/><rect x="2" y="2" width="16" height="8" rx="2" fill="white"/><path d="M23 4v4a2 2 0 0 0 0-4z" fill="white" opacity=".4"/></svg>`;

  /* ── Init ─────────────────────────────────────────────────── */
  function init() {

    /* Capturer le HTML complet de la page AVANT toute modification */
    const pageHTML = document.documentElement.outerHTML;

    /* Nettoyer le HTML capturé : supprimer les balises mobile-wrapper */
    const cleanHTML = pageHTML
      .replace(/<script[^>]*>\s*window\.MobileWrapper[\s\S]*?<\/script>/gi, '')
      .replace(/<script[^>]*src=["'][^"']*mobile-wrapper[^"']*["'][^>]*><\/script>/gi, '');

    /* Injecter styles scène dans le document courant */
    const sceneStyle = document.createElement('style');
    sceneStyle.textContent = `
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        height: 100% !important;
        min-height: unset !important;
        overflow: hidden !important;
        background: ${cfg.bgColor} !important;
        display: block !important;
        flex: none !important;
      }
      #mw-scene {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-height: 100dvh;
        background: ${cfg.bgColor};
        gap: 18px;
        padding: 20px;
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }
      #mw-toolbar {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: center;
      }
      .mw-btn {
        background: rgba(255,255,255,.08);
        border: 1px solid rgba(255,255,255,.15);
        color: rgba(255,255,255,.75);
        font-size: 12px;
        font-weight: 500;
        padding: 6px 14px;
        border-radius: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: background .2s, color .2s;
        font-family: inherit;
      }
      .mw-btn:hover  { background: rgba(255,255,255,.15); color: #fff; }
      .mw-btn.active { background: rgba(255,255,255,.22); color: #fff; }
      .mw-lbl { color: rgba(255,255,255,.35); font-size: 11px; letter-spacing: .06em; text-transform: uppercase; }
      #mw-wrap {
        position: relative;
        transform-origin: center center;
        transition: transform .35s cubic-bezier(.4,0,.2,1);
        flex-shrink: 0;
      }
      #mw-shell { position: relative; }
      .mw-hw { position: absolute; background: ${D.accent}; border-radius: 3px; }
      .mw-silent   { left: -4px; top: 100px; width: 4px; height: 30px; }
      .mw-volup    { left: -4px; top: 145px; width: 4px; height: 52px; }
      .mw-voldown  { left: -4px; top: 210px; width: 4px; height: 52px; }
      .mw-power    { right: -4px; top: 160px; width: 4px; height: 68px; }
      #mw-outer {
        border-radius: ${D.radius}px;
        background: ${D.frame};
        padding: ${D.bezel}px;
        box-shadow:
          0 0 0 1px rgba(255,255,255,.06),
          inset 0 0 0 1px rgba(255,255,255,.04),
          0 40px 120px rgba(0,0,0,.8),
          0 10px 40px rgba(0,0,0,.5);
      }
      #mw-screen {
        border-radius: ${D.radius - D.bezel}px;
        overflow: hidden;
        position: relative;
        width: ${D.w}px;
        height: ${D.h}px;
        background: #fff;
      }
      #mw-island {
        position: absolute;
        top: ${isSS ? '14px' : '12px'};
        left: 50%;
        transform: translateX(-50%);
        width: ${D.islandW}px;
        height: ${D.islandH}px;
        background: #000;
        border-radius: ${D.islandR}px;
        z-index: 100;
        pointer-events: none;
      }
      #mw-statusbar {
        position: absolute;
        top: 0; left: 0; right: 0;
        height: ${D.statusH}px;
        z-index: 99;
        display: flex;
        align-items: ${isSS ? 'center' : 'flex-end'};
        padding: ${isSS ? '0 20px' : '0 20px 8px'};
        justify-content: space-between;
        pointer-events: none;
        background: linear-gradient(to bottom, rgba(0,0,0,.25), transparent);
      }
      #mw-clock {
        font-size: ${isSS ? '12px' : '15px'};
        font-weight: 600;
        color: #fff;
        font-variant-numeric: tabular-nums;
        letter-spacing: -.02em;
        font-family: -apple-system, sans-serif;
      }
      .mw-icons { display: flex; align-items: center; gap: 6px; }
      #mw-viewport {
        position: absolute;
        top: 0; left: 0;
        width: ${D.w}px;
        height: ${D.h}px;
        overflow: hidden;
        background: #fff;
      }
      /* Shadow host : reset total, taille fixe */
      #mw-shadow-host {
        display: block;
        width: ${D.w}px;
        height: ${D.h}px;
        overflow: hidden;
        position: relative;
      }
      #mw-homebar {
        position: absolute;
        bottom: 8px; left: 50%;
        transform: translateX(-50%);
        width: ${isSS ? '120px' : '130px'};
        height: 5px;
        background: rgba(255,255,255,.5);
        border-radius: 3px;
        z-index: 100;
        pointer-events: none;
      }
      #mw-sheen {
        position: absolute;
        inset: 0;
        border-radius: ${D.radius - D.bezel}px;
        background: linear-gradient(135deg, rgba(255,255,255,.04) 0%, transparent 50%);
        pointer-events: none;
        z-index: 101;
      }
      #mw-devname {
        color: rgba(255,255,255,.3);
        font-size: 11px;
        letter-spacing: .05em;
        text-align: center;
        margin-top: 14px;
        font-family: inherit;
      }
    `;
    document.head.appendChild(sceneStyle);

    /* Vider le body */
    document.body.innerHTML = '';
    document.body.removeAttribute('class');
    document.body.removeAttribute('style');

    /* ── Scène ────────────────────────────────────────────── */
    const scene = mk('div', 'mw-scene');

    /* Toolbar */
    const tb = mk('div', 'mw-toolbar');
    tb.innerHTML = `
      <span class="mw-lbl">Aperçu</span>
      <button class="mw-btn${!isSS ? ' active' : ''}" id="mw-i15">
        <svg width="11" height="14" viewBox="0 0 11 14" fill="currentColor"><rect x=".5" y="0" width="10" height="14" rx="2.5"/></svg>
        iPhone 15
      </button>
      <button class="mw-btn${isSS ? ' active' : ''}" id="mw-s24">
        <svg width="11" height="14" viewBox="0 0 11 14" fill="currentColor"><rect x=".5" y="0" width="10" height="14" rx="1.5"/><rect x="3.5" y="1" width="4" height="1.5" rx=".75" fill="rgba(0,0,0,.4)"/></svg>
        Samsung S24
      </button>
      <button class="mw-btn" id="mw-zin">＋</button>
      <button class="mw-btn" id="mw-zout">－</button>
    `;
    scene.appendChild(tb);

    /* Device shell */
    const wrap  = mk('div', 'mw-wrap');
    const shell = mk('div', 'mw-shell');
    if (D.silent) {
      shell.appendChild(hw('mw-silent'));
      shell.appendChild(hw('mw-volup'));
      shell.appendChild(hw('mw-voldown'));
    }
    shell.appendChild(hw('mw-power'));

    const outer    = mk('div', 'mw-outer');
    const screen   = mk('div', 'mw-screen');
    const island   = mk('div', 'mw-island');
    const statusbar = mk('div', 'mw-statusbar');
    statusbar.innerHTML = `<span id="mw-clock">00:00</span><div class="mw-icons">${SVG_SIGNAL}${SVG_WIFI}${SVG_BATTERY}</div>`;

    /* ── Shadow DOM : isolation totale des styles ────────── */
    const viewport   = mk('div', 'mw-viewport');
    const shadowHost = mk('div', 'mw-shadow-host');
    viewport.appendChild(shadowHost);

    const shadow = shadowHost.attachShadow({ mode: 'open' });

    /* Styles internes au Shadow DOM */
    const innerStyle = document.createElement('style');
    innerStyle.textContent = `
      :host {
        display: block;
        width: ${D.w}px;
        height: ${D.h}px;
        overflow: hidden;
        position: relative;
        background: #fff;
      }
      #mw-inner-scroll {
        width: ${D.w}px;
        height: ${D.h}px;
        overflow-y: auto;
        overflow-x: hidden;
        padding-top: ${D.statusH}px;
        box-sizing: border-box;
        background: #fff;
      }
      /* Reset complet pour le contenu de la page */
      #mw-page-content {
        display: block;
        width: 100%;
        min-height: calc(${D.h}px - ${D.statusH}px);
      }
    `;
    shadow.appendChild(innerStyle);

    /* Scroll container */
    const scrollDiv = document.createElement('div');
    scrollDiv.id = 'mw-inner-scroll';

    /* Conteneur page */
    const pageDiv = document.createElement('div');
    pageDiv.id = 'mw-page-content';

    /* Injecter le HTML de la page via un parser */
    const parser = new DOMParser();
    const parsedDoc = parser.parseFromString(cleanHTML, 'text/html');

    /* Copier les <style> et <link> dans le shadow */
    parsedDoc.querySelectorAll('style, link[rel="stylesheet"]').forEach(node => {
      shadow.appendChild(node.cloneNode(true));
    });

    /* Copier les <script> dans le shadow (pour Tailwind config etc.) */
    parsedDoc.querySelectorAll('script').forEach(orig => {
      const s = document.createElement('script');
      if (orig.src) {
        s.src = orig.src;
      } else {
        s.textContent = orig.textContent;
      }
      Array.from(orig.attributes).forEach(a => {
        if (a.name !== 'src') s.setAttribute(a.name, a.value);
      });
      shadow.appendChild(s);
    });

    /* Copier le contenu du <body> parsé dans pageDiv */
    Array.from(parsedDoc.body.childNodes).forEach(n => {
      pageDiv.appendChild(n.cloneNode(true));
    });

    scrollDiv.appendChild(pageDiv);
    shadow.appendChild(scrollDiv);

    /* Assembler */
    const homebar = mk('div', 'mw-homebar');
    const sheen   = mk('div', 'mw-sheen');

    screen.appendChild(island);
    screen.appendChild(statusbar);
    screen.appendChild(viewport);
    screen.appendChild(homebar);
    screen.appendChild(sheen);
    outer.appendChild(screen);
    shell.appendChild(outer);
    wrap.appendChild(shell);

    const devname = mk('div', 'mw-devname');
    devname.textContent = D.label;
    wrap.appendChild(devname);

    scene.appendChild(wrap);
    document.body.appendChild(scene);

    /* ── Scale ───────────────────────────────────────────── */
    let scale = computeScale();
    setScale(scale);

    function setScale(s) {
      scale = Math.max(.3, Math.min(s, 1.2));
      wrap.style.transform = `scale(${scale})`;
    }

    /* ── Toolbar events ──────────────────────────────────── */
    document.getElementById('mw-zin') .onclick = () => setScale(scale + .05);
    document.getElementById('mw-zout').onclick = () => setScale(scale - .05);
    document.getElementById('mw-i15').onclick = () => {
      window.MobileWrapper = Object.assign({}, cfg, { device: 'iphone15' });
      location.reload();
    };
    document.getElementById('mw-s24').onclick = () => {
      window.MobileWrapper = Object.assign({}, cfg, { device: 'samsung' });
      location.reload();
    };

    window.addEventListener('resize', () => setScale(computeScale()));

    /* ── Horloge ─────────────────────────────────────────── */
    (function tick() {
      const c = document.getElementById('mw-clock');
      if (c) c.textContent = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      setTimeout(tick, 10000);
    })();
  }

  /* ── Helpers ─────────────────────────────────────────────── */
  function mk(tag, id) {
    const e = document.createElement(tag);
    e.id = id;
    return e;
  }
  function hw(cls) {
    const e = document.createElement('div');
    e.className = 'mw-hw ' + cls;
    return e;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();