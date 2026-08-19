import pandas as pd

df = pd.read_csv("c:/Users/Atharva/OneDrive/Desktop/python/Backend_EV_charging/opencharge/output/charging_stations.csv")
print("Total rows:", len(df))
print("Columns:", list(df.columns))

# Filter unique cities
cities = df['city'].dropna().unique()
print("Number of unique cities:", len(cities))
print("Some cities:", list(cities[:50]))

# Search for Pune, Mumbai, Bengaluru, Nagpur
for target in ["Pune", "Mumbai", "Bengaluru", "Nagpur"]:
    matches = df[df['city'].str.contains(target, case=False, na=False) | df['address'].str.contains(target, case=False, na=False) | df['station_name'].str.contains(target, case=False, na=False)]
    print(f"Matches for '{target}':", len(matches))
    if len(matches) > 0:
        print("  First 3 matches names:", list(matches['station_name'].head(3)))
