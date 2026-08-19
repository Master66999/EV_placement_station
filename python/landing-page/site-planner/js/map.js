/**
 * EVision Site Planner — Leaflet Map Engine
 * 
 * Manages all geospatial visualizations for both Step 02 location selection
 * and Part 2 interactive results dashboard with custom SVG markers, dynamic radius buffers,
 * competitor layers, alternative recommendations, and substation overlays.
 */

class EVisionMapManager {
  constructor() {
    this.pickerMap = null;
    this.pickerMarker = null;
    this.pickerRadiusCircle = null;

    this.dashboardMap = null;
    this.layerGroups = {
      selectedSite: null,
      radiusCircle: null,
      competitors: null,
      alternatives: null,
      substations: null,
      trafficDensity: null
    };

    this.activeLayers = {
      radiusCircle: true,
      competitors: true,
      alternatives: true,
      substations: true,
      trafficDensity: false
    };

    // Alt marker refs keyed by alt.id for hover↔map highlight sync
    this.altMarkerRefs = {};

    this.currentData = null;
  }


  /* -------------------------------------------------------------
   * STEP 02: LOCATION PICKER MAP
   * ------------------------------------------------------------- */
  initLocationPicker(containerId, initialCoords = [18.8242, 73.2845], initialRadius = 5, onLocationChange = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (this.pickerMap) {
      this.pickerMap.remove();
      this.pickerMap = null;
    }

    this.pickerMap = L.map(containerId, {
      center: initialCoords,
      zoom: 12,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(this.pickerMap);

    // High quality light/clean basemap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
      maxZoom: 19
    }).addTo(this.pickerMap);

    // Custom draggable pin
    const pinIcon = L.divIcon({
      className: 'evi-picker-pin-wrapper',
      html: `
        <div class="evi-pin-marker pulse-orange">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#F2542D" stroke="#ffffff"/>
            <circle cx="12" cy="9" r="2.5" fill="#ffffff"/>
          </svg>
        </div>
      `,
      iconSize: [32, 42],
      iconAnchor: [16, 42]
    });

    this.pickerMarker = L.marker(initialCoords, {
      draggable: true,
      icon: pinIcon
    }).addTo(this.pickerMap);

    // Radius circle
    this.pickerRadiusCircle = L.circle(initialCoords, {
      radius: initialRadius * 1000,
      color: '#F2542D',
      weight: 1.5,
      dashArray: '4, 4',
      fillColor: '#F2542D',
      fillOpacity: 0.08
    }).addTo(this.pickerMap);

    // Listeners
    this.pickerMarker.on('dragend', (e) => {
      const pos = e.target.getLatLng();
      this.pickerRadiusCircle.setLatLng(pos);
      if (typeof onLocationChange === 'function') {
        onLocationChange(pos.lat, pos.lng);
      }
    });

    this.pickerMap.on('click', (e) => {
      this.pickerMarker.setLatLng(e.latlng);
      this.pickerRadiusCircle.setLatLng(e.latlng);
      if (typeof onLocationChange === 'function') {
        onLocationChange(e.latlng.lat, e.latlng.lng);
      }
    });

    // Invalidate size after modal/step render
    setTimeout(() => {
      if (this.pickerMap) this.pickerMap.invalidateSize();
    }, 250);
  }

  updatePickerRadius(radiusKm) {
    if (this.pickerRadiusCircle) {
      this.pickerRadiusCircle.setRadius(radiusKm * 1000);
      if (this.pickerMap && this.pickerMarker) {
        this.pickerMap.fitBounds(this.pickerRadiusCircle.getBounds(), { padding: [30, 30] });
      }
    }
  }

  updatePickerPosition(lat, lng, radiusKm = null) {
    if (this.pickerMarker && this.pickerMap) {
      const pos = [lat, lng];
      this.pickerMarker.setLatLng(pos);
      if (this.pickerRadiusCircle) {
        this.pickerRadiusCircle.setLatLng(pos);
        if (radiusKm) this.pickerRadiusCircle.setRadius(radiusKm * 1000);
      }
      this.pickerMap.setView(pos, 13);
    }
  }

