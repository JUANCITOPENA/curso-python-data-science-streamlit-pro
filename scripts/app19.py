# dashboard_financiero.py
import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
import random
from datetime import datetime, timedelta

st.set_page_config(page_title="Análisis Financiero", layout="wide")

# --- Generador de Datos (Más robusto) ---
@st.cache_data
def generar_libro_contable(num_transacciones=500):
    clientes = ["Tech Corp", "Innovate Inc", "Solutions LLC", "Data Systems", "Quantum Co"]
    proveedores = ["Oficina Supply", "Cloud Services Inc", "Marketing Pro", "Logística Veloz"]
    subcuentas_gasto = ["Sueldos y Salarios", "Alquiler de Oficina", "Marketing y Publicidad", "Suministros de Oficina", "Servicios Cloud"]
    data = []
    hoy = datetime.now()
    
    for i in range(num_transacciones):
        es_ingreso = random.random() < 0.4
        fecha = hoy - timedelta(days=random.randint(0, 365))
        
        if es_ingreso:
            monto = round(random.uniform(1000, 20000), 2)
            cliente = random.choice(clientes)
            # 1. Ingreso a Cuentas por Cobrar
            data.append({"Fecha": fecha, "Cliente_Proveedor": cliente, "Descripcion": f"Factura #{2000+i} a {cliente}",
                         "Cuenta_Contable": "Activo", "Subcuenta": "Cuentas por Cobrar", "Debe": monto, "Haber": 0})
            # 2. Contrapartida de Ingreso por Ventas
            data.append({"Fecha": fecha, "Cliente_Proveedor": cliente, "Descripcion": f"Ingreso por venta F#{2000+i}",
                         "Cuenta_Contable": "Ingreso", "Subcuenta": "Ventas", "Debe": 0, "Haber": monto})
            
            # 3. Simular el pago del cliente (75% de probabilidad)
            if random.random() < 0.75:
                fecha_pago = fecha + timedelta(days=random.randint(5, 60))
                # 4. Dinero entra al Banco
                data.append({"Fecha": fecha_pago, "Cliente_Proveedor": cliente, "Descripcion": f"Cobro F#{2000+i}",
                             "Cuenta_Contable": "Activo", "Subcuenta": "Banco", "Debe": monto, "Haber": 0})
                # 5. Se salda la Cuenta por Cobrar
                data.append({"Fecha": fecha_pago, "Cliente_Proveedor": cliente, "Descripcion": f"Cobro F#{2000+i}",
                             "Cuenta_Contable": "Activo", "Subcuenta": "Cuentas por Cobrar", "Debe": 0, "Haber": monto})
        else: # Es un Gasto
            monto = round(random.uniform(200, 10000), 2)
            proveedor = random.choice(proveedores)
            subcuenta_gasto = random.choice(subcuentas_gasto)
            # 1. Gasto se registra
            data.append({"Fecha": fecha, "Cliente_Proveedor": proveedor, "Descripcion": f"Factura de {proveedor}",
                         "Cuenta_Contable": "Gasto", "Subcuenta": subcuenta_gasto, "Debe": monto, "Haber": 0})
            # 2. Contrapartida a Cuentas por Pagar
            data.append({"Fecha": fecha, "Cliente_Proveedor": proveedor, "Descripcion": f"Deuda con {proveedor}",
                         "Cuenta_Contable": "Pasivo", "Subcuenta": "Cuentas por Pagar", "Debe": 0, "Haber": monto})

    df = pd.DataFrame(data).sort_values("Fecha").reset_index(drop=True)
    df["Mes"] = df["Fecha"].dt.strftime('%Y-%m') # Usar formato de string para el mapa de calor
    return df

df_contable = generar_libro_contable()

# --- Título y Filtros ---
st.title("💹 Dashboard de Análisis Financiero y Contable")
st.sidebar.header("Filtros")

# Rango de Fechas
fecha_min = df_contable["Fecha"].min().date()
fecha_max = df_contable["Fecha"].max().date()
fecha_range = st.sidebar.date_input("Rango de Fechas", (fecha_min, fecha_max))

# **NUEVOS FILTROS**
cuentas_sel = st.sidebar.multiselect("Cuenta Contable:", df_contable["Cuenta_Contable"].unique(), df_contable["Cuenta_Contable"].unique())
subcuentas_sel = st.sidebar.multiselect("Subcuenta:", df_contable["Subcuenta"].unique(), df_contable["Subcuenta"].unique())

df_filtrado = df_contable[
    (df_contable["Fecha"].dt.date >= fecha_range[0]) & 
    (df_contable["Fecha"].dt.date <= fecha_range[1]) &
    (df_contable["Cuenta_Contable"].isin(cuentas_sel)) &
    (df_contable["Subcuenta"].isin(subcuentas_sel))
]

# --- Ecuación Contable y KPIs Principales ---
st.subheader("📊 Ecuación Contable Fundamental y KPIs")

# Cálculos
activos = df_filtrado[df_filtrado["Cuenta_Contable"] == "Activo"]["Debe"].sum() - df_filtrado[df_filtrado["Cuenta_Contable"] == "Activo"]["Haber"].sum()
pasivos = df_filtrado[df_filtrado["Cuenta_Contable"] == "Pasivo"]["Haber"].sum() - df_filtrado[df_filtrado["Cuenta_Contable"] == "Pasivo"]["Debe"].sum()
ingresos = df_filtrado[df_filtrado["Cuenta_Contable"] == "Ingreso"]["Haber"].sum()
gastos = df_filtrado[df_filtrado["Cuenta_Contable"] == "Gasto"]["Debe"].sum()
utilidad_neta = ingresos - gastos
capital = activos - pasivos # Capital = Activos - Pasivos

