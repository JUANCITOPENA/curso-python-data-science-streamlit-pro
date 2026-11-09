# dashboard_ventas.py
import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import random

# --- Configuración de la Página ---
st.set_page_config(page_title="Dashboard de Ventas", layout="wide", initial_sidebar_state="expanded")

# --- Generador de Datos (Simulación) ---
@st.cache_data
def generar_datos(num_registros=258):
    clientes = ["Tech Corp", "Innovate Inc", "Solutions LLC", "Data Systems", "Quantum Co", "Global Net", "Future Tech"]
    productos = {"Laptop Pro": (1200, 800), "Mouse RGB": (75, 40), "Teclado Mecánico": (150, 90), "Monitor 4K": (450, 250), "Webcam HD": (90, 50)}
    vendedores = ["Ana Gómez", "Carlos Díaz", "Laura Solís", "Pedro Marín"]
    regiones = ["Norte", "Sur", "Este", "Oeste"]
    estatus = ["Entregado", "Enviado", "Pendiente", "Cancelado"]
    
    data = []
    start_date = pd.to_datetime("2023-01-01")
    end_date = pd.to_datetime("2023-12-31")
    
    for _ in range(num_registros):
        producto, precios = random.choice(list(productos.items()))
        random_date = start_date + pd.to_timedelta(np.random.randint(0, (end_date - start_date).days + 1), unit='d')
        data.append({
            "Fecha": random_date,
            "Cliente": random.choice(clientes),
            "Producto": producto,
            "Vendedor": random.choice(vendedores),
            "Region": random.choice(regiones),
            "Precio_Venta": precios[0],
            "Precio_Compra": precios[1],
            "Cantidad": np.random.randint(1, 10),
            "Estatus_Entrega": random.choice(estatus)
        })
    df = pd.DataFrame(data)
    df["Ingresos"] = df["Precio_Venta"] * df["Cantidad"]
    df["Costos"] = df["Precio_Compra"] * df["Cantidad"]
    df["Margen"] = df["Ingresos"] - df["Costos"]
    df["% Margen"] = (df["Margen"] / df["Ingresos"] * 100).fillna(0).round(2)
    return df

df = generar_datos()

# --- Barra Lateral (Sidebar) ---
st.sidebar.header("Filtros del Dashboard")
cliente = st.sidebar.multiselect("Cliente:", options=df["Cliente"].unique(), default=df["Cliente"].unique())
region = st.sidebar.multiselect("Región:", options=df["Region"].unique(), default=df["Region"].unique())
vendedor = st.sidebar.multiselect("Vendedor:", options=df["Vendedor"].unique(), default=df["Vendedor"].unique())
estatus = st.sidebar.multiselect("Estatus de Entrega:", options=df["Estatus_Entrega"].unique(), default=df["Estatus_Entrega"].unique())

df_filtrado = df.query(
    "Cliente == @cliente & Region == @region & Vendedor == @vendedor & Estatus_Entrega == @estatus"
)

# --- Cuerpo Principal ---
st.title("📈 Dashboard de Inteligencia de Negocios")
st.markdown("---")

# KPIs principales
total_ingresos = df_filtrado["Ingresos"].sum()
total_margen = df_filtrado["Margen"].sum()
porcentaje_margen_promedio = df_filtrado["% Margen"].mean()
ticket_promedio = df_filtrado["Ingresos"].mean()

col1, col2, col3, col4 = st.columns(4)
col1.metric("Ingresos Totales", f"${total_ingresos:,.2f}")
col2.metric("Margen Bruto Total", f"${total_margen:,.2f}")
col3.metric("% Margen Promedio", f"{porcentaje_margen_promedio:.2f}%")
col4.metric("Ticket Promedio", f"${ticket_promedio:,.2f}")

st.markdown("---")

# Gráficos
col1, col2 = st.columns(2)

with col1:
    st.subheader("Ingresos por Vendedor")
    fig_vendedor = px.bar(
        df_filtrado.groupby("Vendedor")["Ingresos"].sum().sort_values(ascending=False),
        x="Ingresos", y=df_filtrado.groupby("Vendedor")["Ingresos"].sum().sort_values(ascending=False).index,
        orientation='h', title="Top Vendedores por Ingresos", text_auto='.2s'
    )
    fig_vendedor.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
    st.plotly_chart(fig_vendedor, use_container_width=True)

with col2:
    st.subheader("Ingresos por Producto")
    fig_producto = px.pie(
        df_filtrado, values="Ingresos", names="Producto", title="Distribución de Ingresos por Producto", hole=0.4
    )
    fig_producto.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
    st.plotly_chart(fig_producto, use_container_width=True)

# Tabla de datos
st.subheader("Detalle de Ventas Filtradas")
st.dataframe(df_filtrado)