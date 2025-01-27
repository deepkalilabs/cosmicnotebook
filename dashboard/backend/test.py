import psycopg2
import os

# Try with your direct connection string
#conn_string = "postgresql://postgres.nwrsgecoiwijwilscwfz:DgBJTMhVOKsKAyc7@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
conn_string = "postgresql://postgres:DgBJTMhVOKsKAyc7@db.nwrsgecoiwijwilscwfz.supabase.co:5432/postgres"
try:
    conn = psycopg2.connect(conn_string)
    print("Connection successful!")

    # Try to create a test table
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS test_table (
            id serial PRIMARY KEY,
            name text
        )
    """)
    conn.commit()
    print("Table creation successful!")

except Exception as e:
    print(f"Error: {str(e)}")
finally:
    if 'conn' in locals():
        conn.close()


