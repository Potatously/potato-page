// Gestión del tema
const themeToggle = document.getElementById('theme-toggle');
const logoImage = document.getElementById('logo-image');
if (logoImage) {
    logoImage.classList.add('animate-in');
    logoImage.addEventListener('animationend', (e) => {
        if (!logoImage) return;
        if (e.animationName === 'fadeInUp') {
            logoImage.classList.remove('animate-in');
        } else if (e.animationName === 'shake') {
            logoImage.classList.remove('shake');
        }
    });
}

const socialIcon = document.querySelector('.social-icon');
if (socialIcon) {
    // Código que dependa de socialIcon (si lo hay aquí)
}

const themeIcon = document.getElementById('theme-icon');

// Inicialización del tema
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const validThemes = ['dark-mode', 'light-mode'];
    const theme = validThemes.includes(savedTheme) ? savedTheme : 'dark-mode';
    
    document.documentElement.classList.add(theme);
    updateTheme(theme);
}

// Consola Potato logo
console.log(`
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%#####%@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%+-       -+%@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*             *@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@=               *@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@+                 %@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@#                  *@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@%                   *@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@-                   *@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@#-                    %@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@*-                     -@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@%*=                        =@@@@@@@@@@@@
@@@@@@@@@@@@@@%*-                           *@@@@@@@@@@@@
@@@@@@@@@@@@#=                              #@@@@@@@@@@@@
@@@@@@@@@@@=                                @@@@@@@@@@@@@
@@@@@@@@@%-                                -@@@@@@@@@@@@@
@@@@@@@@@-                                 +@@@@@@@@@@@@@
@@@@@@@@#                                  %@@@@@@@@@@@@@
@@@@@@@@+                                 =@@@@@@@@@@@@@@
@@@@@@@@*                                 %@@@@@@@@@@@@@@
@@@@@@@@@-                               #@@@@@@@@@@@@@@@
@@@@@@@@@%-                             #@@@@@@@@@@@@@@@@
@@@@@@@@@@@=                          =%@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@%+                      =#@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@#*=-             -=*%@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@%%###**###%@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
`);


// Consola Potato título
console.log(`
  ██████╗  ██████╗ ████████╗ █████╗ ████████╗ ██████╗    | Busco una
  ██╔══██╗██╔═══██╗╚══██╔══╝██╔══██╗╚══██╔══╝██╔═══██╗   | Pelinegra
  ██████╔╝██║   ██║   ██║   ███████║   ██║   ██║   ██║   | Y
  ██╔═══╝ ██║   ██║   ██║   ██╔══██║   ██║   ██║   ██║   | Que
  ██║     ╚██████╔╝   ██║   ██║  ██║   ██║   ╚██████╔╝   | No
  ╚═╝      ╚═════╝    ╚═╝   ╚═╝  ╚═╝   ╚═╝    ╚═════╝    | Mienta
`)

// Función unificada de actualización de tema
function updateTheme(theme) {
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');  
    if (themeColorMeta) {  
        themeColorMeta.setAttribute('content', theme === 'light-mode' ? '#ffffff' : '#0a0a0b');  
    }

    themeIcon.src = theme === 'dark-mode' ? './images/luna.png' : './images/sol.png';
    if (logoImage) {
        logoImage.src = theme === 'light-mode' ? './images/papa-negra.png' : './images/papa-blanca.png';
    }
    if (socialIcon) {
        socialIcon.src = theme === 'light-mode' ? './images/linktree-black-icon.svg' : './images/linktree-white-icon.svg';
    }
    updateParticlesColor(theme);
}

themeToggle.addEventListener('click', () => {
    const root = document.documentElement;
    const newTheme = root.classList.contains('light-mode') ? 'dark-mode' : 'light-mode';
    root.classList.remove('light-mode', 'dark-mode');
    root.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
    updateTheme(newTheme);
});

// Gestión de animaciones del logo
if (logoImage) {
    logoImage.classList.add('animate-in');
    logoImage.addEventListener('animationend', (e) => {
        if (e.animationName === 'fadeInUp') {
            logoImage.classList.remove('animate-in');
        } else if (e.animationName === 'shake') {
            logoImage.classList.remove('shake');
        }
    });
}

