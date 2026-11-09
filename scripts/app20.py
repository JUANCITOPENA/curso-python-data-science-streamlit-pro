# dashboard_sentimientos.py
import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
from textblob import TextBlob
import random
from datetime import datetime, timedelta

st.set_page_config(page_title="Análisis de Sentimientos", layout="wide")

@st.cache_data
def generar_comentarios(num_comentarios=1000): # Aumentamos la cantidad para mejores visualizaciones
    comentarios_positivos = [
        "Me encanta mi nuevo Quantum X, la cámara es increíble.", "El rendimiento es espectacular, super rápido.",
        "La mejor compra que he hecho, lo recomiendo al 100%.", "Quantum ha hecho un trabajo excelente.",
        "La duración de la batería es asombrosa.", "El diseño es precioso y muy elegante."
    ]
    comentarios_negativos = [
        "La batería no dura nada, estoy muy decepcionado.", "Terrible servicio al cliente, no responden.",
        "Se calienta demasiado con juegos.", "El software tiene muchos bugs, una pena.",
        "No vale lo que cuesta, hay mejores opciones.", "Mi pantalla llegó con un defecto, muy mala experiencia."
    ]
    comentarios_neutros = [
        "El Quantum X sale a la venta la próxima semana.", "Hoy es el lanzamiento oficial de Quantum.",
        "El precio del nuevo Quantum será de $999.", "Quantum anunció una nueva actualización de software.",
        "El evento de presentación será transmitido en vivo."
    ]
    redes_sociales = ["Twitter", "Facebook", "Instagram", "TikTok", "YouTube"]
    data = []
    hoy = datetime.now()

    for _ in range(num_comentarios):
        tipo = random.choices(["positivo", "negativo", "neutro"], weights=[0.45, 0.40, 0.15], k=1)[0]
        if tipo == "positivo": comentario = random.choice(comentarios_positivos)
        elif tipo == "negativo": comentario = random.choice(comentarios_negativos)
        else: comentario = random.choice(comentarios_neutros)
        
        fecha = hoy - timedelta(days=random.randint(0, 90))
        data.append({
            "Fecha": fecha,
            "Dia_Semana": fecha.strftime('%A'), # Nuevo campo para el mapa de calor
            "Red_Social": random.choice(redes_sociales),
            "Comentario": comentario
        })
    df = pd.DataFrame(data)

    # --- Análisis de Sentimiento con TextBlob ---
    def analizar_sentimiento(texto):
        return TextBlob(texto).sentiment.polarity

    def categorizar_sentimiento(polaridad):
        if polaridad > 0.1: return "Positivo"
        if polaridad < -0.1: return "Negativo"
        return "Neutro"

    df["Polaridad"] = df["Comentario"].apply(analizar_sentimiento)
    df["Sentimiento"] = df["Polaridad"].apply(categorizar_sentimiento)
    return df

df_sentimientos = generar_comentarios()

st.title("💬 Dashboard de Análisis de Sentimientos - Marca 'Quantum'")

# --- Filtros ---
st.sidebar.header("Filtros de Análisis")
red_social_sel = st.sidebar.multiselect(
    "Filtrar por Red Social:",
    options=df_sentimientos["Red_Social"].unique(),
    default=df_sentimientos["Red_Social"].unique()
)
# **NUEVO FILTRO** por Sentimiento
sentimiento_sel = st.sidebar.multiselect(
    "Filtrar por Sentimiento:",
    options=df_sentimientos["Sentimiento"].unique(),
    default=df_sentimientos["Sentimiento"].unique()
)
df_filtrado = df_sentimientos.query(
    "Red_Social == @red_social_sel & Sentimiento == @sentimiento_sel"
)

# --- KPIs ---
total_comentarios = len(df_filtrado)
polaridad_promedio = df_filtrado["Polaridad"].mean()

# Clasificamos el sentimiento general
sentimiento_general = "Neutro 🤔"
if polaridad_promedio > 0.1: sentimiento_general = "Positivo 😊"
elif polaridad_promedio < -0.1: sentimiento_general = "Negativo 😠"

