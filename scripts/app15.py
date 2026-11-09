# --- dashboard_entregas_rd.py ---
import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import random

st.set_page_config(page_title="📦 Dashboard de Entregas RD", layout="wide")

@st.cache_data
def generar_entregas(num_pedidos=500):
    repartidores = ["Juan R.", "Mariela T.", "Kelvin S.", "Yocasta M.", "Rafael D.", "Estefany G.", "Luis F.", "Carla V."]

    # Zonas y sectores de Santo Domingo
    zonas = {
        "Santo Domingo Norte - Villa Mella": (18.535, -69.890),
        "Santo Domingo Norte - Sabana Perdida": (18.520, -69.880),
        "Santo Domingo Este - Alma Rosa": (18.500, -69.850),
        "Santo Domingo Este - Los Mina": (18.490, -69.860),
        "Santo Domingo Oeste - Herrera": (18.470, -70.000),
        "Santo Domingo Oeste - Manoguayabo": (18.475, -70.020),
        "Distrito Nacional - Gazcue": (18.470, -69.900),
        "Distrito Nacional - Piantini": (18.470, -69.930),
        "Distrito Nacional - Cristo Rey": (18.490, -69.930),
        "Distrito Nacional - Naco": (18.480, -69.940)
    }

    clientes = [
        "Ferretería El Martillo", "Supermercado Bravo", "Farmacia Carol", "Colmado La Bendición",
        "Distribuidora Quisqueya", "Electrodomésticos RD", "Tienda La Sirena", "Papelería Nacional",
        "Carnicería Don Pedro", "Helados Bon", "Panadería Dulce Hogar", "Auto Repuestos Caribe",
        "Tecnología Tropical", "Librería Cuesta", "Delivery Express RD"
    ]

    tipo_vehiculo = ["Motor", "Camioneta", "Bicicleta", "Camión"]
    metodo_entrega = ["Puerta", "Pickup", "Locker"]
    clima = ["Soleado", "Lluvia", "Nublado", "Tormenta"]
    estatus = ["Entregado", "En Ruta", "Pendiente", "Fallido"]

    data = []
    for i in range(num_pedidos):
        est = random.choice(estatus)
        tiempo_real = None
        calificacion = None
        if est == "Entregado":
            tiempo_real = random.randint(15, 60)
            calificacion = random.randint(1, 5)

        zona = random.choice(list(zonas.keys()))
        lat_base, lon_base = zonas[zona]

        data.append({
            "ID_Pedido": 5000 + i,
            "Cliente": random.choice(clientes),
            "Repartidor": random.choice(repartidores),
            "Zona": zona,
            "Estatus": est,
            "Tiempo_Estimado_min": random.randint(20, 50),
            "Tiempo_Real_min": tiempo_real,
            "Calificacion_Cliente": calificacion,
            "Tipo_Vehiculo": random.choice(tipo_vehiculo),
            "Método_Entrega": random.choice(metodo_entrega),
            "Clima": random.choice(clima),
            "Lat": lat_base + random.uniform(-0.003, 0.003),
            "Lon": lon_base + random.uniform(-0.003, 0.003)
        })

    df = pd.DataFrame(data)
    df["Diferencia_Tiempo"] = df["Tiempo_Real_min"] - df["Tiempo_Estimado_min"]
    return df

df_entregas = generar_entregas()

st.title("📦 Dashboard de Operaciones y Seguimiento de Entregas - Santo Domingo 🇩🇴")

# --- Filtros ---
st.sidebar.header("🎛️ Filtros")
zona_sel = st.sidebar.multiselect("Zonas/Sectores", df_entregas["Zona"].unique(), df_entregas["Zona"].unique())
estatus_sel = st.sidebar.multiselect("Estatus", df_entregas["Estatus"].unique(), df_entregas["Estatus"].unique())
vehiculo_sel = st.sidebar.multiselect("Tipo de Vehículo", df_entregas["Tipo_Vehiculo"].unique(), df_entregas["Tipo_Vehiculo"].unique())
metodo_sel = st.sidebar.multiselect("Método de Entrega", df_entregas["Método_Entrega"].unique(), df_entregas["Método_Entrega"].unique())
clima_sel = st.sidebar.multiselect("Clima", df_entregas["Clima"].unique(), df_entregas["Clima"].unique())

df_filtrado = df_entregas.query(
    "Zona == @zona_sel & Estatus == @estatus_sel & Tipo_Vehiculo == @vehiculo_sel & `Método_Entrega` == @metodo_sel & Clima == @clima_sel"
)

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
    st.subheader("🗺️ Ubicación de Pedidos en Ruta")
    df_en_ruta = df_filtrado[df_filtrado["Estatus"] == "En Ruta"]
    st.map(df_en_ruta, latitude='Lat', longitude='Lon')

with col2:
    st.subheader("📊 Pedidos por Estatus")
    fig_pie = px.pie(df_filtrado, names="Estatus", hole=0.4, title="Distribución de Estatus")
    st.plotly_chart(fig_pie, use_container_width=True)

st.subheader("📈 Entregas por Repartidor")
fig_bar = px.bar(
    df_filtrado[df_filtrado["Estatus"] == "Entregado"].groupby("Repartidor").size().reset_index(name="Cantidad"),
    x="Repartidor", y="Cantidad", color="Repartidor", title="Cantidad de Entregas por Repartidor"
)
st.plotly_chart(fig_bar, use_container_width=True)

st.subheader("📉 Tiempo Estimado vs Real")
df_line = df_filtrado[df_filtrado["Estatus"] == "Entregado"].head(100)  # limitar para que sea legible
fig_line = px.line(
    df_line,
    x="ID_Pedido", y=["Tiempo_Estimado_min", "Tiempo_Real_min"],
    title="Comparación de Tiempo Estimado vs Real"
)
st.plotly_chart(fig_line, use_container_width=True)

# --- Tabla con estilos ---
st.subheader("📋 Desempeño de Repartidores")
df_completadas = df_filtrado[df_filtrado["Estatus"] == "Entregado"]
df_performance = df_completadas.groupby("Repartidor").agg(
    Entregas_Totales=('ID_Pedido', 'count'),
    Tiempo_Promedio=('Tiempo_Real_min', 'mean'),
    Calificacion_Promedio=('Calificacion_Cliente', 'mean')
).reset_index()

st.dataframe(
    df_performance.style
    .format({"Tiempo_Promedio": "{:.1f} min", "Calificacion_Promedio": "{:.2f} ⭐"})
    .background_gradient(subset=["Calificacion_Promedio"], cmap="RdYlGn")
    .background_gradient(subset=["Tiempo_Promedio"], cmap="YlOrRd"),
    use_container_width=True
)
