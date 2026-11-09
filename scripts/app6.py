# dashboard_entregas.py
import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import random

st.set_page_config(page_title="Dashboard de Entregas", layout="wide")

@st.cache_data
def generar_entregas(num_pedidos=300):
    repartidores = ["Javier L.", "Sofía M.", "Raúl C.", "Isabel P."]
    zonas = {"Norte": (40.43, -3.70), "Sur": (40.38, -3.71), "Centro": (40.41, -3.70), "Oeste": (40.42, -3.72)}
    estatus = ["Entregado", "En Ruta", "Pendiente", "Fallido"]
    data = []

    for i in range(num_pedidos):
        est = random.choice(estatus)
        tiempo_real = None
        calificacion = None
        if est == "Entregado":
            tiempo_real = random.randint(15, 60)
            calificacion = random.randint(1, 5)

        data.append({
            "ID_Pedido": 2000 + i, "Repartidor": random.choice(repartidores),
            "Zona": random.choice(list(zonas.keys())), "Estatus": est,
            "Tiempo_Estimado_min": random.randint(20, 50),
            "Tiempo_Real_min": tiempo_real,
            "Calificacion_Cliente": calificacion
        })
    df = pd.DataFrame(data)
    df["Diferencia_Tiempo"] = df["Tiempo_Real_min"] - df["Tiempo_Estimado_min"]
    df["Lat"] = df["Zona"].map(lambda z: zonas[z][0] + random.uniform(-0.01, 0.01))
    df["Lon"] = df["Zona"].map(lambda z: zonas[z][1] + random.uniform(-0.01, 0.01))
    return df

df_entregas = generar_entregas()

st.title("🚚 Dashboard de Operaciones y Seguimiento de Entregas")

# --- Filtros ---
st.sidebar.header("Filtros")
zona_sel = st.sidebar.multiselect("Zonas", df_entregas["Zona"].unique(), df_entregas["Zona"].unique())
estatus_sel = st.sidebar.multiselect("Estatus", df_entregas["Estatus"].unique(), df_entregas["Estatus"].unique())
df_filtrado = df_entregas.query("Zona == @zona_sel & Estatus == @estatus_sel")

# --- KPIs ---
pedidos_totales = len(df_filtrado)
a_tiempo = df_filtrado[df_filtrado["Diferencia_Tiempo"] <= 0]["ID_Pedido"].nunique()
tasa_a_tiempo = (a_tiempo / pedidos_totales) * 100 if pedidos_totales > 0 else 0
calif_promedio = df_filtrado["Calificacion_Cliente"].mean()

col1, col2, col3 = st.columns(3)
col1.metric("Pedidos en Filtro", f"{pedidos_totales}")
col2.metric("Tasa de Entregas a Tiempo", f"{tasa_a_tiempo:.1f}%")
col3.metric("Calificación Promedio", f"{calif_promedio:.2f} ⭐")

# --- Visualizaciones ---
col1, col2 = st.columns([0.6, 0.4])
with col1:
    st.subheader("Ubicación de Pedidos en Ruta")
    df_en_ruta = df_filtrado[df_filtrado["Estatus"] == "En Ruta"]
    st.map(df_en_ruta, latitude='Lat', longitude='Lon')

with col2:
    st.subheader("Pedidos por Estatus")
    fig = px.pie(df_filtrado, names="Estatus", hole=0.4, title="Distribución de Estatus")
    fig.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
    st.plotly_chart(fig, use_container_width=True)

st.subheader("Desempeño de Repartidores (Entregas Completadas)")
df_completadas = df_filtrado[df_filtrado["Estatus"] == "Entregado"]
df_performance = df_completadas.groupby("Repartidor").agg(
    Entregas_Totales=('ID_Pedido', 'count'),
    Tiempo_Promedio=('Tiempo_Real_min', 'mean'),
    Calificacion_Promedio=('Calificacion_Cliente', 'mean')
).reset_index()

st.dataframe(
    df_performance.style.format({"Tiempo_Promedio": "{:.1f} min", "Calificacion_Promedio": "{:.2f} ⭐"}),
    use_container_width=True
)
        