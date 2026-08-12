
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
    import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
    const firebaseConfig = {
      apiKey: "AIzaSyC3HLLxdZG9tBW1uqRZcu3_8l2F7SEpV94",
      authDomain: "hawaahawaai.firebaseapp.com",
      projectId: "hawaahawaai",
      storageBucket: "hawaahawaai.firebasestorage.app",
      messagingSenderId: "650317857849",
      appId: "1:650317857849:web:80d834962413fe5a6df9e8"
    };
    const _app = initializeApp(firebaseConfig);
    const _db  = getFirestore(_app);
    let _resolve;
    window._fbReady = new Promise(r => { _resolve = r; });
    window._siteDataPromise = (async () => {
      try {
        const snap = await getDoc(doc(_db,'siteData','main'));
        const data = snap.exists() ? snap.data() : null;
        if (data?.theme) { localStorage.setItem('hh_theme', data.theme); document.documentElement.setAttribute('data-theme', data.theme); }
        if (data?.themeBgColor) { const bg = data.themeBgColor; ['--bg-void','--bg-deep','--bg-dark'].forEach(v => document.documentElement.style.setProperty(v, bg)); }
        _resolve(data);
        return data;
      } catch(e) { console.warn('[HH] Firebase offline:', e.message); _resolve(null); return null; }
    })();
  