  /* -------------------------------------------------------------
   * PART 2: RESULTS DASHBOARD INTERACTIVE MAP
   * ------------------------------------------------------------- */
  renderDashboardMap(containerId, analysisData) {
    const container = document.getElementById(containerId);
    if (!container) return;

    this.currentData = analysisData;
    const coords = analysisData.metadata.coordinates || [18.8242, 73.2845];
    const radiusKm = analysisData.metadata.analysisRadiusKm || 5;

    if (this.dashboardMap) {
      this.dashboardMap.remove();
      this.dashboardMap = null;
    }

    this.dashboardMap = L.map(containerId, {
      center: coords,
      zoom: radiusKm > 5 ? 11 : 12,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(this.dashboardMap);

    // High quality Voyager tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
      maxZoom: 19
    }).addTo(this.dashboardMap);

    // Initialize Layer Groups
    this.layerGroups.selectedSite = L.layerGroup().addTo(this.dashboardMap);
    this.layerGroups.radiusCircle = L.layerGroup().addTo(this.dashboardMap);
    this.layerGroups.competitors = L.layerGroup().addTo(this.dashboardMap);
    this.layerGroups.alternatives = L.layerGroup().addTo(this.dashboardMap);
    this.layerGroups.substations = L.layerGroup().addTo(this.dashboardMap);
    this.layerGroups.trafficDensity = L.layerGroup(); // off by default

    // 1. Plot Selected Site
    const primaryIcon = L.divIcon({
      className: 'evi-primary-marker',
      html: `
        <div class="marker-pill-primary">
          <div class="pill-dot"></div>
          <span class="pill-title">Proposed Site</span>
        </div>
      `,
      iconSize: [130, 36],
      iconAnchor: [65, 36]
    });

    const primaryMarker = L.marker(coords, { icon: primaryIcon }).addTo(this.layerGroups.selectedSite);
    primaryMarker.bindPopup(`
      <div class="evi-popup">
        <div class="popup-tag">TARGET LOCATION</div>
        <h4 class="popup-title">${analysisData.metadata.siteName}</h4>
        <p class="popup-desc">${analysisData.deploymentModel.title}</p>
        <div class="popup-score">Feasibility Score: <strong>${analysisData.feasibility.overallScore} / 100</strong></div>
      </div>
    `);

    // 2. Plot Radius Buffer
    const circle = L.circle(coords, {
      radius: radiusKm * 1000,
      color: '#F2542D',
      weight: 1.5,
      dashArray: '5, 5',
      fillColor: '#F2542D',
      fillOpacity: 0.05
    }).addTo(this.layerGroups.radiusCircle);

    // 3. Plot Competitor Stations
    if (analysisData.competition && analysisData.competition.competitors) {
      analysisData.competition.competitors.forEach((comp, idx) => {
        const compIcon = L.divIcon({
          className: 'evi-comp-marker',
          html: `
            <div class="marker-circle-comp">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const compMarker = L.marker([comp.lat, comp.lng], { icon: compIcon }).addTo(this.layerGroups.competitors);
        compMarker.bindPopup(`
          <div class="evi-popup">
            <div class="popup-tag">EXISTING COMPETITOR</div>
            <h4 class="popup-title">${comp.name}</h4>
            <div class="popup-meta"><strong>Operator:</strong> ${comp.operator} • ${comp.distanceKm} km away</div>
            <div class="popup-meta"><strong>Guns:</strong> ${comp.guns}</div>
            <div class="popup-util"><strong>Load:</strong> ${comp.avgUtilization}</div>
            <p class="popup-desc mt-1">${comp.gapAnalysis}</p>
          </div>
        `);
      });
    }

    // 4. Plot ROI-Ranked Sub-Location Candidate Markers (Star Badges)
    this.altMarkerRefs = {}; // Reset on each render
    const candidates = analysisData.subLocations || analysisData.alternatives || [];
    if (candidates.length) {
      candidates.forEach((alt, idx) => {
        const starSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="#F2542D" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
        const displayName = (alt.name || '').split(',')[0].replace(/—.*/, '').trim();

        const altIcon = L.divIcon({
          className: 'evi-alt-marker',
          html: `
            <div class="marker-pill-alt ${idx === 0 ? 'top-rank' : ''}">
              <span class="alt-star">${starSvg}</span>
              <span class="alt-rank">#${String(idx + 1).padStart(2, '0')}</span>
              <span class="alt-title">${displayName}</span>
              <span class="alt-roi-badge">${alt.roiScore || alt.score || 90} ROI</span>
            </div>
          `,
          iconSize: [210, 36],
          iconAnchor: [105, 36]
        });

        const altMarker = L.marker([alt.lat, alt.lng], { icon: altIcon }).addTo(this.layerGroups.alternatives);
        
        const whyBullets = (alt.whyThisSpot || [alt.reason || 'Optimal transit location']).map(w => `<li>${w}</li>`).join('');
        altMarker.bindPopup(`
          <div class="evi-popup evi-popup-subloc">
            <div class="popup-tag alt">⭐ TOP ROI SUB-LOCATION #${idx + 1}</div>
            <h4 class="popup-title">${alt.name}</h4>
            <div class="popup-metric-row">
              <div class="popup-metric-box">
                <span class="popup-lbl">ROI SCORE</span>
                <strong class="popup-val highlight">${alt.roiScore || alt.score} / 100</strong>
              </div>
              <div class="popup-metric-box">
                <span class="popup-lbl">EST. ROI</span>
                <strong class="popup-val">${alt.estimatedRoiAnnual || '18–22%'}</strong>
              </div>
              <div class="popup-metric-box">
                <span class="popup-lbl">PAYBACK</span>
                <strong class="popup-val">${alt.paybackYears || '3.5 Yrs'}</strong>
              </div>
            </div>
            <div class="popup-cost-line">
              <strong>Est. Land / Rent Cost:</strong> ${alt.landCostLease || '₹65–80 / sq.ft. / mo'} <span class="mono-tag" style="font-size:0.625rem;padding:1px 5px;">${alt.landCostTag || 'MODELED ESTIMATE'}</span>
            </div>
            <div class="popup-cost-line">
              <strong>Deployment:</strong> ${alt.recommendedDeployment || '4W Fast DC Hub'}
            </div>
            <ul class="popup-bullet-list">
              ${whyBullets}
            </ul>
          </div>
        `);

        // Store ref for hover & pan sync — key by alt.id
        this.altMarkerRefs[alt.id] = altMarker;

        // Map marker hover highlights the corresponding card
        altMarker.on('mouseover', () => {
          document.querySelectorAll('.subloc-candidate-card, .alt-site-card').forEach(c => c.classList.remove('map-hovered'));
          const card = document.querySelector(`.subloc-candidate-card[data-alt-id="${alt.id}"], .alt-site-card[data-alt-id="${alt.id}"]`);
          if (card) card.classList.add('map-hovered');
        });
        altMarker.on('mouseout', () => {
          const card = document.querySelector(`.subloc-candidate-card[data-alt-id="${alt.id}"], .alt-site-card[data-alt-id="${alt.id}"]`);
          if (card) card.classList.remove('map-hovered');
        });
      });
    }

    // 5. Plot Power Substation
    if (analysisData.grid && analysisData.grid.distanceKm) {
      const subLat = coords[0] + 0.007;
      const subLng = coords[1] + 0.006;
      const subIcon = L.divIcon({
        className: 'evi-sub-marker',
        html: `
          <div class="marker-circle-sub" title="11kV Substation">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const subMarker = L.marker([subLat, subLng], { icon: subIcon }).addTo(this.layerGroups.substations);
      subMarker.bindPopup(`
        <div class="evi-popup">
          <div class="popup-tag grid">ELECTRICAL SUBSTATION</div>
          <h4 class="popup-title">${analysisData.grid.substationName}</h4>
          <div class="popup-meta"><strong>Distance:</strong> ${analysisData.grid.distanceKm} km • 11kV HT Feeder</div>
          <div class="popup-meta"><strong>Headroom:</strong> ${analysisData.grid.availableHeadroomKva} kVA spare capacity</div>
          <div class="popup-status-badge status-good">${analysisData.grid.status} FOR FAST CHARGING</div>
        </div>
      `);
    }

    // Fit view to include all elements
    setTimeout(() => {
      if (this.dashboardMap) {
        this.dashboardMap.invalidateSize();
        this.dashboardMap.fitBounds(circle.getBounds(), { padding: [40, 40] });
      }
    }, 300);
  }

  panToAlternative(lat, lng, altId = null) {
    if (this.dashboardMap) {
      this.dashboardMap.flyTo([lat, lng], 14, {
        duration: 1.1
      });
      if (altId && this.altMarkerRefs[altId]) {
        setTimeout(() => {
          if (this.altMarkerRefs[altId]) {
            this.altMarkerRefs[altId].openPopup();
          }
        }, 700);
      }
    }
  }

  toggleLayer(layerKey, isVisible) {
    this.activeLayers[layerKey] = isVisible;
    if (!this.dashboardMap || !this.layerGroups[layerKey]) return;

    if (isVisible) {
      if (!this.dashboardMap.hasLayer(this.layerGroups[layerKey])) {
        this.dashboardMap.addLayer(this.layerGroups[layerKey]);
      }
    } else {
      if (this.dashboardMap.hasLayer(this.layerGroups[layerKey])) {
        this.dashboardMap.removeLayer(this.layerGroups[layerKey]);
      }
    }
  }

  prepareMapForExport() {
    if (!this.dashboardMap) return;
    this.dashboardMap.invalidateSize();
    if (this.layerGroups.radiusCircle) {
      const layers = this.layerGroups.radiusCircle.getLayers();
      if (layers && layers.length > 0 && layers[0].getBounds) {
        this.dashboardMap.fitBounds(layers[0].getBounds(), { padding: [30, 30] });
      }
    }
  }

  /**
   * Highlight / un-highlight an alternative site marker.
   * Called bidirectionally when user hovers an alt-site card.
   * @param {string} altId - matches alt.id from the data
   * @param {boolean} highlight
   */
  highlightAlternative(altId, highlight) {
    const marker = this.altMarkerRefs[altId];
    if (!marker) return;

    // Swap the icon's inner div style to apply highlight class
    const el = marker.getElement();
    if (!el) return;
    const pill = el.querySelector('.marker-pill-alt');
    if (!pill) return;

    if (highlight) {
      pill.style.background = 'var(--color-green)';
      pill.style.color = '#FFFFFF';
      pill.style.transform = 'scale(1.08) translateY(-2px)';
      pill.style.transition = 'all 0.2s ease';
    } else {
      pill.style.background = '';
      pill.style.color = '';
      pill.style.transform = '';
    }
  }
}

window.EVisionMapManager = new EVisionMapManager();
