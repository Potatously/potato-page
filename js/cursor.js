document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    // Variables para el seguimiento del cursor
    let currentX = 0;
    let currentY = 0;
    let aimX = 0;
    let aimY = 0;
    let animationFrameId = null;
    let isActive = true;

    // Ajustes para la posición del cursor (restaurados como solicitado)
    const cursorOffsetX = -12;
    const cursorOffsetY = -12;

    // Seguimiento del cursor
    document.addEventListener('mousemove', (e) => {
        // Actualizamos las coordenadas objetivo con los offsets
        aimX = e.clientX + cursorOffsetX;
        aimY = e.clientY + cursorOffsetY;
        
        // Si el cursor estaba inactivo, lo activamos
        if (!isActive) {
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
        cursor.classList.add('inactive');
    });

    // Detectar cuando el cursor vuelve a entrar a la ventana
    document.addEventListener('mouseenter', () => {
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
        isActive = true;
        cursor.classList.remove('inactive');
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