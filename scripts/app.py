# dashboard_inventario.py
import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
from datetime import datetime, timedelta
import random

# --- Configuración de la Página ---
st.set_page_config(page_title="Dashboard de Inventario", layout="wide")

# --- Generador de Datos (Simulación) ---
@st.cache_data
def generar_datos_inventario(num_productos=258):
    categorias = ["Electrónica", "Ropa", "Hogar", "Juguetes", "Libros", "Deportes"]
    data = []

    for i in range(num_productos):
        costo_unitario = round(random.uniform(5, 500), 2)
        unidades_stock = random.randint(0, 200)
        # Las ventas son proporcionales al stock para hacerlo más realista
        unidades_vendidas_90d = random.randint(0, int(unidades_stock * random.uniform(0.5, 3.0))) if unidades_stock > 0 else 0
        
        data.append({
            "SKU": f"PROD-{1000 + i}",
            "Producto": f"Producto {chr(65 + i % 26)}{i}",
            "Categoria": random.choice(categorias),
            "Costo_Unitario": costo_unitario,
            "Unidades_Stock": unidades_stock,
            "Unidades_Vendidas_90d": unidades_vendidas_90d
        })
    
    df = pd.DataFrame(data)
    df["Valor_Inventario"] = df["Costo_Unitario"] * df["Unidades_Stock"]
    
    # Rotación y Días de Inventario (simplificado para 90 días)
    # Usamos np.divide para manejar la división por cero de forma segura
    df["Rotacion_90d"] = np.divide(df["Unidades_Vendidas_90d"], df["Unidades_Stock"], out=np.zeros_like(df["Unidades_Vendidas_90d"], dtype=float), where=df["Unidades_Stock"]!=0)
    df["Dias_Inventario"] = np.divide(90, df["Rotacion_90d"], out=np.zeros_like(df["Rotacion_90d"], dtype=float), where=df["Rotacion_90d"]!=0)
    
    # Estado de Stock
    def estado_stock(row):
        if row["Unidades_Stock"] == 0: return "Sin Stock"
        # Si no se ha vendido nada en 90 días, es de lento movimiento
        if row["Unidades_Vendidas_90d"] == 0: return "Lento Movimiento"
        if row["Dias_Inventario"] > 120: return "Sobre-stock"
        if row["Dias_Inventario"] < 30: return "Bajo Stock"
        return "Óptimo"
        
    df["Estado_Stock"] = df.apply(estado_stock, axis=1)
    return df

df_inventario = generar_datos_inventario()

# --- Cuerpo Principal ---
st.title("📦 Dashboard de Administración y Gestión de Inventario")

# Filtros en la barra lateral
st.sidebar.header("Filtros")
categorias_seleccionadas = st.sidebar.multiselect(
    "Filtrar por Categoría:",
    options=df_inventario["Categoria"].unique(),
    default=df_inventario["Categoria"].unique()
)
estado_seleccionado = st.sidebar.multiselect(
    "Filtrar por Estado de Stock:",
    options=df_inventario["Estado_Stock"].unique(),
    default=df_inventario["Estado_Stock"].unique()
)

df_filtrado = df_inventario.query("Categoria == @categorias_seleccionadas & Estado_Stock == @estado_seleccionado")

# KPIs
valor_total_inventario = df_filtrado["Valor_Inventario"].sum()
skus_activos = df_filtrado[df_filtrado["Unidades_Stock"] > 0]["SKU"].nunique()
skus_sin_stock = df_filtrado[df_filtrado["Unidades_Stock"] == 0]["SKU"].nunique()
skus_lento_mov = df_filtrado[df_filtrado["Estado_Stock"] == "Lento Movimiento"]["SKU"].nunique()

col1, col2, col3, col4 = st.columns(4)
col1.metric("Valor Total del Inventario", f"${valor_total_inventario:,.2f}")
col2.metric("SKUs Activos", f"{skus_activos}")
col3.metric("SKUs Sin Stock", f"{skus_sin_stock}")
col4.metric("SKUs Lento Movimiento", f"{skus_lento_mov}")

# Gráficos
col1, col2 = st.columns([0.6, 0.4]) # Damos más espacio a la primera columna
with col1:
    st.subheader("Top 10 Productos por Valor de Inventario")
    top_10_valor = df_filtrado.nlargest(10, "Valor_Inventario")
    fig_valor = px.bar(
        top_10_valor, x="Producto", y="Valor_Inventario",
        title="Top 10 Productos por Valor en Stock", text_auto='.2s',
        color="Categoria"
    )
    fig_valor.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
    st.plotly_chart(fig_valor, use_container_width=True)

with col2:
    st.subheader("Análisis de Estado de Stock")
    estado_counts = df_filtrado["Estado_Stock"].value_counts()
    fig_estado = px.pie(
        values=estado_counts.values, names=estado_counts.index,
        title="Distribución del Inventario por Estado", hole=0.4,
        color=estado_counts.index,
        color_discrete_map={
            "Óptimo": "#23d18b",
            "Bajo Stock": "#ffca2c",
            "Sobre-stock": "orange",
            "Lento Movimiento": "#ff7575",
            "Sin Stock": "#dc3545"
        }
    )
    fig_estado.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
    st.plotly_chart(fig_estado, use_container_width=True)


# Tabla con Formato Condicional
st.subheader("Detalle del Inventario")

def estilo_tabla_inventario(df_styled):
    def color_estado(val):
        color_map = {
            "Sin Stock": "#dc3545", "Sobre-stock": "orange", "Lento Movimiento": "#ff7575",
            "Bajo Stock": "#ffca2c", "Óptimo": "#23d18b"
        }
        return f'background-color: {color_map.get(val, "transparent")}; color: #0d1117;'

    return df_styled.format({
        "Costo_Unitario": "${:,.2f}",
        "Valor_Inventario": "${:,.2f}",
        "Rotacion_90d": "{:.2f}",
        "Dias_Inventario": "{:,.0f}"
    }).map(color_estado, subset=['Estado_Stock'])

st.dataframe(estilo_tabla_inventario(df_filtrado.style), use_container_width=True)