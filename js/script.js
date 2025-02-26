// Gestión del tema
const themeToggle = document.getElementById('theme-toggle');
const logoImage = document.getElementById('logo-image');
if (logoImage) {
    logoImage.classList.add('animate-in');
    logoImage.addEventListener('animationend', (e) => {
        logoImage.classList.remove(e.animationName === 'fadeInUp' ? 'animate-in' : 'shake');  // <-- Limpiar cualquier animación
    });
}

const socialIcons = document.querySelectorAll('.social-links .social-icon'); // Plural + querySelectorAll

const themeIcon = document.getElementById('theme-icon');

// Inicialización del tema
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const validThemes = ['light-mode', 'dark-mode'];
    const theme = validThemes.includes(savedTheme) ? savedTheme : 'dark-mode'; // <-- Tema predeterminado explícito
    
    document.documentElement.classList.remove(...validThemes);
    document.documentElement.classList.add(theme);
    themeIcon.src = theme === 'dark-mode' ? './images/luna.png' : './images/sol.png';

    if (socialIcons && socialIcons.length > 0) { // <-- Verificación explícita
        socialIcons.forEach(icon => {
            icon.src = theme === 'light-mode' 
                ? './images/linktree-black-icon.svg' 
                : './images/linktree-white-icon.svg';
        });
    }

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

// Función updateTheme
function updateTheme(theme) {
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');  
    if (themeColorMeta) {  
        themeColorMeta.setAttribute('content', theme === 'light-mode' ? '#ffffff' : '#0a0a0b');  
    }

    if (logoImage) {
        logoImage.src = theme === 'light-mode' ? './images/papa-negra.png' : './images/papa-blanca.png';
    }

    if (socialIcons.length > 0) {
        socialIcons.forEach(icon => {
            icon.src = theme === 'light-mode' 
                ? './images/linktree-black-icon.svg' 
                : './images/linktree-white-icon.svg';
        });
    }
    
    updateParticlesColor(theme);
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const root = document.documentElement;
        const newTheme = root.classList.contains('light-mode') ? 'dark-mode' : 'light-mode';
        root.classList.remove('light-mode', 'dark-mode');
        root.classList.add(newTheme);
        localStorage.setItem('theme', newTheme);
        updateTheme(newTheme);
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
    gAudioTimer1: null,
    gAudioTimer2: null,
    MAX_COUNTER: 10
};

let timers = {
    pPress: null,
    gPress: null,
    click: null
};

let userInteracted = false;

// Función handleAudioError
function handleAudioError(e) {
    const error = e.target.error;
    console.error('Error de audio:', {
        code: error.code,
        message: error.message,
        tipo: error instanceof MediaError ? 'MediaError' : 'Error general'
    });
}

