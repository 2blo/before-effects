
import psycopg2 # must be psycopg 3
import os
import sys
import warnings
import pandas as pd
from dotenv import load_dotenv

def main():
    [col, val] = [None, None]
    try:
        table = sys.argv[1]
    except IndexError as e:
        raise ValueError('Supply a table name as command line argument, e.g "python .scripts/inspect-db.py Post"')
    try:
        where = sys.argv[2]
        try:
            split = where.split("=")
            col, val = [split[0], "=".join(split[1:])]
        except:
            ValueError('Supply a WHERE conditiona using <colName=value>"')

    except IndexError:
        print("no where-conditional argument found")

    try:
        delete = sys.argv[3]
        if delete == "delete":
            delete = True
        else:
            raise ValueError('The third argument is optional, but has to be "delete" if supplied.')
    except IndexError:
        print('no "delete" argument found, using "SELECT * ..."')
        delete = False

    load_dotenv()
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    with warnings.catch_warnings():
        warnings.simplefilter("ignore")
        action = "DELETE" if delete else "SELECT *"
        if col:
            if delete:
                conn.cursor().execute(f'{action} FROM public."{table}" WHERE "{col}" = \'{val}\'')
                conn.commit()
                print("Possible deletion completed.")
                return
            else:
                my_table    = pd.read_sql(f'{action} FROM public."{table}" WHERE "{col}" = \'{val}\'', conn)
        else:
            my_table    = pd.read_sql(f'{action} FROM public."{table}"', conn)
    out = f".out/{table}.csv"
    my_table.to_csv(out)
    print(f"Wrote query result to {out}")

if __name__ == "__main__":
    main()