
(function(){
  const CONFIG = {
    agentName: "Blackstone AI Concierge",
    phone: "(925) 917-5595",
    email: "gharibyar61@gmail.com",
    bookingUrl: "contact.html",
    searchUrl: "search.html",
    homeValueUrl: "home-value.html",
    propertyManagementUrl: "property-management.html",
    sellerUrl: "sellers.html",
    investmentUrl: "ai-tools.html",
    apiEndpoint: "https://YOUR-GEMINI-WORKER.workers.dev/api/chat" // Replace with your deployed Worker URL.
  };

  const root = document.createElement("div");
  root.innerHTML = `
    <button id="bs-ai-launcher" aria-label="Open Blackstone AI Concierge">
      <img src="assets/blackstone-logo.jpg" alt="Blackstone logo">
      <span class="bs-badge">1</span>
    </button>

    <section id="bs-ai-window" aria-label="Blackstone AI Concierge">
      <header class="bs-ai-header">
        <img class="bs-ai-logo" src="assets/blackstone-logo.jpg" alt="Blackstone Signature Properties">
        <div class="bs-ai-title">
          <strong>BLACKSTONE AI CONCIERGE</strong>
          <span><i class="bs-online-dot"></i> Online 24/7</span>
        </div>
        <button class="bs-ai-close" aria-label="Close concierge">×</button>
      </header>

      <main class="bs-ai-body" id="bs-ai-body">
        <div class="bs-message bot">Hi, I’m the Blackstone AI Concierge.

I can help you search for homes, estimate your property value, learn about selling, explore investment opportunities, or request property management assistance.</div>

        <div class="bs-quick-actions">
          <button data-action="search">⌕ Search for Homes</button>
          <button data-action="value">$ What’s My Home Worth?</button>
          <button data-action="sell">◆ I Want to Sell My Home</button>
          <button data-action="management">▦ Property Management</button>
          <button data-action="showing">▣ Schedule a Showing</button>
          <button data-action="investment">↗ Investment Property Analysis</button>
        </div>
      </main>

      <footer class="bs-ai-footer">
        <form class="bs-ai-form" id="bs-ai-form">
          <input class="bs-ai-input" id="bs-ai-input" type="text" placeholder="Ask about homes, values, or management..." autocomplete="off">
          <button class="bs-ai-send" type="submit">Send</button>
        </form>
        <div class="bs-ai-note">Blackstone Signature Properties • Broker-led East Bay real estate</div>
      </footer>
    </section>
  `;

  document.body.appendChild(root);

  const launcher = document.getElementById("bs-ai-launcher");
  const win = document.getElementById("bs-ai-window");
  const closeBtn = win.querySelector(".bs-ai-close");
  const body = document.getElementById("bs-ai-body");
  const form = document.getElementById("bs-ai-form");
  const input = document.getElementById("bs-ai-input");

  function toggle(open){
    win.classList.toggle("bs-open", open ?? !win.classList.contains("bs-open"));
    if(win.classList.contains("bs-open")) setTimeout(()=>input.focus(),120);
  }

  launcher.addEventListener("click",()=>toggle());
  closeBtn.addEventListener("click",()=>toggle(false));

  function addMessage(text,type="bot"){
    const el = document.createElement("div");
    el.className = `bs-message ${type}`;
    el.textContent = text;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  }

  function showTyping(){
    const el = document.createElement("div");
    el.className = "bs-message bot";
    el.id = "bs-typing";
    el.innerHTML = '<span class="bs-typing"><i></i><i></i><i></i></span>';
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  }

  function hideTyping(){
    document.getElementById("bs-typing")?.remove();
  }

  const responses = {
    search: `I can help narrow the search by city, budget, bedrooms, bathrooms, waterfront preference, and other must-have features.\n\nOpen the home-search page now?`,
    value: `I can collect the property address, condition, upgrades, and timing, then route the request to Sal for a personalized valuation.`,
    sell: `I can help you start a confidential seller consultation, including pricing strategy, preparation, marketing, and timing.`,
    management: `Blackstone provides rental marketing, tenant screening, lease coordination, rent collection guidance, inspections, maintenance coordination, and owner communication.`,
    showing: `I can help you request a showing or consultation with Sal. Please provide the property address and your preferred day and time.`,
    investment: `I can help evaluate purchase price, repairs, financing, rent, cash flow, resale potential, and risk for an investment property.`
  };

  function actionReply(action){
    addMessage(responses[action] || "How may I help you today?","bot");
    const links = {
      search: CONFIG.searchUrl,
      value: CONFIG.homeValueUrl,
      sell: CONFIG.sellerUrl,
      management: CONFIG.propertyManagementUrl,
      showing: CONFIG.bookingUrl,
      investment: CONFIG.investmentUrl
    };
    if(links[action]){
      const wrap = document.createElement("div");
      wrap.className = "bs-quick-actions";
      wrap.innerHTML = `<button type="button">Open the related page →</button>`;
      wrap.querySelector("button").addEventListener("click",()=>location.href=links[action]);
      body.appendChild(wrap);
      body.scrollTop = body.scrollHeight;
    }
  }

  body.addEventListener("click",(e)=>{
    const btn = e.target.closest("[data-action]");
    if(!btn) return;
    addMessage(btn.textContent.trim(),"user");
    showTyping();
    setTimeout(()=>{
      hideTyping();
      actionReply(btn.dataset.action);
    },550);
  });

  form.addEventListener("submit",async(e)=>{
    e.preventDefault();
    const message = input.value.trim();
    if(!message) return;
    addMessage(message,"user");
    input.value="";
    showTyping();

    if(CONFIG.apiEndpoint){
      try{
        const res = await fetch(CONFIG.apiEndpoint,{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({message})
        });
        if(!res.ok) throw new Error("AI request failed");
        const data = await res.json();
        hideTyping();
        addMessage(data.reply || "Thank you. A Blackstone representative will follow up.");
      }catch(err){
        hideTyping();
        addMessage("I’m having trouble reaching the live assistant. Please call " + CONFIG.phone + " or use the Contact page.");
      }
      return;
    }

    setTimeout(()=>{
      hideTyping();
      const lower = message.toLowerCase();
      if(lower.includes("home") || lower.includes("house") || lower.includes("listing")){
        addMessage("I can help with home searches, showings, values, and selling. Choose one of the options above or tell me the city and price range.");
      } else if(lower.includes("rent") || lower.includes("tenant") || lower.includes("manage")){
        addMessage("I can help with rental evaluations and property-management services. Please provide the property city and number of bedrooms.");
      } else if(lower.includes("appointment") || lower.includes("call") || lower.includes("showing")){
        addMessage("Please share your preferred date and time, or open the Contact page to request an appointment with Sal.");
      } else {
        addMessage("Thanks. I can collect the key details and connect you with Sal for a personal recommendation. This demo can be connected to Gemini or OpenAI for live answers.");
      }
    },650);
  });
})();
