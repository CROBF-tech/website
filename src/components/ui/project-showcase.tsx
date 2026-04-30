"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { ArrowUpRight, List, Grid2X2 } from "lucide-react"

interface Project {
  title: string
  description: string
  year: string
  link: string
  image: string
  location: string
}

interface ProjectShowcaseProps {
  lang?: string
}

const projects: Project[] = [
  {
    title: "Catálogo Digital",
    description: "E-commerce & Development",
    year: "2025",
    link: "/catalogo-digital",
    image: "/images/olympo-phone-screen.png",
    location: "Argentina",
  },
  {
    title: "Hexadevs",
    description: "Design & Development",
    year: "2024",
    link: "/hexadevs",
    image: "/projects/hexadevs.png",
    location: "Argentina",
  },
  {
    title: "Taskflow",
    description: "Design & Development",
    year: "2024",
    link: "/taskflow",
    image: "/projects/todo-app.svg",
    location: "Argentina",
  },
  {
    title: "Learning Hub",
    description: "Design & Development",
    year: "2023",
    link: "/learning-hub",
    image: "/projects/flashcards.svg",
    location: "Argentina",
  },
  {
    title: "Bunny JS",
    description: "Design & Development",
    year: "2023",
    link: "/bunny-js",
    image: "/projects/bunny-js.svg",
    location: "Argentina",
  },
]

export function ProjectShowcase({ lang = "es" }: ProjectShowcaseProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid')
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)

  const projectsWithLang = projects.map(project => ({
    ...project,
    link: `/${lang}/projects${project.link}`
  }))

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor
    }

    const animate = () => {
      setSmoothPosition((prev) => ({
        x: lerp(prev.x, mousePosition.x, 0.15),
        y: lerp(prev.y, mousePosition.y, 0.15),
      }))
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mousePosition])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index)
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null)
    setIsVisible(false)
  }

  return (
    <section ref={containerRef} onMouseMove={handleMouseMove} className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
      <div className="flex items-start justify-between mb-10">
        <h2 className="text-foreground text-[4rem] sm:text-[7rem] md:text-[10rem] lg:text-[13rem] font-normal tracking-tight leading-[1.1]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          Creando productos digitales<br />de última generación
        </h2>
        
        {/* View Toggle Buttons - Hidden on mobile */}
        {!isMobile && (
          <div className="flex gap-4 mt-36">
            <button
              onClick={() => setViewMode('list')}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                viewMode === 'list' 
                  ? 'bg-[#1a1a1a] border-2 border-[#1a1a1a]' 
                  : 'bg-transparent border-2 border-[#e0e0e0]'
              }`}
              aria-label="Vista de lista"
            >
              <List className={`w-6 h-6 ${viewMode === 'list' ? 'text-white' : 'text-[#666666]'}`} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                viewMode === 'grid' 
                  ? 'bg-[#1a1a1a] border-2 border-[#1a1a1a]' 
                  : 'bg-transparent border-2 border-[#e0e0e0]'
              }`}
              aria-label="Vista de cuadrícula"
            >
              <Grid2X2 className={`w-6 h-6 ${viewMode === 'grid' ? 'text-white' : 'text-[#666666]'}`} />
            </button>
          </div>
        )}
      </div>

      <div
        className="pointer-events-none fixed z-50 overflow-hidden rounded-xl shadow-2xl"
        style={{
          left: containerRef.current?.getBoundingClientRect().left ?? 0,
          top: containerRef.current?.getBoundingClientRect().top ?? 0,
          transform: `translate3d(${smoothPosition.x + 20}px, ${smoothPosition.y - 100}px, 0)`,
          opacity: isVisible && viewMode === 'list' ? 1 : 0,
          scale: isVisible && viewMode === 'list' ? 1 : 0.8,
          transition: "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), scale 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="relative w-[280px] h-[180px] bg-secondary rounded-xl overflow-hidden">
          {projects.map((project, index) => (
            <img
              key={project.title}
              src={project.image}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out"
              style={{
                opacity: hoveredIndex === index ? 1 : 0,
                scale: hoveredIndex === index ? 1 : 1.1,
                filter: hoveredIndex === index ? "none" : "blur(10px)",
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
        </div>
      </div>

      {(viewMode === 'list' && !isMobile) ? (
        <>
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 pb-4 mb-2 mt-0 border-b border-foreground/15 dark:border-foreground/20">
            <div className="col-span-4 text-xs font-medium tracking-wider uppercase text-muted-foreground">
              Client
            </div>
            <div className="col-span-3 text-xs font-medium tracking-wider uppercase text-muted-foreground">
              Location
            </div>
            <div className="col-span-4 text-xs font-medium tracking-wider uppercase text-muted-foreground">
              Services
            </div>
            <div className="col-span-1 text-xs font-medium tracking-wider uppercase text-muted-foreground text-right">
              Year
            </div>
          </div>

          {/* Table Rows */}
          <div className="space-y-0">
            {projectsWithLang.map((project, index) => (
              <a
                key={project.title}
                href={project.link}
                className="group block [&:link]:!text-inherit [&:visited]:!text-inherit [&:hover]:!text-inherit [&:active]:!text-inherit [&_*]:![color:inherit]"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="relative py-6 transition-all duration-300 ease-out border-b border-foreground/15 dark:border-foreground/20">
                  <div
                    className={`absolute inset-0 -mx-4 px-4 bg-secondary/30 rounded-lg
                      transition-all duration-300 ease-out
                      ${hoveredIndex === index ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                  />

                  <div className="relative grid grid-cols-12 gap-4 items-center">
                    {/* Client Name */}
                    <div className="col-span-4">
                      <h3 className="!text-foreground font-medium text-xl tracking-tight">
                        {project.title}
                      </h3>
                    </div>

                    {/* Location */}
                    <div className="col-span-3">
                      <p className="text-base" style={{ color: '#000000' }}>
                        <span className="dark:!text-white">{project.location}</span>
                      </p>
                    </div>

                    {/* Services */}
                    <div className="col-span-4">
                      <p className="text-base" style={{ color: '#000000' }}>
                        <span className="dark:!text-white">{project.description}</span>
                      </p>
                    </div>

                    {/* Year */}
                    <div className="col-span-1 text-right">
                      <span className="text-base tabular-nums" style={{ color: '#000000' }}>
                        <span className="dark:!text-white">{project.year}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-0">
          {projectsWithLang.map((project, index) => {
            // Array de colores de fondo: beige, gris, negro alternados
            const bgColors = [
              '#d4c5b9', // beige
              '#2d2d2d', // negro/gris muy oscuro
              '#e8e4df', // beige claro
              '#1a1a1a', // negro
              '#c9b8a8', // beige medio
            ];
            
            return (
              <a
                key={project.title}
                href={project.link}
                className="group block"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <div 
                  className="relative overflow-hidden aspect-[4/3] mb-6 transition-all duration-500 group-hover:shadow-2xl flex items-center justify-center p-8 md:p-12" 
                  style={{ 
                    backgroundColor: bgColors[index % bgColors.length],
                  }}
                >
                  <div className="relative bg-white rounded-lg shadow-xl overflow-hidden w-[75%] h-[70%] transition-transform duration-500 group-hover:scale-105">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-3 px-2">
                  <h3 className="text-foreground font-semibold text-xl md:text-2xl tracking-tight">
                    {project.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm md:text-base border-t border-border/30 pt-3">
                    <span style={{ color: '#666666' }}><span className="dark:!text-gray-300">{project.description}</span></span>
                    <span className="tabular-nums font-medium" style={{ color: '#000000' }}><span className="dark:!text-white">{project.year}</span></span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </section>
  )
}
