# generador_datos.py
# -*- coding: utf-8 -*-
import pandas as pd
import numpy as np
import random
import sys
from datetime import timedelta

# ---------------------------------------------------------
# Datos maestros (puedes editarlos a tu gusto)
# ---------------------------------------------------------
CLIENTES = [
    "Tech Corp", "Innovate Inc", "Solutions LLC", "Data Systems", "Quantum Co",
    "Global Net", "Future Tech", "Pixel Labs", "Alpha Group", "Neural Soft",
    "Blue Ocean", "Delta Networks", "NovaWare", "SoftBridge", "Apex IT"
]

# Producto: (precio_venta, precio_compra, categoria, sku)
PRODUCTOS = {
    "Laptop Pro 14": (1200.0, 800.0, "Computadoras", "LP14-PRO"),
    "Laptop Air 13": (980.0, 700.0, "Computadoras", "LA13-AIR"),
    "Mouse RGB": (75.0, 40.0, "Periféricos", "MOU-RGB"),
    "Teclado Mecánico": (150.0, 90.0, "Periféricos", "TEC-MEC"),
    "Monitor 4K 27\"": (450.0, 250.0, "Monitores", "MON-4K27"),
    "Webcam HD": (90.0, 50.0, "Accesorios", "WEB-HD"),
    "SSD NVMe 1TB": (130.0, 80.0, "Almacenamiento", "SSD-1TB"),
    "Auriculares Pro": (180.0, 110.0, "Audio", "AUR-PRO"),
    "Router WiFi 6": (160.0, 95.0, "Redes", "ROU-W6"),
    "Silla Ergonómica": (220.0, 140.0, "Mobiliario", "SIL-ERGO"),
}

TIPOS_PAGO = ["Tarjeta", "Transferencia", "Efectivo"]
TIPOS_COMPRA = ["Online", "Tienda"]
CANALES = ["Web", "App", "Sucursal"]  # Para análisis omnicanal

# Vendedores asignados a varias ciudades
VENDEDORES = [
    {"id": "V001", "nombre": "Ana Gómez",   "ciudades": ["Santo Domingo", "San Cristóbal", "La Romana"]},
    {"id": "V002", "nombre": "Carlos Díaz", "ciudades": ["Santiago de los Caballeros", "La Vega", "Puerto Plata"]},
    {"id": "V003", "nombre": "Laura Solís", "ciudades": ["Santo Domingo", "San Pedro de Macorís", "Higüey"]},
    {"id": "V004", "nombre": "Pedro Marín", "ciudades": ["San Francisco de Macorís", "Santiago de los Caballeros", "La Vega"]},
]

# Ciudades RD con provincia, región macro y geolocalización
CIUDADES = [
    {"ciudad": "Santo Domingo",             "provincia": "Distrito Nacional",     "region": "Sur",  "lat": 18.486057, "lon": -69.931212},
    {"ciudad": "Santiago de los Caballeros","provincia": "Santiago",              "region": "Norte","lat": 19.4517,   "lon": -70.6970},
    {"ciudad": "San Cristóbal",            "provincia": "San Cristóbal",         "region": "Sur",  "lat": 18.4167,   "lon": -70.1000},
    {"ciudad": "La Romana",                "provincia": "La Romana",             "region": "Este", "lat": 18.4273,   "lon": -68.9728},
    {"ciudad": "San Pedro de Macorís",     "provincia": "San Pedro de Macorís",  "region": "Este", "lat": 18.4500,   "lon": -69.3000},
    {"ciudad": "Higüey",                   "provincia": "La Altagracia",         "region": "Este", "lat": 18.6150,   "lon": -68.7070},
    {"ciudad": "Puerto Plata",             "provincia": "Puerto Plata",          "region": "Norte","lat": 19.7950,   "lon": -70.6940},
    {"ciudad": "La Vega",                  "provincia": "La Vega",               "region": "Norte","lat": 19.2220,   "lon": -70.5330},
    {"ciudad": "San Francisco de Macorís", "provincia": "Duarte",                "region": "Norte","lat": 19.3000,   "lon": -70.2500},
]

ITBIS = 0.18  # Impuesto RD (ITBIS)
ESTATUS_ENTREGA_POP = (["Completa"] * 90) + (["Parcial con Devolución"] * 7) + (["Cancelado"] * 3)

# ---------------------------------------------------------
# Utilidades
# ---------------------------------------------------------
def escoger_vendedor_y_ciudad():
    vendedor = random.choice(VENDEDORES)
    ciudad_nombre = random.choice(vendedor["ciudades"])
    ciudad_info = next(c for c in CIUDADES if c["ciudad"] == ciudad_nombre)
    return vendedor, ciudad_info