# **NUEVOS KPIs** por sentimiento
comentarios_positivos = len(df_filtrado[df_filtrado["Sentimiento"] == "Positivo"])
comentarios_negativos = len(df_filtrado[df_filtrado["Sentimiento"] == "Negativo"])
comentarios_neutros = len(df_filtrado[df_filtrado["Sentimiento"] == "Neutro"])

col1, col2, col3, col4 = st.columns(4)
col1.metric("Comentarios Analizados", f"{total_comentarios}")
col2.metric("Sentimiento General", sentimiento_general)
col3.metric("Comentarios Positivos", f"{comentarios_positivos} 😊", 
            delta=f"{(comentarios_positivos/total_comentarios*100) if total_comentarios > 0 else 0:.1f}%")
col4.metric("Comentarios Negativos", f"{comentarios_negativos} 😠",
            delta=f"{(comentarios_negativos/total_comentarios*100) if total_comentarios > 0 else 0:.1f}%",
            delta_color="inverse")

st.markdown("---")

# --- Visualizaciones ---
st.subheader("Distribución y Concentración de Sentimientos")
col1, col2 = st.columns([0.4, 0.6]) # Damos más espacio al mapa de calor

with col1:
    # Gráfico de Dona (Pie con agujero)
    sentimiento_counts = df_filtrado["Sentimiento"].value_counts()
    fig_pie = px.pie(
        sentimiento_counts, values=sentimiento_counts.values, names=sentimiento_counts.index,
        hole=0.5, title="Proporción de Sentimientos",
        color=sentimiento_counts.index,
        color_discrete_map={'Positivo': '#23d18b', 'Negativo': '#ff7575', 'Neutro': '#8b949e'}
    )
    fig_pie.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
    st.plotly_chart(fig_pie, use_container_width=True)

with col2:
    # **NUEVO GRÁFICO: Mapa de Calor de Sentimientos por Día de la Semana y Red Social**
    heatmap_data = df_filtrado.groupby(['Dia_Semana', 'Red_Social'])['Polaridad'].mean().reset_index()
    
    if not heatmap_data.empty:
        # Creamos la tabla pivote
        heatmap_pivot = heatmap_data.pivot_table(index='Red_Social', columns='Dia_Semana', values='Polaridad')
        # Reordenamos las columnas por día de la semana
        dias_ordenados = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        heatmap_pivot = heatmap_pivot.reindex(columns=[d for d in dias_ordenados if d in heatmap_pivot.columns])

        fig_heatmap = px.imshow(
            heatmap_pivot,
            labels=dict(x="Día de la Semana", y="Red Social", color="Polaridad Prom."),
            text_auto=".2f", aspect="auto",
            title="Mapa de Calor de Sentimiento Promedio",
            color_continuous_scale="RdYlGn", # Escala de Rojo a Verde
            color_continuous_midpoint=0 # El cero es el punto medio (neutro)
        )
        fig_heatmap.update_xaxes(side="top")
        fig_heatmap.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
        st.plotly_chart(fig_heatmap, use_container_width=True)
    else:
        st.info("No hay suficientes datos para generar el mapa de calor con los filtros actuales.")

st.subheader("Evolución del Sentimiento a lo Largo del Tiempo")
df_evolucion = df_filtrado.groupby(pd.Grouper(key="Fecha", freq="D"))["Polaridad"].mean().reset_index()
fig_line = px.line(df_evolucion, x="Fecha", y="Polaridad", title="Polaridad Promedio Diaria")
fig_line.add_hline(y=0.1, line_dash="dot", line_color="#23d18b", annotation_text="Positivo")
fig_line.add_hline(y=-0.1, line_dash="dot", line_color="#ff7575", annotation_text="Negativo")
fig_line.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
st.plotly_chart(fig_line, use_container_width=True)


# --- Tabla de Comentarios Recientes ---
st.subheader("Últimos Comentarios Analizados")
st.dataframe(
    df_filtrado[["Fecha", "Red_Social", "Comentario", "Sentimiento", "Polaridad"]].sort_values("Fecha", ascending=False).head(50),
    use_container_width=True
)