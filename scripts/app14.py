# dashboard_bancario.py
import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import random
from datetime import datetime, timedelta

st.set_page_config(page_title="Análisis Bancario", layout="wide")

@st.cache_data
def generar_transacciones(num_clientes=10, num_transacciones=500):
    clientes = [f"C{100+i}" for i in range(num_clientes)]
    tipos_gasto = ["Compra", "Servicio", "Retiro"]
    tipos_ingreso = ["Nómina", "Transferencia"]
    data = []
    hoy = datetime.now()

    for _ in range(num_transacciones):
        es_ingreso = random.random() < 0.2 # 20% prob de ser ingreso
        if es_ingreso:
            tipo = random.choice(tipos_ingreso)
            monto = round(random.uniform(500, 3000), 2)
        else:
            tipo = random.choice(tipos_gasto)
            monto = -round(random.uniform(10, 500), 2)
        
        data.append({
            "ID_Cliente": random.choice(clientes),
            "Fecha": hoy - timedelta(days=random.randint(0, 365)),
            "Monto": monto,
            "Tipo": tipo
        })
    df = pd.DataFrame(data).sort_values("Fecha")
    df["Clasificacion"] = np.where(df["Monto"] > 0, "Ingreso", "Gasto")
    return df

df_transacciones = generar_transacciones()

st.title("🏦 Dashboard de Análisis de Transacciones Bancarias")

# --- Filtros ---
st.sidebar.header("Filtros")
cliente_seleccionado = st.sidebar.selectbox(
    "Selecciona un Cliente:",
    options=["Todos"] + sorted(df_transacciones["ID_Cliente"].unique())
)

if cliente_seleccionado == "Todos":
    df_filtrado = df_transacciones
else:
    df_filtrado = df_transacciones[df_transacciones["ID_Cliente"] == cliente_seleccionado]

# --- KPIs ---
total_ingresos = df_filtrado[df_filtrado["Clasificacion"] == "Ingreso"]["Monto"].sum()
total_gastos = df_filtrado[df_filtrado["Clasificacion"] == "Gasto"]["Monto"].sum()
balance_neto = total_ingresos + total_gastos

col1, col2, col3 = st.columns(3)
col1.metric("Total Ingresos", f"${total_ingresos:,.2f}")
col2.metric("Total Gastos", f"${-total_gastos:,.2f}")
col3.metric("Balance Neto", f"${balance_neto:,.2f}", delta=f"{balance_neto:,.2f}")

# --- Gráficos ---
col1, col2 = st.columns(2)
with col1:
    st.subheader("Distribución de Gastos por Tipo")
    df_gastos = df_filtrado[df_filtrado["Clasificacion"] == "Gasto"]
    fig_gastos = px.pie(df_gastos, values=abs(df_gastos["Monto"]), names="Tipo", hole=0.4)
    fig_gastos.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
    st.plotly_chart(fig_gastos, use_container_width=True)

with col2:
    st.subheader("Evolución del Balance a lo Largo del Tiempo")
    df_filtrado["Balance_Acumulado"] = df_filtrado["Monto"].cumsum()
    fig_balance = px.line(df_filtrado, x="Fecha", y="Balance_Acumulado")
    fig_balance.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
    st.plotly_chart(fig_balance, use_container_width=True)

st.subheader("Historial de Transacciones")
st.dataframe(df_filtrado)
        