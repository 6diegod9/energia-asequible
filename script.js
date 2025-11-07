// Espera a que todo el contenido de la página (HTML) se cargue
document.addEventListener('DOMContentLoaded', () => {

    // --- SECCIÓN DE LA CALCULADORA ---
    
    // 1. Obtenemos los elementos del HTML que necesitamos
    const kwhInput = document.getElementById('kwh-input');
    const ahorroOutput = document.getElementById('ahorro-output');
    const emisionesOutput = document.getElementById('emisiones-output');
    const donutChart = document.getElementById('donut-chart');
    const ahorroPercent = document.getElementById('ahorro-percent');

    // 2. Definimos nuestras "constantes" (suposiciones)
    // ¡Puedes cambiar estos valores!
    const PRECIO_KWH = 2.5; // Suposición: $2.5 MXN por Kwh (tarifa doméstica)
    const EMISIONES_KWH = 0.45; // Suposición: 0.45 kg de CO2 por Kwh
    const PORCENTAJE_AHORRO_SOLAR = 0.85; // Suposición: Los paneles cubren el 85% de tu consumo

    // 3. Creamos la función que hace los cálculos
    function actualizarCalculadora() {
        // Obtenemos el valor del input, o 0 si está vacío
        const consumoMensualKwh = parseFloat(kwhInput.value) || 0;

        // Calculamos el ahorro
        const ahorroEnKwh = consumoMensualKwh * PORCENTAJE_AHORRO_SOLAR;
        const ahorroEnDinero = ahorroEnKwh * PRECIO_KWH;

        // Calculamos la reducción de emisiones
        const reduccionEmisiones = ahorroEnKwh * EMISIONES_KWH;
        
        // Calculamos el consumo restante (el que no cubren los paneles)
        const consumoRestanteKwh = consumoMensualKwh * (1 - PORCENTAJE_AHORRO_SOLAR);

        // 4. Actualizamos el texto en la página
        ahorroOutput.textContent = `$${ahorroEnDinero.toFixed(2)} MXN`;
        emisionesOutput.textContent = `${reduccionEmisiones.toFixed(2)} kg CO2`;

        // 5. Actualizamos el gráfico de dona
        let porcentajeAhorrado = 0;
        let porcentajeRestante = 100;
        
        if (consumoMensualKwh > 0) {
            porcentajeAhorrado = PORCENTAJE_AHORRO_SOLAR * 100;
            porcentajeRestante = (1 - PORCENTAJE_AHORRO_SOLAR) * 100;
        }

        // Actualizamos el texto del centro del gráfico
        ahorroPercent.textContent = `${porcentajeAhorrado.toFixed(0)}%`;
        
        // Actualizamos el fondo del gráfico (el gradiente cónico)
        // El rojo (consumo) va de 0% hasta el porcentaje restante
        // El verde (ahorro) va desde el porcentaje restante hasta el 100%
        donutChart.style.background = 
            `conic-gradient(#F44336 0% ${porcentajeRestante}%, #4CAF50 ${porcentajeRestante}% 100%)`;
    }

    // 6. Hacemos que la función se ejecute cada vez que el usuario escribe
    kwhInput.addEventListener('input', actualizarCalculadora);


    // --- SECCIÓN DEL MENÚ DE NAVEGACIÓN ACTIVO ---

    // Esto resalta el link del menú de la sección que estás viendo
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('header nav ul li a');

    const options = {
        root: null, // Observa en relación al viewport
        threshold: 0.5, // Se activa cuando el 50% de la sección es visible
        rootMargin: '-70px 0px 0px 0px' // Compensa el header fijo
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Quita la clase 'active' de todos los links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Añade 'active' solo al link que corresponde a la sección visible
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`header nav ul li a[href="#${id}"]`);
                
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, options);

    // Le decimos al observador que vigile todas nuestras secciones
    sections.forEach(section => {
        observer.observe(section);
    });

});