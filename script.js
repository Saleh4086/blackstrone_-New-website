const q=(s,p=document)=>p.querySelector(s), qa=(s,p=document)=>[...p.querySelectorAll(s)];
q('#year').textContent=new Date().getFullYear();

const menuBtn=q('#menuBtn'), mobileNav=q('#mobileNav');
menuBtn.addEventListener('click',()=>{const open=menuBtn.getAttribute('aria-expanded')==='true';menuBtn.setAttribute('aria-expanded',String(!open));mobileNav.hidden=open;});
qa('#mobileNav a').forEach(a=>a.addEventListener('click',()=>{mobileNav.hidden=true;menuBtn.setAttribute('aria-expanded','false')}));

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.14});
qa('.reveal').forEach(el=>observer.observe(el));

const counters=qa('.metric-number');
const countObs=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting||entry.target.dataset.done)return;entry.target.dataset.done='1';const t=Number(entry.target.dataset.target);let v=0;const inc=Math.max(1,Math.round(t/45));const timer=setInterval(()=>{v+=inc;if(v>=t){v=t;clearInterval(timer)}entry.target.textContent=v+'+'},28)}),{threshold:.4});
counters.forEach(c=>countObs.observe(c));

q('#propertySearch').addEventListener('submit',e=>{e.preventDefault();const location=new FormData(e.currentTarget).get('location')||'your preferred East Bay area';openAi(`Help me find homes in ${location}.`)});
q('#leadForm').addEventListener('submit',e=>{e.preventDefault();q('#formStatus').textContent='Thank you — your request is ready to connect to your CRM or email service.';e.currentTarget.reset()});

const dialog=q('#aiDialog'), chat=q('#aiChat'), input=q('#aiInput');
function openAi(prefill=''){dialog.showModal();if(prefill){input.value=prefill;input.focus()}}
q('#aiFab').addEventListener('click',()=>openAi());q('#openAiTop').addEventListener('click',()=>openAi());q('#openAiMain').addEventListener('click',()=>openAi());
qa('[data-prompt]').forEach(b=>b.addEventListener('click',()=>openAi(b.dataset.prompt)));
function sendAi(){const text=input.value.trim();if(!text)return;const u=document.createElement('div');u.className='bubble user';u.textContent=text;chat.appendChild(u);input.value='';chat.scrollTop=chat.scrollHeight;setTimeout(()=>{const b=document.createElement('div');b.className='bubble bot';const l=text.toLowerCase();if(l.includes('property management')||l.includes('rental'))b.textContent='Blackstone can help with tenant placement, rent coordination, maintenance and owner reporting. I can collect the property address and best contact number next.';else if(l.includes('worth')||l.includes('value'))b.textContent='A reliable valuation starts with the property address, condition and recent nearby sales. Share the address and I can prepare the next-step request.';else if(l.includes('waterfront')||l.includes('home')||l.includes('house'))b.textContent='I can narrow the search by city, budget, bedrooms and must-have features, then route the request for live MLS matching.';else b.textContent='Thanks. I can collect the key details and connect you with Sal for a personal recommendation.';chat.appendChild(b);chat.scrollTop=chat.scrollHeight},500)}
q('#aiSend').addEventListener('click',sendAi);input.addEventListener('keydown',e=>{if(e.key==='Enter')sendAi()});