// Easter Eggs
const eastereggOverlay = document.getElementById('eastereggOverlay');
const secondEastereggOverlay = document.getElementById('secondEastereggOverlay');
const homeroVideo = document.getElementById('homeroVideo');
const secondVideo = document.getElementById('secondVideo');
const discoBall = document.getElementById('discoBall');

let state = {
    pPressCount: 0,
    gPressCount: 0,
    clickCount: 0,
    isEastereggActive: false,
    isSecondEastereggActive: false,
    isGAudioPlaying: false,
    gAudioCooldown: false,
    MAX_COUNTER: 10
};

let timers = {
    pPress: null,
    gPress: null,
    click: null
};

let userInteracted = false;
document.addEventListener('click', () => {
    userInteracted = true;
});

// Manejador de Easter Egg "P"
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key.toLowerCase() === 'p' && canActivateEasterEgg()) {
        handleKeyPress('p');
    } else if (e.key.toLowerCase() === 'g' && !state.isGAudioPlaying && !state.gAudioCooldown && canActivateEasterEgg()) {
        handleKeyPress('g');
    }
});

function handleKeyPress(key) {
    const isP = key === 'p';
    const countProperty = isP ? 'pPressCount' : 'gPressCount';
    const timerProperty = isP ? 'pPress' : 'gPress';
    const requiredCount = isP ? 5 : 4;
    const timeout = isP ? 5000 : 4000;

    state[countProperty]++;

    state[countProperty] = Math.min(state[countProperty], state.MAX_COUNTER);
    if (state[countProperty] === 1) {
        clearTimeout(timers[timerProperty]);
        timers[timerProperty] = setTimeout(() => state[countProperty] = 0, timeout);
    } else if (state[countProperty] === requiredCount) {
        clearTimeout(timers[timerProperty]);
        state[countProperty] = 0;
        isP ? activateEasteregg() : activateGAudio();
    }
}

function canActivateEasterEgg() {
    return !state.isEastereggActive && !state.isSecondEastereggActive && !state.isGAudioPlaying;
}

// Easter Egg Homero
function activateEasteregg() {
    homeroVideo.currentTime = 0;
    state.isEastereggActive = true;
    eastereggOverlay.style.display = 'flex';
    homeroVideo.pause(); // Pausar inicialmente el video

    // 1. Reproducir solo el audio primero
    playAudio('./audio/puertazo.mp3').then(() => {
        // 2. Iniciar animación de la bola disco junto al audio
        requestAnimationFrame(() => {
            discoBall.style.animation = 'dropDiscoBall 1s forwards';
            
            // 3. Iniciar video después de 0.8s (cuando la bola está cerca de terminar su caída)
            setTimeout(() => {
                homeroVideo.style.animation = 'fadeIn 2s forwards';
                homeroVideo.play().catch(err => console.error(err)); // Iniciar video con el fadeIn
            }, 800); 
        });
    });
}

// Easter Egg Logo Patata
if (logoImage) {
    logoImage.addEventListener('click', () => {
        if (canActivateEasterEgg()) {
            logoImage.classList.remove('shake');
            void logoImage.offsetWidth; // Forzar reflow para reiniciar la animación
            logoImage.classList.add('shake');

            // Lógica del contador de clics
            state.clickCount++;
            if (state.clickCount === 1) {
                clearTimeout(timers.click);
                timers.click = setTimeout(() => state.clickCount = 0, 1000);
            } else if (state.clickCount >= 8) {
                clearTimeout(timers.click);
                state.clickCount = 0;
                activateSecondEasteregg();
            }
        }
    });
}

function activateSecondEasteregg() {
    state.isSecondEastereggActive = true;
    secondEastereggOverlay.style.display = 'flex';
    secondVideo.muted = false;
    secondVideo.currentTime = 0;
    requestAnimationFrame(() => {
        secondVideo.style.animation = 'fadeIn 2s forwards';
        playVideo(secondVideo);
    });
}

// Utilidades para media
async function playAudio(src) {
    if (!userInteracted) return; // No reproducir sin interacción
    try {  
      const audio = new Audio(src);  
      audio.addEventListener('error', (e) => {  
        console.error('Error al cargar el audio:', e.target.error);  
      });  
      await audio.play();  
    } catch (err) {  
      console.error('Error al reproducir el audio:', err);  
    }  
  }  
  
  async function playVideo(video) {
    if (!userInteracted) return; // No reproducir sin interacción
    try {  
      video.addEventListener('error', (e) => {  
        console.error('Error al cargar el video:', e.target.error);  
      });  
      await video.play();  
    } catch (err) {  
      console.error('Error al reproducir el video:', err);  
    }  
  }

