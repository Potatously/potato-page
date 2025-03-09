v// Este script maneja la lógica de navegación para la terminal
// y determina cuándo debe mostrarse la terminal

// Función para detectar si la página está siendo recargada o es una visita inicial
function shouldShowTerminal() {
    // Obtener el timestamp de la última vez que se mostró la terminal
    const lastTerminalTimestamp = sessionStorage.getItem('lastTerminalTimestamp');
    
    // Obtener el tipo de navegación
    const navigationType = getNavigationType();
    
    // Mostrar la terminal si:
    // 1. Es una recarga de página (navigationType es 'reload')
    // 2. Es una entrada directa (navigationType es 'navigate' y no hay timestamp previo)
    const shouldShow = 
      navigationType === 'reload' || 
      (navigationType === 'navigate' && !lastTerminalTimestamp);
    
    // Si vamos a mostrar la terminal, actualizar el timestamp
    if (shouldShow) {
      sessionStorage.setItem('lastTerminalTimestamp', Date.now());
    }
    
    return shouldShow;
  }
  
  // Función para determinar el tipo de navegación
  function getNavigationType() {
    // Usar la API de Navigation Timing si está disponible
    if (window.performance && window.performance.navigation) {
      const navType = window.performance.navigation.type;
      
      // 0 es navegación directa, 1 es recarga, 2 es navegación atrás/adelante
      if (navType === 0) return 'navigate';
      if (navType === 1) return 'reload';
      if (navType === 2) return 'back_forward';
      return 'unknown';
    } 
    // Usar la API más moderna si está disponible
    else if (window.performance && window.performance.getEntriesByType && window.performance.getEntriesByType('navigation').length) {
      return window.performance.getEntriesByType('navigation')[0].type;
    }
    // Fallback: usar un enfoque basado en referrer
    else {
      // Si no hay referrer o el referrer es de otro dominio, considerarlo como navegación directa
      const referrer = document.referrer;
      const currentHost = window.location.hostname;
      
      if (!referrer || !referrer.includes(currentHost)) {
        return 'navigate';
      }
      
      // Si el referrer es del mismo dominio, considerarlo como navegación interna
      return 'back_forward';
    }
  }
  
  // Exportar la función para que pueda ser usada por terminal.js
  window.shouldShowTerminal = shouldShowTerminal;