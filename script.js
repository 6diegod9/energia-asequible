// Espera a que todo el contenido de la página se cargue
document.addEventListener('DOMContentLoaded', () => {

    // --- SECCIÓN DE LA CALCULADORA ---
    
    // Obtenemos los elementos de la calculadora
    const kwhInput = document.getElementById('kwh-input');
    
    // ¡IMPORTANTE! 
    // Solo ejecutamos el código de la calculadora si el input existe en esta página
    if (kwhInput) {
        // Obtenemos el resto de elementos
        const ahorroOutput = document.getElementById('ahorro-output');
        const emisionesOutput = document.getElementById('emisiones-output');
        const donutChart = document.getElementById('donut-chart');
        const ahorroPercent = document.getElementById('ahorro-percent');

        // Constantes (ajústalas si es necesario)
        // (Estos son los valores mejorados que investigamos)
        const PRECIO_KWH = 4.2; 
        const EMISIONES_KWH = 0.45;
        const PORCENTAJE_AHORRO_SOLAR = 0.95;

        // Función que hace los cálculos
        function actualizarCalculadora() {
            const consumoMensualKwh = parseFloat(kwhInput.value) || 0;
            const ahorroEnKwh = consumoMensualKwh * PORCENTAJE_AHORRO_SOLAR;
            const ahorroEnDinero = ahorroEnKwh * PRECIO_KWH;
            const reduccionEmisiones = ahorroEnKwh * EMISIONES_KWH;
            const consumoRestanteKwh = consumoMensualKwh * (1 - PORCENTAJE_AHORRO_SOLAR);

            // Actualizamos el texto
            ahorroOutput.textContent = `$${ahorroEnDinero.toFixed(2)} MXN`;
            emisionesOutput.textContent = `${reduccionEmisiones.toFixed(2)} kg CO2`;

            // Actualizamos el gráfico
            let porcentajeAhorrado = 0;
            let porcentajeRestante = 100;
            
            if (consumoMensualKwh > 0) {
                porcentajeAhorrado = PORCENTAJE_AHORRO_SOLAR * 100;
                porcentajeRestante = (1 - PORCENTAJE_AHORRO_SOLAR) * 100;
            }

            ahorroPercent.textContent = `${porcentajeAhorrado.toFixed(0)}%`;
            donutChart.style.background = 
                `conic-gradient(#F44336 0% ${porcentajeRestante}%, #4CAF50 ${porcentajeRestante}% 100%)`;
        }

        // Hacemos que la función se ejecute cada vez que el usuario escribe
        kwhInput.addEventListener('input', actualizarCalculadora);
        
        // Llamamos la función una vez al cargar para que el gráfico inicie en 0%
        actualizarCalculadora();
    } // Fin del 'if (kwhInput)'


    // --- SECCIÓN DEL MENÚ DE NAVEGACIÓN ACTIVO ---
    
    const navLinks = document.querySelectorAll('header nav ul li a');
    let currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === '') {
        currentPage = 'index.html';
    }

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });

    // --- FUNCIÓN DE AUDIO EN GALERÍA ---
    
    if (currentPage === 'galeria.html') {
        const galleryItems = document.querySelectorAll('.gallery-item');
        let currentAudio = null; 

        galleryItems.forEach(item => {
            const audioPath = item.getAttribute('data-audio'); 
            if (audioPath) { 
                item.style.cursor = 'pointer'; 
                item.addEventListener('click', () => {
                    if (currentAudio) {
                        currentAudio.pause();
                        currentAudio.currentTime = 0; 
                    }
                    const audio = new Audio(audioPath);
                    audio.volume = 0.7; 
                    audio.play().catch(error => {
                        console.log("Error al intentar reproducir el audio:", error);
                    });
                    currentAudio = audio; 
                });
            }
        });
    } // Fin del 'if (currentPage === 'galeria.html')'

    
    // ===================================================
    // ==== ¡NUEVO CÓDIGO PARA MENÚ HAMBURGUESA! ====
    // ===================================================
    
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    // Verificamos que los elementos existan
    if (navToggle && navMenu) {
        
        navToggle.addEventListener('click', () => {
            // Alterna (pone y quita) la clase 'nav-menu-visible' en el menú (ul)
            navMenu.classList.toggle('nav-menu-visible');
            
            // Alterna la clase 'nav-open' en el body (para la animación del botón a 'X')
            document.body.classList.toggle('nav-open');
        });
    } // Fin del 'if (navToggle && navMenu)'

}); // <-- ESTE ES EL CIERRE DEL 'DOMContentLoaded'
