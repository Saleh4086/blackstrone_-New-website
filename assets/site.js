const btn=document.querySelector('.menu-toggle');
const nav=document.querySelector('.site-header nav');
if(btn&&nav){btn.addEventListener('click',()=>nav.classList.toggle('open'));}

// Luxury-home front page carousel
const slides=[...document.querySelectorAll('.hero-slide')];
const dots=[...document.querySelectorAll('.hero-dot')];
let slideIndex=0, slideTimer;
function showSlide(i){
  if(!slides.length) return;
  slideIndex=(i+slides.length)%slides.length;
  slides.forEach((s,n)=>s.classList.toggle('active',n===slideIndex));
  dots.forEach((d,n)=>d.classList.toggle('active',n===slideIndex));
}
function startSlides(){
  clearInterval(slideTimer);
  slideTimer=setInterval(()=>showSlide(slideIndex+1),5200);
}
dots.forEach((d,i)=>d.addEventListener('click',()=>{showSlide(i);startSlides();}));
showSlide(0); startSlides();

// Search panel tabs
const tabs=[...document.querySelectorAll('.search-tab')];
const searchTitle=document.querySelector('[data-search-title]');
const searchText=document.querySelector('[data-search-text]');
const searchInput=document.querySelector('[data-search-input]');
tabs.forEach(tab=>tab.addEventListener('click',()=>{
  tabs.forEach(t=>t.classList.remove('active')); tab.classList.add('active');
  const mode=tab.dataset.mode;
  if(mode==='rent'){
    if(searchTitle) searchTitle.textContent='Find a rental';
    if(searchText) searchText.textContent='Explore Blackstone rentals and apply securely through RentSpree.';
    if(searchInput) searchInput.placeholder='City, ZIP or rental address';
  } else if(mode==='manage'){
    if(searchTitle) searchTitle.textContent='Rental property evaluation';
    if(searchText) searchText.textContent='See how Blackstone can market, lease and manage your East Bay rental.';
    if(searchInput) searchInput.placeholder='Enter your rental property address';
  } else {
    if(searchTitle) searchTitle.textContent='Find your next home';
    if(searchText) searchText.textContent='Search East Bay homes by city, ZIP, neighborhood or MLS number.';
    if(searchInput) searchInput.placeholder='City, ZIP, neighborhood or MLS #';
  }
}));

// Replace this one value when Sal sends his exact RentSpree apply URL.
const RENTSPREE_URL='https://apply.link/I-wM6FA';
window.openRentSpree=function(){
  if(RENTS_PREE_READY()) window.open(RENTS_PREE_URL,'_blank','noopener');
  else alert('RentSpree button is ready. Add your exact RentSpree application URL in assets/site.js to activate it.');
};
function RENTS_PREE_READY(){return /^https?:\/\//i.test(RENTS_PREE_URL);}

// Facebook and Instagram buttons are visible but intentionally not pointed at a guessed account.



const LISTING_KEY='blackstone_custom_listings_v1';
function getListings(){try{return JSON.parse(localStorage.getItem(LISTING_KEY)||'[]')}catch(e){return []}}
function saveListings(x){localStorage.setItem(LISTING_KEY,JSON.stringify(x))}
function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function statusLabel(s){return {'for-sale':'For Sale','pending':'Pending','sold':'Sold','rental':'For Rent'}[s]||s}
function renderPublic(filter='all'){const box=document.getElementById('dynamicListings');if(!box)return;const items=getListings().filter(x=>filter==='all'||x.status===filter);box.innerHTML=items.length?items.map(x=>`<article class="dynamic-card" data-status="${esc(x.status)}">${x.photo?`<img src="${esc(x.photo)}" alt="${esc(x.address)}">`:''}<div class="dynamic-body"><span class="tag">${statusLabel(x.status)}</span><div class="dynamic-price">${esc(x.price)}</div><h3>${esc(x.address)}</h3><p>${esc(x.meta)}</p>${x.url?`<a class="sold-link" href="${esc(x.url)}" target="_blank" rel="noopener">View property →</a>`:''}</div></article>`).join(''):'<p class="sold-note">No custom properties in this category yet. Use Manage Properties to add one.</p>'}
document.querySelectorAll('.listing-tab').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.listing-tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderPublic(b.dataset.filter)}));renderPublic();
const lf=document.getElementById('listingForm');if(lf){lf.addEventListener('submit',e=>{e.preventDefault();const a=getListings();a.unshift({id:Date.now(),status:lmStatus.value,address:lmAddress.value,price:lmPrice.value,meta:lmMeta.value,photo:lmPhoto.value,url:lmUrl.value});saveListings(a);lf.reset();renderManager();alert('Property added to this browser preview.');});}
function renderManager(){const box=document.getElementById('managerListings');if(!box)return;const a=getListings();box.innerHTML=a.length?a.map(x=>`<div class="manager-item"><strong>${statusLabel(x.status)} · ${esc(x.address)}</strong><span>${esc(x.price)} ${esc(x.meta)}</span><br><button type="button" data-del="${x.id}">Remove</button></div>`).join(''):'<p>No custom properties added yet.</p>';box.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{saveListings(getListings().filter(x=>x.id!=b.dataset.del));renderManager()})}renderManager();
const clear=document.getElementById('clearListings');if(clear)clear.onclick=()=>{if(confirm('Clear all custom property cards from this browser?')){saveListings([]);renderManager()}};


