# dashboard_cobranza.py
import streamlit as st
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import plotly.express as px

# --- Configuración de la Página ---
st.set_page_config(page_title="Dashboard de Cobranza", layout="wide")

# --- Generador de Datos (Simulación) ---
@st.cache_data
def generar_facturas(num_registros=258):
    clientes = ["Tech Corp", "Innovate Inc", "Solutions LLC", "Data Systems", "Quantum Co"]
    vendedores = ["Elena Rojas", "Marcos Torres"]
    data = []
    hoy = datetime.now()

    for i in range(num_registros):
        fecha_emision = hoy - timedelta(days=random.randint(1, 150))
        dias_credito = random.choice([15, 30, 45, 60, 90])
        fecha_vencimiento = fecha_emision + timedelta(days=dias_credito)
        # Probabilidad de que una factura esté pagada
        estatus = "Pagada" if random.random() > 0.6 else "Pendiente"
        
        # Si ya venció y sigue pendiente, es más probable que esté pagada
        if fecha_vencimiento < hoy and estatus == "Pagada" and random.random() > 0.2:
             estatus = "Pagada"
             
        data.append({
            "ID_Factura": 1000 + i,
            "Cliente": random.choice(clientes),
            "Vendedor": random.choice(vendedores),
            "Fecha_Emision": fecha_emision.date(),
            "Fecha_Vencimiento": fecha_vencimiento.date(),
            "Monto": round(random.uniform(500, 10000), 2),
            "Estatus_Cobro": estatus
        })
    
    df = pd.DataFrame(data)
    df_pendientes = df[df["Estatus_Cobro"] == "Pendiente"].copy()
    
    # Cálculos clave sobre fechas
    df_pendientes["Dias_Vencimiento"] = (pd.to_datetime(hoy) - pd.to_datetime(df_pendientes["Fecha_Vencimiento"])).dt.days
    
    # Categorización por antigüedad
    def categorizar_antiguedad(dias):
        if dias <= 0: return "Vigente"
        if 1 <= dias <= 30: return "1-30 días"
        if 31 <= dias <= 60: return "31-60 días"
        if 61 <= dias <= 90: return "61-90 días"
        return "+90 días"
        
    df_pendientes["Antigüedad"] = df_pendientes["Dias_Vencimiento"].apply(categorizar_antiguedad)
    return df_pendientes

df_cobranza = generar_facturas()

# --- Cuerpo Principal ---
st.title("💰 Dashboard de Cuentas por Cobrar")
st.markdown("Análisis de la salud financiera y la antigüedad de saldos pendientes.")
st.markdown("---")


# Filtros en la barra lateral
st.sidebar.header("Filtros")
clientes_seleccionados = st.sidebar.multiselect(
    "Filtrar por Cliente:",
    options=df_cobranza["Cliente"].unique(),
    default=df_cobranza["Cliente"].unique()
)
vendedores_seleccionados = st.sidebar.multiselect(
    "Filtrar por Vendedor:",
    options=df_cobranza["Vendedor"].unique(),
    default=df_cobranza["Vendedor"].unique()
)
df_filtrado = df_cobranza.query("Cliente == @clientes_seleccionados & Vendedor == @vendedores_seleccionados")


# KPIs
monto_total_pendiente = df_filtrado["Monto"].sum()
monto_vencido = df_filtrado[df_filtrado["Dias_Vencimiento"] > 0]["Monto"].sum()
monto_vigente = monto_total_pendiente - monto_vencido
num_facturas_vencidas = len(df_filtrado[df_filtrado["Dias_Vencimiento"] > 0])


col1, col2, col3, col4 = st.columns(4)
col1.metric("Monto Total Pendiente", f"${monto_total_pendiente:,.2f}")
col2.metric("Monto Vencido", f"${monto_vencido:,.2f}", delta=f"{monto_vencido/monto_total_pendiente*100 if monto_total_pendiente > 0 else 0:.1f}% del total", delta_color="inverse")
col3.metric("Monto Vigente", f"${monto_vigente:,.2f}")
col4.metric("Facturas Vencidas", f"{num_facturas_vencidas}")

st.markdown("---")

# Gráfico de Antigüedad de Saldos
st.subheader("Análisis de Antigüedad de Saldos Vencidos")
df_antiguedad = df_filtrado[df_filtrado["Dias_Vencimiento"] > 0].groupby("Antigüedad")["Monto"].sum().reindex(["1-30 días", "31-60 días", "61-90 días", "+90 días"])

fig_antiguedad = px.bar(
    df_antiguedad,
    x=df_antiguedad.index,
    y="Monto",
    title="Monto Vencido por Rango de Antigüedad",
    text_auto='.2s',
    color=df_antiguedad.index,
    color_discrete_map={
        "1-30 días": "#ffca2c",
        "31-60 días": "orange",
        "61-90 días": "#ff7575",
        "+90 días": "#dc3545"
    }
)
fig_antiguedad.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
st.plotly_chart(fig_antiguedad, use_container_width=True)


# Tabla con Formato Condicional
st.subheader("Detalle de Facturas Pendientes")

def formato_condicional_dias(dias):
    if dias <= 0: return 'color: #23d18b' # Vigente (Verde)
    if 1 <= dias <= 30: return 'color: #ffca2c' # Poco vencido (Amarillo)
    if 31 <= dias <= 90: return 'color: orange' # Vencido (Naranja)
    return 'color: #ff7575' # Muy vencido (Rojo)

# Aplicar estilos
st.dataframe(
    df_filtrado.style.applymap(formato_condicional_dias, subset=['Dias_Vencimiento'])
                     .format({"Monto": "${:,.2f}"}),
    use_container_width=True
)
    