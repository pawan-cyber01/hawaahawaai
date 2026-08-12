
  const DEFAULT_SERVICES = [
    { title:'Haldi & Mehendi Specials', price:3999, category:'other', images:['img/haldi.webp'], desc:'Premium yellow chrome balloons and floral fusion decor for pre-wedding events.', features:['Marigold Garland Backgrounds','Yellow & Gold Chrome Arches','Premium Seating Setup'], customLink:'haldi-mehendi-decoration.html'},
    { title:'3 Mix Color Arch', price:5000, category:'other', images:['img/ring3.jpeg'], desc:'Elegant balloon arch decoration.', features:['Premium latex balloons','Color customizable','Professional installation']},
    { title:'Rose Gold & White Arch', price:5499, category:'other', images:['img/halfring.jpeg'], desc:'Elegant rose gold balloon arch.', features:['Premium latex balloons','Color customizable','Professional installation']},
    { title:'White and Golden Ring', price:5999, category:'birthday', images:['img/ring.jpeg'], desc:'Stunning ring backdrop for elegant photo opportunities.', features:['Circular ring frame setup','Chrome & pastel balloons','Neon sign / Happy Birthday']},
    { title:'Birthday Decoration', price:12000, category:'birthday', images:['img/111.jpeg'], desc:'Make birthdays memorable with vibrant balloon decorations.', features:['Theme-based balloon arches','LED backdrop with fairy lights','Cake table decoration']},
    { title:'Anniversary Setup', price:9999, category:'anniversary', images:['img/112.jpeg'], desc:'Romantic anniversary balloon & floral setup.', features:['Heart-shaped balloon arch','Romantic LED lighting','Customized name initial foils']},
    { title:'Happy Birthday Backdrop', price:9000, category:'birthday', images:['img/a1.jpeg'], desc:'Make birthdays memorable with vibrant balloon decorations.', features:['Theme-based balloon arches','LED backdrop with fairy lights','Cake table decoration']},
    { title:'Baby Shower Centerpiece', price:8999, category:'babyshower', images:['img/102.jpeg'], desc:'Beautiful baby shower balloon setups.', features:["Oh Baby / It's a Boy/Girl foil",'Pastel balloon centerpieces','Free delivery & installation']},
    { title:'Filmy Theme Photo Setup', price:9999, category:'birthday', images:['img/116.jpeg'], desc:'Bollywood style filmy photo setup.', features:['Movie theme props','Red carpet style lighting','Star-studded balloon arch']},
    { title:'Cinderella Theme', price:39999, category:'kids', images:['img/d1.jpeg'], desc:'Dreamy fairy tale decoration.', features:['Fairy tale castle props','Soft pink & white balloons','Magical ambient lighting']},
    { title:'Mickey Mouse Theme', price:49000, category:'kids', images:['img/02.jpeg'], desc:'Magical Disney themed balloon decoration.', features:['Mickey/Minnie cutout props','Red, Black & Yellow balloons','Customized theme setup']},
    { title:'Jungle Theme', price:39999, category:'kids', images:['img/51.jpeg'], desc:'Thrilling jungle-themed balloon decoration.', features:['Jungle animal foil balloons','Green & Gold themed arch','Photography-ready jungle backdrop']},
    { title:'First Night Decoration', price:3999, category:'anniversary', images:['img/81.jpeg'], desc:'First night room decoration.', features:['Rose petals on bed','Red heart balloon ceiling','Soft glowing candles/LEDs']},
  ];
  const DEFAULT_ACTIVITIES = [
    {title:'Foosball Table',price:5000,img:'images/activities/fossball.webp'},
    {title:'Bang The Hammer',price:14000,img:'images/activities/bang.webp'},
    {title:'Multiple Bounce',price:9000,img:'images/activities/bounce.jpg'},
    {title:'Mega Wire',price:6000,img:'images/activities/megawire.webp'},
    {title:'Basketball',price:9000,img:'images/activities/basketball.webp'},
    {title:'Hoop Toss',price:6000,img:'images/activities/hoop.jpg'},
    {title:'Chocolate Shooting',price:4000,img:'images/activities/shoot.jpg'},
    {title:'Bubble Machine',price:5000,img:'images/activities/bubble.jpg'},
    {title:'Popcorn Machine',price:5000,img:'images/activities/popcorn.jpg'},
    {title:'Candy Floss',price:4000,img:'images/activities/candyfloss.jpg'},
    {title:'Chocolate Fountain',price:5000,img:'images/activities/fountain.jpg'},
    {title:'Wax Hand',price:500,img:'images/activities/waxhand.jpg',unit:'per person'},
    {title:'Hair Beading',price:3000,img:'images/activities/hair.jpg'},
    {title:'Nail Art',price:3000,img:'images/activities/nail.jpg'},
    {title:'Pottery Making',price:3500,img:'images/activities/pottery.jpg'},
    {title:'Key Chain Making',price:4000,img:'images/activities/keychain.jpg'},
  ];
  async function getServices() {
    const d = await window._siteDataPromise;
    const list = (d?.services?.length) ? d.services : DEFAULT_SERVICES;
    return list.map(s => ({...s, images: Array.isArray(s.images)&&s.images.length?s.images:[''], features:Array.isArray(s.features)?s.features:[], qty:0})).sort((a,b)=>a.price-b.price);
  }
  async function getActivities() {
    const d = await window._siteDataPromise;
    const list = (d?.activities?.length) ? d.activities : DEFAULT_ACTIVITIES;
    return list.map(a => ({...a, title:a.title||a.name||'', img:a.img||'', qty:0}));
  }
  function getCart() { return JSON.parse(localStorage.getItem('cart')||'[]'); }
  function saveCart(cart) { localStorage.setItem('cart', JSON.stringify(cart)); updateCartCount(); }
  function addToCart(name, price, img) {
    const cart = getCart();
    const ex = cart.find(i=>i.name===name);
    if (ex) { ex.qty++; } else { cart.push({name, price, img, qty:1}); }
    saveCart(cart); return getCart().find(i=>i.name===name)?.qty || 1;
  }
  function changeQty(name, delta) {
    let cart = getCart();
    const ex = cart.find(i=>i.name===name);
    if (ex) { ex.qty+=delta; if(ex.qty<=0) cart=cart.filter(i=>i.name!==name); saveCart(cart); }
  }
  function updateCartCount() {
    const total = getCart().reduce((s,i)=>s+i.qty,0);
    document.querySelectorAll('#cartCountDesktop,#cartCountMobile').forEach(el=>{
      if(el){ el.textContent=total; }
    });
  }
  
