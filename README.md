# 🐍 Curso Maestro: Python, Data Science, Machine Learning & 30 Dashboards Streamlit Pro

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-success?style=for-the-badge&logo=github)](https://juancitopena.github.io/curso-python-data-science-streamlit-pro/)
[![Python](https://img.shields.io/badge/Python-3.12%2B-blue?style=for-the-badge&logo=python)](https://www.python.org/)
[![WebAssembly](https://img.shields.io/badge/WebAssembly-Pyodide%20v0.26.1-654FF0?style=for-the-badge&logo=webassembly)](https://pyodide.org/)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.35%2B-FF4B4B?style=for-the-badge&logo=streamlit)](https://streamlit.io/)
[![Status](https://img.shields.io/badge/Version-v3.5.0--PRO-brightgreen?style=for-the-badge)](STATUS_PROYECTO.md)

> **Autor:** Ing. Juancito Peña  
> **Plataforma Web en Vivo:** [juancitopena.github.io/curso-python-data-science-streamlit-pro](https://juancitopena.github.io/curso-python-data-science-streamlit-pro/)  
> **Repositorio Oficial:** [github.com/JUANCITOPENA/curso-python-data-science-streamlit-pro](https://github.com/JUANCITOPENA/curso-python-data-science-streamlit-pro)

---

## 🌟 ¿Qué es este Proyecto?
Es el ecosistema pedagógico y aplicativo más exhaustivo del mundo hispanohablante para aprender Python desde cero hasta el nivel de Arquitecto de Datos y Machine Learning.

La versión **v3.5.0-PRO** integra un **Laboratorio Interactivo WebAssembly (Pyodide v0.26.1)** directo en el navegador, permitiendo ejecutar código Python, renderizar **múltiples gráficos secuenciales en alta definición**, subir datasets propios y exportar resultados sin necesidad de instalar nada ni gastar créditos de APIs.

---

## ⚡ Novedades de la Versión v3.5.0-PRO (WebAssembly Studio)

1. **Botón Global "⚡ Probar y Ejecutar":** Presente en **cada bloque de código** del portal para probar scripts de inmediato en una ventana modal interactiva.
2. **Soporte Multigráfico:** Captura simultánea de todas las figuras de Matplotlib (`plt.figure()`), Seaborn, Plotly y Folium generadas por el script.
3. **Gestor de Datasets y VFS en Memoria:**
   - Sube tus propios archivos `.csv`, `.xlsx` o `.json` arrastrándolos al modal.
   - Genera 5 datasets sintéticos en 1 clic (Finanzas Anual, Ventas Masivas 1,000, Sentimientos NLP, Solicitudes Bancarias y Titanic).
4. **11 Laboratorios Técnicos Oficiales de JPV_PyStudio:**
   - 🚢 *Titanic EDA & Limpieza Web* (Pandas / Matplotlib)
   - 📊 *Seaborn Heatmap & Matrices de Correlación* (Seaborn / NumPy)
   - 🤖 *Modelo Predictivo de Regresión Lineal* (Scikit-Learn)
   - 🌐 *Consumo de APIs RESTful en vivo* (Requests / HTTPS)
   - 📑 *Automatización de Reportes Excel Empresariales* (OpenPyXL / XlsxWriter)
   - 🗺️ *Mapas Geoespaciales Satelitales y Rutas AntPath* (Folium / Leaflet)
   - 📈 *Dashboards Interactivos 3D y Dispersión* (Plotly Express)
   - 🕸️ *Topología de Redes y Ruteo Óptimo* (NetworkX / Grafos)
   - ☁️ *Minería de Texto y Nubes Semánticas* (WordCloud / NLP)
   - 🔬 *Optimización y Ajuste de Curvas No Lineales* (SciPy)
   - 🎬 *Cockpit Multigráfico 8-en-1* (Subplots Matplotlib)

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

---

## 🏛️ Estándares y Gobernanza JPV
- **WCAG 2.2 AAA:** Alto contraste en todas las interfaces y componentes interactivos.
- **Neo-Brutalist Design:** Bordes limpios de 2px/3px, sombras de bloque sólidas (#000), tipografía `Space Grotesk` y `JetBrains Mono`.
- **Privacidad Total (Zero-Trust):** La ejecución en WebAssembly se procesa 100% en el procesador y memoria RAM del cliente, sin enviar datos a la nube.