def generar_id_pedido(i, fecha):
    # PED-YYYYMMDD-000001
    return f"PED-{fecha.strftime('%Y%m%d')}-{i+1:06d}"

def sorteo_descuento_pct():
    # ~60% sin descuento, 25% entre 5-10%, 15% entre 10-20%
    r = random.random()
    if r < 0.60:
        return 0.0
    elif r < 0.85:
        return round(random.uniform(0.05, 0.10), 4)
    else:
        return round(random.uniform(0.10, 0.20), 4)

def elegir_estado_pago(estatus_entrega):
    # Si se cancela, estado pago = Reembolsado la mayoría de veces
    if estatus_entrega == "Cancelado":
        return random.choices(["Reembolsado", "Fallido", "Pendiente"], [0.8, 0.1, 0.1])[0]
    # Caso normal
    return random.choices(["Pagado", "Pendiente", "Fallido"], [0.85, 0.10, 0.05])[0]

# ---------------------------------------------------------
# Generador principal
# ---------------------------------------------------------
def generar_dataset_ventas(num_registros=258, fecha_inicio="2023-01-01", fecha_fin="2023-12-31"):
    print("🚀 Iniciando la generación de datos...")

    start_date = pd.to_datetime(fecha_inicio)
    end_date = pd.to_datetime(fecha_fin)
    if end_date < start_date:
        raise ValueError("fecha_fin no puede ser menor que fecha_inicio")

    print(f"Generando {num_registros} registros entre {fecha_inicio} y {fecha_fin}...")

    filas = []
    for i in range(num_registros):
        # Fecha del pedido
        fecha_pedido = start_date + pd.to_timedelta(
            np.random.randint(0, (end_date - start_date).days + 1), unit='d'
        )

        # Producto y precios
        prod, (precio_venta, precio_compra, categoria, sku) = random.choice(list(PRODUCTOS.items()))
        cantidad = np.random.randint(1, 10)

        # Vendedor + ciudad/geo
        vendedor, ciudad_info = escoger_vendedor_y_ciudad()

        # Tipo compra / canal impactan envío
        tipo_compra = random.choice(TIPOS_COMPRA)
        canal = random.choice(CANALES)
        costo_envio = 0.0 if tipo_compra == "Tienda" else round(random.uniform(5.0, 20.0), 2)

        # Descuento
        desc_pct = sorteo_descuento_pct()
        bruto = precio_venta * cantidad
        descuento = round(bruto * desc_pct, 2)

        # Subtotal antes de impuesto/envío
        subtotal = bruto - descuento

        # Impuestos
        impuesto = round(subtotal * ITBIS, 2)

        # Total base (antes de devoluciones)
        total_bruto = round(subtotal + impuesto + costo_envio, 2)

        # Costos y márgenes
        costo_total = round(precio_compra * cantidad, 2)
        ganancia_bruta = round(subtotal - costo_total, 2)
        margen_bruto_pct = round((ganancia_bruta / subtotal), 4) if subtotal > 0 else 0.0

        # Meta (85% a 115% de ingresos brutos de venta)
        meta_venta = round(bruto * random.uniform(0.85, 1.15), 2)

        # Estatus de entrega / devoluciones / cancelaciones
        estatus_entrega = random.choice(ESTATUS_ENTREGA_POP)
        if estatus_entrega == "Parcial con Devolución":
            dev_qty = np.random.randint(1, cantidad + 1)  # puede devolver todo menos que cancelación total
            entregada = cantidad - dev_qty
            proporcion = (dev_qty / cantidad)
            monto_devuelto = round(total_bruto * proporcion, 2)
        elif estatus_entrega == "Cancelado":
            dev_qty = cantidad
            entregada = 0
            monto_devuelto = total_bruto
            costo_envio = 0.0  # no se cobra envío
        else:  # Completa
            dev_qty = 0
            entregada = cantidad
            monto_devuelto = 0.0

        total_neto = round(total_bruto - monto_devuelto, 2)

        # Fechas de envío/entrega
        if estatus_entrega == "Cancelado":
            fecha_envio = pd.NaT
            fecha_entrega = pd.NaT
            tiempo_entrega_dias = pd.NA
        else:
            fecha_envio = fecha_pedido + timedelta(days=np.random.randint(0, 4))  # 0-3 días
            fecha_entrega = fecha_envio + timedelta(days=np.random.randint(1, 11))  # 1-10 días
            tiempo_entrega_dias = (fecha_entrega - fecha_pedido).days

        # Estado de pago
        estado_pago = elegir_estado_pago(estatus_entrega)
        tipo_pago = random.choice(TIPOS_PAGO)

        # IDs
        id_pedido = generar_id_pedido(i, fecha_pedido)
        id_cliente = f"C{np.random.randint(1, 501):05d}"
        id_producto = f"P{abs(hash(sku)) % 100000:05d}"
        id_vendedor = vendedor["id"]

        # Atributos de tiempo
        anio = fecha_pedido.year
        mes = fecha_pedido.month
        dia = fecha_pedido.day
        trimestre = (mes - 1) // 3 + 1
        semana_iso = fecha_pedido.isocalendar().week

        # Registro
        filas.append({
            "ID_Pedido": id_pedido,
            "Fecha_Pedido": fecha_pedido.normalize(),
            "Fecha_Envio": fecha_envio if pd.isna(fecha_envio) else fecha_envio.normalize(),
            "Fecha_Entrega": fecha_entrega if pd.isna(fecha_entrega) else fecha_entrega.normalize(),
            "Tiempo_Entrega_Dias": tiempo_entrega_dias,

            "ID_Cliente": id_cliente,
            "Cliente": random.choice(CLIENTES),

            "ID_Producto": id_producto,
            "SKU": sku,
            "Producto": prod,
            "Categoria": categoria,

            "ID_Vendedor": id_vendedor,
            "Vendedor": vendedor["nombre"],

            "Ciudad": ciudad_info["ciudad"],
            "Provincia": ciudad_info["provincia"],
            "Region": ciudad_info["region"],
            "Latitud": ciudad_info["lat"],
            "Longitud": ciudad_info["lon"],

            "Tipo_Compra": tipo_compra,
            "Canal": canal,
            "Tipo_Pago": tipo_pago,
            "Estado_Pago": estado_pago,

            "Precio_Lista": round(precio_venta, 2),
            "Precio_Compra": round(precio_compra, 2),
            "Cantidad": cantidad,
            "Cantidad_Entregada": entregada,
            "Cantidad_Devuelta": dev_qty,

            "Descuento_%": round(desc_pct, 4),
            "Descuento_Monto": descuento,
            "Subtotal": round(subtotal, 2),
            "ITBIS_%": ITBIS,
            "ITBIS_Monto": impuesto,
            "Costo_Envio": round(costo_envio, 2),
            "Total_Bruto": total_bruto,
            "Monto_Devuelto": monto_devuelto,
            "Total_Neto": total_neto,

            "Costo_Total": costo_total,
            "Ganancia_Bruta": ganancia_bruta,
            "Margen_Bruto_%": margen_bruto_pct,

            "Meta_Venta": meta_venta,
            "Cumplimiento_Meta": total_neto >= meta_venta,
            "Estatus_Entrega": estatus_entrega,

            "Año": anio,
            "Mes": mes,
            "Dia": dia,
            "Trimestre": trimestre,
            "Semana_ISO": semana_iso,
        })

    df = pd.DataFrame(filas)

    # Guardados
    base = "ventas_dataset"
    # XLSX (si openpyxl disponible)
    try:
        import openpyxl  # noqa: F401
        xlsx_path = f"{base}.xlsx"
        df.to_excel(xlsx_path, index=False)
        print(f"✅ XLSX guardado en: {xlsx_path}")
    except Exception as e:
        print(f"ℹ️ No se generó XLSX (instala openpyxl si lo necesitas). Detalle: {e}")

    # CSV
    csv_path = f"{base}.csv"
    df.to_csv(csv_path, index=False, encoding="utf-8-sig")
    print(f"✅ CSV guardado en: {csv_path}")

    # JSON (registros)
    json_path = f"{base}.json"
    df.to_json(json_path, orient="records", force_ascii=False)
    print(f"✅ JSON guardado en: {json_path}")
    
    # --- Guardar en Excel ---
    output_path = "ventas_dataset.xlsx"
    df.to_excel(output_path, index=False, engine='openpyxl')
    print(f"✅ JSON guardado en: {output_path}")
 
 
    print(f"\nTotal de registros generados: {len(df)}")
    print("Columnas:", list(df.columns))
    return df


# ---------------------------------------------------------
# CLI
# ---------------------------------------------------------
if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("⚠️ Uso: python generador_datos.py <num_registros> <fecha_inicio> <fecha_fin>")
        print("Ejemplo: python generador_datos.py 500 2023-03-01 2023-06-30")
        sys.exit(1)

    num_registros = int(sys.argv[1])
    fecha_inicio = sys.argv[2]
    fecha_fin = sys.argv[3]

    generar_dataset_ventas(num_registros=num_registros, fecha_inicio=fecha_inicio, fecha_fin=fecha_fin)
