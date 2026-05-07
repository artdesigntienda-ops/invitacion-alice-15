/* 
    Alice 15 Años - Script de Gala (Handwriting Logic)
    Senior Front-end Expert — Partículas interactivas mejoradas
*/

document.addEventListener('DOMContentLoaded', () => {
    const envelope = document.getElementById('envelope');
    const initialScene = document.getElementById('initial-scene');
    const cardContainer = document.getElementById('card-container');
    const music = document.getElementById('background-music');

    const videoIntro = document.getElementById('video-intro');
    const videoCard = document.getElementById('video-card');

    if (videoIntro) videoIntro.playbackRate = 0.6;

    const instruction = document.getElementById('vid-instruction');
    const wrapper = document.getElementById('envelope-wrapper');

    wrapper.addEventListener('click', () => {
        music.play().catch(e => console.log("Audio play blocked", e));
        if (videoIntro) videoIntro.play();
        if (instruction) {
            instruction.style.opacity = '0';
            setTimeout(() => { instruction.style.display = 'none'; }, 800);
        }
        wrapper.style.pointerEvents = 'none';
    });

    if (videoIntro) {
        videoIntro.addEventListener('ended', () => {
            initialScene.style.opacity = '0';
            setTimeout(() => {
                initialScene.style.display = 'none';
                cardContainer.style.display = 'block';
                videoIntro.style.opacity = '0';
                videoCard.style.opacity = '1';
                setTimeout(() => {
                    cardContainer.classList.add('visible');
                    startHandwritingEffect();
                }, 100);
            }, 1000);
        });
    }

    // --- EFECTO MANUSCRITO (POR PALABRAS) ---
    async function startHandwritingEffect() {
        const elements = document.querySelectorAll('.anim-text');
        const textData = Array.from(elements).map(el => {
            const text = el.innerText;
            el.innerText = '';
            el.style.opacity = '1';
            return { el, text };
        });

        for (const item of textData) {
            // Dividir por palabras preservando espacios
            const words = item.text.split(/(\s+)/); 
            const spans = [];
            
            words.forEach(word => {
                if (word.length === 0) return;
                const span = document.createElement('span');
                span.className = 'hw-word';
                span.innerText = word;
                item.el.appendChild(span);
                spans.push(span);
            });

            for (let i = 0; i < spans.length; i++) {
                spans[i].classList.add('visible');
                // Velocidad ajustada para palabras (un poco más lento que caracteres)
                await new Promise(r => setTimeout(r, 120)); 
            }
            await new Promise(r => setTimeout(r, 400));
        }

        setTimeout(() => {
            document.getElementById('interactive-footer').classList.add('show');
            initCountdown();
        }, 300);
    }

    // =============================================
    //  SISTEMA DE PARTÍCULAS INTERACTIVO MEJORADO
    // =============================================
    const canvas = document.getElementById('sparkles-canvas');
    const ctx = canvas.getContext('2d');

    let particles = [];
    let burstParticles = [];   // partículas de explosión al click

    const mouse = { x: null, y: null, clicking: false };

    // --- Seguimiento del mouse ---
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // --- Toque en móvil ---
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
    }, { passive: false });

    // --- Click / Tap: explosión de partículas doradas ---
    function spawnBurst(x, y) {
        const count = 28;
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i + Math.random() * 0.3;
            const speed = Math.random() * 6 + 2;
            burstParticles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                decay: Math.random() * 0.025 + 0.015,
                size: Math.random() * 3 + 1.5,
                color: Math.random() > 0.5
                    ? `hsl(${47 + Math.random() * 15}, 100%, ${60 + Math.random() * 20}%)`
                    : `rgba(255,255,255,${Math.random() * 0.6 + 0.4})`,
                glow: Math.random() > 0.5,
            });
        }
    }

    canvas.addEventListener('click', (e) => {
        spawnBurst(e.clientX, e.clientY);
    });

    canvas.addEventListener('touchstart', (e) => {
        spawnBurst(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    // --- Resize ---
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
    resizeCanvas();

    // -----------------------------------------------
    //  Clase Partícula de lluvia (polvo brillante)
    // -----------------------------------------------
    class Particle {
        constructor(randomY = true) {
            this.reset(randomY);
        }

        reset(randomY = false) {
            this.x = Math.random() * canvas.width;
            this.y = randomY ? Math.random() * canvas.height : -10 - Math.random() * 20;

            this.baseSize = Math.random() * 2 + 0.5;
            this.size = this.baseSize;

            // velocidad de caída lenta
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.speedY = Math.random() * 0.6 + 0.2;

            // Colores: blanco, dorado, o champagne
            const palette = [
                `rgba(255,255,255,${Math.random() * 0.5 + 0.3})`,
                `rgba(212,175,55,${Math.random() * 0.5 + 0.3})`,
                `rgba(245,217,122,${Math.random() * 0.4 + 0.2})`,
                `rgba(255,240,180,${Math.random() * 0.4 + 0.2})`,
            ];
            this.color = palette[Math.floor(Math.random() * palette.length)];

            // parpadeo
            this.twinkleSpeed = Math.random() * 0.04 + 0.01;
            this.twinkleOffset = Math.random() * Math.PI * 2;

            // estrellita o círculo
            this.isStar = Math.random() > 0.65;

            // repulsión
            this.vx = 0;
            this.vy = 0;
        }

        update(frame) {
            // Parpadeo
            const twinkle = 0.5 + 0.5 * Math.sin(frame * this.twinkleSpeed + this.twinkleOffset);
            this.currentAlpha = twinkle;
            this.size = this.baseSize * (0.7 + 0.5 * twinkle);

            // Movimiento base
            this.x += this.speedX + this.vx;
            this.y += this.speedY + this.vy;

            // Repulsión suave del mouse
            if (mouse.x !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const radius = 90;

                if (dist < radius) {
                    const force = (1 - dist / radius) * 2.5;
                    const angle = Math.atan2(dy, dx);
                    this.vx += Math.cos(angle) * force * 0.15;
                    this.vy += Math.sin(angle) * force * 0.15;

                    // Agrandar al acercarse al cursor
                    this.size = this.baseSize * (1.5 + (1 - dist / radius) * 2);
                }
            }

            // Amortiguación de velocidad extra
            this.vx *= 0.92;
            this.vy *= 0.92;

            // Reciclar al salir de pantalla
            if (this.y > canvas.height + 10) this.reset(false);
            if (this.x > canvas.width + 10) this.x = -5;
            if (this.x < -10) this.x = canvas.width + 5;
        }

        draw(frame) {
            const alpha = this.currentAlpha ?? 1;
            ctx.save();
            ctx.globalAlpha = alpha;

            // Glow
            ctx.shadowBlur = this.size * 4;
            ctx.shadowColor = this.isStar ? 'rgba(212,175,55,0.9)' : 'rgba(255,255,255,0.8)';

            if (this.isStar) {
                drawStar(ctx, this.x, this.y, this.size, this.color);
            } else {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }
    }

    // Dibuja una pequeña estrella de 4 puntas
    function drawStar(ctx, x, y, size, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const outerX = x + Math.cos(angle) * size * 1.8;
            const outerY = y + Math.sin(angle) * size * 1.8;
            const innerAngle = angle + Math.PI / 4;
            const innerX = x + Math.cos(innerAngle) * size * 0.5;
            const innerY = y + Math.sin(innerAngle) * size * 0.5;
            if (i === 0) ctx.moveTo(outerX, outerY);
            else ctx.lineTo(outerX, outerY);
            ctx.lineTo(innerX, innerY);
        }
        ctx.closePath();
        ctx.fill();
    }

    function initParticles() {
        particles = [];
        const count = Math.min(200, Math.floor((canvas.width * canvas.height) / 6000));
        for (let i = 0; i < count; i++) {
            particles.push(new Particle(true));
        }
    }

    let frame = 0;
    function animateParticles() {
        frame++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Partículas de lluvia
        for (const p of particles) {
            p.update(frame);
            p.draw(frame);
        }

        // Partículas de explosión (burst)
        for (let i = burstParticles.length - 1; i >= 0; i--) {
            const b = burstParticles[i];
            b.x += b.vx;
            b.y += b.vy;
            b.vy += 0.12; // gravedad leve
            b.vx *= 0.97;
            b.life -= b.decay;

            if (b.life <= 0) {
                burstParticles.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.globalAlpha = b.life;
            ctx.shadowBlur = b.glow ? 14 : 4;
            ctx.shadowColor = b.glow ? 'rgba(212,175,55,1)' : 'rgba(255,255,255,0.9)';
            ctx.fillStyle = b.color;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.size * b.life, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // --- CUENTA REGRESIVA ---
    function initCountdown() {
        const targetDate = new Date("June 5, 2026 19:00:00").getTime();
        const countdownEl = document.getElementById('countdown');
        if (!countdownEl) return;

        const update = () => {
            const now = new Date().getTime();
            const diff = targetDate - now;
            if (diff < 0) {
                countdownEl.innerHTML = "¡Es el gran día!";
                return;
            }
            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);
            countdownEl.innerHTML = `${d}d ${h}h ${m}m ${s}s para sus 15`;
        };

        update();
        setInterval(update, 1000);
    }
});