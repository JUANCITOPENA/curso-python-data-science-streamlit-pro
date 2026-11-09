import requests

def obtener_info_pokemon(nombre_pokemon):
    """
    Busca información de un Pokémon específico en la PokéAPI.
    """
    # La URL base de la API
    url_base = "https://pokeapi.co/api/v2/pokemon/"
    # Concatenamos el nombre del pokémon (en minúsculas) para formar el endpoint completo
    url_completa = f"{url_base}{nombre_pokemon.lower()}"
    
    try:
        # 1. Hacemos la petición GET
        response = requests.get(url_completa)
        # 2. Verificamos si la petición fue exitosa (ej: si el pokémon no existe, dará un error 404)
        response.raise_for_status()

        # 3. Convertimos la respuesta JSON a un diccionario de Python
        datos = response.json()

        # 4. Extraemos y mostramos la información que nos interesa
        print(f"\n--- Ficha de {datos['name'].capitalize()} ---")
        print(f"ID: {datos['id']}")
        print(f"Altura: {datos['height'] / 10} m") # La API da la altura en decímetros
        print(f"Peso: {datos['weight'] / 10} kg") # Y el peso en hectogramos
        
        # Las habilidades son una lista de diccionarios, necesitamos iterar
        print("Habilidades:")
        for item in datos['abilities']:
            print(f"- {item['ability']['name'].capitalize()}")

    except requests.exceptions.HTTPError as err:
        print(f"❌ Error HTTP: Pokémon no encontrado o problema con la API. ({err})")
    except requests.exceptions.RequestException as err:
        print(f"❌ Error de Conexión: No se pudo conectar a la API. ({err})")

# --- Pruebas ---
obtener_info_pokemon("pikachu")
obtener_info_pokemon("charizard")
obtener_info_pokemon("pokemonoexistente") # Esto mostrará el mensaje de error