
/* ── Preloader ── */
window.addEventListener('load', () => {
  const p = document.getElementById('preloader');
  if (p) { setTimeout(() => { p.classList.add('fade-out'); setTimeout(()=>p.style.display='none',600); }, 400); }
  // If no video source, show fallback image
  const vid = document.getElementById('heroVideo');
  if (vid && !vid.canPlayType('video/mp4')) {
    vid.classList.add('hide');
  }
});

/* ── Cart count ── */
updateCartCount();
window.addEventListener('storage', updateCartCount);

/* ── Navbar scroll ── */
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => nav?.classList.toggle('scrolled', window.scrollY > 80), {passive:true});

/* ── Reveal on scroll ── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, {threshold:0.1});
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ── City picker ── */
document.getElementById('cityGoBtn')?.addEventListener('click', () => {
  const val = document.getElementById('citySelect').value;
  if (val) window.location.href = val;
  else alert('Please select a city first!');
});

/* ── Budget WA ── */
function sendQuoteWA() {
  const type = document.getElementById('eventType').value;
  const budget = document.getElementById('userBudget').value;
  const date = document.getElementById('eventDate').value;
  const city = document.getElementById('eventCity').value;
  const desc = document.getElementById('eventDesc').value;
  if (!type||!budget||!date||!city||!desc) { alert('Please fill in all fields!'); return; }
  const msg = encodeURIComponent(`Hi Hawaa Hawaai! 🎈\n\nEvent: ${type}\n📅 Date: ${date}\n📍 City: ${city}\n💰 Budget: ₹${budget}\n📝 Details: ${desc}`);
  window.open(`https://wa.me/919389835280?text=${msg}`, '_blank');
}

/* ── Mobile Drawer ── */
(function() {
  const btn = document.getElementById('mobileMenuBtn');
  const overlay = document.getElementById('drawerOverlay');
  const drawer = document.getElementById('mobileDrawer');
  if (!btn||!overlay||!drawer) return;
  const open  = () => { overlay.classList.add('open'); drawer.classList.add('open'); document.body.style.overflow='hidden'; };
  const close = () => { overlay.classList.remove('open'); drawer.classList.remove('open'); document.body.style.overflow=''; };
  btn.addEventListener('click', open);
  overlay.addEventListener('click', close);
  let startY = 0;
  drawer.addEventListener('touchstart', e => startY = e.touches[0].clientY, {passive:true});
  drawer.addEventListener('touchmove', e => { if(e.touches[0].clientY-startY > 60) close(); }, {passive:true});
})();

/* ── Ripple ── */
document.addEventListener('click', e => {
  const btn = e.target.closest('.ripple-btn');
  if (!btn) return;
  const r = document.createElement('span');
  r.classList.add('ripple');
  const rect = btn.getBoundingClientRect();
  const sz = Math.max(rect.width, rect.height);
  r.style.cssText = `width:${sz}px;height:${sz}px;left:${e.clientX-rect.left-sz/2}px;top:${e.clientY-rect.top-sz/2}px;`;
  btn.appendChild(r);
  setTimeout(() => r.remove(), 600);
});

/* ── Activities ── */
(async function() {
  const acts = await getActivities();
  const track = document.getElementById('activitiesTrack');
  if (!track) return;
  track.innerHTML = acts.map(a => `
    <div class="act-clay-card">
      <img src="${a.img}" alt="${a.title}" loading="lazy" onerror="this.style.background='rgba(255,153,51,0.1)';this.alt='🎮'">
      <div class="act-card-body">
        <div class="act-card-title">${a.title}</div>
        <div class="act-card-price">₹${a.price.toLocaleString()}</div>
        <button onclick="addToCart('${a.title.replace(/'/g,"\\'")}',${a.price},'${a.img}');this.textContent='✅ Added!';setTimeout(()=>this.textContent='+ Add',1500);"
          style="margin-top:8px;background:rgba(255,153,51,0.15);border:1px solid rgba(255,153,51,0.3);color:var(--saffron);border-radius:999px;padding:5px 12px;font-family:'Outfit',sans-serif;font-size:11px;font-weight:700;cursor:pointer;width:100%;transition:0.2s;">+ Add</button>
      </div>
    </div>
  `).join('');
})();