// Mortgage calculator
function money(v){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Number.isFinite(v)?v:0)}
function calculateMortgage(){
  const hp=document.getElementById('homePrice'); if(!hp) return;
  const price=Math.max(0,parseFloat(hp.value)||0);
  const down=Math.max(0,parseFloat(document.getElementById('downPayment').value)||0);
  const principal=Math.max(0,price-down);
  const annualRate=Math.max(0,parseFloat(document.getElementById('interestRate').value)||0)/100;
  const years=parseInt(document.getElementById('loanTerm').value||'30',10);
  const n=years*12, r=annualRate/12;
  const pi=r===0?(n?principal/n:0):principal*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);
  const tax=(parseFloat(document.getElementById('propertyTax').value)||0)/12;
  const ins=(parseFloat(document.getElementById('insurance').value)||0)/12;
  const hoa=parseFloat(document.getElementById('hoa').value)||0;
  const pmi=parseFloat(document.getElementById('pmi').value)||0;
  document.getElementById('monthlyTotal').textContent=money(pi+tax+ins+hoa+pmi);
  document.getElementById('piPayment').textContent=money(pi);
  document.getElementById('taxPayment').textContent=money(tax);
  document.getElementById('insurancePayment').textContent=money(ins);
  document.getElementById('otherPayment').textContent=money(hoa+pmi);
  document.getElementById('loanAmount').textContent=money(principal);
}
['homePrice','downPayment','interestRate','loanTerm','propertyTax','insurance','hoa','pmi'].forEach(id=>{const el=document.getElementById(id);if(el){el.addEventListener('input',calculateMortgage);el.addEventListener('change',calculateMortgage)}});
calculateMortgage();

// Classic Blackstone mortgage-rate runner.
(function(){
  if(document.getElementById('blackstoneClassicRateBar')) return;

  const bar=document.createElement('div');
  bar.id='blackstoneClassicRateBar';
  bar.className='bs-classic-ratebar';
  bar.innerHTML=`
    <div class="bs-classic-rate-track">
      <span class="gold">30-YEAR FIXED NATIONAL AVERAGE <b data-run-rate>CHECKING…</b></span>
      <span class="black">UPDATED WEEKLY</span>
      <span class="gold" data-run-change>LATEST AVAILABLE</span>
      <a class="black" href="mortgage-calculator.html">SEE HOW THE LATEST RATE AFFECTS YOUR PAYMENT →</a>
      <span class="gold">BLACKSTONE MORTGAGE RATE WATCH</span>
      <a class="black" href="mortgage-calculator.html">OPEN THE BLACKSTONE MORTGAGE CALCULATOR →</a>
      <span class="gold">30-YEAR FIXED NATIONAL AVERAGE <b data-run-rate>CHECKING…</b></span>
      <span class="black">UPDATED WEEKLY</span>
      <span class="gold" data-run-change>LATEST AVAILABLE</span>
      <a class="black" href="mortgage-calculator.html">SEE HOW THE LATEST RATE AFFECTS YOUR PAYMENT →</a>
      <span class="gold">BLACKSTONE MORTGAGE RATE WATCH</span>
      <a class="black" href="mortgage-calculator.html">OPEN THE BLACKSTONE MORTGAGE CALCULATOR →</a>
    </div>`;
  const header=document.querySelector('.site-header');
  if(header) header.insertAdjacentElement('afterend',bar);
  else document.body.prepend(bar);

  fetch('/api/rates',{cache:'no-store'})
    .then(r=>r.json().then(data=>({ok:r.ok,data})))
    .then(({ok,data})=>{
      if(!ok) throw new Error(data.error||'Rate unavailable');
      document.querySelectorAll('[data-run-rate]').forEach(x=>x.textContent=Number(data.rate30).toFixed(2)+'%');
      const c=Number(data.change30);
      const t=Number.isFinite(c)
        ? c>0?`▲ UP ${Math.abs(c).toFixed(2)}% FROM LAST WEEK`
        : c<0?`▼ DOWN ${Math.abs(c).toFixed(2)}% FROM LAST WEEK`
        :'→ UNCHANGED FROM LAST WEEK'
        : `LATEST WEEKLY AVERAGE · ${data.updated}`;
      document.querySelectorAll('[data-run-change]').forEach(x=>x.textContent=t);
    })
    .catch(()=>{
      document.querySelectorAll('[data-run-rate]').forEach(x=>x.textContent='6.55%');
      document.querySelectorAll('[data-run-change]').forEach(x=>x.textContent='LATEST VERIFIED WEEKLY AVERAGE');
    });
})();

