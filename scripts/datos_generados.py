import pandas as pd
import random
import numpy as np
from datetime import datetime, timedelta
from typing import Optional, Tuple

# Generador de datos de ventas (completo)
# - Incluye: Fecha, ClienteID, NombreCliente, ApellidoCliente, Región,
#   Ciudad/Provincia, Latitud, Longitud, ProductoID, Producto (nombre + modelo),
#   Categoría, PrecioUnitario, PrecioCompra, UnidadesVendidas, TotalVenta, Costo,
#   Margen, %Margen, MétodoPago, Satisfacción, VisitasWeb, Recompra,
#   NombreVendedor, ApellidoVendedor, EstadoCompra
# - Parámetros: fecha_inicio (YYYY-MM-DD), fecha_fin (YYYY-MM-DD), n registros, seed opcional


def generar_datos(fecha_inicio: str, fecha_fin: str, n: int = 100, seed: Optional[int] = None) -> pd.DataFrame:
    """Genera un DataFrame de ventas sintético y completo.

    Parámetros
    ----------
    fecha_inicio : str
        Fecha inicial en formato 'YYYY-MM-DD'.
    fecha_fin : str
        Fecha final en formato 'YYYY-MM-DD'.
    n : int
        Número de registros a generar.
    seed : Optional[int]
        Semilla para reproducibilidad.

    Retorna
    -------
    pd.DataFrame
        DataFrame con las columnas detalladas en el encabezado del archivo.
    """
    # Reproducibilidad
    if seed is not None:
        random.seed(seed)
        np.random.seed(seed)

    # Validar fechas
    inicio = datetime.strptime(fecha_inicio, "%Y-%m-%d")
    fin = datetime.strptime(fecha_fin, "%Y-%m-%d")
    if fin < inicio:
        raise ValueError("fecha_fin debe ser mayor o igual a fecha_inicio")

  # --- Productos (ProductoID, Nombre + Modelo, Categoría, PrecioVenta, PrecioCompra) ---
    productos: Tuple[Tuple[str, str, str, float, float], ...] = (
    ("P011", "Laptop Dell Inspiron 14 Ryzen 7", "Tecnología", 780.0, 640.0),
    ("P012", "Tablet Huawei MatePad Pro 11", "Tecnología", 550.0, 430.0),
    ("P013", "Monitor Samsung Curvo 32\"", "Tecnología", 320.0, 260.0),
    ("P014", "Mouse Razer DeathAdder V2", "Accesorios", 85.0, 65.0),
    ("P015", "Teclado Logitech G915 TKL", "Accesorios", 130.0, 100.0),
    ("P016", "Audífonos Bose QuietComfort 45", "Accesorios", 400.0, 320.0),
    ("P017", "Impresora Epson EcoTank L3250", "Tecnología", 370.0, 290.0),
    ("P018", "Smartphone Samsung Galaxy S24", "Tecnología", 1100.0, 880.0),
    ("P019", "Webcam Razer Kiyo Pro", "Accesorios", 180.0, 140.0),
    ("P020", "Disco Duro Seagate Expansion 4TB", "Accesorios", 150.0, 115.0),
    ("P021", "Laptop HP Pavilion x360 i7", "Tecnología", 920.0, 750.0),
    ("P022", "Tablet Lenovo Tab P12 Pro", "Tecnología", 620.0, 500.0),
    ("P023", "Monitor ASUS TUF Gaming 27\"", "Tecnología", 340.0, 270.0),
    ("P024", "Mouse Microsoft Surface Arc", "Accesorios", 95.0, 70.0),
    ("P025", "Teclado Redragon Kumara K552", "Accesorios", 60.0, 45.0),
    ("P026", "Audífonos JBL Live Pro 2", "Accesorios", 150.0, 115.0),
    ("P027", "Impresora Canon PIXMA G3110", "Tecnología", 330.0, 260.0),
    ("P028", "Smartphone Google Pixel 8 Pro", "Tecnología", 980.0, 790.0),
    ("P029", "Webcam Nexigo N960E Full HD", "Accesorios", 75.0, 55.0),
    ("P030", "Disco Duro SSD Samsung T7 1TB", "Accesorios", 130.0, 100.0),
    )


    # --- Nombres y apellidos base (se pueden ampliar) ---
    nombres = [
        "Juan", "María", "Pedro", "Ana", "Luis", "Sofía", "Carlos", "Elena", "Miguel", "Laura",
        "José", "Camila", "Fernando", "Valeria", "Diego", "Natalia",
    ]
    apellidos = [
        "Pérez", "Gómez", "Rodríguez", "Fernández", "López", "Martínez", "Díaz", "Torres", "Ramírez", "Castro",
        "Santos", "Reyes", "Mendoza", "Cruz", "Peralta", "Morales",
    ]

    # --- Vendedores: 12 (4 por región) ---
    vendedores = {
        "Norte": [("Andrés", "Pérez"), ("Lucía", "Gómez"), ("Javier", "Díaz"), ("Clara", "Torres")],
        "Sur": [("Felipe", "Ramírez"), ("Carmen", "López"), ("Raúl", "Fernández"), ("Patricia", "Castro")],
        "Este": [("Tomás", "Rodríguez"), ("Valeria", "Martínez"), ("Hugo", "Ramírez"), ("Marta", "Díaz")],
        "Oeste": [("Diego", "Torres"), ("Natalia", "Castro"), ("Óscar", "Gómez"), ("Laura", "Fernández")],
    }

    # --- Ciudades/Provincias con coordenadas (ejemplos RD) ---
    # Asignadas por región para mantener coherencia geográfica
    ubicaciones = {
        "Norte": [("Santiago", "Santiago", 19.4517, -70.6970), ("Puerto Plata", "Puerto Plata", 19.7808, -70.6871), ("La Vega", "La Vega", 19.2167, -70.5167)],
        "Sur": [("San Cristóbal", "San Cristóbal", 18.4167, -70.1058), ("Barahona", "Barahona", 18.2069, -71.1292), ("Azua", "Azua", 18.4532, -70.7349)],
        "Este": [("Santo Domingo Este", "Santo Domingo", 18.4871, -69.9310), ("La Romana", "La Romana", 18.4310, -68.9660), ("Punta Cana", "La Altagracia", 18.5818, -68.4043)],
        "Oeste": [("San Juan de la Maguana", "San Juan", 18.8015, -71.2296), ("Dajabón", "Dajabón", 19.5489, -71.7083), ("Montecristi", "Montecristi", 19.8494, -71.6440)],
    }

    metodos_pago = ["Tarjeta", "Efectivo", "Transferencia"]

    # Estados de compra y probabilidades (suman 1)
    estados = ["Entregado", "No Entregado", "Devuelto Parcial", "Cancelado"]
    probs = [0.90, 0.035, 0.025, 0.04]

    registros = []

    # Generar una pequeña lista de clientes realistas (puede repetirse entre registros)
    num_clientes_base = max(50, int(n * 0.6))
    clientes = []
    for i in range(1, num_clientes_base + 1):
        cid = f"C{str(i).zfill(3)}"
        nombre = random.choice(nombres)
        apellido = random.choice(apellidos)
        clientes.append((cid, nombre, apellido))

    for i in range(n):
        fecha = inicio + timedelta(days=random.randint(0, (fin - inicio).days))

        # Cliente (podría repetirse)
        cliente_id, nombre_cliente, apellido_cliente = random.choice(clientes)

        # Región / vendedor / ubicación
        region = random.choice(list(vendedores.keys()))
        vendedor_nombre, vendedor_apellido = random.choice(vendedores[region])
        ciudad, provincia, lat, lon = random.choice(ubicaciones[region])

        # Producto
        producto_id, producto_nombre, categoria, precio_venta, precio_compra = random.choice(productos)

        unidades = random.randint(1, 5)
        total_venta = round(precio_venta * unidades, 2)
        costo_total = round(precio_compra * unidades, 2)
        margen = round(total_venta - costo_total, 2)
        pct_margen = round((margen / total_venta) * 100, 2) if total_venta != 0 else 0.0

        metodo_pago = random.choice(metodos_pago)

        # Métricas adicionales solicitadas
        satisfaccion = round(random.uniform(1.0, 5.0), 1)  # 1.0 - 5.0
        visitas_web = random.randint(0, 30)
        recompra = random.choices(["Sí", "No"], weights=[0.25, 0.75])[0]

        # Estado de compra según probabilidades
        estado = np.random.choice(estados, p=probs)

        registros.append({
            "Fecha": fecha.strftime("%Y-%m-%d"),
            "ClienteID": cliente_id,
            "NombreCliente": nombre_cliente,
            "ApellidoCliente": apellido_cliente,
            "Región": region,
            "Ciudad": ciudad,
            "Provincia": provincia,
            "Latitud": lat,
            "Longitud": lon,
            "ProductoID": producto_id,
            "Producto": producto_nombre,
            "Categoría": categoria,
            "PrecioUnitario": precio_venta,
            "PrecioCompra": precio_compra,
            "UnidadesVendidas": unidades,
            "TotalVenta": total_venta,
            "Costo": costo_total,
            "Margen": margen,
            "%Margen": pct_margen,
            "MétodoPago": metodo_pago,
            "Satisfacción": satisfaccion,
            "VisitasWeb": visitas_web,
            "Recompra": recompra,
            "NombreVendedor": vendedor_nombre,
            "ApellidoVendedor": vendedor_apellido,
            "EstadoCompra": estado,
        })

    df = pd.DataFrame(registros)

    # Normalizar tipos
    float_cols = ["PrecioUnitario", "PrecioCompra", "TotalVenta", "Costo", "Margen", "%Margen", "Latitud", "Longitud", "Satisfacción"]
    int_cols = ["UnidadesVendidas", "VisitasWeb"]
    for c in float_cols:
        if c in df.columns:
            df[c] = df[c].astype(float)
    for c in int_cols:
        if c in df.columns:
            df[c] = df[c].astype(int)

    return df