/* ════════════════════════════════
   TINDER CARD DECK
════════════════════════════════ */
(async function() {
  const services = await getServices();
  const deckServices = services; // use all services
  const arena = document.getElementById('deckArena');
  const emptyState = document.getElementById('deckEmpty');
  const actionsEl = document.getElementById('deckActions');
  const modal = document.getElementById('serviceModal');

  let cards = []; // DOM references
  let currentIdx = 0; // top card index in deckServices
  let isDragging = false, startX = 0, startY = 0, currentCard = null;

  function renderCards() {
    arena.querySelectorAll('.deck-card').forEach(c => c.remove());
    cards = [];

    const remaining = deckServices.slice(currentIdx);
    if (remaining.length === 0) {
      emptyState.classList.add('show');
      actionsEl.style.display = 'none';
      return;
    }
    emptyState.classList.remove('show');
    actionsEl.style.display = '';

    const toRender = remaining.slice(0, 7);
    [...toRender].reverse().forEach((svc, revI) => {
      const i = toRender.length - 1 - revI;
      const card = document.createElement('div');
      card.className = 'deck-card';
      card.dataset.index = i;
      card.dataset.svcIdx = currentIdx + i;
      card.innerHTML = `
        <img src="${svc.images[0]}" alt="${svc.title}" loading="${i===0?'eager':'lazy'}" onerror="this.src='images/2.jpg'">
        <div class="deck-overlay-like">BOOK ✅</div>
        <div class="deck-overlay-nope">SKIP ❌</div>
        <div class="deck-card-glass-overlay">
          <div class="deck-card-tag">${svc.category||'decor'}</div>
          <div class="deck-card-title">${svc.title}</div>
          <div class="deck-card-price">₹${svc.price.toLocaleString()}</div>
        </div>
      `;
      arena.insertBefore(card, emptyState);
      cards.push(card);
    });

    if (cards.length > 0) {
      const topCard = cards[cards.length - 1];
      bindDrag(topCard);
    }
  }

  function getTopCard() {
    return arena.querySelector('.deck-card[data-index="0"]');
  }

  function flyCard(direction) {
    const top = getTopCard();
    if (!top) return;
    const xDist = direction === 'right' ? window.innerWidth + 200 : -(window.innerWidth + 200);
    top.style.transition = 'transform 0.5s cubic-bezier(.25,.46,.45,.94), opacity 0.4s ease';
    top.style.transform = `translateX(${xDist}px) rotate(${direction==='right'?25:-25}deg)`;
    top.style.opacity = '0';
    if (direction === 'right') {
      const si = parseInt(top.dataset.svcIdx);
      addToCart(deckServices[si]?.title, deckServices[si]?.price, deckServices[si]?.images?.[0]);
      showToast(`🛒 "${deckServices[si]?.title}" added to cart!`);
    }
    setTimeout(() => {
      currentIdx++;
      renderCards();
    }, 450);
  }

  function showModal(svc) {
    document.getElementById('modalTag').textContent = svc.category || 'decor';
    document.getElementById('modalTitle').textContent = svc.title;
    document.getElementById('modalPrice').textContent = `₹${svc.price.toLocaleString()}`;
    document.getElementById('modalDesc').textContent = svc.desc || '';
    const featHtml = (svc.features||[]).map(f=>`
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
        <span style="width:18px;height:18px;border-radius:50%;background:linear-gradient(135deg,var(--saffron),var(--saffron-dk));display:flex;align-items:center;justify-content:center;font-size:9px;flex-shrink:0;">✓</span>
        <span style="font-size:13px;color:rgba(255,255,255,0.55);">${f}</span>
      </div>`).join('');
    document.getElementById('modalFeatures').innerHTML = featHtml;
    let imgIdx = 0;
    const imgs = svc.images||[''];
    const modalImg = document.getElementById('modalImg');
    modalImg.src = imgs[0];
    document.getElementById('modalPrev').onclick = () => { imgIdx=(imgIdx-1+imgs.length)%imgs.length; modalImg.src=imgs[imgIdx]; };
    document.getElementById('modalNext').onclick = () => { imgIdx=(imgIdx+1)%imgs.length; modalImg.src=imgs[imgIdx]; };
    const waMsg = encodeURIComponent(`Hi! I want to book "${svc.title}" for ₹${svc.price}`);
    document.getElementById('modalActions').innerHTML = `
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <button onclick="addToCart('${svc.title.replace(/'/g,"\\'")}',${svc.price},'${imgs[0]}');this.textContent='✅ Added!';setTimeout(()=>this.textContent='🛒 Add to Cart',1500);" style="flex:1;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:#fff;border-radius:999px;padding:12px;font-family:'Outfit',sans-serif;font-weight:700;cursor:pointer;">🛒 Add to Cart</button>
        <a href="https://wa.me/919389835280?text=${waMsg}" target="_blank" style="flex:1;background:#25D366;border:none;color:#fff;border-radius:999px;padding:12px;text-align:center;text-decoration:none;font-weight:700;display:flex;align-items:center;justify-content:center;gap:6px;">💬 WhatsApp</a>
      </div>
    `;
    document.getElementById('serviceModal').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  document.getElementById('modalClose')?.addEventListener('click', () => {
    document.getElementById('serviceModal').classList.remove('open');
    document.body.style.overflow = '';
  });

  document.getElementById('btnSkip')?.addEventListener('click', () => { flyCard('left'); });
  document.getElementById('btnBook')?.addEventListener('click', () => { flyCard('right'); });
  document.getElementById('btnUndo')?.addEventListener('click', () => {
    if (currentIdx > 0) { currentIdx--; renderCards(); }
  });

  document.getElementById('btnRestart')?.addEventListener('click', () => {
    currentIdx = 0; renderCards();
  });
  document.getElementById('btnInfo')?.addEventListener('click', () => {
    const top = getTopCard();
    if (top) showModal(deckServices[parseInt(top.dataset.svcIdx)]);
  });

  arena.addEventListener('click', e => {
    const card = e.target.closest('.deck-card[data-index="0"]');
    if (card && !isDragging) showModal(deckServices[parseInt(card.dataset.svcIdx)]);
  });


  function bindDrag(card) {
    let originX, originY, tx=0, ty=0, swiping=false;

    const onStart = (cx, cy) => {
      if (card.dataset.index !== '0') return;
      isDragging = false; swiping = true;
      originX = cx; originY = cy; tx=0; ty=0;
      card.style.transition = 'none';
    };
    const onMove = (cx, cy) => {
      if (!swiping) return;
      tx = cx - originX; ty = cy - originY;
      if (Math.abs(tx)>5) isDragging = true;
      const rot = tx * 0.08;
      card.style.transform = `translateX(calc(-50% + ${tx}px)) translateY(${ty*0.15}px) rotate(${rot}deg)`;
      const progress = Math.min(Math.abs(tx)/80,1);
      const likeEl = card.querySelector('.deck-overlay-like');
      const nopeEl = card.querySelector('.deck-overlay-nope');
      if (tx > 30)  { likeEl.style.opacity=progress; nopeEl.style.opacity=0; }
      else if (tx < -30) { nopeEl.style.opacity=progress; likeEl.style.opacity=0; }
      else { likeEl.style.opacity=0; nopeEl.style.opacity=0; }
    };
    const onEnd = () => {
      if (!swiping) return; swiping=false;
      setTimeout(()=>isDragging=false,50);
      if (tx > 80) { flyCard('right'); return; }
      if (tx < -80) { flyCard('left'); return; }
      // Snap back
      card.style.transition = 'transform 0.4s cubic-bezier(.34,1.56,.64,1)';
      card.style.transform = 'translateX(-50%) rotate(0deg) translateY(0)';
      card.querySelector('.deck-overlay-like').style.opacity=0;
      card.querySelector('.deck-overlay-nope').style.opacity=0;
    };

    card.addEventListener('mousedown',  e => onStart(e.clientX, e.clientY));
    window.addEventListener('mousemove', e => onMove(e.clientX, e.clientY));
    window.addEventListener('mouseup',   onEnd);
    card.addEventListener('touchstart', e => onStart(e.touches[0].clientX, e.touches[0].clientY), {passive:true});
    card.addEventListener('touchmove',  e => onMove(e.touches[0].clientX, e.touches[0].clientY), {passive:true});
    card.addEventListener('touchend',   onEnd);
  }

  renderCards();
})();

/* ── Toast ── */
function showToast(msg) {
  const t = document.createElement('div');
  t.style.cssText = 'position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:rgba(12,12,28,0.95);backdrop-filter:blur(20px);border:1px solid rgba(255,153,51,0.3);color:#fff;padding:12px 20px;border-radius:999px;font-size:13px;font-weight:600;z-index:99999;white-space:nowrap;box-shadow:0 8px 30px rgba(0,0,0,0.4);';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity='0'; t.style.transition='opacity 0.4s'; setTimeout(()=>t.remove(),400); }, 2200);
}

