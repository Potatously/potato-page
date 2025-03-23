/**
 * visual-effects.js - Implementa efectos visuales para el sitio web
 * Versión: 3.2.0
 * Efectos: Estela de partículas con formas variadas (círculo, cuadrado, brillo) y colores arcoíris
 */

// IIFE para encapsular la funcionalidad
;(() => {
  class ParticleTrail {
    constructor() {
      // Configuración
      this.config = {
        particleCount: 15, // Reducido de 30 a 15
        particleLifespan: 1500, // Aumentado para mayor suavidad
        particleSizeRange: [2, 5], // Reducido el tamaño máximo
        gravitationalPull: 0.01, // Reducido para menor movimiento errático
        velocityDecay: 0.92, // Más decaimiento para movimientos más cortos
        cursorInfluenceRadius: 100, // Reducido el radio de influencia
        colorSchemes: {
          rainbow: [
            { r: 255, g: 0, b: 0 }, // Rojo
            { r: 255, g: 165, b: 0 }, // Naranja
            { r: 255, g: 255, b: 0 }, // Amarillo
            { r: 0, g: 255, b: 0 }, // Verde
            { r: 0, g: 127, b: 255 }, // Azul celeste
            { r: 0, g: 0, b: 255 }, // Azul
            { r: 139, g: 0, b: 255 }, // Violeta
          ],
          light: {
            primary: { r: 41, g: 121, b: 255 },
            accent: { r: 180, g: 120, b: 230 },
            shadow: "rgba(30, 144, 255, 0.15)", // Sombra más sutil
          },
          dark: {
            primary: { r: 102, g: 180, b: 255 },
            accent: { r: 200, g: 120, b: 230 },
            shadow: "rgba(102, 204, 255, 0.2)", // Sombra más sutil
          },
        },
        colorTransitionSpeed: 0.005, // Velocidad de cambio de color para efecto arcoíris
        useRainbowColors: true, // Habilitar colores arcoíris
        blendMode: "screen",
        smoothing: true,
        smoothingFactor: 0.4, // Aumentado para más suavidad
        interactWithPage: true,
        particleOpacity: 0.7, // Reducida de 0.9 a 0.7
        particleSpawnRate: 0.5, // Controla la frecuencia de generación (0-1)
        maxParticlesPerFrame: 1, // Limita la creación por frame
        // Nuevas configuraciones para las formas de partículas
        particleShapes: ["circle", "square", "sparkle"],
        shapeWeights: [0.2, 0.2, 0.6], // Probabilidades de cada forma (circle, square, sparkle)
      }

      // Estado
      this.particles = []
      this.mouse = {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        prevX: 0,
        prevY: 0,
        velocity: { x: 0, y: 0 },
      }
      this.isActive = true
      this.canvas = null
      this.ctx = null
      this.isDarkMode = this.detectDarkMode()
      this.frameId = null
      this.isMobile = this.detectMobile()
      this.lastUpdate = Date.now()
      this.interactiveElements = []
      this.lastParticleTime = 0

      // Inicializar
      this.init()
    }

    init() {
      // No inicializar en dispositivos móviles
      if (this.isMobile) return

      // Crear canvas
      this.canvas = document.createElement("canvas")
      this.canvas.className = "particle-trail-canvas"
      this.ctx = this.canvas.getContext("2d", {
        alpha: true,
        desynchronized: true,
        willReadFrequently: false,
      })

      // Configurar canvas
      this.canvas.style.position = "fixed"
      this.canvas.style.top = "0"
      this.canvas.style.left = "0"
      this.canvas.style.width = "100%"
      this.canvas.style.height = "100%"
      this.canvas.style.pointerEvents = "none"
      this.canvas.style.zIndex = "9998"

      // Añadir canvas al DOM
      document.body.appendChild(this.canvas)

      // Configurar tamaño del canvas
      this.resizeCanvas()

      // Añadir event listeners
      window.addEventListener("resize", this.resizeCanvas.bind(this))
      document.addEventListener("mousemove", this.onMouseMove.bind(this))
      document.addEventListener("mouseenter", this.onMouseEnter.bind(this))
      document.addEventListener("mouseleave", this.onMouseLeave.bind(this))

      // Detectar cambios de tema
      this.setupThemeDetection()

      // Identificar elementos interactivos
      if (this.config.interactWithPage) {
        this.findInteractiveElements()
        // Actualizar la lista periódicamente pero menos frecuentemente
        setInterval(() => this.findInteractiveElements(), 5000)
      }

      // Iniciar animación
      this.lastUpdate = Date.now()
      this.animate()
    }

    findInteractiveElements() {
      // Encuentra elementos con los que las partículas podrían interactuar
      // Excluir explícitamente los botones de cierre de Easter eggs
      this.interactiveElements = [
        ...document.querySelectorAll("a, button:not(.close-button), .card, .project, [data-interactive]"),
      ]
    }

    resizeCanvas() {
      if (!this.canvas) return

      // Establecer tamaño del canvas con escala para dispositivos de alta densidad
      const dpr = window.devicePixelRatio || 1
      this.canvas.width = window.innerWidth * dpr
      this.canvas.height = window.innerHeight * dpr

      // Escalar el contexto
      this.ctx.scale(dpr, dpr)
    }

    onMouseMove(e) {
      // Actualizar posición objetivo
      this.mouse.targetX = e.clientX
      this.mouse.targetY = e.clientY

      // Calcular velocidad del cursor
      this.mouse.velocity.x = this.mouse.targetX - this.mouse.prevX
      this.mouse.velocity.y = this.mouse.targetY - this.mouse.prevY

      // Actualizar posición previa
      this.mouse.prevX = this.mouse.x
      this.mouse.prevY = this.mouse.y

      // Generar partículas basadas en la velocidad pero con límites
      const speed = Math.sqrt(
        this.mouse.velocity.x * this.mouse.velocity.x + this.mouse.velocity.y * this.mouse.velocity.y,
      )

      const now = Date.now()
      const timeSinceLastParticle = now - this.lastParticleTime

      // Crear partículas solo si:
      // 1. Ha pasado suficiente tiempo desde la última partícula
      // 2. La velocidad del cursor es significativa
      // 3. Pasamos el filtro de ratio de generación
      if (timeSinceLastParticle > 60 && speed > 8 && Math.random() < this.config.particleSpawnRate) {
        const particlesToCreate = Math.min(this.config.maxParticlesPerFrame, Math.floor(speed / 20))

        for (let i = 0; i < particlesToCreate; i++) {
          this.createParticle()
        }

        this.lastParticleTime = now
      }
    }

    onMouseEnter() {
      this.isActive = true
    }

    onMouseLeave() {
      this.isActive = false
    }

    updateMousePosition() {
      // Aplicar suavizado al movimiento del cursor
      if (this.config.smoothing) {
        this.mouse.x += (this.mouse.targetX - this.mouse.x) * this.config.smoothingFactor
        this.mouse.y += (this.mouse.targetY - this.mouse.y) * this.config.smoothingFactor
      } else {
        this.mouse.x = this.mouse.targetX
        this.mouse.y = this.mouse.targetY
      }
    }

    // Función para seleccionar forma aleatoria basada en los pesos
    selectRandomShape() {
      const shapes = this.config.particleShapes
      const weights = this.config.shapeWeights
      // Asegurarse de que haya al menos una forma disponible
      if (!shapes || shapes.length === 0) return "circle"

      // Si no hay pesos o la longitud no coincide, usar probabilidad uniforme
      if (!weights || weights.length !== shapes.length) {
        return shapes[Math.floor(Math.random() * shapes.length)]
      }

      // Algoritmo de selección ponderada
      const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
      const random = Math.random() * totalWeight
      let cumulativeWeight = 0

      for (let i = 0; i < shapes.length; i++) {
        cumulativeWeight += weights[i]
        if (random < cumulativeWeight) {
          return shapes[i]
        }
      }

      // Por defecto, devolver la primera forma si algo falla
      return shapes[0]
    }

    createParticle() {
      // Obtener color para la partícula (arcoíris)
      let color
      if (this.config.useRainbowColors) {
        // Usar un color aleatorio de la paleta arcoíris, con variaciones ligeras
        const rainbowIndex = Math.floor(Math.random() * this.config.colorSchemes.rainbow.length)
        const baseColor = this.config.colorSchemes.rainbow[rainbowIndex]

        // Añadir variación al color para que no sean exactamente iguales
        color = {
          r: Math.min(255, Math.max(0, baseColor.r + (Math.random() * 40 - 20))),
          g: Math.min(255, Math.max(0, baseColor.g + (Math.random() * 40 - 20))),
          b: Math.min(255, Math.max(0, baseColor.b + (Math.random() * 40 - 20))),
          // Valores de transición para animar el color
          targetIndex: (rainbowIndex + 1) % this.config.colorSchemes.rainbow.length,
          colorPosition: Math.random() * 2 * Math.PI, // Posición aleatoria en ciclo de color
          colorSpeed: this.config.colorTransitionSpeed * (0.5 + Math.random()), // Velocidad aleatoria
        }
      } else {
        // Determinar el color base y acento actual (modo original)
        const colorScheme = this.isDarkMode ? this.config.colorSchemes.dark : this.config.colorSchemes.light

        // Elegir aleatoriamente entre color primario y acento
        const useAccent = Math.random() > 0.8 // 20% de probabilidad de usar acento
        const baseColor = useAccent ? colorScheme.accent : colorScheme.primary

        // Añadir ligera variación al color (menos que antes)
        color = {
          r: baseColor.r + (Math.random() * 20 - 10),
          g: baseColor.g + (Math.random() * 20 - 10),
          b: baseColor.b + (Math.random() * 20 - 10),
        }
      }

      // Seleccionar forma aleatoria para la partícula
      const shape = this.selectRandomShape()

      // Crear partícula con propiedades aleatorias más sutiles
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 1.5 + 0.5 // Velocidad reducida
      const size =
        Math.random() * (this.config.particleSizeRange[1] - this.config.particleSizeRange[0]) +
        this.config.particleSizeRange[0]

      // Añadir movimiento basado en la velocidad del cursor (menor influencia)
      const velocityInfluence = 0.2

      const particle = {
        x: this.mouse.x,
        y: this.mouse.y,
        size: size,
        color: color,
        alpha: this.config.particleOpacity,
        velocity: {
          x: Math.cos(angle) * speed + this.mouse.velocity.x * velocityInfluence,
          y: Math.sin(angle) * speed + this.mouse.velocity.y * velocityInfluence,
        },
        rotation: (Math.random() * Math.PI) / 2, // Rotación inicial
        rotationSpeed: (Math.random() - 0.5) * 0.05, // Rotación más lenta
        lifespan: this.config.particleLifespan,
        born: Date.now(),
        nearElement: false,
        shape: shape, // Almacenar la forma seleccionada
      }

      this.particles.push(particle)

      // Limitar el número de partículas
      if (this.particles.length > this.config.particleCount) {
        this.particles.shift()
      }
    }

    updateParticles(deltaTime) {
      const now = Date.now()

      // Actualizar cada partícula
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i]

        // Calcular tiempo de vida restante
        const age = now - p.born
        const lifeRatio = age / p.lifespan

        // Eliminar partículas muertas
        if (age >= p.lifespan) {
          this.particles.splice(i, 1)
          continue
        }

        // Actualizar opacidad basada en vida con curva suave
        // Fade in al principio, mantener, fade out al final
        if (lifeRatio < 0.1) {
          // Fade in
          p.alpha = this.config.particleOpacity * (lifeRatio / 0.1)
        } else if (lifeRatio > 0.8) {
          // Fade out
          p.alpha = this.config.particleOpacity * (1 - (lifeRatio - 0.8) / 0.2)
        } else {
          // Mantener
          p.alpha = this.config.particleOpacity
        }

        // Actualizar colores para efecto arcoíris si está habilitado
        if (this.config.useRainbowColors && p.color.colorSpeed) {
          // Actualizar posición en el ciclo de color
          p.color.colorPosition += p.color.colorSpeed * (deltaTime / 16)

          // Obtener colores base para la transición
          const baseIndex =
            Math.floor((p.color.colorPosition / (2 * Math.PI)) * this.config.colorSchemes.rainbow.length) %
            this.config.colorSchemes.rainbow.length
          const nextIndex = (baseIndex + 1) % this.config.colorSchemes.rainbow.length

          const baseColor = this.config.colorSchemes.rainbow[baseIndex]
          const nextColor = this.config.colorSchemes.rainbow[nextIndex]

          // Calcular factor de interpolación
          const t = ((p.color.colorPosition / (2 * Math.PI)) * this.config.colorSchemes.rainbow.length) % 1

          // Interpolar colores
          p.color.r = baseColor.r + (nextColor.r - baseColor.r) * t
          p.color.g = baseColor.g + (nextColor.g - baseColor.g) * t
          p.color.b = baseColor.b + (nextColor.b - baseColor.b) * t
        }

        // Aplicar el decaimiento de velocidad
        p.velocity.x *= this.config.velocityDecay
        p.velocity.y *= this.config.velocityDecay

        // Calcular distancia al cursor
        const dx = this.mouse.x - p.x
        const dy = this.mouse.y - p.y
        const distanceToCursor = Math.sqrt(dx * dx + dy * dy)

        // Aplicar atracción gravitacional al cursor (más sutil)
        if (distanceToCursor < this.config.cursorInfluenceRadius) {
          const attraction = this.config.gravitationalPull * (1 - distanceToCursor / this.config.cursorInfluenceRadius)
          p.velocity.x += dx * attraction * (deltaTime / 16)
          p.velocity.y += dy * attraction * (deltaTime / 16)
        }

        // Interacción con elementos de la página (más sutil)
        if (this.config.interactWithPage) {
          p.nearElement = false

          for (const element of this.interactiveElements) {
            const rect = element.getBoundingClientRect()

            // Verificar si la partícula está cerca del elemento
            if (p.x >= rect.left - 15 && p.x <= rect.right + 15 && p.y >= rect.top - 15 && p.y <= rect.bottom + 15) {
              p.nearElement = true

              // Calcular fuerza de repulsión desde el centro del elemento (más sutil)
              const elementCenterX = (rect.left + rect.right) / 2
              const elementCenterY = (rect.top + rect.bottom) / 2
              const dxElement = p.x - elementCenterX
              const dyElement = p.y - elementCenterY
              const distToCenter = Math.sqrt(dxElement * dxElement + dyElement * dyElement)

              if (distToCenter > 0) {
                const repulsionForce = 0.03 * (deltaTime / 16)
                p.velocity.x += (dxElement / distToCenter) * repulsionForce
                p.velocity.y += (dyElement / distToCenter) * repulsionForce
              }

              break
            }
          }
        }

        // Evitar interacción con los botones de cierre de Easter eggs
        const closeButtons = document.querySelectorAll(".close-button")
        for (const closeButton of closeButtons) {
          const rect = closeButton.getBoundingClientRect()
          // Crear una zona de exclusión más amplia alrededor de los botones de cierre
          if (p.x >= rect.left - 30 && p.x <= rect.right + 30 && p.y >= rect.top - 30 && p.y <= rect.bottom + 30) {
            // Alejar las partículas de los botones de cierre
            const buttonCenterX = (rect.left + rect.right) / 2
            const buttonCenterY = (rect.top + rect.bottom) / 2
            const dxButton = p.x - buttonCenterX
            const dyButton = p.y - buttonCenterY
            const distToButton = Math.sqrt(dxButton * dxButton + dyButton * dyButton)

            if (distToButton > 0) {
              // Fuerza de repulsión más fuerte para alejar las partículas
              const repulsionForce = 0.1 * (deltaTime / 16)
              p.velocity.x += (dxButton / distToButton) * repulsionForce
              p.velocity.y += (dyButton / distToButton) * repulsionForce
            }
          }
        }

        // Actualizar rotación (más lenta)
        p.rotation += p.rotationSpeed * (deltaTime / 16)

        // Actualizar posición
        p.x += p.velocity.x * (deltaTime / 16)
        p.y += p.velocity.y * (deltaTime / 16)
      }
    }

    detectDarkMode() {
      const root = document.documentElement
      return (
        root.classList.contains("dark-mode") ||
        root.classList.contains("dark") ||
        (!root.classList.contains("light-mode") &&
          !root.classList.contains("light") &&
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      )
    }

    detectMobile() {
      return window.matchMedia("(pointer: coarse)").matches
    }

    setupThemeDetection() {
      // Observar cambios en las clases del documento
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === "class") {
            this.isDarkMode = this.detectDarkMode()
          }
        })
      })

      observer.observe(document.documentElement, { attributes: true })

      // Detectar cambios en la preferencia de color del sistema
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      mediaQuery.addEventListener("change", () => {
        this.isDarkMode = this.detectDarkMode()
      })
    }

    animate() {
      // Calcular tiempo transcurrido desde el último frame
      const now = Date.now()
      const deltaTime = now - this.lastUpdate
      this.lastUpdate = now

      // Actualizar posición del cursor
      this.updateMousePosition()

      // Actualizar partículas
      this.updateParticles(deltaTime)

      // Limpiar canvas
      this.ctx.clearRect(
        0,
        0,
        this.canvas.width / window.devicePixelRatio,
        this.canvas.height / window.devicePixelRatio,
      )

      // Establecer modo de fusión
      this.ctx.globalCompositeOperation = this.config.blendMode

      // Dibujar partículas
      this.drawParticles()

      // Dibujar efecto de cursor (más sutil)
      if (this.isActive) {
        this.drawCursorEffect()
      }

      // Restaurar modo de fusión normal
      this.ctx.globalCompositeOperation = "source-over"

      // Continuar animación
      this.frameId = requestAnimationFrame(this.animate.bind(this))
    }

    drawParticles() {
      if (!this.ctx || this.particles.length === 0) return

      const ctx = this.ctx

      // Dibujar cada partícula
      for (const p of this.particles) {
        ctx.save()

        // Configurar estilo
        const colorStr = `rgba(${Math.round(p.color.r)}, ${Math.round(p.color.g)}, ${Math.round(p.color.b)}, ${p.alpha})`

        // Trasladar al centro de la partícula
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)

        // Dibujar según la forma seleccionada
        ctx.beginPath()

        switch (p.shape) {
          case "circle":
            // Dibujar círculo
            ctx.arc(0, 0, p.size, 0, Math.PI * 2)
            break

          case "square":
            // Dibujar cuadrado
            const halfSize = p.size * 0.9 // Ligeramente más pequeño que el tamaño completo
            ctx.rect(-halfSize, -halfSize, halfSize * 2, halfSize * 2)
            break

          case "sparkle":
          default:
            // Dibujar forma de brillo/estrella (rosa de los vientos)
            const outerRadius = p.size * 1.2 // Radio de las puntas
            const innerRadius = p.size * 0.5 // Radio interno (más pronunciado)

            // Dibujar primera forma de estrella (puntas principales)
            for (let i = 0; i < 4; i++) {
              const angle = (i * Math.PI) / 2
              const nextAngle = angle + Math.PI / 2

              ctx.moveTo(0, 0)
              ctx.lineTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius)
              ctx.lineTo(Math.cos(angle + Math.PI / 4) * innerRadius, Math.sin(angle + Math.PI / 4) * innerRadius)
              ctx.lineTo(Math.cos(nextAngle) * outerRadius, Math.sin(nextAngle) * outerRadius)
              ctx.lineTo(0, 0)
            }
            break
        }

        ctx.closePath()

        // Aplicar color y sombra más sutil
        ctx.fillStyle = colorStr
        ctx.shadowColor = this.isDarkMode ? this.config.colorSchemes.dark.shadow : this.config.colorSchemes.light.shadow
        ctx.shadowBlur = 6 // Reducido de 10 a 6
        ctx.fill()

        ctx.restore()
      }
    }

    drawCursorEffect() {
      if (!this.ctx) return

      const ctx = this.ctx
      const radius = 15 // Reducido de 20 a 15

      // Usar colores del arcoíris para el efecto del cursor
      // Calcular color basado en un ciclo temporal
      const time = Date.now() * 0.001 // convertir a segundos
      const colorPos = (time % 7) / 7 // ciclo entre 0-1 basado en 7 colores

      // Obtener color del arcoíris basado en tiempo
      const rainbowIndex = Math.floor(colorPos * this.config.colorSchemes.rainbow.length)
      const nextIndex = (rainbowIndex + 1) % this.config.colorSchemes.rainbow.length
      const t = (colorPos * this.config.colorSchemes.rainbow.length) % 1

      const baseColor = this.config.colorSchemes.rainbow[rainbowIndex]
      const nextColor = this.config.colorSchemes.rainbow[nextIndex]

      // Interpolar entre colores
      const r = Math.round(baseColor.r + (nextColor.r - baseColor.r) * t)
      const g = Math.round(baseColor.g + (nextColor.g - baseColor.g) * t)
      const b = Math.round(baseColor.b + (nextColor.b - baseColor.b) * t)

      // Crear un gradiente radial para el efecto del cursor (más sutil)
      const gradient = ctx.createRadialGradient(this.mouse.x, this.mouse.y, 1, this.mouse.x, this.mouse.y, radius)

      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.2)`)
      gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.07)`)
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

      // Dibujar círculo de efecto
      ctx.beginPath()
      ctx.arc(this.mouse.x, this.mouse.y, radius, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()
    }

    destroy() {
      if (this.frameId) {
        cancelAnimationFrame(this.frameId)
      }

      if (this.canvas && this.canvas.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas)
      }

      window.removeEventListener("resize", this.resizeCanvas.bind(this))
      document.removeEventListener("mousemove", this.onMouseMove.bind(this))
      document.removeEventListener("mouseenter", this.onMouseEnter.bind(this))
      document.removeEventListener("mouseleave", this.onMouseLeave.bind(this))
    }
  }

  //
  // INICIALIZACIÓN
  //

  // Función para verificar si la terminal está activa
  const isTerminalActive = () => {
    return document.querySelector(".terminal-overlay") !== null
  }

  // Función para inicializar los efectos visuales
  const initVisualEffects = () => {
    // Inicializar estela de partículas
    window.particleTrail = new ParticleTrail()
  }

  // Inicializar efectos cuando el DOM esté listo
  document.addEventListener("DOMContentLoaded", () => {
    // Si no hay terminal, inicializar efectos inmediatamente
    if (!isTerminalActive()) {
      initVisualEffects()
      return
    }

    // Si hay terminal, esperar a que se cierre
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.removedNodes.length > 0) {
          // Verificar si la terminal fue eliminada
          const terminalRemoved = Array.from(mutation.removedNodes).some(
            (node) => node.classList && node.classList.contains("terminal-overlay"),
          )

          if (terminalRemoved) {
            // Inicializar efectos visuales después de que la terminal se cierre
            initVisualEffects()
            // Desconectar el observador
            observer.disconnect()
          }
        }
      })
    })

    // Configurar el observador
    observer.observe(document.body, { childList: true })
  })

  // Exponer clases globalmente para posible uso en otros scripts
  window.VisualEffects = {
    ParticleTrail,
  }
})()

