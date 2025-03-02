interface Weights {
    [key: string]: number;
}

interface DinamycBackgroundOptions {
    count: number; // Número de íconos a generar
    size: number; // Tamaño (en píxeles) de cada ícono
    svgWeights?: { [key: string]: number }; // Objeto con los pesos para cada archivo SVG
    rotationRange: number; // Rango (en grados) para la rotación aleatoria
}

const DEFAULT_SVGS_WEOGHTS = {
    "envelope.svg": 1,
    "globe2.svg": 1,
    "logo_crobf.svg": 2,
    "reception-4.svg": 1,
    "code-slash.svg": 2,
    "window-stack.svg": 1,
    "menu-button-wide.svg": 1,
    "gear.svg": 1,
};

/**
 * Selecciona una clave aleatoria basada en los pesos proporcionados.
 * @param {Weights} weights - Objeto con los pesos para cada SVG.
 * @returns {string} La clave seleccionada aleatoriamente.
 */
function weightedRandom(weights: Weights): string {
    const weightsValues = Object.values(weights);

    if (weightsValues.length <= 0) {
        throw new Error("Invalid arguments for dynamic background");
    }

    const total = weightsValues.reduce((sum, weight) => sum + weight, 0);
    const random = Math.random() * total;

    let sum = 0;
    for (const [key, weight] of Object.entries(weights)) {
        sum += weight;
        if (random < sum) {
            return key;
        }
    }

    return Object.keys(weights)[0];
}

/**
 * Busca y devuelve el contenedor principal para el fondo dinámico.
 * @returns {HTMLElement} El contenedor con la clase `has-dynamic-background`.
 * @throws {Error} Si no se encuentra ningún contenedor con la clase especificada.
 */
function getMainContainerForDynamicBackground(): HTMLElement {
    const container = document.querySelector('.has-dynamic-background') as HTMLElement;

    if (!container) {
        console.warn('No se encontró un contenedor con la clase "has-dynamic-background".');
        throw new Error('Contenedor no encontrado: se requiere un elemento con la clase "has-dynamic-background".');
    }

    container.style.position = 'relative';
    return container;
}

/**
 * Crea y configura un contenedor para el fondo dinámico.
 * @param {HTMLElement} container - El contenedor principal donde se insertará el fondo dinámico.
 * @returns {HTMLElement} El contenedor creado para el fondo dinámico.
 */
function createBackgroundContainer(container: HTMLElement): HTMLElement {
    // Eliminar el contenedor de fondo dinámico existente si lo hay
    const existingBgContainer = container.querySelector('.dynamic-background');
    if (existingBgContainer) {
        existingBgContainer.remove();
    }

    // Crear un nuevo contenedor para el fondo dinámico
    const bgContainer = document.createElement('div');
    bgContainer.className = 'dynamic-background';
    container.insertBefore(bgContainer, container.firstChild);

    return bgContainer;
}

/**
 * Calcula las dimensiones de la cuadrícula y el jitter (desplazamiento aleatorio) para el fondo dinámico.
 * @param {number} count - Número total de íconos que se distribuirán en la cuadrícula.
 * @param {number} containerWidth - Ancho del contenedor principal en píxeles.
 * @param {number} containerHeight - Alto del contenedor principal en píxeles.
 * @returns {Object} Un objeto con las dimensiones de la cuadrícula y el jitter.
 */
function calculateGridDimensions(count: number, containerWidth: number, containerHeight: number) {
    const columns = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / columns);
    const cellWidth = containerWidth / columns;
    const cellHeight = containerHeight / rows;
    const jitterX = cellWidth * 0.5;
    const jitterY = cellHeight * 0.5;
    return { columns, rows, cellWidth, cellHeight, jitterX, jitterY };
}

/**
 * Crea un ícono con posición, rotación y SVG aleatorios.
 * @param {number} x - Posición en el eje X.
 * @param {number} y - Posición en el eje Y.
 * @param {number} size - Tamaño del ícono en píxeles.
 * @param {number} rotation - Rotación del ícono en grados.
 * @param {string} svgFile - Nombre del archivo SVG.
 * @returns {HTMLElement} El elemento del ícono creado.
 */
