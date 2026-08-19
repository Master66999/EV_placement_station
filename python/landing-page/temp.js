
    // â”€â”€ State â”€â”€
    const API_BASE = window.location.origin;
    let selectedVehicle = null;
    let selectedCity = 'Bengaluru';
    let activeHotspotIndex = null;
    let map = null;
    let markers = [];
    let predictionHotspots = [];
    let existingStations = [];
    let selectedCandidate = null; // { lat, lng, name, score }
    let comparedLocations = []; // Array of { name, lat, lng, score, config, prediction }
    let currentView = 'list'; // 'list', 'config', 'result', 'compare'
    let predictionResult = null;
    let activeCandidateMarker = null;

    // â”€â”€ City suggestions â”€â”€
    const cities = [
      { name: 'Bengaluru', area: 'Karnataka', lat: 12.9716, lng: 77.5946 },
      { name: 'Mumbai', area: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
      { name: 'Delhi NCR', area: 'National Capital Region', lat: 28.6139, lng: 77.2090 },
      { name: 'Hyderabad', area: 'Telangana', lat: 17.3850, lng: 78.4867 },
      { name: 'Pune', area: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
      { name: 'Chennai', area: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
      { name: 'Ahmedabad', area: 'Gujarat', lat: 23.0225, lng: 72.5714 },
      { name: 'Jaipur', area: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
      { name: 'Lucknow', area: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
      { name: 'Kochi', area: 'Kerala', lat: 9.9312, lng: 76.2673 },
    ];

    // â”€â”€ Hotspot Data by City & Vehicle Type â”€â”€
    function getHotspotData(city, vehicleType) {
      const data = {
        'Bengaluru': {
          '2w': [
            {
              name: 'Koramangala 5th Block',
              area: 'Near Sony World Junction, Koramangala',
              lat: 12.9352, lng: 77.6245,
              roi: 9.2, payback: 11, revenue: 285000, sessions: 1840,
              tags: [
                { text: 'High EV density', type: 'green' },
                { text: 'No competitor within 1.5km', type: 'blue' },
                { text: 'Near tech parks', type: 'amber' }
              ],
              factors: { demand: 94, competition: 88, grid: 82, footfall: 96 }
            },
            {
              name: 'HSR Layout Sector 2',
              area: '27th Main Road, HSR Layout',
              lat: 12.9116, lng: 77.6474,
              roi: 8.7, payback: 14, revenue: 242000, sessions: 1620,
              tags: [
                { text: '12k+ daily 2W traffic', type: 'green' },
                { text: 'Residential density hub', type: 'blue' },
                { text: 'Metro proximity', type: 'amber' }
              ],
              factors: { demand: 88, competition: 84, grid: 78, footfall: 90 }
            },
            {
              name: 'Indiranagar 100ft Road',
              area: 'Defence Colony, Indiranagar',
              lat: 12.9784, lng: 77.6408,
              roi: 8.4, payback: 15, revenue: 228000, sessions: 1480,
              tags: [
                { text: 'Commercial corridor', type: 'green' },
                { text: 'High dwell time zone', type: 'blue' },
                { text: '6+ cafÃ©s nearby', type: 'amber' }
              ],
              factors: { demand: 86, competition: 72, grid: 88, footfall: 92 }
            },
            {
              name: 'Jayanagar 4th Block',
              area: 'Near Cool Joint Circle, Jayanagar',
              lat: 12.9256, lng: 77.5835,
              roi: 8.0, payback: 17, revenue: 208000, sessions: 1340,
              tags: [
                { text: 'Dense residential area', type: 'green' },
                { text: 'Weekend market footfall', type: 'amber' },
                { text: 'Grid-ready substation', type: 'blue' }
              ],
              factors: { demand: 82, competition: 78, grid: 90, footfall: 84 }
            },
            {
              name: 'Whitefield ITPL Main Road',
              area: 'Near ITPL Gate, Whitefield',
              lat: 12.9698, lng: 77.7499,
              roi: 7.6, payback: 19, revenue: 192000, sessions: 1180,
              tags: [
                { text: '40k+ IT workforce', type: 'green' },
                { text: 'Underserved zone', type: 'blue' },
                { text: 'Parking available', type: 'amber' }
              ],
              factors: { demand: 80, competition: 92, grid: 70, footfall: 76 }
            }
          ],
          '4w': [
            {
              name: 'Orion Mall, Rajajinagar',
              area: 'Dr. Rajkumar Road, Rajajinagar',
              lat: 12.9920, lng: 77.5570,
              roi: 9.0, payback: 16, revenue: 520000, sessions: 680,
              tags: [
                { text: 'Premium mall location', type: 'green' },
                { text: '3hr avg dwell time', type: 'amber' },
                { text: 'No DC fast within 3km', type: 'blue' }
              ],
              factors: { demand: 90, competition: 92, grid: 84, footfall: 88 }
            },
            {
              name: 'Electronic City Phase 1',
              area: 'Hosur Road, Electronic City',
              lat: 12.8399, lng: 77.6770,
              roi: 8.5, payback: 18, revenue: 465000, sessions: 580,
              tags: [
                { text: 'IT corridor anchor', type: 'green' },
                { text: 'Highway adjacency', type: 'blue' },
                { text: 'High EV ownership', type: 'amber' }
              ],
              factors: { demand: 86, competition: 80, grid: 90, footfall: 82 }
            },
            {
              name: 'Marathahalli Ring Road',
              area: 'Outer Ring Road, Marathahalli',
              lat: 12.9591, lng: 77.6974,
              roi: 8.2, payback: 19, revenue: 438000, sessions: 540,
              tags: [
                { text: 'Peak commuter traffic', type: 'green' },
                { text: 'Office park cluster', type: 'blue' },
                { text: 'Land available', type: 'amber' }
              ],
              factors: { demand: 84, competition: 76, grid: 82, footfall: 86 }
            },
            {
              name: 'Hebbal Flyover Junction',
              area: 'NH-44 Entry, Hebbal',
              lat: 13.0358, lng: 77.5970,
              roi: 7.8, payback: 21, revenue: 402000, sessions: 490,
              tags: [
                { text: 'Highway gateway', type: 'green' },
                { text: 'Intercity EV route', type: 'blue' },
                { text: '24/7 traffic flow', type: 'amber' }
              ],
              factors: { demand: 78, competition: 82, grid: 76, footfall: 80 }
            },
            {
              name: 'Sarjapur Road IT Hub',
              area: 'Near Wipro Corporate, Sarjapur',
              lat: 12.9100, lng: 77.6850,
              roi: 7.5, payback: 23, revenue: 378000, sessions: 450,
              tags: [
                { text: 'Emerging tech corridor', type: 'green' },
                { text: 'New residential boom', type: 'amber' },
                { text: 'Solar-ready rooftops', type: 'blue' }
              ],
              factors: { demand: 76, competition: 86, grid: 72, footfall: 74 }
            }
          ]
        }
      };

      // For cities not explicitly mapped, generate data based on Bengaluru template
      if (!data[city]) {
        const cityInfo = cities.find(c => c.name === city) || cities[0];
        const base = data['Bengaluru'][vehicleType];
        return base.map((h, i) => ({
          ...h,
          lat: cityInfo.lat + (Math.random() - 0.5) * 0.06,
          lng: cityInfo.lng + (Math.random() - 0.5) * 0.06,
          name: h.name.split(',')[0] + `, ${city}`,
        }));
      }

      return data[city][vehicleType];
    }

    // â”€â”€ Location Input â”€â”€
    const locationInput = document.getElementById('location-input');
    const suggestionsEl = document.getElementById('location-suggestions');

    locationInput.addEventListener('input', () => {
      const query = locationInput.value.toLowerCase().trim();
      if (query.length < 1) {
        suggestionsEl.classList.remove('visible');
        return;
      }

      const matches = cities.filter(c =>
        c.name.toLowerCase().includes(query) || c.area.toLowerCase().includes(query)
      );

      if (matches.length === 0) {
        suggestionsEl.classList.remove('visible');
        return;
      }

      suggestionsEl.innerHTML = matches.map(c => `
        <div class="suggestion-item" onclick="pickCity('${c.name}')">
          <span class="material-symbols-outlined">location_on</span>
          <div>
            <div style="font-weight:600">${c.name}</div>
            <div style="font-size:11px;color:var(--text-muted)">${c.area}</div>
          </div>
        </div>
      `).join('');
      suggestionsEl.classList.add('visible');
    });

    locationInput.addEventListener('blur', () => {
      setTimeout(() => suggestionsEl.classList.remove('visible'), 200);
    });

    function pickCity(name) {
      selectedCity = name;
      locationInput.value = name;
      suggestionsEl.classList.remove('visible');
    }

    function detectLocation() {
      const btn = document.getElementById('detect-location-btn');
      btn.innerHTML = '<span class="material-symbols-outlined" style="font-size:14px;animation:spin 0.8s linear infinite">sync</span> Detecting...';
      setTimeout(() => {
        selectedCity = 'Bengaluru';
        locationInput.value = 'Bengaluru';
        btn.innerHTML = '<span class="material-symbols-outlined" style="font-size:14px">check_circle</span> Detected';
        btn.style.color = 'var(--green)';
        btn.style.background = 'var(--green-light)';
        setTimeout(() => {
          btn.innerHTML = '<span class="material-symbols-outlined" style="font-size:14px">my_location</span> Detect';
          btn.style.color = '';
          btn.style.background = '';
        }, 2500);
      }, 1200);
    }

    function selectVehicle(type) {
      selectedVehicle = type;

      document.getElementById('card-2w').classList.toggle('selected', type === '2w');
      document.getElementById('card-4w').classList.toggle('selected', type === '4w');
      document.getElementById('card-both').classList.toggle('selected', type === 'both');

      document.getElementById('check-2w').style.display = type === '2w' ? 'inline' : 'none';
      document.getElementById('check-4w').style.display = type === '4w' ? 'inline' : 'none';
      document.getElementById('check-both').style.display = type === 'both' ? 'inline' : 'none';

      document.getElementById('btn-continue').disabled = false;
    }

    // â”€â”€ Step Navigation â”€â”€
    function goToStep2() {
      if (!selectedVehicle) return;

      if (!selectedCity || selectedCity.trim() === '') {
        selectedCity = locationInput.value || 'Bengaluru';
      }

      // Show loading
      const overlay = document.getElementById('loading-overlay');
      overlay.classList.remove('hidden');

      const loadingMsgs = [
        'Analyzing charging demand...',
        'Finding relevant RTOs...',
        'Calculating hotspot scores...'
      ];

      let msgIndex = 0;
      const loadingSubtext = document.getElementById('loading-subtext');
      const msgInterval = setInterval(() => {
        msgIndex++;
        if (msgIndex < loadingMsgs.length) {
          loadingSubtext.textContent = loadingMsgs[msgIndex];
        }
      }, 450);

      // Fetch existing stations, then hotspots predictions
      fetch(`${API_BASE}/api/stations?city=${encodeURIComponent(selectedCity)}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load existing stations.");
        return res.json();
      })
      .then(stationsData => {
        existingStations = stationsData.stations;
        
        return fetch(`${API_BASE}/api/hotspots/predict`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            location: selectedCity,
            vehicle_type: selectedVehicle === '2w' ? 'Two-Wheeler' : (selectedVehicle === '4w' ? 'Four-Wheeler' : 'Both')
          })
        });
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.error || 'Server error'); });
        }
        return response.json();
      })
      .then(data => {
        predictionHotspots = data.hotspots;
        showHotspotsList();
        
        clearInterval(msgInterval);
        overlay.classList.add('fade-out');

        // Update step indicators
        document.getElementById('step-dot-1').classList.remove('active');
        document.getElementById('step-dot-1').classList.add('completed');
        document.getElementById('step-dot-1').innerHTML = '<span class="material-symbols-outlined" style="font-size:16px">check</span>';
        document.getElementById('step-ind-1').classList.remove('active');

        document.getElementById('step-connector-1').classList.add('filled');

        document.getElementById('step-dot-2').classList.add('active');
        document.getElementById('step-ind-2').classList.add('active');

        // Update labels
        const vehicleLabel = selectedVehicle === '2w' ? 'Two-Wheeler' : (selectedVehicle === '4w' ? 'Four-Wheeler' : 'Both');
        document.getElementById('vehicle-type-label').textContent = vehicleLabel;
        document.getElementById('city-label').textContent = selectedCity;

        // Switch views
        document.getElementById('step-1-section').classList.add('hidden');
        document.getElementById('step-2-section').classList.remove('hidden');

        setTimeout(() => {
          overlay.classList.add('hidden');
          overlay.classList.remove('fade-out');
        }, 500);
      })
      .catch(error => {
        clearInterval(msgInterval);
        overlay.classList.add('hidden');
        alert("Unable to analyze this location. Please try another location.");
      });
    }

    function goBackToStep1() {
      // Reset step indicators
      document.getElementById('step-dot-1').classList.add('active');
      document.getElementById('step-dot-1').classList.remove('completed');
      document.getElementById('step-dot-1').innerHTML = '1';
      document.getElementById('step-ind-1').classList.add('active');

      document.getElementById('step-connector-1').classList.remove('filled');

      document.getElementById('step-dot-2').classList.remove('active');
      document.getElementById('step-ind-2').classList.remove('active');

      // Switch views
      document.getElementById('step-2-section').classList.add('hidden');
      document.getElementById('step-1-section').classList.remove('hidden');

      // Clean up map
      if (map) {
        map.remove();
        map = null;
      }
      markers = [];
    }

    // â”€â”€ Sort/Filter â”€â”€
    function setSort(btn) {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      renderHotspots(btn.dataset.sort);
    }

    // â”€â”€ Render Hotspots â”€â”€
    function renderHotspots(sortBy = 'roi') {
      const listEl = document.getElementById('hotspot-list');
      listEl.innerHTML = '';

      if (currentView === 'list') {
        let hotspots = [...predictionHotspots];
        if (sortBy === 'roi') hotspots.sort((a, b) => b.roi - a.roi);

        // Render header instructions
        const headerDiv = document.createElement('div');
        headerDiv.className = 'fe-view-header';
        headerDiv.style.marginBottom = '20px';
        headerDiv.innerHTML = `
          <h3 style="font-family: var(--font-heading); font-size: 18px; color: var(--text-primary);">Feasibility Opportunities</h3>
          <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">Click any recommended hotspot card below, click an existing station on the map, or click anywhere on the map to drop a candidate pin.</p>
        `;
        listEl.appendChild(headerDiv);

        hotspots.forEach((h, i) => {
          const rank = i + 1;
          const isRank1 = rank === 1;

          // Dynamic tags for demand classification & metadata
          const demandClass = h.demand;
          const tags = [
            `<span class="reason-tag ${demandClass === 'High' ? 'green' : demandClass === 'Medium' ? 'amber' : 'blue'}">
              <span class="material-symbols-outlined">analytics</span>
              Demand Class: ${demandClass}
            </span>`
          ];
          
          if (selectedVehicle === '2w') {
            tags.push(
              `<span class="reason-tag green">
                <span class="material-symbols-outlined">trending_up</span>
                High 2W Footfall
              </span>`
            );
          } else if (selectedVehicle === '4w') {
            tags.push(
              `<span class="reason-tag green">
                <span class="material-symbols-outlined">trending_up</span>
                Highway / Commercial
              </span>`
            );
          } else {
            tags.push(
              `<span class="reason-tag green">
                <span class="material-symbols-outlined">trending_up</span>
                Combined Mixed Fleets
              </span>`
            );
          }
          
          const tagsHTML = tags.join('');

          const card = document.createElement('div');
          card.className = `hotspot-card${isRank1 ? ' rank-1' : ''}`;
          card.dataset.index = i;
          card.style.animationDelay = `${i * 0.1}s`;

          card.innerHTML = `
            <div class="rank-badge">${isRank1 ? '#1 Recommended' : '#' + rank}</div>
            <div class="hotspot-card-top">
              <div>
                <div class="hotspot-location-name">${h.name}</div>
                <div class="hotspot-area">
                  <span class="material-symbols-outlined">pin_drop</span>
                  ${h.area}
                </div>
              </div>
              <div class="roi-score-block">
                <div class="roi-score-value" data-target="${h.roi}">0.0</div>
                <div class="roi-score-label">Hotspot Score / 100</div>
              </div>
            </div>

            <div class="reasoning-tags" style="margin-bottom: 14px;">${tagsHTML}</div>

            <div class="hotspot-card-actions" style="border-top: none; padding-top: 0;">
              <button class="btn-primary" style="flex: 1; justify-content: center;" onclick="event.stopPropagation(); showConfigForm(${h.coordinates.lat}, ${h.coordinates.lng}, '${h.name.replace(/'/g, "\\'")}', ${h.roi});">
                Select Location
                <span class="material-symbols-outlined" style="font-size:16px">check_circle</span>
              </button>
            </div>
          `;

          card.addEventListener('click', () => highlightHotspot(i));
          card.addEventListener('mouseenter', () => highlightHotspot(i));

          listEl.appendChild(card);
        });

        // Trigger animations
        requestAnimationFrame(() => {
          document.querySelectorAll('.hotspot-card').forEach((card, i) => {
            setTimeout(() => {
              card.classList.add('animate-in');
            }, i * 100);
          });
        });

        // Animate ROI numbers counting up after a short delay
        setTimeout(() => {
          document.querySelectorAll('.roi-score-value[data-target]').forEach(el => {
            animateNumber(el, 0, parseFloat(el.dataset.target), 1000, 1);
          });
        }, 300);

        // Init map with all markers
        initMap(hotspots);

      } else if (currentView === 'config') {
        const vehicleLabel = selectedVehicle === '2w' ? 'Two-Wheeler' : (selectedVehicle === '4w' ? 'Four-Wheeler' : 'Both');
        listEl.innerHTML = `
          <div class="fe-view-header" style="margin-bottom: 20px;">
            <h3 style="font-family: var(--font-heading); font-size: 18px; color: var(--text-primary); display: flex; align-items: center; gap: 6px;">
              <span class="material-symbols-outlined" style="color: var(--primary);">settings_suggest</span>
              Configure EV Station
            </h3>
            <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">Define station capacity and budget to calculate business forecasts.</p>
          </div>

          <div class="selected-location-banner" style="background: var(--primary-light); padding: 14px 16px; border-radius: var(--radius); margin-bottom: 20px; border-left: 4px solid var(--primary); box-shadow: var(--shadow-sm);">
            <div style="font-weight: 700; font-size: 14px; color: var(--text-primary);">${selectedCandidate.name}</div>
            <div style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono); margin-top: 2px;">Coords: ${selectedCandidate.lat.toFixed(4)}, ${selectedCandidate.lng.toFixed(4)}</div>
            <div style="font-size: 12px; font-weight: 600; color: var(--primary); margin-top: 6px;">Hotspot Score: ${selectedCandidate.score}/100</div>
          </div>

          <div class="config-form" style="display: flex; flex-direction: column; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 6px; color: var(--text-secondary);">Vehicle Type</label>
              <input type="text" class="location-search-input" value="${vehicleLabel}" disabled style="background: var(--surface-muted); color: var(--text-muted); cursor: not-allowed; padding-left: 16px;" />
            </div>

            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 6px; color: var(--text-secondary);">Charger Type</label>
              <select id="config-charger-type" class="location-search-input" style="padding-left: 16px; appearance: auto; background-image: none;">
                ${getChargerOptionsHTML(selectedVehicle)}
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 6px; color: var(--text-secondary);">Number of Charging Points</label>
              <select id="config-charger-points" class="location-search-input" style="padding-left: 16px; appearance: auto; background-image: none;">
                <option value="1">1 Charging Point</option>
                <option value="2" selected>2 Charging Points</option>
                <option value="4">4 Charging Points</option>
                <option value="6">6 Charging Points</option>
                <option value="8">8 Charging Points</option>
                <option value="10">10 Charging Points</option>
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 6px; color: var(--text-secondary);">Investment Budget (INR)</label>
              <input type="number" id="config-budget" class="location-search-input" value="500000" min="50000" max="10000000" style="padding-left: 16px;" />
            </div>

            <div style="display: flex; gap: 12px; margin-top: 10px;">
              <button class="btn-secondary" style="flex: 1; justify-content: center;" onclick="showHotspotsList()">Cancel</button>
              <button class="btn-primary" style="flex: 2; justify-content: center;" onclick="calculateBusinessProjections()">
                Calculate Projections
                <span class="material-symbols-outlined" style="font-size:16px">analytics</span>
              </button>
            </div>
          </div>
        `;

      } else if (currentView === 'result') {
        const pred = predictionResult;
        listEl.innerHTML = `
          <div class="fe-view-header" style="margin-bottom: 20px;">
            <h3 style="font-family: var(--font-heading); font-size: 18px; color: var(--text-primary); display: flex; align-items: center; gap: 6px;">
              <span class="material-symbols-outlined" style="color: var(--primary);">insights</span>
              Business Projections
            </h3>
            <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">Expected metrics for this specific candidate station location.</p>
          </div>

          <div class="selected-location-banner" style="background: var(--primary-light); padding: 14px 16px; border-radius: var(--radius); margin-bottom: 20px; border-left: 4px solid var(--primary); box-shadow: var(--shadow-sm);">
            <div style="font-weight: 700; font-size: 14px; color: var(--text-primary);">${selectedCandidate.name}</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Charger: ${selectedCandidate.charger_type} (${selectedCandidate.points} pts)</div>
            <div style="font-size: 12px; font-weight: 600; color: var(--primary); margin-top: 4px;">Hotspot Score: ${pred.hotspot_score}/100</div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
            <div style="background: var(--surface-card); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 12px; text-align: center; box-shadow: var(--shadow-sm);">
              <div style="font-size: 22px; font-weight: 800; color: var(--primary);">${pred.roi}%</div>
              <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px; font-weight:600;">Projected ROI</div>
            </div>
            <div style="background: var(--surface-card); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 12px; text-align: center; box-shadow: var(--shadow-sm);">
              <div style="font-size: 22px; font-weight: 800; color: var(--text-primary);">${pred.payback} mo</div>
              <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px; font-weight:600;">Payback Period</div>
            </div>
            <div style="background: var(--surface-card); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 12px; text-align: center; box-shadow: var(--shadow-sm);">
              <div style="font-size: 22px; font-weight: 800; color: var(--green);">&#8377;${pred.profit.toLocaleString('en-IN')}</div>
              <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px; font-weight:600;">Monthly Profit</div>
            </div>
            <div style="background: var(--surface-card); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 12px; text-align: center; box-shadow: var(--shadow-sm);">
              <div style="font-size: 22px; font-weight: 800; color: var(--text-primary);">${pred.utilization}%</div>
              <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px; font-weight:600;">Est. Utilization</div>
            </div>
          </div>

          <div style="background: var(--surface-card); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 16px; margin-bottom: 20px; box-shadow: var(--shadow-sm);">
            <h4 style="font-size: 13px; font-weight: 600; margin-bottom: 12px; color: var(--text-primary);">Metric Estimations</h4>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div style="display: flex; justify-content: space-between; font-size: 13px;">
                <span style="color: var(--text-secondary);">Monthly Sessions:</span>
                <span style="font-weight: 600;">${pred.sessions.toLocaleString('en-IN')}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 13px;">
                <span style="color: var(--text-secondary);">Energy Delivered:</span>
                <span style="font-weight: 600;">${pred.energy.toLocaleString('en-IN')} kWh</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 13px;">
                <span style="color: var(--text-secondary);">Gross Monthly Revenue:</span>
                <span style="font-weight: 600;">&#8377;${pred.revenue.toLocaleString('en-IN')}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 13px;">
                <span style="color: var(--text-secondary);">Operating Costs:</span>
                <span style="font-weight: 600; color: var(--red);">&#8377;${pred.op_cost.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <p style="font-size: 10px; color: var(--text-muted); margin-top: 14px; text-align: center; font-style: italic;">*Calculated based on standard charging pricing and local RTO registration parameters.</p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px;">
            <button class="btn-primary" style="justify-content: center;" onclick="triggerAddToComparison()">
              <span class="material-symbols-outlined" style="font-size:16px">compare_arrows</span>
              Add to Comparison
            </button>
            <div style="display: flex; gap: 10px;">
              <button class="btn-secondary" style="flex: 1; justify-content: center;" onclick="showConfigForm(selectedCandidate.lat, selectedCandidate.lng, '${selectedCandidate.name.replace(/'/g, "\\'")}', selectedCandidate.score)">Configure</button>
              <button class="btn-secondary" style="flex: 1; justify-content: center;" onclick="showHotspotsList()">Select Another</button>
            </div>
          </div>
        `;

      } else if (currentView === 'compare') {
        listEl.innerHTML = `
          <div class="fe-view-header" style="margin-bottom: 20px;">
            <h3 style="font-family: var(--font-heading); font-size: 18px; color: var(--text-primary); display: flex; align-items: center; gap: 6px;">
              <span class="material-symbols-outlined" style="color: var(--primary);">compare_arrows</span>
              Compare Candidates
            </h3>
            <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">Review business capacity and demand gap side-by-side.</p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px;">
            ${renderComparisonCardsHTML()}
          </div>

          ${renderRecommendationHTML()}

          <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button class="btn-secondary" style="flex: 1; justify-content: center;" onclick="clearComparison()">Clear</button>
            <button class="btn-primary" style="flex: 2; justify-content: center;" onclick="showHotspotsList()">
              <span class="material-symbols-outlined" style="font-size:16px">add_location_alt</span>
              Compare Another
            </button>
          </div>
        `;
      }
    }

    function getChargerOptionsHTML(vehicleType) {
      if (vehicleType === '2w') {
        return `
          <option value="AC Slow Charger (3.3 kW)">AC Slow Charger (3.3 kW)</option>
          <option value="DC Fast Charger (15 kW)">DC Fast Charger (15 kW)</option>
        `;
      } else if (vehicleType === '4w') {
        return `
          <option value="AC Type 2 (22 kW)">AC Type 2 (22 kW)</option>
          <option value="DC CCS2 Fast (50 kW)">DC CCS2 Fast (50 kW)</option>
          <option value="DC CCS2 Ultra-Fast (120 kW)">DC CCS2 Ultra-Fast (120 kW)</option>
        `;
      } else {
        return `
          <option value="Combined AC (3.3 kW + 22 kW)">Combined AC (3.3 kW + 22 kW)</option>
          <option value="Combined DC Fast (15 kW + 50 kW)">Combined DC Fast (15 kW + 50 kW)</option>
        `;
      }
    }

    function showHotspotsList() {
      currentView = 'list';
      selectedCandidate = null;
      predictionResult = null;
      renderHotspots();
    }

    function showConfigForm(lat, lng, name, score) {
      currentView = 'config';
      selectedCandidate = { lat, lng, name, score };
      renderHotspots();
      
      // Plot candidate on map
      if (activeCandidateMarker) {
        map.removeLayer(activeCandidateMarker);
      }
      const icon = L.divIcon({
        className: 'custom-map-marker-candidate',
        html: `<div class="map-pin-candidate"><span class="material-symbols-outlined" style="font-size:14px;color:white;">pin_drop</span></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -34],
      });
      activeCandidateMarker = L.marker([lat, lng], { icon }).addTo(map)
        .bindPopup(`<strong>${name}</strong><br>Candidate Location Selected`, { closeButton: false })
        .openPopup();
    }

    function calculateBusinessProjections() {
      const charger_type = document.getElementById('config-charger-type').value;
      const points = parseInt(document.getElementById('config-charger-points').value);
      const budget = parseFloat(document.getElementById('config-budget').value);

      const overlay = document.getElementById('loading-overlay');
      overlay.classList.remove('hidden');
      const loadingSubtext = document.getElementById('loading-subtext');
      loadingSubtext.textContent = 'Calculating business forecasts...';

      fetch(`${API_BASE}/api/business/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          latitude: selectedCandidate.lat,
          longitude: selectedCandidate.lng,
          area: selectedCandidate.name,
          vehicle_type: selectedVehicle === '2w' ? 'Two-Wheeler' : (selectedVehicle === '4w' ? 'Four-Wheeler' : 'Both'),
          charger_type: charger_type,
          points: points,
          budget: budget
        })
      })
      .then(res => {
        if (!res.ok) throw new Error("Calculation failed");
        return res.json();
      })
      .then(data => {
        predictionResult = data;
        selectedCandidate.charger_type = charger_type;
        selectedCandidate.points = points;
        selectedCandidate.budget = budget;
        
        currentView = 'result';
        overlay.classList.add('hidden');
        renderHotspots();
      })
      .catch(err => {
        overlay.classList.add('hidden');
        alert("Projections failed. Please check inputs.");
      });
    }

    function triggerAddToComparison() {
      if (!predictionResult) return;
      comparedLocations.push({
        name: selectedCandidate.name,
        lat: selectedCandidate.lat,
        lng: selectedCandidate.lng,
        score: predictionResult.hotspot_score,
        config: {
          charger_type: selectedCandidate.charger_type,
          points: selectedCandidate.points,
          budget: selectedCandidate.budget
        },
        prediction: predictionResult
      });
      currentView = 'compare';
      renderHotspots();
    }

    function clearComparison() {
      comparedLocations = [];
      showHotspotsList();
    }

    function renderComparisonCardsHTML() {
      return comparedLocations.map((loc, idx) => `
        <div style="background: var(--surface-card); border: 2px solid ${idx === 0 ? 'var(--primary)' : 'var(--border)'}; border-radius: var(--radius-lg); padding: 16px; position: relative; box-shadow: var(--shadow-sm);">
          <div style="position: absolute; top: 12px; right: 12px; background: ${idx === 0 ? 'var(--primary)' : 'var(--border)'}; color: ${idx === 0 ? 'white' : 'var(--text-secondary)'}; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">
            Location ${String.fromCharCode(65 + idx)}
          </div>
          <div style="font-weight: 700; font-size: 14px; color: var(--text-primary); margin-bottom: 10px; padding-right: 60px;">${loc.name}</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; line-height:1.4;">
            <div><span style="color:var(--text-secondary)">Hotspot Score:</span> <strong style="color:var(--primary); font-family:var(--font-mono);">${loc.score}/100</strong></div>
            <div><span style="color:var(--text-secondary)">Projected ROI:</span> <strong style="font-family:var(--font-mono);">${loc.prediction.roi}%</strong></div>
            <div><span style="color:var(--text-secondary)">Monthly Profit:</span> <strong style="color:var(--green); font-family:var(--font-mono);">&#8377;${loc.prediction.profit.toLocaleString('en-IN')}</strong></div>
            <div><span style="color:var(--text-secondary)">Payback Period:</span> <strong style="font-family:var(--font-mono);">${loc.prediction.payback} mo</strong></div>
            <div><span style="color:var(--text-secondary)">Est. Utilization:</span> <strong style="font-family:var(--font-mono);">${loc.prediction.utilization}%</strong></div>
            <div><span style="color:var(--text-secondary)">Charger Type:</span> <strong>${loc.config.charger_type.split(' (')[0]}</strong></div>
          </div>
        </div>
      `).join('');
    }

    function renderRecommendationHTML() {
      if (comparedLocations.length < 2) return '';
      
      let scored = comparedLocations.map((loc, idx) => {
        let nearby = existingStations.filter(s => {
          if (!s.latitude || !s.longitude) return false;
          let dist = Math.sqrt(Math.pow(s.latitude - loc.lat, 2) + Math.pow(s.longitude - loc.lng, 2));
          return dist < 0.05;
        }).length;
        
        let gapScore = Math.max(0, 100 - (nearby * 10));
        let combScore = (loc.score * 0.3) + (loc.prediction.roi * 0.3) + (gapScore * 0.4);
        
        return { loc, idx, combScore, nearby, gapScore };
      });
      
      scored.sort((a, b) => b.combScore - a.combScore);
      let best = scored[0];
      
      return `
        <div style="background: var(--green-light); border: 2.5px solid var(--green); border-radius: var(--radius-lg); padding: 18px; margin-top: 16px; box-shadow: var(--shadow-sm);">
          <div style="display: flex; align-items: center; gap: 8px; color: var(--green); font-weight: 700; margin-bottom: 8px; font-family: var(--font-heading);">
            <span class="material-symbols-outlined">stars</span>
            <span>Solaris Recommendation</span>
          </div>
          <div style="font-size: 14px; font-weight: 700; color: var(--text-primary);">
            Location ${String.fromCharCode(65 + best.idx)} is the Optimal Choice
          </div>
          <p style="font-size: 12px; color: var(--text-secondary); margin-top: 6px; line-height: 1.5;">
            Location ${String.fromCharCode(65 + best.idx)} (${best.loc.name}) provides the best balance. It features a strong **Hotspot Feasibility Score of ${best.loc.score}/100**, an estimated **ROI of ${best.loc.prediction.roi}%**, and only **${best.nearby} existing stations** in the vicinity, maximizing the market capture potential.
          </p>
        </div>
      `;
    }

    // â”€â”€ Number Animation â”€â”€
    function animateNumber(el, start, end, duration, decimals) {
      const startTime = performance.now();
      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = start + (end - start) * eased;
        el.textContent = current.toFixed(decimals);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = end.toFixed(decimals);
      }
      requestAnimationFrame(update);
    }

    // â”€â”€ Highlight Hotspot (sync list + map) â”€â”€
    function highlightHotspot(index) {
      if (activeHotspotIndex === index) return;
      activeHotspotIndex = index;

      // Highlight card
      document.querySelectorAll('.hotspot-card').forEach((c, i) => {
        c.classList.toggle('active', i === index);
      });

      // Highlight map marker
      markers.forEach((m, i) => {
        const pinEl = m.getElement();
        if (pinEl) {
          const pin = pinEl.querySelector('.map-pin');
          if (pin) {
            pin.classList.toggle('active-pin', i === index);
          }
        }
        if (i === index) {
          m.openPopup();
        }
      });
    }

    // â”€â”€ Map â”€â”€
    function initMap(hotspots) {
      if (map) {
        map.remove();
        map = null;
      }
      markers = [];
      activeCandidateMarker = null;

      const cityInfo = cities.find(c => c.name === selectedCity) || cities[0];
      map = L.map('hotspot-map', {
        zoomControl: false,
        scrollWheelZoom: true,
      }).setView([cityInfo.lat, cityInfo.lng], 12);

      L.control.zoom({ position: 'topright' }).addTo(map);

      // OSM tiles with a clean style
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      const bounds = [];

      // 1. Plot existing stations (Blue markers)
      existingStations.forEach((s) => {
        if (!s.latitude || !s.longitude) return;
        
        const icon = L.divIcon({
          className: 'custom-map-marker-existing',
          html: `<div class="map-pin-existing"><span class="material-symbols-outlined" style="font-size:12px;color:white;margin-top:2px;">electric_car</span></div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 28],
          popupAnchor: [0, -30],
        });
        
        const popupContent = `
          <div class="map-tooltip">
            <div class="map-tooltip-name" style="color:#2563eb;">${s.station_name}</div>
            <div class="map-tooltip-area" style="font-size:11px;">${s.address}</div>
            <div class="map-tooltip-metrics" style="grid-template-columns:1fr; margin-top:8px;">
              <div style="font-size:11px; text-align:left; line-height:1.4;">
                <div><strong>Operator:</strong> ${s.operator}</div>
                <div><strong>Charger Type:</strong> ${s.charging_levels || 'Level 2 / 3'}</div>
                <div><strong>Points / Power:</strong> ${s.number_of_points} pts | ${s.max_power_kw ? s.max_power_kw + 'kW' : 'N/A'}</div>
              </div>
            </div>
            <button class="btn-primary" style="font-size:10px; padding:4px 8px; margin-top:8px; width:100%; justify-content:center;" onclick="showConfigForm(${s.latitude}, ${s.longitude}, '${s.station_name.replace(/'/g, "\\'")}', 50.0)">
              Select Candidate Location
            </button>
          </div>
        `;
        
        L.marker([s.latitude, s.longitude], { icon })
          .bindPopup(popupContent, { maxWidth: 240 })
          .addTo(map);
          
        bounds.push([s.latitude, s.longitude]);
      });

      // 2. Plot hotspots (Orange markers)
      hotspots.forEach((h, i) => {
        const rank = i + 1;
        let lat = h.coordinates ? h.coordinates.lat : null;
        let lng = h.coordinates ? h.coordinates.lng : null;
        if (lat === null || lng === null) return;

        const icon = L.divIcon({
          className: 'custom-map-marker',
          html: `<div class="map-pin${i === 0 ? ' active-pin' : ''}"><span class="map-pin-rank">${rank}</span></div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -38],
        });

        const popupContent = `
          <div class="map-tooltip">
            <div class="map-tooltip-name">#${rank} Recommended Hotspot</div>
            <div class="map-tooltip-area">${h.name} (${h.area})</div>
            <div class="map-tooltip-metrics" style="grid-template-columns:1fr; margin-top:8px;">
              <div style="display:flex; justify-content:space-between; font-size:12px;">
                <span>Hotspot Feasibility Score:</span>
                <strong>${h.roi}/100</strong>
              </div>
            </div>
            <button class="btn-primary" style="font-size:10px; padding:4px 8px; margin-top:8px; width:100%; justify-content:center;" onclick="showConfigForm(${lat}, ${lng}, '${h.name.replace(/'/g, "\\'")}', ${h.roi})">
              Select Candidate Location
            </button>
          </div>
        `;

        const marker = L.marker([lat, lng], { icon })
          .bindPopup(popupContent, { maxWidth: 240 })
          .addTo(map);

        marker.on('click', () => highlightHotspot(i));

        markers.push(marker);
        bounds.push([lat, lng]);
      });

      // 3. Bind map click to drop candidate pin
      map.on('click', (e) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        showConfigForm(lat, lng, `Custom Site (${lat.toFixed(4)}, ${lng.toFixed(4)})`, 50.0);
      });

      // Fit map to all markers
      if (bounds.length) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }

      // Open first popup by default
      if (markers.length > 0) {
        setTimeout(() => markers[0].openPopup(), 600);
      }

    // â”€â”€ Initialize â”€â”€
    // Set default city from localStorage if available
    (function init() {
      const projectData = localStorage.getItem('evision_onboarding_project');
      if (projectData) {
        try {
          const data = JSON.parse(projectData);
          if (data.city) {
            selectedCity = data.city;
            locationInput.value = data.city;
          }
          if (data.name) {
            const firstName = data.name.split(' ')[0];
            const lastName = data.name.split(' ').pop();
            document.getElementById('user-name-display').textContent = `${firstName} ${lastName.charAt(0)}.`;
            document.getElementById('user-avatar').textContent = `${firstName.charAt(0)}${lastName.charAt(0)}`;
          }
        } catch (e) {}
      }

      const userData = localStorage.getItem('evision_user');
      if (userData) {
        try {
          const data = JSON.parse(userData);
          if (data.email) {
            const name = data.email.split('@')[0];
            document.getElementById('user-name-display').textContent = name.charAt(0).toUpperCase() + name.slice(1);
            document.getElementById('user-avatar').textContent = name.charAt(0).toUpperCase();
          }
        } catch (e) {}
      }
    })();
  
}

