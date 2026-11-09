# finance_dashboard_dark.py
import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
import requests
import random
from datetime import datetime, timedelta

# --- CONFIGURACIÓN DE PÁGINA ---
st.set_page_config(page_title="Finance Dashboard", layout="wide", initial_sidebar_state="expanded")

# --- CSS PERSONALIZADO ---
st.markdown("""
<style>
    /* ... (El CSS completo que ya te di va aquí) ... */
    .stApp { background-color: #0E1117; color: #FAFAFA; }
    h1, h2, h3, h4, h5, h6, .main-header { color: #FAFAFA; }
    .main-header { font-size: 28px; font-weight: bold; }
    .sub-header { font-size: 14px; color: #8899A6; margin-bottom: 20px; }
    [data-testid="stSidebar"] { background-color: #161B22; border-right: 1px solid #30363D; }
    [data-testid="stSidebar"] .stButton button { background-color: transparent; color: #8899A6; border-radius: 8px; font-weight: bold; margin-bottom: 5px; text-align: left; }
    [data-testid="stSidebar"] .stButton button:hover { background-color: #30363D; color: #FAFAFA; }
    [data-testid="stSidebar"] .stButton button.st-emotion-cache-19n9s5w, [data-testid="stSidebar"] .stButton button:active { background-color: #F44336; color: #FFFFFF; }
    .kpi-card { background-color: #161B22; padding: 20px; border-radius: 10px; border: 1px solid #30363D; height: 100%; }
    .kpi-title { font-size: 16px; font-weight: bold; color: #8899A6; }
    .kpi-value { font-size: 32px; font-weight: bold; color: #FAFAFA; }
    .kpi-delta-positive { color: #28a745; font-weight: bold; }
    .kpi-delta-negative { color: #dc3545; font-weight: bold; }
    .transfer-list { list-style: none; padding-left: 0; }
    .transfer-item { display: flex; align-items: center; margin-bottom: 15px; }
    .transfer-photo { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; margin-right: 15px; }
    .transfer-info .name { font-weight: bold; color: #FAFAFA; }
    .transfer-info .category { font-size: 12px; color: #8899A6; }
    .table-header { font-weight: bold; color: #8899A6; }
    .table-row { border-bottom: 1px solid #30363D; }
    .table-row img { width: 30px; height: 30px; border-radius: 50%; object-fit: cover; }
    .status-completed { background-color: rgba(40, 167, 69, 0.2); color: #28a745; padding: 5px 10px; border-radius: 15px; font-weight: bold; font-size: 12px; }
    .status-pending { background-color: rgba(255, 152, 0, 0.2); color: #ff9800; padding: 5px 10px; border-radius: 15px; font-weight: bold; font-size: 12px; }
</style>
""", unsafe_allow_html=True)

# --- GENERADOR DE DATOS ---
@st.cache_data
def get_data(num_records=100):
    response = requests.get(f"https://randomuser.me/api/?results={num_records}&nat=us,gb,fr,de,es,ca")
    users = response.json()["results"]
    
    data = []
    categories = ['Utilities', 'Shopping', 'Rent', 'Transport', 'Food', 'Salary', 'Freelance', 'Investment']
    
    for user in users:
        is_income = random.random() < 0.3
        category = random.choice(['Salary', 'Freelance', 'Investment']) if is_income else random.choice(categories[:-3])
        amount = round(random.uniform(1000, 5000) if is_income else random.uniform(20, 800), 2)
        
        data.append({
            "Photo": user["picture"]["large"], "Name": f"{user['name']['first']} {user['name']['last']}",
            "Amount": amount, "Category": category, "Type": "Income" if is_income else "Expense",
            "Date": datetime.now() - timedelta(days=random.randint(0, 365)),
            "Status": random.choice(["Completed", "Pending", "Failed"])
        })
    return pd.DataFrame(data)

df_all_transactions = get_data()

# --- LÓGICA DE NAVEGACIÓN DE LA SIDEBAR ---
if 'page' not in st.session_state:
    st.session_state.page = 'Dashboard'

def set_page(page_name):
    st.session_state.page = page_name

with st.sidebar:
    st.header("Finance Dashboard")
    pages = ["Dashboard", "Payment", "Statistics", "Account", "Income", "Debts", "Bills"]
    for page in pages:
        st.button(page, on_click=set_page, args=(page,), use_container_width=True, type="primary" if st.session_state.page == page else "secondary")
    st.markdown("---")
    st.caption("Author: Oyinran Tobi\nRecreated by: AI")

