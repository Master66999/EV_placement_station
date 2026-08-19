import urllib.request
import json

def test_api(url, data_dict=None, method="GET"):
    data = None
    if data_dict is not None:
        data = json.dumps(data_dict).encode("utf-8")
        
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"} if data_dict else {},
        method=method
    )
    
    try:
        with urllib.request.urlopen(req) as res:
            response_data = json.loads(res.read().decode("utf-8"))
            print(f"\n[TEST PASSED] {method} {url}")
            if "stations" in response_data:
                print(f"  Stations count: {len(response_data['stations'])}")
                if len(response_data['stations']) > 0:
                    print(f"  First station: {response_data['stations'][0]['station_name']} | Operator: {response_data['stations'][0]['operator']}")
            elif "hotspot_score" in response_data:
                print(f"  Business Predictions:")
                print(f"    Hotspot Score: {response_data['hotspot_score']}")
                print(f"    ROI: {response_data['roi']}% | Payback: {response_data['payback']} months")
                print(f"    Revenue: INR {response_data['revenue']} | Profit: INR {response_data['profit']}")
            elif "hotspots" in response_data:
                print(f"  Hotspots count: {len(response_data['hotspots'])}")
                if len(response_data['hotspots']) > 0:
                    print(f"  First hotspot: {response_data['hotspots'][0]['name']} | Score: {response_data['hotspots'][0]['roi']}")
    except Exception as e:
        print(f"\n[TEST FAILED] {method} {url}")
        print(f"Error: {e}")

print("========================================")
print("VERIFYING FULL EVISION INTEGRATION")
print("========================================")

# Test 1: Get Pune Stations
test_api("http://localhost:8000/api/stations?city=Pune", method="GET")

# Test 2: Hotspot Prediction for Pune (Both)
test_api("http://localhost:8000/api/hotspots/predict", {
    "location": "Pune",
    "vehicle_type": "Both"
}, method="POST")

# Test 3: Business Prediction for Pune
test_api("http://localhost:8000/api/business/predict", {
    "latitude": 18.5312,
    "longitude": 73.8726,
    "area": "Pune MH12",
    "vehicle_type": "Both",
    "charger_type": "Combined DC Fast (15 kW + 50 kW)",
    "points": 4,
    "budget": 1200000
}, method="POST")
