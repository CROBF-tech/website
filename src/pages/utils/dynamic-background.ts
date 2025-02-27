/* public/scripts/dynamic-background.js */

/**
 * Selecciona aleatoriamente un archivo SVG basado en los pesos asignados.
 *
 * @param {Object} weights - Objeto con nombres de archivos SVG y sus respectivos pesos.
 *                           Ejemplo: { "envelope.svg": 2, "globe2.svg": 1 }
 * @returns {string} - Nombre del archivo SVG seleccionado.
 */
function weightedRandom(weights) {
    let total = 0;
    for (const key in weights) {
      total += weights[key];
    }
    const random = Math.random() * total;
    let sum = 0;
    for (const key in weights) {
      sum += weights[key];
      if (random < sum) {
        return key;
      }
    }
    return Object.keys(weights)[0];
  }
  
  /**
   * Crea y configura el fondo dinámico en el contenedor principal utilizando el patrón "jittered".
   *
   * En este patrón se divide el contenedor en una cuadrícula virtual y a cada celda se le aplica
   * un desplazamiento aleatorio (jitter) y una rotación aleatoria para dar un aspecto desordenado,
   * manteniendo una separación uniforme para mejorar el rendimiento.
   *
   * Condiciones:
   *  - El contenedor principal debe tener la clase "main-container".
   *  - El contenedor debe tener `position: relative` y dimensiones definidas (por ejemplo,
   *    `width: 100%` y `min-height: 100vh`) para que el fondo cubra todo el área.
   *
   * Opciones disponibles (todas son opcionales):
   *   - count: Número de íconos a generar (por defecto: 42 ese es el maximo recomendable).
   *   - size: Tamaño (en píxeles) de cada ícono (por defecto: 50).
   *   - svgWeights: Objeto con los pesos para cada archivo SVG.  
   *       Por defecto:
   *         {
   *             "envelope.svg": 1, 
                  "globe2.svg": 1, 
                  "logo_crobf.svg": 2,
                  "reception-4.svg": 1, 
                  "code-slash.svg": 2,
                  "window-stack.svg": 1,
                  "menu-button-wide.svg": 1,
                  "gear.svg": 1
   * 
   *         }
   *   - rotationRange: Rango (en grados) para la rotación aleatoria. Cada ícono se rotará un ángulo
   *         aleatorio entre -rotationRange y +rotationRange (por defecto: 45, es decir, ±45°).
   *
   * @param {Object} options - Opciones de configuración.
   */
  export function createDynamicBackground(options) {
    const count = options?.count || 42;
    const size = options?.size || 50;
    const svgWeights = options?.svgWeights || { 
      "envelope.svg": 1, 
      "globe2.svg": 1, 
      "logo_crobf.svg": 2,
      "reception-4.svg": 1, 
      "code-slash.svg": 2,
      "window-stack.svg": 1,
      "menu-button-wide.svg": 1,
      "gear.svg": 1
    };
    const rotationRange = typeof options?.rotationRange === 'number' ? options.rotationRange : 45;
  
    // Buscar el contenedor principal
    const container = document.querySelector('.has-dynamic-background');
    if (!container) {
      console.warn('No se encontró un contenedor con la clase "main-container".');
      return;
    }
    // Asegurar que el contenedor tenga position: relative
    if (getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }
  
    // Crear el contenedor para el fondo dinámico y colocarlo detrás del contenido
    const bgContainer = document.createElement('div');
    bgContainer.className = 'dynamic-background';
    container.insertBefore(bgContainer, container.firstChild);
  
    const symbols = [];
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
  
    // Función auxiliar para generar un ángulo aleatorio entre -rotationRange y +rotationRange
    const getRandomRotation = () => (Math.random() * 2 * rotationRange) - rotationRange;
  
    // Usamos el patrón "jittered": se divide el contenedor en celdas iguales y se añade jitter en cada celda.
    const columns = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / columns);
    const cellWidth = containerWidth / columns;
    const cellHeight = containerHeight / rows;
    // Definimos el jitter máximo como el 50% del tamaño de cada celda.
    const jitterX = cellWidth * 0.5;
    const jitterY = cellHeight * 0.5;
  
    let iconIndex = 0;
    for (let r = 0; r < rows && iconIndex < count; r++) {
      for (let c = 0; c < columns && iconIndex < count; c++) {
        // Coordenadas base: centro de la celda
        const baseX = c * cellWidth + cellWidth / 2;
        const baseY = r * cellHeight + cellHeight / 2;
        // Aplicar un desplazamiento aleatorio (jitter)
        const offsetX = (Math.random() - 0.5) * jitterX;
        const offsetY = (Math.random() - 0.5) * jitterY;
        // Calcular la posición final (ajustando para centrar el ícono)
        const x = baseX + offsetX - size / 2;
        const y = baseY + offsetY - size / 2;
        // Calcular un ángulo aleatorio
        const randomRotation = getRandomRotation();
  
        // Crear el elemento del ícono
        const symbolEl = document.createElement('div');
        symbolEl.classList.add('symbol');
        symbolEl.style.transform = `translate(${x}px, ${y}px) rotate(${randomRotation}deg)`;
        symbolEl.style.width = `${size}px`;
        symbolEl.style.height = `${size}px`;
  
        // Seleccionar el SVG según los pesos
        const svgFile = weightedRandom(svgWeights);
        const img = document.createElement('img');
        img.src = `/svg/${svgFile}`;
        img.alt = "";
        img.style.width = '100%';
        img.style.height = '100%';
        symbolEl.appendChild(img);
  
        bgContainer.appendChild(symbolEl);
        symbols.push({ element: symbolEl, x, y, rotation: randomRotation });
        iconIndex++;
      }
    }
  
    // Configurar la interacción: los íconos se alejan del cursor
    const cursorRadius = 150;
    const moveDistance = 80;
    container.addEventListener('mousemove', (event) => {
      const rect = container.getBoundingClientRect();
      const cursorX = event.clientX - rect.left;
      const cursorY = event.clientY - rect.top;
      symbols.forEach((sym) => {
        const centerX = sym.x + size / 2;
        const centerY = sym.y + size / 2;
        const dx = centerX - cursorX;
        const dy = centerY - cursorY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < cursorRadius) {
          const angle = Math.atan2(dy, dx);
          const offset = (moveDistance / cursorRadius) * (cursorRadius - distance);
          const newX = sym.x + offset * Math.cos(angle);
          const newY = sym.y + offset * Math.sin(angle);
          sym.element.style.transform = `translate(${newX}px, ${newY}px) rotate(${sym.rotation}deg)`;
        } else {
          sym.element.style.transform = `translate(${sym.x}px, ${sym.y}px) rotate(${sym.rotation}deg)`;
        }
      });
    });
    container.addEventListener('mouseleave', () => {
      symbols.forEach((sym) => {
        sym.element.style.transform = `translate(${sym.x}px, ${sym.y}px) rotate(${sym.rotation}deg)`;
      });
    });
  
    // Ajustar posiciones al redimensionar la ventana (con debounce para reducir cálculos)
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        const newColumns = Math.ceil(Math.sqrt(count));
        const newRows = Math.ceil(count / newColumns);
        const newCellWidth = newWidth / newColumns;
        const newCellHeight = newHeight / newRows;
        const newJitterX = newCellWidth * 0.5;
        const newJitterY = newCellHeight * 0.5;
        let iconIndex = 0;
        for (let r = 0; r < newRows && iconIndex < count; r++) {
          for (let c = 0; c < newColumns && iconIndex < count; c++) {
            const baseX = c * newCellWidth + newCellWidth / 2;
            const baseY = r * newCellHeight + newCellHeight / 2;
            const offsetX = (Math.random() - 0.5) * newJitterX;
            const offsetY = (Math.random() - 0.5) * newJitterY;
            const newX = baseX + offsetX - size / 2;
            const newY = baseY + offsetY - size / 2;
            symbols[iconIndex].x = newX;
            symbols[iconIndex].y = newY;
            symbols[iconIndex].element.style.transform = `translate(${newX}px, ${newY}px) rotate(${symbols[iconIndex].rotation}deg)`;
            iconIndex++;
          }
        }
      }, 100);
    });
  }