(function() {
    if (window.self !== window.top) return;

    const devices = {
        iphone15: { width: '393px', height: '852px', radius: '55px', name: 'iPhone 15 Pro', island: true },
        samsung: { width: '360px', height: '780px', radius: '24px', name: 'Samsung S22', island: false }
    };

    const style = document.createElement('style');
    style.textContent = `
        body { background: #0f172a !important; margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
        .controls { position: fixed; top: 20px; z-index: 9999; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 10px 20px; border-radius: 50px; display: flex; gap: 15px; border: 1px solid rgba(255,255,255,0.2); }
        .btn-dev { background: none; border: none; color: white; opacity: 0.5; cursor: pointer; font-weight: bold; font-size: 13px; }
        .btn-dev.active { opacity: 1; color: #38bdf8; }
        .phone-wrapper { position: relative; transition: all 0.4s ease; background: #000; padding: 12px; border: 4px solid #333; box-shadow: 0 50px 100px rgba(0,0,0,0.8); transform: scale(0.8); }
        #mobile-iframe { width: 100%; height: 100%; border: none; background: white; display: block; }
        .island { position: absolute; top: 25px; left: 50%; transform: translateX(-50%); width: 110px; height: 35px; background: #000; border-radius: 20px; z-index: 100; }
        .punch { position: absolute; top: 22px; left: 50%; transform: translateX(-50%); width: 12px; height: 12px; background: #111; border-radius: 50%; z-index: 100; }
    `;
    document.head.appendChild(style);

    window.switchDevice = function(key) {
        const dev = devices[key];
        const wrap = document.querySelector('.phone-wrapper');
        const iframe = document.querySelector('#mobile-iframe');
        wrap.style.width = dev.width;
        wrap.style.height = dev.height;
        wrap.style.borderRadius = dev.radius;
        iframe.style.borderRadius = `calc(${dev.radius} - 10px)`;
        document.querySelector('.island').style.display = dev.island ? 'block' : 'none';
        document.querySelector('.punch').style.display = dev.island ? 'none' : 'block';
        document.querySelectorAll('.btn-dev').forEach(b => b.classList.toggle('active', b.dataset.dev === key));
    };

    window.addEventListener('DOMContentLoaded', () => {
        const content = document.documentElement.outerHTML;
        document.body.innerHTML = `
            <div class="controls">
                <button class="btn-dev active" data-dev="iphone15" onclick="switchDevice('iphone15')">iPhone 15</button>
                <button class="btn-dev" data-dev="samsung" onclick="switchDevice('samsung')">Samsung S22</button>
            </div>
            <div class="phone-wrapper">
                <div class="island"></div><div class="punch"></div>
                <iframe id="mobile-iframe"></iframe>
            </div>
        `;

        const iframe = document.getElementById('mobile-iframe');
        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(content);
        
        const fix = doc.createElement('style');
        fix.textContent = `
            /* 1. RESET RADICAL DES LARGEURS */
            * { 
                max-width: 100% !important; 
                box-sizing: border-box !important; 
                flex-shrink: 1 !important;
            }
            
            html, body { 
                overflow-x: hidden !important; 
                width: 100% !important; 
                position: relative !important;
            }

            body { padding-top: 60px !important; }

            /* 2. FIX LOGIN (La classe w-[440px] faisait tout déborder) */
            .max-w-\\[440px\\], .w-full { 
                width: 100% !important; 
                max-width: 100% !important; 
                padding-left: 10px !important;
                padding-right: 10px !important;
            }

            /* 3. FIX DASHBOARD (Header et Grilles) */
            header, .fixed { 
                position: absolute !important; 
                width: 100% !important; 
                left: 0 !important; 
            }

            /* Empilement forcé des colonnes sur mobile */
            .grid, .flex-row { 
                display: flex !important; 
                flex-direction: column !important; 
                gap: 12px !important; 
            }

            .grid > div, .flex-row > div { 
                width: 100% !important; 
                margin-left: 0 !important; 
                margin-right: 0 !important; 
            }

            /* 4. NETTOYAGE DES CLASSES DESKTOP GÊNANTES */
            section.lg\\:w-\\[40\\%\\], .hidden.lg\\:flex { 
                display: none !important; 
            }
            
            main { 
                width: 100% !important; 
                min-width: 0 !important; 
                padding: 10px !important;
            }

            /* Supprime les marges négatives Tailwind qui tirent le contenu dehors */
            .-mx-4, .-mx-6, .-mx-8 { margin-left: 0 !important; margin-right: 0 !important; }
        `;
        doc.head.appendChild(fix);
        doc.close();
        switchDevice('iphone15');
    });
})();