// Manejadores de cierre
document.getElementById('closeButton').addEventListener('click', () => {
    state.isEastereggActive = false;
    eastereggOverlay.style.display = 'none';
    discoBall.style.animation = '';
    homeroVideo.style.animation = '';
    homeroVideo.pause();
    homeroVideo.muted = false;
    homeroVideo.currentTime = 0;
});

document.getElementById('closeSecondButton').addEventListener('click', () => {
    state.isSecondEastereggActive = false;
    secondEastereggOverlay.style.display = 'none';
    secondVideo.style.animation = '';
    secondVideo.pause();
    secondVideo.currentTime = 0;
});

// Audio Easter Egg
function activateGAudio() {
    state.isGAudioPlaying = true;
    playAudio('./audio/pichon.mp3').then(() => {
        setTimeout(() => {
            state.isGAudioPlaying = false;
            state.gAudioCooldown = true;
            setTimeout(() => state.gAudioCooldown = false, 2000);
        }, 2000);
    });
}

// Destruir partículas al cambiar de página
function destroyParticles() {
    if (window.pJSDom && Array.isArray(window.pJSDom)) {
        window.pJSDom.forEach((pJSInstance, index) => {
            if (pJSInstance.pJS && typeof pJSInstance.pJS.fn.vendors.destroy === 'function') {
                pJSInstance.pJS.fn.vendors.destroy(); // Limpia canvas y listeners
                window.pJSDom[index] = null;
            }
        });
        window.pJSDom = []; // Resetear el array global
    }
}

// Función mejorada de inicialización de partículas
function initializeParticles() {
    destroyParticles();
    const isMobile = window.innerWidth <= 768 || window.devicePixelRatio >= 2; // Considera alta densidad
    
    particlesJS('particles-js', {
        particles: {
            number: { 
                value: isMobile ? 60 : 120, 
                density: { 
                    enable: true,
                    value_area: isMobile ? 400 : 800 
                } 
            },
            color: { 
                value: document.documentElement.classList.contains('light-mode') ? '#000000' : '#ffffff' 
            },
            shape: { type: 'circle' },
            opacity: { 
                value: isMobile ? 0.6 : 0.8, 
                random: false 
            },
            size: { 
                value: isMobile ? 1.5 : 2, 
                random: true 
            },
            line_linked: {
                enable: true,
                distance: isMobile ? 150 : 120,
                color: document.documentElement.classList.contains('light-mode') ? '#000000' : '#ffffff',
                opacity: isMobile ? 0.3 : 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: isMobile ? 1.2 : 1.8,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out'
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: { enable: false },
                onclick: { enable: false },
                resize: true
            }
        },
        retina_detect: true
    });
}

function updateParticlesColor(theme) {
    // ===== Validaciones actualizadas =====
    if (!window.pJSDom || window.pJSDom.length === 0) return;
    if (!window.pJSDom[0]?.pJS?.particles?.array) return;

    const color = theme === 'light-mode' ? '#000000' : '#ffffff';
    const rgb = theme === 'light-mode' ? { r: 0, g: 0, b: 0 } : { r: 255, g: 255, b: 255 };
    const pJS = window.pJSDom[0].pJS; // <--- Acceso directo y seguro

    // Actualizar partículas
    pJS.particles.array.forEach(particle => {
        if (particle?.color) {
            particle.color.value = color;
            particle.color.rgb = rgb;
        }
    });

    // Actualizar líneas conectadas
    if (pJS.particles.line_linked) {
        pJS.particles.line_linked.color = color;
        pJS.particles.line_linked.color_rgb_line = rgb;
    }

    // Forzar actualización visual
    if (typeof pJS.fn.particlesRefresh === 'function') {
        pJS.fn.particlesRefresh();
    }
}

// Debounce para resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        initializeParticles();
    }, 150); // Esperar después del último evento resize
});

// Initialize theme and particles in correct order
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeParticles();
});

// Prevenir selección de texto
document.addEventListener('selectstart', (e) => e.preventDefault());

// Modificar el event listener existente
window.addEventListener("load", () => {
    // Esperar 1 frame más para asegurar la renderización
    requestAnimationFrame(() => {
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'auto';
        document.body.style.height = 'auto';
    });
});