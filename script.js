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
    
    // Este código nuevo resalta el enlace de la página actual
    const navLinks = document.querySelectorAll('header nav ul li a');
    
    // Obtenemos el nombre del archivo de la página actual (ej: "galeria.html")
    let currentPage = window.location.pathname.split('/').pop();
    
    // Si la página está vacía (ej. "mi-sitio.com/"), es 'index.html'
    if (currentPage === '') {
        currentPage = 'index.html';
    }

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');

        // Si el 'href' del enlace coincide con la página actual, le añadimos la clase 'active'
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });

    // --- FUNCIÓN DE AUDIO EN GALERÍA ---
    
    // Solo si estamos en la página de la galería
    if (currentPage === 'galeria.html') {
        const galleryItems = document.querySelectorAll('.gallery-item');
        let currentAudio = null; // Para detener el audio anterior si hay uno

        galleryItems.forEach(item => {
            const audioPath = item.getAttribute('data-audio'); // Obtenemos la ruta del audio

            if (audioPath) { // Solo si este item tiene un audio asociado
                item.style.cursor = 'pointer'; // Para indicar que es clickeable

                item.addEventListener('click', () => {
                    // Si hay un audio sonando, lo detenemos
                    if (currentAudio) {
                        currentAudio.pause();
                        currentAudio.currentTime = 0; // Reinicia el audio al principio
                    }

                    // Creamos un nuevo objeto de Audio con la ruta
                    const audio = new Audio(audioPath);
                    audio.volume = 0.7; // Ajusta el volumen (0.0 a 1.0)
                    audio.play().catch(error => {
                        console.log("Error al intentar reproducir el audio:", error);
                    });

                    currentAudio = audio; // Guardamos una referencia al audio actual
                });
            }
        });
    } // Fin del 'if (currentPage === 'galeria.html')'

});

