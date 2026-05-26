import { gsap } from "gsap";

export function initMagneticButtons() {
    // Seleccionar todos los botones con clase .btn, .magnetic-btn o botones en general
    const magneticElements = document.querySelectorAll<HTMLElement>(
        ".btn, .magnetic-btn, .btn-primary, .btn-ghost"
    );

    console.log(`Magnetic buttons found: ${magneticElements.length}`);

    magneticElements.forEach((element) => {
        // Evitar duplicar listeners
        if (element.dataset.magneticInit === "true") return;
        element.dataset.magneticInit = "true";

        // Asegurar que el elemento tenga perspective
        element.style.transformStyle = "preserve-3d";

        const handleMouseMove = (e: MouseEvent) => {
            const rect = element.getBoundingClientRect();
            const h = rect.width / 2;
            const w = rect.height / 2;
            const x = e.clientX - rect.left - h;
            const y = e.clientY - rect.top - w;

            gsap.to(element, {
                x: x * 0.35,
                y: y * 0.35,
                rotationX: -y * 0.12,
                rotationY: x * 0.12,
                scale: 1.08,
                ease: "power2.out",
                duration: 0.4,
                transformPerspective: 1000,
            });
        };

        const handleMouseLeave = () => {
            gsap.to(element, {
                x: 0,
                y: 0,
                rotationX: 0,
                rotationY: 0,
                scale: 1,
                ease: "elastic.out(1, 0.3)",
                duration: 1.2,
            });
        };

        element.addEventListener("mousemove", handleMouseMove);
        element.addEventListener("mouseleave", handleMouseLeave);
    });
}

// Auto-inicializar cuando el DOM esté listo
if (typeof window !== "undefined") {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initMagneticButtons);
    } else {
        initMagneticButtons();
    }

    // Re-inicializar después de navegación (para SPAs)
    document.addEventListener("astro:page-load", initMagneticButtons);
    
    // Re-inicializar después de transiciones de Astro
    document.addEventListener("astro:after-swap", initMagneticButtons);
}
