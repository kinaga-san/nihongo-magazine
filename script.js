/* ====== Utilities ====== */
const $ = s => document.querySelector(s);
const $all = s => document.querySelectorAll(s);

/* ====== Food Data (unchanged) ====== */
const FOODS = [
  { id:1, region:'長野・ながの', name_jp:'味噌', name_en:'Miso Soup', taste:'umami', image:'images/miso.png', notes:'A powerful pasts of soybeans, best friends with soup.', video:'https://www.youtube.com/embed/O4R2hgvyoDg'},
  { id:2, region:'大阪・おおさか', name_jp:'タコ焼き', name_en:'Takoyaki', taste:'sweet', image:'images/takoyaki.png', notes:'Round dough balls with octopus.', video:'https://www.youtube.com/embed/ciQ9gzK9IWM'},
  { id:3, region:'香川・かがわ', name_jp:'うどん', name_en:'Udon', taste:'umami', image:'images/udon.png', notes:'Thick noodles so soft they feel like edible clouds.', video:'https://www.youtube.com/embed/NzoXz-_wk58'},
  { id:4, region:'京都・きょうと', name_jp:'豆腐', name_en:'Tofu', taste:['salty','umami'], image:'images/tofu.png', notes:'Soft, quiet, polite protein that absorbs flavors like sponge of peace.', video:'https://www.youtube.com/embed/pjwI5tbQLo0'},
  { id:5, region:'東京・とうきょう', name_jp:'天ぷら', name_en:'Tempura', taste:'sour', image:'images/tenpura.png', notes:'Vegetables or shrimp wearing golden <br>crispy armor of deliciousness.', video:'https://www.youtube.com/embed/s1XtDCPIvtE'},
  { id:6, region:'宇都宮・うつのみや', name_jp:'餃子', name_en:'Gyoza', taste:'salty', image:'images/gyoza.png', notes:'Pan-fried dumplings from Osaka.', video:'https://www.youtube.com/embed/VoTqzjg83u8'},
  { id:7, region:'関東・かんとう', name_jp:'団子', name_en:'dango', taste:'sweet', image:'images/dango.png', notes:'Soft chewy rice balls on a stick.', video:'https://www.youtube.com/embed/NwIV7osGw10'},
];

/* ====== Render Food List ====== */
let activeTaste = null;

function toggleTaste(btn){
  const t = btn.getAttribute('data-taste');
  if(activeTaste === t){
    activeTaste = null;
    btn.classList.remove('active');
  } else {
    activeTaste = t;
    $all('[data-taste]').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
  }
  applyFilters();
}

function applyFilters(){
  let items = FOODS.slice();
  if(activeTaste){
    items = items.filter(i => i.taste === activeTaste);
  }
  renderFoodList(items);
}

