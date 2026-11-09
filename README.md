# 🐍 Curso Maestro: Python, Data Science, Machine Learning & 30 Dashboards Streamlit Pro

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-success?style=for-the-badge&logo=github)](https://juancitopena.github.io/curso-python-data-science-streamlit-pro/)
[![Python](https://img.shields.io/badge/Python-3.12%2B-blue?style=for-the-badge&logo=python)](https://www.python.org/)
[![WebAssembly](https://img.shields.io/badge/WebAssembly-Pyodide%20v0.26.1-654FF0?style=for-the-badge&logo=webassembly)](https://pyodide.org/)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.35%2B-FF4B4B?style=for-the-badge&logo=streamlit)](https://streamlit.io/)
[![Status](https://img.shields.io/badge/Version-v4.0.0--PRO-brightgreen?style=for-the-badge)](STATUS_PROYECTO.md)

> **Autor:** Ing. Juancito Peña  
> **Plataforma Web en Vivo:** [juancitopena.github.io/curso-python-data-science-streamlit-pro](https://juancitopena.github.io/curso-python-data-science-streamlit-pro/)  
> **Repositorio Oficial:** [github.com/JUANCITOPENA/curso-python-data-science-streamlit-pro](https://github.com/JUANCITOPENA/curso-python-data-science-streamlit-pro)

---

## 🌟 ¿Qué es este Proyecto?
Es el ecosistema pedagógico y aplicativo más exhaustivo del mundo hispanohablante para aprender Python desde cero hasta el nivel de Arquitecto de Datos y Machine Learning.

La versión **v4.0.0-PRO** integra la **Terminal de Pruebas Python & Consola Gráfica (Estándar Diplomado CAES)** directo en el navegador con Pyodide WebAssembly, erradicando ventanas emergentes de JavaScript (`alert()`), incorporando guardias anti-bucle infinito, entrada de datos interactiva en consola, alertas didácticas para proyectos locales (Streamlit, SQL Server, Tkinter) y descarga de fotos del código en alta resolución.

---

## ⚡ Novedades de la Versión v4.0.0-PRO (Diplomado CAES Edition)

1. **Terminal Idéntica a Diplomado CAES:** Ventana con botones estilo Mac (🔴🟡🟢), tema `#0f172a`, pantalla completa togglable y doble columna (código fuente editable + consola de ejecución).
2. **Cero Popups de JavaScript:** Eliminadas de forma estricta todas las llamadas a `alert()` o `window.prompt()`.
3. **Entrada Interactiva `input()` en Terminal:** Formulario dinámico integrado en consola para solicitudes de entrada con corte seguro anti-bucle infinito.
4. **Alertas Didácticas para Entornos Locales:**
   - 💡 *Streamlit:* Pasos de instalación, archivo y botón para abrir el servidor local activo en `:8503`.
   - 🗄️ *SQL Server:* Cadena de conexión y guía para SSMS y DBeaver.
   - 💻 *Desktop GUI:* Comandos para Tkinter y CustomTkinter.
5. **📸 Descargar Foto del Código (Snapshot HD):** Exportación en 1 clic de imagen estética del script en formato PNG con marco de ventana y firma del autor.
6. **Múltiples Gráficos Secuenciales:** Captura y renderizado de cada figura Matplotlib con botón "Ver en Grande" y "Guardar PNG".
7. **Gestor de Datasets VFS:** Subida de datasets propios y generador de datos de prueba en 1 clic.

---

## 🚀 Inicio Rápido Local

### 1. Clonar el repositorio
```powershell
git clone https://github.com/JUANCITOPENA/curso-python-data-science-streamlit-pro.git
cd curso-python-data-science-streamlit-pro
```

### 2. Levantar el portal interactivo web (Puerto 8080)
```powershell
python -m http.server 8080
# Abre en tu navegador: http://localhost:8080
```

### 3. Ejecutar los Dashboards en Streamlit (Ejemplo: App 30)
```powershell
pip install -r requirements.txt
streamlit run scripts/app30.py --server.port 8503
# Abre en tu navegador: http://localhost:8503
```
