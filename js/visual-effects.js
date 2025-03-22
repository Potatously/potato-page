/**
 * visual-effects.js - Implementa efectos visuales para el sitio web
 * Versión: 1.0.0
 * Efectos: Estela del cursor
 */

// IIFE para encapsular la funcionalidad y evitar contaminación del ámbito global
;(() => {
    //
    // ESTELA DEL CURSOR
    //
  
    class CursorTrail {
      constructor() {
        // Configuración
        this.config = {
          particleCount: 14,
          particleRadius: 3,
          trailLength: 20,
          particleLife: 600,
          particleSpeed: 0.3,
          cursorGlow: true,
        }
  
        // Estado
        this.particles = []
        this.mouse = { x: 0, y: 0 }
        this.isActive = true
        this.lastPos = { x: 0, y: 0 }
        this.canvas = null
        this.ctx = null
        this.isDarkMode = this.detectDarkMode()
        this.frameId = null
        this.isMobile = this.detectMobile()
  
        // Inicializar
        this.init()
      }
  
      init() {
        // No inicializar en dispositivos móviles
        if (this.isMobile) return
  
        // Crear canvas
        this.canvas = document.createElement("canvas")
        this.canvas.className = "cursor-trail-canvas"
        this.ctx = this.canvas.getContext("2d")
  
        // Configurar canvas
        this.canvas.style.position = "fixed"
        this.canvas.style.top = "0"
        this.canvas.style.left = "0"
        this.canvas.style.width = "100%"
        this.canvas.style.height = "100%"
        this.canvas.style.pointerEvents = "none"
        this.canvas.style.zIndex = "9998" // Por debajo del z-index de la terminal (9999)
  
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
  
        // Iniciar animación
        this.animate()
      }
  
      resizeCanvas() {
        if (!this.canvas) return
  
        // Establecer tamaño del canvas al tamaño de la ventana con escala para dispositivos de alta densidad
        const dpr = window.devicePixelRatio || 1
        this.canvas.width = window.innerWidth * dpr
        this.canvas.height = window.innerHeight * dpr
  
        // Escalar el contexto
        this.ctx.scale(dpr, dpr)
      }
  
      onMouseMove(e) {
        this.mouse.x = e.clientX
        this.mouse.y = e.clientY
  
        // Crear partículas solo si el cursor se ha movido lo suficiente
        const dx = this.mouse.x - this.lastPos.x
        const dy = this.mouse.y - this.lastPos.y
        const distance = Math.sqrt(dx * dx + dy * dy)
  
        if (distance > 5) {
          this.createParticle()
          this.lastPos.x = this.mouse.x
          this.lastPos.y = this.mouse.y
        }
      }
  
      onMouseEnter() {
        this.isActive = true
      }
  
      onMouseLeave() {
        this.isActive = false
      }
  
      createParticle() {
        // Crear una nueva partícula en la posición del cursor
        const particle = {
          x: this.mouse.x,
          y: this.mouse.y,
          size: this.config.particleRadius * (Math.random() * 0.5 + 0.5),
          color: this.getParticleColor(),
          life: this.config.particleLife,
          createdAt: Date.now(),
          opacity: 1,
        }
  
        this.particles.push(particle)
  
        // Limitar el número de partículas
        if (this.particles.length > this.config.particleCount) {
          this.particles.shift()
        }
      }
  
      getParticleColor() {
        // Color basado en el tema actual
        if (this.isDarkMode) {
          // Modo oscuro: colores claros
          return `rgba(255, 255, 255, 0.8)`
        } else {
          // Modo claro: colores oscuros
          return `rgba(0, 0, 0, 0.6)`
        }
      }
  
      detectDarkMode() {
        // Detectar si el sitio está en modo oscuro
        const root = document.documentElement
        return (
          root.classList.contains("dark-mode") ||
          (!root.classList.contains("light-mode") &&
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches)
        )
      }
  
      detectMobile() {
        // Detectar si es un dispositivo móvil
        return window.matchMedia("(pointer: coarse)").matches
      }
  
      setupThemeDetection() {
        // Observar cambios en las clases del documento para detectar cambios de tema
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
          if (
            !document.documentElement.classList.contains("light-mode") &&
            !document.documentElement.classList.contains("dark-mode")
          ) {
            this.isDarkMode = mediaQuery.matches
          }
        })
      }
  
      animate() {
        if (!this.ctx) return
  
        // Limpiar canvas
        this.ctx.clearRect(
          0,
          0,
          this.canvas.width / window.devicePixelRatio,
          this.canvas.height / window.devicePixelRatio,
        )
  
        // Dibujar efecto de brillo alrededor del cursor si está activo
        if (this.config.cursorGlow && this.isActive) {
          this.drawCursorGlow()
        }
  
        // Actualizar y dibujar partículas
        const now = Date.now()
        this.particles = this.particles.filter((particle) => {
          const age = now - particle.createdAt
  
          // Calcular opacidad basada en la vida de la partícula
          particle.opacity = 1 - age / particle.life
  
          // Dibujar partícula si aún está viva
          if (age < particle.life) {
            this.drawParticle(particle)
            return true
          }
          return false
        })
  
        // Continuar animación
        this.frameId = requestAnimationFrame(this.animate.bind(this))
      }
  
      drawParticle(particle) {
        if (!this.ctx) return
  
        this.ctx.beginPath()
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
  
        // Usar color con opacidad
        const color = particle.color.replace(/[\d.]+\)$/, `${particle.opacity})`)
        this.ctx.fillStyle = color
  
        this.ctx.fill()
      }
  
      drawCursorGlow() {
        if (!this.ctx || !this.isActive) return
  
        // Crear un gradiente radial para el brillo del cursor
        const gradient = this.ctx.createRadialGradient(this.mouse.x, this.mouse.y, 1, this.mouse.x, this.mouse.y, 20)
  
        if (this.isDarkMode) {
          gradient.addColorStop(0, "rgba(255, 255, 255, 0.3)")
          gradient.addColorStop(1, "rgba(255, 255, 255, 0)")
        } else {
          gradient.addColorStop(0, "rgba(0, 0, 0, 0.2)")
          gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
        }
  
        this.ctx.beginPath()
        this.ctx.arc(this.mouse.x, this.mouse.y, 20, 0, Math.PI * 2)
        this.ctx.fillStyle = gradient
        this.ctx.fill()
      }
  
      // Método para limpiar recursos
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
      // Inicializar estela del cursor
      window.cursorTrail = new CursorTrail()
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
      CursorTrail,
    }
  })()
  
  