document.addEventListener('click', () => {
    if (!userInteracted) userInteracted = true;
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
    if (!homeroVideo) return;
    homeroVideo.currentTime = 0;
    state.isEastereggActive = true;
    eastereggOverlay.style.display = 'flex';
    homeroVideo.pause(); // Pausar inicialmente el video

    // 1. Reproducir solo el audio primero
    playAudio('./audio/puertazo.mp3').then(() => {
        // 2. Iniciar animación de la bola disco junto al audio
        requestAnimationFrame(() => {
            if (discoBall) {
                discoBall.style.animation = 'dropDiscoBall 1s forwards';
            }            
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
            setTimeout(() => { // <-- Retraso añadido
                logoImage.classList.add('shake');
            }, 10);

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
    if (!src || !src.startsWith('./audio/')) {
        throw new Error('Ruta de audio inválida');
    }
    if (!userInteracted) {
        console.warn('Reproducción bloqueada: el usuario no ha interactuado');
        return;
    }
    try {
        const audio = new Audio(src); // <-- Usar el parámetro "src"
        audio.preload = 'auto';
        audio.addEventListener('error', handleAudioError);
        await audio.play(); // <-- Reproducir el audio correctamente
    } catch (err) {
        console.error('Error al activar Easter egg:', err);
        state.isEastereggActive = false;
        eastereggOverlay.style.display = 'none';
        throw err; // <-- Propagar el error para manejo externo
    }
}
  
  async function playVideo(video) {
    if (!video) {
        console.error('Elemento video no encontrado');
        return;
    }
    if (!userInteracted) {
        console.warn('Reproducción bloqueada: el usuario no ha interactuado');
        return;
    }
    try {
        video.muted = true;  // <-- Forzar muted inicial para autoplay
        await video.play();
        video.muted = false;
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}

// Manejadores de cierre
const closeButton = document.getElementById('closeButton'); // 🠖 Guardar en variable
const closeSecondButton = document.getElementById('closeSecondButton'); // 🠖 Guardar en variable

// Validar closeButton
if (closeButton) { // 🠖 Solo si el elemento existe
    closeButton.addEventListener('click', () => {
        discoBall.style.removeProperty('animation');
        discoBall.style.top = '-100px'; // Resetear posición inicial
        state.isEastereggActive = false;
        eastereggOverlay.style.display = 'none';
        discoBall.style.animation = '';
        homeroVideo.style.animation = '';
        homeroVideo.pause();
        homeroVideo.muted = false;
        homeroVideo.currentTime = 0;
        if (state.gAudioTimer1) clearTimeout(state.gAudioTimer1);
        if (state.gAudioTimer2) clearTimeout(state.gAudioTimer2);
    });
}

// Validar closeSecondButton
if (closeSecondButton) { // 🠖 Solo si el elemento existe
    closeSecondButton.addEventListener('click', () => {
        state.isSecondEastereggActive = false;
        secondEastereggOverlay.style.display = 'none';
        secondVideo.style.animation = '';
        secondVideo.pause();
        secondVideo.currentTime = 0;
    });
}

// Audio Easter Egg
function activateGAudio() {
    // Limpiar temporizadores previos (si existen)
    if (state.gAudioTimer1) clearTimeout(state.gAudioTimer1);
    if (state.gAudioTimer2) clearTimeout(state.gAudioTimer2);

    state.isGAudioPlaying = true;
    playAudio('./audio/pichon.mp3').then(() => {
        
        // Primer temporizador: desactiva isGAudioPlaying después de 2 segundos
        state.gAudioTimer1 = setTimeout(() => {
            state.isGAudioPlaying = false;
            state.gAudioCooldown = true;

            // Segundo temporizador: desactiva gAudioCooldown después de otros 2 segundos
            state.gAudioTimer2 = setTimeout(() => {
                state.gAudioCooldown = false;
            }, 2000);
        }, 2000);

    // Limpiar temporizadores
    }).catch((err) => {
        console.error('Error en audio "G":', err);
        clearTimeout(state.gAudioTimer1); // <-- Limpiar temporizadores
        clearTimeout(state.gAudioTimer2);
        state.isGAudioPlaying = false;
        state.gAudioCooldown = false;
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
    if (!window.particlesJS) {
        console.error("Error crítico: particles.min.js no se cargó correctamente.");
        return;
    }
    console.log('particlesJS disponible?', !!window.particlesJS); // Debug
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
    // Validaciones
    if (!window.pJSDom || 
        !Array.isArray(window.pJSDom) || 
        window.pJSDom.length === 0 || 
        !window.pJSDom[0]?.pJS || 
        !window.pJSDom[0].pJS.particles?.array
    ) {
        return; // <-- Salir si no hay partículas inicializadas
    }

    const pJS = window.pJSDom[0].pJS;
    if (
        !pJS.particles.line_linked ||  // <-- Verificar si "line_linked" existe
        !pJS.fn?.particlesRefresh       // <-- Verificar si la función de actualización existe
    ) {
        return; // Salir si falta alguna propiedad crítica
    }

    const color = theme === 'light-mode' ? '#000000' : '#ffffff';
    const rgb = theme === 'light-mode' ? { r: 0, g: 0, b: 0 } : { r: 255, g: 255, b: 255 };

    // Actualizar partículas
    pJS.particles.array.forEach(particle => {
        if (particle?.color) {
            particle.color.value = color;
            particle.color.rgb = rgb;
        }
    });

    // Actualizar líneas conectadas
    if (pJS.particles.line_linked) {  // <-- Validación
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

    // Simular interacción "fantasma" solo si no hay una real
    const simulateInteraction = () => {
        if (!userInteracted) {
            document.documentElement.dispatchEvent(new Event('click', { bubbles: true }));
            userInteracted = true;
        }
    };

    // Intentar activar en eventos pasivos
    document.addEventListener('mousemove', simulateInteraction, { once: true });
    document.addEventListener('keydown', simulateInteraction, { once: true });
    document.addEventListener('touchstart', simulateInteraction, { once: true });
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