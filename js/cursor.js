document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor inactive'; // Inicialmente inactivo
    document.body.appendChild(cursor);

    // Variables para el seguimiento del cursor
    let currentX = 0;
    let currentY = 0;
    let aimX = 0;
    let aimY = 0;
    let animationFrameId = null;
    let isActive = false; // Inicialmente inactivo
    let cursorInPage = false; // Flag para saber si el cursor está sobre la página

    // Ajustes para la posición del cursor (restaurados como solicitado)
    const cursorOffsetX = -8;
    const cursorOffsetY = -8;

    // Seguimiento del cursor
    document.addEventListener('mousemove', (e) => {
        // Actualizamos las coordenadas objetivo con los offsets
        aimX = e.clientX + cursorOffsetX;
        aimY = e.clientY + cursorOffsetY;
        
        cursorInPage = true; // El cursor está sobre la página
        
        // Activamos el cursor solo si está sobre la página
        if (!isActive && cursorInPage) {
            isActive = true;
            cursor.classList.remove('inactive');
        }
        
        // Iniciamos la animación si no está corriendo
        if (!animationFrameId) {
            animate();
        }
    });

    // Detectar cuando el cursor sale de la ventana
    document.addEventListener('mouseleave', () => {
        isActive = false;
        cursorInPage = false; // El cursor ya no está sobre la página
        cursor.classList.add('inactive');
    });

    // Detectar cuando el cursor vuelve a entrar a la ventana
    document.addEventListener('mouseenter', () => {
        cursorInPage = true; // El cursor está sobre la página
        isActive = true;
        cursor.classList.remove('inactive');
    });

    // Detectar cuando la ventana pierde el foco
    window.addEventListener('blur', () => {
        isActive = false;
        cursor.classList.add('inactive');
    });

    // Detectar cuando la ventana recupera el foco
    window.addEventListener('focus', () => {
        // No activamos el cursor automáticamente al recuperar el foco
        // Se activará solo cuando el cursor se mueva sobre la página
        // No hacemos nada aquí - el cursor permanece inactivo hasta que haya movimiento
    });

    // Función de animación para el movimiento suave
    const animate = () => {
        // Movimiento más suave con interpolación reducida
        currentX += (aimX - currentX) * 0.08; // Reducido de 0.2 para mayor suavidad
        currentY += (aimY - currentY) * 0.08; // Reducido de 0.2 para mayor suavidad

        // Aplicamos la transformación
        cursor.style.transform = `translate(${currentX}px, ${currentY}px)`;
        
        // Calculamos distancia entre posición actual y objetivo
        const distX = Math.abs(aimX - currentX);
        const distY = Math.abs(aimY - currentY);
        
        // Si el cursor está casi quieto y no está activo, detenemos la animación
        // para optimizar rendimiento - umbral reducido para animación más continua
        if (distX < 0.05 && distY < 0.05 && !isActive) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
            return;
        }
        
        // Continuar la animación
        animationFrameId = requestAnimationFrame(animate);
    };
});