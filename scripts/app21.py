# dashboard_zscore.py
import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import random

st.set_page_config(page_title="Análisis Z-Score", layout="wide")

@st.cache_data
def generar_datos_financieros(num_empresas=50):
    empresas = [f"Empresa {chr(65+i)}" for i in range(num_empresas)]
    perfiles = {
        "Sana": {"activos_ratio": (0.4, 0.7), "utilidades_ratio": (0.3, 0.6), "ebitda_ratio": (0.2, 0.4), "solvencia_ratio": (2.0, 5.0), "ventas_ratio": (1.5, 3.0)},
        "En Riesgo": {"activos_ratio": (0.1, 0.4), "utilidades_ratio": (0.1, 0.3), "ebitda_ratio": (0.1, 0.2), "solvencia_ratio": (1.0, 2.0), "ventas_ratio": (1.0, 1.5)},
        "Peligro": {"activos_ratio": (-0.2, 0.1), "utilidades_ratio": (-0.5, 0.1), "ebitda_ratio": (-0.1, 0.1), "solvencia_ratio": (0.1, 1.0), "ventas_ratio": (0.5, 1.0)}
    }
    data = []
    
    for empresa in empresas:
        perfil_nombre = random.choices(list(perfiles.keys()), weights=[0.5, 0.3, 0.2], k=1)[0]
        perfil = perfiles[perfil_nombre]
        
        activos_totales = random.uniform(1_000_000, 50_000_000)
        ventas = activos_totales * random.uniform(*perfil["ventas_ratio"])
        deuda_total = random.uniform(activos_totales * 0.2, activos_totales * 0.8)
        
        data.append({
            "Empresa": empresa, "Perfil_Simulado": perfil_nombre,
            "Activo_Corriente": activos_totales * random.uniform(0.5, 0.9),
            "Pasivo_Corriente": activos_totales * random.uniform(0.2, 0.5),
            "Activos_Totales": activos_totales,
            "Utilidades_Retenidas": activos_totales * random.uniform(*perfil["utilidades_ratio"]),
            "EBITDA": activos_totales * random.uniform(*perfil["ebitda_ratio"]),
            "Valor_Mercado_Patrimonio": deuda_total * random.uniform(*perfil["solvencia_ratio"]),
            "Deuda_Total": deuda_total, "Ventas_Totales": ventas
        })
    df = pd.DataFrame(data)

    # --- Cálculo de los Ratios y Z-Score ---
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
st.sidebar.header("Filtros")
riesgo_sel = st.sidebar.multiselect(
    "Filtrar por Zona de Riesgo:",
    options=df_financiero["Zona_Riesgo"].unique(),
    default=df_financiero["Zona_Riesgo"].unique()
)
df_filtrado = df_financiero[df_financiero["Zona_Riesgo"].isin(riesgo_sel)]

# --- KPIs ---
num_empresas = len(df_filtrado)
z_promedio = df_filtrado["Z_Score"].mean()
empresas_en_peligro = len(df_filtrado[df_filtrado["Zona_Riesgo"] == "Zona de Peligro"])

col1, col2, col3 = st.columns(3)
col1.metric("Empresas Analizadas", f"{num_empresas}")
col2.metric("Z-Score Promedio", f"{z_promedio:.2f}")
col3.metric("Empresas en Peligro 🔴", f"{empresas_en_peligro}")

st.markdown("---")

# --- Visualizaciones ---
col1, col2 = st.columns(2)

with col1:
    st.subheader("Distribución de Empresas por Zona de Riesgo")
    riesgo_counts = df_filtrado["Zona_Riesgo"].value_counts()
    fig = px.pie(riesgo_counts, values=riesgo_counts.values, names=riesgo_counts.index, hole=0.4,
                 color=riesgo_counts.index,
                 color_discrete_map={"Zona Segura": "#23d18b", "Zona Gris": "#ffca2c", "Zona de Peligro": "#ff7575"})
    fig.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
    st.plotly_chart(fig, use_container_width=True)

with col2:
    st.subheader("Relación Rentabilidad (X3) vs. Solvencia (X4)")
    fig_scatter = px.scatter(df_filtrado, x="X3", y="X4", color="Zona_Riesgo",
                             hover_name="Empresa", size="Activos_Totales", size_max=60,
                             title="Diagnóstico de Empresas",
                             color_discrete_map={"Zona Segura": "#23d18b", "Zona Gris": "#ffca2c", "Zona de Peligro": "#ff7575"})
    fig_scatter.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
    st.plotly_chart(fig_scatter, use_container_width=True)

# --- Tabla Detallada con Formato Condicional ---
st.subheader("Análisis Detallado por Empresa")

def estilo_tabla_zscore(df_styled):
    def color_zscore(val):
        if val > 2.99: color = '#23d18b'
        elif val >= 1.81: color = '#ffca2c'
        else: color = '#ff7575'
        return f'background-color: {color}; color: #0d1117; font-weight: bold;'
    
    # Columnas a formatear y mostrar
    cols_to_show = ["Empresa", "X1", "X2", "X3", "X4", "X5", "Z_Score", "Zona_Riesgo"]
    format_dict = {"X1": "{:.2f}", "X2": "{:.2f}", "X3": "{:.2f}", "X4": "{:.2f}", "X5": "{:.2f}", "Z_Score": "{:.2f}"}

    return df_styled[cols_to_show].style.format(format_dict) \
                      .applymap(lambda x: 'color: #ff7575' if x < 0 else '', subset=["X1", "X2", "X3"]) \
                      .background_gradient(cmap='RdYlGn', subset=["X1", "X2", "X3", "X4", "X5"]) \
                      .map(color_zscore, subset=['Z_Score'])

st.dataframe(estilo_tabla_zscore(df_filtrado), use_container_width=True)
        