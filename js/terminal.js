// Terminal Welcome Screen Script
document.addEventListener("DOMContentLoaded", () => {
    // Create terminal overlay
    const terminalOverlay = document.createElement("div")
    terminalOverlay.className = "terminal-overlay"
  
    // Create terminal container
    const terminalContainer = document.createElement("div")
    terminalContainer.className = "terminal-container"
  
    // Create terminal lines
    const line1 = document.createElement("p")
    line1.className = "terminal-line"
    line1.textContent = "Inicializando sistema..."
  
    const line2 = document.createElement("p")
    line2.className = "terminal-line"
    line2.textContent = "Autenticando usuario..."
  
    const line3 = document.createElement("p")
    line3.className = "terminal-line"
    line3.textContent = "Verificando acceso..."
  
    // Create access granted message
    const accessGranted = document.createElement("div")
    accessGranted.className = "terminal-access"
    accessGranted.textContent = "Acceso concedido."
  
    // Create click to enter message
    const clickToEnter = document.createElement("div")
    clickToEnter.className = "terminal-click"
    clickToEnter.textContent = "[ Hacer clic para ingresar ]"
  
    // Append elements to container
    terminalContainer.appendChild(line1)
    terminalContainer.appendChild(line2)
    terminalContainer.appendChild(line3)
    terminalContainer.appendChild(accessGranted)
    terminalContainer.appendChild(clickToEnter)
  
    // Append container to overlay
    terminalOverlay.appendChild(terminalContainer)
  
    // Append overlay to body
    document.body.appendChild(terminalOverlay)
  
    // Prevent scrolling while terminal is active
    document.body.style.overflow = "hidden"
  
    // Animation sequence
    setTimeout(() => {
      line1.classList.add("visible")
  
      setTimeout(() => {
        line1.classList.remove("visible")
  
        setTimeout(() => {
          line2.classList.add("visible")
  
          setTimeout(() => {
            line2.classList.remove("visible")
  
            setTimeout(() => {
              line3.classList.add("visible")
  
              setTimeout(() => {
                line3.classList.remove("visible")
  
                setTimeout(() => {
                  accessGranted.classList.add("visible")
  
                  setTimeout(() => {
                    clickToEnter.classList.add("visible")
                  }, 1000)
                }, 500)
              }, 1500)
            }, 300)
          }, 1500)
        }, 300)
      }, 1500)
    }, 500)
  
    // Handle click to enter
    terminalOverlay.addEventListener("click", () => {
      // Only proceed if the click to enter message is visible
      if (clickToEnter.classList.contains("visible")) {
        terminalOverlay.classList.add("terminal-exit")
  
        // Remove overlay and restore scrolling after animation
        setTimeout(() => {
          document.body.removeChild(terminalOverlay)
          document.body.style.overflow = ""
        }, 1000)
      }
    })
  
    // Store terminal state in session storage to avoid showing it again on page refresh
    if (!sessionStorage.getItem("terminalShown")) {
      sessionStorage.setItem("terminalShown", "true")
    } else {
      // If already shown in this session, remove immediately
      document.body.removeChild(terminalOverlay)
      document.body.style.overflow = ""
    }
  })  