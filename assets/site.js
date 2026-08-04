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

// Latest Freddie Mac 30-year fixed national average, published weekly through FRED.
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
  if(dateLabel) document.querySelectorAll('[data-rate-date]').forEach(x=>x.textContent='LATEST WEEKLY AVERAGE · '+dateLabel);
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
    const res=await fetch(official,{cache:'no-store'});
    if(!res.ok) throw new Error('official source unavailable');
    const rows=parseFredCsv(await res.text());
    if(!rows.length) throw new Error('rate not found');
    const latest=rows[rows.length-1], previous=rows.length>1?rows[rows.length-2]:null;
    setRateUI(latest.rate,formatFredDate(latest.date),'Updated from Freddie Mac / FRED',previous&&previous.rate);
  }catch(err){
    setRateUI(BLACKSTONE_LIVE_RATE,'LATEST AVAILABLE','Showing last known Freddie Mac weekly average',null);
  }
}
refreshWeeklyRate();
const liveBtn=document.getElementById('useLiveRate');if(liveBtn) liveBtn.addEventListener('click',()=>{document.getElementById('interestRate').value=BLACKSTONE_LIVE_RATE.toFixed(2);calculateMortgage()});

// Blackstone AI Concierge — Gemini-powered with a local knowledge fallback
(function(){
  if(document.querySelector('.bs-ai-launcher')) return;

  const quickActions = [
    ['⌕','Search for Homes','Help me search for homes in the East Bay.'],
    ['$','What’s My Home Worth?','How can Blackstone help estimate what my home is worth?'],
    ['◆','I Want to Sell My Home','Tell me about selling my home with Blackstone.'],
    ['▦','Property Management','Tell me about Blackstone property management services and fees.'],
    ['▣','Schedule a Showing','I would like to schedule a property showing.'],
    ['↗','Investment Property Analysis','How can you help analyze an investment property?']
  ];

  const launcher=document.createElement('button');
  launcher.className='bs-ai-launcher';
  launcher.setAttribute('aria-label','Open Blackstone AI Concierge');
  launcher.innerHTML='<span class="bs-ai-star">✦</span><span>Ask Blackstone AI</span>';

  const panel=document.createElement('section');
  panel.className='bs-ai-panel';
  panel.setAttribute('aria-label','Blackstone AI Concierge');
  panel.innerHTML=`
    <header class="bs-ai-header">
      <img src="assets/logo.png" alt="Blackstone logo">
      <div><strong>BLACKSTONE</strong><span>AI Concierge · Online 24/7</span></div>
      <button class="bs-ai-close" aria-label="Close">×</button>
    </header>
    <div class="bs-ai-divider"></div>
    <div class="bs-ai-scroll">
      <div class="bs-ai-messages" aria-live="polite">
        <div class="bs-ai-bubble bot">Hi! I’m Blackstone AI Concierge. How can I help you today?</div>
      </div>
      <div class="bs-ai-actions"></div>
    </div>
    <form class="bs-ai-compose">
      <button type="button" class="bs-ai-mic" aria-label="Use voice input">🎤</button>
      <input maxlength="1000" autocomplete="off" placeholder="Type a message…" aria-label="Message">
      <button class="bs-ai-send" type="submit" aria-label="Send">➤</button>
    </form>
    <p class="bs-ai-note">General information only. Contact Sal for advice specific to your situation.</p>`;

  document.body.append(panel,launcher);
  const messages=panel.querySelector('.bs-ai-messages');
  const actions=panel.querySelector('.bs-ai-actions');
  const input=panel.querySelector('input');
  const send=panel.querySelector('.bs-ai-send');
  const mic=panel.querySelector('.bs-ai-mic');
  let history=[];
  let busy=false;

  quickActions.forEach(([icon,label,prompt])=>{
    const b=document.createElement('button');
    b.type='button';
    b.innerHTML=`<span>${icon}</span>${label}`;
    b.addEventListener('click',()=>submitMessage(prompt));
    actions.appendChild(b);
  });

  function esc(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
  function format(text){
    return esc(text)
      .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
      .replace(/\n/g,'<br>')
      .replace(/(https?:\/\/[^\s<]+)/g,'<a href="$1" target="_blank" rel="noopener">$1</a>');
  }
  function addMessage(role,text,extra=''){
    const el=document.createElement('div');
    el.className=`bs-ai-bubble ${role} ${extra}`.trim();
    el.innerHTML=format(text);
    messages.appendChild(el);
    panel.querySelector('.bs-ai-scroll').scrollTop=panel.querySelector('.bs-ai-scroll').scrollHeight;
    return el;
  }
  function addTyping(){
    const el=document.createElement('div');
    el.className='bs-ai-bubble bot typing';
    el.innerHTML='<i></i><i></i><i></i>';
    messages.appendChild(el);
    panel.querySelector('.bs-ai-scroll').scrollTop=panel.querySelector('.bs-ai-scroll').scrollHeight;
    return el;
  }

  function localAnswer(q){
    const s=q.toLowerCase();
    if(/fee|cost|charge|pricing|management fee/.test(s)) return 'Blackstone’s published property-management pricing is **6% of monthly rent collected**, **one-half of one month’s rent** for tenant placement, and **$300** for a lease renewal. Vendor, screening, legal, court, and other third-party costs are separate. For unusual or multi-unit properties, Sal can confirm a property-specific proposal.';
    if(/sell|selling process|list my home|listing/.test(s)) return 'Selling with Blackstone begins with a property review and pricing strategy based on comparable sales, condition, timing, and your goals. Blackstone then coordinates preparation, photography and marketing, showings, offer review, negotiations, inspections, appraisal, escrow, and closing. You receive direct broker-led guidance throughout the transaction. Start with the **Home Value** page or contact Sal for a customized plan.';
    if(/worth|home value|value my/.test(s)) return 'An online estimate is only a starting point. Blackstone prepares a more useful value opinion by reviewing recent comparable sales, current competition, location, condition, upgrades, lot, and market timing. Use the **Home Value** page to request a personalized review.';
    if(/buy|search.*home|find.*home|house/.test(s)) return 'Blackstone can help define your budget and priorities, arrange financing pre-approval, search and tour homes, evaluate value and condition, structure an offer, negotiate, manage inspections and appraisal, and guide you through escrow and closing. Live MLS search will be added through the approved IDX connection.';
    if(/rent|tenant|application|apply/.test(s)) return 'For rentals, select the exact available property on the **Apply** page so the correct RentSpree application opens. Requirements and pet policies can differ by property. Applicants should review the listing details and complete the linked screening application for that address.';
    if(/manage|landlord|property management/.test(s)) return 'Blackstone provides tenant marketing and screening, lease coordination, rent collection, tenant communication, maintenance coordination, inspections, owner reporting, renewals, and general oversight. Published pricing is 6% monthly management, one-half month tenant placement, and $300 renewals, with third-party costs separate.';
    if(/mortgage|payment|interest rate|down payment|pmi/.test(s)) return 'The mortgage calculator estimates principal and interest along with taxes, insurance, HOA, and PMI. The rate shown on the website is a national benchmark, not a lender quote. Actual pricing depends on credit, occupancy, loan program, down payment, points, and lender.';
    if(/invest|cap rate|cash flow|roi|flip/.test(s)) return 'Blackstone can help evaluate purchase price, repairs, expected rent or resale value, financing, operating costs, cash flow, cap rate, and exit strategy. Results depend heavily on verified property data, so use estimates for screening and confirm them during due diligence.';
    if(/showing|tour|appointment|schedule/.test(s)) return 'To request a showing, send the property address or listing link, your preferred date and time, and whether you are already pre-approved. Use the Contact page and Sal will confirm availability.';
    if(/sal|blackstone|company|dre|experience/.test(s)) return 'Sal Gharibyar is the Broker/Owner of Blackstone Signature Properties & Investments, a division of Eagle Rock Ventures Inc. He has more than 20 years of real-estate experience. Broker DRE #01418692; Corporate DRE #02117470.';
    return 'I can provide detailed general guidance on buying, selling, rentals, property management, mortgages, investing, and Blackstone services. The live AI connection may not be configured yet, so please try asking with a little more detail or use the Contact page for property-specific help.';
  }

  async function submitMessage(raw){
    const text=(raw||'').trim();
    if(!text||busy) return;
    busy=true; send.disabled=true; input.disabled=true;
    addMessage('user',text);
    history.push({role:'user',text});
    input.value='';
    const typing=addTyping();
    try{
      const res=await fetch('/api/chat',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({message:text,history:history.slice(-10),page:location.pathname})
      });
      const data=await res.json().catch(()=>({}));
      if(!res.ok){
        throw new Error(data.error || `AI request failed (${res.status})`);
      }
      const reply=String(data.reply||'').trim();
      if(!reply) throw new Error('The AI returned an empty response.');
      typing.remove(); addMessage('bot',reply);
      history.push({role:'model',text:reply});
    }catch(err){
      typing.remove();
      console.error('Blackstone AI:',err);
      const detail=err && err.message ? err.message : 'Unknown connection error';
      const reply=`The AI connection failed: ${detail}`;
      addMessage('bot',reply,'fallback');
    }finally{
      busy=false; send.disabled=false; input.disabled=false; input.focus();
    }
  }

  panel.querySelector('.bs-ai-close').onclick=()=>panel.classList.remove('open');
  launcher.onclick=()=>{panel.classList.toggle('open');if(panel.classList.contains('open')) setTimeout(()=>input.focus(),100);};
  panel.querySelector('form').addEventListener('submit',e=>{e.preventDefault();submitMessage(input.value);});

  const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(SpeechRecognition){
    const recognition=new SpeechRecognition(); recognition.lang='en-US'; recognition.interimResults=false;
    mic.addEventListener('click',()=>{try{recognition.start();mic.classList.add('listening');}catch(e){}});
    recognition.onresult=e=>{input.value=e.results[0][0].transcript;mic.classList.remove('listening');submitMessage(input.value);};
    recognition.onend=()=>mic.classList.remove('listening');
  }else mic.style.display='none';
})();

