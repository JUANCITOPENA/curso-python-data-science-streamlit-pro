# dashboard_zscore.py
import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
import random

st.set_page_config(page_title="Análisis Z-Score", layout="wide")

@st.cache_data
def generar_datos_financieros(num_empresas=100): # Aumentamos el número de empresas
    empresas = [f"Empresa {chr(65+i)}{i}" for i in range(num_empresas)]
    sectores = ["Tecnología", "Retail", "Industrial", "Salud", "Consumo"]
    perfiles = {
        "Sana": {"activos_ratio": (0.4, 0.7), "utilidades_ratio": (0.3, 0.6), "ebitda_ratio": (0.2, 0.4), "solvencia_ratio": (2.0, 5.0), "ventas_ratio": (1.5, 3.0)},
        "En Riesgo": {"activos_ratio": (0.1, 0.4), "utilidades_ratio": (0.1, 0.3), "ebitda_ratio": (0.1, 0.2), "solvencia_ratio": (1.0, 2.0), "ventas_ratio": (1.0, 1.5)},
        "Peligro": {"activos_ratio": (-0.2, 0.1), "utilidades_ratio": (-0.5, 0.1), "ebitda_ratio": (-0.1, 0.1), "solvencia_ratio": (0.1, 1.0), "ventas_ratio": (0.5, 1.0)}
    }
    data = []
    
    for empresa in empresas:
        perfil_nombre = random.choices(list(perfiles.keys()), weights=[0.5, 0.3, 0.2], k=1)[0]
        perfil = perfiles[perfil_nombre]
        
        activos_totales = random.uniform(1_000_000, 100_000_000)
        ventas = activos_totales * random.uniform(*perfil["ventas_ratio"])
        deuda_total = random.uniform(activos_totales * 0.2, activos_totales * 0.8)
        
        data.append({
            "Empresa": empresa, "Sector": random.choice(sectores), "Perfil_Simulado": perfil_nombre,
            "Activo_Corriente": activos_totales * random.uniform(0.5, 0.9),
            "Pasivo_Corriente": activos_totales * random.uniform(0.2, 0.5),
            "Activos_Totales": activos_totales,
            "Utilidades_Retenidas": activos_totales * random.uniform(*perfil["utilidades_ratio"]),
            "EBITDA": activos_totales * random.uniform(*perfil["ebitda_ratio"]),
            "Valor_Mercado_Patrimonio": deuda_total * random.uniform(*perfil["solvencia_ratio"]),
            "Deuda_Total": deuda_total, "Ventas_Totales": ventas
        })
    df = pd.DataFrame(data)

    df["X1"] = (df["Activo_Corriente"] - df["Pasivo_Corriente"]) / df["Activos_Totales"]
    df["X2"] = df["Utilidades_Retenidas"] / df["Activos_Totales"]
    df["X3"] = df["EBITDA"] / df["Activos_Totales"]
    df["X4"] = df["Valor_Mercado_Patrimonio"] / df["Deuda_Total"]
    df["X5"] = df["Ventas_Totales"] / df["Activos_Totales"]
    df["Z_Score"] = 1.2*df["X1"] + 1.4*df["X2"] + 3.3*df["X3"] + 0.6*df["X4"] + 1.0*df["X5"]
    
    def clasificar_riesgo(z):
        if z > 2.99: return "Zona Segura"
        if z >= 1.81: return "Zona Gris"
        return "Zona de Peligro"
    
    df["Zona_Riesgo"] = df["Z_Score"].apply(clasificar_riesgo)
    return df

df_financiero = generar_datos_financieros()

st.title("🩺 Dashboard de Diagnóstico Financiero (Z-Score de Altman)")

# --- Filtros ---
st.sidebar.header("Filtros de Análisis")
riesgo_sel = st.sidebar.multiselect("Zona de Riesgo:", df_financiero["Zona_Riesgo"].unique(), df_financiero["Zona_Riesgo"].unique())
sector_sel = st.sidebar.multiselect("Sector:", df_financiero["Sector"].unique(), df_financiero["Sector"].unique())
df_filtrado = df_financiero.query("Zona_Riesgo == @riesgo_sel & Sector == @sector_sel")

# --- KPIs Condicionales ---
num_empresas = len(df_filtrado)
z_promedio = df_filtrado["Z_Score"].mean()
empresas_en_peligro = len(df_filtrado[df_filtrado["Zona_Riesgo"] == "Zona de Peligro"])
pct_en_peligro = (empresas_en_peligro / num_empresas * 100) if num_empresas > 0 else 0

# Lógica para el KPI condicional
kpi_riesgo_texto = "Bajo Riesgo General 😊"
kpi_riesgo_delta_color = "normal"
if z_promedio < 1.81:
    kpi_riesgo_texto = "Alto Riesgo General 🔴"
    kpi_riesgo_delta_color = "inverse"
elif z_promedio < 2.99:
    kpi_riesgo_texto = "Riesgo Moderado 🟡"
    kpi_riesgo_delta_color = "off"

