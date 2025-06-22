// ===== SISTEMA DE TEMAS MEJORADO =====

/**
 * Clase para manejar el sistema de temas de la aplicación
 */
class ManejadorTemas {
  constructor() {
    this.body = document.body
    this.temaActual = this.obtenerTemaGuardado()
    this.observadores = []

    this.inicializar()
  }

  /**
   * Inicializa el sistema de temas
   */
  inicializar() {
    this.aplicarTema(this.temaActual)
    this.configurarEventListeners()
    this.detectarPreferenciaSistema()

    console.log(`🎨 Sistema de temas inicializado. Tema actual: ${this.temaActual}`)
  }

  /**
   * Configura los event listeners para los botones de tema
   */
  configurarEventListeners() {
    // Buscar botones en toda la página
    const botonesClaro = document.querySelectorAll('[onclick*="activarModoClaro"], #btn-claro, .btn-claro')
    const botonesOscuro = document.querySelectorAll('[onclick*="activarModoOscuro"], #btn-oscuro, .btn-oscuro')

    botonesClaro.forEach((boton) => {
      boton.addEventListener("click", (e) => {
        e.preventDefault()
        this.cambiarTema("claro")
      })
    })

    botonesOscuro.forEach((boton) => {
      boton.addEventListener("click", (e) => {
        e.preventDefault()
        this.cambiarTema("oscuro")
      })
    })

    // Atajo de teclado para cambiar tema (Ctrl + Shift + T)
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "T") {
        e.preventDefault()
        this.alternarTema()
      }
    })
  }

  /**
   * Detecta la preferencia de tema del sistema
   */
  detectarPreferenciaSistema() {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

      // Si no hay tema guardado, usar preferencia del sistema
      if (!localStorage.getItem("modo")) {
        const temaPreferido = mediaQuery.matches ? "oscuro" : "claro"
        this.cambiarTema(temaPreferido)
      }

      // Escuchar cambios en la preferencia del sistema
      mediaQuery.addEventListener("change", (e) => {
        if (!localStorage.getItem("modo")) {
          const nuevoTema = e.matches ? "oscuro" : "claro"
          this.cambiarTema(nuevoTema)
        }
      })
    }
  }

  /**
   * Cambia el tema de la aplicación
   */
  cambiarTema(nuevoTema) {
    if (nuevoTema !== "claro" && nuevoTema !== "oscuro") {
      console.warn("⚠️ Tema inválido:", nuevoTema)
      return
    }

    const temaAnterior = this.temaActual
    this.temaActual = nuevoTema

    this.aplicarTema(nuevoTema)
    this.guardarTema(nuevoTema)
    this.actualizarBotones()
    this.notificarCambio(temaAnterior, nuevoTema)

    console.log(`🎨 Tema cambiado de ${temaAnterior} a ${nuevoTema}`)
  }

  /**
   * Alterna entre tema claro y oscuro
   */
  alternarTema() {
    const nuevoTema = this.temaActual === "claro" ? "oscuro" : "claro"
    this.cambiarTema(nuevoTema)
  }

  /**
   * Aplica el tema al DOM
   */
  aplicarTema(tema) {
    // Remover clases de tema existentes
    this.body.classList.remove("dark-mode", "light-mode", "modo-claro", "modo-oscuro")

    // Aplicar nueva clase de tema
    if (tema === "oscuro") {
      this.body.classList.add("dark-mode")
      document.documentElement.setAttribute("data-theme", "dark")
    } else {
      this.body.classList.add("light-mode")
      document.documentElement.setAttribute("data-theme", "light")
    }

    // Actualizar meta theme-color para móviles
    this.actualizarMetaThemeColor(tema)
  }

  /**
   * Actualiza el color de la barra de estado en móviles
   */
  actualizarMetaThemeColor(tema) {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]')

    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta")
      metaThemeColor.name = "theme-color"
      document.head.appendChild(metaThemeColor)
    }

    metaThemeColor.content = tema === "oscuro" ? "#121212" : "#2c3e50"
  }

  /**
   * Actualiza el estado visual de los botones
   */
  actualizarBotones() {
    const todosBotones = document.querySelectorAll(".modo-toggle button")

    todosBotones.forEach((boton) => {
      boton.classList.remove("activo")

      const esBotonClaro = boton.textContent.toLowerCase().includes("claro") || boton.classList.contains("btn-claro")
      const esBotonOscuro = boton.textContent.toLowerCase().includes("oscuro") || boton.classList.contains("btn-oscuro")

      if ((esBotonClaro && this.temaActual === "claro") || (esBotonOscuro && this.temaActual === "oscuro")) {
        boton.classList.add("activo")
      }
    })
  }

  /**
   * Guarda el tema en localStorage
   */
  guardarTema(tema) {
    try {
      localStorage.setItem("modo", tema)
    } catch (error) {
      console.warn("⚠️ No se pudo guardar el tema:", error)
    }
  }

  /**
   * Obtiene el tema guardado
   */
  obtenerTemaGuardado() {
    try {
      return localStorage.getItem("modo") || "claro"
    } catch (error) {
      console.warn("⚠️ No se pudo obtener el tema guardado:", error)
      return "claro"
    }
  }

  /**
   * Registra un observador para cambios de tema
   */
  suscribirCambioTema(callback) {
    if (typeof callback === "function") {
      this.observadores.push(callback)
    }
  }

  /**
   * Notifica a los observadores sobre cambios de tema
   */
  notificarCambio(temaAnterior, nuevoTema) {
    this.observadores.forEach((callback) => {
      try {
        callback(nuevoTema, temaAnterior)
      } catch (error) {
        console.error("Error en observador de tema:", error)
      }
    })
  }

  /**
   * Obtiene el tema actual
   */
  obtenerTemaActual() {
    return this.temaActual
  }
}

// ===== INICIALIZACIÓN =====
let manejadorTemas

document.addEventListener("DOMContentLoaded", () => {
  manejadorTemas = new ManejadorTemas()

  // Hacer funciones globales para compatibilidad con HTML existente
  window.activarModoClaro = () => manejadorTemas.cambiarTema("claro")
  window.activarModoOscuro = () => manejadorTemas.cambiarTema("oscuro")
  window.alternarTema = () => manejadorTemas.alternarTema()

  // Agregar estilos para botones activos
  const style = document.createElement("style")
  style.textContent = `
    .modo-toggle button.activo {
      background-color: #16a085 !important;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      transform: scale(0.95);
    }
    
    .modo-toggle button {
      transition: all 0.2s ease;
    }
    
    .modo-toggle button:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    
    /* Transición suave para cambios de tema */
    body {
      transition: background-color 0.3s ease, color 0.3s ease;
    }
    
    .navbar, footer, .table_component th, .table_component td {
      transition: background-color 0.3s ease, color 0.3s ease;
    }
  `
  document.head.appendChild(style)
})

// ===== FUNCIONES DE UTILIDAD =====

/**
 * Función para obtener el tema actual desde cualquier parte del código
 */
window.obtenerTemaActual = () => {
  return manejadorTemas ? manejadorTemas.obtenerTemaActual() : "claro"
}

/**
 * Función para suscribirse a cambios de tema
 */
window.suscribirCambioTema = (callback) => {
  if (manejadorTemas) {
    manejadorTemas.suscribirCambioTema(callback)
  }
}
