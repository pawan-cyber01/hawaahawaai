document.addEventListener("DOMContentLoaded", function() {
    // 1. Inject Search Bar into Navbar
    const searchHtml = `
      <div class="nav-search-container" style="position:relative; margin-left:20px; display:inline-flex; align-items:center;">
        <input type="text" id="globalSearchInput" placeholder="Search events (e.g. birthday)..." 
               style="background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.3); border-radius:20px; padding:6px 12px; color:inherit; outline:none; font-size:14px; width:200px; transition:all 0.3s;"
               onfocus="this.style.background='rgba(255,255,255,0.2)'; this.style.borderColor='var(--accent-primary, #eab308)';"
               onblur="this.style.background='rgba(255,255,255,0.1)'; this.style.borderColor='rgba(255,255,255,0.3)';">
        <button onclick="executeGlobalSearch()" style="position:absolute; right:10px; background:none; border:none; cursor:pointer; font-size:16px;">🔍</button>
      </div>
    `;

    // Try to find the desktop navbar
    let nav = document.querySelector('.nav-luxury') || document.querySelector('nav.hidden.md\\:flex');
    if (nav) {
        nav.insertAdjacentHTML('beforeend', searchHtml);
    }

    // Bind Enter key
    setTimeout(() => {
        const sb = document.getElementById('globalSearchInput');
        if (sb) {
            sb.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') executeGlobalSearch();
            });
        }
    }, 500);

    // 2. Inject Budget Planner before footer
    if (!document.getElementById('userBudget') && !document.getElementById('bpUserBudget')) {
        const budgetHtml = `
        <section id="budgetPlannerGlobal" style="padding:40px 20px; max-width:800px; mx-auto; margin:0 auto;">
          <div style="text-align:left; margin-bottom:20px;">
            <span class="section-label" style="justify-content:flex-start; margin-left:0; background:rgba(168,85,247,0.1); color:#a855f7; padding:4px 12px; border-radius:20px; font-weight:bold; font-size:12px; display:inline-block;">✨ Budget Planner</span>
            <h2 class="section-title" style="font-size:28px; margin-top:10px;">Plan in Your <span style="background:linear-gradient(135deg,#eab308,#f59e0b);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Budget</span></h2>
          </div>
          <div class="glass-card" style="padding:30px; border-radius:24px; border:1px solid rgba(168,85,247,0.2); box-shadow:0 0 40px rgba(168,85,247,0.1); background:rgba(255,255,255,0.05); backdrop-filter:blur(20px);">
            <p style="color:var(--text-secondary, #666); font-size:14px; text-align:center; margin-bottom:28px;">Tell us your requirements and we'll design the magic!</p>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:16px;">
              <div>
                <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:6px; color:var(--text-primary, #333);">Event Type</label>
                <input type="text" id="bpEventType" placeholder="e.g. Birthday" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd; background:rgba(255,255,255,0.5);">
              </div>
              <div>
                <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:6px; color:var(--text-primary, #333);">Budget (₹)</label>
                <input type="number" id="bpUserBudget" placeholder="e.g. 15000" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd; background:rgba(255,255,255,0.5);">
              </div>
              <div>
                <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:6px; color:var(--text-primary, #333);">Event Date</label>
                <input type="date" id="bpEventDate" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd; background:rgba(255,255,255,0.5);">
              </div>
              <div>
                <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:6px; color:var(--text-primary, #333);">Venue Area</label>
                <input type="text" id="bpEventAddress" placeholder="e.g. Noida Sec-62" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd; background:rgba(255,255,255,0.5);">
              </div>
              <div style="grid-column:1/-1;">
                <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:6px; color:var(--text-primary, #333);">Event Details</label>
                <textarea id="bpEventDesc" placeholder="Describe your event requirements..." style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd; background:rgba(255,255,255,0.5); height:80px;"></textarea>
              </div>
              <div style="grid-column:1/-1;">
                <button onclick="sendGlobalBudgetToWA()" style="width:100%; padding:14px; border-radius:12px; border:none; background:linear-gradient(135deg, #25D366, #128C7E); color:white; font-weight:bold; font-size:16px; cursor:pointer; display:flex; justify-content:center; align-items:center; gap:8px; box-shadow:0 10px 20px rgba(37,211,102,0.3); transition:all 0.3s;">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M20.52 3.48A11.9 11.9 0 0012 0C5.37 0 .06 5.31 0 11.93c0 2.1.55 4.17 1.59 5.99L0 24l6.3-1.65a12 12 0 0011.4-2.86c5.05-5.05 5.05-13.26 0-18.31z" /></svg>
                  Get Custom Quote via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </section>
        `;

        // Try to find footer to insert before it
        let footer = document.querySelector('footer');
        if (footer) {
            footer.insertAdjacentHTML('beforebegin', budgetHtml);
        } else {
            document.body.insertAdjacentHTML('beforeend', budgetHtml);
        }
    }
});

// Search Logic
window.executeGlobalSearch = function() {
    const q = document.getElementById('globalSearchInput').value.toLowerCase();
    if (!q) return;

    if (q.includes('birth') || q.includes('bday')) {
        window.location.href = 'birthday-balloon-decoration-delhi-ncr.html';
    } else if (q.includes('haldi') || q.includes('mehendi') || q.includes('handi')) {
        window.location.href = 'haldi-mehendi-decoration.html';
    } else if (q.includes('marriag') || q.includes('wed') || q.includes('annivers') || q.includes('romant') || q.includes('couple') || q.includes('love')) {
        window.location.href = 'anniversary-room-decoration-delhi.html';
    } else if (q.includes('baby') || q.includes('shower')) {
        window.location.href = 'baby-shower-balloon-decoration-gurgaon.html';
    } else if (q.includes('kid') || q.includes('child') || q.includes('boy') || q.includes('girl')) {
        window.location.href = 'kids-birthday-decoration-at-home.html';
    } else {
        alert('No exact page match found. Browsing all services instead!');
        window.location.href = 'index.html#services';
    }
};

// Budget Planner Logic
window.sendGlobalBudgetToWA = function() {
    const type = document.getElementById('bpEventType').value;
    const budget = document.getElementById('bpUserBudget').value;
    const date = document.getElementById('bpEventDate').value;
    const address = document.getElementById('bpEventAddress').value;
    const desc = document.getElementById('bpEventDesc').value;

    if (!type || !budget || !date || !address || !desc) {
        alert('Please fill in all details!');
        return;
    }
    const msg = encodeURIComponent(`Hi Hawaa Hawaai! 🎈\n\nEvent: ${type}\n📅 Date: ${date}\n📍 Venue: ${address}\n💰 Budget: ₹${budget}\n📝 Details: ${desc}`);
    window.open(`https://wa.me/919389835280?text=${msg}`, '_blank');
};
