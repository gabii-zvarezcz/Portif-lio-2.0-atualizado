  // ══ CANVAS: LINHAS FLUTUANTES ══
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  // Cores do site
  const COLORS = ['#ff2d78', '#3a7bd5', '#9b27af'];

  // Cada "risco" é uma linha com posição, velocidade e ângulo
  const TOTAL = 100;
  const lines = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Cria todas as linhas com valores aleatórios
  for (let i = 0; i < TOTAL; i++) {
    lines.push({
      x:      Math.random() * window.innerWidth,
      y:      Math.random() * window.innerHeight,
      len:    25 + Math.random() * 80,        // comprimento entre 40 e 120px
      angle:  Math.random() * Math.PI * 2,    // ângulo em radianos (direção)
      speed:  0.25 + Math.random() * 0.35,    // velocidade de movimento
      spin:   (Math.random() - 0.5) * 0.008,  // rotação lenta
      color:  COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha:  0.30 + Math.random() * 0.12,    // transparência (bem suave)
      width:  0.8 + Math.random() * 1.2,      // espessura
    });
  }

  function drawLines() {
    // Limpa o frame anterior
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    lines.forEach(l => {
      // Calcula as pontas da linha a partir do centro (x, y)
      const dx = Math.cos(l.angle) * l.len / 2;
      const dy = Math.sin(l.angle) * l.len / 2;

      ctx.beginPath();
      ctx.moveTo(l.x - dx, l.y - dy);
      ctx.lineTo(l.x + dx, l.y + dy);
      ctx.strokeStyle = l.color;
      ctx.globalAlpha = l.alpha;
      ctx.lineWidth   = l.width;
      ctx.lineCap     = 'round';
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Move a linha na direção do ângulo
      l.x += Math.cos(l.angle) * l.speed;
      l.y += Math.sin(l.angle) * l.speed;

      // Gira levemente
      l.angle += l.spin;

      // Se saiu da tela, reposiciona do lado oposto (efeito infinito)
      if (l.x < -150) l.x = canvas.width  + 150;
      if (l.x > canvas.width  + 150) l.x = -150;
      if (l.y < -150) l.y = canvas.height + 150;
      if (l.y > canvas.height + 150) l.y = -150;
    });

    requestAnimationFrame(drawLines);
  }
  drawLines();

  // Fade-up on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // Active nav link highlight
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';

  // Caso especial: se chegou perto do fim da página, ativa o último item
  const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 80;
  if (nearBottom) {
    current = sections[sections.length - 1].id;
  } else {
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
  }

  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--pink)' : '';
  });
});