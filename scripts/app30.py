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
    vendedores = ["Elena Rojas", "Marcos Torres", "Carlos Méndez", "Patricia Cruz"]
    data = []
    hoy = datetime.now()

    for i in range(num_registros):
        fecha_emision = hoy - timedelta(days=random.randint(1, 150))
        dias_credito = random.choice([15, 30, 45, 60, 90])
        fecha_vencimiento = fecha_emision + timedelta(days=dias_credito)
        estatus = "Pagada" if random.random() > 0.6 else "Pendiente"
        
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
    
    # Días transcurridos desde vencimiento (positivo = vencido, negativo/cero = vigente)
    df_pendientes["Dias_Vencimiento"] = (pd.to_datetime(hoy) - pd.to_datetime(df_pendientes["Fecha_Vencimiento"])).dt.days
    
    def categorizar_antiguedad(dias):
        if dias <= 0: return "Vigente"
        if 1 <= dias <= 30: return "1-30 días"
        if 31 <= dias <= 60: return "31-60 días"
        if 61 <= dias <= 90: return "61-90 días"
        return "+90 días"
        
    df_pendientes["Antigüedad"] = df_pendientes["Dias_Vencimiento"].apply(categorizar_antiguedad)
    return df_pendientes

df_cobranza = generar_facturas()

# --- Encabezado ---
st.title("💰 Dashboard de Cuentas por Cobrar")
st.caption("Monitoreo de saldos pendientes, exposición crediticia y antigüedad de cartera.")
st.markdown("---")

# --- Filtros Laterales ---
st.sidebar.header("🔍 Filtros de Cartera")

filtro_antiguedad = st.sidebar.multiselect(
    "Rango de Antigüedad:",
    options=["Vigente", "1-30 días", "31-60 días", "61-90 días", "+90 días"],
    default=["Vigente", "1-30 días", "31-60 días", "61-90 días", "+90 días"]
)

clientes_seleccionados = st.sidebar.multiselect(
    "Filtrar por Cliente:",
    options=sorted(df_cobranza["Cliente"].unique()),
    default=sorted(df_cobranza["Cliente"].unique())
)

vendedores_seleccionados = st.sidebar.multiselect(
    "Filtrar por Vendedor:",
    options=sorted(df_cobranza["Vendedor"].unique()),
    default=sorted(df_cobranza["Vendedor"].unique())
)

df_filtrado = df_cobranza.query(
    "Cliente == @clientes_seleccionados & Vendedor == @vendedores_seleccionados & Antigüedad == @filtro_antiguedad"
)

# --- KPIs ---
monto_total_pendiente = df_filtrado["Monto"].sum() if not df_filtrado.empty else 0.0
df_vencidas = df_filtrado[df_filtrado["Dias_Vencimiento"] > 0]
monto_vencido = df_vencidas["Monto"].sum() if not df_vencidas.empty else 0.0
monto_vigente = monto_total_pendiente - monto_vencido
num_facturas_vencidas = len(df_vencidas)
ratio_vencido = (monto_vencido / monto_total_pendiente * 100) if monto_total_pendiente > 0 else 0.0

col1, col2, col3, col4 = st.columns(4)
col1.metric("Monto Total Pendiente", f"${monto_total_pendiente:,.2f}")
col2.metric("Monto Vencido", f"${monto_vencido:,.2f}", delta=f"{ratio_vencido:.1f}% en mora", delta_color="inverse")
col3.metric("Monto Vigente", f"${monto_vigente:,.2f}")
col4.metric("Facturas en Mora", f"{num_facturas_vencidas}")

st.markdown("---")

# --- Visualizaciones (4 Gráficos) ---
col_g1, col_g2 = st.columns(2)

# Gráfico 1: Antigüedad de Saldos Vencidos (Barras)
with col_g1:
    st.subheader("1. Antigüedad de Saldos Vencidos")
    orden_rangos = ["1-30 días", "31-60 días", "61-90 días", "+90 días"]
    df_ant = (
        df_vencidas.groupby("Antigüedad")["Monto"]
        .sum()
        .reindex(orden_rangos)
        .fillna(0)
        .reset_index()
    )
    
    fig1 = px.bar(
        df_ant,
        x="Antigüedad",
        y="Monto",
        title="Monto Vencido por Escala Temporal",
        text_auto=".2s",
        color="Antigüedad",
        color_discrete_map={
            "1-30 días": "#ffca2c",
            "31-60 días": "#fd7e14",
            "61-90 días": "#ff5722",
            "+90 días": "#dc3545"
        }
    )
    fig1.update_layout(
        plot_bgcolor="rgba(0,0,0,0)",
        paper_bgcolor="rgba(0,0,0,0)",
        showlegend=False,
        yaxis_title="Monto ($)",
        xaxis_title=""
    )
    st.plotly_chart(fig1, use_container_width=True)

