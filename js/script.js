console.log(`
  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
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
  `)

console.log(`
    ██████╗  ██████╗ ████████╗ █████╗ ████████╗ ██████╗    | Busco una
    ██╔══██╗██╔═══██╗╚══██╔══╝██╔══██╗╚══██╔══╝██╔═══██╗   | Pelinegra
    ██████╔╝██║   ██║   ██║   ███████║   ██║   ██║   ██║   | Y
    ██╔═══╝ ██║   ██║   ██║   ██╔══██║   ██║   ██║   ██║   | Que
    ██║     ╚██████╔╝   ██║   ██║  ██║   ██║   ╚██████╔╝   | No
    ╚═╝      ╚═════╝    ╚═╝   ╚═╝  ╚═╝   ╚═╝    ╚═════╝    | Mienta
  `)
;(() => {
  const audioCache = {
    puertazo: new Audio("./assets/audio/puertazo.mp3"),
    pichon: new Audio("./assets/audio/pichon.mp3"),
    hover: new Audio("./assets/audio/bip.mp3"),
  }

  const videoCache = {
    homero: null,
    dracukeo: null,
  }

  function preloadAudio() {
    audioCache.puertazo.preload = "auto"
    audioCache.pichon.preload = "auto"
    audioCache.hover.preload = "auto"
    audioCache.puertazo.onerror = handleAudioError;
    audioCache.pichon.onerror = handleAudioError;
    audioCache.hover.onerror = handleAudioError;
    audioCache.hover.volume = 1
  }

  const themeToggle = document.getElementById("theme-toggle")
  const logoImage = document.getElementById("logo-image")
  const eastereggOverlay = document.getElementById("eastereggOverlay")
  const secondEastereggOverlay = document.getElementById("secondEastereggOverlay")
  const homeroVideoContainer = document.getElementById("homeroVideoContainer")
  const secondVideoContainer = document.getElementById("secondVideoContainer")
  const discoBall = document.getElementById("discoBall")
  const closeButton = document.getElementById("closeButton")
  const closeSecondButton = document.getElementById("closeSecondButton")
  const menuButton = document.getElementById("menu-button")
  const navLinks = document.getElementById("nav-links")
  const logoText = document.querySelector(".logo-text")

  if (logoImage) {
    logoImage.addEventListener("animationend", (e) => {
      logoImage.classList.remove(e.animationName === "fadeInUp" ? "animate-in" : "shake")
    })
  }

  preloadAudio()

  const state = {
    pPressCount: 0,
    gPressCount: 0,
    clickCount: 0,
    isEastereggActive: false,
    isSecondEastereggActive: false,
    isGAudioPlaying: false,
    gAudioCooldown: false,
    gAudioTimer1: null,
    gAudioTimer2: null,
    MAX_COUNTER: 10,
    menuOpen: false,
    hoverAudioPlaying: false,
    hoverAudioCooldown: false,
    videosLoaded: {
      homero: false,
      dracukeo: false,
    },
  }

  const timers = {
    pPress: null,
    gPress: null,
    click: null,
    hoverAudio: null,
  }

  let userInteracted = false

  function handleAudioError(e) {
    if (e.target.error.code === MediaError.MEDIA_ERR_ABORTED) return;
    console.error("Error de audio:", e.target.error.message);
  }

  document.addEventListener("click", () => {
    if (!userInteracted) {
      userInteracted = true
      document.querySelectorAll("video").forEach((video) => {
        video.muted = false
      })
    }
  })

  function playHoverSound() {
    // Detectar si es un dispositivo móvil
    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    
    // No reproducir sonido en dispositivos móviles
    if (isMobile || !userInteracted || state.hoverAudioPlaying || state.hoverAudioCooldown) return;

    state.hoverAudioPlaying = true
    state.hoverAudioCooldown = true

    const hoverSound = audioCache.hover.cloneNode()
    hoverSound.volume = 1

    hoverSound
      .play()
      .then(() => {
        clearTimeout(timers.hoverAudio)
        timers.hoverAudio = setTimeout(() => {
          state.hoverAudioPlaying = false

          setTimeout(() => {
            state.hoverAudioCooldown = false
          }, 50)
        }, 100)
      })
      .catch((err) => {
        console.error("Error al reproducir sonido hover:", err)
        state.hoverAudioPlaying = false
        state.hoverAudioCooldown = false
      })
  }

  function setupHoverSounds() {
    const hoverElements = document.querySelectorAll(
      ".logo-text, #menu-text, .footer-link, .nav-links a, .social-link, .theme-toggle-button, .close-button, .close-second-button",
    )

    hoverElements.forEach((element) => {
      element.addEventListener("mouseenter", playHoverSound)
    })
  }

  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return

    if (e.key.toLowerCase() === "p" && canActivateEasterEgg()) {
      handleKeyPress("p")
    } else if (
      e.key.toLowerCase() === "g" &&
      !state.isGAudioPlaying &&
      !state.gAudioCooldown &&
      canActivateEasterEgg()
    ) {
      handleKeyPress("g")
    }
  })

  function handleKeyPress(key) {
    const isP = key === "p"
    const countProperty = isP ? "pPressCount" : "gPressCount"
    const timerProperty = isP ? "pPress" : "gPress"
    const requiredCount = isP ? 5 : 4
    const timeout = isP ? 5000 : 4000

    state[countProperty]++
    state[countProperty] = Math.min(state[countProperty], state.MAX_COUNTER)

    if (state[countProperty] === 1) {
      clearTimeout(timers[timerProperty])
      timers[timerProperty] = setTimeout(() => (state[countProperty] = 0), timeout)
    } else if (state[countProperty] === requiredCount) {
      clearTimeout(timers[timerProperty])
      state[countProperty] = 0
      isP ? activateEasteregg() : activateGAudio()
    }
  }

  function canActivateEasterEgg() {
    // Verificar si la terminal está activa
    const terminalActive = document.querySelector('.terminal-overlay') !== null;
    
    // No permitir activar easter eggs si la terminal está activa
    if (terminalActive) {
      return false;
    }
    
    return !state.isEastereggActive && !state.isSecondEastereggActive && !state.isGAudioPlaying
  }

  function createVideoElement(videoId) {
    if (videoCache[videoId]) {
      return videoCache[videoId]
    }

    const video = document.createElement("video")
    video.id = videoId + "Video"
    video.className = videoId + "-video"
    // Modificado: Inicialmente oculto para evitar el primer frame estático
    video.style.cssText = "width:100%;height:auto;max-width:800px;position:relative;z-index:1001;opacity:1;visibility:visible;";
    video.setAttribute('playsinline', ''); // Para iOS
    video.autoplay = true;
    video.muted = true;
    video.loop = true

    const preferredFormat = window.videoFormatSupport && window.videoFormatSupport.webm ? "webm" : "mp4"
    const fallbackFormat = preferredFormat === "webm" ? "mp4" : "webm"

    const sourcePreferred = document.createElement("source")
    sourcePreferred.src = `./assets/video/${videoId}.${preferredFormat}`
    sourcePreferred.type = `video/${preferredFormat}`

    const sourceFallback = document.createElement("source")
    sourceFallback.src = `./assets/video/${videoId}.${fallbackFormat}`
    sourceFallback.type = `video/${fallbackFormat}`

    const fallbackText = document.createTextNode("Tu navegador no soporta el elemento de video.")

    video.appendChild(sourcePreferred)
    video.appendChild(sourceFallback)
    video.appendChild(fallbackText)

    videoCache[videoId] = video
    state.videosLoaded[videoId] = true

    return video
  }

  function activateEasteregg() {
    if (!homeroVideoContainer) return

    state.isEastereggActive = true
    eastereggOverlay.style.display = "flex"

    if (!state.videosLoaded.homero) {
      const homeroVideo = createVideoElement("homero")
      homeroVideoContainer.appendChild(homeroVideo)
    }

    const homeroVideo = videoCache.homero;

    playAudio("./assets/audio/puertazo.mp3").then(() => {
      requestAnimationFrame(() => {
        if (discoBall) {
          discoBall.style.animation = "dropDiscoBall 1s forwards"
        }
        setTimeout(() => {
          if (homeroVideo) {
            homeroVideo.style.animation = 'none';
            homeroVideo.offsetHeight; /* Trigger reflow */
            homeroVideo.style.animation = 'fadeIn 2s forwards';            
            homeroVideo.muted = !userInteracted;
            homeroVideo.play().catch(err => {
              console.error('Error al reproducir:', err);            
              homeroVideo.muted = true;
              homeroVideo.play();
          });
          }
        }, 800)
      })
    })
  }

  if (logoImage) {
    logoImage.addEventListener("click", () => {
      if (canActivateEasterEgg()) {
        logoImage.classList.remove("shake")
        setTimeout(() => {
          logoImage.classList.add("shake")
        }, 10)

        state.clickCount++
        if (state.clickCount === 1) {
          clearTimeout(timers.click)
          timers.click = setTimeout(() => (state.clickCount = 0), 2000)
        } else if (state.clickCount >= 8) {
          clearTimeout(timers.click)
          state.clickCount = 0
          activateSecondEasteregg()
        }
      }
    })
  }

  function activateSecondEasteregg() {
    state.isSecondEastereggActive = true
    secondEastereggOverlay.style.display = "flex"

    if (!state.videosLoaded.dracukeo) {
      const dracukeoVideo = createVideoElement("dracukeo")
      secondVideoContainer.appendChild(dracukeoVideo)
    }

    const secondVideo = document.getElementById("dracukeoVideo")

    if (secondVideo) {
      secondVideo.muted = !userInteracted
      secondVideo.currentTime = 0
      secondVideo.style.visibility = "visible";
      secondVideo.style.opacity = "1";
      secondVideo.removeAttribute('hidden');

      requestAnimationFrame(() => {
        secondVideo.style.display = "block" // Mostrar justo antes de la animación
        secondVideo.style.animation = "fadeIn 2s forwards"
        playVideo(secondVideo)
      })
    }
  }

  async function playAudio(src) {
    if (!src || !src.startsWith("./assets/audio/")) {
      throw new Error("Ruta de audio inválida");
    }

    if (
        (src.includes("puertazo.mp3") && audioCache.puertazo.readyState < 3) ||
        (src.includes("pichon.mp3") && audioCache.pichon.readyState < 3) ||
        (src.includes("bip.mp3") && audioCache.hover.readyState < 3)
    ) {
        throw new Error("Audio no cargado completamente");
    }

    if (!userInteracted) {
      console.warn("Reproducción bloqueada: el usuario no ha interactuado")
      return
    }

    try {
      let audio
      if (src.includes("puertazo.mp3")) {
        audio = audioCache.puertazo.cloneNode()
      } else if (src.includes("pichon.mp3")) {
        audio = audioCache.pichon.cloneNode()
      } else if (src.includes("bip.mp3")) {
        audio = audioCache.hover.cloneNode()
      } else {
        throw new Error("Audio no precargado")
      }

      audio.preload = "auto"
      audio.addEventListener("error", handleAudioError)
      await audio.play()
    } catch (err) {
      console.error("Error al activar Easter egg:", err)
      state.isEastereggActive = false
      eastereggOverlay.style.display = "none"
      throw err
    }
  }

  async function playVideo(video) {
    if (!video) {
      console.error("Elemento video no encontrado")
      return
    }

    if (!userInteracted) {
      console.warn("Reproducción bloqueada: el usuario no ha interactuado")
      return
    }

    try {
      video.muted = !userInteracted
      await video.play()
    } catch (err) {
      console.error("Error:", err)
      throw err
    }
  }

  if (closeButton && closeButton instanceof HTMLElement) {
    closeButton.addEventListener("click", () => {
      discoBall.style.removeProperty("animation")
      discoBall.style.top = "-100px"
      state.isEastereggActive = false
      eastereggOverlay.style.display = "none"
      discoBall.style.animation = ""

      const homeroVideo = videoCache.homero;
      if (homeroVideo) {
        homeroVideo.style.animation = ""
        homeroVideo.pause()
        homeroVideo.muted = true
        homeroVideo.currentTime = 0
        homeroVideo.style.display = "none" // Ocultar al cerrar
      }

      if (state.gAudioTimer1) clearTimeout(state.gAudioTimer1)
      if (state.gAudioTimer2) clearTimeout(state.gAudioTimer2)
    })
  }

  if (closeSecondButton instanceof HTMLElement) {
    closeSecondButton.addEventListener("click", () => {
      state.isSecondEastereggActive = false
      secondEastereggOverlay.style.display = "none"

      const secondVideo = document.getElementById("dracukeoVideo")
      if (secondVideo) {
        secondVideo.style.animation = ""
        secondVideo.pause()
        secondVideo.currentTime = 0
        secondVideo.style.display = "none" // Ocultar al cerrar
      }
    })
  }

  function activateGAudio() {
    if (state.gAudioTimer1) clearTimeout(state.gAudioTimer1)
    if (state.gAudioTimer2) clearTimeout(state.gAudioTimer2)

    state.isGAudioPlaying = true

    playAudio("./assets/audio/pichon.mp3")
      .then(() => {
        state.gAudioTimer1 = setTimeout(() => {
          state.isGAudioPlaying = false
          state.gAudioCooldown = true

          state.gAudioTimer2 = setTimeout(() => {
            state.gAudioCooldown = false
          }, 2000)
        }, 2000)
      })
      .catch((err) => {
        console.error('Error en audio "G":', err)
        clearTimeout(state.gAudioTimer1)
        clearTimeout(state.gAudioTimer2)
        state.isGAudioPlaying = false
        state.gAudioCooldown = false
      })
  }

  function initializeTheme() {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem("theme")
    const validThemes = ["light-mode", "dark-mode"]
    const theme = validThemes.includes(savedTheme) ? savedTheme : "dark-mode"

    root.classList.remove(...validThemes);
    root.classList.add(theme);
    updateTheme(theme)
  }

  // Función updateMediaSourcesForTheme en script.js
  function updateMediaSourcesForTheme(theme) {
    if (logoImage) {
      const isDark = theme === "dark-mode"
  
      // Definir las rutas de las imágenes
      let logoSrc = ""
  
      if (isDark) {
        // Modo oscuro - usar patata blanca
        if (typeof window.formatSupport !== 'undefined' && window.formatSupport.avif) {
          logoSrc = "./assets/images/patata-blanca.avif"
        } else if (window.formatSupport && window.formatSupport.webp) {
          logoSrc = "./assets/images/patata-blanca.webp"
        } else {
          logoSrc = "./assets/images/patata-blanca.png"
        }
      } else {
        // Modo claro - usar patata negra
        if (typeof window.formatSupport !== 'undefined' && window.formatSupport.avif) {
          logoSrc = "./assets/images/papa-negra.avif"
        } else if (window.formatSupport && window.formatSupport.webp) {
          logoSrc = "./assets/images/papa-negra.webp"
        } else {
          logoSrc = "./assets/images/papa-negra.png"
        }
      }
    
      // Verificar que la imagen existe antes de asignarla
      const tempImg = new Image()
      tempImg.onload = () => {
        // La imagen existe, asignarla al logo
        logoImage.src = logoSrc
        // Forzar recarga de la imagen
        logoImage.style.display = "none"
        setTimeout(() => {
          logoImage.style.display = ""
        }, 10)
      }
  
      tempImg.onerror = () => {
        // La imagen no existe, usar una imagen de respaldo
        console.error("Error al cargar la imagen:", logoSrc)
        logoImage.src = isDark ? "./assets/images/fallback-logo-dark.png" : "./assets/images/fallback-logo-light.png";
      }
  
      tempImg.src = logoSrc
    }
  }
  
  // Agregar un listener específico para el cambio de tema
  document.addEventListener("DOMContentLoaded", () => {
    // Verificar el tema inicial y actualizar el logo
    setTimeout(() => {
      const isDarkMode =
        document.documentElement.classList.contains("dark-mode") ||
        (window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches &&
          !document.documentElement.classList.contains("light-mode"))
  
      const theme = isDarkMode ? "dark-mode" : "light-mode"
      updateMediaSourcesForTheme(theme)
    }, 100)
  })
  
  

  function updateTheme(theme) {
    const themeColorMeta = document.querySelector('meta[name="theme-color"]')
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", theme === "light-mode" ? "#ffffff" : "#0a0a0b")
    }

    updateMediaSourcesForTheme(theme)

    const themeToggleButton = document.querySelector(".theme-toggle-button")
    if (themeToggleButton) {
      themeToggleButton.style.color = theme === "dark-mode" ? "#ffffff" : "#000000"
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const root = document.documentElement
      const newTheme = root.classList.contains("light-mode") ? "dark-mode" : "light-mode"

      root.classList.remove("light-mode", "dark-mode")
      root.classList.add(newTheme)
      localStorage.setItem("theme", newTheme)
      updateTheme(newTheme)
    })
  }

  if (menuButton && navLinks) {
    const menuText = document.getElementById("menu-text")

    function toggleMenu(show) {
      state.menuOpen = show
      menuButton.classList.toggle("menu-open", show)

      if (show) {
        navLinks.classList.remove("closing")
        navLinks.classList.add("active")
        menuText.classList.add("menu-text-fade")
        setTimeout(() => {
          menuText.textContent = "Cerrar"
          menuText.classList.remove("menu-text-fade")
        }, 150)
      } else {
        navLinks.classList.add("closing")
        menuText.classList.add("menu-text-fade")
        setTimeout(() => {
          menuText.textContent = "Menú"
          menuText.classList.remove("menu-text-fade")
        }, 150)

        setTimeout(() => {
          navLinks.classList.remove("active", "closing")
        }, 500)
      }
    }

    menuButton.addEventListener("click", () => {
      toggleMenu(!state.menuOpen)
    })

    document.addEventListener("click", (e) => {
      if (state.menuOpen && !menuButton.contains(e.target) && !navLinks.contains(e.target)) {
        toggleMenu(false)
      }
    })

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && state.menuOpen) {
        toggleMenu(false)
      }
    })
  }

  if (logoText) {
    logoText.addEventListener("click", (e) => {
      const isHomePage =
        window.location.pathname === "/" ||
        window.location.pathname === "/index.html" ||
        window.location.pathname.endsWith("/")

      if (!isHomePage) {
        window.location.href = "https://potatously.vercel.app"
      }

      if (isHomePage) {
        e.preventDefault()
      }
    })
  }

  document.addEventListener("selectstart", (e) => e.preventDefault())

  window.addEventListener("load", () => {
    initializeTheme()
    setupHoverSounds()

    requestAnimationFrame(() => {
      document.documentElement.style.overflow = "auto"
      document.body.style.overflow = "auto"
      document.body.style.height = "auto"
    })

    const socialLink = document.querySelector(".social-link")
    if (socialLink) {
      const computedStyle = window.getComputedStyle(socialLink)
      const animationDelay = Number.parseFloat(computedStyle.animationDelay) || 0
      const animationDuration = Number.parseFloat(computedStyle.animationDuration) || 0
      const currentTime = (performance.now() / 1000) % animationDuration
      socialLink.style.setProperty("--animation-progress", `${currentTime}s`)
    }

    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    if (isMobile) {
      document.body.classList.add("mobile-device")
    }
    
    // Verificar el logo después de que todo esté cargado
    setTimeout(() => {
      if (logoImage) {
        const isDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        const hasLightClass = document.documentElement.classList.contains("light-mode");
        const hasDarkClass = document.documentElement.classList.contains("dark-mode");
        
        let theme = hasDarkClass ? "dark-mode" : hasLightClass ? "light-mode" : isDarkMode ? "dark-mode" : "light-mode";
        
        updateMediaSourcesForTheme(theme);
      }
    }, 500);
  })
  
  // Agregar un listener para el evento de cambio de tema del sistema
  const systemThemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  systemThemeMediaQuery.addEventListener("change", (e) => {
    // Solo actualizar si no hay un tema explícito establecido
    if (!document.documentElement.classList.contains("light-mode") && 
        !document.documentElement.classList.contains("dark-mode")) {
      const newTheme = e.matches ? "dark-mode" : "light-mode";
      updateTheme(newTheme);
    }
  });
  
  // Agregar un listener para cuando la terminal se cierre
  document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.removedNodes.length > 0) {
          const terminalRemoved = Array.from(mutation.removedNodes).some(
            node => node.classList && node.classList.contains('terminal-overlay')
          );
          
          if (terminalRemoved) {
            setTimeout(() => {
              const currentTheme = document.documentElement.classList.contains("light-mode") 
                ? "light-mode" 
                : "dark-mode";
              updateMediaSourcesForTheme(currentTheme);
            }, 200);
          }
        }
      });
    });
    
    observer.observe(document.body, { childList: true });
  });
})()