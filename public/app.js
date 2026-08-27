const products=[
{id:1,name:"Shadow Clan Hoodie",category:"Hoodies",price:79,tag:"NEW",art:"影",colors:["Black","Bone"],sizes:["S","M","L","XL","XXL"],desc:"Heavyweight hoodie oversize con graphic Shadow Clan. 420gsm, interno garzato."},
{id:2,name:"After Dark Tee",category:"T-shirt",price:39,tag:"DROP 001",art:"夜",colors:["Black","White"],sizes:["S","M","L","XL","XXL"],desc:"T-shirt premium oversize con graphic front/back. 240gsm cotton."},
{id:3,name:"Goodfellas Varsity Hoodie",category:"Hoodies",price:84,tag:"LIMITED",art:"GF",colors:["Black","Grey"],sizes:["S","M","L","XL"],desc:"Heavyweight varsity hoodie in edizione limitata."},
{id:4,name:"Neo Tokyo Tee",category:"T-shirt",price:42,tag:"NEW",art:"東京",colors:["Black","Bone"],sizes:["S","M","L","XL","XXL"],desc:"Graphic tee oversize ispirata alle notti di Neo Tokyo."},
{id:5,name:"Ronin Cap",category:"Accessories",price:29,tag:"",art:"侍",colors:["Black"],sizes:["OS"],desc:"Cap strutturato con ricamo Goodfellas Streetwear."},
{id:6,name:"Cursed Energy Tee",category:"T-shirt",price:44,tag:"DROP 001",art:"呪",colors:["Black","White"],sizes:["S","M","L","XL","XXL"],desc:"Oversize tee con graphic front/back e fit street."},
{id:7,name:"Midnight Zip Hoodie",category:"Hoodies",price:89,tag:"LIMITED",art:"黒",colors:["Black"],sizes:["S","M","L","XL","XXL"],desc:"Zip hoodie heavyweight con dettagli minimal."},
{id:8,name:"GF Logo Socks",category:"Accessories",price:18,tag:"",art:"GF",colors:["Black","White"],sizes:["OS"],desc:"Calze sportive con logo Goodfellas Streetwear."}
];

let cart=JSON.parse(localStorage.getItem("gf-cart")||"[]");
let wishlist=JSON.parse(localStorage.getItem("gf-wishlist")||"[]");
let currentCategory="All";

const $=s=>document.querySelector(s);
const money=n=>new Intl.NumberFormat("it-IT",{style:"currency",currency:"EUR"}).format(n);

