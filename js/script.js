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
    const error = e.target.error
    console.error("Error de audio:", {
      code: error.code,
      message: error.message,
      tipo: error instanceof MediaError ? "MediaError" : "Error general",
    })
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
    if (!userInteracted || state.hoverAudioPlaying || state.hoverAudioCooldown) return

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
    return !state.isEastereggActive && !state.isSecondEastereggActive && !state.isGAudioPlaying
  }

  function createVideoElement(videoId) {
    if (videoCache[videoId]) {
      return videoCache[videoId]
    }

    const video = document.createElement("video")
    video.id = videoId + "Video"
    video.className = videoId + "-video"
    // Removed opacity: 0 to make videos visible
    video.style.cssText = "width: 100%; height: auto; max-width: 800px; position: relative; z-index: 1001;"
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

    const homeroVideo = document.getElementById("homeroVideo")

    if (homeroVideo) {
      homeroVideo.pause()
    }

    playAudio("./assets/audio/puertazo.mp3").then(() => {
      requestAnimationFrame(() => {
        if (discoBall) {
          discoBall.style.animation = "dropDiscoBall 1s forwards"
        }
        setTimeout(() => {
          if (homeroVideo) {
            homeroVideo.style.animation = "fadeIn 2s forwards"
            homeroVideo.muted = !userInteracted
            homeroVideo.play().catch((err) => console.error(err))
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
          timers.click = setTimeout(() => (state.clickCount = 0), 1000)
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

      requestAnimationFrame(() => {
        secondVideo.style.animation = "fadeIn 2s forwards"
        playVideo(secondVideo)
      })
    }
  }

  async function playAudio(src) {
    if (!src || !src.startsWith("./assets/audio/")) {
      throw new Error("Ruta de audio inválida")
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

      const homeroVideo = document.getElementById("homeroVideo")
      if (homeroVideo) {
        homeroVideo.style.animation = ""
        homeroVideo.pause()
        homeroVideo.muted = true
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

      const secondVideo = document.getElementById("dracukeoVideo")
      if (secondVideo) {
        secondVideo.style.animation = ""
        secondVideo.pause()
        secondVideo.currentTime = 0
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
    console.log("Initializing theme...")
    const savedTheme = localStorage.getItem("theme")
    const validThemes = ["light-mode", "dark-mode"]
    const theme = validThemes.includes(savedTheme) ? savedTheme : "dark-mode"

    document.documentElement.classList.remove(...validThemes)
    document.documentElement.classList.add(theme)

    updateTheme(theme)
  }

  function updateMediaSourcesForTheme(theme) {
    if (logoImage) {
      const isDark = theme === "dark-mode"

      if (window.formatSupport) {
        if (window.formatSupport.avif) {
          logoImage.src = isDark ? "./assets/images/patata-blanca.avif" : "./assets/images/patata-negra.avif"
        } else if (window.formatSupport.webp) {
          logoImage.src = isDark ? "./assets/images/patata-blanca.webp" : "./assets/images/patata-negra.webp"
        } else {
          logoImage.src = isDark ? "./assets/images/patata-blanca.png" : "./assets/images/patata-negra.png"
        }
      } else {
        logoImage.src = isDark ? "./assets/images/patata-blanca.png" : "./assets/images/patata-negra.png"
      }
    }
  }

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

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    if (isMobile) {
      document.body.classList.add("mobile-device")
    }
  })
})()

