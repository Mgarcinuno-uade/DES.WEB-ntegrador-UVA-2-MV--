// ===== FORMULARIO DE CONTACTO - VALIDACIÓN AVANZADA =====

// Espera que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.querySelector(".formulario-contacto")

  // Elementos del formulario
  const campos = {
    nombre: document.getElementById("nombre"),
    email: document.getElementById("email"),
    asunto: document.getElementById("asunto"),
    mensaje: document.getElementById("mensaje"),
  }

  // Contenedor para mostrar errores (lo crearemos dinámicamente)
  let contenedorErrores = null

  // ===== EVENT LISTENERS =====

  // Validación en tiempo real mientras el usuario escribe
  Object.keys(campos).forEach((campo) => {
    campos[campo].addEventListener("blur", () => validarCampoIndividual(campo))
    campos[campo].addEventListener("input", () => limpiarErroresCampo(campo))
  })

  // Envío del formulario
  formulario.addEventListener("submit", (e) => {
    e.preventDefault()
    procesarFormulario()
  })

  // ===== FUNCIONES DE VALIDACIÓN =====

  /**
   * Procesa el envío del formulario
   */
  function procesarFormulario() {
    // Mostrar indicador de carga
    mostrarCargando(true)

    // Obtener valores y validar
    const valores = obtenerValoresFormulario()
    const errores = validarFormularioCompleto(valores)

    // Simular procesamiento (para demostrar loading)
    setTimeout(() => {
      mostrarCargando(false)

      if (errores.length > 0) {
        mostrarErrores(errores)
        enfocarPrimerError()
      } else {
        mostrarExito(valores.nombre)
        limpiarFormulario()
      }
    }, 1000)
  }

  /**
   * Obtiene todos los valores del formulario
   */
  function obtenerValoresFormulario() {
    return {
      nombre: campos.nombre.value.trim(),
      email: campos.email.value.trim(),
      asunto: campos.asunto.value.trim(),
      mensaje: campos.mensaje.value.trim(),
    }
  }

  /**
   * Valida todo el formulario y retorna array de errores
   */
  function validarFormularioCompleto(valores) {
    const errores = []

    // Validar nombre
    if (!valores.nombre) {
      errores.push({ campo: "nombre", mensaje: 'El campo "Nombre" es obligatorio.' })
    } else if (valores.nombre.length < 2) {
      errores.push({ campo: "nombre", mensaje: "El nombre debe tener al menos 2 caracteres." })
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valores.nombre)) {
      errores.push({ campo: "nombre", mensaje: "El nombre solo puede contener letras y espacios." })
    }

    // Validar email
    if (!valores.email) {
      errores.push({ campo: "email", mensaje: 'El campo "Correo electrónico" es obligatorio.' })
    } else if (!validarEmail(valores.email)) {
      errores.push({ campo: "email", mensaje: "Debe ingresar un correo electrónico válido." })
    }

    // Validar asunto
    if (!valores.asunto) {
      errores.push({ campo: "asunto", mensaje: 'El campo "Asunto" es obligatorio.' })
    } else if (valores.asunto.length < 5) {
      errores.push({ campo: "asunto", mensaje: "El asunto debe tener al menos 5 caracteres." })
    }

    // Validar mensaje
    if (!valores.mensaje) {
      errores.push({ campo: "mensaje", mensaje: 'El campo "Mensaje" es obligatorio.' })
    } else if (valores.mensaje.length < 10) {
      errores.push({ campo: "mensaje", mensaje: "El mensaje debe tener al menos 10 caracteres." })
    } else if (valores.mensaje.length > 500) {
      errores.push({ campo: "mensaje", mensaje: "El mensaje no puede exceder los 500 caracteres." })
    }

    return errores
  }

  /**
   * Valida un campo individual
   */
  function validarCampoIndividual(nombreCampo) {
    const valor = campos[nombreCampo].value.trim()
    const errores = []

    switch (nombreCampo) {
      case "nombre":
        if (valor && valor.length < 2) {
          errores.push("El nombre debe tener al menos 2 caracteres.")
        } else if (valor && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor)) {
          errores.push("El nombre solo puede contener letras y espacios.")
        }
        break
      case "email":
        if (valor && !validarEmail(valor)) {
          errores.push("Formato de correo electrónico inválido.")
        }
        break
      case "asunto":
        if (valor && valor.length < 5) {
          errores.push("El asunto debe tener al menos 5 caracteres.")
        }
        break
      case "mensaje":
        if (valor && valor.length < 10) {
          errores.push("El mensaje debe tener al menos 10 caracteres.")
        } else if (valor && valor.length > 500) {
          errores.push("El mensaje no puede exceder los 500 caracteres.")
        }
        break
    }

    if (errores.length > 0) {
      mostrarErrorCampo(nombreCampo, errores[0])
    } else {
      limpiarErroresCampo(nombreCampo)
    }
  }

  /**
   * Valida formato de email con regex mejorada
   */
  function validarEmail(correo) {
    const regex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    return regex.test(correo)
  }

  // ===== FUNCIONES DE UI =====

  /**
   * Muestra errores en el formulario
   */
  function mostrarErrores(errores) {
    limpiarErrores()

    // Crear contenedor de errores si no existe
    if (!contenedorErrores) {
      contenedorErrores = document.createElement("div")
      contenedorErrores.className = "contenedor-errores"
      contenedorErrores.style.cssText = `
        background-color: #fee;
        border: 1px solid #fcc;
        border-radius: 5px;
        padding: 1rem;
        margin-bottom: 1rem;
        color: #c33;
      `
      formulario.insertBefore(contenedorErrores, formulario.firstChild)
    }

    // Mostrar errores generales
    const listaErrores = document.createElement("ul")
    listaErrores.style.margin = "0"
    listaErrores.style.paddingLeft = "1.5rem"

    errores.forEach((error) => {
      const itemError = document.createElement("li")
      itemError.textContent = error.mensaje
      listaErrores.appendChild(itemError)

      // Marcar campo con error
      marcarCampoConError(error.campo)
    })

    contenedorErrores.innerHTML = "<strong>Por favor corrige los siguientes errores:</strong>"
    contenedorErrores.appendChild(listaErrores)
    contenedorErrores.style.display = "block"
  }

  /**
   * Muestra error en un campo específico
   */
  function mostrarErrorCampo(nombreCampo, mensaje) {
    const campo = campos[nombreCampo]
    let errorExistente = campo.parentNode.querySelector(".error-campo")

    if (!errorExistente) {
      errorExistente = document.createElement("span")
      errorExistente.className = "error-campo"
      errorExistente.style.cssText = `
        color: #c33;
        font-size: 0.9rem;
        margin-top: 0.25rem;
        display: block;
      `
      campo.parentNode.appendChild(errorExistente)
    }

    errorExistente.textContent = mensaje
    marcarCampoConError(nombreCampo)
  }

  /**
   * Marca un campo con estilo de error
   */
  function marcarCampoConError(nombreCampo) {
    campos[nombreCampo].style.borderColor = "#c33"
    campos[nombreCampo].style.backgroundColor = "#ffeaea"
  }

  /**
   * Limpia errores de un campo específico
   */
  function limpiarErroresCampo(nombreCampo) {
    const campo = campos[nombreCampo]
    const errorCampo = campo.parentNode.querySelector(".error-campo")

    if (errorCampo) {
      errorCampo.remove()
    }

    // Restaurar estilo normal
    campo.style.borderColor = "#ccc"
    campo.style.backgroundColor = ""
  }

  /**
   * Limpia todos los errores
   */
  function limpiarErrores() {
    if (contenedorErrores) {
      contenedorErrores.style.display = "none"
    }

    Object.keys(campos).forEach((nombreCampo) => {
      limpiarErroresCampo(nombreCampo)
    })
  }

  /**
   * Enfoca el primer campo con error
   */
  function enfocarPrimerError() {
    const primerCampoError = formulario.querySelector(
      'input[style*="border-color: rgb(204, 51, 51)"], textarea[style*="border-color: rgb(204, 51, 51)"]',
    )
    if (primerCampoError) {
      primerCampoError.focus()
    }
  }

  /**
   * Muestra mensaje de éxito
   */
  function mostrarExito(nombre) {
    limpiarErrores()

    // Crear mensaje de éxito
    const mensajeExito = document.createElement("div")
    mensajeExito.className = "mensaje-exito"
    mensajeExito.style.cssText = `
      background-color: #efe;
      border: 1px solid #cfc;
      border-radius: 5px;
      padding: 1rem;
      margin-bottom: 1rem;
      color: #363;
      text-align: center;
      animation: fadeIn 0.5s ease-in;
    `

    mensajeExito.innerHTML = `
      <strong>¡Mensaje enviado con éxito!</strong><br>
      Gracias por tu contacto, ${nombre}.<br>
      En breve te estaré respondiendo.
    `

    formulario.insertBefore(mensajeExito, formulario.firstChild)

    // Remover mensaje después de 5 segundos
    setTimeout(() => {
      if (mensajeExito.parentNode) {
        mensajeExito.remove()
      }
    }, 5000)
  }

  /**
   * Muestra/oculta indicador de carga
   */
  function mostrarCargando(mostrar) {
    const boton = formulario.querySelector('button[type="submit"]')

    if (mostrar) {
      boton.disabled = true
      boton.textContent = "Enviando..."
      boton.style.opacity = "0.7"
    } else {
      boton.disabled = false
      boton.textContent = "Enviar"
      boton.style.opacity = "1"
    }
  }

  /**
   * Limpia el formulario
   */
  function limpiarFormulario() {
    formulario.reset()
    Object.keys(campos).forEach((nombreCampo) => {
      limpiarErroresCampo(nombreCampo)
    })
  }

  // ===== CONTADOR DE CARACTERES PARA TEXTAREA =====
  const textarea = campos.mensaje
  const contador = document.createElement("div")
  contador.className = "contador-caracteres"
  contador.style.cssText = `
    text-align: right;
    font-size: 0.8rem;
    color: #666;
    margin-top: 0.25rem;
  `
  textarea.parentNode.appendChild(contador)

  function actualizarContador() {
    const longitud = textarea.value.length
    const maximo = 500
    contador.textContent = `${longitud}/${maximo} caracteres`

    if (longitud > maximo) {
      contador.style.color = "#c33"
    } else if (longitud > maximo * 0.8) {
      contador.style.color = "#f90"
    } else {
      contador.style.color = "#666"
    }
  }

  textarea.addEventListener("input", actualizarContador)
  actualizarContador() // Inicializar contador

  // ===== ANIMACIONES CSS =====
  const style = document.createElement("style")
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .formulario-contacto input:focus,
    .formulario-contacto textarea:focus {
      transform: scale(1.02);
      transition: all 0.2s ease;
    }
  `
  document.head.appendChild(style)

  console.log("✅ Formulario de contacto inicializado correctamente")
})
