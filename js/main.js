/* Alberto Watches — main.js (jQuery + vanilla JS)
   Every page loads this file. It builds the navbar/footer/cart, and runs page features. */
$(function () {
  const root = document.body.dataset.root || "";           // "" on index.html, "../" in pages/
  const link = f => (root ? "" : "pages/") + f;             // link to a page inside /pages
  const home = root + "index.html";

  /* ---------- Fallback image (shown if your own jpg is missing) ---------- */
  const fallback = "data:image/svg+xml," + encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><rect width='200' height='200' fill='#e9e2c6'/><circle cx='100' cy='100' r='62' fill='#0f2a4a' stroke='#c9a24b' stroke-width='6'/><path d='M100 55v45l28 18' stroke='#faf6e9' stroke-width='5' fill='none' stroke-linecap='round'/><rect x='84' y='20' width='32' height='22' fill='#c9a24b'/><rect x='84' y='158' width='32' height='22' fill='#c9a24b'/></svg>");
  document.addEventListener("error", e => { if (e.target.tagName === "IMG" && e.target.src !== fallback) e.target.src = fallback; }, true);

  /* ---------- Product data: 24 watches (watch1.jpg ... watch24.jpg) ---------- */
  const names = "Azure Classic,Ivory Heritage,Sapphire Regent,Slate Minimal,Aurora Sport,Gold Crown,Midnight Chrono,Pearl Slim,Monarch Luxe,Cobalt Diver,Indigo Dress,Opal Skeleton,Regal Moonphase,Marine Racer,Cream Elegance,Royal Navy,Mist Minimal,Titan Sport,Gilded Orion,Ivory Slim,Everblue Classic,Velvet Luxe,Alpine Explorer,Serene Minimal".split(",");
  const pkr = n => "Rs " + n.toLocaleString("en-US");   // price format: Rs 45,000
  const cats = ["Classic", "Luxury", "Sports", "Minimalist"];
  const descs = { Classic: "A refined everyday dress watch.", Luxury: "Gold details and a hand-finished dial.", Sports: "Water resistant and built for action.", Minimalist: "Clean dial, calm and understated." };
  const products = names.map((n, i) => ({ id: i + 1, name: n, cat: cats[i % 4], price: Math.round((150 + ((i * 7) % 12) * 40 + (i % 4) * 60) * 250 / 500) * 500, rating: i % 2 ? 4.5 : 5, img: root + "images/watch" + (i + 1) + ".jpg", desc: descs[cats[i % 4]] }));
  // Ladies watches = these card numbers (put ladies photos in watch2, 5, 8, 11, 14, 17, 20, 23)
  const ladies = { 2: "Rose Ivory", 5: "Aurora Lady", 8: "Pearl Lady", 11: "Sky Blossom", 14: "Azure Grace", 17: "Pearl Muse", 20: "Ivory Belle", 23: "Alpine Aria" };
  products.forEach(p => { p.gender = ladies[p.id] ? "Ladies" : "Gents"; if (ladies[p.id]) { p.name = ladies[p.id]; p.desc = "Delicate, graceful design made for her."; } });

  /* ---------- Logo: gold ring + monogram "A" (inline SVG) ---------- */
  const logoSVG = `<svg class="logo-svg" viewBox="0 0 48 48" width="44" height="44" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1d98f"/><stop offset="1" stop-color="#b8903a"/></linearGradient></defs><circle cx="24" cy="24" r="22" fill="#0f2a4a" stroke="url(#lg)" stroke-width="2.5"/><circle cx="24" cy="24" r="18" fill="none" stroke="url(#lg)" stroke-width=".8" stroke-dasharray="1.5 3"/><path d="M15 33 24 12l9 21M18.5 27h11" fill="none" stroke="url(#lg)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="24" cy="12" r="1.6" fill="#faf6e9"/></svg>`;
  $(".auth-logo").prepend(logoSVG);
  $(".hero").append(Array.from({ length: 16 }, (_, i) => `<span class="spark" style="left:${(i * 37) % 100}%;animation-delay:${(i % 8)}s"></span>`).join(""));   // floating gold sparkles

  /* ---------- Navbar + footer + cart modal (same on every page) ---------- */
  const auth = $("body").hasClass("auth-page");
  const file = location.pathname.split("/").pop() || "index.html";
  const me = JSON.parse(localStorage.getItem("albertoUser") || sessionStorage.getItem("albertoUser") || "null");   // logged-in user (or null)
  const authBtns = me ? `<span class="text-white small" id="hiUser"></span><button class="btn btn-gold btn-sm" id="logout">Logout</button>`
    : `<a href="${link("login.html")}" class="btn btn-outline-ivory btn-sm">Login</a><a href="${link("signup.html")}" class="btn btn-gold btn-sm">Sign Up</a>`;
  const act = f => (file === f ? "active" : "");
  if (!auth) {
    $("#site-nav").html(`<nav class="navbar navbar-expand-lg navbar-dark"><div class="container">
      <a class="brand" href="${home}">${logoSVG}<span class="brand-text">Alberto <b>Watches</b><small>Timepieces · Est. 1987</small></span></a>
      <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nv" aria-label="Menu"><span class="navbar-toggler-icon"></span></button>
      <div class="collapse navbar-collapse" id="nv"><ul class="navbar-nav mx-auto">
        <li class="nav-item"><a class="nav-link ${act("index.html")}" href="${home}">Home</a></li>
        <li class="nav-item"><a class="nav-link ${act("about.html")}" href="${link("about.html")}">About</a></li>
        <li class="nav-item"><a class="nav-link ${act("collection.html")}" href="${link("collection.html")}">Collection</a></li>
        <li class="nav-item"><a class="nav-link ${act("contact.html")}" href="${link("contact.html")}">Contact Us</a></li></ul>
        <div class="d-flex align-items-center gap-3">
          <button class="icon-btn" id="themeBtn" aria-label="Toggle theme"><i class="bi bi-moon-stars"></i></button>
          <button class="icon-btn" data-bs-toggle="modal" data-bs-target="#cartModal" aria-label="Cart"><i class="bi bi-bag"></i><span class="cart-count" id="cartCount">0</span></button>
          ${authBtns}</div></div></div></nav>`);
    if (me) $("#hiUser").text("Hi, " + me.name.split(" ")[0]);   // .text() keeps the name safe
    $(document).on("click", "#logout", () => { localStorage.removeItem("albertoUser"); sessionStorage.removeItem("albertoUser"); location.href = home; });
    $("#site-footer").html(`<footer><div class="container"><div class="row g-4">
      <div class="col-lg-4"><a class="brand" href="${home}">${logoSVG}Alberto <b>Watches</b></a><p class="mt-3">Handcrafted timepieces in navy and cream. Made to be treasured.</p>
        <div class="social"><a href="#" aria-label="Instagram"><i class="bi bi-instagram"></i></a><a href="#" aria-label="Facebook"><i class="bi bi-facebook"></i></a><a href="#" aria-label="Twitter"><i class="bi bi-twitter-x"></i></a></div></div>
      <div class="col-6 col-lg-2"><h6>Quick Links</h6><a href="${home}">Home</a><a href="${link("about.html")}">About</a><a href="${link("collection.html")}">Collection</a></div>
      <div class="col-6 col-lg-2"><h6>Support</h6><a href="${link("contact.html")}">Contact Us</a><a href="${home}#faq">FAQ</a><a href="${link("login.html")}">My Account</a></div>
      <div class="col-lg-4"><h6>Contact</h6><p class="mb-1">hello@albertowatches.example</p><p class="mb-1">+00 000 0000000</p><p>123 Sample Street, Your City</p></div></div>
      <hr><p class="text-center small mb-0">© 2026 Alberto Watches. Student demo project — no real orders or payments.</p></div></footer>`);
    $("body").append(`<button id="toTop" aria-label="Back to top"><i class="bi bi-arrow-up"></i></button>
      <div class="modal fade" id="cartModal" tabindex="-1"><div class="modal-dialog modal-dialog-scrollable modal-lg"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">Your Cart</h5><button class="btn-close" data-bs-dismiss="modal"></button></div>
      <div class="modal-body" id="cartBody"></div><div class="modal-footer justify-content-between"><div>Subtotal: <b id="sub">Rs 0</b> · Total: <b id="tot">Rs 0</b></div><button class="btn btn-gold" id="checkout">Checkout (demo)</button></div></div></div></div>`);
  }

  /* ---------- Theme toggle (saved in localStorage) ---------- */
  function setTheme(t) { document.documentElement.setAttribute("data-theme", t); localStorage.setItem("albertoTheme", t); $("#themeBtn i").attr("class", t === "dark" ? "bi bi-sun" : "bi bi-moon-stars"); }
  setTheme(localStorage.getItem("albertoTheme") || "light");
  $(document).on("click", "#themeBtn", () => setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark"));

  /* ---------- Product card HTML ---------- */
  const card = p => `<div class="col-sm-6 col-lg-3 reveal show"><div class="pcard"><div class="imgbox"><img src="${p.img}" alt="${p.name} watch" loading="lazy"></div>
    <div class="pbody"><span class="badge-cat">${p.cat} · ${p.gender}</span><h5 class="mt-2">${p.name}</h5><div class="stars text-warning small">${"★".repeat(Math.floor(p.rating))}${p.rating % 1 ? "½" : ""}</div><p>${p.desc}</p>
    <div class="d-flex justify-content-between align-items-center"><span class="price">${pkr(p.price)}</span><button class="btn btn-navy btn-sm add-cart" data-id="${p.id}">Add to Cart</button></div></div></div></div>`;
  $("#featured").html([2, 6, 9, 18].map(id => card(products[id - 1])).join(""));

  /* ---------- Collection: filter + search + sort + pagination (8 per page) ---------- */
  if ($("#grid").length) {
    let page = 1, cat = "All"; const size = 8;
    function render() {
      let list = products.filter(p => (cat === "All" || p.cat === cat || p.gender === cat) && p.name.toLowerCase().includes($("#search").val().toLowerCase().trim()));
      const s = $("#sort").val();
      if (s === "low") list.sort((a, b) => a.price - b.price); if (s === "high") list.sort((a, b) => b.price - a.price); if (s === "az") list.sort((a, b) => a.name.localeCompare(b.name));
      const pages = Math.max(1, Math.ceil(list.length / size)); if (page > pages) page = pages;
      $("#grid").html(list.slice((page - 1) * size, page * size).map(card).join(""));
      $("#none").toggleClass("d-none", list.length > 0);
      let h = `<li class="page-item ${page === 1 ? "disabled" : ""}"><a class="page-link" href="#" data-p="${page - 1}">Previous</a></li>`;
      for (let i = 1; i <= pages; i++) h += `<li class="page-item ${i === page ? "active" : ""}"><a class="page-link" href="#" data-p="${i}">${i}</a></li>`;
      h += `<li class="page-item ${page === pages ? "disabled" : ""}"><a class="page-link" href="#" data-p="${page + 1}">Next</a></li>`;
      $("#pager").html(list.length ? h : "");
    }
    $("#pager").on("click", "a", function (e) { e.preventDefault(); if ($(this).parent().hasClass("disabled")) return; page = +$(this).data("p"); render(); $("html,body").animate({ scrollTop: 250 }, 400); });
    $("#filters").on("click", ".chip", function () { $(".chip").removeClass("active"); $(this).addClass("active"); cat = $(this).data("cat"); page = 1; render(); });
    $("#search,#sort").on("input change", () => { page = 1; render(); });   // reset to page 1
    const h = decodeURIComponent(location.hash.slice(1));   // e.g. collection.html#Ladies opens that filter
    if (h) { cat = h; $(".chip").removeClass("active").filter('[data-cat="' + h + '"]').addClass("active"); }
    render();
  }

  /* ---------- Shopping cart (saved in localStorage) ---------- */
  let cart = JSON.parse(localStorage.getItem("albertoCart") || "[]");
  function saveCart() {
    localStorage.setItem("albertoCart", JSON.stringify(cart));
    $("#cartCount").text(cart.reduce((n, c) => n + c.qty, 0));
    $("#cartBody").html(cart.length ? cart.map(c => { const p = products[c.id - 1]; return `<div class="d-flex align-items-center gap-3 mb-3"><img src="${p.img}" alt="${p.name}" width="64" height="64" class="rounded" style="object-fit:cover"><div class="flex-grow-1"><b>${p.name}</b><div class="small text-muted-x">${pkr(p.price)}</div></div>
      <div class="qty"><button data-id="${c.id}" data-d="-1">−</button> <span class="mx-2">${c.qty}</span> <button data-id="${c.id}" data-d="1">+</button></div><button class="btn btn-sm text-danger remove" data-id="${c.id}"><i class="bi bi-trash"></i></button></div>`; }).join("") : "<p class='text-center py-4'>Your cart is empty.</p>");
    const t = cart.reduce((n, c) => n + c.qty * products[c.id - 1].price, 0); $("#sub,#tot").text(pkr(t));
  }
  $(document).on("click", ".add-cart", function () { const id = +$(this).data("id"), f = cart.find(c => c.id === id); f ? f.qty++ : cart.push({ id, qty: 1 }); saveCart(); $(this).text("Added ✓"); setTimeout(() => $(this).text("Add to Cart"), 900); });
  $(document).on("click", ".qty button", function () { const c = cart.find(c => c.id === +$(this).data("id")); c.qty += +$(this).data("d"); if (c.qty < 1) cart = cart.filter(x => x !== c); saveCart(); });
  $(document).on("click", ".remove", function () { cart = cart.filter(c => c.id !== +$(this).data("id")); saveCart(); });
  $(document).on("click", "#checkout", () => alert("Demo only: no real payment or order is processed."));
  saveCart();

  /* ---------- Form validation (login, signup, contact, newsletter) ---------- */
  $(document).on("click", ".toggle-pw", function () { const i = $(this).prev("input"), show = i.attr("type") === "password"; i.attr("type", show ? "text" : "password"); $(this).find("i").attr("class", show ? "bi bi-eye-slash" : "bi bi-eye"); });
  $("form[data-form]").on("submit", async function (e) {
    e.preventDefault(); let ok = true; const $f = $(this), type = $f.data("form"), mail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    $f.find(".form-control,.form-check-input").each(function () {
      const n = this.name, v = this.value.trim(); let bad = false;
      if (n === "email") bad = !mail.test(v);
      else if (n === "password") bad = v.length < 6;
      else if (n === "confirm") bad = v !== $f.find("[name=password]").val() || !v;
      else if (n === "terms") bad = !this.checked;
      else if (this.required) bad = !v;
      $(this).toggleClass("is-invalid", bad); if (bad) ok = false;
    });
    const $m = $f.find(".form-msg"), say = (t, good) => $m.text(t).css("color", good ? "#2e9e6b" : "#e5534b");
    if (!ok) return say("", true);
    // Password is never saved as plain text: we keep only a SHA-256 fingerprint (hash) of it.
    const hash = async t => window.crypto && crypto.subtle ? [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)))].map(b => b.toString(16).padStart(2, "0")).join("") : btoa(t);
    const users = JSON.parse(localStorage.getItem("albertoUsers") || "{}"), email = ($f.find("[name=email]").val() || "").toLowerCase().trim();
    if (type === "signup") {
      if (users[email]) return say("This email is already registered. Please login.", false);
      users[email] = { name: $f.find("[name=name]").val().trim(), pass: await hash($f.find("[name=password]").val()) };
      localStorage.setItem("albertoUsers", JSON.stringify(users));
      say("Account created successfully! Taking you to login…", true); setTimeout(() => location.href = "login.html", 1200);
    } else if (type === "login") {
      const u = users[email];
      if (!u) return say("No account found with this email. Please Sign Up first.", false);
      if (u.pass !== await hash($f.find("[name=password]").val())) return say("Incorrect password. Please try again.", false);
      (document.getElementById("rm").checked ? localStorage : sessionStorage).setItem("albertoUser", JSON.stringify({ name: u.name, email }));   // Remember me = localStorage
      say("Welcome back, " + u.name.split(" ")[0] + "! Opening the website…", true); setTimeout(() => location.href = "../index.html", 1000);
    } else {
      say(type === "contact" ? "Thank you! Your message has been validated." : "Thanks for subscribing!", true); $f[0].reset();
    }
  });

  /* ---------- Effects: scroll reveal, navbar, back-to-top, custom cursor ---------- */
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add("show"); io.unobserve(x.target); } }), { threshold: .15 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
  $(window).on("scroll", () => { $(".navbar").toggleClass("scrolled", scrollY > 60); $("#toTop").toggleClass("show", scrollY > 400); });
  $(document).on("click", "#toTop", () => $("html,body").animate({ scrollTop: 0 }, 600));
  if (!still && matchMedia("(pointer:fine)").matches) {
    $("body").append('<div class="cursor-dot"></div><div class="cursor-ring"></div>');
    $(document).on("mousemove", e => $(".cursor-dot,.cursor-ring").css({ left: e.clientX, top: e.clientY }));
    $(document).on("mouseenter", "a,button,.pcard", () => $(".cursor-ring").addClass("big")).on("mouseleave", "a,button,.pcard", () => $(".cursor-ring").removeClass("big"));
  }

  /* ---------- Homepage extras: scroll progress bar, counters, hero tilt ---------- */
  $("body").append('<div id="prog"></div>');
  $(window).on("scroll", () => $("#prog").css("width", (scrollY / (document.body.scrollHeight - innerHeight) * 100) + "%"));
  $("#spotPrice").text(pkr(products[8].price));
  const co = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { const $c = $(x.target); $({ n: 0 }).animate({ n: $c.data("to") }, { duration: 2000, step: v => $c.text(Math.floor(v).toLocaleString()) }); co.unobserve(x.target); } }), { threshold: .5 });
  document.querySelectorAll(".count").forEach(el => co.observe(el));
  if (!still) $(".hero").on("mousemove", e => { const x = (e.clientX / innerWidth - .5) * 14, y = (e.clientY / innerHeight - .5) * -14; $(".hero-img").css("transform", `rotateY(${x}deg) rotateX(${y}deg)`); });   // gentle 3D tilt
});
