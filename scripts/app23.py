# dashboard_zscore_basico.py
import streamlit as st
import plotly.graph_objects as go

# --- Configuración de la Página ---
st.set_page_config(page_title="Calculadora Z-Score", layout="centered")
st.title("🧮 Calculadora de Z-Score de Altman")

# --- Entradas de Usuario en la Barra Lateral ---
st.sidebar.header("Entrada de Datos Financieros 💵")
st.sidebar.write("Introduce los datos de la empresa a analizar:")

act_corr = st.sidebar.number_input("Activo Corriente", value=500000.0, format="%.2f", help="Dinero y otros activos que se pueden convertir en efectivo en menos de un año.")
pas_corr = st.sidebar.number_input("Pasivo Corriente", value=200000.0, format="%.2f", help="Deudas que deben pagarse en menos de un año.")
act_totales = st.sidebar.number_input("Activos Totales", value=1000000.0, format="%.2f", help="El valor total de todo lo que posee la empresa.")
util_retenidas = st.sidebar.number_input("Utilidades Retenidas", value=300000.0, format="%.2f", help="Ganancias acumuladas que la empresa ha reinvertido.")
ebitda = st.sidebar.number_input("EBITDA", value=250000.0, format="%.2f", help="Ganancias antes de Intereses, Impuestos, Depreciación y Amortización.")
val_mercado = st.sidebar.number_input("Valor de Mercado del Patrimonio", value=1500000.0, format="%.2f", help="Valor total de las acciones de la empresa en el mercado.")
deuda_total = st.sidebar.number_input("Deuda Total", value=400000.0, format="%.2f", help="Suma de todas las deudas de la empresa.")
ventas = st.sidebar.number_input("Ventas Totales", value=2000000.0, format="%.2f", help="Ingresos totales por ventas en el último año.")

# --- Cálculos en Tiempo Real ---
# Se comprueba que los denominadores no sean cero para evitar errores
x1 = (act_corr - pas_corr) / act_totales if act_totales else 0
x2 = util_retenidas / act_totales if act_totales else 0
x3 = ebitda / act_totales if act_totales else 0
x4 = val_mercado / deuda_total if deuda_total else 0
x5 = ventas / act_totales if act_totales else 0

z_score = 1.2*x1 + 1.4*x2 + 3.3*x3 + 0.6*x4 + 1.0*x5

# Lógica para clasificar y colorear el resultado
zona = "Zona Gris"; color_zona = "#ffca2c"; emoji = "🟡"
if z_score > 2.99:
    zona = "Zona Segura"; color_zona = "#23d18b"; emoji = "✅"
elif z_score < 1.81:
    zona = "Zona de Peligro"; color_zona = "#ff7575"; emoji = "🔴"

# --- Visualización del Resultado ---
st.header(f"Diagnóstico: {zona} {emoji}")

# Gráfico de "velocímetro" (gauge) para un gran impacto visual
fig_gauge = go.Figure(go.Indicator(
    mode = "gauge+number",
    value = z_score,
    title = {'text': "Puntaje Z-Score"},
    domain = {'x': [0, 1], 'y': [0, 1]},
    gauge = {
        'axis': {'range': [0, 5], 'tickwidth': 1, 'tickcolor': "darkblue"},
        'bar': {'color': color_zona},
        'steps' : [
            {'range': [0, 1.81], 'color': "rgba(255, 117, 117, 0.2)"},
            {'range': [1.81, 2.99], 'color': "rgba(255, 202, 44, 0.2)"},
            {'range': [2.99, 5], 'color': "rgba(35, 209, 139, 0.2)"}],
        'threshold' : {'line': {'color': "red", 'width': 4}, 'thickness': 0.75, 'value': 1.81}
    }))
fig_gauge.update_layout(paper_bgcolor="rgba(0,0,0,0)", font={'color': "white"})
st.plotly_chart(fig_gauge, use_container_width=True)

st.subheader("Desglose de Ratios Calculados")
col1, col2, col3, col4, col5 = st.columns(5)
col1.metric("X₁ (Liquidez)", f"{x1:.2f}")
col2.metric("X₂ (Rentab. Acum.)", f"{x2:.2f}")
col3.metric("X₃ (Efic. Oper.)", f"{x3:.2f}")
col4.metric("X₄ (Solvencia)", f"{x4:.2f}")
col5.metric("X₅ (Efic. Activos)", f"{x5:.2f}")