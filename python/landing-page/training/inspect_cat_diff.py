import pandas as pd
import os

path = os.path.expanduser("~/.cache/kagglehub/datasets/athlawange/ev-charging/versions/1/dataset")

df1 = pd.read_csv(os.path.join(path, "vahan-vehicle-registrations-by-vehicle-category.csv"), nrows=5)
df2 = pd.read_csv(os.path.join(path, "vahan-vehicle-registrations-by-vehicle-category-71m55i.csv"), nrows=5)

print("Columns in file 1:")
print(df1.columns.tolist())
print("\nColumns in file 2:")
print(df2.columns.tolist())

# Let's count length
print("\nLengths:")
print("vahan-vehicle-registrations-by-vehicle-category.csv:", len(pd.read_csv(os.path.join(path, "vahan-vehicle-registrations-by-vehicle-category.csv"), usecols=['id'])) )
print("vahan-vehicle-registrations-by-vehicle-category-71m55i.csv:", len(pd.read_csv(os.path.join(path, "vahan-vehicle-registrations-by-vehicle-category-71m55i.csv"), usecols=['id'])) )
