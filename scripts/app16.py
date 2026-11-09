# dashboard_academico.py
import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import random

st.set_page_config(page_title="Gestión Académica", layout="wide")

@st.cache_data
def generar_notas(num_materias=20):
    materias_info = {
        "Álgebra Lineal": (4, 1), "Cálculo I": (5, 1), "Programación I": (5, 1),
        "Cálculo II": (5, 2), "Física I": (4, 2), "Programación II": (5, 2),
        "Estadística": (4, 3), "Estructuras de Datos": (5, 3), "Física II": (4, 3),
        "Bases de Datos": (4, 4), "Algoritmos": (5, 4), "Sistemas Operativos": (4, 4),
        "Redes de Computadores": (4, 5), "Ingeniería de Software": (5, 5), "Inteligencia Artificial": (4, 5)
    }
    periodos = ["2022-I", "2022-II", "2023-I", "2023-II", "2024-I"]
    estados_cuenta = ["Pagado", "Pendiente"]
    data = []
    materias_disponibles = list(materias_info.keys())
    
    for i in range(num_materias):
        materia_nombre = random.choice(materias_disponibles)
        materias_disponibles.remove(materia_nombre) # Para no repetir materias
        creditos, _ = materias_info[materia_nombre]
        
        data.append({
            "ID_Materia": f"MAT-{100+i}",
            "Nombre_Materia": materia_nombre,
            "Creditos": creditos,
            "Nota_Final": round(random.uniform(3.0, 10.0), 1),
            "Periodo": random.choice(periodos),
            "Estado_Cuenta": "Pagado" if random.random() > 0.3 else "Pendiente",
            "Costo_Materia": creditos * 150.0 
        })
        if not materias_disponibles: break # Si ya usamos todas
        
    df = pd.DataFrame(data)
    df["Estado_Nota"] = np.where(df["Nota_Final"] >= 5.0, "Aprobado", "Reprobado")
    return df

df_academico = generar_notas()

st.title("🎓 Dashboard de Gestión y Seguimiento Académico")

# --- Filtros ---
st.sidebar.header("Filtros")
periodo_sel = st.sidebar.multiselect(
    "Filtrar por Periodo:",
    options=sorted(df_academico["Periodo"].unique()),
    default=sorted(df_academico["Periodo"].unique())
)
estado_nota_sel = st.sidebar.multiselect(
    "Filtrar por Estado de Nota:",
    options=df_academico["Estado_Nota"].unique(),
    default=df_academico["Estado_Nota"].unique()
)
df_filtrado = df_academico.query("Periodo == @periodo_sel & Estado_Nota == @estado_nota_sel")

# --- KPIs Académicos ---
st.subheader("Rendimiento Académico")
# Promedio Ponderado = sum(nota * creditos) / sum(creditos)
if not df_filtrado.empty and df_filtrado["Creditos"].sum() > 0:
    promedio_ponderado = (df_filtrado["Nota_Final"] * df_filtrado["Creditos"]).sum() / df_filtrado["Creditos"].sum()
    tasa_aprobacion = (df_filtrado["Estado_Nota"] == "Aprobado").mean() * 100
else:
    promedio_ponderado = 0
    tasa_aprobacion = 0

col1, col2 = st.columns(2)
with col1:
    fig_promedio = go.Figure(go.Indicator(
        mode="gauge+number",
        value=promedio_ponderado,
        title={'text': "Promedio Ponderado"},
        domain={'x': [0, 1], 'y': [0, 1]},
        gauge={'axis': {'range': [0, 10]}, 'bar': {'color': "#3d9dff"}}
    ))
    st.plotly_chart(fig_promedio, use_container_width=True)
with col2:
    fig_aprobacion = go.Figure(go.Indicator(
        mode="gauge+number",
        value=tasa_aprobacion,
        number={'suffix': "%"},
        title={'text': "Tasa de Aprobación"},
        domain={'x': [0, 1], 'y': [0, 1]},
        gauge={'axis': {'range': [0, 100]}, 'bar': {'color': "#23d18b"}}
    ))
    st.plotly_chart(fig_aprobacion, use_container_width=True)

# --- KPIs Financieros ---
st.subheader("Estado de Cuenta")
deuda_total = df_filtrado[df_filtrado["Estado_Cuenta"] == "Pendiente"]["Costo_Materia"].sum()
col1, _ = st.columns([0.5, 0.5]) # Usamos una columna para limitar el ancho
col1.metric("Deuda Pendiente", f"${deuda_total:,.2f}")

# --- Tabla de Rendimiento ---
st.subheader("Detalle de Materias")

def estilo_tabla_academica(df_styled):
    def color_nota(val):
        return 'color: #23d18b' if val == "Aprobado" else 'color: #ff7575'
    def color_cuenta(val):
        return 'color: #ffca2c' if val == "Pendiente" else 'color: #8b949e'

    return df_styled.format({"Nota_Final": "{:.2f}", "Costo_Materia": "${:,.2f}"}) \
                    .map(color_nota, subset=['Estado_Nota']) \
                    .map(color_cuenta, subset=['Estado_Cuenta'])

st.dataframe(estilo_tabla_academica(df_filtrado.style), use_container_width=True)
        