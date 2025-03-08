/**
 * Detector de Formatos Multimedia
 * Este script detecta la compatibilidad del navegador con diferentes formatos
 * y actualiza dinámicamente las fuentes de los recursos multimedia.
 * v1.0.1 - Incluye soporte para lazy loading de videos
 */

// IIFE para evitar contaminación del ámbito global
;(function() {
    // Objeto para almacenar la compatibilidad con formatos
    const formatSupport = {
      avif: false,
      webp: false,
      webm: false
    };
  
    /**
     * Detecta la compatibilidad con formato AVIF
     * @returns {Promise<boolean>} Promesa que resuelve a true si AVIF es soportado
     */
    function checkAvifSupport() {
      return new Promise(resolve => {
        const img = new Image();
        img.onload = function() {
          // Si la imagen carga con altura, el formato es soportado
          resolve(img.height === 1);
        };
        img.onerror = function() {
          resolve(false);
        };
        // Imagen AVIF de 1x1 píxel en base64
        img.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
      });
    }
  
    /**
     * Detecta la compatibilidad con formato WebP
     * @returns {Promise<boolean>} Promesa que resuelve a true si WebP es soportado
     */
    function checkWebpSupport() {
      return new Promise(resolve => {
        const img = new Image();
        img.onload = function() {
          resolve(img.height === 1);
        };
        img.onerror = function() {
          resolve(false);
        };
        // Imagen WebP de 1x1 píxel en base64
        img.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
      });
    }
  
    /**
     * Detecta la compatibilidad con formato WebM
     * @returns {Promise<boolean>} Promesa que resuelve a true si WebM es soportado
     */
    function checkWebmSupport() {
      const video = document.createElement('video');
      return Promise.resolve(!!video.canPlayType('video/webm; codecs="vp8, vorbis"'));
    }
  
    /**
     * Actualiza las fuentes de las imágenes según la compatibilidad
     * @param {Object} support Objeto con la compatibilidad de formatos
     */
    function updateImageSources(support) {
      // Actualizar logo según el tema y compatibilidad
      updateLogoSources(support);
      
      // Actualizar bola de disco
      if (support.webp) {
        const discoBall = document.getElementById('discoBall');
        if (discoBall) {
          // Asegurarse de que la fuente WebP esté disponible antes de cambiar
          const webpSource = discoBall.parentElement.querySelector('source[type="image/webp"]');
          if (webpSource && webpSource.srcset) {
            discoBall.setAttribute('data-original-src', discoBall.src);
            // No cambiamos la src directamente para mantener la compatibilidad con el script existente
          }
        }
      }
    }
  
    /**
     * Actualiza las fuentes de los videos según la compatibilidad
     * @param {Object} support Objeto con la compatibilidad de formatos
     */
    function updateVideoSources(support) {
      // Configurar los contenedores de video para carga diferida
      setupLazyVideoContainers(support);
    }
  
    /**
     * Configura los contenedores de video para carga diferida
     * @param {Object} support Objeto con la compatibilidad de formatos
     */
    function setupLazyVideoContainers(support) {
      // Almacenar la información de compatibilidad para que el script principal la use
      window.videoFormatSupport = {
        webm: support.webm,
        preferredFormat: support.webm ? 'webm' : 'mp4'
      };
      
      console.log('Configuración de videos diferidos completada. Formato preferido:', window.videoFormatSupport.preferredFormat);
    }
  
    /**
     * Actualiza las fuentes del logo según el tema y compatibilidad
     * @param {Object} support Objeto con la compatibilidad de formatos
     */
    function updateLogoSources(support) {
      // Obtener referencias a los elementos
      const logoImage = document.getElementById('logo-image');
      if (!logoImage) return;
  
      // Determinar el tema actual
      const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = document.documentElement.classList.contains('light-mode') ? 'light' : 
                   document.documentElement.classList.contains('dark-mode') ? 'dark' : 
                   isDarkMode ? 'dark' : 'light';
      
      // Actualizar las fuentes según compatibilidad y tema
      if (support.avif) {
        const avifSource = theme === 'dark' ? 
                          document.getElementById('logo-avif') : 
                          document.getElementById('logo-avif-light');
        if (avifSource && avifSource.srcset) {
          logoImage.setAttribute('data-original-src', logoImage.src);
          // No cambiamos la src directamente para mantener la compatibilidad con el script existente
        }
      } else if (support.webp) {
        const webpSource = theme === 'dark' ? 
                          document.getElementById('logo-webp') : 
                          document.getElementById('logo-webp-light');
        if (webpSource && webpSource.srcset) {
          logoImage.setAttribute('data-original-src', logoImage.src);
          // No cambiamos la src directamente para mantener la compatibilidad con el script existente
        }
      }
      
      // Observar cambios en el tema para actualizar las fuentes
      const themeToggle = document.getElementById('theme-toggle');
      if (themeToggle) {
        themeToggle.addEventListener('click', () => {
          // Esperar a que se actualice el DOM
          setTimeout(() => updateLogoSources(support), 50);
        });
      }
      
      // Observar cambios en la preferencia de color del sistema
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', () => {
        // Solo actualizar si no hay un tema explícito establecido
        if (!document.documentElement.classList.contains('light-mode') && 
            !document.documentElement.classList.contains('dark-mode')) {
          setTimeout(() => updateLogoSources(support), 50);
        }
      });
    }
  
    /**
     * Inicializa la detección de formatos y actualiza las fuentes
     */
    async function init() {
      try {
        // Detectar compatibilidad con formatos
        const [avifSupport, webpSupport, webmSupport] = await Promise.all([
          checkAvifSupport(),
          checkWebpSupport(),
          checkWebmSupport()
        ]);
        
        // Almacenar resultados
        formatSupport.avif = avifSupport;
        formatSupport.webp = webpSupport;
        formatSupport.webm = webmSupport;
        
        console.log('Compatibilidad de formatos detectada:', formatSupport);
        
        // Actualizar fuentes según compatibilidad
        updateImageSources(formatSupport);
        updateVideoSources(formatSupport);
        
        // Exponer la compatibilidad globalmente para que otros scripts puedan usarla
        window.formatSupport = formatSupport;
      } catch (error) {
        console.error('Error al detectar la compatibilidad de formatos:', error);
      }
    }
  
    // Iniciar detección cuando el DOM esté listo
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  })();