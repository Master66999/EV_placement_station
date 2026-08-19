import os
import pandas as pd
import json

STATIONS_PATH = "c:/Users/Atharva/OneDrive/Desktop/python/Backend_EV_charging/opencharge/output/charging_stations.csv"
print("Exists:", os.path.exists(STATIONS_PATH))

try:
    df = pd.read_csv(STATIONS_PATH)
    print("Loaded stations:", len(df))
    
    city_query = "pune"
    # Filter
    filtered = df[
        df['city'].str.contains(city_query, case=False, na=False) |
        df['address'].str.contains(city_query, case=False, na=False) |
        df['station_name'].str.contains(city_query, case=False, na=False)
    ]
    print("Filtered count:", len(filtered))
    
    results = []
    for idx, row in filtered.iterrows():
        try:
            item = {
                "station_id": int(row['station_id']),
                "station_name": str(row['station_name']),
                "latitude": float(row['latitude']) if pd.notna(row['latitude']) else None,
                "longitude": float(row['longitude']) if pd.notna(row['longitude']) else None,
                "address": str(row['address']) if pd.notna(row['address']) else "",
                "city": str(row['city']) if pd.notna(row['city']) else "",
                "state": str(row['state']) if pd.notna(row['state']) else "",
                "operator": str(row['operator']) if pd.notna(row['operator']) else "(Unknown Operator)",
                "usage_type": str(row['usage_type']) if pd.notna(row['usage_type']) else "",
                "status": str(row['status']) if pd.notna(row['status']) else "",
                "number_of_points": int(row['number_of_points']) if pd.notna(row['number_of_points']) else 1,
                "total_connections": int(row['total_connections']) if pd.notna(row['total_connections']) else 1,
                "connection_types": str(row['connection_types']) if pd.notna(row['connection_types']) else "",
                "charging_levels": str(row['charging_levels']) if pd.notna(row['charging_levels']) else "",
                "max_power_kw": float(row['max_power_kw']) if pd.notna(row['max_power_kw']) else None,
                "average_power_kw": float(row['average_power_kw']) if pd.notna(row['average_power_kw']) else None,
                "is_fast_charger": int(row['is_fast_charger']) if pd.notna(row['is_fast_charger']) else 0,
                "is_high_power": int(row['is_high_power']) if pd.notna(row['is_high_power']) else 0,
                "is_operational": int(row['is_operational']) if pd.notna(row['is_operational']) else 1,
                "is_public": int(row['is_public']) if pd.notna(row['is_public']) else 1,
            }
            results.append(item)
        except Exception as inner_e:
            print(f"Row {idx} conversion error: {inner_e}")
            raise inner_e
            
    print("Success. Results length:", len(results))
    print("Sample JSON:", json.dumps(results[0], indent=2))
except Exception as e:
    print("ERROR:", e)
