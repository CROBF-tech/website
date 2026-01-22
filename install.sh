#!/bin/bash

echo "🚀 Instalando dependencias del proyecto CROBF..."
echo ""

# Instalar dependencias de la web principal
echo "📦 Instalando dependencias de la web principal..."
npm install

echo ""
echo "📦 Instalando dependencias del blog..."
cd Blog
npm install
cd ..

echo ""
echo "✅ ¡Instalación completada!"
echo ""
echo "📋 Comandos disponibles:"
echo ""
echo "  Web Principal:"
echo "    npm run dev     - Iniciar servidor de desarrollo"
echo "    npm run build   - Construir para producción"
echo ""
echo "  Blog:"
echo "    cd Blog"
echo "    npm run dev     - Iniciar servidor de desarrollo (puerto 4321)"
echo "    npm run build   - Construir para producción"
echo ""
