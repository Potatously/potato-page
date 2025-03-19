/**
 * performance-analytics.js - Implementa carga diferida, monitoreo de rendimiento y análisis
 * Versión: 3.0.0
 * Fusión de: performance.js + analytics.js
 */

// IIFE para encapsular la funcionalidad de rendimiento y análisis
;(() => {
  //
  // SECCIÓN 1: ANALYTICS
  //

  // 1. GoatCounter Analytics
  ;(() => {
    const script = document.createElement("script");
    script.src = "//gc.zgo.at/count.js";
    script.async = true;
    script.dataset.goatcounter = "https://2808.goatcounter.com/count";
    document.head.appendChild(script);
  })();

  // 2. Umami Analytics
  ;(() => {
    const script = document.createElement("script");
    script.src = "https://cloud.umami.is/script.js";
    script.defer = true;
    script.dataset.websiteId = "83596513-8393-4bcb-b2ec-00fbe8354576";
    document.head.appendChild(script);
  })();

  // 3. Minimal GA4
  const MinimalGA4 = {
    trackingId: "G-27Z6B3Q2J5",

    storage: {
      local: localStorage,
      session: sessionStorage,
    },
    doc: document,
    win: window,
    nav: navigator,
    screen: screen,

    downloadExtensions: [
      "pdf",
      "xls",
      "xlsx",
      "doc",
      "docx",
      "txt",
      "rtf",
      "csv",
      "exe",
      "key",
      "pps",
      "ppt",
      "pptx",
      "7z",
      "pkg",
      "rar",
      "gz",
      "zip",
      "avi",
      "mov",
      "mp4",
      "mpe",
      "mpeg",
      "wmv",
      "mid",
      "midi",
      "mp3",
      "wav",
      "wma",
    ],

    searchParams: ["q", "s", "search", "query", "keyword"],

    generateId: () => Math.floor(Math.random() * 1000000000) + 1,
    generateTimestamp: () => Math.floor(Date.now() / 1000),

    getClientId() {
      if (!this.storage.local.cid_v4) {
        this.storage.local.cid_v4 = `${this.generateId()}.${this.generateTimestamp()}`;
      }
      return this.storage.local.cid_v4;
    },

    getSessionId() {
      if (!this.storage.session.sid) {
        this.storage.session.sid = this.generateTimestamp();
      }
      return this.storage.session.sid;
    },

    getSessionCount() {
      if (!this.storage.session.sct) {
        this.storage.session.sct = 1;
      }
      return this.storage.session.sct;
    },

    isFirstVisit() {
      return !this.storage.local.cid_v4 ? 1 : undefined;
    },

    isNewSession() {
      if (!this.storage.session._ss) {
        this.storage.session._ss = 1;
        return 1;
      }
      return undefined;
    },

    getSearchTerm() {
      const searchParams = new URLSearchParams(this.doc.location.search);
      for (const param of this.searchParams) {
        const value = searchParams.get(param);
        if (value) return value;
      }
      return undefined;
    },

    send(eventData = {}) {
      const defaultData = {
        v: 2,
        tid: this.trackingId,
        _p: this.storage.session._p || (this.storage.session._p = this.generateId()),
        sr: `${this.screen.width * this.win.devicePixelRatio}x${this.screen.height * this.win.devicePixelRatio}`,
        ul: (this.nav.language || undefined)?.toLowerCase(),
        cid: this.getClientId(),
        _fv: this.isFirstVisit(),
        _s: 1,
        dl: this.doc.location.href,
        dt: this.doc.title || undefined,
        dr: this.doc.referrer || undefined,
        sid: this.getSessionId(),
        sct: this.getSessionCount(),
        seg: 1,
        _ss: this.isNewSession(),
      };

      const data = new URLSearchParams({
        ...defaultData,
        ...eventData,
      });

      const url = "https://www.google-analytics.com/g/collect";

      if (this.nav.sendBeacon) {
        this.nav.sendBeacon(`${url}?${data.toString()}`);
      } else {
        fetch(url, {
          method: "POST",
          body: data,
        });
      }
    },

    trackPageView() {
      const searchTerm = this.getSearchTerm();
      this.send({
        en: searchTerm ? "view_search_results" : "page_view",
        ...(searchTerm && { "ep.search_term": searchTerm }),
      });
    },

    trackScroll() {
      const docEl = this.doc.documentElement;
      const docBody = this.doc.body;

      const calculateScroll = () => {
        return (
          ((docEl.scrollTop || docBody.scrollTop) /
            ((docEl.scrollHeight || docBody.scrollHeight) - docEl.clientHeight)) *
          100
        );
      };

      let scrollTracked = false;

      this.doc.addEventListener(
        "scroll",
        () => {
          if (!scrollTracked && calculateScroll() >= 90) {
            scrollTracked = true;
            this.send({
              en: "scroll",
              "epn.percent_scrolled": 90,
            });
          }
        },
        { passive: true },
      );
    },

    trackDownloads() {
      this.doc.addEventListener(
        "click",
        (e) => {
          const link = e.target.closest("a");
          if (!link?.href) return;

          const url = new URL(link.href);
          const filename = url.pathname.split("/").pop() || "";
          const extension = filename.split(".").pop()?.toLowerCase();

          if (link.hasAttribute("download") || this.downloadExtensions.includes(extension)) {
            this.send({
              en: "file_download",
              "ep.file_extension": extension,
              "ep.file_name": filename.replace(`.${extension}`, ""),
              "ep.link_text": link.textContent.trim(),
              "ep.link_url": url.pathname,
            });
          }
        },
        { passive: true },
      );
    },

    init() {
      this.trackPageView();
      this.trackScroll();
      this.trackDownloads();
    },
  };

  // Initialize Minimal GA4
  MinimalGA4.init();

  //
  // SECCIÓN 2: MONITOREO DE RENDIMIENTO
  //

  // Objeto para almacenar métricas de rendimiento
  const performanceMetrics = {
    pageLoad: null,
    resourcesLoad: {},
    interactions: [],
    errors: [],
  };

  // Función para registrar métricas de carga de página
  function recordPageLoadMetrics() {
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;

      performanceMetrics.pageLoad = {
        total: timing.loadEventEnd - timing.navigationStart,
        domReady: timing.domComplete - timing.domLoading,
        networkLatency: timing.responseEnd - timing.requestStart,
        domInteractive: timing.domInteractive - timing.navigationStart,
        firstPaint: getFirstPaint(),
      };

      // Registrar en consola (solo en desarrollo)
      if (isDevelopment()) {
        console.log("📊 Métricas de carga de página:", performanceMetrics.pageLoad);
      }
    }
  }

  // Función para obtener el tiempo del primer pintado
  function getFirstPaint() {
    if (window.performance && window.performance.getEntriesByType) {
      const paintMetrics = window.performance.getEntriesByType("paint");
      const firstPaint = paintMetrics.find((metric) => metric.name === "first-paint");

      if (firstPaint) {
        return firstPaint.startTime;
      }
    }
    return null;
  }

  // Función para registrar métricas de recursos
  function recordResourceMetrics() {
    if (window.performance && window.performance.getEntriesByType) {
      const resources = window.performance.getEntriesByType("resource");

      resources.forEach((resource) => {
        const fileType = getFileType(resource.name);

        if (!performanceMetrics.resourcesLoad[fileType]) {
          performanceMetrics.resourcesLoad[fileType] = [];
        }

        performanceMetrics.resourcesLoad[fileType].push({
          name: resource.name,
          duration: resource.duration,
          size: resource.transferSize || "unknown",
          startTime: resource.startTime,
        });
      });

      // Registrar en consola (solo en desarrollo)
      if (isDevelopment()) {
        console.log("📊 Métricas de recursos:", performanceMetrics.resourcesLoad);
      }
    }
  }

  // Función para determinar el tipo de archivo
  function getFileType(url) {
    const extension = url.split(".").pop().split("?")[0].toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp", "avif", "svg"].includes(extension)) {
      return "image";
    } else if (["js"].includes(extension)) {
      return "script";
    } else if (["css"].includes(extension)) {
      return "style";
    } else if (["mp4", "webm"].includes(extension)) {
      return "video";
    } else if (["mp3", "wav", "ogg"].includes(extension)) {
      return "audio";
    } else {
      return "other";
    }
  }

  // Función para registrar interacciones del usuario
  function recordUserInteraction(type, details) {
    const timestamp = performance.now();

    performanceMetrics.interactions.push({
      type,
      details,
      timestamp,
    });

    // Limitar el número de interacciones almacenadas
    if (performanceMetrics.interactions.length > 100) {
      performanceMetrics.interactions.shift();
    }
  }

  // Función para registrar errores
  function recordError(error, source) {
    performanceMetrics.errors.push({
      message: error.message || "Unknown error",
      source: source || "unknown",
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    // Registrar en consola (solo en desarrollo)
    if (isDevelopment()) {
      console.error("🔴 Error registrado:", error, source);
    }
  }

  // Función para verificar si estamos en entorno de desarrollo
  function isDevelopment() {
    return (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname.includes(".local")
    );
  }

  //
  // SECCIÓN 3: CARGA DIFERIDA
  //

  // Implementación de carga diferida para imágenes
  function setupLazyLoading() {
    // Verificar soporte para IntersectionObserver
    if ("IntersectionObserver" in window) {
      const lazyImages = document.querySelectorAll("img[data-src], source[data-srcset]");

      const imageObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const lazyImage = entry.target;

              if (lazyImage.dataset.src) {
                lazyImage.src = lazyImage.dataset.src;
                lazyImage.removeAttribute("data-src");
              }

              if (lazyImage.dataset.srcset) {
                lazyImage.srcset = lazyImage.dataset.srcset;
                lazyImage.removeAttribute("data-srcset");
              }

              lazyImage.classList.remove("lazy");
              imageObserver.unobserve(lazyImage);

              // Registrar carga de imagen diferida
              recordUserInteraction("lazyImageLoaded", {
                src: lazyImage.src || lazyImage.srcset,
              });
            }
          });
        },
        {
          rootMargin: "200px 0px", // Cargar imágenes cuando estén a 200px de entrar en la pantalla
        },
      );

      lazyImages.forEach((image) => {
        imageObserver.observe(image);
      });
    } else {
      // Fallback para navegadores que no soportan IntersectionObserver
      const lazyImages = document.querySelectorAll("img[data-src], source[data-srcset]");

      // Cargar todas las imágenes inmediatamente
      lazyImages.forEach((image) => {
        if (image.dataset.src) {
          image.src = image.dataset.src;
          image.removeAttribute("data-src");
        }

        if (image.dataset.srcset) {
          image.srcset = image.dataset.srcset;
          image.removeAttribute("data-srcset");
        }

        image.classList.remove("lazy");
      });
    }
  }

  // Implementación de carga diferida para videos
  function setupLazyVideoLoading() {
    if ("IntersectionObserver" in window) {
      const lazyVideos = document.querySelectorAll("video[data-src]");

      const videoObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const lazyVideo = entry.target;

              // Cargar las fuentes del video
              if (lazyVideo.dataset.src) {
                const sources = lazyVideo.querySelectorAll("source");

                sources.forEach((source) => {
                  if (source.dataset.src) {
                    source.src = source.dataset.src;
                    source.removeAttribute("data-src");
                  }
                });

                lazyVideo.load();
                lazyVideo.removeAttribute("data-src");
              }

              lazyVideo.classList.remove("lazy");
              videoObserver.unobserve(lazyVideo);

              // Registrar carga de video diferida
              recordUserInteraction("lazyVideoLoaded", {
                src: lazyVideo.querySelector("source")?.src || "unknown",
              });
            }
          });
        },
        {
          rootMargin: "200px 0px",
        },
      );

      lazyVideos.forEach((video) => {
        videoObserver.observe(video);
      });
    } else {
      // Fallback para navegadores que no soportan IntersectionObserver
      const lazyVideos = document.querySelectorAll("video[data-src]");

      lazyVideos.forEach((video) => {
        const sources = video.querySelectorAll("source");

        sources.forEach((source) => {
          if (source.dataset.src) {
            source.src = source.dataset.src;
            source.removeAttribute("data-src");
          }
        });

        video.load();
        video.removeAttribute("data-src");
        video.classList.remove("lazy");
      });
    }
  }

  // Función para convertir imágenes y videos existentes a carga diferida
  function convertExistingMediaToLazy() {
    // Convertir imágenes (excepto el logo y otras imágenes críticas)
    const images = document.querySelectorAll("img:not(#logo-image):not(.critical-image)");

    images.forEach((img) => {
      if (img.src && !img.dataset.src) {
        img.dataset.src = img.src;
        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
        img.classList.add("lazy");
      }
    });

    // Convertir videos (excepto los que ya están en reproducción)
    const videos = document.querySelectorAll("video:not(.playing)");

    videos.forEach((video) => {
      const sources = video.querySelectorAll("source");

      if (sources.length && !video.dataset.src) {
        video.dataset.src = "lazy";

        sources.forEach((source) => {
          source.dataset.src = source.src;
          source.removeAttribute("src");
        });

        video.classList.add("lazy");
        video.load();
      }
    });
  }

  // Función para obtener todas las métricas de rendimiento
  function getPerformanceReport() {
    return {
      ...performanceMetrics,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };
  }

  // Función para enviar métricas a un servicio de análisis (simulado)
  function sendPerformanceMetrics() {
    const report = getPerformanceReport();

    // En un entorno real, aquí enviarías los datos a un servicio de análisis
    // Por ahora, solo los mostramos en la consola en modo desarrollo
    if (isDevelopment()) {
      console.log("📊 Informe de rendimiento completo:", report);
    }

    // Ejemplo de cómo enviar los datos (comentado)
    /*
    fetch('/api/performance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(report)
    }).catch(err => console.error('Error al enviar métricas:', err));
    */
  }

  // Registrar eventos de interacción del usuario
  document.addEventListener("click", (e) => {
    const target = e.target;
    const tagName = target.tagName.toLowerCase();
    const id = target.id || "unknown";
    const classes = Array.from(target.classList).join(" ") || "none";

    recordUserInteraction("click", { tagName, id, classes });
  });

  // Registrar errores globales
  window.addEventListener("error", (e) => {
    recordError(e.error || new Error(e.message), e.filename);
  });

  // Registrar promesas rechazadas no manejadas
  window.addEventListener("unhandledrejection", (e) => {
    recordError(e.reason, "unhandled promise rejection");
  });

  // Inicializar cuando el DOM esté listo
  document.addEventListener("DOMContentLoaded", () => {
    // Configurar carga diferida
    setupLazyLoading();
    setupLazyVideoLoading();

    // Registrar métricas iniciales
    recordPageLoadMetrics();
  });

  // Registrar métricas de recursos cuando la página esté completamente cargada
  window.addEventListener("load", () => {
    recordResourceMetrics();

    // Convertir medios existentes a carga diferida después de la carga inicial
    // Nota: Esto solo afectará a medios que aún no están en la vista
    setTimeout(() => {
      convertExistingMediaToLazy();
    }, 1000);

    // Enviar métricas después de un tiempo para incluir interacciones iniciales
    setTimeout(() => {
      sendPerformanceMetrics();
    }, 5000);
  });

  // Exponer funciones útiles globalmente
  window.performanceMonitor = {
    getReport: getPerformanceReport,
    recordInteraction: recordUserInteraction,
    recordError: recordError,
  };
})();