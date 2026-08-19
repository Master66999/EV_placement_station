import joblib
import pandas as pd
import os

model_path = "../models/ev_hotspot_model.pkl"
metadata_path = "../models/rto_metadata.csv"

if os.path.exists(model_path) and os.path.exists(metadata_path):
    print("Files found.")
    
    # Load model pipeline
    pipeline = joblib.load(model_path)
    print("Model pipeline loaded successfully.")
    
    # Load metadata
    rto_df = pd.read_csv(metadata_path)
    print("RTO metadata shape:", rto_df.shape)
    
    # Match Pune
    pune_rto = rto_df[rto_df['office_name'].str.contains('Pune', case=False, na=False)]
    print("\nPune RTO Match:")
    print(pune_rto)
    
    if not pune_rto.empty:
        # Construct input features for Two-Wheeler
        input_df = pd.DataFrame({
            'state_name': pune_rto['state_name'],
            'vehicle_type': ['Two-Wheeler'] * len(pune_rto),
            'total_registrations': pune_rto['total_registrations'],
            'target_vehicle_registrations': pune_rto['two_wheeler_registrations'],
            'target_vehicle_ratio': pune_rto['tw_ratio'],
            'state_ev_penetration_avg': pune_rto['state_ev_penetration_avg']
        })
        
        # Predict
        scores = pipeline.predict(input_df)
        print("\nPredicted score for Pune (Two-Wheeler):", scores)
        
        # Construct input features for Four-Wheeler
        input_df_4w = pd.DataFrame({
            'state_name': pune_rto['state_name'],
            'vehicle_type': ['Four-Wheeler'] * len(pune_rto),
            'total_registrations': pune_rto['total_registrations'],
            'target_vehicle_registrations': pune_rto['four_wheeler_registrations'],
            'target_vehicle_ratio': pune_rto['fw_ratio'],
            'state_ev_penetration_avg': pune_rto['state_ev_penetration_avg']
        })
        
        # Predict
        scores_4w = pipeline.predict(input_df_4w)
        print("Predicted score for Pune (Four-Wheeler):", scores_4w)
else:
    print("Model or metadata files not found.")
