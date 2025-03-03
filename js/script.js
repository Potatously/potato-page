// Consola Potato logo
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
  
  // Consola Potato título
console.log(`
  ██████╗  ██████╗ ████████╗ █████╗ ████████╗ ██████╗    | Busco una
  ██╔══██╗██╔═══██╗╚══██╔══╝██╔══██╗╚══██╔══╝██╔═══██╗   | Pelinegra
  ██████╔╝██║   ██║   ██║   ███████║   ██║   ██║   ██║   | Y
  ██╔═══╝ ██║   ██║   ██║   ██╔══██║   ██║   ██║   ██║   | Que
  ██║     ╚██████╔╝   ██║   ██║  ██║   ██║   ╚██████╔╝   | No
  ╚═╝      ╚═════╝    ╚═╝   ╚═╝  ╚═╝   ╚═╝    ╚═════╝    | Mienta
`)
  
  ;(() => {
    // Inicialización de caché de audio para mejor rendimiento
    const audioCache = {
      puertazo: new Audio("./assets/audio/puertazo.mp3"),
      pichon: new Audio("./assets/audio/pichon.mp3"),
      hover: new Audio("./assets/audio/bip.mp3")
    }
  
    // Función para precargar archivos de audio
    function preloadAudio() {
      audioCache.puertazo.preload = "auto"
      audioCache.pichon.preload = "auto"
      audioCache.hover.preload = "auto"
      // Aumentamos el volumen del sonido hover
      audioCache.hover.volume = 1.0
    }
  
    // Referencias a elementos DOM
    const themeToggle = document.getElementById("theme-toggle")
    const logoImage = document.getElementById("logo-image")
    const eastereggOverlay = document.getElementById("eastereggOverlay")
    const secondEastereggOverlay = document.getElementById("secondEastereggOverlay")
    const homeroVideo = document.getElementById("homeroVideo")
    const secondVideo = document.getElementById("secondVideo")
    const discoBall = document.getElementById("discoBall")
    const closeButton = document.getElementById("closeButton")
    const closeSecondButton = document.getElementById("closeSecondButton")
    const menuButton = document.getElementById("menu-button")
    const navLinks = document.getElementById("nav-links")
  
    // Configuración de animaciones para el logo
    if (logoImage) {
      logoImage.classList.add("animate-in")
      logoImage.addEventListener("animationend", (e) => {
        logoImage.classList.remove(e.animationName === "fadeInUp" ? "animate-in" : "shake")
      })
    }
  
    // Precargar audio al inicio
    preloadAudio()
  
    // Estado de la aplicación
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
    }
  
    // Temporizadores para gestionar eventos
    const timers = {
      pPress: null,
      gPress: null,
      click: null,
    }
  
    // Bandera para detectar si el usuario ha interactuado con la página
    let userInteracted = false
  
    // Manejador de errores de audio
    function handleAudioError(e) {
      const error = e.target.error
      console.error("Error de audio:", {
        code: error.code,
        message: error.message,
        tipo: error instanceof MediaError ? "MediaError" : "Error general",
      })
    }
  
    // Habilitar audio después de la primera interacción del usuario
    document.addEventListener("click", () => {
      if (!userInteracted) {
        userInteracted = true
        // Quitar mute de todos los videos
        document.querySelectorAll("video").forEach((video) => {
          video.muted = false
        })
      }
    })
  
    // Manejador de eventos de teclado para Easter Eggs
    document.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return
  
      if (e.key.toLowerCase() === "p" && canActivateEasterEgg()) {
        handleKeyPress("p")
      } else if (e.key.toLowerCase() === "g" && !state.isGAudioPlaying && !state.gAudioCooldown && canActivateEasterEgg()) {
        handleKeyPress("g")
      }
    })
  
    // Función para manejar pulsaciones de teclas específicas
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
      return !state.isEastereggActive && !state.isSecondEastereggActive && !state.isGAudioPlaying
    }
  
    function activateEasteregg() {
      if (!homeroVideo) return
  
      state.isEastereggActive = true
      eastereggOverlay.style.display = "flex"
      homeroVideo.pause()
      playAudio("./assets/audio/puertazo.mp3").then(() => {
        requestAnimationFrame(() => {
          if (discoBall) {
            discoBall.style.animation = "dropDiscoBall 1s forwards"
          }
          setTimeout(() => {
            homeroVideo.style.animation = "fadeIn 2s forwards"
            homeroVideo.muted = !userInteracted
            homeroVideo.play().catch((err) => console.error(err))
          }, 800)
        })
      })
    }
  
    if (logoImage) {
      logoImage.addEventListener("click", () => {
        logoImage.classList.remove("shake")
        setTimeout(() => {
          logoImage.classList.add("shake")
        }, 10)
  
        state.clickCount++
        if (state.clickCount === 1) {
          clearTimeout(timers.click)
          timers.click = setTimeout(() => (state.clickCount = 0), 1000)
        } else if (state.clickCount >= 8) {
          clearTimeout(timers.click)
          state.clickCount = 0
          activateSecondEasteregg()
        }
      })
    }
  
    // Redirección condicional para logo-text
    const logoText = document.querySelector('.logo-text')
    if (logoText) {
      logoText.addEventListener("click", (e) => {
        const path = window.location.pathname
        if (path === "/" || path.endsWith("index.html")) {
          e.preventDefault()
        }
      })
    }
  
    function activateSecondEasteregg() {
      state.isSecondEastereggActive = true
      secondEastereggOverlay.style.display = "flex"
      secondVideo.muted = !userInteracted
      secondVideo.currentTime = 0
  
      requestAnimationFrame(() => {
        secondVideo.style.animation = "fadeIn 2s forwards"
        playVideo(secondVideo)
      })
    }
  
    // Función para reproducir audio de forma segura (para puertazo y pichon y hover)
    async function playAudio(src) {
      if (!src || !src.startsWith("./assets/audio/")) {
        throw new Error("Ruta de audio inválida")
      }
  
      if (!userInteracted) {
        console.error("Error: El usuario no ha interactuado; el audio no se reproducirá. Haz clic en la página para habilitar audio.")
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
        console.error("Error al reproducir el audio:", err)
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
        homeroVideo.style.animation = ""
        homeroVideo.pause()
        homeroVideo.muted = true
        if (homeroVideo) {
          homeroVideo.currentTime = 0
        }
        if (state.gAudioTimer1) clearTimeout(state.gAudioTimer1)
        if (state.gAudioTimer2) clearTimeout(state.gAudioTimer2)
      })
    }
  
    if (closeSecondButton instanceof HTMLElement) {
      closeSecondButton.addEventListener("click", () => {
        state.isSecondEastereggActive = false
        secondEastereggOverlay.style.display = "none"
        secondVideo.style.animation = ""
        secondVideo.pause()
        secondVideo.currentTime = 0
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
      console.log("Initializing theme...")
      const savedTheme = localStorage.getItem("theme")
      const validThemes = ["light-mode", "dark-mode"]
      const theme = validThemes.includes(savedTheme) ? savedTheme : "dark-mode"
  
      document.documentElement.classList.remove(...validThemes)
      document.documentElement.classList.add(theme)
      updateTheme(theme)
    }
  
    function updateTheme(theme) {
      const themeColorMeta = document.querySelector('meta[name="theme-color"]')
      if (themeColorMeta) {
        themeColorMeta.setAttribute("content", theme === "light-mode" ? "#ffffff" : "#0a0a0b")
      }
      if (logoImage) {
        logoImage.src = theme === "light-mode" ? "./assets/images/papa-negra.png" : "./assets/images/papa-blanca.png"
      }
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
  
    document.addEventListener("selectstart", (e) => e.preventDefault())
  
    // NUEVO: Función para reproducir el sonido hover
    function playHoverSound() {
      if (!userInteracted) {
        console.error("Error: El usuario no ha interactuado; el audio hover no se reproducirá. Haz clic en la página para habilitar audio.")
        return
      }
      playAudio("./assets/audio/bip.mp3").catch((err) => console.error(err))
    }
  
    // Agregar el efecto hover de sonido a varios elementos
    const hoverSelectors = [
      '.logo-text',
      '#menu-text',
      '.footer-link',
      '.nav-links a',
      '.social-link',
      '.theme-toggle-button'
    ]
  
    hoverSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        el.addEventListener("mouseenter", playHoverSound)
      })
    })
  
    window.addEventListener("load", () => {
      initializeTheme()
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
  
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      if (isMobile) {
        document.body.classList.add("mobile-device")
      }
    })
  })()