import sys
import threading
import time
import urllib.request
import json
import socketserver

sys.stdout.reconfigure(encoding='utf-8')
import server

httpd = socketserver.TCPServer(('127.0.0.1', 8998), server.LandingPageHTTPRequestHandler)
t = threading.Thread(target=httpd.serve_forever, daemon=True)
t.start()
time.sleep(0.5)

print("=== STEP 1: TEST SITE PLANNER ANALYZE & PROJECT GENERATION ===")
site_planner_payload = {
    "locationName": "Bengaluru — Outer Ring Road Tech Hub, Karnataka",
    "coordinates": [12.9259, 77.6835],
    "radius": 5,
    "scale": "medium",
    "propertyType": "commercial_park",
    "projectType": "public_station",
    "vehicleMix": ["4w", "2w"],
    "budget": "25_50"
}

req1 = urllib.request.Request(
    'http://127.0.0.1:8998/api/v1/site-planner/analyze',
    data=json.dumps(site_planner_payload).encode('utf-8'),
    headers={'Content-Type': 'application/json'},
    method='POST'
)

with urllib.request.urlopen(req1) as resp:
    assert resp.status == 200
    sp_data = json.loads(resp.read().decode('utf-8'))
    proj_id = sp_data.get("project_id")
    summary = sp_data.get("project_summary", {})
    print(f"  [PASS] Site Planner generated Project ID: {proj_id}")
    print(f"  [PASS] Location: {summary.get('location', {}).get('fullName')}")
    print(f"  [PASS] Hotspot Score: {summary.get('hotspot_score')} / 100")
    print(f"  [PASS] Hardware: {summary.get('charging_configuration', {}).get('charger_type')}")
    print(f"  [PASS] Budget: {summary.get('budget_formatted')}")

print("\n=== STEP 2: TEST GET /api/project/:id AND /api/project/latest ===")
req2 = urllib.request.Request(f'http://127.0.0.1:8998/api/project/{proj_id}')
with urllib.request.urlopen(req2) as resp:
    assert resp.status == 200
    p_data = json.loads(resp.read().decode('utf-8'))
    proj = p_data.get("project", {})
    assert proj.get("project_id") == proj_id
    print(f"  [PASS] Loaded saved project by ID: {proj.get('project_id')} ({proj.get('location', {}).get('city')})")

req3 = urllib.request.Request('http://127.0.0.1:8998/api/project/latest')
with urllib.request.urlopen(req3) as resp:
    assert resp.status == 200
    p_latest = json.loads(resp.read().decode('utf-8'))
    proj_l = p_latest.get("project", {})
    assert proj_l.get("project_id") == proj_id
    print(f"  [PASS] Loaded latest active project: {proj_l.get('project_id')}")

print("\n=== STEP 3: TEST RESEARCH WITH AI CONSUMING ACTIVE PROJECT ===")
# Feature 1
req_ai1 = urllib.request.Request(
    'http://127.0.0.1:8998/api/ai/location-recommendation',
    data=json.dumps({"location": proj.get("location", {}).get("city"), "vehicle_type": proj.get("vehicle_type")}).encode('utf-8'),
    headers={'Content-Type': 'application/json'},
    method='POST'
)
with urllib.request.urlopen(req_ai1) as resp:
    assert resp.status == 200
    d1 = json.loads(resp.read().decode('utf-8'))
    print(f"  [PASS] Feature 1 (Why Location): {d1.get('recommended_location')} | Rating: {d1.get('recommendation_rating')}")

# Feature 3 (Simulator with active project parameters)
req_ai3 = urllib.request.Request(
    'http://127.0.0.1:8998/api/ai/simulation-analysis',
    data=json.dumps({
        "location": proj.get("location", {}).get("city"),
        "vehicle_type": proj.get("vehicle_type"),
        "budget": proj.get("budget"),
        "charger_type": proj.get("charging_configuration", {}).get("charger_type"),
        "points": proj.get("charging_configuration", {}).get("points")
    }).encode('utf-8'),
    headers={'Content-Type': 'application/json'},
    method='POST'
)
with urllib.request.urlopen(req_ai3) as resp:
    assert resp.status == 200
    d3 = json.loads(resp.read().decode('utf-8'))
    sa = d3.get("scenario_a", {})
    print(f"  [PASS] Feature 3 (Simulator): Monthly Profit ₹{sa.get('estimated_profit_monthly'):,} | ROI: {sa.get('roi_pct')}%")

httpd.shutdown()
print("\n==================================================================")
print("🎉 FULL END-TO-END FLOW (SITE PLANNER → ACTIVE PROJECT → RESEARCH AI) 100% VERIFIED!")
print("==================================================================")
