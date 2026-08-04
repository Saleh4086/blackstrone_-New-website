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
function renderPublic(filter='all'){const box=document.getElementById('dynamicListings');if(!box)return;const items=getListings().filter(x=>filter==='all'||x.status===filter);box.innerHTML=items.length?items.map(x=>`<article class="dynamic-card" data-status="${esc(x.status)}">${x.photo?`<img src="${esc(x.photo)}" alt="${esc(x.address)}">`:''}<div class="dynamic-body"><span class="tag">${statusLabel(x.status)}</span><div class="dynamic-price">${esc(x.price)}</div><h3>${esc(x.address)}</h3><p>${esc(x.meta)}</p>${x.url?`<a class="sold-link" href="${esc(x.url)}" target="_blank" rel="noopener">View property →</a>`:''}${x.status==='rental'&&x.rentSpree?`<br><a class="btn gold rental-apply-inline" href="${esc(x.rentSpree)}" target="_blank" rel="noopener">Apply for This Rental</a>`:''}${x.status==='rental'&&!x.rentSpree?`<br><a class="btn dark rental-apply-inline" href="contact.html">Ask How to Apply</a>`:''}</div></article>`).join(''):'<p class="sold-note">No custom properties in this category yet. Use Manage Properties to add one.</p>'}
document.querySelectorAll('.listing-tab').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.listing-tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderPublic(b.dataset.filter)}));renderPublic();
const lf=document.getElementById('listingForm');if(lf){lf.addEventListener('submit',e=>{e.preventDefault();const a=getListings();a.unshift({id:Date.now(),status:lmStatus.value,address:lmAddress.value,price:lmPrice.value,meta:lmMeta.value,photo:lmPhoto.value,url:lmUrl.value,rentSpree:(document.getElementById('lmRentSpree')||{}).value||''});saveListings(a);lf.reset();renderManager();alert('Property added to this browser preview.');});}
function renderManager(){const box=document.getElementById('managerListings');if(!box)return;const a=getListings();box.innerHTML=a.length?a.map(x=>`<div class="manager-item"><strong>${statusLabel(x.status)} · ${esc(x.address)}</strong><span>${esc(x.price)} ${esc(x.meta)}${x.status==='rental'?`<br>RentSpree: ${x.rentSpree?'Connected':'Not added'}`:''}</span><br><button type="button" data-del="${x.id}">Remove</button></div>`).join(''):'<p>No custom properties added yet.</p>';box.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{saveListings(getListings().filter(x=>x.id!=b.dataset.del));renderManager()})}renderManager();
const clear=document.getElementById('clearListings');if(clear)clear.onclick=()=>{if(confirm('Clear all custom property cards from this browser?')){saveListings([]);renderManager()}};



// Multiple-rental RentSpree application center.
// Every rental must have its own application URL.
(function initRentalApplicationCenter(){
  const select=document.getElementById('rentalPropertySelect');
  const button=document.getElementById('selectedRentSpreeButton');
  const details=document.getElementById('selectedRentalDetails');
  if(!select||!button||!details) return;
  const builtInRentals=[
    {id:'santa-cruz',address:'2413 Santa Cruz Ct, Discovery Bay, CA 94505',meta:'3 bedrooms · 2.5 bathrooms · 2,368 sq ft',rentSpree:'https://apply.link/I-wM6FA'}
  ];
  const custom=getListings().filter(x=>x.status==='rental').map(x=>({id:String(x.id),address:x.address,meta:[x.price,x.meta].filter(Boolean).join(' · '),rentSpree:x.rentSpree||''}));
  const rentals=[...builtInRentals,...custom.filter(x=>!builtInRentals.some(b=>b.address.toLowerCase()===String(x.address).toLowerCase()))];
  rentals.forEach(r=>{
    const option=document.createElement('option'); option.value=r.id; option.textContent=r.address; select.appendChild(option);
  });
  function update(){
    const rental=rentals.find(r=>r.id===select.value);
    if(!rental){details.textContent='Select a property to view its application status.';button.disabled=true;button.textContent='Choose a Property First';button.onclick=null;return;}
    const connected=/^https?:\/\//i.test(rental.rentSpree||'');
    details.innerHTML=`<strong>${esc(rental.address)}</strong>${rental.meta?`<br>${esc(rental.meta)}`:''}<br><span class="${connected?'application-status-ready':'application-status-missing'}">${connected?'RentSpree application connected for this property.':'Application link is not connected yet. Please contact Blackstone before applying.'}</span>`;
    button.disabled=!connected;
    button.textContent=connected?'Apply for This Property':'Application Link Coming Soon';
    button.onclick=connected?()=>window.open(rental.rentSpree,'_blank','noopener'):null;
  }
  select.addEventListener('change',update); update();
})();

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