function createIcon(x: number, y: number, size: number, rotation: number, svgFile: string): HTMLElement {
    const symbolEl = document.createElement('div');
    symbolEl.classList.add('symbol');
    symbolEl.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
    symbolEl.style.width = `${size}px`;
    symbolEl.style.height = `${size}px`;

    const img = document.createElement('img');
    img.src = `/svg/${svgFile}`;
    img.alt = "";
    img.style.width = '100%';
    img.style.height = '100%';
    symbolEl.appendChild(img);

    return symbolEl;
}

/**
 * Configura la interacción del cursor con los íconos.
 * @param {HTMLElement} container - El contenedor principal.
 * @param {Array} symbols - Lista de símbolos (íconos) en el fondo dinámico.
 * @param {number} size - Tamaño de los íconos en píxeles.
 */
function setupCursorInteraction(container: HTMLElement, symbols: any[], size: number) {
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
}

/**
 * Configura el manejo del redimensionamiento de la ventana.
 * @param {HTMLElement} container - El contenedor principal.
 * @param {Array} symbols - Lista de símbolos (íconos) en el fondo dinámico.
 * @param {number} count - Número total de íconos.
 * @param {number} size - Tamaño de los íconos en píxeles.
 */
function setupResizeHandler(container: HTMLElement, symbols: any[], count: number, size: number) {
    let resizeTimeout: any;
    window.addEventListener('resize', () => {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newWidth = container.clientWidth;
            const newHeight = container.clientHeight;
            const { columns, rows, cellWidth, cellHeight, jitterX, jitterY } = calculateGridDimensions(count, newWidth, newHeight);
            let iconIndex = 0;
            for (let r = 0; r < rows && iconIndex < count; r++) {
                for (let c = 0; c < columns && iconIndex < count; c++) {
                    const baseX = c * cellWidth + cellWidth / 2;
                    const baseY = r * cellHeight + cellHeight / 2;
                    const offsetX = (Math.random() - 0.5) * jitterX;
                    const offsetY = (Math.random() - 0.5) * jitterY;
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

/**
 * Crea y configura un fondo dinámico en el contenedor principal usando el patrón "jittered".
 * @param {DinamycBackgroundOptions} options - Opciones de configuración.
 */
export function createDynamicBackground(options: DinamycBackgroundOptions) {
    const { count, size, rotationRange } = options;
    const svgWeights = options.svgWeights ?? DEFAULT_SVGS_WEOGHTS;

    // Buscar el contenedor principal
    const container = getMainContainerForDynamicBackground();

    // Asegurar que no haya desbordamiento horizontal
    container.style.overflowX = 'hidden';

    // Crear el contenedor para el fondo dinámico y colocarlo detrás del contenido
    const bgContainer = createBackgroundContainer(container);

    const symbols: any[] = [];
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Calcular las dimensiones de la cuadrícula
    const { columns, rows, cellWidth, cellHeight, jitterX, jitterY } = calculateGridDimensions(count, containerWidth, containerHeight);

    let iconIndex = 0;
    for (let r = 0; r < rows && iconIndex < count; r++) {
        for (let c = 0; c < columns && iconIndex < count; c++) {
            const baseX = c * cellWidth + cellWidth / 2;
            const baseY = r * cellHeight + cellHeight / 2;
            const offsetX = (Math.random() - 0.5) * jitterX;
            const offsetY = (Math.random() - 0.5) * jitterY;

            // Asegurar que los íconos no se salgan del contenedor
            const x = Math.max(size / 2, Math.min(containerWidth - size / 2, baseX + offsetX - size / 2));
            const y = Math.max(size / 2, Math.min(containerHeight - size / 2, baseY + offsetY - size / 2));

            const randomRotation = (Math.random() * 2 * rotationRange) - rotationRange;

            const symbolEl = createIcon(x, y, size, randomRotation, weightedRandom(svgWeights));
            bgContainer.appendChild(symbolEl);
            symbols.push({ element: symbolEl, x, y, rotation: randomRotation });
            iconIndex++;
        }
    }

    setupCursorInteraction(container, symbols, size);
    setupResizeHandler(container, symbols, count, size);
}