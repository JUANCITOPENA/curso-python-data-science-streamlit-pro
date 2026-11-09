# dashboard_politico.py
import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import random

st.set_page_config(page_title="Análisis Electoral RD", layout="wide")

# --- Generador de datos ficticios ---
@st.cache_data
def generar_votos(num_mesas=500):
    # Regiones administrativas de la RD
    regiones = [
        "Cibao Norte", "Cibao Sur", "Cibao Nordeste", "Cibao Noroeste",
        "Valdesia", "Enriquillo", "El Valle", "Ozama", "Yuma"
    ]
    provincias = [
        "Distrito Nacional", "Santo Domingo", "Santiago", "La Vega", "San Cristóbal",
        "San Pedro de Macorís", "La Romana", "Puerto Plata", "San Juan",
        "La Altagracia", "Barahona", "Duarte"
    ]
    zonas = ["Urbana", "Rural"]
    grupos_edad = ["18-30", "31-50", "51+"]
    partidos = {
        "PLD": "Partido de la Liberación Dominicana",
        "PRM": "Partido Revolucionario Moderno",
        "FP": "Fuerza del Pueblo",
        "Otros": "Otros Partidos"
    }

    data = []
    for i in range(num_mesas):
        votos_pld = random.randint(30, 200)
        votos_prm = random.randint(30, 200)
        votos_fp = random.randint(20, 150)
        votos_otros = random.randint(5, 80)

        data.append({
            "ID_Mesa": 3000 + i,
            "Región": random.choice(regiones),
            "Provincia": random.choice(provincias),
            "Zona": random.choice(zonas),
            "Grupo_Edad": random.choice(grupos_edad),
            "Votos_PLD": votos_pld,
            "Votos_PRM": votos_prm,
            "Votos_FP": votos_fp,
            "Votos_Otros": votos_otros
        })
    
    df = pd.DataFrame(data)
    df["Total_Votos"] = df[["Votos_PLD","Votos_PRM","Votos_FP","Votos_Otros"]].sum(axis=1)
    return df

df_votos = generar_votos()

st.title("🗳️ Dashboard Político - República Dominicana")

# --- Filtros ---
st.sidebar.header("Filtros")
region_sel = st.sidebar.multiselect("Región", df_votos["Región"].unique(), df_votos["Región"].unique())
provincia_sel = st.sidebar.multiselect("Provincia", df_votos["Provincia"].unique(), df_votos["Provincia"].unique())
zona_sel = st.sidebar.multiselect("Zona", df_votos["Zona"].unique(), df_votos["Zona"].unique())
df_filtrado = df_votos.query("Región == @region_sel & Provincia == @provincia_sel & Zona == @zona_sel")

# --- KPIs ---
total_votos = df_filtrado["Total_Votos"].sum()
votos_pld = df_filtrado["Votos_PLD"].sum()
votos_prm = df_filtrado["Votos_PRM"].sum()
votos_fp = df_filtrado["Votos_FP"].sum()

col1, col2, col3, col4 = st.columns(4)
col1.metric("Votos Totales", f"{total_votos:,}")
col2.metric("Votos PRM", f"{votos_prm:,}", delta=f"{votos_prm/total_votos*100:.1f}%")
col3.metric("Votos PLD", f"{votos_pld:,}", delta=f"{votos_pld/total_votos*100:.1f}%")
col4.metric("Votos FP", f"{votos_fp:,}", delta=f"{votos_fp/total_votos*100:.1f}%")

# --- Visualizaciones ---
col1, col2 = st.columns(2)
with col1:
    st.subheader("Distribución del Voto por Región")
    df_melted = df_filtrado.melt(
        id_vars=["Región"],
        value_vars=["Votos_PLD", "Votos_PRM", "Votos_FP", "Votos_Otros"],
        var_name="Partido", value_name="Votos"
    )
    df_region_votos = df_melted.groupby(["Región", "Partido"])["Votos"].sum().reset_index()

    fig = px.bar(df_region_votos, x="Región", y="Votos", color="Partido", title="Votos por Partido en cada Región")
    fig.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
    st.plotly_chart(fig, use_container_width=True)

with col2:
    st.subheader("Preferencia de Voto por Grupo de Edad")
    df_edad_votos = df_filtrado.groupby("Grupo_Edad")[["Votos_PLD", "Votos_PRM", "Votos_FP"]].sum()
    st.bar_chart(df_edad_votos)

# --- Tabla de Resultados por Provincia ---
st.subheader("Resultados por Provincia")
df_resultados = df_filtrado.groupby("Provincia")[["Votos_PLD", "Votos_PRM", "Votos_FP", "Votos_Otros"]].sum()
df_resultados["Ganador"] = df_resultados.idxmax(axis=1)

def colorear_ganador(val):
    color_map = {"Votos_PRM": "#3d9dff", "Votos_PLD": "#8e44ad", "Votos_FP": "#27ae60", "Votos_Otros": "#f39c12"}
    return f'background-color: {color_map.get(val, "gray")}; color: white; font-weight: bold;'

st.dataframe(
    df_resultados.style
        .format("{:,}", subset=["Votos_PLD","Votos_PRM","Votos_FP","Votos_Otros"])
        .applymap(colorear_ganador, subset=["Ganador"]),
    use_container_width=True
)
