(function(){
  /* ================= SETTINGS — edit before launch ================= */
  const WHATSAPP_NUMBER = "919800000000";   // country code + number, digits only
  const WA_GREETING = "Hello KJK Precision, I have an enquiry.";
  // Enquiry form: create a free access key at https://web3forms.com with the email
  // address that should receive enquiries, then paste the key here.
  const FORM_ACCESS_KEY = "7974d73a-9bda-485b-b84b-6e9681c13326";
  /* ================================================================ */

  const waURL = t => "https://wa.me/" + WHATSAPP_NUMBER + (t ? "?text=" + encodeURIComponent(t) : "");
  document.querySelectorAll("[data-wa]").forEach(a => {
    const msg = a.getAttribute("data-wa");
    a.href = waURL(msg || WA_GREETING);
    a.target = "_blank"; a.rel = "noopener";
  });

  /* Mobile menu */
  const mb = document.querySelector(".menu-btn"), nav = document.querySelector("nav.main");
  if(mb && nav){
    mb.addEventListener("click", () => { const o = nav.classList.toggle("open"); mb.setAttribute("aria-expanded", String(o)); });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => { nav.classList.remove("open"); mb.setAttribute("aria-expanded","false"); }));
  }

  /* Copy buttons */
  document.querySelectorAll("[data-copy]").forEach(b => b.addEventListener("click", () => {
    const t = b.getAttribute("data-copy"), old = b.textContent;
    const done = () => { b.textContent = "Copied"; setTimeout(() => b.textContent = old, 1500); };
    try { navigator.clipboard.writeText(t).then(done, () => {}); } catch(e) {}
  }));

  /* ---------------- Line-art figures ---------------- */
  const S = 'fill="var(--sheet)" stroke="var(--ink)" stroke-width="1.4" stroke-linejoin="round"';
  const SB = 'fill="var(--band-2)" stroke="var(--band-ink)" stroke-width="1.4" stroke-linejoin="round"';
  const CL = 'stroke="var(--muted)" stroke-width=".8" stroke-dasharray="10 3 2 3" fill="none"';
  let uid = 0;
  function gearPath(cx, cy, r, z, add){
    const ra = r + add, rd = r - add*1.25, step = Math.PI*2/z, p = [];
    for(let i=0;i<z;i++){
      const a = i*step;
      [[rd,a-step*.5],[rd,a-step*.28],[ra,a-step*.12],[ra,a+step*.12],[rd,a+step*.28]]
        .forEach(([rr,aa],k)=>p.push((i||k?"L":"M")+(cx+rr*Math.cos(aa)).toFixed(2)+" "+(cy+rr*Math.sin(aa)).toFixed(2)));
    }
    return p.join("")+"Z";
  }
  function rackPath(x0, x1, y, pitch, add, offset, helical){
    const top = y - add, root = y + add*1.25, base = y + add*4;
    let x = x0 + (((offset % pitch) + pitch) % pitch) - pitch*2;
    let d = `M${x} ${base}L${x} ${root}`;
    for(; x < x1 + pitch; x += pitch){
      d += `L${(x+pitch*.22).toFixed(2)} ${root}L${(x+pitch*.38).toFixed(2)} ${top}L${(x+pitch*.62).toFixed(2)} ${top}L${(x+pitch*.78).toFixed(2)} ${root}L${(x+pitch).toFixed(2)} ${root}`;
    }
    return d + `L${x} ${base}Z`;
  }
  function clip(x,y,w,h){ const id = "c"+(++uid); return [id, `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath>`]; }

  const figs = {
    rack(){
      const [id,c] = clip(10,0,220,180), p = 2*Math.PI*30/14;
      let teeth = "";
      // helical hint lines on rack face
      for(let x=-20;x<250;x+=p){ teeth += `<line x1="${x}" y1="128" x2="${x+12}" y2="150" stroke="var(--rule)" stroke-width="1"/>`; }
      return `<svg viewBox="0 0 240 180">${c}<g clip-path="url(#${id})"><path d="${rackPath(10,230,112,p,5,40)}" ${S}/><path d="M10 132H230V150H10Z" ${S}/>${teeth}</g>
        <circle cx="50" cy="141" r="4" fill="none" stroke="var(--ink)" stroke-width="1.2"/><circle cx="120" cy="141" r="4" fill="none" stroke="var(--ink)" stroke-width="1.2"/><circle cx="190" cy="141" r="4" fill="none" stroke="var(--ink)" stroke-width="1.2"/>
        <path d="M10 70H230" stroke="var(--mark)" stroke-width="1"/><path d="M10 64V76M230 64V76" stroke="var(--mark)"/>
        <text x="120" y="62" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10" fill="var(--mark)">L = 1000</text></svg>`;
    },
    pinion(){
      return `<svg viewBox="0 0 240 180"><path d="${gearPath(95,90,48,18,6)}" ${S}/><circle cx="95" cy="90" r="40" fill="none" stroke="var(--muted)" stroke-width=".7" stroke-dasharray="3 3"/>
        <circle cx="95" cy="90" r="20" ${S}/><circle cx="95" cy="90" r="10" fill="none" stroke="var(--ink)" stroke-width="1.4"/><rect x="92" y="77" width="6" height="5" fill="var(--ink)"/>
        <path d="M160 58h22v64h-22zM182 72h40v36h-40z" ${S}/><path d="M150 90H232" ${CL}/><path d="M95 30V150M35 90H155" ${CL}/></svg>`;
    },
    guideway(){
      const [id,c] = clip(14,0,212,180), p = 2*Math.PI*30/16;
      return `<svg viewBox="0 0 240 180">${c}<g clip-path="url(#${id})" transform="translate(0 226) scale(1 -1)"><path d="${rackPath(14,226,118,p,4.5,20)}" ${S}/></g>
        <path d="M14 58l8-12h196l8 12v44H14z" ${S}/><path d="M22 46h196" stroke="var(--ink)" stroke-width="1.1"/>
        <path d="M14 58h212" stroke="var(--rule)" stroke-width="1"/>
        <circle cx="54" cy="77" r="6" fill="none" stroke="var(--ink)" stroke-width="1.3"/><circle cx="120" cy="77" r="6" fill="none" stroke="var(--ink)" stroke-width="1.3"/><circle cx="186" cy="77" r="6" fill="none" stroke="var(--ink)" stroke-width="1.3"/>
        <path d="M10 36l12 10M230 36l-12 10" stroke="var(--mark)" stroke-width="1"/>
        <text x="120" y="30" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10" fill="var(--mark)">90° V GUIDE EDGES</text>
        <text x="120" y="164" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10" fill="var(--muted)">SIZE 25</text></svg>`;
    },
    roller(){
      const wheel = (cx, v) => `<g>
        <path d="M${cx-34} 58h68v64h-68z" ${S}/>
        ${v ? `<path d="M${cx-34} 76l10 14-10 14M${cx+34} 76l-10 14 10 14" fill="none" stroke="var(--ink)" stroke-width="1.3"/><path d="M${cx-24} 90h48" stroke="var(--rule)"/>` : `<path d="M${cx-34} 72q14 18 0 36M${cx+34} 72q-14 18 0 36" fill="none" stroke="var(--ink)" stroke-width="1.3"/>`}
        <path d="M${cx-8} 122h16v26h-16z" ${S}/><path d="M${cx-6} 148h12v12h-12z" ${S}/>
        <path d="M${cx} 44V170" ${CL}/></g>`;
      return `<svg viewBox="0 0 240 180">${wheel(66,true)}${wheel(174,false)}
        <text x="66" y="40" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10" fill="var(--mark)">UV · V-TYPE</text>
        <text x="174" y="40" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10" fill="var(--mark)">UR · ROUND</text></svg>`;
    },
    clamp(){
      return `<svg viewBox="0 0 240 180"><path d="M14 118h212v22H14z" ${S}/><path d="M14 118h212" stroke="var(--ink)"/>
        <path d="M54 72h132v50H54z" ${S}/><path d="M74 84h92v26H74z" fill="none" stroke="var(--ink)" stroke-width="1.2"/>
        <path d="M108 72V50h24v22" ${S}/><path d="M120 50V32" stroke="var(--ink)" stroke-width="1.4"/><circle cx="120" cy="30" r="4" ${S}/>
        <circle cx="64" cy="80" r="3.5" fill="none" stroke="var(--ink)" stroke-width="1.2"/><circle cx="176" cy="80" r="3.5" fill="none" stroke="var(--ink)" stroke-width="1.2"/>
        <path d="M44 129h-20M196 129h20" stroke="var(--mark)" stroke-width="1"/><text x="120" y="160" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10" fill="var(--mark)">RAIL 25</text></svg>`;
    },
    accessory(){
      // Assembly rack bridging the joint between two racks (keeps pitch continuous across the joint)
      const p = 22, top = 82, root = 100, base = 138;
      const lower = (x0, n) => {
        let d = `M${x0} ${base}L${x0} ${root}`;
        for(let i=0;i<n;i++){ const x = x0 + i*p;
          d += `L${x+p*.2} ${root}L${x+p*.36} ${top}L${x+p*.64} ${top}L${x+p*.8} ${root}L${x+p} ${root}`; }
        return d + `L${x0+n*p} ${base}Z`;
      };
      // upper (assembly) rack: teeth point down into the gaps of the lower racks
      const uR = 80, uT = 98;
      let up = `M54 40L186 40L186 ${uR}`;
      for(let c=164;c>=76;c-=p){ up += `L${c+p*.3} ${uR}L${c+p*.14} ${uT}L${c-p*.14} ${uT}L${c-p*.3} ${uR}`; }
      up += `L54 ${uR}Z`;
      const hole = (x,y,r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="var(--ink)" stroke-width="1.2"/>`;
      const P = 'fill="var(--paper)" stroke="var(--ink)" stroke-width="1.4" stroke-linejoin="round"';
      return `<svg viewBox="0 0 240 180">
        <path d="${lower(10,5)}" ${S}/><path d="${lower(120,5)}" ${S}/>
        ${hole(36,120,6)}${hole(64,120,2.5)}${hole(176,120,2.5)}${hole(204,120,6)}
        <path d="${up}" ${P}/><path d="M54 48H186" stroke="var(--rule)" stroke-width="1"/>
        <text x="120" y="66" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="8.5" fill="var(--muted)">ASSEMBLY RACK</text>
        <text x="120" y="30" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--mark)">BRIDGES THE JOINT</text>
        <path d="M120 144V158" stroke="var(--mark)" stroke-width="1"/><path d="M116 148l4-5 4 5" fill="none" stroke="var(--mark)" stroke-width="1"/>
        <text x="120" y="170" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--mark)">RACK JOINT</text></svg>`;
    }
  };
  document.querySelectorAll("[data-fig]").forEach(el => {
    const f = figs[el.dataset.fig]; if(f) el.innerHTML = f();
    // Real product photo: shown when the file exists, line drawing stays as fallback
    const src = el.dataset.img;
    if(src){
      const img = new Image(); img.alt = ""; img.decoding = "async";
      img.onload = () => { el.classList.add("has-photo"); el.innerHTML = ""; img.alt = el.closest("article,a")?.querySelector("h2,h3")?.textContent || "Product photo"; el.appendChild(img); };
      img.src = src;
    }
  });

  /* Industry icons */
  const icons = {
    laser:'<path d="M4 20h16M7 20V9h10v11M12 3v6M9 13l3 3 3-3"/>',
    router:'<path d="M3 6h18M6 6v12M18 6v12M9 6v5h6V6M12 11v4"/>',
    tool:'<path d="M4 20h16M6 20v-6h12v6M9 14V8l3-4 3 4v6"/>',
    auto:'<path d="M4 20h6M7 20v-6l5-5 4 4M16 13l3 3M12 9V5h4"/>',
    handling:'<path d="M3 17h18M5 17V9h7v8M12 12h6l2 5M7 20a1.5 1.5 0 1 0 0-.1M17 20a1.5 1.5 0 1 0 0-.1"/>',
    pack:'<path d="M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8"/>',
    weld:'<path d="M4 20l7-7M11 13l3-3 4 4-3 3zM15 5l1-2M19 9l2-1M17 6l2-2"/>',
    glass:'<path d="M4 4h16v16H4zM4 12h16M12 4v16M7 7l3 3"/>',
    solar:'<path d="M3 14h18l-2-7H5zM8 14l1-7M15 14l-1-7M4 10.5h16M12 14v6M8 20h8"/>'
  };
  document.querySelectorAll("[data-ico]").forEach(el => {
    el.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[el.dataset.ico]||""}</svg>`;
  });

  /* Hero mechanism */
  const mech = document.getElementById("mech");
  if(mech){
    const cx=260, cy=130, r=75, z=20, add=7.5, pitch=2*Math.PI*r/z;
    const pin = mech.querySelector("#pinion"), rk = mech.querySelector("#rack");
    pin.innerHTML = `<path d="${gearPath(0,0,r,z,add)}" ${SB}/><circle r="${r}" fill="none" stroke="var(--band-muted)" stroke-width=".7" stroke-dasharray="4 3"/><circle r="22" fill="none" stroke="var(--band-ink)" stroke-width="1.4"/><circle r="10" fill="none" stroke="var(--band-ink)" stroke-width="1.2"/><rect x="-4" y="-28" width="8" height="7" fill="var(--band-ink)"/>`;
    const draw = ang => {
      pin.setAttribute("transform", `translate(${cx} ${cy}) rotate(${(ang*180/Math.PI + 360/z/2).toFixed(3)})`);
      rk.innerHTML = `<path d="${rackPath(40,480,cy+r,pitch,add,(cx-40)+pitch/2-ang*r)}" ${SB}/><line x1="40" y1="${cy+r}" x2="480" y2="${cy+r}" stroke="var(--band-muted)" stroke-width=".7" stroke-dasharray="4 3"/>`;
    };
    draw(0);
    if(!matchMedia("(prefers-reduced-motion: reduce)").matches){
      let t0=null; const loop = ts => { if(t0===null) t0=ts; draw(Math.sin((ts-t0)/1000*.35)*.9); requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
    }
  }

  /* ---------------- Downloads ---------------- */
  const DOCS = [
    {p:"rack",     k:"Catalogue", name:"Gear Racks catalogue",              sub:"Straight & helical, milled & ground — dimensions and load data", fmt:"PDF",        file:"downloads/KJK-Gear-Racks-Catalogue.pdf"},
    {p:"rack",     k:"2D drawing",name:"Gear rack drawings, M1–M8",         sub:"Straight and helical profiles",                                    fmt:"DXF · PDF",  file:"downloads/KJK-Rack-2D.zip"},
    {p:"rack",     k:"3D model",  name:"Gear rack 3D models, M1–M8",        sub:"For SolidWorks, Inventor, Creo, Fusion",                            fmt:"STEP",       file:"downloads/KJK-Rack-3D.zip"},
    {p:"pinion",   k:"Catalogue", name:"Pinions catalogue",                 sub:"Cylindrical, flange and shaft pinions",                            fmt:"PDF",        file:"downloads/KJK-Pinions-Catalogue.pdf"},
    {p:"pinion",   k:"3D model",  name:"Pinion 3D models",                  sub:"Standard tooth counts per module",                                 fmt:"STEP",       file:"downloads/KJK-Pinion-3D.zip"},
    {p:"guideway", k:"Catalogue", name:"Guideway Racks catalogue",          sub:"V-type, round-type and standard profiles, sizes 15–35",            fmt:"PDF",        file:"downloads/KJK-Guideway-Racks-Catalogue.pdf"},
    {p:"guideway", k:"3D model",  name:"Guideway rack 2D & 3D files",       sub:"By size and profile",                                              fmt:"DXF · STEP", file:"downloads/KJK-Guideway-Rack-CAD.zip"},
    {p:"roller",   k:"Catalogue", name:"Roller Series catalogue",           sub:"UV (V-type) and UR (round-type) rollers",                          fmt:"PDF",        file:"downloads/KJK-Roller-Series-Catalogue.pdf"},
    {p:"roller",   k:"3D model",  name:"Roller 3D models",                  sub:"Concentric and eccentric, sizes 15–35",                            fmt:"STEP",       file:"downloads/KJK-Roller-3D.zip"},
    {p:"clamp",    k:"Catalogue", name:"LM Clamps catalogue",               sub:"Manual and pneumatic series, rail sizes 15–45",                    fmt:"PDF",        file:"downloads/KJK-LM-Clamps-Catalogue.pdf"},
    {p:"clamp",    k:"3D model",  name:"LM Clamp 2D & 3D files",            sub:"By rail size",                                                     fmt:"DXF · STEP", file:"downloads/KJK-LM-Clamp-CAD.zip"},
    {p:"general",  k:"Guide",     name:"Rack & pinion installation guide",  sub:"Mounting, joining racks, setting backlash",                        fmt:"PDF",        file:"downloads/KJK-Rack-Installation-Guide.pdf"},
    {p:"general",  k:"Catalogue", name:"KJK Precision company profile",     sub:"Full product overview",                                            fmt:"PDF",        file:"downloads/KJK-Company-Profile.pdf"},
  ];
  const tbody = document.getElementById("dl-body");
  if(tbody){
    const LABEL = {rack:"Gear Racks",pinion:"Pinions",guideway:"Guideway Racks",roller:"Roller Series",clamp:"LM Clamps",general:"General"};
    let filt = "all", q = "";
    const render = () => {
      const rows = DOCS.filter(d => (filt==="all"||d.p===filt) && (!q || (d.name+" "+d.sub+" "+d.k).toLowerCase().includes(q)));
      tbody.innerHTML = rows.length ? rows.map(d => `<tr><td class="doc"><b>${d.name}</b><small>${d.sub}</small></td><td>${LABEL[d.p]}</td><td>${d.k}</td><td><span class="fmt">${d.fmt}</span></td><td class="r"><a class="textlink" href="${d.file}" download>Download</a></td></tr>`).join("")
        : `<tr><td colspan="5" class="empty">No files match. Try another search, or ask us on WhatsApp.</td></tr>`;
    };
    document.querySelectorAll(".chip").forEach(c => c.addEventListener("click", () => {
      filt = c.dataset.f; document.querySelectorAll(".chip").forEach(x => x.setAttribute("aria-pressed", String(x===c))); render();
    }));
    const s = document.getElementById("dl-search");
    if(s) s.addEventListener("input", () => { q = s.value.trim().toLowerCase(); render(); });
    render();
  }

  /* ---------------- Discover buttons: open the enquiry form with the product chosen ---------------- */
  const pickProduct = name => {
    const sel = document.getElementById("f-product");
    if(sel && name){ const o = [...sel.options].find(x => x.text === name); if(o) sel.value = o.text; }
  };
  document.querySelectorAll("[data-product]").forEach(a => a.addEventListener("click", () => {
    const n = a.dataset.product;
    try { sessionStorage.setItem("kjk-product", n); } catch(e) {}
    pickProduct(n);
  }));
  try { const n = sessionStorage.getItem("kjk-product"); if(n){ pickProduct(n); sessionStorage.removeItem("kjk-product"); } } catch(e) {}

  /* ---------------- Enquiry form → email (Web3Forms) ---------------- */
  const form = document.getElementById("rfq");
  if(form){
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const v = id => (document.getElementById(id)||{value:""}).value.trim();
      const err = document.getElementById("f-err"), btn = document.getElementById("f-submit");
      if(!v("f-name") || !v("f-msg")){ err.textContent = "Add your name and requirement to continue."; return; }
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("f-email"))){ err.textContent = "Enter a valid email so we can reply."; return; }
      if(document.getElementById("f-bot").checked) return;
      if(!FORM_ACCESS_KEY || FORM_ACCESS_KEY.startsWith("YOUR")){ err.textContent = "The form is not connected yet. Add the Web3Forms access key in assets/site.js."; return; }
      err.textContent = ""; btn.disabled = true; btn.textContent = "Sending…";
      const payload = {
        access_key: FORM_ACCESS_KEY,
        subject: "New enquiry: " + v("f-product") + " — " + v("f-name") + (v("f-company") ? " (" + v("f-company") + ")" : ""),
        from_name: "kjkprecision.com",
        Name: v("f-name"), Company: v("f-company"), email: v("f-email"), Phone: v("f-phone"),
        Product: v("f-product"), City: v("f-city"), Industry: v("f-industry"), Requirement: v("f-msg"),
        botcheck: false
      };
      try{
        const res = await fetch("https://api.web3forms.com/submit", {method:"POST", headers:{"Content-Type":"application/json", Accept:"application/json"}, body: JSON.stringify(payload)});
        const out = await res.json();
        if(!out.success) throw new Error(out.message || "failed");
        form.querySelectorAll(".row2,.field,.form-foot").forEach(el => el.hidden = true);
        document.getElementById("rfq-sent").hidden = false;
      }catch(x){
        err.textContent = "Your enquiry could not be sent. Please try again in a minute, or message us on WhatsApp.";
        btn.disabled = false; btn.textContent = "Send enquiry";
      }
    });
  }
})();
