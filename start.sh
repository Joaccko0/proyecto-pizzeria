#!/bin/bash

# Script para iniciar Backend y Frontend en paralelo
# Uso: ./start.sh

set -e  # Salir si hay error

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Iniciando Pizzería Backend + Frontend ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Función para manejar Ctrl+C
cleanup() {
    echo ""
    echo -e "${YELLOW}⏹  Deteniendo procesos...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    echo -e "${GREEN}✓ Procesos terminados${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Iniciar Backend
echo -e "${YELLOW}▶ Iniciando Backend (Spring Boot)...${NC}"
if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${RED}✗ Error: Directorio backend no encontrado en $BACKEND_DIR${NC}"
    exit 1
fi

cd "$BACKEND_DIR"
# Verificar si existe mvnw (Maven Wrapper)
if [ -f "mvnw" ]; then
    ./mvnw spring-boot:run > /tmp/backend.log 2>&1 &
else
    mvn spring-boot:run > /tmp/backend.log 2>&1 &
fi
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend iniciado (PID: $BACKEND_PID)${NC}"
echo -e "  Logs: tail -f /tmp/backend.log"
echo ""

# Esperar un poco para que el backend se inicie
sleep 3

# Iniciar Frontend
echo -e "${YELLOW}▶ Iniciando Frontend (Vite)...${NC}"
if [ ! -d "$FRONTEND_DIR" ]; then
    echo -e "${RED}✗ Error: Directorio frontend no encontrado en $FRONTEND_DIR${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

# Verificar si las dependencias están instaladas
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    echo -e "${YELLOW}  Installing dependencies...${NC}"
    cd "$FRONTEND_DIR"
    npm install
fi

cd "$FRONTEND_DIR"
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend iniciado (PID: $FRONTEND_PID)${NC}"
echo -e "  Logs: tail -f /tmp/frontend.log"
echo ""

# Mostrar URLs
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        Servicios en ejecución          ║${NC}"
echo -e "${BLUE}╠════════════════════════════════════════╣${NC}"
echo -e "${BLUE}║ Backend:  ${GREEN}http://localhost:8080${BLUE}        ║${NC}"
echo -e "${BLUE}║ Frontend: ${GREEN}http://localhost:5173${BLUE}        ║${NC}"
echo -e "${BLUE}║ API:      ${GREEN}http://localhost:8080/api${BLUE}    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Presiona Ctrl+C para detener ambos servicios${NC}"
echo ""

# Mantener el script corriendo
wait