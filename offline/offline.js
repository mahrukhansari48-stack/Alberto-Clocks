/* Alberto Watches — offline.js
   Shows a cute cartoon "No Internet" screen when the connection drops.
   No libraries are used, so it works even when Bootstrap/jQuery cannot load. */
(function () {

  var css = `#offl{position:fixed;inset:0;z-index:99999;display:none;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:20px;overflow:hidden;color:#faf6e9;font-family:Poppins,'Segoe UI',sans-serif;background:radial-gradient(circle at 50% 30%,#3a74b8 0,transparent 50%),linear-gradient(135deg,#061a30,#0f2a4a)}
#offl.show{display:flex}#offl svg{width:min(330px,80vw);height:auto;filter:drop-shadow(0 18px 30px rgba(0,0,0,.45))}
#offl h1{font-family:'Playfair Display',Georgia,serif;font-size:clamp(1.9rem,6vw,3rem);margin:10px 0 6px}#offl h1 span{color:#c9a24b}
#offl p{max-width:430px;opacity:.85;margin:0}#offl button{margin-top:18px;border:0;border-radius:50px;padding:.8rem 2.3rem;font-weight:600;color:#0f2a4a;cursor:pointer;background:linear-gradient(135deg,#e8cd85,#b8903a);transition:.3s}#offl button:hover{transform:translateY(-3px)}
#offl small{display:block;margin-top:16px;color:#c9a24b;letter-spacing:.15em;text-transform:uppercase;font-size:.72rem}#offl small i{font-style:normal;animation:od 1.4s infinite}#offl small i:nth-of-type(2){animation-delay:.25s}#offl small i:nth-of-type(3){animation-delay:.5s}
@keyframes od{0%,100%{opacity:.15}50%{opacity:1}}@media(prefers-reduced-motion:reduce){#offl *{animation:none!important}}`;

  /* Cartoon: a sad little watch whose internet cable got unplugged */
  var cartoon = `<svg viewBox="0 0 300 300" aria-hidden="true">
<g fill="#faf6e9" opacity=".18"><g><ellipse cx="60" cy="50" rx="34" ry="14"/><ellipse cx="85" cy="42" rx="26" ry="14"/><animateTransform attributeName="transform" type="translate" values="0 0;40 0;0 0" dur="9s" repeatCount="indefinite"/></g>
<g><ellipse cx="230" cy="80" rx="30" ry="12"/><ellipse cx="212" cy="72" rx="22" ry="12"/><animateTransform attributeName="transform" type="translate" values="0 0;-35 0;0 0" dur="11s" repeatCount="indefinite"/></g></g>
<ellipse cx="150" cy="284" rx="85" ry="9" fill="#000" opacity=".25"/>
<g><animateTransform attributeName="transform" type="translate" values="0 0;0 -9;0 0" dur="3s" repeatCount="indefinite"/>
 <rect x="124" y="30" width="52" height="50" rx="10" fill="#1d4e89"/><rect x="124" y="198" width="52" height="50" rx="10" fill="#1d4e89"/><rect x="214" y="124" width="14" height="22" rx="4" fill="#c9a24b"/>
 <path d="M84 150Q58 160 60 192" stroke="#0f2a4a" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="60" cy="194" r="8" fill="#c9a24b"/>
 <path d="M216 156Q246 158 250 186" stroke="#0f2a4a" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="250" cy="188" r="8" fill="#c9a24b"/>
 <circle cx="150" cy="140" r="72" fill="#0f2a4a" stroke="#c9a24b" stroke-width="8"/><circle cx="150" cy="140" r="58" fill="#faf6e9"/><circle cx="150" cy="140" r="52" fill="none" stroke="#c9a24b" stroke-width="1.5" stroke-dasharray="2 6"/>
 <ellipse cx="127" cy="132" rx="10" ry="13" fill="#0f2a4a"><animate attributeName="ry" values="13;13;1;13;13" keyTimes="0;.9;.94;.97;1" dur="4s" repeatCount="indefinite"/></ellipse>
 <ellipse cx="173" cy="132" rx="10" ry="13" fill="#0f2a4a"><animate attributeName="ry" values="13;13;1;13;13" keyTimes="0;.9;.94;.97;1" dur="4s" repeatCount="indefinite"/></ellipse>
 <circle cx="130" cy="127" r="3.5" fill="#fff"/><circle cx="176" cy="127" r="3.5" fill="#fff"/>
 <path d="M114 112l20 6M186 112l-20 6" stroke="#0f2a4a" stroke-width="3.5" stroke-linecap="round"/>
 <circle cx="112" cy="152" r="7" fill="#f2a58f" opacity=".6"/><circle cx="188" cy="152" r="7" fill="#f2a58f" opacity=".6"/>
 <path d="M134 172Q150 158 166 172" stroke="#0f2a4a" stroke-width="4" fill="none" stroke-linecap="round"/>
 <ellipse cx="119" cy="148" rx="4" ry="6" fill="#6ec1e4"><animate attributeName="cy" values="146;185" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="2s" repeatCount="indefinite"/></ellipse>
 <rect x="243" y="196" width="14" height="20" rx="3" fill="#c9a24b"/><path d="M250 216C250 262 190 250 168 272" stroke="#c9a24b" stroke-width="4" fill="none" stroke-linecap="round"/>
</g>
<rect x="30" y="262" width="46" height="28" rx="6" fill="#faf6e9"/><rect x="42" y="271" width="5" height="10" rx="2" fill="#0f2a4a"/><rect x="58" y="271" width="5" height="10" rx="2" fill="#0f2a4a"/>
<path d="M104 268l-9 12h9l-6 12" stroke="#c9a24b" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><animate attributeName="opacity" values="0;1;0;0;1;0" dur="1.6s" repeatCount="indefinite"/></path>
</svg>`;

  var html = cartoon + `<h1>Oops! <span>No Internet</span></h1><p>Our little watch lost its connection and is feeling blue. Please check your Wi-Fi or mobile data, then try again.</p>
<button type="button" id="offlRetry">Try Again</button><small id="offlMsg">Waiting for connection<i>.</i><i>.</i><i>.</i></small>`;

  function build() {
    var s = document.createElement("style"); s.textContent = css; document.head.appendChild(s);
    var d = document.createElement("div"); d.id = "offl"; d.innerHTML = html; document.body.appendChild(d);
    var forced = document.body.hasAttribute("data-offline-page");   // true when this is offline.html
    document.getElementById("offlRetry").onclick = function () {
      if (navigator.onLine) location.reload(); else document.getElementById("offlMsg").textContent = "Still offline… try again in a moment";
    };
    function check() { d.className = (forced || !navigator.onLine) ? "show" : ""; }
    window.addEventListener("offline", check);
    window.addEventListener("online", function () { d.className = ""; location.reload(); });   // back online: reload the real page
    check();
  }
  if (document.body) build(); else document.addEventListener("DOMContentLoaded", build);
})();
