
# dashboard_politico.py
import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import random

st.set_page_config(page_title="Análisis Electoral", layout="wide")

@st.cache_data
def generar_votos(num_mesas=500):
    regiones = ["Andalucía", "Cataluña", "Madrid", "Valencia", "Galicia"]
    zonas = ["Urbana", "Rural"]
    grupos_edad = ["18-30", "31-50", "51+"]
    data = []

    for i in range(num_mesas):
        data.append({
            "ID_Mesa": 3000 + i,
            "Region": random.choice(regiones),
            "Zona": random.choice(zonas),
            "Grupo_Edad": random.choice(grupos_edad),
            "Votos_Partido_A": random.randint(50, 200),
            "Votos_Partido_B": random.randint(50, 200),
            "Votos_Otros": random.randint(10, 50)
        })
    df = pd.DataFrame(data)
    df["Total_Votos"] = df["Votos_Partido_A"] + df["Votos_Partido_B"] + df["Votos_Otros"]
    return df

df_votos = generar_votos()

st.title("🗳️ Dashboard de Análisis de Votaciones Políticas")

# --- Filtros ---
st.sidebar.header("Filtros")
region_sel = st.sidebar.multiselect("Región", df_votos["Region"].unique(), df_votos["Region"].unique())
zona_sel = st.sidebar.multiselect("Zona", df_votos["Zona"].unique(), df_votos["Zona"].unique())
df_filtrado = df_votos.query("Region == @region_sel & Zona == @zona_sel")

# --- KPIs ---
total_votos = df_filtrado["Total_Votos"].sum()
votos_a = df_filtrado["Votos_Partido_A"].sum()
votos_b = df_filtrado["Votos_Partido_B"].sum()

col1, col2, col3 = st.columns(3)
col1.metric("Votos Totales Contabilizados", f"{total_votos:,}")
col2.metric("Votos Partido A", f"{votos_a:,}", delta=f"{votos_a/total_votos*100:.1f}%")
col3.metric("Votos Partido B", f"{votos_b:,}", delta=f"{votos_b/total_votos*100:.1f}%")

# --- Visualizaciones ---
col1, col2 = st.columns(2)
with col1:
    st.subheader("Distribución del Voto por Región")
    # Transformar datos para el gráfico (unpivot)
    df_melted = df_filtrado.melt(
        id_vars=["Region"],
        value_vars=["Votos_Partido_A", "Votos_Partido_B", "Votos_Otros"],
        var_name="Partido", value_name="Votos"
    )
    df_region_votos = df_melted.groupby(["Region", "Partido"])["Votos"].sum().reset_index()

    fig = px.bar(df_region_votos, x="Region", y="Votos", color="Partido", title="Votos por Partido en cada Región")
    fig.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
    st.plotly_chart(fig, use_container_width=True)

with col2:
    st.subheader("Preferencia de Voto por Grupo de Edad")
    df_edad_votos = df_filtrado.groupby("Grupo_Edad")[["Votos_Partido_A", "Votos_Partido_B"]].sum()
    st.bar_chart(df_edad_votos)

# --- Tabla de Resultados por Región (VERSIÓN CORREGIDA) ---
st.subheader("Tabla de Resultados y Ganador por Región")
df_resultados = df_filtrado.groupby("Region")[["Votos_Partido_A", "Votos_Partido_B", "Votos_Otros"]].sum()
df_resultados["Ganador"] = np.where(
    df_resultados["Votos_Partido_A"] > df_resultados["Votos_Partido_B"],
    "Partido A", "Partido B"
)

# Definimos las columnas numéricas que queremos formatear
columnas_numericas = ["Votos_Partido_A", "Votos_Partido_B", "Votos_Otros"]

# Función para colorear el fondo de la celda del ganador
def colorear_ganador(val):
    color = '#3d9dff' if val == "Partido A" else '#ff7575'
    # Devolvemos un color de texto oscuro para que contraste con el fondo claro
    return f'background-color: {color}; color: #0d1117; font-weight: bold;'

st.dataframe(
    df_resultados.style
        # Aplicamos el formato numérico SOLO a las columnas numéricas
        .format("{:,}", subset=columnas_numericas)
        # Aplicamos el estilo de color SOLO a la columna 'Ganador'
        .applymap(colorear_ganador, subset=['Ganador']),
    use_container_width=True
)