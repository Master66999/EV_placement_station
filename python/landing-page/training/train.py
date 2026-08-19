"""
Training pipeline for EV Charging Station Intelligence.
Splits data by RTO groups, trains multiple regressors,
evaluates and compares them, and saves the best model.
"""
import pandas as pd
import numpy as np
import os
import joblib

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import Ridge
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from lightgbm import LGBMRegressor

# Import custom modules
from preprocess import load_and_clean_data, aggregate_rto_level
from feature_engineering import engineer_target_and_features
from evaluate import evaluate_regression_model

def run_pipeline():
    # --- Path configurations ---
    dataset_path = os.path.expanduser("~/.cache/kagglehub/datasets/athlawange/ev-charging/versions/1/dataset")
    models_dir = "../models"
    os.makedirs(models_dir, exist_ok=True)
    
    # ── 1. Preprocessing ──
    fuel_df, cat_df = load_and_clean_data(dataset_path)
    rto_data = aggregate_rto_level(fuel_df, cat_df)
    
    # ── 2. Feature Engineering & Target Creation ──
    model_df, rto_details = engineer_target_and_features(rto_data)
    
    # Print quick analysis
    print(f"\n[Dataset Analysis]")
    print(f"  Total records: {len(model_df)}")
    print(f"  Vehicle types: {model_df['vehicle_type'].value_counts().to_dict()}")
    print(f"  Missing values:\n{model_df.isnull().sum()}")
    print(f"  Target statistics:\n{model_df['hotspot_score'].describe()}")
    
    # ── 3. Train / Test Split by RTO (avoid leakage) ──
    unique_rtos = model_df['office_code'].unique()
    train_rtos, test_rtos = train_test_split(unique_rtos, test_size=0.2, random_state=42)
    
    train_df = model_df[model_df['office_code'].isin(train_rtos)]
    test_df = model_df[model_df['office_code'].isin(test_rtos)]
    
    print(f"\n[Data Splitting (Grouped by RTO Code)]")
    print(f"  Train set: {len(train_df)} rows ({len(train_rtos)} RTOs)")
    print(f"  Test set : {len(test_df)} rows ({len(test_rtos)} RTOs)")
    
    # Define features and target
    X_train = train_df.drop(columns=['office_name', 'office_code', 'hotspot_score'])
    y_train = train_df['hotspot_score']
    X_test = test_df.drop(columns=['office_name', 'office_code', 'hotspot_score'])
    y_test = test_df['hotspot_score']
    
    # ── 4. Build Preprocessing Pipeline ──
    num_features = ['total_registrations', 'target_vehicle_registrations', 'target_vehicle_ratio', 'state_ev_penetration_avg']
    cat_features = ['state_name', 'vehicle_type']
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), num_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), cat_features)
        ]
    )
    
    # ── 5. Train Multiple Models ──
    models = {
        "Ridge Baseline": Ridge(alpha=1.0),
        "Random Forest": RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1),
        "XGBoost": XGBRegressor(n_estimators=100, learning_rate=0.1, random_state=42, n_jobs=-1),
        "LightGBM": LGBMRegressor(n_estimators=100, learning_rate=0.1, random_state=42, verbose=-1, n_jobs=-1)
    }
    
    results = {}
    pipelines = {}
    
    for name, model in models.items():
        print(f"\nTraining {name}...")
        pipeline = Pipeline(steps=[
            ('preprocessor', preprocessor),
            ('model', model)
        ])
        
        pipeline.fit(X_train, y_train)
        pipelines[name] = pipeline
        
        # Predict & Evaluate
        y_pred = pipeline.predict(X_test)
        metrics = evaluate_regression_model(y_test, y_pred, model_name=name)
        results[name] = metrics
        
    # ── 6. Compare Models ──
    print("\n" + "=" * 50)
    print("MODEL COMPARISON")
    print("=" * 50)
    comparison_data = []
    for name, metrics in results.items():
        comparison_data.append({
            "Model": name,
            "MAE": metrics["MAE"],
            "RMSE": metrics["RMSE"],
            "R2": metrics["R2"]
        })
    comparison_df = pd.DataFrame(comparison_data)
    print(comparison_df.to_string(index=False))
    
    # ── 7. Select Best Model (highest R2) ──
    best_model_name = comparison_df.sort_values(by="R2", ascending=False).iloc[0]["Model"]
    print(f"\n* Selected Best Model: {best_model_name}")
    best_pipeline = pipelines[best_model_name]
    
    # Save the model
    model_save_path = os.path.join(models_dir, "ev_hotspot_model.pkl")
    joblib.dump(best_pipeline, model_save_path)
    print(f"  [OK] Saved best model pipeline to: {os.path.abspath(model_save_path)}")
    
    # Save details of RTO metadata for backend references (including features needed for inference)
    rto_metadata = rto_details[[
        'state_name', 'office_name', 'office_code', 'total_registrations', 'ev_penetration',
        'two_wheeler_registrations', 'four_wheeler_registrations', 'tw_ratio', 'fw_ratio',
        'state_ev_penetration_avg'
    ]].copy()
    rto_metadata_path = os.path.join(models_dir, "rto_metadata.csv")
    rto_metadata.to_csv(rto_metadata_path, index=False)
    print(f"  [OK] Saved RTO metadata mapping to: {os.path.abspath(rto_metadata_path)}")
    
    # ── 8. Feature Importance / Explainability ──
    print("\n[Feature Importance Analysis]")
    try:
        # Get feature names from preprocessor
        ohe = best_pipeline.named_steps['preprocessor'].named_transformers_['cat']
        cat_encoder_cols = ohe.get_feature_names_out(cat_features).tolist()
        feature_names = num_features + cat_encoder_cols
        
        raw_model = best_pipeline.named_steps['model']
        if hasattr(raw_model, 'feature_importances_'):
            importances = raw_model.feature_importances_
            feat_imp = pd.Series(importances, index=feature_names).sort_values(ascending=False)
            print("Top Feature Importances:")
            print(feat_imp.head(10).to_string())
        elif hasattr(raw_model, 'coef_'):
            coefs = raw_model.coef_
            feat_coef = pd.Series(coefs, index=feature_names).sort_values(key=abs, ascending=False)
            print("Ridge Coefficients:")
            print(feat_coef.head(10).to_string())
    except Exception as e:
        print("Could not compute feature importances:", e)
        
    # ── 9. Test Inference on Unseen Records ──
    print("\n[Test Inference Verify]")
    test_sample = X_test.head(3).copy()
    print("Input samples:")
    print(test_sample.to_string())
    
    pred_scores = best_pipeline.predict(test_sample)
    print("\nPredicted Hotspot Scores:")
    for idx, (idx_lbl, row) in enumerate(test_sample.iterrows()):
        print(f"  - {row['state_name']} | {row['vehicle_type']} -> Predicted Score: {pred_scores[idx]:.1f} / 100")

if __name__ == "__main__":
    run_pipeline()
