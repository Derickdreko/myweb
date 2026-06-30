// =========================================================
// DERICK OTIENO — PORTFOLIO  |  shared interactions
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Loader ---- */
  const loader = document.querySelector('.loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('hide'), 350);
  });

  /* ---- Theme toggle ---- */
  const root = document.documentElement;
  const themeBtn = document.querySelector('[data-theme-toggle]');
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) root.setAttribute('data-theme', savedTheme);
  themeBtn && themeBtn.addEventListener('click', () => {
    const cur = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    if (cur === 'dark') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', cur);
    themeBtn.textContent = cur === 'light' ? '☾' : '☀';
  });
  if (themeBtn) themeBtn.textContent = root.getAttribute('data-theme') === 'light' ? '☾' : '☀';

  /* ---- Navbar shrink + active link ---- */
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (!navbar) return;
    navbar.classList.toggle('shrink', window.scrollY > 40);
    updateProgress();
    updateBackToTop();
  });

  const current = document.body.dataset.page;
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.dataset.page === current) a.classList.add('active');
  });

  /* ---- Mobile menu ---- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  hamburger && hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => navLinks && navLinks.classList.remove('open')));

  /* ---- Scroll progress bar ---- */
  const progress = document.querySelector('.scroll-progress');
  function updateProgress(){
    if (!progress) return;
    const h = document.documentElement;
    const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progress.style.width = pct + '%';
  }

  /* ---- Back to top ---- */
  const backBtn = document.querySelector('.back-to-top');
  function updateBackToTop(){
    if (!backBtn) return;
    backBtn.classList.toggle('show', window.scrollY > 500);
  }
  backBtn && backBtn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

  /* ---- Custom cursor ---- */
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (dot && ring && matchMedia('(hover:hover)').matches) {
    let rx=0, ry=0, mx=0, my=0;
    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx+'px'; dot.style.top = my+'px';
    });
    (function loop(){
      rx += (mx-rx)*0.15; ry += (my-ry)*0.15;
      ring.style.left = rx+'px'; ring.style.top = ry+'px';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button, .skill-card, .project-card, .cert-card').forEach(el => {
      el.addEventListener('mouseenter', () => { ring.style.width='50px'; ring.style.height='50px'; ring.style.borderColor='var(--cyan)'; });
      el.addEventListener('mouseleave', () => { ring.style.width='34px'; ring.style.height='34px'; ring.style.borderColor='var(--border-strong)'; });
    });
  }

  /* ---- Ripple buttons ---- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e){
      const r = document.createElement('span');
      r.className = 'ripple';
      const rect = this.getBoundingClientRect();
      r.style.left = (e.clientX-rect.left)+'px';
      r.style.top = (e.clientY-rect.top)+'px';
      this.appendChild(r);
      setTimeout(()=>r.remove(), 650);
    });
  });

  /* ---- Reveal on scroll ---- */
  const revealEls = document.querySelectorAll('.reveal, .tl-item');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('in'); });
  }, {threshold:0.15});
  revealEls.forEach(el => io.observe(el));

  /* ---- Animated counters ---- */
  const counters = document.querySelectorAll('.counter-num[data-count]');
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const el = en.target;
        const target = +el.dataset.count;
        let cur = 0;
        const step = Math.max(1, Math.ceil(target/60));
        const t = setInterval(() => {
          cur += step;
          if (cur >= target){ cur = target; clearInterval(t); }
          el.textContent = cur + (el.dataset.suffix || '');
        }, 25);
        cio.unobserve(el);
      }
    });
  }, {threshold:0.4});
  counters.forEach(el => cio.observe(el));

  /* ---- Skill bars ---- */
  const bars = document.querySelectorAll('.skill-bar i[data-level]');
  const bio = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting){ en.target.style.width = en.target.dataset.level + '%'; bio.unobserve(en.target); }
    });
  }, {threshold:0.3});
  bars.forEach(b => bio.observe(b));

  /* ---- Skill tabs filter ---- */
  const skillTabs = document.querySelectorAll('.skill-tab');
  const skillCards = document.querySelectorAll('.skill-card');
  skillTabs.forEach(tab => tab.addEventListener('click', () => {
    skillTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const cat = tab.dataset.cat;
    skillCards.forEach(c => {
      c.style.display = (cat === 'all' || c.dataset.cat === cat) ? '' : 'none';
    });
  }));

  /* ---- Project filter ---- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  filterBtns.forEach(btn => btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.filter;
    projectCards.forEach(c => {
      c.style.display = (cat === 'all' || c.dataset.tags.includes(cat)) ? '' : 'none';
    });
  }));

  /* ---- Certificate lightbox ---- */
  const lightbox = document.querySelector('.lightbox');
  document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('click', () => {
      if (!lightbox) return;
      lightbox.querySelector('.lightbox-title').textContent = card.dataset.title || '';
      lightbox.classList.add('open');
    });
  });
  lightbox && lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.classList.remove('open'));
  lightbox && lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('open'); });

  /* ---- Testimonial carousel ---- */
  const track = document.querySelector('.testi-track');
  const dotsWrap = document.querySelector('.testi-dots');
  if (track) {
    const slides = track.children.length;
    let idx = 0;
    function go(i){
      idx = (i+slides)%slides;
      track.style.transform = `translateX(-${idx*100}%)`;
      dotsWrap && [...dotsWrap.children].forEach((d,j)=>d.classList.toggle('active', j===idx));
    }
    if (dotsWrap) {
      [...dotsWrap.children].forEach((d,j) => d.addEventListener('click', () => go(j)));
    }
    let auto = setInterval(()=>go(idx+1), 5000);
    track.parentElement.addEventListener('mouseenter', () => clearInterval(auto));
    track.parentElement.addEventListener('mouseleave', () => auto = setInterval(()=>go(idx+1), 5000));
    go(0);
  }

  /* ---- Typing effect (hero) ---- */
  const typeEl = document.querySelector('[data-typed]');
  if (typeEl) {
    const words = JSON.parse(typeEl.dataset.typed);
    let wi=0, ci=0, deleting=false;
    function tick(){
      const word = words[wi];
      ci += deleting ? -1 : 1;
      typeEl.textContent = word.slice(0, ci);
      let delay = deleting ? 40 : 80;
      if (!deleting && ci === word.length){ delay = 1400; deleting = true; }
      else if (deleting && ci === 0){ deleting = false; wi = (wi+1)%words.length; delay = 300; }
      setTimeout(tick, delay);
    }
    tick();
  }

  /* ---- Contact form (demo only, no backend) ---- */
  const form = document.querySelector('.contact-form');
  form && form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    const original = btn.textContent;
    btn.textContent = 'Message sent ✓';
    form.reset();
    setTimeout(()=> btn.textContent = original, 2400);
  });

  /* ---- Live clock in status bar ---- */
  const clockEl = document.querySelector('[data-clock]');
  if (clockEl) {
    function tickClock(){
      clockEl.textContent = new Date().toLocaleTimeString('en-GB', {hour:'2-digit', minute:'2-digit', second:'2-digit'});
    }
    tickClock(); setInterval(tickClock, 1000);
  }

  /* ---- Particles background ---- */
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];
    function resize(){ w = canvas.width = innerWidth; h = canvas.height = innerHeight; }
    resize(); window.addEventListener('resize', resize);
    const count = innerWidth < 700 ? 35 : 70;
    for (let i=0;i<count;i++){
      particles.push({x:Math.random()*w, y:Math.random()*h, vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.3, r:Math.random()*1.6+0.4});
    }
    function draw(){
      ctx.clearRect(0,0,w,h);
      ctx.fillStyle = 'rgba(34,211,238,0.55)';
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x<0||p.x>w) p.vx*=-1;
        if (p.y<0||p.y>h) p.vy*=-1;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      });
      for (let i=0;i<particles.length;i++){
        for (let j=i+1;j<particles.length;j++){
          const a=particles[i], b=particles[j];
          const d = Math.hypot(a.x-b.x, a.y-b.y);
          if (d < 110){
            ctx.strokeStyle = `rgba(37,99,235,${0.12*(1-d/110)})`;
            ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ---- Interactive terminal (home page) ---- */
  const term = document.querySelector('.terminal-body');
  const termInput = document.querySelector('.terminal-input-row input');
  if (term && termInput) {
    const responses = {
      help: 'Available commands: about, skills, projects, contact, resume, clear',
      about: 'Derick Otieno — BSc Computer Science student, web developer & IT support specialist based in Kenya.',
      skills: 'HTML · CSS · JavaScript · PHP · Python · Java · SQL · Git · Networking · Troubleshooting',
      projects: 'Quicker, Notes Sharing Platform, Family Portfolio, Personal Portfolio — see /projects.html',
      contact: 'Email: derick.otieno@example.com — see /contact.html for the full form',
      resume: 'Opening downloadable CV... (see /experience.html)'
    };
    function printLine(html){
      const div = document.createElement('div');
      div.className = 'line';
      div.innerHTML = html;
      term.appendChild(div);
      term.scrollTop = term.scrollHeight;
    }
    termInput.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      const val = termInput.value.trim();
      printLine(`<span class="prompt">derick@portfolio</span><span class="path">:~$</span> ${val}`);
      if (val === 'clear') { term.innerHTML=''; }
      else if (responses[val]) printLine(responses[val]);
      else if (val) printLine(`command not found: ${val} — type "help"`);
      termInput.value = '';
    });
  }

  /* ---- Konami code easter egg ---- */
  const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let pos = 0;
  window.addEventListener('keydown', (e) => {
    pos = (e.key === seq[pos]) ? pos+1 : 0;
    if (pos === seq.length){ pos = 0; launchConfetti(); }
  });
  function launchConfetti(){
    const colors = ['#2563eb','#22d3ee','#34d399','#f4f4f5'];
    for (let i=0;i<120;i++){
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      p.style.left = Math.random()*100+'vw';
      p.style.width = p.style.height = (4+Math.random()*6)+'px';
      p.style.background = colors[Math.floor(Math.random()*colors.length)];
      p.style.transition = `transform ${2+Math.random()*2}s ease-out, opacity ${2+Math.random()*2}s ease-out`;
      document.body.appendChild(p);
      requestAnimationFrame(()=>{
        p.style.transform = `translateY(${innerHeight+50}px) rotate(${Math.random()*720}deg)`;
        p.style.opacity = '0';
      });
      setTimeout(()=>p.remove(), 4200);
    }
  }

  /* ---- Confetti on Download CV ---- */
  document.querySelectorAll('[data-confetti]').forEach(btn => btn.addEventListener('click', launchConfetti));

});
