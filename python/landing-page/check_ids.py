import re
content = open('hotspots.html', 'r', encoding='utf-8').read()
ids = re.findall(r'id=[\'\"]([^\'\"]+)[\'\"]', content)
required = ['loading-overlay', 'loading-msg', 'btn-continue', 'stat-hotspots', 'stat-stations', 'stat-avg-roi', 'results-city-title', 'step-1-section', 'step-2-section', 'step2-dot', 'hotspots-list', 'hotspot-map', 'step1-dot', 'location-input', 'location-suggestions']
missing = [i for i in required if i not in ids]
print('Missing:', missing)
