# --- dashboard_politico.py ---
import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import random

st.set_page_config(page_title="🗳️ Análisis Electoral", layout="wide")

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
st.sidebar.header("🎛️ Filtros")
region_sel = st.sidebar.multiselect("Región", df_votos["Region"].unique(), df_votos["Region"].unique())
zona_sel = st.sidebar.multiselect("Zona", df_votos["Zona"].unique(), df_votos["Zona"].unique())
edad_sel = st.sidebar.multiselect("Grupo de Edad", df_votos["Grupo_Edad"].unique(), df_votos["Grupo_Edad"].unique())
min_votos, max_votos = st.sidebar.slider("Rango de votos por mesa", int(df_votos["Total_Votos"].min()), int(df_votos["Total_Votos"].max()), (50, 400))

df_filtrado = df_votos.query(
    "Region == @region_sel & Zona == @zona_sel & Grupo_Edad == @edad_sel & Total_Votos >= @min_votos & Total_Votos <= @max_votos"
)

# --- KPIs ---
total_votos = df_filtrado["Total_Votos"].sum()
votos_a = df_filtrado["Votos_Partido_A"].sum()
votos_b = df_filtrado["Votos_Partido_B"].sum()
votos_otros = df_filtrado["Votos_Otros"].sum()

col1, col2, col3, col4 = st.columns(4)
col1.metric("🗳️ Votos Totales", f"{total_votos:,}")
col2.metric("Partido A", f"{votos_a:,}", delta=f"{(votos_a/total_votos*100 if total_votos>0 else 0):.1f}%")
col3.metric("Partido B", f"{votos_b:,}", delta=f"{(votos_b/total_votos*100 if total_votos>0 else 0):.1f}%")
col4.metric("Otros", f"{votos_otros:,}", delta=f"{(votos_otros/total_votos*100 if total_votos>0 else 0):.1f}%")

# --- Visualizaciones ---
col1, col2 = st.columns(2)
with col1:
    st.subheader("📊 Votos por Partido y Región")
    df_melted = df_filtrado.melt(
        id_vars=["Region"],
        value_vars=["Votos_Partido_A", "Votos_Partido_B", "Votos_Otros"],
        var_name="Partido", value_name="Votos"
    )
    df_region_votos = df_melted.groupby(["Region", "Partido"])["Votos"].sum().reset_index()
    fig_bar = px.bar(df_region_votos, x="Region", y="Votos", color="Partido", barmode="group")
    st.plotly_chart(fig_bar, use_container_width=True)

with col2:
    st.subheader("👥 Preferencia por Grupo de Edad")
    df_edad_votos = df_filtrado.groupby("Grupo_Edad")[["Votos_Partido_A", "Votos_Partido_B", "Votos_Otros"]].sum()
    fig_bar_age = px.bar(df_edad_votos, x=df_edad_votos.index, y=df_edad_votos.columns, barmode="group")
    st.plotly_chart(fig_bar_age, use_container_width=True)

col3, col4 = st.columns(2)
with col3:
    st.subheader("📌 Participación por Partido")
    df_total = pd.DataFrame({
        "Partido": ["Partido A", "Partido B", "Otros"],
        "Votos": [votos_a, votos_b, votos_otros]
    })
    fig_pie = px.pie(df_total, names="Partido", values="Votos", hole=0.4)
    st.plotly_chart(fig_pie, use_container_width=True)

with col4:
    st.subheader("📈 Tendencia de Votos Acumulados (mesas)")
    df_trend = df_filtrado.sort_values("ID_Mesa")[["ID_Mesa", "Votos_Partido_A", "Votos_Partido_B", "Votos_Otros"]].set_index("ID_Mesa")
    fig_line = px.line(df_trend.cumsum(), title="Evolución acumulada de votos")
    st.plotly_chart(fig_line, use_container_width=True)

# --- Tabla de Resultados ---
st.subheader("📋 Resultados y Ganador por Región")
df_resultados = df_filtrado.groupby("Region")[["Votos_Partido_A", "Votos_Partido_B", "Votos_Otros"]].sum()
df_resultados["Ganador"] = np.where(
    df_resultados["Votos_Partido_A"] > df_resultados["Votos_Partido_B"], "Partido A", "Partido B"
)

# Formato condicional
def colorear_ganador(val):
    color = '#3d9dff' if val == "Partido A" else '#ff7575'
    return f'background-color: {color}; color: #0d1117; font-weight: bold;'

st.dataframe(
    df_resultados.style
        .format("{:,}", subset=["Votos_Partido_A", "Votos_Partido_B", "Votos_Otros"])
        .applymap(colorear_ganador, subset=["Ganador"])
        .background_gradient(subset=["Votos_Partido_A", "Votos_Partido_B"], cmap="Blues"),
    use_container_width=True
)