# =============================================================================
# --- VISTA DEL DASHBOARD PRINCIPAL ---
# =============================================================================
if st.session_state.page == 'Dashboard':
    st.markdown('<p class="main-header">Analytics</p>', unsafe_allow_html=True)
    st.markdown(f'<p class="sub-header">📅 {datetime.now().strftime("%A, %d de %B de %Y")}</p>', unsafe_allow_html=True)

    income = df_all_transactions[df_all_transactions['Type'] == 'Income']['Amount'].sum()
    expenses = df_all_transactions[df_all_transactions['Type'] == 'Expense']['Amount'].sum()
    savings = income - expenses
    transfers = len(df_all_transactions)

    col1, col2, col3, col4 = st.columns(4)
    col1.markdown(f'<div class="kpi-card"><div class="kpi-title">Income</div><div class="kpi-value">${income:,.2f}</div><div class="kpi-delta-positive">↗ 24.6% vs Last Month</div></div>', unsafe_allow_html=True)
    col2.markdown(f'<div class="kpi-card"><div class="kpi-title">Expenses</div><div class="kpi-value">${expenses:,.2f}</div><div class="kpi-delta-negative">↘ 24.5% vs Last Month</div></div>', unsafe_allow_html=True)
    col3.markdown(f'<div class="kpi-card"><div class="kpi-title">Savings</div><div class="kpi-value">${savings:,.2f}</div><div class="kpi-delta-negative">↘ 27.0% vs Last Month</div></div>', unsafe_allow_html=True)
    col4.markdown(f'<div class="kpi-card"><div class="kpi-title">Transfers</div><div class="kpi-value">{transfers}</div><div class="kpi-delta-positive">↗ 61.0% vs Last Month</div></div>', unsafe_allow_html=True)
    
    st.markdown("<br>", unsafe_allow_html=True)

    col1, col2 = st.columns([0.65, 0.35])
    with col1:
        with st.container(border=True):
            st.subheader("Balance Trend")
            trend_data = df_all_transactions.set_index('Date').resample('M')['Amount'].sum().reset_index()
            fig = go.Figure(go.Scatter(x=trend_data['Date'], y=trend_data['Amount'], mode='lines', fill='tozeroy', line=dict(color='#1E90FF', width=3)))
            fig.update_layout(height=350, paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)", margin=dict(t=10, b=10, l=10, r=10), xaxis=dict(showgrid=False, color='#8899A6'), yaxis=dict(showgrid=False, color='#8899A6'))
            st.plotly_chart(fig, use_container_width=True)

    with col2:
        with st.container(border=True, height=400):
            st.subheader("Recent Transfers")
            transfers_html = '<ul class="transfer-list">'
            for index, row in df_all_transactions.head(5).iterrows():
                transfers_html += f"""
                <li class="transfer-item">
                    <img src="{row['Photo']}" class="transfer-photo">
                    <div class="transfer-info">
                        <div class="name">{row['Name']}</div>
                        <div class="category">{row['Category']}</div>
                    </div>
                </li>"""
            transfers_html += '</ul>'
            st.markdown(transfers_html, unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)
    
    with st.container(border=True):
        st.subheader("Recent Transactions")
        for index, row in df_all_transactions.head(5).iterrows():
            cols = st.columns([0.1, 0.3, 0.2, 0.2, 0.2])
            cols[0].image(row['Photo'], width=35)
            cols[1].write(row['Name'])
            cols[2].write(f"${row['Amount']:,.2f}")
            cols[3].write(row['Category'])
            cols[4].markdown(f'<span class="status-{row["Status"].lower()}">{row["Status"]}</span>', unsafe_allow_html=True)

# =============================================================================
# --- OTRAS VISTAS (PÁGINAS) ---
# =============================================================================
elif st.session_state.page == 'Payment':
    st.markdown('<p class="main-header">Make a Payment</p>', unsafe_allow_html=True)
    with st.container(border=True):
        st.subheader("New Transfer")
        recipient = st.selectbox("Recipient", options=df_all_transactions['Name'].unique())
        amount = st.number_input("Amount", min_value=0.01, step=0.01, format="%.2f")
        category = st.selectbox("Category", options=[c for c in df_all_transactions['Category'].unique() if c not in ['Salary', 'Freelance', 'Investment']])
        if st.button("Send Payment", use_container_width=True, type="primary"):
            st.success(f"Successfully sent ${amount:,.2f} to {recipient} under category '{category}'.")

elif st.session_state.page == 'Statistics':
    st.markdown('<p class="main-header">Detailed Statistics</p>', unsafe_allow_html=True)
    df_expenses = df_all_transactions[df_all_transactions['Type'] == 'Expense']
    
    col1, col2 = st.columns(2)
    with col1:
        with st.container(border=True):
            st.subheader("Expenses by Category")
            fig_donut = px.pie(df_expenses, values='Amount', names='Category', hole=0.6,
                               color_discrete_sequence=px.colors.sequential.RdBu)
            fig_donut.update_layout(height=350, paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)")
            st.plotly_chart(fig_donut, use_container_width=True)

    with col2:
        with st.container(border=True):
            st.subheader("Income vs Expenses Trend")
            df_trend = df_all_transactions.set_index('Date').resample('M').agg(
                Income=('Amount', lambda x: x[x > 0].sum()),
                Expenses=('Amount', lambda x: abs(x[x < 0].sum()))
            ).reset_index()
            
            fig_bar = go.Figure()
            fig_bar.add_trace(go.Bar(x=df_trend['Date'], y=df_trend['Income'], name='Income', marker_color='#28a745'))
            fig_bar.add_trace(go.Bar(x=df_trend['Date'], y=df_trend['Expenses'], name='Expenses', marker_color='#dc3545'))
            fig_bar.update_layout(barmode='group', height=350, paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)", legend=dict(x=0, y=1.2))
            st.plotly_chart(fig_bar, use_container_width=True)
    
    st.markdown("<br>", unsafe_allow_html=True)
    with st.container(border=True):
        st.subheader("All Transaction Data")
        st.dataframe(df_all_transactions)

# --- Las demás páginas son placeholders por simplicidad ---
elif st.session_state.page == 'Account':
    st.markdown('<p class="main-header">Account Details</p>', unsafe_allow_html=True)
    st.info("Página de detalles de la cuenta en construcción.")

elif st.session_state.page == 'Income':
    st.markdown('<p class="main-header">Income Analysis</p>', unsafe_allow_html=True)
    st.info("Página de análisis de ingresos en construcción.")

elif st.session_state.page == 'Debts':
    st.markdown('<p class="main-header">Debt Management</p>', unsafe_allow_html=True)
    st.info("Página de gestión de deudas en construcción.")

elif st.session_state.page == 'Bills':
    st.markdown('<p class="main-header">Bills Overview</p>', unsafe_allow_html=True)
    st.info("Página de resumen de facturas en construcción.")