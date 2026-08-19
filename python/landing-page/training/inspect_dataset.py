"""
Phase 1: Download Kaggle dataset and perform thorough inspection.
DO NOT train anything yet. Only inspect and report.
"""
import kagglehub
import pandas as pd
import os
import sys

# ── Step 1: Download Dataset ──
print("=" * 70)
print("PHASE 1: DATASET DOWNLOAD & INSPECTION")
print("=" * 70)

print("\n[1/8] Downloading dataset from Kaggle...")
path = kagglehub.dataset_download("athlawange/ev-charging")
print(f"  ✓ Dataset downloaded to: {path}")

# ── Step 2: Discover files ──
print("\n[2/8] Discovering files...")
all_files = []
for root, dirs, files in os.walk(path):
    for f in files:
        fp = os.path.join(root, f)
        size_mb = os.path.getsize(fp) / (1024 * 1024)
        all_files.append((fp, f, size_mb))
        print(f"  • {f:50s} {size_mb:>8.2f} MB")

if not all_files:
    print("  ✗ ERROR: No files found in dataset!")
    sys.exit(1)

# ── Step 3: Load and inspect each CSV/Excel file ──
print("\n[3/8] Loading and inspecting each file...")
print("─" * 70)

dataframes = {}
for fp, fname, size_mb in all_files:
    ext = os.path.splitext(fname)[1].lower()
    if ext in ['.csv', '.tsv']:
        try:
            df = pd.read_csv(fp, low_memory=False)
            dataframes[fname] = df
        except Exception as e:
            print(f"  ✗ Error loading {fname}: {e}")
    elif ext in ['.xlsx', '.xls']:
        try:
            df = pd.read_excel(fp)
            dataframes[fname] = df
        except Exception as e:
            print(f"  ✗ Error loading {fname}: {e}")
    elif ext == '.json':
        try:
            df = pd.read_json(fp)
            dataframes[fname] = df
        except Exception as e:
            print(f"  ✗ Error loading {fname}: {e}")
    else:
        print(f"  → Skipping non-tabular file: {fname}")

