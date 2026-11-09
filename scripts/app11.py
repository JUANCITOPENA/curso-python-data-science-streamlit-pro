# dashboard_avanzado.py
import streamlit as st
import pandas as pd
import plotly.express as px

st.set_page_config(page_title="Dashboard de Ventas Avanzado", layout="wide", initial_sidebar_state="expanded")

# --- Carga de Datos desde Excel ---
@st.cache_data
def cargar_datos(path):
    try:
        # **CORRECCIÓN: Se leen todas las columnas generadas por tu script**
        df = pd.read_excel(path)
        df["Fecha"] = pd.to_datetime(df["Fecha"])
        # **CORRECCIÓN: Estas columnas ahora se leen directamente, no se calculan aquí**
        # df["Ingresos"] = df["Precio_Venta"] * df["Cantidad"]
        # df["Costos"] = df["Precio_Compra"] * df["Cantidad"]
        # df["Margen"] = df["Ingresos"] - df["Costos"]
        # df["% Margen"] = df.apply(lambda row: (row["Margen"] / row["Ingresos"] * 100) if row["Ingresos"] > 0 else 0, axis=1).round(2)
        
        # Cálculo de Cumplimiento de Meta
        df["Cumplimiento_Meta"] = df.apply(lambda row: (row["Ingresos"] / row["Meta_Venta"] * 100) if row["Meta_Venta"] > 0 else 0, axis=1).round(2)
        return df
    except FileNotFoundError:
        st.error(f"Error: No se encontró el archivo '{path}'. Por favor, ejecuta primero `generador_datos.py` para crearlo.")
        return None

df = cargar_datos("ventas_dataset.xlsx")

# Si el DataFrame no se carga, detenemos la ejecución
if df is None:
    st.stop()

# --- Título ---
st.title("📊 Dashboard de Ventas Avanzado: Análisis de Rendimiento y Metas")

# --- Filtros en la Barra Lateral ---
st.sidebar.header("Filtros")
region = st.sidebar.multiselect("Región:", df["Region"].unique(), df["Region"].unique())
vendedor = st.sidebar.multiselect("Vendedor:", df["Vendedor"].unique(), df["Vendedor"].unique())
cliente = st.sidebar.multiselect("Cliente:", df["Cliente"].unique(), df["Cliente"].unique())
tipo_pago = st.sidebar.multiselect("Tipo de Pago:", df["Tipo_Pago"].unique(), df["Tipo_Pago"].unique())

df_filtrado = df.query(
    "Region == @region & Vendedor == @vendedor & Cliente == @cliente & Tipo_Pago == @tipo_pago"
)

# --- KPIs Principales ---
total_ingresos = df_filtrado["Ingresos"].sum()
meta_total = df_filtrado["Meta_Venta"].sum()
cumplimiento_general = (total_ingresos / meta_total * 100) if meta_total > 0 else 0
num_ventas = len(df_filtrado)

col1, col2, col3 = st.columns(3)
col1.metric("Ingresos Totales", f"${total_ingresos:,.2f}")
col2.metric("Meta Total", f"${meta_total:,.2f}")
# Usamos delta para mostrar la diferencia vs la meta
delta_cumplimiento = cumplimiento_general - 100
col3.metric("Cumplimiento General", f"{cumplimiento_general:.2f}%", delta=f"{delta_cumplimiento:.2f}%")

st.markdown("---")

# --- Gráficos de Análisis ---
col1, col2 = st.columns(2)

with col1:
    st.subheader("Cumplimiento de Meta por Vendedor")
    df_vendedor_meta = df_filtrado.groupby("Vendedor").agg({"Ingresos": "sum", "Meta_Venta": "sum"}).reset_index()
    df_vendedor_meta["Cumplimiento"] = (df_vendedor_meta["Ingresos"] / df_vendedor_meta["Meta_Venta"] * 100).fillna(0)
    
    fig = px.bar(df_vendedor_meta.sort_values("Cumplimiento", ascending=False),
                 x="Vendedor", y="Cumplimiento", text="Cumplimiento",
                 color="Cumplimiento", color_continuous_scale=px.colors.sequential.Tealgrn,
                 title="Rendimiento de Vendedores vs Meta")
    fig.update_traces(texttemplate='%{y:.2f}%', textposition='outside')
    fig.add_hline(y=100, line_dash="dash", line_color="red", annotation_text="Meta 100%")
    fig.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
    st.plotly_chart(fig, use_container_width=True)

with col2:
    st.subheader("Análisis de Estatus de Entrega")
    df_estatus = df_filtrado["Estatus_Entrega"].value_counts().reset_index()
    
    fig_pie = px.pie(df_estatus, values="count", names="Estatus_Entrega", hole=0.4,
                     title="Distribución de Estatus de Entrega",
                     color="Estatus_Entrega",
                     color_discrete_map={
                         'Completa': '#23d18b',
                         'Parcial con Devolución': '#ffca2c',
                         'Cancelado': '#ff7575'
                     })
    fig_pie.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
    st.plotly_chart(fig_pie, use_container_width=True)


# --- Tabla de Datos Detallada ---
st.subheader("Detalle de Ventas")
# Mostramos solo las columnas más relevantes para no saturar
columnas_a_mostrar = [
    "Fecha", "Cliente", "Producto", "Vendedor", "Ingresos", "Meta_Venta", "Cumplimiento_Meta", "Tipo_Pago", "Estatus_Entrega"
]
st.dataframe(
    df_filtrado[columnas_a_mostrar].style.format({
        "Ingresos": "${:,.2f}",
        "Meta_Venta": "${:,.2f}",
        "Cumplimiento_Meta": "{:.2f}%"
    }),
    use_container_width=True
)
        