// Blackstone AI Concierge.
(function(){
  if(document.getElementById('blackstoneAiLauncher')) return;
  const wrap=document.createElement('div');
  wrap.innerHTML=`
    <button id="blackstoneAiLauncher" class="bs-ai-launcher" aria-label="Open Blackstone AI">✦ Ask Blackstone AI</button>
    <section id="blackstoneAiPanel" class="bs-ai-panel" aria-label="Blackstone AI Concierge">
      <header><div><strong>BLACKSTONE AI</strong><span>Real Estate Concierge</span></div><button id="blackstoneAiClose" aria-label="Close">×</button></header>
      <div id="blackstoneAiMessages" class="bs-ai-messages">
        <div class="bs-ai-bubble bot">Hi! I’m the Blackstone AI Concierge. Ask about buying, selling, mortgage payments, investing, rentals, or property management.</div>
      </div>
      <div class="bs-ai-actions">
        <button data-ai-prompt="Help me search for a home.">Search Homes</button>
        <button data-ai-prompt="Help me estimate my home value.">Home Value</button>
        <button data-ai-prompt="What are the current mortgage rates?">Mortgage Rates</button>
        <button data-ai-prompt="Tell me about Blackstone property management.">Property Management</button>
      </div>
      <form id="blackstoneAiForm" class="bs-ai-form">
        <textarea id="blackstoneAiInput" rows="2" placeholder="Ask a real estate question…"></textarea>
        <button type="submit">Send</button>
      </form>
      <small>AI responses are general information. Verify property, lending, legal, and market details with qualified professionals.</small>
    </section>`;
  document.body.appendChild(wrap);

  const launcher=document.getElementById('blackstoneAiLauncher');
  const panel=document.getElementById('blackstoneAiPanel');
  const close=document.getElementById('blackstoneAiClose');
  const form=document.getElementById('blackstoneAiForm');
  const input=document.getElementById('blackstoneAiInput');
  const messages=document.getElementById('blackstoneAiMessages');
  const history=[];

  function open(){panel.classList.add('open');launcher.setAttribute('aria-expanded','true');input.focus();}
  function shut(){panel.classList.remove('open');launcher.setAttribute('aria-expanded','false');}
  function add(text,who){
    const b=document.createElement('div');
    b.className='bs-ai-bubble '+who;
    b.textContent=text;
    messages.appendChild(b);
    messages.scrollTop=messages.scrollHeight;
    return b;
  }
  async function send(text){
    text=(text||'').trim(); if(!text) return;
    add(text,'user'); history.push({role:'user',text}); input.value='';
    const typing=add('Thinking…','bot typing');
    try{
      const res=await fetch('/api/chat',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({message:text,history:history.slice(-10)})
      });
      const raw=await res.text();
      let data={};
      if(raw){
        try{data=JSON.parse(raw);}
        catch{throw new Error(`Server returned ${res.status}: ${raw.slice(0,120)}`);}
      }else{
        throw new Error(`Server returned an empty response (${res.status})`);
      }
      if(!res.ok) throw new Error(data.error||`Request failed (${res.status})`);
      typing.remove();
      add(data.reply,'bot');
      history.push({role:'model',text:data.reply});
    }catch(err){
      typing.textContent='AI connection error: '+err.message;
      typing.classList.remove('typing');
    }
  }
  launcher.addEventListener('click',()=>panel.classList.contains('open')?shut():open());
  close.addEventListener('click',shut);
  form.addEventListener('submit',e=>{e.preventDefault();send(input.value);});
  input.addEventListener('keydown',e=>{
    if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send(input.value);}
  });
  document.querySelectorAll('[data-ai-prompt]').forEach(b=>b.addEventListener('click',()=>send(b.dataset.aiPrompt)));
})();
