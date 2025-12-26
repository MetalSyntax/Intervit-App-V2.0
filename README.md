# Intervit Sales App

Una aplicación web móvil progresiva diseñada para optimizar la gestión de ventas, visitas a puntos de venta y levantamiento de información de trade marketing para el equipo de **Intervit**.

## 📋 Descripción General

Esta herramienta digital permite a los mercaderistas, supervisores y gerentes gestionar eficientemente sus rutas de visita. La aplicación centraliza la recolección de datos críticos en el punto de venta, permitiendo un seguimiento detallado del inventario, precios, fechas de vencimiento y el análisis competitivo en tiempo real.

## ✨ Características Principales

### 🔐 Acceso y Roles
- **Login Inteligente:** El sistema genera las opciones de acceso basándose en la data activa de la fuerza de ventas.
- **Filtrado de Rutas (Lógica de Negocio):**
  - **Usuarios Nacionales:** Si el usuario tiene asignado el rol o cliente "NACIONAL", tiene acceso irrestricto a todos los clientes registrados.
  - **Mercaderistas Regionales:** Visualizan estrictamente los clientes asignados a su nombre y rol específico, garantizando el foco en su ruta.

### 🏪 Selección de Clientes
- **Información Detallada:** Las tarjetas de cliente muestran datos clave para la planificación:
  - Frecuencia de visita.
  - Región y Zona.
  - Tipo de Atención.
- **Búsqueda Rápida:** Filtrado por nombre de cliente, dirección o código.

### 📦 Gestión de Productos (Pedido e Inventario)
- Catálogo de productos Intervit organizado por líneas (Terapéutica, Nutricional, Íntima, Corporal, Capilar).
- **Control Total del SKU:**
  - **Presencia:** Registro de disponibilidad (Si/No).
  - **Inventario:** Conteo de stock en almacén/piso.
  - **Caras:** Número de frentes en el anaquel.
  - **Precios:** Registro del PVP.
  - **Calidad:** Captura de Lote y Fecha de Vencimiento.
- **Interfaz Ágil:** Buscador integrado y filtros por categoría con contadores dinámicos.

### 🆚 Análisis de Competencia
- Listado pre-cargado de productos competidores.
- **Vinculación Directa:** Capacidad de asociar un producto de la competencia con un producto específico de Intervit para comparar "manzana con manzana".
- Registro de precios y caras de la competencia para análisis de *share of shelf*.

### 📊 Dashboard de Visita
- Resumen consolidado de la visita en curso.
- Edición rápida de fechas y eliminación de ítems.
- **Exportación a CSV:** Generación de reportes planos con toda la data recolectada (ID, SKU, Precios, Competencia, etc.) listos para ser procesados en Excel o sistemas BI.
- **Persistencia:** Los datos se guardan localmente durante la sesión para evitar pérdidas accidentales.

### 📱 Experiencia de Usuario (UX)
- **Diseño Mobile-First:** Botones de acción (Guardar, Volver, Cancelar) fijos en la parte inferior para facilitar el uso con una sola mano.
- **Feedback Visual:** Indicadores de productos seleccionados, contadores en tiempo real y alertas de competencia.
- **Estilo Moderno:** Interfaz limpia utilizando Tailwind CSS.

## 🛠 Stack Tecnológico

- **Core:** React 19
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Enrutamiento:** React Router DOM
- **Persistencia:** LocalStorage API
- **Iconografía:** Material Icons Round

## 🚀 Instrucciones de Uso

1. **Login:** Seleccione su nombre y cargo en la pantalla inicial.
2. **Cliente:** Busque y seleccione el punto de venta a visitar.
3. **Panel:** Verifique la fecha y proceda a "Productos" o "Competencia".
4. **Levantamiento:**
   - En *Productos*: Busque, agregue y complete los detalles (precio, stock, etc.). Guarde para volver al panel.
   - En *Competencia*: Seleccione productos rivales, asócielos a los suyos y registre sus precios.
5. **Cierre:** En el Dashboard, revise el resumen y presione **"Guardar Registro (CSV)"** para descargar el reporte de la visita.