function save(){localStorage.setItem("gf-cart",JSON.stringify(cart));localStorage.setItem("gf-wishlist",JSON.stringify(wishlist));updateCounts();}
function updateCounts(){ $("#cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0); $("#wishCount").textContent=wishlist.length; }

function filtered(){
 const q=($("#searchInput")?.value||"").toLowerCase();
 return products.filter(p=>(currentCategory==="All"||p.category===currentCategory)&&(`${p.name} ${p.category} ${p.desc} ${p.colors.join(" ")}`).toLowerCase().includes(q));
}

function productCard(p){
 return `<article class="product-card" data-id="${p.id}">
 <div class="product-image">${p.tag?`<span class="product-tag">${p.tag}</span>`:""}
 <button class="heart" data-wish="${p.id}" aria-label="Wishlist">${wishlist.includes(p.id)?"♥":"♡"}</button>
 <div class="product-art">${p.art}</div></div>
 <div class="product-info"><div><h3>${p.name}</h3><p>${p.category} · ${p.colors.join(" / ")}</p></div><strong class="price">${money(p.price)}</strong></div></article>`;
}

function renderProducts(){ $("#productGrid").innerHTML=filtered().map(productCard).join("")||`<p class="empty">Nessun prodotto trovato.</p>`; }

function openCart(){ $("#cartDrawer").classList.add("open"); $("#overlay").classList.add("show"); renderCart(); }
function closeCart(){ $("#cartDrawer").classList.remove("open"); $("#overlay").classList.remove("show"); }

function renderCart(){
 if(!cart.length){$("#cartItems").innerHTML=`<div class="empty">La tua bag è vuota.<br><br><a href="#shop">Scopri il drop ↗</a></div>`;}
 else $("#cartItems").innerHTML=cart.map((x,i)=>{const p=products.find(p=>p.id===x.id);return`
 <div class="cart-row">
  <div class="cart-thumb">${p.art}</div>
  <div><h4>${p.name}</h4><p>${x.size||"M"} · ${x.color||p.colors[0]} · ${money(p.price)}</p>
  <div class="qty"><button data-dec="${i}">−</button><span>${x.qty}</span><button data-inc="${i}">+</button></div></div>
  <strong>${money(p.price*x.qty)}</strong>
 </div>`}).join("");
 $("#cartTotal").textContent=money(cart.reduce((a,x)=>a+(products.find(p=>p.id===x.id).price*x.qty),0));
}

function addToCart(id,size,color){
 const found=cart.find(x=>x.id===id&&x.size===size&&x.color===color);
 found?found.qty++:cart.push({id,qty:1,size,color});
 save(); openCart();
}

function openProduct(id){
 const p=products.find(x=>x.id===id);
 $("#modalContent").innerHTML=`<div class="modal-product">
 <div class="product-image"><div class="product-art">${p.art}</div></div>
 <div class="modal-copy"><p class="eyebrow">${p.category} / GOODFELLAS STREETWEAR</p>
 <h2>${p.name}</h2><div class="big-price">${money(p.price)}</div><p>${p.desc}</p>
 <label class="eyebrow">SIZE</label><div class="sizes">${p.sizes.map((s,i)=>`<button class="${i===1||(!p.sizes.includes("M")&&i===0)?"selected":""}" data-size="${s}">${s}</button>`).join("")}</div>
 <label class="eyebrow">COLOR</label><div class="sizes">${p.colors.map((c,i)=>`<button class="${i===0?"selected":""}" data-color="${c}">${c}</button>`).join("")}</div>
 <button class="primary-btn" data-add="${p.id}">ADD TO BAG <span>+</span></button>
 </div></div>`;
 $("#productModal").classList.add("show");
}
function closeModal(){ $("#productModal").classList.remove("show"); }

document.addEventListener("click",e=>{
 const wish=e.target.closest("[data-wish]");
 if(wish){const id=+wish.dataset.wish;wishlist.includes(id)?wishlist=wishlist.filter(x=>x!==id):wishlist.push(id);save();renderProducts();return;}
 const card=e.target.closest(".product-card");
 if(card&&!e.target.closest("button"))openProduct(+card.dataset.id);

 const size=e.target.closest("[data-size]");
 if(size){size.parentElement.querySelectorAll("button").forEach(b=>b.classList.remove("selected"));size.classList.add("selected");return;}
 const color=e.target.closest("[data-color]");
 if(color){color.parentElement.querySelectorAll("button").forEach(b=>b.classList.remove("selected"));color.classList.add("selected");return;}

 const add=e.target.closest("[data-add]");
 if(add){
  const size=$("#modalContent [data-size].selected")?.dataset.size||"M";
  const color=$("#modalContent [data-color].selected")?.dataset.color||products.find(p=>p.id===+add.dataset.add).colors[0];
  addToCart(+add.dataset.add,size,color);closeModal();return;
 }

 const inc=e.target.closest("[data-inc]");
 if(inc){cart[+inc.dataset.inc].qty++;save();renderCart();return;}
 const dec=e.target.closest("[data-dec]");
 if(dec){const i=+dec.dataset.dec;cart[i].qty--;if(cart[i].qty<=0)cart.splice(i,1);save();renderCart();return;}

 const filter=e.target.closest("[data-category]");
 if(filter){currentCategory=filter.dataset.category;document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===filter));renderProducts();return;}

 const quick=e.target.closest("[data-filter]");
 if(quick){currentCategory=quick.dataset.filter;document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b.dataset.category===currentCategory));$("#shop").scrollIntoView();renderProducts();}
});

$("#cartBtn").onclick=openCart;
$("#closeCart").onclick=closeCart;
$("#overlay").onclick=closeCart;
$("#closeModal").onclick=closeModal;
$("#searchToggle").onclick=()=>$("#searchbar").classList.toggle("show");
$("#searchInput").addEventListener("input",renderProducts);

$("#wishlistBtn").onclick=()=>{
 $("#shop").scrollIntoView(); currentCategory="All"; $("#searchInput").value="";
 document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b.dataset.category==="All"));
 const items=products.filter(p=>wishlist.includes(p.id));
 $("#productGrid").innerHTML=items.length?items.map(productCard).join(""):`<p class="empty">La wishlist è vuota.</p>`;
};

$("#checkoutBtn").onclick=()=>{
 if(!cart.length)return alert("La bag è vuota.");
 alert("Checkout demo. Il prossimo passaggio è collegare Stripe in modo sicuro lato server.");
};

$("#newsletterForm").addEventListener("submit",e=>{
 e.preventDefault(); alert("Grazie! Sei nella lista Goodfellas Streetwear."); e.target.reset();
});

renderProducts(); updateCounts();