// Latest Freddie Mac 30-year fixed national average, published weekly through FRED.
// The website checks the official series when a page with rate data loads.
let BLACKSTONE_LIVE_RATE=6.58;
function formatFredDate(iso){
  const d=new Date(iso+'T12:00:00');
  return d.toLocaleDateString('en-US',{month:'numeric',day:'numeric',year:'numeric'});
}
function setRateUI(rate,dateLabel,status,previousRate){
  if(Number.isFinite(rate)){
    BLACKSTONE_LIVE_RATE=rate;
    document.querySelectorAll('[data-live-rate]').forEach(x=>x.textContent=rate.toFixed(2)+'%');
    document.querySelectorAll('[data-rate-change]').forEach(el=>{
      el.classList.remove('ticker-up','ticker-down','ticker-flat');
      if(Number.isFinite(previousRate)){
        const diff=rate-previousRate;
        if(Math.abs(diff)>=0.005){
          el.textContent=(diff>0?'▲ +':'▼ ')+Math.abs(diff).toFixed(2)+'% VS PRIOR WEEK';
          el.classList.add(diff>0?'ticker-up':'ticker-down');
        }else{
          el.textContent='• NO CHANGE VS PRIOR WEEK';
          el.classList.add('ticker-flat');
        }
      }else{
        el.textContent='• UPDATED WEEKLY';
        el.classList.add('ticker-flat');
      }
    });
  }
  if(dateLabel) document.querySelectorAll('[data-rate-date]').forEach(x=>x.textContent='Latest weekly average · '+dateLabel);
  if(status) document.querySelectorAll('[data-rate-status]').forEach(x=>x.textContent=status);
}
function parseFredCsv(csv){
  const lines=csv.trim().split(/\r?\n/).slice(1);
  const rows=[];
  for(const line of lines){
    const parts=line.split(',');
    if(parts.length<2) continue;
    const rate=parseFloat(parts[1]);
    if(Number.isFinite(rate)) rows.push({date:parts[0],rate});
  }
  return rows;
}
async function refreshWeeklyRate(){
  if(!document.querySelector('[data-live-rate]')) return;
  const official='https://fred.stlouisfed.org/graph/fredgraph.csv?id=MORTGAGE30US';
  try{
    let res=await fetch(official,{cache:'no-store'});
    if(!res.ok) throw new Error('official source unavailable');
    const rows=parseFredCsv(await res.text());
    if(!rows.length) throw new Error('rate not found');
    const latest=rows[rows.length-1], previous=rows.length>1?rows[rows.length-2]:null;
    setRateUI(latest.rate,formatFredDate(latest.date),'Updated from Freddie Mac / FRED',previous&&previous.rate);
  }catch(err){
    setRateUI(BLACKSTONE_LIVE_RATE,'7/23/2026','Showing last known Freddie Mac weekly average',null);
  }
}
refreshWeeklyRate();
const liveBtn=document.getElementById('useLiveRate');if(liveBtn) liveBtn.addEventListener('click',()=>{document.getElementById('interestRate').value=BLACKSTONE_LIVE_RATE.toFixed(2);calculateMortgage()});

// Blackstone Smart Assistant (client-side guidance; no external AI API required)
(function(){
 if(document.querySelector('.ai-fab')) return;
 const fab=document.createElement('button'); fab.className='ai-fab'; fab.textContent='Ask Blackstone';
 const panel=document.createElement('div'); panel.className='ai-panel'; panel.innerHTML=`<div class="ai-head"><strong>Blackstone Smart Assistant</strong><button class="ai-close">×</button></div><div class="ai-messages"><div class="ai-msg bot">Hi, I can guide you to the right Blackstone service. What can I help with?</div></div><div class="ai-options"><button data-q="buy">Buy a home</button><button data-q="sell">Sell a home</button><button data-q="manage">Property management</button><button data-q="rent">Find a rental</button><button data-q="mortgage">Estimate payment</button></div><div class="ai-input"><input placeholder="Type your question"><button>Send</button></div>`;
 document.body.append(fab,panel);
 const messages=panel.querySelector('.ai-messages');
 function answer(q){ const s=q.toLowerCase(); let text,link;
  if(/buy|home search|listing|house/.test(s)){text='I can help start a personalized East Bay home search. Tell us your cities, budget, beds, baths and timing.';link='ai-tools.html';}
  else if(/sell|value|worth/.test(s)){text='Start with a personalized home-value request and Sal will review comparable sales and your property details.';link='home-value.html';}
  else if(/manage|landlord|rental owner/.test(s)){text='Blackstone provides broker-led property management, tenant screening, lease oversight and maintenance coordination.';link='rental-evaluation.html';}
  else if(/rent|tenant|apply/.test(s)){text='You can view rental information or continue to the RentSpree application path.';link='apply.html';}
  else if(/mortgage|payment|rate/.test(s)){text='Use the mortgage calculator to estimate principal, interest, taxes, insurance and HOA.';link='mortgage-calculator.html';}
  else if(/repair|maintenance/.test(s)){text='Current tenants can submit a dedicated repair request online.';link='repair-request.html';}
  else {text='The fastest next step is to send Sal a message with your goal, location and timeline.';link='contact.html';}
  messages.insertAdjacentHTML('beforeend',`<div class="ai-msg user">${q.replace(/[<>]/g,'')}</div><div class="ai-msg bot">${text}<br><a style="color:#d7b84b" href="${link}">Continue →</a></div>`); messages.scrollTop=messages.scrollHeight;
 }
 fab.onclick=()=>panel.classList.toggle('open'); panel.querySelector('.ai-close').onclick=()=>panel.classList.remove('open');
 panel.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>answer(b.dataset.q)); const inp=panel.querySelector('input'); panel.querySelector('.ai-input button').onclick=()=>{if(inp.value.trim()){answer(inp.value.trim());inp.value='';}}; inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();panel.querySelector('.ai-input button').click();}});
})();