# Gráfico 2: Exposición por Cliente (Donut)
with col_g2:
    st.subheader("2. Concentración por Cliente")
    df_cliente = df_filtrado.groupby("Cliente")["Monto"].sum().reset_index()
    
    fig2 = px.pie(
        df_cliente,
        names="Cliente",
        values="Monto",
        hole=0.45,
        title="Participación de Deuda por Cuenta",
        color_discrete_sequence=px.colors.qualitative.Pastel
    )
    fig2.update_traces(textposition="inside", textinfo="percent+label")
    fig2.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
    st.plotly_chart(fig2, use_container_width=True)

col_g3, col_g4 = st.columns(2)

# Gráfico 3: Cartera Vencida por Ejecutivo/Vendedor (Barras Horizontales)
with col_g3:
    st.subheader("3. Monto en Mora por Vendedor")
    df_vendedor = (
        df_vencidas.groupby("Vendedor")["Monto"]
        .sum()
        .reset_index()
        .sort_values(by="Monto", ascending=True)
    )
    
    fig3 = px.bar(
        df_vendedor,
        x="Monto",
        y="Vendedor",
        orientation="h",
        title="Exposición Vencida Asignada a Vendedor",
        text_auto=".2s",
        color_discrete_sequence=["#0dcaf0"]
    )
    fig3.update_layout(
        plot_bgcolor="rgba(0,0,0,0)",
        paper_bgcolor="rgba(0,0,0,0)",
        xaxis_title="Monto Vencido ($)",
        yaxis_title=""
    )
    st.plotly_chart(fig3, use_container_width=True)

# Gráfico 4: Matriz de Riesgo Factura a Factura (Dispersión)
with col_g4:
    st.subheader("4. Matriz Días Mora vs. Importe")
    fig4 = px.scatter(
        df_filtrado,
        x="Dias_Vencimiento",
        y="Monto",
        color="Antigüedad",
        size="Monto",
        hover_data=["ID_Factura", "Cliente", "Fecha_Vencimiento"],
        title="Dispersión de Facturas (Impacto vs. Retraso)",
        color_discrete_map={
            "Vigente": "#23d18b",
            "1-30 días": "#ffca2c",
            "31-60 días": "#fd7e14",
            "61-90 días": "#ff5722",
            "+90 días": "#dc3545"
        }
    )
    fig4.add_vline(x=0, line_dash="dash", line_color="gray", annotation_text="Límite Vencimiento")
    fig4.update_layout(
        plot_bgcolor="rgba(0,0,0,0)",
        paper_bgcolor="rgba(0,0,0,0)",
        xaxis_title="Días de Retraso (>0 Vencidas)",
        yaxis_title="Monto de Factura ($)"
    )
    st.plotly_chart(fig4, use_container_width=True)

st.markdown("---")

# --- Tabla Detallada con Formato Condicional ---
st.subheader("📋 Detalle Operativo de Facturas Pendientes")

def formato_condicional_dias(dias):
    if dias <= 0:
        return "color: #23d18b; font-weight: bold;"  # Vigente (Verde)
    elif 1 <= dias <= 30:
        return "color: #ffca2c; font-weight: bold;"  # 1-30 días (Amarillo)
    elif 31 <= dias <= 60:
        return "color: #fd7e14; font-weight: bold;"  # 31-60 días (Naranja claro)
    elif 61 <= dias <= 90:
        return "color: #ff5722; font-weight: bold;"  # 61-90 días (Naranja oscuro)
    return "color: #dc3545; font-weight: bold; background-color: rgba(220, 53, 69, 0.15);"  # +90 días (Rojo resaltado)

columnas_mostrar = [
    "ID_Factura", "Cliente", "Vendedor", 
    "Fecha_Emision", "Fecha_Vencimiento", 
    "Monto", "Dias_Vencimiento", "Antigüedad"
]

tabla_exportar = df_filtrado[columnas_mostrar].copy()

# Renderizado con .map() (pandas >= 2.1)
st.dataframe(
    tabla_exportar.style
    .map(formato_condicional_dias, subset=["Dias_Vencimiento"])
    .format({
        "Monto": "${:,.2f}",
        "Dias_Vencimiento": "{:+d} d",
        "Fecha_Emision": "{:%Y-%m-%d}",
        "Fecha_Vencimiento": "{:%Y-%m-%d}"
    }),
    use_container_width=True,
    height=420
)

# Descarga de datos
csv_data = tabla_exportar.to_csv(index=False).encode("utf-8")
st.download_button(
    label="📥 Descargar Facturas Filtradas (CSV)",
    data=csv_data,
    file_name=f"cuentas_por_cobrar_{datetime.now().strftime('%Y%m%d')}.csv",
    mime="text/csv"
)