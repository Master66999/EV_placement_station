import os

with open('landing.html', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

content = content.replace('evision_india_authentication/code.html?mode=register', 'register.html')
content = content.replace('index.html?module=auth&mode=register', 'register.html')
content = content.replace('index.html?module=gis', 'hotspots.html')
content = content.replace('evision_india_elite_ai_dashboard/code.html', 'hotspots.html')
content = content.replace('evision_india_demand_forecasting_non_overlapping_sidebar/code.html', 'hotspots.html')
content = content.replace('evision_india_bento_gis_dashboard/code.html', 'hotspots.html')
content = content.replace('evision_india_what_if_simulator/code.html', 'hotspots.html')
content = content.replace('evision_india_admin_panel/code.html', 'hotspots.html')
content = content.replace('index.html?module=site', 'hotspots.html')
content = content.replace('index.html?module=forecast', 'hotspots.html')
content = content.replace('index.html?module=simulator', 'hotspots.html')
content = content.replace('href=\"index.html\"', 'href=\"landing.html\"') 

with open('landing.html', 'w', encoding='utf-8') as f:
    f.write(content)

with open('register.html', 'r', encoding='utf-8', errors='ignore') as f:
    reg_content = f.read()

reg_content = reg_content.replace('href=\"index.html\"', 'href=\"landing.html\"')

with open('register.html', 'w', encoding='utf-8') as f:
    f.write(reg_content)

print('Done!')
