# dashboard_inventario_pro.py
import streamlit as st
import pandas as pd
import plotly.express as px

st.set_page_config(page_title="Dashboard de Inventario Pro", layout="wide")

@st.cache_data
def cargar_datos(path):
    try:
        df = pd.read_excel(path)
        df['Fecha Movimiento'] = pd.to_datetime(df['Fecha Movimiento'])
        df['Fecha Vencimiento'] = pd.to_datetime(df['Fecha Vencimiento'])
        return df
    except FileNotFoundError:
        st.error(f"Error: No se encontró '{path}'. Ejecuta `generador_inventario.py` para crearlo.")
        return None

df = cargar_datos("inventario_junio2025.xlsx")

if df is None:
    st.stop()

st.title("📦 Dashboard Profesional de Inventario y Caducidad (Junio 2025)")

# --- Filtros ---
st.sidebar.header("Filtros de Análisis")
categoria = st.sidebar.multiselect("Categoría:", df["Categoría"].unique(), default=df["Categoría"].unique())
proveedor = st.sidebar.multiselect("Proveedor:", df["Proveedor"].unique(), default=df["Proveedor"].unique())
estatus_venc = st.sidebar.multiselect("Estatus Vencimiento:", df["Estatus Vencimiento"].unique(), default=df["Estatus Vencimiento"].unique())

df_filtrado = df.query(
    "Categoría == @categoria & Proveedor == @proveedor & `Estatus Vencimiento` == @estatus_venc"
)

# --- KPIs ---
valor_total_inventario = df_filtrado["Costo Total Actual"].sum()
valor_vencido = df_filtrado[df_filtrado["Estatus Vencimiento"] == "Vencido"]["Costo Total Actual"].sum()
valor_proximo_vencer = df_filtrado[df_filtrado["Estatus Vencimiento"] == "Próximo a Vencer"]["Costo Total Actual"].sum()
rotacion_promedio = df_filtrado[df_filtrado["Stock Inicial"] > 0]["Rotación (%)"].mean()

st.subheader("Indicadores Clave de Rendimiento (KPIs)")
col1, col2, col3, col4 = st.columns(4)
col1.metric("💰 Valor Total del Inventario", f"${valor_total_inventario:,.2f}")
col2.metric("🔄 Rotación Promedio", f"{rotacion_promedio:.2f}%")
col3.metric("🚨 Valor Próximo a Vencer", f"${valor_proximo_vencer:,.2f}")
col4.metric("🗑️ Valor Vencido (Pérdida)", f"${valor_vencido:,.2f}", delta=f"-100%", delta_color="inverse")

st.markdown("---")

# --- Visualizaciones (3 filas x 2 gráficos) ---
st.subheader("Análisis Visual del Inventario")
col1, col2 = st.columns(2)
with col1:
    st.write("**Valor de Inventario por Proveedor**")
    df_prov = df_filtrado.groupby("Proveedor")["Costo Total Actual"].sum().nlargest(10).reset_index()
    fig = px.bar(df_prov, x="Costo Total Actual", y="Proveedor", orientation='h', text_auto='.2s')
    st.plotly_chart(fig, use_container_width=True)
with col2:
    st.write("**Distribución del Stock por Estado**")
    fig = px.pie(df_filtrado, names="Estado Stock", hole=0.4,
                 color="Estado Stock", color_discrete_map={'Bajo': '#ffca2c', 'Exceso': '#ff7575', 'Óptimo': '#23d18b'})
    st.plotly_chart(fig, use_container_width=True)

col3, col4 = st.columns(2)
with col3:
    st.write("**Eficiencia: Rotación vs. Días en Inventario**")
    fig = px.scatter(df_filtrado, x="Días en Inventario", y="Rotación (%)", color="Categoría",
                     hover_name="Nombre Producto", size="Costo Total Actual", size_max=30)
    st.plotly_chart(fig, use_container_width=True)
with col4:
    st.write("**Alerta de Vencimiento por Categoría**")
    df_venc = df_filtrado[df_filtrado["Estatus Vencimiento"] != "Vigente"]
    fig = px.treemap(df_venc, path=[px.Constant("Todas las Categorías"), 'Categoría', 'Nombre Producto'], values='Costo Total Actual',
                     color='Días para Vencer', color_continuous_scale='YlOrRd_r')
    st.plotly_chart(fig, use_container_width=True)
    
st.markdown("---")

        
        # --- Tabla Detallada con Formato Condicional (VERSIÓN CORREGIDA) ---
st.subheader("📋 Vista Detallada del Inventario")

def estilo_tabla_inventario(df_para_estilo):
    """
    Aplica formato condicional a un DataFrame de inventario.
    Recibe un DataFrame de Pandas, no un objeto Styler.
    """
    def color_estado(val):
        color_map = {"Bajo": "#ffca2c", "Exceso": "#ff7575", "Óptimo": "#23d18b"}
        return f'background-color: {color_map.get(val, "transparent")}; color: #0d1117; font-weight: bold;'
    
    def color_vencimiento(val):
        color_map = {"Vencido": "#dc3545", "Próximo a Vencer": "#ffca2c"}
        return f'background-color: {color_map.get(val, "transparent")}; color: #0d1117; font-weight: bold;'
    
    format_dict = {
        "Costo Unitario": "${:,.2f}", "Costo Total Actual": "${:,.2f}",
        "Rotación (%)": "{:.1f}%", "Días para Vencer": "{:,.0f}"
    }
    
    # Aplicamos los estilos al DataFrame recibido
    return df_para_estilo.style.format(format_dict) \
                      .map(color_estado, subset=["Estado Stock"]) \
                      .map(color_vencimiento, subset=["Estatus Vencimiento"])

# **CORRECCIÓN CLAVE:** Primero seleccionamos las columnas y LUEGO pasamos el nuevo DataFrame a la función de estilo
cols_to_show = ["Nombre Producto", "Categoría", "Proveedor", "Stock Actual", "Costo Total Actual", "Rotación (%)", "Estado Stock", "Estatus Vencimiento", "Días para Vencer"]
df_para_mostrar = df_filtrado[cols_to_show]

st.dataframe(estilo_tabla_inventario(df_para_mostrar), use_container_width=True, height=500)