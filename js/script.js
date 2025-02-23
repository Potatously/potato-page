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
const themeIcon = document.getElementById('theme-icon');

// Inicialización del tema
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark-mode';
    document.documentElement.classList.add(savedTheme);
    updateTheme(savedTheme);
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
    themeIcon.src = theme === 'dark-mode' ? './images/luna.png' : './images/sol.png';
    logoImage.src = theme === 'light-mode' ? './images/papa-negra.png' : './images/papa-blanca.png';
    socialIcon.src = theme === 'light-mode' ? './images/linktree-black-icon.svg' : './images/linktree-white-icon.svg';
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
logoImage.classList.add('animate-in');
logoImage.addEventListener('animationend', (e) => {
    if (e.animationName === 'fadeInUp') {
        logoImage.classList.remove('animate-in');
    } else if (e.animationName === 'shake') {
        logoImage.classList.remove('shake');
    }
});

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
    gAudioCooldown: false
};

let timers = {
    pPress: null,
    gPress: null,
    click: null
};

// Manejador de Easter Egg "P"
document.addEventListener('keydown', (e) => {
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

// Easter Egg Principal
function activateEasteregg() {
    state.isEastereggActive = true;
    eastereggOverlay.style.display = 'flex';
    
    playAudio('./audio/puertazo.mp3').then(() => {
        requestAnimationFrame(() => {
            discoBall.style.animation = 'dropDiscoBall 1s forwards';
            setTimeout(() => {
                homeroVideo.style.animation = 'fadeIn 2s forwards';
                playVideo(homeroVideo);
            }, 1000);
        });
    });
}

// Easter Egg Secundario (Logo)
logoImage.addEventListener('click', () => {
    if (canActivateEasterEgg()) {
        logoImage.classList.remove('shake');
        void logoImage.offsetWidth;
        logoImage.classList.add('shake');
        
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

function activateSecondEasteregg() {
    state.isSecondEastereggActive = true;
    secondEastereggOverlay.style.display = 'flex';
    requestAnimationFrame(() => {
        secondVideo.style.animation = 'fadeIn 2s forwards';
        playVideo(secondVideo);
    });
}

// Utilidades para media
async function playAudio(src) {
    try {
        const audio = new Audio(src);
        await audio.play();
        return true;
    } catch (err) {
        console.error('Error playing audio:', err);
        return false;
    }
}

async function playVideo(video) {
    if (!video) return false;
    try {
        video.currentTime = 0;
        video.muted = false;
        await video.play();
        return true;
    } catch (err) {
        console.error('Error playing video:', err);
        return false;
    }
}

// Manejadores de cierre
document.getElementById('closeButton').addEventListener('click', () => {
    state.isEastereggActive = false;
    eastereggOverlay.style.display = 'none';
    discoBall.style.animation = '';
    homeroVideo.style.animation = '';
    homeroVideo.pause();
    homeroVideo.muted = true;
});

document.getElementById('closeSecondButton').addEventListener('click', () => {
    state.isSecondEastereggActive = false;
    secondEastereggOverlay.style.display = 'none';
    secondVideo.style.animation = '';
    secondVideo.pause();
    secondVideo.muted = true;
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

// Función mejorada de inicialización de partículas
function initializeParticles() {
    const isMobile = window.innerWidth <= 768;
    
    particlesJS('particles-js', {
        particles: {
            number: { 
                value: isMobile ? 50 : 120, 
                density: { 
                    enable: true, 
                    value_area: isMobile ? 800 : 600 
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
    const pJSDom = window.pJSDom;
    if (!pJSDom || !Array.isArray(pJSDom) || !pJSDom[0] || !pJSDom[0].pJS) {
        console.warn('Particles.js no está inicializado correctamente');
        return;
    }
    
    const color = theme === 'light-mode' ? '#000000' : '#ffffff';
    const rgb = theme === 'light-mode' ? {r: 0, g: 0, b: 0} : {r: 255, g: 255, b: 255};
    
    const pJS = pJSDom[0].pJS;
    
    if (pJS.particles && Array.isArray(pJS.particles.array)) {
        pJS.particles.array.forEach(particle => {
            if (particle && particle.color) {
                particle.color.value = color;
                particle.color.rgb = rgb;
            }
        });
        
        if (pJS.particles.line_linked) {
            pJS.particles.line_linked.color = color;
            pJS.particles.line_linked.color_rgb_line = rgb;
        }
        
        if (typeof pJS.fn.particlesRefresh === 'function') {
            pJS.fn.particlesRefresh();
        }
    }
}

// Añadir listener para actualizar partículas en resize
window.addEventListener('resize', () => {
    initializeParticles();
});

// Initialize theme and particles in correct order
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeParticles();
});

// Prevenir selección de texto
document.addEventListener('selectstart', (e) => e.preventDefault());