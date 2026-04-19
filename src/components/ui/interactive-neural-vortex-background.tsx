import React, { useEffect, useRef } from "react";

type InteractiveNeuralVortexProps = {
    className?: string;
    hideHero?: boolean;
    embedded?: boolean;
};

const InteractiveNeuralVortex = ({ className = "", hideHero = false, embedded = false }: InteractiveNeuralVortexProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const pointer = useRef({ x: 0, y: 0, tX: 0, tY: 0 });
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        const canvasEl = canvasRef.current;
        if (!canvasEl) return;

        const gl =
            (canvasEl.getContext("webgl") as WebGLRenderingContext | null) ||
            (canvasEl.getContext("experimental-webgl") as WebGLRenderingContext | null);

        if (!gl) {
            console.error("WebGL not supported");
            return;
        }

        const vsSource = `
      precision mediump float;
      attribute vec2 a_position;
      varying vec2 vUv;
      void main() {
        vUv = .5 * (a_position + 1.);
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

        const fsSource = `
      precision mediump float;
      varying vec2 vUv;
      uniform float u_time;
      uniform float u_ratio;
      uniform vec2 u_pointer_position;
      uniform float u_scroll_progress;

      vec2 rotate(vec2 uv, float th) {
        return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
      }

      float neuro_shape(vec2 uv, float t, float p) {
        vec2 sine_acc = vec2(0.);
        vec2 res = vec2(0.);
        float scale = 8.;
        for (int j = 0; j < 15; j++) {
          uv = rotate(uv, 1.);
          sine_acc = rotate(sine_acc, 1.);
          vec2 layer = uv * scale + float(j) + sine_acc - t;
          sine_acc += sin(layer) + 2.4 * p;
          res += (.5 + .5 * cos(layer)) / scale;
          scale *= (1.2);
        }
        return res.x + res.y;
      }

      void main() {
        vec2 uv = .5 * vUv;
        uv.x *= u_ratio;
        vec2 pointer = vUv - u_pointer_position;
        pointer.x *= u_ratio;
        float p = clamp(length(pointer), 0., 1.);
        p = .5 * pow(1. - p, 2.);
        float t = .001 * u_time;
        vec3 color = vec3(0.);
        float noise = neuro_shape(uv, t, p);
        noise = 1.2 * pow(noise, 3.);
        noise += pow(noise, 10.);
        noise = max(.0, noise - .5);
        noise *= (1. - length(vUv - .5));
        color = vec3(0.5, 0.15, 0.65);
        color = mix(color, vec3(0.02, 0.7, 0.9), 0.32 + 0.16 * sin(2.0 * u_scroll_progress + 1.2));
        color += vec3(0.15, 0.0, 0.6) * sin(2.0 * u_scroll_progress + 1.5);
        color = color * noise;
        gl_FragColor = vec4(color, noise);
      }
    `;

        const compileShader = (context: WebGLRenderingContext, source: string, type: number) => {
            const shader = context.createShader(type);
            if (!shader) return null;
            context.shaderSource(shader, source);
            context.compileShader(shader);
            if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
                console.error("Shader error:", context.getShaderInfoLog(shader));
                context.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const vertexShader = compileShader(gl, vsSource, gl.VERTEX_SHADER);
        const fragmentShader = compileShader(gl, fsSource, gl.FRAGMENT_SHADER);
        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("Program link error:", gl.getProgramInfoLog(program));
            return;
        }

        gl.useProgram(program);

        const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
        const vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) return;

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        const uTime = gl.getUniformLocation(program, "u_time");
        const uRatio = gl.getUniformLocation(program, "u_ratio");
        const uPointerPosition = gl.getUniformLocation(program, "u_pointer_position");
        const uScrollProgress = gl.getUniformLocation(program, "u_scroll_progress");

        const resizeCanvas = () => {
            const devicePixelRatio = Math.min(window.devicePixelRatio, 2);
            canvasEl.width = window.innerWidth * devicePixelRatio;
            canvasEl.height = window.innerHeight * devicePixelRatio;
            gl.viewport(0, 0, canvasEl.width, canvasEl.height);
            if (uRatio) gl.uniform1f(uRatio, canvasEl.width / canvasEl.height);
        };

        const render = () => {
            const currentTime = performance.now();
            pointer.current.x += (pointer.current.tX - pointer.current.x) * 0.2;
            pointer.current.y += (pointer.current.tY - pointer.current.y) * 0.2;

            if (uTime) gl.uniform1f(uTime, currentTime);
            if (uPointerPosition) {
                gl.uniform2f(
                    uPointerPosition,
                    pointer.current.x / Math.max(1, window.innerWidth),
                    1 - pointer.current.y / Math.max(1, window.innerHeight)
                );
            }
            if (uScrollProgress) {
                gl.uniform1f(uScrollProgress, window.scrollY / (2 * Math.max(1, window.innerHeight)));
            }

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            animationRef.current = requestAnimationFrame(render);
        };

        const handleMouseMove = (e: PointerEvent) => {
            pointer.current.tX = e.clientX;
            pointer.current.tY = e.clientY;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches[0]) {
                pointer.current.tX = e.touches[0].clientX;
                pointer.current.tY = e.touches[0].clientY;
            }
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        window.addEventListener("pointermove", handleMouseMove);
        window.addEventListener("touchmove", handleTouchMove, { passive: true });
        render();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            window.removeEventListener("pointermove", handleMouseMove);
            window.removeEventListener("touchmove", handleTouchMove);
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            gl.deleteProgram(program);
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
            gl.deleteBuffer(vertexBuffer);
        };
    }, []);

    return (
        <div className={`relative flex flex-col items-center justify-center overflow-hidden font-sans ${embedded ? "w-full h-full min-h-0" : "min-h-screen"} ${className}`}>
            <canvas
                ref={canvasRef}
                id="neuro"
                className={`${embedded ? "absolute inset-0" : "fixed inset-0"} w-full h-full pointer-events-none opacity-95 z-0`}
            ></canvas>

            {!hideHero && (
                <section className="flex flex-col items-center justify-center flex-1 w-full px-6 z-10 mt-16">
                    <div className="max-w-2xl w-full outline-style rounded-3xl px-8 py-14 text-center backdrop-blur-md animate-seq">
                        <h1 className="geist-heading geist-h1">Step Into the Future of VR</h1>
                        <p className="geist-heading geist-h2 mb-9 text-white/60">
                            ImmersiaVR delivers breathtaking realism, seamless interaction, and endless possibilities for
                            gaming, education, and beyond.
                        </p>
                        <a href="#get-started" className="inline-block px-8 py-4 rounded-xl outline-btn font-semibold text-white">
                            Get Started
                        </a>
                    </div>
                </section>
            )}

            <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-seq { animation: slideInUp 0.8s both; }
        .geist-heading {
          font-family: 'Geist', ui-sans-serif, system-ui, sans-serif;
          font-weight: 300;
          letter-spacing: -0.02em;
          color: #fff;
          margin-bottom: 0.5em;
        }
        .geist-h1 { font-size: 48px; line-height: 1.05; }
        @media (min-width: 768px) { .geist-h1 { font-size: 64px; } }
        .geist-h2 { font-size: 20px; line-height: 1.2; }
        .outline-style,
        .outline-btn,
        .outline-card {
          border: 2px solid rgba(255,255,255,0.10) !important;
          background: transparent;
          box-shadow: none;
        }
      `}</style>
        </div>
    );
};

export default InteractiveNeuralVortex;
