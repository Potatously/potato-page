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

// IIFE para encapsular todo el código y evitar contaminación del ámbito global
;(() => {
  // Inicialización de caché de audio para mejor rendimiento
  const audioCache = {
    puertazo: new Audio("./assets/audio/puertazo.mp3"),
    pichon: new Audio("./assets/audio/pichon.mp3"),
    hover: new Audio("./assets/audio/bip.mp3"), // Nuevo audio para efecto hover
  }

  // Función para precargar archivos de audio
  function preloadAudio() {
    audioCache.puertazo.preload = "auto"
    audioCache.pichon.preload = "auto"
    audioCache.hover.preload = "auto" // Precargar el audio de hover

    // Configurar volumen para el audio de hover
    audioCache.hover.volume = 1
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
  const logoText = document.querySelector(".logo-text")

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
    hoverAudioPlaying: false, // Estado para controlar reproducción de audio hover
    hoverAudioCooldown: false, // Cooldown para evitar sobrecargar el audio
  }

  // Temporizadores para gestionar eventos
  const timers = {
    pPress: null,
    gPress: null,
    click: null,
    hoverAudio: null, // Nuevo temporizador para el audio de hover
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

  // Función para reproducir el sonido de hover
  function playHoverSound() {
    if (!userInteracted || state.hoverAudioPlaying || state.hoverAudioCooldown) return

    state.hoverAudioPlaying = true
    state.hoverAudioCooldown = true

    // Clonar el audio para permitir múltiples reproducciones simultáneas
    const hoverSound = audioCache.hover.cloneNode()
    hoverSound.volume = 0.7 // Asegurar volumen adecuado

    hoverSound
      .play()
      .then(() => {
        // Establecer un cooldown corto para evitar spam de sonido
        clearTimeout(timers.hoverAudio)
        timers.hoverAudio = setTimeout(() => {
          state.hoverAudioPlaying = false

          // Cooldown más corto para permitir que el sonido se reproduzca con fluidez
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

  // Añadir efecto de sonido a elementos hover
  function setupHoverSounds() {
    // Seleccionar todos los elementos que necesitan efecto hover
    const hoverElements = document.querySelectorAll(
      ".logo-text, #menu-text, .footer-link, .nav-links a, .social-link, .theme-toggle-button",
    )

    hoverElements.forEach((element) => {
      element.addEventListener("mouseenter", playHoverSound)
    })
  }

  // Manejador de eventos de teclado para Easter Eggs
  document.addEventListener("keydown", (e) => {
    // Ignorar eventos en campos de entrada
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return

    // Easter Egg activado con la tecla "p"
    if (e.key.toLowerCase() === "p" && canActivateEasterEgg()) {
      handleKeyPress("p")
    }
    // Easter Egg activado con la tecla "g"
    else if (e.key.toLowerCase() === "g" && !state.isGAudioPlaying && !state.gAudioCooldown && canActivateEasterEgg()) {
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

    // Incrementar contador
    state[countProperty]++
    state[countProperty] = Math.min(state[countProperty], state.MAX_COUNTER)

    // Gestionar temporizador y activación
    if (state[countProperty] === 1) {
      clearTimeout(timers[timerProperty])
      timers[timerProperty] = setTimeout(() => (state[countProperty] = 0), timeout)
    } else if (state[countProperty] === requiredCount) {
      clearTimeout(timers[timerProperty])
      state[countProperty] = 0
      isP ? activateEasteregg() : activateGAudio()
    }
  }

  // Verificar si se pueden activar Easter Eggs
  function canActivateEasterEgg() {
    return !state.isEastereggActive && !state.isSecondEastereggActive && !state.isGAudioPlaying
  }

  // Activar Easter Egg de Homero
  function activateEasteregg() {
    if (!homeroVideo) return

    state.isEastereggActive = true
    eastereggOverlay.style.display = "flex"
    homeroVideo.pause() // Pausar inicialmente el video

    // Secuencia de activación:
    // 1. Reproducir audio
    playAudio("./assets/audio/puertazo.mp3").then(() => {
      // 2. Animar bola disco
      requestAnimationFrame(() => {
        if (discoBall) {
          discoBall.style.animation = "dropDiscoBall 1s forwards"
        }
        // 3. Iniciar video con retraso
        setTimeout(() => {
          homeroVideo.style.animation = "fadeIn 2s forwards"
          homeroVideo.muted = !userInteracted
          homeroVideo.play().catch((err) => console.error(err))
        }, 800)
      })
    })
  }

  // Easter Egg activado al hacer clic en el logo
  if (logoImage) {
    logoImage.addEventListener("click", () => {
      if (canActivateEasterEgg()) {
        // Reiniciar animación de sacudida
        logoImage.classList.remove("shake")
        setTimeout(() => {
          logoImage.classList.add("shake")
        }, 10)

        // Gestionar contador de clics
        state.clickCount++
        if (state.clickCount === 1) {
          clearTimeout(timers.click)
          timers.click = setTimeout(() => (state.clickCount = 0), 1000)
        } else if (state.clickCount >= 8) {
          clearTimeout(timers.click)
          state.clickCount = 0
          activateSecondEasteregg()
        }
      }
    })
  }

  // Activar segundo Easter Egg
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

  // Función para reproducir audio de forma segura
  async function playAudio(src) {
    // Validación de seguridad
    if (!src || !src.startsWith("./assets/audio/")) {
      throw new Error("Ruta de audio inválida")
    }

    // Verificar interacción del usuario
    if (!userInteracted) {
      console.warn("Reproducción bloqueada: el usuario no ha interactuado")
      return
    }

    try {
      // Usar audio precargado del caché
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

  // Función para reproducir video de forma segura
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

  // Manejador para cerrar el primer Easter Egg
  if (closeButton && closeButton instanceof HTMLElement) {
    closeButton.addEventListener("click", () => {
      discoBall.style.removeProperty("animation")
      discoBall.style.top = "-100px" // Resetear posición inicial
      state.isEastereggActive = false
      eastereggOverlay.style.display = "none"
      discoBall.style.animation = ""
      homeroVideo.style.animation = ""
      homeroVideo.pause()
      homeroVideo.muted = true

      if (homeroVideo) {
        homeroVideo.currentTime = 0
      }

      // Limpiar temporizadores
      if (state.gAudioTimer1) clearTimeout(state.gAudioTimer1)
      if (state.gAudioTimer2) clearTimeout(state.gAudioTimer2)
    })
  }

  // Manejador para cerrar el segundo Easter Egg
  if (closeSecondButton instanceof HTMLElement) {
    closeSecondButton.addEventListener("click", () => {
      state.isSecondEastereggActive = false
      secondEastereggOverlay.style.display = "none"
      secondVideo.style.animation = ""
      secondVideo.pause()
      secondVideo.currentTime = 0
    })
  }

  // Activar Easter Egg de audio con la tecla "g"
  function activateGAudio() {
    // Limpiar temporizadores previos
    if (state.gAudioTimer1) clearTimeout(state.gAudioTimer1)
    if (state.gAudioTimer2) clearTimeout(state.gAudioTimer2)

    state.isGAudioPlaying = true

    playAudio("./assets/audio/pichon.mp3")
      .then(() => {
        // Gestionar estados con temporizadores
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

  // Inicialización del tema
  function initializeTheme() {
    console.log("Initializing theme...")
    const savedTheme = localStorage.getItem("theme")
    const validThemes = ["light-mode", "dark-mode"]
    const theme = validThemes.includes(savedTheme) ? savedTheme : "dark-mode"

    // Aplicar tema
    document.documentElement.classList.remove(...validThemes)
    document.documentElement.classList.add(theme)

    updateTheme(theme)
  }

  // Actualizar elementos visuales según el tema
  function updateTheme(theme) {
    // Actualizar color del tema en meta tag
    const themeColorMeta = document.querySelector('meta[name="theme-color"]')
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", theme === "light-mode" ? "#ffffff" : "#0a0a0b")
    }

    // Actualizar logo según el tema
    if (logoImage) {
      logoImage.src = theme === "light-mode" ? "./assets/images/papa-negra.png" : "./assets/images/papa-blanca.png"
    }

    // Update the theme toggle button text color based on theme
    const themeToggleButton = document.querySelector(".theme-toggle-button")
    if (themeToggleButton) {
      // Remove background color change and only update text color
      themeToggleButton.style.color = theme === "dark-mode" ? "#ffffff" : "#000000"
    }
  }

  // Configurar cambio de tema al hacer clic en el botón
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

  // Configurar menú desplegable
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

        // Esperar a que termine la animación antes de ocultar
        setTimeout(() => {
          navLinks.classList.remove("active", "closing")
        }, 500)
      }
    }

    menuButton.addEventListener("click", () => {
      toggleMenu(!state.menuOpen)
    })

    // Cerrar menú al hacer clic fuera
    document.addEventListener("click", (e) => {
      if (state.menuOpen && !menuButton.contains(e.target) && !navLinks.contains(e.target)) {
        toggleMenu(false)
      }
    })

    // Añadir soporte para cerrar el menú con la tecla Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && state.menuOpen) {
        toggleMenu(false)
      }
    })
  }

  // Configurar comportamiento del logo-text
  if (logoText) {
    logoText.addEventListener("click", (e) => {
      // Verificar si estamos en la página principal
      const isHomePage =
        window.location.pathname === "/" ||
        window.location.pathname === "/index.html" ||
        window.location.pathname.endsWith("/")

      // Si no estamos en la página principal, redirigir
      if (!isHomePage) {
        window.location.href = "https://potatously.vercel.app"
      }

      // Si estamos en la página principal, prevenir la acción predeterminada
      if (isHomePage) {
        e.preventDefault()
      }
    })
  }

  // Prevenir selección de texto
  document.addEventListener("selectstart", (e) => e.preventDefault())

  // Inicializar la página al cargar
  window.addEventListener("load", () => {
    // Inicializar tema
    initializeTheme()

    // Configurar efectos de sonido hover
    setupHoverSounds()

    // Habilitar scroll después de la carga
    requestAnimationFrame(() => {
      document.documentElement.style.overflow = "auto"
      document.body.style.overflow = "auto"
      document.body.style.height = "auto"
    })

    // Sincronizar la animación del social-link
    const socialLink = document.querySelector(".social-link")
    if (socialLink) {
      const computedStyle = window.getComputedStyle(socialLink)
      const animationDelay = Number.parseFloat(computedStyle.animationDelay) || 0
      const animationDuration = Number.parseFloat(computedStyle.animationDuration) || 0
      const currentTime = (performance.now() / 1000) % animationDuration
      socialLink.style.setProperty("--animation-progress", `${currentTime}s`)
    }

    // Verificar si estamos en un dispositivo móvil para optimizar interacciones
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    if (isMobile) {
      // Optimizaciones para dispositivos móviles
      document.body.classList.add("mobile-device")
    }
  })
})()

