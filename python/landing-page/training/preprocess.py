"""
Preprocess module for EV Charging Station Intelligence.
Loads and aggregates raw Vahan registration data.
"""
import pandas as pd
import numpy as np
import os

def load_and_clean_data(dataset_path):
    print("Loading Vahan datasets...")
    fuel_path = os.path.join(dataset_path, "vahan-vehicle-registrations-by-fuel-type.csv")
    cat_path = os.path.join(dataset_path, "vahan-vehicle-registrations-by-vehicle-category.csv")
    
    # Load fuel registrations
    fuel_df = pd.read_csv(fuel_path)
    # Load vehicle category registrations
    cat_df = pd.read_csv(cat_path)
    
    # Parse dates
    fuel_df['date'] = pd.to_datetime(fuel_df['date'])
    cat_df['date'] = pd.to_datetime(cat_df['date'])
    
    # Clean state and office names
    for df in [fuel_df, cat_df]:
        df['state_name'] = df['state_name'].str.strip().str.title()
        df['office_name'] = df['office_name'].str.strip().str.title()
        df['office_code'] = df['office_code'].str.strip().str.upper()
        
    return fuel_df, cat_df

def aggregate_rto_level(fuel_df, cat_df):
    print("Aggregating data to RTO (Office) level...")
    
    # --- 1. Total registrations per RTO (from fuel type dataset) ---
    rto_total = fuel_df.groupby(['state_name', 'office_name', 'office_code'])['registrations'].sum().reset_index()
    rto_total.rename(columns={'registrations': 'total_registrations'}, inplace=True)
    
    # --- 2. EV registrations per RTO ---
    ev_types = ['Electric(Bov)', 'Pure Ev', 'Strong Hybrid Ev']
    ev_df = fuel_df[fuel_df['type'].isin(ev_types)]
    rto_ev = ev_df.groupby(['state_name', 'office_name', 'office_code'])['registrations'].sum().reset_index()
    rto_ev.rename(columns={'registrations': 'ev_registrations'}, inplace=True)
    
    # --- 3. Recent EV registrations (last 12 months, e.g. >= 2023-01-01) ---
    max_date = fuel_df['date'].max()
    recent_start_date = max_date - pd.DateOffset(months=12)
    recent_ev_df = ev_df[ev_df['date'] >= recent_start_date]
    rto_recent_ev = recent_ev_df.groupby(['state_name', 'office_name', 'office_code'])['registrations'].sum().reset_index()
    rto_recent_ev.rename(columns={'registrations': 'recent_ev_registrations'}, inplace=True)
    
    # --- 4. Two-Wheeler registrations per RTO ---
    tw_categories = ['Two Wheeler(Nt)', 'Two Wheeler(T)']
    tw_df = cat_df[cat_df['type'].isin(tw_categories)]
    rto_tw = tw_df.groupby(['state_name', 'office_name', 'office_code'])['registrations'].sum().reset_index()
    rto_tw.rename(columns={'registrations': 'two_wheeler_registrations'}, inplace=True)
    
    # --- 5. Four-Wheeler registrations per RTO ---
    fw_categories = ['Light Motor Vehicle', 'Light Passenger Vehicle', 'Heavy Motor Vehicle', 'Medium Motor Vehicle']
    fw_df = cat_df[cat_df['type'].isin(fw_categories)]
    rto_fw = fw_df.groupby(['state_name', 'office_name', 'office_code'])['registrations'].sum().reset_index()
    rto_fw.rename(columns={'registrations': 'four_wheeler_registrations'}, inplace=True)
    
    # --- Merge all aggregations ---
    rto_data = rto_total.merge(rto_ev, on=['state_name', 'office_name', 'office_code'], how='left')
    rto_data = rto_data.merge(rto_recent_ev, on=['state_name', 'office_name', 'office_code'], how='left')
    rto_data = rto_data.merge(rto_tw, on=['state_name', 'office_name', 'office_code'], how='left')
    rto_data = rto_data.merge(rto_fw, on=['state_name', 'office_name', 'office_code'], how='left')
    
    # Fill NaNs with 0
    rto_data.fillna(0, inplace=True)
    
    return rto_data
