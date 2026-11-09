# -*- coding: utf-8 -*-
import pandas as pd
import random
from datetime import datetime, timedelta

# -----------------------------------------------
# Función generadora
# -----------------------------------------------
def generar_inventario(fecha_inicio, fecha_fin, num_registros):
    # Rango de fechas
    fecha_inicio = pd.to_datetime(fecha_inicio)
    fecha_fin = pd.to_datetime(fecha_fin)
    dias_rango = (fecha_fin - fecha_inicio).days

    # -----------------------------------------------------
    # Datos maestros ficticios
    # -----------------------------------------------------
    # 100 clientes ficticios
    clientes = [f"Cliente {i:03d}" for i in range(1, 101)]

    # 10 proveedores
    proveedores = [
        "Nestlé", "PepsiCo", "Unilever", "Colgate-Palmolive", "Procter & Gamble",
        "Induveca", "Coca-Cola", "Bimbo", "La Famosa", "Kraft Foods"
    ]

    # Categorías
    categorias = ["Bebidas", "Lácteos", "Snacks", "Cuidado Personal", "Limpieza",
                  "Enlatados", "Carnes", "Frutas", "Verduras", "Panadería"]

    # Unidades
    unidades = ["Unidad", "Caja", "Litro", "Paquete", "Botella", "Kg"]

    # Ubicaciones
    ubicaciones = ["Almacén A", "Almacén B", "Estante 1", "Estante 2", "Zona Fría",
                   "Zona Seca", "Depósito Norte", "Depósito Sur"]

    # 30 productos distintos
    productos = [
        ("P001", "Agua Mineral 500ml", "Bebidas"),
        ("P002", "Refresco Cola 1.5L", "Bebidas"),
        ("P003", "Jugo de Naranja 1L", "Bebidas"),
        ("P004", "Leche Entera 1L", "Lácteos"),
        ("P005", "Yogurt Natural 200g", "Lácteos"),
        ("P006", "Queso Cheddar 250g", "Lácteos"),
        ("P007", "Papas Fritas 150g", "Snacks"),
        ("P008", "Galletas Chocolate 100g", "Snacks"),
        ("P009", "Maní Salado 200g", "Snacks"),
        ("P010", "Shampoo 400ml", "Cuidado Personal"),
        ("P011", "Jabón de Tocador 100g", "Cuidado Personal"),
        ("P012", "Pasta Dental 75ml", "Cuidado Personal"),
        ("P013", "Detergente 1kg", "Limpieza"),
        ("P014", "Suavizante 500ml", "Limpieza"),
        ("P015", "Cloro 1L", "Limpieza"),
        ("P016", "Sardinas en Lata 125g", "Enlatados"),
        ("P017", "Atún en Lata 170g", "Enlatados"),
        ("P018", "Maíz en Lata 300g", "Enlatados"),
        ("P019", "Pollo Entero 2kg", "Carnes"),
        ("P020", "Carne Molida 1kg", "Carnes"),
        ("P021", "Chuleta Ahumada 500g", "Carnes"),
        ("P022", "Manzana Roja 1kg", "Frutas"),
        ("P023", "Banana 1kg", "Frutas"),
        ("P024", "Naranja 1kg", "Frutas"),
        ("P025", "Tomate 1kg", "Verduras"),
        ("P026", "Lechuga 1 pieza", "Verduras"),
        ("P027", "Cebolla 1kg", "Verduras"),
        ("P028", "Pan de Molde 500g", "Panadería"),
        ("P029", "Croissant 100g", "Panadería"),
        ("P030", "Bizcocho 250g", "Panadería"),
    ]

    # Lista para almacenar registros
    registros = []

    for _ in range(num_registros):
        # Fecha del movimiento
        fecha_mov = fecha_inicio + timedelta(days=random.randint(0, dias_rango))

        # Selección de producto
        codigo, nombre_prod, categoria = random.choice(productos)

        # Stock inicial aleatorio
        stock_inicial = random.randint(50, 500)

        # Movimiento (entrada o salida)
        if random.random() < 0.5:
            entrada = random.randint(10, 200)
            salida = 0
            cliente = None
        else:
            entrada = 0
            salida = random.randint(5, min(100, stock_inicial))
            cliente = random.choice(clientes)

        stock_despachado = salida
        stock_actual = stock_inicial + entrada - salida

        # Costo
        costo_unitario = round(random.uniform(5, 500), 2)
        costo_total_actual = round(stock_actual * costo_unitario, 2)

        # Estado stock
        if stock_actual < 50:
            estado = "Bajo"
        elif stock_actual < 300:
            estado = "Óptimo"
        else:
            estado = "Exceso"

        # Días en inventario
        dias_inventario = (datetime.now() - fecha_mov).days

        # Rotación %
        rotacion = round((salida / stock_inicial) * 100, 2) if stock_inicial > 0 else 0

        # Proveedor
        proveedor = random.choice(proveedores)

        # Fecha de vencimiento (entre 1 mes y 1 año después de entrada)
        fecha_venc = fecha_mov + timedelta(days=random.randint(30, 365))

        # Ubicación
        ubicacion = random.choice(ubicaciones)

        # Nº Factura (solo si salida)
        num_factura = f"FAC-{random.randint(1000,9999)}" if salida > 0 else None

        # Agregar registro
        registros.append([
            fecha_mov.date(),
            num_factura,
            cliente,
            codigo,
            nombre_prod,
            categoria,
            stock_inicial,
            entrada,
            salida,
            stock_despachado,
            stock_actual,
            random.choice(unidades),
            costo_unitario,
            costo_total_actual,
            estado,
            dias_inventario,
            rotacion,
            proveedor,
            fecha_venc.date(),
            ubicacion
        ])

    # Crear DataFrame
    columnas = [
        "Fecha Movimiento", "Nº Factura", "Cliente", "Código Producto", "Nombre Producto",
        "Categoría", "Stock Inicial", "Entrada", "Salida", "Stock Despachado", "Stock Actual",
        "Unidad", "Costo Unitario", "Costo Total Actual", "Estado Stock", "Días en Inventario",
        "Rotación (%)", "Proveedor", "Fecha Vencimiento", "Ubicación"
    ]

    df = pd.DataFrame(registros, columns=columnas)
    return df


# -----------------------------------------------
# Ejemplo de uso
# -----------------------------------------------
if __name__ == "__main__":
    df = generar_inventario("2024-01-01", "2024-03-31", 500)

    # Mostrar primeras filas
    print(df.head())

    # Guardar en Excel
    df.to_excel("inventario_rotacion.xlsx", index=False)
    print("✅ Archivo 'inventario_rotacion.xlsx' generado con éxito.")