/* ── Hero video fallback ── */
(function() {
  const vid = document.getElementById('heroVideo');
  const imgFallback = document.getElementById('heroBgImg');
  function showImg() { if(imgFallback){ imgFallback.style.display='block'; imgFallback.style.opacity='1'; } }
  function hideImg() { if(imgFallback){ imgFallback.style.transition='opacity 0.8s ease'; imgFallback.style.opacity='0'; setTimeout(()=>{ imgFallback.style.display='none'; }, 800); } }
  // Always show image initially (hero never blank)
  showImg();
  if (vid) {
    vid.addEventListener('error', showImg);
    vid.addEventListener('playing', hideImg, {once:true});
    // If video doesn't start in 2.5s, keep showing image
    setTimeout(() => { if(vid.paused && vid.readyState < 3) { /* keep showing image */ } }, 2500);
  }
})();


/* ── Hero bg cycle via Firebase (when no video) ── */
(async function() {
  const data = await window._siteDataPromise;
  if (!data?.heroBanners?.length) return;
  const bgs = data.heroBanners.filter(b=>b.active!==false).map(b=>b.img);
  if (!bgs.length) return;
  const vid = document.getElementById('heroVideo');
  const imgFallback = document.getElementById('heroBgImg');
  // Only cycle if video not playing
  if (vid && !vid.paused) return;
  let i = 0;
  setInterval(()=> {
    i=(i+1)%bgs.length;
    if(imgFallback) { imgFallback.style.opacity='0'; setTimeout(()=>{ imgFallback.src=bgs[i]; imgFallback.style.opacity='1'; }, 800); }
  }, 5000);
})();

/* ── Polaroid gallery click → open in modal ── */
document.querySelectorAll('.polaroid').forEach(p => {
  p.addEventListener('click', () => {
    const img = p.querySelector('img');
    const cap = p.querySelector('.polaroid-caption')?.textContent || '';
    document.getElementById('modalTag').textContent = 'Gallery';
    document.getElementById('modalTitle').textContent = cap;
    document.getElementById('modalPrice').textContent = '';
    document.getElementById('modalDesc').textContent = '';
    document.getElementById('modalFeatures').innerHTML = '';
    document.getElementById('modalImg').src = img.src;
    document.getElementById('modalActions').innerHTML = `<a href="gallery.html" class="btn-saffron ripple-btn" style="width:100%;justify-content:center;">View Full Gallery →</a>`;
    document.getElementById('serviceModal').classList.add('open');
    document.body.style.overflow='hidden';
  });
});

/* ── PWA ── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(()=>{}));
}

