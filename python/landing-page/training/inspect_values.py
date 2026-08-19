import pandas as pd
import os

path = os.path.expanduser("~/.cache/kagglehub/datasets/athlawange/ev-charging/versions/1/dataset")

print("--- Inspecting unique categories and values ---")

# Fuel type inspection
fuel_df = pd.read_csv(os.path.join(path, "vahan-vehicle-registrations-by-fuel-type.csv"), nrows=100000)
print("\nFuel Types:")
print(fuel_df['type'].value_counts())

# Vehicle category inspection
cat_df = pd.read_csv(os.path.join(path, "vahan-vehicle-registrations-by-vehicle-category.csv"), nrows=100000)
print("\nVehicle Categories:")
print(cat_df['type'].value_counts())

# State and RTO inspection
print("\nUnique States count:", fuel_df['state_name'].nunique())
print("Sample States:", fuel_df['state_name'].unique()[:10])
print("Unique RTO offices count:", fuel_df['office_name'].nunique())
print("Sample RTOs:", fuel_df['office_name'].unique()[:10])
