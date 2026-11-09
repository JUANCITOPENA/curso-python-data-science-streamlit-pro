# dashboard_rrhh.py
from datetime import datetime, timedelta
import random
import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st

st.set_page_config(page_title="Dashboard de RRHH", layout="wide")

@st.cache_data
def generar_datos_empleados(num_empleados=150):
    nombres = ["Ana", "Carlos", "Laura", "Pedro", "Sofía", "Luis", "María", "Javier", "Valentina", "Andrés"]
    apellidos = ["Gómez", "Díaz", "Solís", "Marín", "Herrera", "Paredes", "Torres", "Méndez", "Cruz", "Rivas"]
    departamentos = ["Tecnología", "Ventas", "Marketing", "Operaciones", "Finanzas"]
    posiciones = {
        "Tecnología": ["Desarrollador Jr", "Desarrollador Sr", "Ingeniero DevOps"],
        "Ventas": ["Ejecutivo de Ventas", "Gerente de Cuentas"]
    }
    estatus_dist = ["Activo"] * 80 + ["Renuncia"] * 10 + ["Despedido"] * 5 + ["Licencia"] * 5
    data = []
    hoy = datetime.now()

    for i in range(num_empleados):
        depto = random.choice(departamentos)
        posicion = random.choice(posiciones.get(depto, ["Analista", "Asistente"]))
        fecha_contratacion = hoy - timedelta(days=random.randint(90, 365 * 8))
        
        data.append({
            "ID_Empleado": 1000 + i,
            "Nombre_Completo": f"{random.choice(nombres)} {random.choice(apellidos)}",
            "Departamento": depto,
            "Posicion": posicion,
            "Fecha_Contratacion": fecha_contratacion,
            "Salario_Mensual": round(random.uniform(2500, 8000), 2),
            "Estatus": random.choice(estatus_dist),
            "Dias_Vacaciones_Tomados": random.randint(0, 15)
        })
    df = pd.DataFrame(data)
    df["Antigüedad_Años"] = ((hoy - df["Fecha_Contratacion"]).dt.days / 365.25).round(1)
    return df

df_empleados = generar_datos_empleados()

st.title("👥 Dashboard Estratégico de Recursos Humanos")

# --- Filtros ---
st.sidebar.header("Filtros")
depto_sel = st.sidebar.multiselect(
    "Departamento:", 
    df_empleados["Departamento"].unique(), 
    df_empleados["Departamento"].unique()
)
estatus_sel = st.sidebar.multiselect(
    "Estatus de Empleado:", 
    df_empleados["Estatus"].unique(), 
    df_empleados["Estatus"].unique()
)

df_filtrado = df_empleados.query("Departamento == @depto_sel & Estatus == @estatus_sel")

# --- KPIs ---
total_empleados = len(df_filtrado)
empleados_activos = len(df_filtrado[df_filtrado["Estatus"] == "Activo"])
nomina_mensual = df_filtrado[df_filtrado["Estatus"] == "Activo"]["Salario_Mensual"].sum()
antiguedad_promedio = df_filtrado["Antigüedad_Años"].mean() if not df_filtrado.empty else 0

col1, col2, col3, col4 = st.columns(4)
col1.metric("👥 Empleados Totales", f"{total_empleados}")
col2.metric("✅ Empleados Activos", f"{empleados_activos}")
col3.metric("💰 Nómina Mensual (Activos)", f"${nomina_mensual:,.2f}")
col4.metric("⏳ Antigüedad Promedio", f"{antiguedad_promedio:.1f} años")

st.markdown("---")

# --- Visualizaciones ---
col1, col2 = st.columns(2)

with col1:
    st.subheader("Distribución de Empleados por Departamento")
    fig_dept = px.pie(df_filtrado, names="Departamento", hole=0.4, title="Composición de la Fuerza Laboral")
    fig_dept.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
    st.plotly_chart(fig_dept, use_container_width=True)

with col2:
    st.subheader("Análisis de Estatus de Empleados")
    df_estatus = df_filtrado["Estatus"].value_counts()
    fig_bar = px.bar(
        df_estatus, 
        x=df_estatus.index, 
        y=df_estatus.values, 
        text=df_estatus.values,
        title="Conteo de Empleados por Estatus", 
        color=df_estatus.index,
        color_discrete_map={
            'Activo': '#23d18b', 
            'Licencia': '#ffca2c',
            'Renuncia': 'orange', 
            'Despedido': '#ff7575'
        }
    )
    fig_bar.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
    st.plotly_chart(fig_bar, use_container_width=True)

# --- Tabla de Empleados ---
st.subheader("Detalle de la Plantilla")
def estilo_tabla_rrhh(df):
    def color_estatus(val):
        color_map = {
            'Activo': '#23d18b', 
            'Licencia': '#ffca2c', 
            'Renuncia': 'orange', 
            'Despedido': '#ff7575'
        }
        return f'color: {color_map.get(val, "white")}; font-weight: bold;'
    
    df_display = df[["Nombre_Completo", "Departamento", "Posicion", "Antigüedad_Años", "Salario_Mensual", "Estatus"]]
    
    return df_display.style.format({
        "Salario_Mensual": "${:,.2f}",
        "Antigüedad_Años": "{:.1f} años"
    }).map(lambda x: 'background-color: rgba(255, 117, 117, 0.3)' if x > 6000 else '', subset=["Salario_Mensual"]) \
      .map(color_estatus, subset=['Estatus'])

st.dataframe(estilo_tabla_rrhh(df_filtrado), use_container_width=True)