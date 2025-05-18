document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    let currentX = 0;
    let currentY = 0;
    let aimX = 0;
    let aimY = 0;

    // Ajustes para la posición del cursor
    const cursorOffsetX = -8;
    const cursorOffsetY = -8;

    document.addEventListener('mousemove', (e) => {
        aimX = e.clientX + cursorOffsetX;
        aimY = e.clientY + cursorOffsetY;
    });

    const animate = () => {
        // Movimiento suave sin física
        currentX += (aimX - currentX) * 0.2;
        currentY += (aimY - currentY) * 0.2;

        // Aplicamos la transformación
        cursor.style.transform = `translate(${currentX}px, ${currentY}px)`;
        
        requestAnimationFrame(animate);
    };

    animate();
}); 