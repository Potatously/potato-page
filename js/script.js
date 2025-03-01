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
    puertazo: new Audio("./audio/puertazo.mp3"),
    pichon: new Audio("./audio/pichon.mp3"),
  }

  // Función para precargar archivos de audio
  function preloadAudio() {
    audioCache.puertazo.preload = "auto"
    audioCache.pichon.preload = "auto"
  }

  // Referencias a elementos DOM
  const themeToggle = document.getElementById("theme-toggle")
  const logoImage = document.getElementById("logo-image")
  const socialIcons = document.querySelectorAll(".social-links .social-icon")
  const themeIcon = document.getElementById("theme-icon")
  const eastereggOverlay = document.getElementById("eastereggOverlay")
  const secondEastereggOverlay = document.getElementById("secondEastereggOverlay")
  const homeroVideo = document.getElementById("homeroVideo")
  const secondVideo = document.getElementById("secondVideo")
  const discoBall = document.getElementById("discoBall")
  const closeButton = document.getElementById("closeButton")
  const closeSecondButton = document.getElementById("closeSecondButton")

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
    // Ignorar eventos en campos de entrada
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return
    
    // Easter Egg activado con la tecla "p"
    if (e.key.toLowerCase() === "p" && canActivateEasterEgg()) {
      handleKeyPress("p")
    } 
    // Easter Egg activado con la tecla "g"
    else if (
      e.key.toLowerCase() === "g" &&
      !state.isGAudioPlaying &&
      !state.gAudioCooldown &&
      canActivateEasterEgg()
    ) {
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
    playAudio("./audio/puertazo.mp3").then(() => {
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
    if (!src || !src.startsWith("./audio/")) {
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
    
    playAudio("./audio/pichon.mp3")
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

    // Actualizar icono del tema
    themeIcon.src = theme === "dark-mode" ? "./images/luna.png" : "./images/sol.png"

    // Actualizar iconos sociales según el tema
    if (socialIcons && socialIcons.length > 0) {
      socialIcons.forEach((icon) => {
        icon.src = theme === "light-mode" ? "./images/linktree-black-icon.svg" : "./images/linktree-white-icon.svg"
      })
    }

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
      logoImage.src = theme === "light-mode" ? "./images/papa-negra.png" : "./images/papa-blanca.png"
    }

    // Actualizar icono del botón de tema
    if (themeIcon) {
      themeIcon.style.animation = "none"
      themeIcon.offsetHeight // Forzar reflow
      themeIcon.style.animation = ""
      themeIcon.src = theme === "dark-mode" ? "./images/luna.png" : "./images/sol.png"
      
      if (themeToggle) {
        themeToggle.setAttribute("aria-label", theme === "dark-mode" ? "Cambiar a modo claro" : "Cambiar a modo oscuro")
      }
    }

    // Actualizar iconos sociales
    if (socialIcons && socialIcons.length > 0) {
      socialIcons.forEach((icon) => {
        icon.src = theme === "light-mode" ? "./images/linktree-black-icon.svg" : "./images/linktree-white-icon.svg"
      })
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

  // Prevenir selección de texto
  document.addEventListener("selectstart", (e) => e.preventDefault())

  // Inicializar la página al cargar
  window.addEventListener("load", () => {
    // Inicializar tema
    initializeTheme()
    
    // Habilitar scroll después de la carga
    requestAnimationFrame(() => {
      document.documentElement.style.overflow = "auto"
      document.body.style.overflow = "auto"
      document.body.style.height = "auto"
    })
  })
})()