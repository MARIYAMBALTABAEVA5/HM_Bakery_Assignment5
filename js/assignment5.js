// Assignment 5: DOM, events, callbacks, objects, arrays, loops, sounds and animations.
document.addEventListener('DOMContentLoaded', () => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const feedback = $('#a5-feedback');
  const notify = (message) => { if (feedback) feedback.textContent = message; };
  // Objects with methods; array data; map() and filter() are higher-order functions.
  const products = [
    {name:'Chocolate Cake',category:'cakes',price:2500,image:'images/chocolate-cake.jpg'},
    {name:'Vanilla Cake',category:'cakes',price:2300,image:'images/vanilla-cake.jpg'},
    {name:'Cookies',category:'pastries',price:850,image:'images/cookies.jpg'},
    {name:'Croissant',category:'pastries',price:950,image:'images/croissant.jpg'},
    {name:'Latte',category:'drinks',price:1200,image:'images/latte.jpg'},
    {name:'Milkshake',category:'drinks',price:1500,image:'images/milkshake.jpg'}
  ];
  const cart = {items:[], add(product){this.items.push(product);}, total(){return this.items.reduce((sum,p)=>sum+p.price,0);}};
  const cards = $('#a5-products');
  function playNotification(){
    try { const AudioContextClass=window.AudioContext||window.webkitAudioContext;if(!AudioContextClass)return;
      const ctx=new AudioContextClass();const osc=ctx.createOscillator();const gain=ctx.createGain();
      osc.type='sine';osc.frequency.value=660;gain.gain.setValueAtTime(.06,ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.16);
      osc.connect(gain);gain.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+.17);
      osc.onended=()=>ctx.close();
    }catch(error){console.info('Sound unavailable',error);}
  }
  function renderProducts(category='all'){
    if(!cards)return;
    const visible=products.filter(p=>category==='all'||p.category===category);
    cards.innerHTML=visible.map((p)=>`<article class="a5-card"><img src="${p.image}" alt="${p.name}"><h3>${p.name}</h3><p>${p.price.toLocaleString()} ₸</p><button class="a5-btn a5-add" type="button" data-name="${p.name}">Add to cart</button></article>`).join('');
    $$('.a5-add').forEach(button=>button.addEventListener('click',()=>{
      const product=products.find(p=>p.name===button.dataset.name);if(!product)return;
      cart.add(product);$('#a5-cart').textContent=`Cart: ${cart.items.length} items · ${cart.total().toLocaleString()} ₸`;
      button.closest('.a5-card').classList.add('a5-pop');setTimeout(()=>button.closest('.a5-card')?.classList.remove('a5-pop'),350);
      playNotification();notify(`${product.name} added to your cart!`);
    }));
  }
  renderProducts();
  $$('.a5-filter').forEach(button=>button.addEventListener('click',()=>{
    // Switch statement for category-dependent logic.
    let category;switch(button.dataset.category){case 'cakes':category='cakes';break;case 'pastries':category='pastries';break;case 'drinks':category='drinks';break;default:category='all';}
    $$('.a5-filter').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    renderProducts(category);notify(`Showing ${category} products.`);
  }));
  $('#a5-theme')?.addEventListener('click',()=>{const dark=document.body.classList.toggle('a5-night');$('#a5-theme').textContent=dark?'Light Mode':'Dark Mode';});
  $('#a5-more')?.addEventListener('click',()=>{const extra=$('#a5-extra');extra.hidden=!extra.hidden;$('#a5-more').textContent=extra.hidden?'Read More':'Read Less';});
  const stars=$$('.a5-star');stars.forEach((star,index)=>star.addEventListener('click',()=>{
    stars.forEach((s,i)=>{s.classList.toggle('selected',i<=index);s.setAttribute('aria-pressed',String(i<=index));});
    $('#a5-rating').textContent=`Your rating: ${index+1}/5`;playNotification();
  }));
  $('#a5-time')?.addEventListener('click',()=>{$('#a5-clock').textContent=new Date().toLocaleTimeString();});
  // Keyboard navigation on existing top navigation links.
  const nav=$$('.bakery-navbar .nav-link');nav.forEach((link,index)=>link.addEventListener('keydown',(event)=>{
    if(!['ArrowRight','ArrowLeft'].includes(event.key))return;
    event.preventDefault();const direction=event.key==='ArrowRight'?1:-1;
    nav[(index+direction+nav.length)%nav.length].focus();
  }));
  // A callback selects which form step is displayed.
  const steps=$$('.a5-step');let currentStep=0;
  function showStep(index,callback){steps.forEach((step,i)=>step.hidden=i!==index);currentStep=index;if(callback)callback(index);}
  const stepStatus=(index)=>{$('#a5-step-status').textContent=`Step ${index+1} of ${steps.length}`;};
  showStep(0,stepStatus);
  $('#a5-next')?.addEventListener('click',()=>{
    const name=$('#a5-name').value.trim();const email=$('#a5-email').value.trim();
    if(!name||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){notify('Enter a name and valid email first.');return;}
    showStep(1,stepStatus);notify('Now enter your bakery request.');
  });
  $('#a5-back')?.addEventListener('click',()=>showStep(0,stepStatus));
  $('#a5-finish')?.addEventListener('click',()=>{
    if(!$('#a5-request').value.trim()){notify('Please enter your request.');return;}
    notify('Thank you! Your form passed the demo validation. No data was sent.');playNotification();
  });
});
