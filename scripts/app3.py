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
    # Listas base para generar datos aleatorios
    productos = {"Laptop Pro": (1200, 800), "Mouse RGB": (75, 40), "Teclado Mecánico": (150, 90), "Monitor 4K": (450, 250), "Webcam HD": (90, 50)}
    vendedores = ["Ana Gómez", "Carlos Díaz", "Laura Solís", "Pedro Marín"]
    regiones = ["Norte", "Sur", "Este", "Oeste"]
    estatus = ["Entregado", "Enviado", "Pendiente", "Cancelado"]
    
    data = []
    start_date = pd.to_datetime("2023-01-01")
    end_date = pd.to_datetime("2023-12-31")
    
    for _ in range(num_registros):
        producto, precios = random.choice(list(productos.items()))
        # Generar una fecha aleatoria dentro del rango de 2023
        random_date = start_date + pd.to_timedelta(np.random.randint(0, (end_date - start_date).days + 1), unit='d')
        data.append({
            "Fecha": random_date,
            "Producto": producto,
            "Vendedor": random.choice(vendedores),
            "Region": random.choice(regiones),
            "Precio_Venta": precios[0],
            "Precio_Compra": precios[1],
            "Cantidad": np.random.randint(1, 10),
            "Estatus_Entrega": random.choice(estatus)
        })
    df = pd.DataFrame(data)
    # Cálculo de métricas derivadas
    df["Ingresos"] = df["Precio_Venta"] * df["Cantidad"]
    df["Costos"] = df["Precio_Compra"] * df["Cantidad"]
    df["Margen"] = df["Ingresos"] - df["Costos"]
    df["% Margen"] = (df["Margen"] / df["Ingresos"] * 100).fillna(0).round(2)
    return df

df = generar_datos()

# --- Barra Lateral (Sidebar) ---
st.sidebar.header("Filtros del Dashboard")
# Filtro por región
region = st.sidebar.multiselect(
    "Selecciona la Región:",
    options=df["Region"].unique(),
    default=df["Region"].unique()
)
# Filtro por vendedor
vendedor = st.sidebar.multiselect(
    "Selecciona el Vendedor:",
    options=df["Vendedor"].unique(),
    default=df["Vendedor"].unique()
)
# Filtro por estatus de entrega
estatus = st.sidebar.multiselect(
    "Selecciona el Estatus de Entrega:",
    options=df["Estatus_Entrega"].unique(),
    default=df["Estatus_Entrega"].unique()
)

# Aplicamos los filtros al DataFrame
df_filtrado = df.query(
    "Region == @region & Vendedor == @vendedor & Estatus_Entrega == @estatus"
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
with col1:
    st.metric("Ingresos Totales", f"${total_ingresos:,.2f}")
with col2:
    st.metric("Margen Bruto Total", f"${total_margen:,.2f}")
with col3:
    st.metric("% Margen Promedio", f"{porcentaje_margen_promedio:.2f}%")
with col4:
    st.metric("Ticket Promedio", f"${ticket_promedio:,.2f}")

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
        df_filtrado, values="Ingresos", names="Producto", title="Distribución de Ingresos por Producto"
    )
    fig_producto.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
    st.plotly_chart(fig_producto, use_container_width=True)

# Tabla de datos
st.subheader("Detalle de Ventas Filtradas")
st.dataframe(df_filtrado)