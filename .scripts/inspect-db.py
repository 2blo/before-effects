
import psycopg2 # must be psycopg 3
import os
import sys
import warnings
import pandas as pd
from dotenv import load_dotenv
try:
    table = sys.argv[1]
except IndexError as e:
    raise ValueError('Supply a table name as command line argument, e.g "python .scripts/inscpect-db.py Post"')
load_dotenv()
conn = psycopg2.connect(os.environ["DATABASE_URL"])
with warnings.catch_warnings():
    warnings.simplefilter("ignore")
    my_table    = pd.read_sql(f'SELECT * FROM public."{table}"', conn)
out = f".out/{table}.csv"
my_table.to_csv(out)
print(f"Wrote query result to {out}")
