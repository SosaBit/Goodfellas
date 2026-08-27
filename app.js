const products=[
{id:1,name:"Shadow Clan Hoodie",category:"Hoodies",price:79,tag:"NEW",art:"影",desc:"Heavyweight hoodie con grafica Shadow Clan."},
{id:2,name:"After Dark Tee",category:"T-shirt",price:39,tag:"DROP 001",art:"夜",desc:"T-shirt premium con fit oversize."},
{id:3,name:"Goodfellas Varsity Hoodie",category:"Hoodies",price:84,tag:"LIMITED",art:"GF",desc:"Hoodie varsity in edizione limitata."},
{id:4,name:"Neo Tokyo Tee",category:"T-shirt",price:42,tag:"NEW",art:"東京",desc:"Graphic tee ispirata alle notti di Neo Tokyo."},
{id:5,name:"Ronin Cap",category:"Accessories",price:29,tag:"",art:"侍",desc:"Cap strutturato Goodfellas Streetwear."},
{id:6,name:"Cursed Energy Tee",category:"T-shirt",price:44,tag:"DROP 001",art:"呪",desc:"Oversize tee con graphic front/back."},
{id:7,name:"Midnight Zip Hoodie",category:"Hoodies",price:89,tag:"LIMITED",art:"黒",desc:"Zip hoodie heavyweight, dettagli minimal."},
{id:8,name:"GF Logo Socks",category:"Accessories",price:18,tag:"",art:"GF",desc:"Calze sportive con logo Goodfellas."}
];

let cart=JSON.parse(localStorage.getItem("gf-cart")||"[]");
let wishlist=JSON.parse(localStorage.getItem("gf-wishlist")||"[]");
let currentCategory="All";

const $=s=>document.querySelector(s);
const money=n=>new Intl.NumberFormat("it-IT",{style:"currency",currency:"EUR"}).format(n);

function save(){localStorage.setItem("gf-cart",JSON.stringify(cart));localStorage.setItem("gf-wishlist",JSON.stringify(wishlist));updateCounts();}
function updateCounts(){
  $("#cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0);
  $("#wishCount").textContent=wishlist.length;
}
function filtered(){
  const q=($("#searchInput")?.value||"").toLowerCase();
  return products.filter(p=>(currentCategory==="All"||p.category===currentCategory)&&(`${p.name} ${p.category} ${p.desc}`).toLowerCase().includes(q));
}
function renderProducts(){
  $("#productGrid").innerHTML=filtered().map(p=>`
  <article class="product-card" data-id="${p.id}">
    <div class="product-image">
      ${p.tag?`<span class="product-tag">${p.tag}</span>`:""}
      <button class="heart" data-wish="${p.id}" aria-label="Wishlist">${wishlist.includes(p.id)?"♥":"♡"}</button>
      <div class="product-art">${p.art}</div>
    </div>
    <div class="product-info"><div><h3>${p.name}</h3><p>${p.category}</p></div><strong class="price">${money(p.price)}</strong></div>
  </article>`).join("")||`<p class="empty">Nessun prodotto trovato.</p>`;
}
function openCart(){
  $("#cartDrawer").classList.add("open");$("#overlay").classList.add("show");renderCart();
}
function closeCart(){
  $("#cartDrawer").classList.remove("open");$("#overlay").classList.remove("show");
}
function renderCart(){
  if(!cart.length){$("#cartItems").innerHTML=`<div class="empty">La tua bag è vuota.<br><br><a href="#shop">Scopri il drop ↗</a></div>`;}
  else $("#cartItems").innerHTML=cart.map(x=>{const p=products.find(p=>p.id===x.id);return`
  <div class="cart-row">
    <div class="cart-thumb">${p.art}</div>
    <div><h4>${p.name}</h4><p>${money(p.price)}</p><div class="qty"><button data-dec="${p.id}">−</button><span>${x.qty}</span><button data-inc="${p.id}">+</button></div></div>
    <strong>${money(p.price*x.qty)}</strong>
  </div>`}).join("");
  $("#cartTotal").textContent=money(cart.reduce((a,x)=>a+(products.find(p=>p.id===x.id).price*x.qty),0));
}
function addToCart(id){
  const found=cart.find(x=>x.id===id);found?found.qty++:cart.push({id,qty:1});save();openCart();
}
function openProduct(id){
  const p=products.find(x=>x.id===id);
  $("#modalContent").innerHTML=`<div class="modal-product">
    <div class="product-image"><div class="product-art">${p.art}</div></div>
    <div class="modal-copy"><p class="eyebrow">${p.category} / GOODFELLAS</p><h2>${p.name}</h2><div class="big-price">${money(p.price)}</div>
    <p>${p.desc}</p><div class="sizes">${["S","M","L","XL"].map((s,i)=>`<button class="${i===1?"selected":""}" data-size="${s}">${s}</button>`).join("")}</div>
    <button class="primary-btn" data-add="${p.id}">ADD TO BAG <span>+</span></button></div></div>`;
  $("#productModal").classList.add("show");
}
function closeModal(){$("#productModal").classList.remove("show")}

document.addEventListener("click",e=>{
  const wish=e.target.closest("[data-wish]");
  if(wish){const id=+wish.dataset.wish;wishlist.includes(id)?wishlist=wishlist.filter(x=>x!==id):wishlist.push(id);save();renderProducts();return}
  const card=e.target.closest(".product-card"); if(card&&!e.target.closest("button"))openProduct(+card.dataset.id);
  const add=e.target.closest("[data-add]");if(add){addToCart(+add.dataset.add);closeModal()}
  const inc=e.target.closest("[data-inc]");if(inc){const x=cart.find(x=>x.id===+inc.dataset.inc);x.qty++;save();renderCart()}
  const dec=e.target.closest("[data-dec]");if(dec){const x=cart.find(x=>x.id===+dec.dataset.dec);x.qty--;if(x.qty<=0)cart=cart.filter(y=>y.id!==x.id);save();renderCart()}
  const filter=e.target.closest("[data-category]");if(filter){currentCategory=filter.dataset.category;document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===filter));renderProducts()}
  const quick=e.target.closest("[data-filter]");if(quick){currentCategory=quick.dataset.filter;document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b.dataset.category===currentCategory));$("#shop").scrollIntoView();renderProducts()}
});
$("#cartBtn").onclick=openCart;
$("#closeCart").onclick=closeCart;
$("#overlay").onclick=closeCart;
$("#closeModal").onclick=closeModal;
$("#searchToggle").onclick=()=>$("#searchbar").classList.toggle("show");
$("#searchInput").addEventListener("input",renderProducts);
$("#wishlistBtn").onclick=()=>{currentCategory="All";$("#searchInput").value="";$("#shop").scrollIntoView();renderProducts();if(!wishlist.length)alert("La wishlist è vuota.");else $("#productGrid").innerHTML=products.filter(p=>wishlist.includes(p.id)).map(p=>`<article class="product-card" data-id="${p.id}"><div class="product-image"><div class="product-art">${p.art}</div></div><div class="product-info"><h3>${p.name}</h3><strong class="price">${money(p.price)}</strong></div></article>`).join("")};
$("#checkoutBtn").onclick=()=>{if(!cart.length)return alert("La bag è vuota.");alert("Checkout demo. Per i pagamenti reali collegheremo Stripe in modo sicuro.");};
$("#newsletterForm").addEventListener("submit",e=>{e.preventDefault();alert("Grazie! Sei nella lista Goodfellas.");e.target.reset()});
document.querySelectorAll(".sizes button").forEach(()=>{});
renderProducts();updateCounts();
