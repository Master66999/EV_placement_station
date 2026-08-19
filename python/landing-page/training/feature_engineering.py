"""
Feature engineering module for EV Charging Station Intelligence.
Creates target hotspot suitability score and modeling features.
"""
import pandas as pd
import numpy as np

def engineer_target_and_features(rto_data):
    print("Engineering features and target variable...")
    
    # ── Basic ratios ──
    # EV penetration rate
    rto_data['ev_penetration'] = rto_data['ev_registrations'] / (rto_data['total_registrations'] + 1)
    
    # EV growth rate (recent EV registrations as a proportion of total EVs)
    rto_data['ev_growth'] = rto_data['recent_ev_registrations'] / (rto_data['ev_registrations'] + 1)
    
    # Target vehicle category ratios
    rto_data['tw_ratio'] = rto_data['two_wheeler_registrations'] / (rto_data['total_registrations'] + 1)
    rto_data['fw_ratio'] = rto_data['four_wheeler_registrations'] / (rto_data['total_registrations'] + 1)
    
    # State-level metrics to capture regional differences
    state_ev_mean = rto_data.groupby('state_name')['ev_penetration'].transform('mean')
    rto_data['state_ev_penetration_avg'] = state_ev_mean
    
    # ── MinMax helper to normalize score components ──
    def minmax_scale(series):
        # Using log transform for highly skewed volume metrics
        val = np.log1p(series)
        return (val - val.min()) / (val.max() - val.min() + 1e-9)

    # Compute normalized score components
    norm_ev_vol = minmax_scale(rto_data['ev_registrations'])
    norm_ev_penetration = (rto_data['ev_penetration'] - rto_data['ev_penetration'].min()) / (rto_data['ev_penetration'].max() - rto_data['ev_penetration'].min() + 1e-9)
    norm_ev_growth = (rto_data['ev_growth'] - rto_data['ev_growth'].min()) / (rto_data['ev_growth'].max() - rto_data['ev_growth'].min() + 1e-9)
    norm_tw_vol = minmax_scale(rto_data['two_wheeler_registrations'])
    norm_fw_vol = minmax_scale(rto_data['four_wheeler_registrations'])
    
    # ── Compute custom hotspot scores for 2W and 4W ──
    # Weighted composite index:
    # - 35% EV absolute volume (representing current EV demand scale)
    # - 25% EV penetration rate (representing local EV density/maturity)
    # - 30% Specific vehicle class volume (representing addressable size of selected category)
    # - 10% EV recent growth velocity
    rto_data['hotspot_score_2w'] = (
        0.35 * norm_ev_vol +
        0.25 * norm_ev_penetration +
        0.30 * norm_tw_vol +
        0.10 * norm_ev_growth
    ) * 100.0
    
    rto_data['hotspot_score_4w'] = (
        0.35 * norm_ev_vol +
        0.25 * norm_ev_penetration +
        0.30 * norm_fw_vol +
        0.10 * norm_ev_growth
    ) * 100.0
    
    # Clip to [0, 100] and round
    rto_data['hotspot_score_2w'] = np.clip(rto_data['hotspot_score_2w'], 0, 100).round(1)
    rto_data['hotspot_score_4w'] = np.clip(rto_data['hotspot_score_4w'], 0, 100).round(1)
    
    # ── Reshape to row-per-RTO-per-VehicleType ──
    rows_2w = rto_data.copy()
    rows_2w['vehicle_type'] = 'Two-Wheeler'
    rows_2w['target_vehicle_registrations'] = rows_2w['two_wheeler_registrations']
    rows_2w['target_vehicle_ratio'] = rows_2w['tw_ratio']
    rows_2w['hotspot_score'] = rows_2w['hotspot_score_2w']
    
    rows_4w = rto_data.copy()
    rows_4w['vehicle_type'] = 'Four-Wheeler'
    rows_4w['target_vehicle_registrations'] = rows_4w['four_wheeler_registrations']
    rows_4w['target_vehicle_ratio'] = rows_4w['fw_ratio']
    rows_4w['hotspot_score'] = rows_4w['hotspot_score_4w']
    
    model_df = pd.concat([rows_2w, rows_4w], ignore_index=True)
    
    # Select features for training
    features = [
        'state_name',
        'office_name',
        'office_code',
        'vehicle_type',
        'total_registrations',
        'target_vehicle_registrations',
        'target_vehicle_ratio',
        'state_ev_penetration_avg',
        'hotspot_score'
    ]
    
    return model_df[features], rto_data
