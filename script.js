/* ====== Utilities ====== */
const $ = s => document.querySelector(s);
const $all = s => document.querySelectorAll(s);

/* ====== Food Data ====== */
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

/* ====== Initialize ====== */
renderFoodList(FOODS);
