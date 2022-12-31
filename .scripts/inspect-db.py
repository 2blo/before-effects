
import psycopg2 # must be psycopg 3
import os
import sys
import warnings
import pandas as pd
from dotenv import load_dotenv

[col, val] = [None, None]
try:
    table = sys.argv[1]
except IndexError as e:
    raise ValueError('Supply a table name as command line argument, e.g "python .scripts/inspect-db.py Post"')
try:
    where = sys.argv[2]
    try:
        [col, val] = where.split("=")
    except:
        ValueError('Supply a WHERE conditiona using <colName=value>"')
except IndexError:
    print("no where-conditional argument found")
load_dotenv()
conn = psycopg2.connect(os.environ["DATABASE_URL"])
with warnings.catch_warnings():
    warnings.simplefilter("ignore")
    if col:
        my_table    = pd.read_sql(f'SELECT * FROM public."{table}" WHERE "{col}" = \'{val}\'', conn)
    else:
        my_table    = pd.read_sql(f'SELECT * FROM public."{table}"', conn)
out = f".out/{table}.csv"
my_table.to_csv(out)
print(f"Wrote query result to {out}")