col1, col2, col3 = st.columns(3)
col1.metric("Activos Totales", f"${activos:,.2f}")
col2.metric("Pasivos Totales", f"${pasivos:,.2f}")
col3.metric("Capital Contable", f"${capital:,.2f}", delta=f"{'Ecuación balanceada' if np.isclose(capital, utilidad_neta) else 'Revisar'}")

# --- Estado de Resultados ---
st.markdown("---")
st.subheader("📈 Estado de Resultados (Ingresos y Gastos)")

col1, col2, col3 = st.columns(3)
col1.metric("Ingresos por Ventas", f"${ingresos:,.2f}")
col2.metric("Costos y Gastos", f"${gastos:,.2f}")
col3.metric("Utilidad / Pérdida Neta", f"${utilidad_neta:,.2f}", delta=f"{utilidad_neta:,.2f}")

df_estado_resultados = df_filtrado[df_filtrado["Cuenta_Contable"].isin(["Ingreso", "Gasto"])]
if not df_estado_resultados.empty:
    df_plot = df_estado_resultados.groupby([pd.Grouper(key="Fecha", freq="M"), "Cuenta_Contable"])[["Debe", "Haber"]].sum().reset_index()
    df_plot["Monto"] = df_plot.apply(lambda row: row["Haber"] if row["Cuenta_Contable"] == "Ingreso" else row["Debe"], axis=1)

    fig_er = px.bar(df_plot, x="Fecha", y="Monto", color="Cuenta_Contable", 
                    title="Evolución Mensual de Ingresos y Gastos", barmode="group",
                    color_discrete_map={"Ingreso": "#23d18b", "Gasto": "#ff7575"})
    fig_er.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
    st.plotly_chart(fig_er, use_container_width=True)

# --- Balance General y Flujo de Caja ---
st.markdown("---")
st.subheader("⚖️ Balance General y Flujo de Caja")

cxc = df_filtrado[df_filtrado["Subcuenta"] == "Cuentas por Cobrar"]["Debe"].sum() - df_filtrado[df_filtrado["Subcuenta"] == "Cuentas por Cobrar"]["Haber"].sum()
cxp = df_filtrado[df_filtrado["Subcuenta"] == "Cuentas por Pagar"]["Haber"].sum() - df_filtrado[df_filtrado["Subcuenta"] == "Cuentas por Pagar"]["Debe"].sum()
saldo_banco = df_filtrado[df_filtrado["Subcuenta"] == "Banco"]["Debe"].sum() - df_filtrado[df_filtrado["Subcuenta"] == "Banco"]["Haber"].sum()

col1, col2, col3 = st.columns(3)
col1.metric("Saldo en Banco (Flujo de Caja)", f"${saldo_banco:,.2f}")
col2.metric("Cuentas por Cobrar (CxC)", f"${cxc:,.2f}")
col3.metric("Cuentas por Pagar (CxP)", f"${cxp:,.2f}")

# **NUEVO GRÁFICO DE LÍNEA: Evolución del Saldo en Banco**
st.subheader("🌊 Evolución del Flujo de Caja (Saldo en Banco)")
df_banco = df_filtrado[df_filtrado["Subcuenta"] == "Banco"].copy()
if not df_banco.empty:
    df_banco['Movimiento'] = df_banco['Debe'] - df_banco['Haber']
    df_banco['Saldo_Acumulado'] = df_banco['Movimiento'].cumsum()
    
    fig_flujo = px.line(df_banco, x='Fecha', y='Saldo_Acumulado', title="Saldo Acumulado en Banco a lo Largo del Tiempo")
    fig_flujo.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
    st.plotly_chart(fig_flujo, use_container_width=True)
else:
    st.info("No hay movimientos de banco en el período seleccionado.")

# **NUEVO GRÁFICO DE MAPA DE CALOR: Concentración de Gastos**
st.subheader("🔥 Mapa de Calor de Gastos por Mes y Categoría")
df_gastos = df_filtrado[df_filtrado["Cuenta_Contable"] == "Gasto"]
if not df_gastos.empty:
    heatmap_data = df_gastos.pivot_table(index='Subcuenta', columns='Mes', values='Debe', aggfunc='sum').fillna(0)
    
    fig_heatmap = px.imshow(heatmap_data,
                            labels=dict(x="Mes del Año", y="Categoría de Gasto", color="Monto Gastado"),
                            x=heatmap_data.columns, y=heatmap_data.index,
                            text_auto=".2s", aspect="auto",
                            title="Concentración de Gastos Mensuales por Categoría")
    fig_heatmap.update_xaxes(side="top")
    fig_heatmap.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
    st.plotly_chart(fig_heatmap, use_container_width=True)
else:
    st.info("No hay gastos registrados en el período seleccionado.")

# --- Tabla de Libro Diario Detallado con Formato Condicional ---
st.markdown("---")
st.subheader("📖 Libro Diario Detallado")

def estilo_tabla_contable(df_styled):
    def color_cuenta(val):
        color_map = {"Activo": "#3d9dff", "Pasivo": "orange", "Capital": "#d2a8ff", "Ingreso": "#23d18b", "Gasto": "#ff7575"}
        return f'color: {color_map.get(val, "white")}; font-weight: bold;'
    
    def highlight_montos(val):
        return 'font-weight: bold; color: #e6edf3;' if val > 0 else ''

    return df_styled.format({"Debe": "${:,.2f}", "Haber": "${:,.2f}"}) \
                    .map(color_cuenta, subset=['Cuenta_Contable']) \
                    .applymap(highlight_montos, subset=['Debe', 'Haber'])

st.dataframe(estilo_tabla_contable(df_filtrado.style), use_container_width=True)