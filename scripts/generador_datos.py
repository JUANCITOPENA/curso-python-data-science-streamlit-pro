# generador_datos.py
import pandas as pd
import numpy as np
import random
import sys
from datetime import datetime, timedelta

def generar_dataset_ventas(num_registros=258, fecha_inicio="2023-01-01", fecha_fin="2023-12-31"):
    """
    Genera un dataset de ventas avanzado y lo guarda en archivos Excel y CSV.
    """
    print("🚀 Iniciando la generación de datos...")

    # --- Definición de datos maestros ---
    clientes = ["Tech Corp", "Innovate Inc", "Solutions LLC", "Data Systems", "Quantum Co", "Global Net", "Future Tech",
                "NeuralSoft", "Pixel Dynamics", "CyberNova", "SmartEdge", "Redline Systems", "BlueOrbit", "NextGen Labs", "Visionary AI"]

    productos = {"Laptop Pro": (1200, 800), "Mouse RGB": (75, 40), "Teclado Mecánico": (150, 90), "Monitor 4K": (450, 250), "Webcam HD": (90, 50),
                "Auriculares NoiseX": (180, 100), "Tablet Ultra": (650, 400), "Router AX3000": (220, 130), "Silla Ergonómica": (300, 180), "Docking Station Pro": (200, 120)}

    vendedores = ["Ana Gómez", "Carlos Díaz", "Laura Solís", "Pedro Marín",
                "Sofía Herrera", "Luis Paredes", "María Torres", "Javier Méndez", "Valentina Cruz", "Andrés Rivas"]

    regiones = ["Norte", "Sur", "Este", "Oeste"]

    tipos_pago = ["Tarjeta", "Transferencia", "Efectivo"]

    tipos_compra = ["Online", "Tienda"]

    # --- Distribución de Estatus de Entrega ---
    # 90% Completa, 7% Parcial, 3% Cancelado
    estatus_dist = ['Completa'] * 90 + ['Parcial con Devolución'] * 7 + ['Cancelado'] * 3
    
    data = []
    start_date = pd.to_datetime(fecha_inicio)
    end_date = pd.to_datetime(fecha_fin)
    
    print(f"Generando {num_registros} registros entre {fecha_inicio} y {fecha_fin}...")

    for _ in range(num_registros):
        producto, precios = random.choice(list(productos.items()))
        precio_venta = precios[0]
        precio_compra = precios[1]
        cantidad = np.random.randint(1, 10)
        
        # --- CORRECCIÓN: Calcular las métricas ANTES de añadirlas ---
        ingresos = precio_venta * cantidad
        costos = precio_compra * cantidad
        margen = ingresos - costos
        # Evitar división por cero si los ingresos son 0
        porcentaje_margen = (margen / ingresos * 100) if ingresos > 0 else 0
        
        # Generar una meta aleatoria entre el 85% y 115% de los ingresos
        meta = round(ingresos * random.uniform(0.85, 1.15), 2)

        random_date = start_date + pd.to_timedelta(
            np.random.randint(0, (end_date - start_date).days + 1), unit='d'
        )

        data.append({
            "Fecha": random_date,
            "Cliente": random.choice(clientes),
            "Producto": producto,
            "Vendedor": random.choice(vendedores),
            "Region": random.choice(regiones),
            "Precio_Venta": precio_venta,
            "Precio_Compra": precio_compra,
            "Cantidad": cantidad,
            # --- CORRECCIÓN: Usar las variables calculadas ---
            "Ingresos": ingresos,
            "Costos": costos,
            "Margen": margen,
            "% Margen": round(porcentaje_margen, 2),

            "Tipo_Pago": random.choice(tipos_pago),
            "Tipo_Compra": random.choice(tipos_compra),
            "Meta_Venta": meta,
            "Estatus_Entrega": random.choice(estatus_dist)
        })

    df = pd.DataFrame(data)
    
    # --- Guardar en ambos formatos ---
    excel_path = "ventas_dataset.xlsx"
    csv_path = "ventas_dataset.csv"
    
    try:
        df.to_excel(excel_path, index=False, engine='openpyxl')
        print(f"\n✅ ¡Éxito! Dataset guardado en '{excel_path}'")
        
        df.to_csv(csv_path, index=False, encoding="utf-8-sig")
        print(f"✅ ¡Éxito! Dataset guardado en '{csv_path}'")

    except Exception as e:
        print(f"\n❌ Error al guardar los archivos: {e}")
        print("Asegúrate de tener la librería 'openpyxl' instalada: pip install openpyxl")
    
    print(f"\nTotal de registros generados: {len(df)}")
    print("Columnas del dataset:", list(df.columns))

if __name__ == "__main__":
    # Interacción con el usuario mejorada
    print("--- 🏭 Generador de Datos de Ventas ---")
    try:
        # Pide los parámetros al usuario con valores por defecto
        num_registros_str = input("¿Cuántos registros deseas generar? (default: 258): ")
        num_registros = int(num_registros_str) if num_registros_str else 258

        fecha_inicio_str = input("Introduce la fecha de inicio (YYYY-MM-DD, default: 2023-01-01): ")
        fecha_inicio = fecha_inicio_str if fecha_inicio_str else "2023-01-01"

        fecha_fin_str = input("Introduce la fecha de fin (YYYY-MM-DD, default: 2023-12-31): ")
        fecha_fin = fecha_fin_str if fecha_fin_str else "2023-12-31"

        # Validar fechas
        if pd.to_datetime(fecha_inicio) > pd.to_datetime(fecha_fin):
            print("\n❌ Error: La fecha de inicio no puede ser posterior a la fecha de fin.")
            sys.exit(1)

        generar_dataset_ventas(num_registros=num_registros, fecha_inicio=fecha_inicio, fecha_fin=fecha_fin)

    except ValueError:
        print("\n❌ Error: El número de registros debe ser un número entero.")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Ocurrió un error inesperado: {e}")
        sys.exit(1)