for fname, df in dataframes.items():
    print(f"\n{'═' * 70}")
    print(f"FILE: {fname}")
    print(f"{'═' * 70}")
    
    print(f"\n  Shape: {df.shape[0]:,} rows × {df.shape[1]} columns")
    
    # ── All column names ──
    print(f"\n  ALL COLUMNS ({df.shape[1]}):")
    for i, col in enumerate(df.columns):
        print(f"    [{i:>3}] {col}")
    
    # ── Data types ──
    print(f"\n  DATA TYPES:")
    for col in df.columns:
        print(f"    {col:45s} → {df[col].dtype}")
    
    # ── Missing values ──
    print(f"\n  MISSING VALUES:")
    missing = df.isnull().sum()
    missing_pct = (df.isnull().sum() / len(df) * 100)
    has_missing = False
    for col in df.columns:
        if missing[col] > 0:
            has_missing = True
            print(f"    {col:45s} → {missing[col]:>8,} missing ({missing_pct[col]:.2f}%)")
    if not has_missing:
        print(f"    ✓ No missing values")
    
    # ── Duplicates ──
    n_dups = df.duplicated().sum()
    print(f"\n  DUPLICATE ROWS: {n_dups:,} ({n_dups/len(df)*100:.2f}%)")
    
    # ── Categorize columns ──
    categorical_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
    numerical_cols = df.select_dtypes(include=['int64', 'int32', 'float64', 'float32']).columns.tolist()
    bool_cols = df.select_dtypes(include=['bool']).columns.tolist()
    
    print(f"\n  CATEGORICAL COLUMNS ({len(categorical_cols)}):")
    for col in categorical_cols:
        nunique = df[col].nunique()
        top_vals = df[col].value_counts().head(5)
        print(f"    {col:45s} → {nunique:>5} unique values")
        for val, cnt in top_vals.items():
            print(f"      • {str(val)[:50]:50s} {cnt:>8,} ({cnt/len(df)*100:.1f}%)")
    
    print(f"\n  NUMERICAL COLUMNS ({len(numerical_cols)}):")
    for col in numerical_cols:
        desc = df[col].describe()
        print(f"    {col:45s} → min={desc['min']:.4g}, max={desc['max']:.4g}, mean={desc['mean']:.4g}, std={desc['std']:.4g}")
    
    if bool_cols:
        print(f"\n  BOOLEAN COLUMNS ({len(bool_cols)}):")
        for col in bool_cols:
            print(f"    {col:45s} → True: {df[col].sum()}, False: {(~df[col]).sum()}")
    
    # ── Geographic columns ──
    print(f"\n  GEOGRAPHIC COLUMN DETECTION:")
    geo_candidates = []
    for col in df.columns:
        col_lower = col.lower()
        if any(kw in col_lower for kw in ['lat', 'lng', 'lon', 'longitude', 'latitude', 'location', 'geo', 'coord', 'city', 'state', 'country', 'address', 'pin', 'zip', 'area', 'region', 'district']):
            geo_candidates.append(col)
            print(f"    ✓ {col:45s} (keyword match)")
    if not geo_candidates:
        print(f"    ✗ No obvious geographic columns detected by keyword")
    
    # ── Charging station info columns ──
    print(f"\n  CHARGING STATION COLUMN DETECTION:")
    charging_candidates = []
    for col in df.columns:
        col_lower = col.lower()
        if any(kw in col_lower for kw in ['charg', 'station', 'connector', 'power', 'kw', 'kwh', 'port', 'plug', 'evse', 'level', 'dc', 'ac', 'fast', 'slow', 'speed']):
            charging_candidates.append(col)
            print(f"    ✓ {col:45s}")
    if not charging_candidates:
        print(f"    ✗ No obvious charging station columns detected by keyword")
    
    # ── Demand/usage columns ──
    print(f"\n  DEMAND/USAGE COLUMN DETECTION:")
    demand_candidates = []
    for col in df.columns:
        col_lower = col.lower()
        if any(kw in col_lower for kw in ['demand', 'usage', 'session', 'utiliz', 'traffic', 'volume', 'count', 'frequency', 'consumption', 'energy', 'revenue', 'cost', 'price', 'fee', 'rating', 'review', 'score']):
            demand_candidates.append(col)
            print(f"    ✓ {col:45s}")
    if not demand_candidates:
        print(f"    ✗ No obvious demand/usage columns detected by keyword")
    
    # ── Vehicle columns ──
    print(f"\n  VEHICLE COLUMN DETECTION:")
    vehicle_candidates = []
    for col in df.columns:
        col_lower = col.lower()
        if any(kw in col_lower for kw in ['vehicle', 'car', 'ev', 'electric', 'two-wheeler', 'four-wheeler', '2w', '4w', 'bike', 'scooter', 'auto', 'bus', 'truck', 'fleet']):
            vehicle_candidates.append(col)
            print(f"    ✓ {col:45s}")
    if not vehicle_candidates:
        print(f"    ✗ No obvious vehicle columns detected by keyword")
    
    # ── Target/label columns ──
    print(f"\n  TARGET/LABEL COLUMN DETECTION:")
    target_candidates = []
    for col in df.columns:
        col_lower = col.lower()
        if any(kw in col_lower for kw in ['target', 'label', 'class', 'category', 'output', 'result', 'predict', 'hotspot', 'suitable', 'potential', 'recommend', 'rank', 'priority', 'y_', 'is_']):
            target_candidates.append(col)
            print(f"    ✓ {col:45s}")
    if not target_candidates:
        print(f"    ✗ No obvious target/label columns detected by keyword")
    
    # ── Data leakage risks ──
    print(f"\n  DATA LEAKAGE RISK COLUMNS:")
    leakage_candidates = []
    for col in df.columns:
        col_lower = col.lower()
        if any(kw in col_lower for kw in ['id', 'uuid', 'index', 'timestamp', 'created', 'updated', 'date_added', 'record_id']):
            leakage_candidates.append(col)
            print(f"    ⚠ {col:45s} (potential leakage / non-feature)")
    if not leakage_candidates:
        print(f"    ✓ No obvious leakage columns detected")
    
    # ── First 5 rows ──
    print(f"\n  FIRST 5 ROWS (head):")
    print(df.head().to_string(max_colwidth=40))
    
    # ── Last 5 rows ──
    print(f"\n  LAST 5 ROWS (tail):")
    print(df.tail().to_string(max_colwidth=40))
    
    # ── Basic statistics ──
    print(f"\n  NUMERICAL SUMMARY STATISTICS:")
    print(df.describe().to_string())

print("\n" + "=" * 70)
print("INSPECTION COMPLETE")
print("=" * 70)
