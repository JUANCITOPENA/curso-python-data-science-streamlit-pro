# dashboard_politico_rd.py
import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import random

st.set_page_config(page_title="🗳️ Análisis Electoral RD", layout="wide")

@st.cache_data
def generar_votos_simulados(num_mesas=1600):
    partidos = ["PRM", "PLD", "FP", "PRSC", "ALPAIS", "PRD"]
    provincias = {
        "Distrito Nacional": (18.47, -69.91), "Santo Domingo": (18.50, -69.89), "Santiago": (19.45, -70.70),
        "La Vega": (19.22, -70.53), "San Cristóbal": (18.42, -70.10), "Puerto Plata": (19.78, -70.69),
        "La Altagracia": (18.62, -68.70), "San Pedro de Macorís": (18.46, -69.30)
    }
    zonas = ["Urbana", "Rural"]
    grupos_edad = ["18-30", "31-50", "51+"]
    data = []

    for i in range(num_mesas):
        provincia, coords = random.choice(list(provincias.items()))
        zona = random.choices(zonas, weights=[0.7, 0.3], k=1)[0]
        total_votantes = random.randint(150, 600)
        
        # Generar votos usando Dirichlet para asegurar que la suma sea el total
        votos_partido = np.random.dirichlet(np.ones(len(partidos))) * total_votantes
        
        record = {
            "ID_Mesa": 10000 + i, "Provincia": provincia, "Zona": zona,
            "Grupo_Edad": random.choice(grupos_edad), "Total_Votantes": total_votantes,
            "Lat": coords[0] + random.uniform(-0.05, 0.05),
            "Lon": coords[1] + random.uniform(-0.05, 0.05)
        }
        for partido, votos in zip(partidos, votos_partido):
            # Simulamos una pequeña variación para cada cargo
            record[f"Votos_{partido}_Presidente"] = int(votos * random.uniform(0.9, 1.1))
        
        data.append(record)
    return pd.DataFrame(data)

df_votos = generar_votos_simulados()

st.title("🗳️ Dashboard de Análisis Electoral (Simulación RD 🇩🇴)")
st.caption("Todos los datos son generados aleatoriamente para fines demostrativos.")

# --- Barra Lateral con Filtros ---
st.sidebar.header("🎛️ Filtros de Análisis")
provincias_sel = st.sidebar.multiselect("Provincias", df_votos["Provincia"].unique(), df_votos["Provincia"].unique())
zona_sel = st.sidebar.multiselect("Zonas", df_votos["Zona"].unique(), df_votos["Zona"].unique())
edad_sel = st.sidebar.multiselect("Grupos de Edad", df_votos["Grupo_Edad"].unique(), df_votos["Grupo_Edad"].unique())

df_filtrado = df_votos.query("Provincia == @provincias_sel and Zona == @zona_sel and Grupo_Edad == @edad_sel")

# --- KPIs Principales (Nivel Presidencial) ---
cols_presidente = [c for c in df_filtrado.columns if c.startswith("Votos_") and c.endswith("_Presidente")]
df_filtrado["Total_Votos_Presidente"] = df_filtrado[cols_presidente].sum(axis=1)

total_votos = df_filtrado["Total_Votos_Presidente"].sum()
votos_prm = df_filtrado["Votos_PRM_Presidente"].sum()
votos_pld = df_filtrado["Votos_PLD_Presidente"].sum()
votos_fp = df_filtrado["Votos_FP_Presidente"].sum()

col1, col2, col3, col4 = st.columns(4)
col1.metric("Votos Totales (Pres.)", f"{total_votos:,}")
col2.metric("Votos PRM", f"{votos_prm:,}", delta=f"{votos_prm/total_votos*100:.1f}%")
col3.metric("Votos PLD", f"{votos_pld:,}", delta=f"{votos_pld/total_votos*100:.1f}%")
col4.metric("Votos FP", f"{votos_fp:,}", delta=f"{votos_fp/total_votos*100:.1f}%")

st.markdown("---")

# --- Visualizaciones ---
col1, col2 = st.columns(2)

with col1:
    st.subheader("🗺️ Densidad de Votantes por Ubicación")
    if not df_filtrado.empty:
        st.map(df_filtrado, latitude='Lat', longitude='Lon', size='Total_Votantes')
    else:
        st.info("No hay datos para mostrar en el mapa con los filtros actuales.")

with col2:
    st.subheader("📊 Votos por Partido y Provincia (Presidencial)")
    df_melted = df_filtrado.melt(id_vars=["Provincia"], value_vars=cols_presidente, var_name="Partido", value_name="Votos")
    df_melted["Partido"] = df_melted["Partido"].str.replace("Votos_", "").str.replace("_Presidente", "")
    
    fig_prov = px.bar(
        df_melted.groupby(["Provincia", "Partido"])["Votos"].sum().reset_index(),
        x="Provincia", y="Votos", color="Partido", barmode="group"
    )
    fig_prov.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
    st.plotly_chart(fig_prov, use_container_width=True)
    
    
# --- Tabla de Resultados por Provincia (VERSIÓN CORREGIDA) ---
st.subheader("📋 Resultados por Provincia y Ganador (Presidencial)")
if not df_filtrado.empty:
    cols_presidente = [c for c in df_filtrado.columns if c.startswith("Votos_") and c.endswith("_Presidente")]
    df_resultados = df_filtrado.groupby("Provincia")[cols_presidente].sum()
    
    # Renombrar columnas para que sean más limpias
    df_resultados.columns = [c.replace("Votos_", "").replace("_Presidente", "") for c in df_resultados.columns]
    
    # Calcular ganador
    df_resultados["Ganador"] = df_resultados.idxmax(axis=1)

    # **CORRECCIÓN: Definir explícitamente las columnas numéricas a formatear**
    columnas_numericas = df_resultados.columns.drop("Ganador")

    # Función de estilo para resaltar la celda del ganador en cada fila
    def highlight_winner(row):
        winner = row["Ganador"]
        # Creamos una lista de estilos vacía del tamaño de la fila
        styles = [''] * len(row)
        # Encontramos el índice de la columna del ganador
        try:
            winner_idx = list(row.index).index(winner)
            # Aplicamos el estilo solo a esa celda
            styles[winner_idx] = 'background-color: #3d9dff; color: #0d1117; font-weight: bold;'
        except ValueError:
            # En caso de que el ganador no esté en las columnas (no debería pasar)
            pass
        return styles

    st.dataframe(
        df_resultados.style
            # Aplicamos el formato numérico SOLO a las columnas numéricas
            .format("{:,}", subset=columnas_numericas)
            # Aplicamos el estilo de color a nivel de fila
            .apply(highlight_winner, axis=1),
        use_container_width=True
    )
else:
    st.info("No hay datos para la tabla con los filtros actuales.")