def export_files(df: pd.DataFrame, csv_path: str = "datos_ventas.csv", xlsx_path: str = "datos_ventas.xlsx", json_path: str = "datos_ventas.json") -> Tuple[str, str, str]:
    """Exporta el DataFrame a CSV, XLSX y JSON (UTF-8) y devuelve las rutas."""
    df.to_csv(csv_path, index=False, encoding="utf-8-sig")
    try:
        df.to_excel(xlsx_path, index=False)
    except Exception:
        # Si no está instalado openpyxl, lo ignoramos (el CSV/JSON seguirá estando disponible)
        pass
    df.to_json(json_path, orient="records", force_ascii=False, indent=4)
    return csv_path, xlsx_path, json_path


# -----------------
# Tests simples
# -----------------

def test_basic_fields():
    df = generar_datos("2023-01-01", "2025-09-05", 5000, seed=42)
    expected = [
        "Fecha", "ClienteID", "NombreCliente", "ApellidoCliente", "Región",
        "Ciudad", "Provincia", "Latitud", "Longitud", "ProductoID", "Producto",
        "Categoría", "PrecioUnitario", "PrecioCompra", "UnidadesVendidas", "TotalVenta",
        "Costo", "Margen", "%Margen", "MétodoPago", "Satisfacción", "VisitasWeb",
        "Recompra", "NombreVendedor", "ApellidoVendedor", "EstadoCompra",
    ]
    for col in expected:
        assert col in df.columns, f"Falta columna: {col}"
    # Comprobar tipos básicos
    assert df["Satisfacción"].between(1.0, 5.0).all(), "Satisfacción fuera de rango"
    assert df["Recompra"].isin(["Sí", "No"]).all(), "Recompra con valores inválidos"
    print("test_basic_fields: OK")


