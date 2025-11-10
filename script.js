// ===================================================
// ==== LÓGICA DEL TEMA (MODO OSCURO) ====
// Esto se ejecuta ANTES para evitar "parpadeos"
// ===================================================

// 1. Función para aplicar el tema
function aplicarTema(tema) {
    if (tema === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

// 2. Función para obtener el tema guardado o del sistema
function obtenerTema() {
    // A. Revisa si el usuario ya eligió un tema y lo guardó
    const temaGuardado = localStorage.getItem('theme');
    if (temaGuardado) {
        return temaGuardado;
    }
    
    // B. Si no, revisa la preferencia de su sistema operativo
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    
    // C. Si no, el default es 'light'
    return 'light';
}

// 3. Aplica el tema tan pronto como sea posible
const temaActual = obtenerTema();
aplicarTema(temaActual);


// ===================================================
// ==== EL RESTO DE TU CÓDIGO (CUANDO LA PÁGINA CARGA) ====
// ===================================================

document.addEventListener('DOMContentLoaded', () => {

    // --- Lógica del botón de Tema ---
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            // Revisa si el body YA tiene la clase .dark-mode
            let esDark = document.body.classList.contains('dark-mode');
            
            // Si es dark, lo cambiamos a light. Si es light, a dark.
            if (esDark) {
                aplicarTema('light');
                localStorage.setItem('theme', 'light'); // Guarda la preferencia
            } else {
                aplicarTema('dark');
                localStorage.setItem('theme', 'dark'); // Guarda la preferencia
            }
        });
    }

    // --- SECCIÓN DE LA CALCULADORA ---
    const kwhInput = document.getElementById('kwh-input');
    if (kwhInput) {
        // Obtenemos el resto de elementos
        const ahorroOutput = document.getElementById('ahorro-output');
        const emisionesOutput = document.getElementById('emisiones-output');
        const donutChart = document.getElementById('donut-chart');
        const ahorroPercent = document.getElementById('ahorro-percent');

        // Constantes (con datos de México)
        const PRECIO_KWH = 4.2; // Promedio tarifa DAC
        const EMISIONES_KWH = 0.45; // Factor de emisión MX
        const PORCENTAJE_AHORRO_SOLAR = 0.95; // Ahorro del 95%

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
    
    // --- CÓDIGO PARA MENÚ HAMBURGUESA ---
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('nav-menu-visible');
            document.body.classList.toggle('nav-open');
        });
    } // Fin del 'if (navToggle && navMenu)'

}); // Fin del 'DOMContentLoaded'
