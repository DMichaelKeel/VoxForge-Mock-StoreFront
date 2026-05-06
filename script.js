/* Minimal script: demo parts and brand logo updater */

const demoParts = [
  { name: "RTX 4090 GPU", price: "$1,599", img: "https://images.unsplash.com/photo-1591405351990-4726e331f141?auto=format&fit=crop&w=400&q=80" },
  { name: "Mechanical Keyboard", price: "$120", img: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=400&q=80" },
  { name: "Curved Gaming Monitor", price: "$450", img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80" },
  { name: "Ryzen 9 CPU", price: "$549", img: "https://images.unsplash.com/photo-1555617766-c94804975da3?auto=format&fit=crop&w=400&q=80" }
];

function renderDemoParts(){
  const grid = document.getElementById('demoPartsGrid');
  if(!grid) return;
  grid.innerHTML = demoParts.map(p => `
    <div class="card">
      <img class="product-img" src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <div class="price">${p.price}</div>
    </div>
  `).join('');
}

function updateBrandLogos(){
  const brands = Array.from(document.querySelectorAll('.brand'));
  if(!brands.length) return;
  brands.forEach(b=>{
    const span = b.querySelector('span');
    const img = b.querySelector('img.brand-logo');
    if(!span || !img) return;
    img.alt = img.alt || span.textContent.trim();
  });
}

document.addEventListener('DOMContentLoaded',()=>{
  renderDemoParts();
  updateBrandLogos();
});