def test_estado_distribution(tol: float = 0.04):
    N = 2000
    df = generar_datos("2023-01-01", "2025-09-05", N, seed=123)
    frec = df["EstadoCompra"].value_counts(normalize=True)
    # Revisar que cada estado exista (si no aparece, get devuelve 0)
    dif_entregado = abs(frec.get("Entregado", 0.0) - 0.90)
    dif_no_entregado = abs(frec.get("No Entregado", 0.0) - 0.035)
    dif_devuelto = abs(frec.get("Devuelto Parcial", 0.0) - 0.025)
    dif_cancelado = abs(frec.get("Cancelado", 0.0) - 0.04)
    assert dif_entregado < tol, f"Entregado fuera de tolerancia: {dif_entregado}"
    assert dif_no_entregado < tol, f"No Entregado fuera de tolerancia: {dif_no_entregado}"
    assert dif_devuelto < tol, f"Devuelto Parcial fuera de tolerancia: {dif_devuelto}"
    assert dif_cancelado < tol, f"Cancelado fuera de tolerancia: {dif_cancelado}"
    print("test_estado_distribution: OK")


if __name__ == "__main__":
    # Generar muestra y exportar
    print("Generando 50 registros de ejemplo...")
    df_demo = generar_datos("2023-01-01", "2025-09-05", 5000, seed=42)
    print(df_demo.head())

    csv_path, xlsx_path, json_path = export_files(df_demo, "datos_ventas_demo.csv", "datos_ventas_demo.xlsx", "datos_ventas_demo.json")
    print("Exportados:", csv_path, xlsx_path, json_path)

    # Ejecutar tests
    print("Ejecutando tests de validación...")
    test_basic_fields()
    test_estado_distribution()
    print("Todos los tests pasaron correctamente.")