col1, col2, col3, col4 = st.columns(4)
col1.metric("Empresas Analizadas", f"{num_empresas}")
col2.metric("Estado General del Portafolio", kpi_riesgo_texto, f"Z-Score Prom: {z_promedio:.2f}", delta_color=kpi_riesgo_delta_color)
col3.metric("Empresas en Peligro", f"{empresas_en_peligro}", f"{pct_en_peligro:.1f}% del total")
col4.metric("Valor Total en Activos", f"${df_filtrado['Activos_Totales'].sum()/1e6:.2f}M")

st.markdown("---")

# --- FILA 1 DE GRÁFICOS ---
st.subheader("Análisis General de Riesgo y Composición")
col1, col2 = st.columns(2)

with col1:
    # GRÁFICO 1: Distribución por Zona de Riesgo
    riesgo_counts = df_filtrado["Zona_Riesgo"].value_counts()
    fig = px.pie(riesgo_counts, values=riesgo_counts.values, names=riesgo_counts.index, hole=0.4,
                 title="Distribución de Empresas por Zona de Riesgo",
                 color=riesgo_counts.index,
                 color_discrete_map={"Zona Segura": "#23d18b", "Zona Gris": "#ffca2c", "Zona de Peligro": "#ff7575"})
    fig.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
    st.plotly_chart(fig, use_container_width=True)

with col2:
    # GRÁFICO 2: Z-Score Promedio por Sector
    df_sector = df_filtrado.groupby("Sector")["Z_Score"].mean().sort_values(ascending=False).reset_index()
    fig_bar = px.bar(df_sector, x="Sector", y="Z_Score", text="Z_Score",
                     title="Z-Score Promedio por Sector Industrial",
                     color="Z_Score", color_continuous_scale="RdYlGn", range_color=[1, 4])
    fig_bar.update_traces(texttemplate='%{y:.2f}', textposition='outside')
    fig_bar.add_hline(y=1.81, line_dash="dash", line_color="#ff7575", annotation_text="Peligro")
    fig_bar.add_hline(y=2.99, line_dash="dash", line_color="#ffca2c", annotation_text="Gris")
    fig_bar.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
    st.plotly_chart(fig_bar, use_container_width=True)

# --- FILA 2 DE GRÁFICOS ---
st.subheader("Diagnóstico de Ratios Financieros")
col1, col2 = st.columns(2)

with col1:
    # GRÁFICO 3: Mapa de Calor de Correlación de Ratios
    corr_matrix = df_filtrado[['X1', 'X2', 'X3', 'X4', 'X5', 'Z_Score']].corr()
    fig_heatmap = px.imshow(corr_matrix, text_auto=".2f", aspect="auto",
                            title="Correlación entre Ratios Financieros y Z-Score",
                            color_continuous_scale="Blues")
    fig_heatmap.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
    st.plotly_chart(fig_heatmap, use_container_width=True)

with col2:
    # GRÁFICO 4: Gráfico de Dispersión (Scatter Plot)
    fig_scatter = px.scatter(df_filtrado, x="X3", y="X4", color="Zona_Riesgo",
                             hover_name="Empresa", size="Activos_Totales", size_max=40,
                             title="Diagnóstico Rentabilidad (X3) vs. Solvencia (X4)",
                             color_discrete_map={"Zona Segura": "#23d18b", "Zona Gris": "#ffca2c", "Zona de Peligro": "#ff7575"})
    fig_scatter.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
    st.plotly_chart(fig_scatter, use_container_width=True)

# --- FILA 3: GRÁFICO DE LÍNEA Y TABLA DETALLADA ---
st.subheader("Análisis Detallado por Empresa")
col1, col2 = st.columns(2)

with col1:
    # GRÁFICO 5: Tendencia de Ratios por Empresa
    empresa_sel = st.selectbox("Selecciona una empresa para ver sus ratios:", df_filtrado["Empresa"].unique())
    df_empresa = df_filtrado[df_filtrado["Empresa"] == empresa_sel][['X1', 'X2', 'X3', 'X4', 'X5']].melt()
    df_empresa.columns = ["Ratio", "Valor"]
    
    fig_line = px.line_polar(df_empresa, r='Valor', theta='Ratio', line_close=True,
                             title=f"Perfil Financiero de {empresa_sel}")
    fig_line.update_traces(fill='toself')
    fig_line.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
    st.plotly_chart(fig_line, use_container_width=True)

with col2:
    # TABLA 6: Tabla Detallada con Formato Condicional
    st.write("**Tabla de Diagnóstico (Top 20)**") # Usamos st.write para un subtítulo más pequeño
    def estilo_tabla_zscore(df_styled):
        def color_zscore(val):
            if val > 2.99: color = '#23d18b'
            elif val >= 1.81: color = '#ffca2c'
            else: color = '#ff7575'
            return f'background-color: {color}; color: #0d1117; font-weight: bold;'
        
        cols_to_show = ["Empresa", "Z_Score", "Zona_Riesgo"]
        format_dict = {"Z_Score": "{:.2f}"}

        return df_styled.sort_values("Z_Score", ascending=True)[cols_to_show].head(20).style \
                          .format(format_dict) \
                          .apply(lambda row: ['font-weight: bold' if True else ''] * len(row), axis=1) \
                          .map(color_zscore, subset=['Z_Score'])
    st.dataframe(estilo_tabla_zscore(df_filtrado), use_container_width=True, height=730)