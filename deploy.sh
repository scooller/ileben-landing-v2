#!/bin/bash

# Script de deployment para compilar assets en producción

# Navegar al directorio del tema
cd /home/localesieleben/public_html/wp-content/themes/ileben-landing-v2

echo "🚀 Iniciando deployment en $(pwd)..."

# Cargar nvm si existe
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no encontrado. Instálalo manualmente con nvm."
    exit 1
fi

echo "✅ Node.js $(node -v) encontrado"

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install --production=false

# Compilar assets
echo "🔨 Compilando assets..."
npm run build:all

# Verificar que los archivos se generaron
if [ -f "dist/assets/editor.css" ] && [ -f "blocks/blocks-editor.css" ]; then
    echo "✅ Deploy completado exitosamente!"
    echo "📁 Archivos generados:"
    ls -lh dist/assets/*.css dist/assets/*.js blocks/*.css 2>/dev/null || echo "Archivos CSS generados"
else
    echo "❌ Error: No se generaron todos los archivos necesarios"
    exit 1
fi
