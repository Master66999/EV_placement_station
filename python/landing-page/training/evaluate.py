"""
Model evaluation module for EV Charging Station Intelligence.
Computes standard regression metrics.
"""
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import numpy as np

def evaluate_regression_model(y_true, y_pred, model_name="Model"):
    mae = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    r2 = r2_score(y_true, y_pred)
    
    print(f"\n[{model_name} Evaluation]")
    print(f"  Mean Absolute Error (MAE)  : {mae:.4f}")
    print(f"  Root Mean Squared Error (RMSE): {rmse:.4f}")
    print(f"  R² Coefficient of Determination: {r2:.4f}")
    
    return {"MAE": mae, "RMSE": rmse, "R2": r2}
