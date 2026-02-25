import os
from dotenv import load_dotenv
import psycopg2

load_dotenv()

DB_URI = os.getenv("SUPABASE_DB_URL")

if not DB_URI:
    exit()

def fetch_city_statistics():
    try:
        conn = psycopg2.connect(DB_URI)
        cur = conn.cursor()

        query = """
            SELECT 
                city, 
                COUNT(id) as total_properties, 
                AVG(price) as average_price
            FROM properties
            GROUP BY city;
        """

        cur.execute(query)
        results = cur.fetchall()

        print("--- RAPPORT STATISTIQUE IMMOBILIER ---")
        if not results:
            print("Aucune donnée disponible dans la table properties.")
        
        for row in results:
            city = row[0]
            count = row[1]
            avg_price = round(row[2], 2)
            print(f"Ville : {city:15} | Biens : {count:3} | Prix Moyen : {avg_price:>10} €")

        cur.close()
        conn.close()

    except Exception as e:
        print(f"Erreur lors de la connexion : {e}")

if __name__ == "__main__":
    fetch_city_statistics()