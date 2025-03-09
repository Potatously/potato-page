// Este script maneja la lógica de navegación para la terminal
// y determina cuándo debe mostrarse la terminal

// Función para obtener la URL actual sin parámetros
function getCurrentPath() {
    return window.location.pathname;
  }
  
  // Función para verificar si debemos mostrar la terminal
  function shouldShowTerminal() {
    // Obtener la última página visitada de sessionStorage
    const lastPage = sessionStorage.getItem('lastPage');
    const currentPath = getCurrentPath();
    
    // Si no hay última página o si la última página es diferente a la actual,
    // significa que es una navegación directa o un refresh
    const isDirectNavigation = !lastPage || lastPage !== currentPath;
    
    // Actualizar la última página visitada
    sessionStorage.setItem('lastPage', currentPath);
    
    // Si es una navegación directa (recarga o entrada directa), mostrar terminal
    return isDirectNavigation;
  }
  
  // Exportar la función para que pueda ser usada por terminal.js
  window.shouldShowTerminal = shouldShowTerminal;