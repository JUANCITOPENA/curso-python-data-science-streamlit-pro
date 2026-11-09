# -*- coding: utf-8 -*-
import pandas as pd
import random
from datetime import datetime, timedelta

def generar_inventario_junio2025(num_registros, semilla=None):
    if semilla is not None:
        random.seed(semilla)
    else:
        random.seed()

    hoy = datetime(2025, 9, 5)  # fecha de referencia actual
    fecha_inicio = datetime(2025, 6, 1)
    fecha_fin = datetime(2025, 8, 31)
    dias_rango = (fecha_fin - fecha_inicio).days

    # Datos maestros
    clientes = [f"Cliente {i:03d}" for i in range(1, 101)]
    proveedores = ["Nestlé", "PepsiCo", "Unilever", "Colgate-Palmolive", "Procter & Gamble",
                   "Induveca", "Coca-Cola", "Bimbo", "La Famosa", "Kraft Foods"]
    categorias = ["Bebidas", "Lácteos", "Snacks", "Cuidado Personal", "Limpieza",
                  "Enlatados", "Carnes", "Frutas", "Verduras", "Panadería"]
    unidades = ["Unidad", "Caja", "Litro", "Paquete", "Botella", "Kg"]
    ubicaciones = ["Almacén A", "Almacén B", "Estante 1", "Estante 2", "Zona Fría",
                   "Zona Seca", "Depósito Norte", "Depósito Sur"]

    # 30 productos
    productos = [
        ("P001","Agua Mineral 500ml","Bebidas"),("P002","Refresco Cola 1.5L","Bebidas"),
        ("P003","Jugo de Naranja 1L","Bebidas"),("P004","Leche Entera 1L","Lácteos"),
        ("P005","Yogurt Natural 200g","Lácteos"),("P006","Queso Cheddar 250g","Lácteos"),
        ("P007","Papas Fritas 150g","Snacks"),("P008","Galletas Chocolate 100g","Snacks"),
        ("P009","Maní Salado 200g","Snacks"),("P010","Shampoo 400ml","Cuidado Personal"),
        ("P011","Jabón de Tocador 100g","Cuidado Personal"),("P012","Pasta Dental 75ml","Cuidado Personal"),
        ("P013","Detergente 1kg","Limpieza"),("P014","Suavizante 500ml","Limpieza"),
        ("P015","Cloro 1L","Limpieza"),("P016","Sardinas en Lata 125g","Enlatados"),
        ("P017","Atún en Lata 170g","Enlatados"),("P018","Maíz en Lata 300g","Enlatados"),
        ("P019","Pollo Entero 2kg","Carnes"),("P020","Carne Molida 1kg","Carnes"),
        ("P021","Chuleta Ahumada 500g","Carnes"),("P022","Manzana Roja 1kg","Frutas"),
        ("P023","Banana 1kg","Frutas"),("P024","Naranja 1kg","Frutas"),
        ("P025","Tomate 1kg","Verduras"),("P026","Lechuga 1 pieza","Verduras"),
        ("P027","Cebolla 1kg","Verduras"),("P028","Pan de Molde 500g","Panadería"),
        ("P029","Croissant 100g","Panadería"),("P030","Bizcocho 250g","Panadería")
    ]

    registros = []

    for i in range(num_registros):
        # Fecha movimiento
        fecha_mov = fecha_inicio + timedelta(days=random.randint(0,dias_rango))

        # Producto
        codigo, nombre_prod, categoria = random.choice(productos)

        # Stock inicial y movimientos
        stock_inicial = random.randint(50,500)
        es_entrada = random.random() < 0.5
        if es_entrada:
            entrada = random.randint(10,200)
            salida = 0
            cliente = "Cliente Interno"
            num_factura = f"FAC-{random.randint(1000,9999)}"
        else:
            salida = random.randint(1,min(100,stock_inicial))
            entrada = 0
            cliente = random.choice(clientes)
            num_factura = f"FAC-{random.randint(1000,9999)}"

        stock_despachado = salida
        stock_actual = max(stock_inicial + entrada - salida, 0)
        costo_unitario = round(random.uniform(5,500),2)
        costo_total_actual = round(stock_actual*costo_unitario,2)
        if stock_actual < 50:
            estado_stock = "Bajo"
        elif stock_actual < 300:
            estado_stock = "Óptimo"
        else:
            estado_stock = "Exceso"

        dias_inventario = max(0,(datetime(2025,9,5).date() - fecha_mov.date()).days)
        rotacion = round((salida/stock_inicial)*100,2) if stock_inicial>0 else 0.0
        proveedor = random.choice(proveedores)
        unidad = random.choice(unidades)
        ubicacion = random.choice(ubicaciones)

        # Fecha vencimiento según regla de productos
        prob = random.random()
        if prob <= 0.90:
            # Vigente, holgada: +90 a +365 días
            fecha_venc = fecha_mov + timedelta(days=random.randint(90,365))
        elif prob <= 0.97:
            # Próximo a vencer: +1 a +30 días
            fecha_venc = fecha_mov + timedelta(days=random.randint(1,30))
        else:
            # Vencido recientemente: -1 a -60 días
            fecha_venc = fecha_mov - timedelta(days=random.randint(1,60))

        dias_para_vencer = (fecha_venc - hoy).days
        if dias_para_vencer < 0:
            estatus_venc = "Vencido"
        elif dias_para_vencer <= 30:
            estatus_venc = "Próximo a Vencer"
        else:
            estatus_venc = "Vigente"

        registros.append({
            "Fecha Movimiento": fecha_mov.strftime("%Y-%m-%d"),
            "Nº Factura": num_factura,
            "Cliente": cliente,
            "Código Producto": codigo,
            "Nombre Producto": nombre_prod,
            "Categoría": categoria,
            "Stock Inicial": stock_inicial,
            "Entrada": entrada,
            "Salida": salida,
            "Stock Despachado": stock_despachado,
            "Stock Actual": stock_actual,
            "Unidad": unidad,
            "Costo Unitario": costo_unitario,
            "Costo Total Actual": costo_total_actual,
            "Estado Stock": estado_stock,
            "Días en Inventario": dias_inventario,
            "Rotación (%)": rotacion,
            "Proveedor": proveedor,
            "Fecha Vencimiento": fecha_venc.strftime("%Y-%m-%d"),
            "Días para Vencer": dias_para_vencer,
            "Estatus Vencimiento": estatus_venc,
            "Ubicación": ubicacion
        })

    df = pd.DataFrame(registros)
    return df

if __name__=="__main__":
    df = generar_inventario_junio2025(500, semilla=42)  # puedes cambiar cantidad
    df.to_excel("inventario_junio2025.xlsx",index=False)
    df.to_csv("inventario_junio2025.csv",index=False,encoding="utf-8")
    df.to_json("inventario_junio2025.json",orient="records",force_ascii=False,indent=4)
    print(df.head())
    print(df["Estatus Vencimiento"].value_counts())