function renderFoodList(items){
  const list = $('#food-list');
  if(!list) return;
  list.innerHTML = '';
  if(items.length === 0){
    list.innerHTML = '<div class="muted">No items match.</div>';
    return;
  }
  items.forEach(food=>{
    const div = document.createElement('div');
    div.className = 'food-card';
    div.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-family:'Source Serif 4', serif; font-size:17px">${food.name_jp} <span style="font-size:12px;color:var(--muted)">/ ${food.name_en}</span></div>
          <div class="food-meta">${food.region} • ${food.taste}</div>
          <div class="small" style="margin-top:6px">${food.notes}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end">
          <button class="btn" onclick='openVideo("${food.video}")'>Try it yourself</button>
        </div>
      </div>
      <div style="margin-top:8px"><img src="${food.image}" alt="${food.name_en}" style="width:100%; border-radius:8px;"/></div>
    `;
    list.appendChild(div);
  });
  createDots(items);
}

/* ====== Dots ====== */
let scrollIndex = 0;

function createDots(items){
  const dotsContainer = $('#food-dots');
  if(!dotsContainer) return;
  dotsContainer.innerHTML = '';
  items.forEach((food,i)=>{
    const dot = document.createElement('span');
    dot.className = 'dot';
    if(i===0) dot.classList.add('active');
    dot.addEventListener('click', ()=>{
      scrollIndex = i;
      scrollToCard(i);
    });
    dotsContainer.appendChild(dot);
  });
}

function updateDots(index){
  $all('#food-dots .dot').forEach((d,i)=>d.classList.toggle('active', i===index));
}

function scrollToCard(i){
  const list = $('#food-list');
  if(!list) return;
  const card = list.children[i];
  if(card) {
    list.scrollLeft = card.offsetLeft - list.offsetLeft;
    updateDots(i);
    scrollIndex = i;
  }
}

/* ====== Auto Scroll ====== */
function autoScrollFoods(){
  const list = $('#food-list');
  if(!list) return;
  const cards = list.children;
  if(cards.length === 0) return;

  scrollIndex = (scrollIndex + 1) % cards.length;
  scrollToCard(scrollIndex);
}
setInterval(autoScrollFoods, 5000);

/* ====== Video Modal ====== */
function openVideo(embedUrl){
  const content = $('#modal-content');
  if(!content) return;
  content.innerHTML = `<iframe src="${embedUrl}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%;height:420px;border-radius:8px"></iframe>`;
  const modal = $('#modal');
  if(modal) {
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden','false');
  }
}
function closeModal(){
  const modal = $('#modal');
  if(modal) {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden','true');
  }
  const content = $('#modal-content');
  if(content) content.innerHTML = '';
}

/* ====== Reveal Animation ====== */
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('show'); observer.unobserve(e.target) }
  });
},{threshold:0.12});
reveals.forEach(r=>observer.observe(r));

/* ====== Mobile nav toggle ====== */
const toggleBtn = $('#toggle-nav');
if(toggleBtn){
  toggleBtn.addEventListener('click',()=>{
    const navul = document.querySelector('nav ul');
    if(navul) navul.classList.toggle('open');
  });
}

/* Close mobile menu when link clicked (optional) */
$all('nav ul li a').forEach(link => {
  link.addEventListener('click', () => {
    const navul = document.querySelector('nav ul');
    if(navul && navul.classList.contains('open')) navul.classList.remove('open');
  });
});

/* ====== Scroll to id ====== */
function scrollToId(id){
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({behavior:'smooth', block:'start'});
}

/* ====== Escape key closes modal ====== */
document.addEventListener('keydown', e=>{
  if(e.key === 'Escape') closeModal();
});

/* ====== Furigana toggle ====== */
const toggleFuriganaBtn = document.getElementById('toggle-furigana');
if(toggleFuriganaBtn){
  toggleFuriganaBtn.addEventListener('click', () => {
    const allFurigana = document.querySelectorAll('rt');
    allFurigana.forEach(rt => {
      rt.style.display = (rt.style.display === 'inline') ? 'none' : 'inline';
    });
  });
}

/* ====== Article download ====== */

async function downloadArticle(filePath = 'recording/kinaga-article.pdf', suggestedName = 'kinaga-article.pdf') {
  // Try a HEAD request first to check file exists (fast). If HEAD is blocked by CORS,
  // fetch will throw — we'll fallback to direct-link approach below.
  try {
    const headResp = await fetch(filePath, { method: 'HEAD' });
    if (!headResp.ok) {
      throw new Error(`File not found (status ${headResp.status})`);
    }
    // File exists -> trigger download
    const a = document.createElement('a');
    a.href = filePath;
    a.download = suggestedName; // ask browser to save as this filename
    document.body.appendChild(a);
    a.click();
    a.remove();
    return;
  } catch (err) {
    // HEAD failed (could be CORS or 404). Fallback: try to download via a simple GET anchor.
    // Note: if server returns Content-Disposition: inline, some browsers will open PDF in tab.
    // Setting download attribute still suggests saving.
    console.warn('HEAD check failed — falling back to direct download link.', err);

    // Create a hidden iframe to force the browser to get the resource (optional)
    // but most reliable is just creating an anchor with download attribute.
    const a = document.createElement('a');
    a.href = filePath;
    a.download = suggestedName;
    // If you want it to open in a new tab instead of forcing download: a.target = '_blank'
    document.body.appendChild(a);
    a.click();
    a.remove();

    // If you'd like, show a friendly user message on failure
    // (for example, after a brief delay check if the resource loaded)
    setTimeout(() => {
      // Can't reliably detect success across browsers, but we can alert on likely failure
      // if the user still hasn't started a download (this is heuristic).
      // Remove this block if you prefer no popups.
      // alert('If the PDF did not download, please check that the file exists at: ' + filePath);
    }, 1000);
  }
}

// Attach to your download button (existing button id = download-article)
const dlBtn = document.getElementById('download-article');
if (dlBtn) {
  dlBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Provide the actual path where you uploaded the PDF
    downloadArticle('recording/kinaga-article.pdf', 'kinaga-article.pdf');
  });
}
/* ====== Initialize Food List ====== */
renderFoodList(FOODS);
