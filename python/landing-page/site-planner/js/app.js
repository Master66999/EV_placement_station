/**
 * EVision Site Planner — Main Application Controller
 * 
 * Orchestrates:
 * - 8-Step Progressive Questionnaire with adaptive conditional flows
 * - Form state tracking & validation
 * - Dynamic Step 08 Review Summary
 * - Simulated progressive analysis state
 * - Results Dashboard dynamic JSON rendering
 * - Live interactive Financial Simulator recalculations
 * - Interactive map layer bindings & alternative site panning
 */

class EVisionPlannerApp {
  constructor() {
    this.currentStep = 0; // 0-indexed (0 to 7)
    this.totalSteps = 8;
    this.formData = {
      projectType: 'public_station',
      vehicleMix: ['4w', '2w'],
      scale: 'medium',
      locationName: 'Mumbai-Pune Expressway (Khalapur Toll Plaza)',
      city: 'Navi Mumbai Corridor',
      state: 'Maharashtra',
      pincode: '410203',
      coordinates: [18.8242, 73.2845],
      radius: 5,
      propertyType: 'petrol_pump',
      ownership: 'own',
      areaSqFt: 3500,
      mainRoadAccess: 'yes',
      parkingSpaces: 8,
      propertyAdaptive: {
        existingBrand: 'HPCL / BPCL Co-locate',
        existingSanctionedLoad: '45 kW',
        operatingHours: '24/7'
      },
      targetVehicleWeighting: {
        w2w: 35,
        w4w_personal: 45,
        w4w_fleet: 20
      },
      autoRecommendChargers: true,
      chargerCounts: {
        c2w: 2,
        c4w_ac: 2,
        c4w_dc: 2,
        c_hpdc: 1
      },
      budget: '25_50',
      desiredGridCapacity: '120_240'
    };

    this.analysisResult = null;
    this.activeFinancials = null;
  }

  init() {
    this._loadOnboardingContext();
    this._injectProgressBar();
    this._injectCardEnhancements();
    this._bindDOMEvents();
    this._initStep02Map();
    this._updateAdaptivePropertyUI();
    this.goToStep(0);
    // Stagger the first step's cards after page has settled
    const firstCard = document.getElementById('step-card-1');
    if (firstCard) setTimeout(() => this._staggerCards(firstCard), 120);
  }

  /**
   * Reads onboarding registration data from localStorage if user completed register.html
   */
  _loadOnboardingContext() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlLat = parseFloat(urlParams.get('lat'));
      const urlLng = parseFloat(urlParams.get('lng'));
      const urlLoc = urlParams.get('loc');
      if (!isNaN(urlLat) && !isNaN(urlLng)) {
        this.formData.coordinates = [urlLat, urlLng];
        if (urlLoc) {
          this.formData.locationName = decodeURIComponent(urlLoc);
          const searchInput = document.getElementById('input-location-search');
          if (searchInput) searchInput.value = decodeURIComponent(urlLoc);
        }
      }
    } catch (e) {
      console.warn('Could not parse URL query parameters:', e);
    }

    try {
      const stored = localStorage.getItem('evision_onboarding_project');
      if (!stored) return;
      const proj = JSON.parse(stored);
      if (proj && proj.company) {
        const brandSubtext = document.querySelector('.brand-subtext');
        if (brandSubtext) {
          brandSubtext.innerHTML = `EV SITE PLANNER • <span style="color:var(--accent-orange);">${proj.company}</span> (${proj.city || 'Active Project'})`;
        }

        const cityLower = (proj.city || '').toLowerCase();
        if (cityLower.includes('bengaluru') || cityLower.includes('bangalore')) {
          this.formData.locationName = "Outer Ring Road (Bellandur EcoSpace Corridor)";
          this.formData.coordinates = [12.9259, 77.6835];
        } else if (cityLower.includes('delhi') || cityLower.includes('gurugram') || cityLower.includes('noida')) {
          this.formData.locationName = "NH-48 Rajiv Chowk - Manesar Corridor";
          this.formData.coordinates = [28.4354, 77.0128];
        } else if (cityLower.includes('pune') || cityLower.includes('mumbai')) {
          this.formData.locationName = "Mumbai-Pune Expressway (Khalapur Toll Plaza)";
          this.formData.coordinates = [18.8242, 73.2845];
        }
      }
    } catch (e) {
      console.warn('Could not read onboarding context:', e);
    }
  }

  /* -------------------------------------------------------------
   * STEPPER NAVIGATION & EVENT BINDINGS
   * ------------------------------------------------------------- */
  _bindDOMEvents() {
    // Single-select option cards (Project type, scale, property, budget, grid)
    document.querySelectorAll('.option-card[data-field]').forEach(card => {
      card.addEventListener('click', (e) => {
        const field = card.getAttribute('data-field');
        const value = card.getAttribute('data-value');
        
        // Deselect siblings
        const parent = card.closest('.options-grid');
        parent.querySelectorAll(`.option-card[data-field="${field}"]`).forEach(c => {
          c.classList.remove('selected', 'just-selected');
        });
        card.classList.add('selected');

        // Trigger satisfying pop micro-animation on selection
        card.classList.add('just-selected');
        card.addEventListener('animationend', () => card.classList.remove('just-selected'), { once: true });
        
        this.formData[field] = value;

        // Trigger adaptive logic if propertyType changes
        if (field === 'propertyType') {
          this._updateAdaptivePropertyUI();
        }
      });
    });

    // Multi-select vehicle checkboxes (Step 01)
    document.querySelectorAll('.checkbox-card[data-vehicle]').forEach(card => {
      card.addEventListener('click', () => {
        const v = card.getAttribute('data-vehicle');
        card.classList.toggle('selected');
        
        const selectedVehicles = [];
        document.querySelectorAll('.checkbox-card[data-vehicle].selected').forEach(c => {
          selectedVehicles.push(c.getAttribute('data-vehicle'));
        });
        
        this.formData.vehicleMix = selectedVehicles.length > 0 ? selectedVehicles : ['4w'];
      });
    });

    // Stepper header navigation clicks
    document.querySelectorAll('.step-item').forEach(item => {
      item.addEventListener('click', () => {
        const stepIdx = parseInt(item.getAttribute('data-step'), 10);
        if (stepIdx < this.currentStep) {
          this.goToStep(stepIdx);
        }
      });
    });

    // Step 02 Radius Pill Selectors
    document.querySelectorAll('.radius-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.radius-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const radius = parseInt(pill.getAttribute('data-radius'), 10);
        this.formData.radius = radius;
        window.EVisionMapManager.updatePickerRadius(radius);
      });
    });

    // Step 02 Preset Site Chips
    document.querySelectorAll('.preset-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const presetKey = chip.getAttribute('data-preset');
        const preset = window.EVisionDataService.presetLocations[presetKey];
        if (preset) {
          this.formData.locationName = preset.name;
          this.formData.city = preset.city;
          this.formData.state = preset.state;
          this.formData.pincode = preset.pincode;
          this.formData.coordinates = [preset.lat, preset.lng];
          this.formData.radius = preset.defaultRadius;
          
          document.getElementById('input-location-search').value = preset.name;
          document.getElementById('input-lat-long').value = `${preset.lat.toFixed(4)}, ${preset.lng.toFixed(4)}`;
          document.getElementById('input-pincode').value = preset.pincode;

          // Update active radius pill
          document.querySelectorAll('.radius-pill').forEach(p => {
            p.classList.toggle('active', parseInt(p.getAttribute('data-radius'), 10) === preset.defaultRadius);
          });

          window.EVisionMapManager.updatePickerPosition(preset.lat, preset.lng, preset.defaultRadius);
        }
      });
    });

    // Step 02 Manual Coordinate input change
    const coordInput = document.getElementById('input-lat-long');
    if (coordInput) {
      coordInput.addEventListener('change', () => {
        const parts = coordInput.value.split(',').map(s => parseFloat(s.trim()));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          this.formData.coordinates = parts;
          window.EVisionMapManager.updatePickerPosition(parts[0], parts[1], this.formData.radius);
        }
      });
    }

    // Step 02 Geolocation "Use My Current Location" button
    const btnCurrentLoc = document.getElementById('btn-use-current-location');
    if (btnCurrentLoc) {
      btnCurrentLoc.addEventListener('click', () => this._handleCurrentLocation());
    }

    // Step 05 Charger Mix: Auto recommend checkbox toggle
    const autoRecCheckbox = document.getElementById('chk-auto-recommend');
    const chargerGrid = document.getElementById('charger-counters-grid');
    if (autoRecCheckbox && chargerGrid) {
      autoRecCheckbox.addEventListener('change', () => {
        this.formData.autoRecommendChargers = autoRecCheckbox.checked;
        chargerGrid.classList.toggle('disabled', autoRecCheckbox.checked);
      });
    }

    // Step 05 Charger counter buttons (+ / -)
    document.querySelectorAll('.counter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const isIncrement = btn.getAttribute('data-action') === 'plus';
        const valEl = document.getElementById(targetId);
        if (valEl) {
          let currentVal = parseInt(valEl.innerText, 10) || 0;
          currentVal = isIncrement ? currentVal + 1 : Math.max(0, currentVal - 1);
          valEl.innerText = currentVal;
          
          const keyMap = {
            'val-c2w': 'c2w',
            'val-c4w-ac': 'c4w_ac',
            'val-c4w-dc': 'c4w_dc',
            'val-c-hpdc': 'c_hpdc'
          };
          if (keyMap[targetId]) {
            this.formData.chargerCounts[keyMap[targetId]] = currentVal;
          }
        }
      });
    });

    // Navigation buttons (Next / Prev / Submit)
    document.querySelectorAll('[data-action="next-step"]').forEach(btn => {
      btn.addEventListener('click', () => this.nextStep());
    });

    document.querySelectorAll('[data-action="prev-step"]').forEach(btn => {
      btn.addEventListener('click', () => this.prevStep());
    });

    const submitBtn = document.getElementById('btn-submit-analysis');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => this.runAnalysis());
    }

    // Restart / Re-plan button
    const restartBtn = document.getElementById('btn-replan-site');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        document.getElementById('dashboard-view').classList.remove('active', 'detail-mode');
        document.getElementById('questionnaire-view').style.display = 'block';
        this.goToStep(0);
      });
    }

    // Full Report toggle — progressive disclosure
    const detailToggle = document.getElementById('btn-detail-toggle');
    if (detailToggle) {
      detailToggle.addEventListener('click', () => {
        const dashView = document.getElementById('dashboard-view');
        const isActive = dashView.classList.toggle('detail-mode');
        detailToggle.classList.toggle('is-active', isActive);
        detailToggle.setAttribute('aria-pressed', String(isActive));

        const iconExpand   = detailToggle.querySelector('.icon-expand');
        const iconCollapse = detailToggle.querySelector('.icon-collapse');
        const label        = detailToggle.querySelector('.toggle-label');

        if (isActive) {
          iconExpand.style.display   = 'none';
          iconCollapse.style.display = 'block';
          label.textContent = 'Summary';
          // Re-run scroll reveals for newly visible elements
          setTimeout(() => this._initScrollReveal(), 50);
        } else {
          iconExpand.style.display   = 'block';
          iconCollapse.style.display = 'none';
          label.textContent = 'Full Report';
        }
      });
    }

    // Export / Share Modal Triggers
    const modalBackdrop = document.getElementById('modal-report-dialog');
    const openModalBtn = document.getElementById('btn-open-report-modal');
    const closeModalBtn = document.getElementById('btn-close-modal');
    const printReportBtn = document.getElementById('btn-print-report');

    if (openModalBtn && modalBackdrop) {
      openModalBtn.addEventListener('click', () => {
        if (window.EVisionMapManager) {
          window.EVisionMapManager.prepareMapForExport();
        }
        modalBackdrop.classList.add('active');
      });
    }
    if (closeModalBtn && modalBackdrop) {
      closeModalBtn.addEventListener('click', () => modalBackdrop.classList.remove('active'));
    }
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) modalBackdrop.classList.remove('active');
      });
    }
    if (printReportBtn) {
      printReportBtn.addEventListener('click', () => {
        if (window.EVisionMapManager) {
          window.EVisionMapManager.prepareMapForExport();
        }
        if (modalBackdrop) modalBackdrop.classList.remove('active');
        setTimeout(() => {
          window.print();
        }, 180);
      });
    }
  }

  _initStep02Map() {
    setTimeout(() => {
      window.EVisionMapManager.initLocationPicker(
        'location-picker-map',
        this.formData.coordinates,
        this.formData.radius,
        (lat, lng) => {
          this.formData.coordinates = [lat, lng];
          const coordEl = document.getElementById('input-lat-long');
          if (coordEl) coordEl.value = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        }
      );
    }, 400);
  }

  /**
   * Browser Geolocation API integration for Step 02
   */
  _handleCurrentLocation() {
    console.log("[Location] Current Location button clicked");
    console.log("[Location] Geolocation supported:", "geolocation" in navigator);
    console.log("[Location] Secure context:", window.isSecureContext);

    const btn = document.getElementById('btn-use-current-location');
    const msgEl = document.getElementById('location-status-msg');

    const iconSpan = btn?.querySelector('.loc-icon');
    const textSpan = btn?.querySelector('.loc-text');

    const setState = (state, text, icon, msgText = '', isError = false) => {
      if (iconSpan) iconSpan.textContent = icon;
      if (textSpan) textSpan.textContent = text;
      
      if (btn) {
        if (state === 'locating') {
          btn.disabled = true;
          btn.style.opacity = '0.75';
        } else {
          btn.disabled = false;
          btn.style.opacity = '1';
        }
      }

      if (msgEl) {
        if (msgText) {
          msgEl.style.display = 'block';
          msgEl.style.color = isError ? '#EF4444' : '#10B981';
          msgEl.textContent = msgText;
        } else {
          msgEl.style.display = 'none';
        }
      }
    };

    if (!("geolocation" in navigator)) {
      console.error("[Location] Geolocation is not supported by this browser.");
      setState('error', 'Location Unavailable', '⚠', 'Geolocation is not supported by your browser.', true);
      return;
    }

    setState('locating', 'Detecting Location...', '◌');
    console.log("[Location] Requesting browser location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const accuracy = position.coords.accuracy;

          console.log("[Location] Position received");
          console.log("[Location] Latitude:", lat);
          console.log("[Location] Longitude:", lng);
          console.log("[Location] Accuracy:", accuracy);

          // 1. Update application state
          this.formData.coordinates = [lat, lng];
          console.log("[Location] State updated");

          // 2. Update Latitude, Longitude input fields
          const latLongInput = document.getElementById('input-lat-long');
          if (latLongInput) {
            latLongInput.value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            console.log("[Location] Inputs updated");
          }

          // 3. Move existing Leaflet map marker & center & radius circle
          if (window.EVisionMapManager) {
            window.EVisionMapManager.updatePickerPosition(lat, lng, this.formData.radius);
            console.log("[Location] Marker updated");
            console.log("[Location] Map centered");
          }

          // 4. Reverse Geocode attempt via OSM Nominatim
          console.log("[Location] Reverse geocoding started");
          let formattedAddress = `GPS Location (${lat.toFixed(6)}, ${lng.toFixed(6)})`;
          let pincodeFound = '';

          try {
            const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`, {
              headers: { 'Accept': 'application/json' }
            });
            if (resp.ok) {
              const geoData = await resp.json();
              if (geoData && geoData.address) {
                const addr = geoData.address;
                const road = addr.road || addr.suburb || addr.neighbourhood || '';
                const city = addr.city || addr.town || addr.county || addr.state_district || '';
                const state = addr.state || '';
                pincodeFound = addr.postcode || '';

                if (road || city) {
                  formattedAddress = [road, city, state].filter(Boolean).join(', ');
                } else if (geoData.display_name) {
                  formattedAddress = geoData.display_name.split(',').slice(0, 3).join(',');
                }

                if (city) this.formData.city = city;
                if (state) this.formData.state = state;
              }
            }
          } catch (geoErr) {
            console.warn('[Location] Reverse geocoding network notice:', geoErr);
          }

          // 5. Update Location Name field
          this.formData.locationName = formattedAddress;
          const searchInput = document.getElementById('input-location-search');
          if (searchInput) searchInput.value = formattedAddress;

          // 6. Update PIN field if found
          if (pincodeFound) {
            this.formData.pincode = pincodeFound;
            const pinInput = document.getElementById('input-pincode');
            if (pinInput) pinInput.value = pincodeFound;
          }

          setState('success', 'Current Location', '✓', 'Location detected and mapped successfully.', false);
          console.log("[Location] Location complete");

          // Reset to normal active state label after 4 seconds
          setTimeout(() => {
            setState('normal', 'Use My Current Location', '◎', '');
          }, 4000);

        } catch (e) {
          console.error('[Location] Error applying geolocation position:', e);
          setState('error', 'Location Unavailable', '⚠', 'Could not process coordinates. Please try manual entry.', true);
        }
      },
      (error) => {
        console.error("[Location] Geolocation error:", error);

        let errMessage = "Unable to determine your location.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errMessage = "Location permission was denied. Please allow location access in your browser.";
            break;
          case error.POSITION_UNAVAILABLE:
            errMessage = "Your location could not be determined. Please try again.";
            break;
          case error.TIMEOUT:
            errMessage = "Location detection timed out. Please try again.";
            break;
          default:
            errMessage = "Unable to determine your location.";
        }

        setState('error', 'Location Unavailable', '⚠', errMessage, true);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  }

  /* -------------------------------------------------------------
   * ADAPTIVE QUESTIONNAIRE LOGIC
   * ------------------------------------------------------------- */
  _updateAdaptivePropertyUI() {
    const propType = this.formData.propertyType;
    const container = document.getElementById('adaptive-property-fields');
    if (!container) return;

    let html = '';
    if (propType === 'petrol_pump') {
      html = `
        <div class="adaptive-container">
          <div class="adaptive-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 22v-8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8M14 9V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v17"/>
            </svg>
            Petrol Pump Specific Parameters
          </div>
          <div class="options-grid" style="grid-template-columns: 1fr 1fr;">
            <div class="form-group">
              <label class="form-label">Existing OMC Retail Brand</label>
              <input type="text" class="input-text" id="adapt-omc" value="HPCL / BPCL Dealer" placeholder="e.g. IndianOil, BPCL, HPCL, Shell">
            </div>
            <div class="form-group">
              <label class="form-label">Existing Connected Load</label>
              <input type="text" class="input-text" id="adapt-load" value="45 kW 3-Phase Commercial" placeholder="e.g. 25 kW / 45 kW">
            </div>
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label">Operating Schedule</label>
            <div class="options-grid" style="grid-template-columns: repeat(3, 1fr);">
              <div class="option-card selected"><span class="option-title">24 Hours Open</span></div>
              <div class="option-card"><span class="option-title">6 AM – 11 PM</span></div>
              <div class="option-card"><span class="option-title">Highway Shift (20h)</span></div>
            </div>
          </div>
        </div>
      `;
    } else if (propType === 'standalone_land') {
      html = `
        <div class="adaptive-container">
          <div class="adaptive-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 22h20M8 6h8M6 10h12M4 14h16M2 18h20"/>
            </svg>
            Standalone Land Site Parameters
          </div>
          <div class="options-grid" style="grid-template-columns: 1fr 1fr;">
            <div class="form-group">
              <label class="form-label">Main Road Frontage Width</label>
              <input type="text" class="input-text" value="65 Feet" placeholder="e.g. 50 ft / 80 ft">
            </div>
            <div class="form-group">
              <label class="form-label">Distance from Nearest 11kV Substation</label>
              <input type="text" class="input-text" value="0.8 km (Under 1 km)" placeholder="e.g. 500m">
            </div>
          </div>
        </div>
      `;
    } else if (propType === 'fleet_charging' || this.formData.projectType === 'fleet_charging') {
      html = `
        <div class="adaptive-container">
          <div class="adaptive-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="3" width="15" height="13"/>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
              <circle cx="5.5" cy="18.5" r="2.5"/>
              <circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            Fleet Depot & Turnaround Requirements
          </div>
          <div class="options-grid" style="grid-template-columns: 1fr 1fr;">
            <div class="form-group">
              <label class="form-label">Daily Fleet Size</label>
              <input type="text" class="input-text" value="40–60 Commercial EVs" placeholder="e.g. 30 e-Autos, 20 e-Vans">
            </div>
            <div class="form-group">
              <label class="form-label">Target Turnaround Time</label>
              <input type="text" class="input-text" value="45 minutes (Fast Top-up)" placeholder="e.g. Overnight 6h / Fast 40m">
            </div>
          </div>
        </div>
      `;
    } else {
      html = `
        <div class="adaptive-container">
          <div class="adaptive-title">Commercial Property Parameters</div>
          <div class="options-grid" style="grid-template-columns: 1fr 1fr;">
            <div class="form-group">
              <label class="form-label">Customer Average Dwell Time</label>
              <input type="text" class="input-text" value="75–90 Minutes (High Dwell)" placeholder="e.g. 1 hour">
            </div>
            <div class="form-group">
              <label class="form-label">Visitor Parking Spaces</label>
              <input type="text" class="input-text" value="25+ Dedicated Bays" placeholder="e.g. 20 bays">
            </div>
          </div>
        </div>
      `;
    }

    container.innerHTML = html;
  }

  /* -------------------------------------------------------------
   * STEP RENDER & NAVIGATION
   * ------------------------------------------------------------- */
  goToStep(stepIndex) {
    if (stepIndex < 0 || stepIndex >= this.totalSteps) return;

    const isForward = stepIndex > this.currentStep;
    const outCard = document.getElementById(`step-card-${this.currentStep + 1}`);
    const inCard  = document.getElementById(`step-card-${stepIndex + 1}`);

    // Respect prefers-reduced-motion — skip animation
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const showNext = () => {
      document.querySelectorAll('.step-card').forEach(card => {
        card.classList.remove('active', 'entering-forward', 'entering-back', 'exiting');
      });
      if (inCard) {
        inCard.classList.add('active');
        if (!reducedMotion) {
          inCard.classList.add(isForward ? 'entering-forward' : 'entering-back');
          // Remove animation class after it completes so it doesn't replay
          inCard.addEventListener('animationend', () => {
            inCard.classList.remove('entering-forward', 'entering-back');
          }, { once: true });
        }
      }
    };

    if (!reducedMotion && outCard && outCard !== inCard) {
      // Mark current card as exiting — it slides out first
      outCard.classList.add('exiting');
      outCard.addEventListener('animationend', () => {
        outCard.classList.remove('active', 'exiting');
        showNext();
      }, { once: true });
    } else {
      showNext();
    }

    // Update Stepper Navigation list with tick marks for completed steps
    document.querySelectorAll('.step-item').forEach((item, idx) => {
      item.classList.toggle('active', idx === stepIndex);
      item.classList.toggle('completed', idx < stepIndex);
      const numEl = item.querySelector('.step-number');
      if (numEl) {
        if (idx < stepIndex) {
          numEl.innerHTML = '✓';
        } else {
          numEl.textContent = String(idx + 1).padStart(2, '0');
        }
      }
    });

    this.currentStep = stepIndex;

    // Special step hooks
    if (stepIndex === 1) { // Step 02 Location
      setTimeout(() => {
        if (window.EVisionMapManager.pickerMap) {
          window.EVisionMapManager.pickerMap.invalidateSize();
        }
      }, 380);
    } else if (stepIndex === 7) { // Step 08 Review
      setTimeout(() => this._renderReviewSummary(), 80);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update segmented progress bar
    this._updateProgressBar(stepIndex);

    // Stagger card entrance for the new step
    const newCard = document.getElementById(`step-card-${stepIndex + 1}`);
    if (newCard) {
      setTimeout(() => this._staggerCards(newCard), reducedMotion ? 0 : 80);
    }
  }

  nextStep() {
    this.goToStep(this.currentStep + 1);
  }

  prevStep() {
    this.goToStep(this.currentStep - 1);
  }

  _renderReviewSummary() {
    const summaryContainer = document.getElementById('review-summary-tbody');
    if (!summaryContainer) return;

    try {
      const vehicleMixText = (Array.isArray(this.formData.vehicleMix) && this.formData.vehicleMix.length > 0)
        ? this.formData.vehicleMix.map(v => String(v || '').toUpperCase()).join(', ')
        : '4W, 2W';

      const propTypeRaw = this.formData.propertyType || 'petrol_pump';
      const propTypeText = String(propTypeRaw).replace(/_/g, ' ').toUpperCase();

      const gridCapRaw = this.formData.desiredGridCapacity || '120_240';
      const gridCapText = String(gridCapRaw).replace(/_/g, '–');

      const formatProject = {
        'public_station': 'Public EV Fast Charging Station',
        'highway_hub': 'Highway EV Charging Hub',
        'fleet_charging': 'Commercial Fleet Depot',
        'commercial_park': 'Commercial / Mall EV Hub',
        'petrol_pump': 'Petrol Pump + EV Charging',
        'workplace': 'Workplace / Tech Park Charging',
        'residential': 'Residential / Apartment Complex'
      }[this.formData.projectType] || String(this.formData.projectType || 'Public EV Fast Charging Station').replace(/_/g, ' ').toUpperCase();

      const formatScale = {
        'small': 'Small Scale (2–4 Guns)',
        'medium': 'Medium Scale (4–8 Guns)',
        'large': 'Large Flagship Hub (8+ Guns)'
      }[this.formData.scale] || String(this.formData.scale || 'Medium Scale').toUpperCase();

      const formatBudget = {
        'under_10': 'Under ₹10 Lakhs',
        '10_25': '₹10 – ₹25 Lakhs',
        '25_50': '₹25 – ₹50 Lakhs',
        '50_1cr': '₹50 Lakhs – ₹1 Crore',
        '1cr_plus': '₹1 Crore +',
        'not_decided': 'Not Decided (Estimate with EVision)'
      }[this.formData.budget] || String(this.formData.budget || '₹25 – ₹50 Lakhs');

      const chargerCounts = this.formData.chargerCounts || {};
      const chargerMixText = this.formData.autoRecommendChargers || (!chargerCounts.c4w_dc && !chargerCounts.c4w_ac && !chargerCounts.c2w && !chargerCounts.c_hpdc)
        ? "Optimal EVision Multi-Speed Recommendation"
        : `Custom: ${chargerCounts.c4w_dc || 0}x DC Fast, ${chargerCounts.c4w_ac || 0}x AC`;

      const rows = [
        { label: "Project Blueprint", val: `${formatProject} (${formatScale})`, step: 0 },
        { label: "Target Vehicles", val: vehicleMixText, step: 0 },
        { label: "Location & Radius", val: `${this.formData.locationName || 'Selected Site Location'} (${this.formData.radius || 5} km Catchment Area)`, step: 1 },
        { label: "Property & Ingress", val: `${propTypeText} • ${this.formData.areaSqFt || 3500} sq.ft • Dedicated Road Access`, step: 2 },
        { label: "Charger Mix", val: chargerMixText, step: 4 },
        { label: "Budget Bracket", val: formatBudget, step: 5 },
        { label: "Target Capacity", val: `${gridCapText} kW Commercial Grid Sanction`, step: 6 }
      ];

      summaryContainer.innerHTML = rows.map(r => `
        <tr>
          <td class="review-label">${r.label}</td>
          <td class="review-val">${r.val}</td>
          <td class="review-edit-btn">
            <button type="button" class="btn btn-ghost btn-sm" onclick="if(window.EVisionPlannerApp) window.EVisionPlannerApp.goToStep(${r.step}); return false;">
              Edit
            </button>
          </td>
        </tr>
      `).join('');
    } catch (err) {
      console.error('[EVISION PLANNER] Error rendering review summary:', err);
    }
  }

  /* -------------------------------------------------------------
   * PROGRESSIVE ANALYSIS PIPELINE & DASHBOARD TRIGGER
   * ------------------------------------------------------------- */
  async runAnalysis() {
    const questionView = document.getElementById('questionnaire-view');
    const processingView = document.getElementById('processing-view');
    const dashView = document.getElementById('dashboard-view');

    // Show processing animation
    if (questionView) questionView.style.display = 'none';
    if (processingView) processingView.classList.add('active');

    const log1 = document.getElementById('proc-log-1');
    const log2 = document.getElementById('proc-log-2');
    const log3 = document.getElementById('proc-log-3');
    const log4 = document.getElementById('proc-log-4');

    // Sequential log status reveals
    setTimeout(() => {
      if (log1) { log1.classList.add('done'); log1.innerHTML = '✓ Analyzing charging demand & traffic volume...'; }
      if (log2) { log2.classList.add('active'); }
    }, 600);

    setTimeout(() => {
      if (log2) { log2.classList.remove('active'); log2.classList.add('done'); log2.innerHTML = '✓ Finding relevant RTOs & VAHAN registration density...'; }
      if (log3) { log3.classList.add('active'); }
    }, 1200);

    setTimeout(() => {
      if (log3) { log3.classList.remove('active'); log3.classList.add('done'); log3.innerHTML = '✓ Calculating grid substation headroom & hotspot scores...'; }
      if (log4) { log4.classList.add('active'); }
    }, 1800);

    // Call data service
    const analysisResponse = await window.EVisionDataService.generateAnalysis(this.formData);
    this.analysisResult = analysisResponse;
    if (analysisResponse && analysisResponse.financials && analysisResponse.financials.baseline) {
      this.activeFinancials = JSON.parse(JSON.stringify(analysisResponse.financials.baseline));
    }

    setTimeout(() => {
      if (questionView) questionView.style.display = 'none';
      if (processingView) {
        processingView.classList.remove('active');
        processingView.style.display = 'none';
      }
      if (dashView) {
        dashView.classList.add('active');
        dashView.style.setProperty('display', 'block', 'important');
        dashView.style.setProperty('opacity', '1', 'important');
        dashView.style.setProperty('visibility', 'visible', 'important');
      }
      this._renderDashboard(analysisResponse);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2400);
  }

  /* -------------------------------------------------------------
   * DASHBOARD RENDERING ENGINE (JSON -> DOM)
   * ------------------------------------------------------------- */
  _renderDashboard(data) {
    if (!data) return;

    const setElemText = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.innerText = text;
    };

    const setElemHTML = (id, html) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    };

    try {
      // Export Modal Preview Binding
      if (data.metadata) {
        setElemText('export-site-name', data.metadata.siteName || 'Selected Site Location');
        if (Array.isArray(data.metadata.coordinates)) {
          setElemText('export-site-coords', `[${data.metadata.coordinates[0].toFixed(4)}, ${data.metadata.coordinates[1].toFixed(4)}] • ${data.metadata.analysisRadiusKm || 5} km Catchment Radius`);
        }
      }
      if (data.feasibility) {
        setElemText('export-site-score', `${data.feasibility.overallScore} / 100 SCORE (${data.feasibility.grade})`);
      }
      if (data.capex) {
        setElemText('export-site-capex', `₹${data.capex.totalMinLakh} – ₹${data.capex.totalMaxLakh} Lakhs`);
      }
      if (data.financials && data.financials.baseline) {
        const profitLakh = (data.financials.baseline.monthlyNetProfit / 100000).toFixed(2);
        setElemText('export-site-profit', `₹${profitLakh} Lakhs/mo`);
        setElemText('export-site-payback', `~${data.financials.baseline.paybackMonths} Months`);
      }
    } catch (err) {
      console.error('Error rendering export summary preview:', err);
    }

    // Ensure dashboard container is visible
    const dashView = document.getElementById('dashboard-view');
    if (dashView) {
      dashView.classList.add('active');
      dashView.style.display = 'block';
    }

    try {
      // 1. Header Banner & Meta
      if (data.metadata) {
        setElemText('dash-site-title', data.metadata.siteName || 'Selected Site Location');
        if (data.metadata.coordinates && data.metadata.coordinates.length >= 2) {
          setElemText('dash-meta-coords', `LAT: ${Number(data.metadata.coordinates[0]).toFixed(4)}° N, LNG: ${Number(data.metadata.coordinates[1]).toFixed(4)}° E`);
        }
        setElemText('dash-meta-radius', `ANALYSIS CATCHMENT: ${data.metadata.analysisRadiusKm || 5} KM RADIUS`);
        setElemText('dash-meta-id', `ASSESSMENT ID: ${data.metadata.analysisId || 'EVI-1001'}`);
      }
    } catch (err) {
      console.error('Error rendering header banner:', err);
    }

    try {
      // 2. Section A: Feasibility Score Hero
      if (data.feasibility) {
        this._animateNumber('dash-overall-score', 0, data.feasibility.overallScore || 85, 1100, 200);
        setElemText('dash-score-grade', data.feasibility.grade || 'A');
        setElemText('dash-score-headline', `${data.feasibility.grade || 'A'} Charging Site Feasibility Profile`);

        const subbarsContainer = document.getElementById('dash-subbars-list');
        if (subbarsContainer && Array.isArray(data.feasibility.pillars)) {
          subbarsContainer.innerHTML = data.feasibility.pillars.map(p => `
            <div class="score-bar-row">
              <div class="score-bar-header">
                <span class="score-bar-name">${p.name}</span>
                <span class="score-bar-val">${p.score} <span style="color:var(--text-muted);font-weight:400;">/ 100</span></span>
              </div>
              <div class="score-progress-track">
                <div class="score-progress-fill" style="width: 0%;" data-target-width="${p.score}%"></div>
              </div>
              <div class="score-bar-expl">${p.explanation || ''}</div>
              <div class="data-source-note">[${p.tag || 'DATASET'}]</div>
            </div>
          `).join('');

          document.querySelectorAll('.score-progress-fill').forEach((bar, idx) => {
            setTimeout(() => {
              bar.style.width = bar.getAttribute('data-target-width');
            }, 300 + idx * 120);
          });
        }
      }
    } catch (err) {
      console.error('Error rendering feasibility pillars:', err);
    }

    try {
      // 3. Section B: Demographics & EV Catchment
      if (data.demographics) {
        this._animateNumber('metric-pop-count', 0, data.demographics.catchmentPopulation || 50000, 900, 80);
        this._animateNumber('metric-ev-count', 0, data.demographics.totalRegisteredEVs || 1200, 950, 180);
        setElemText('metric-ev-pen', `${data.demographics.evPenetrationPercent || 4.5}%`);
        setElemText('metric-ev-cagr', `+${data.demographics.annualAdoptionGrowthPercent || 42}%`);

        const vehicleContainer = document.getElementById('dash-vehicle-breakdown');
        if (vehicleContainer && Array.isArray(data.demographics.breakdown)) {
          vehicleContainer.innerHTML = data.demographics.breakdown.map(v => `
            <div class="vehicle-row reveal-el">
              <span class="vehicle-name">${v.type}</span>
              <span class="vehicle-count">${(v.count || 0).toLocaleString()} (${v.percentage || 0}%) <span class="mono-tag" style="margin-left:6px;">${v.tag || ''}</span></span>
            </div>
          `).join('');
        }
      }
    } catch (err) {
      console.error('Error rendering demographics:', err);
    }

    try {
      // 4. Section C: Traffic & Mobility
      if (data.traffic) {
        const trafficBadge = document.getElementById('dash-traffic-badge');
        if (trafficBadge) {
          trafficBadge.innerText = `${data.traffic.trafficTier || 'HIGH'} EXPOSURE`;
          trafficBadge.className = String(data.traffic.trafficTier || '').includes('VERY') ? 'status-pill-badge status-good' : 'status-pill-badge status-warn';
        }
        setElemText('traffic-daily-passby', `${(data.traffic.dailyVehicularPassBy || 35000).toLocaleString()} vehicles/day`);
        setElemText('traffic-road-type', data.traffic.roadClassification || 'Primary Corridor');
        setElemText('traffic-peak-hours', data.traffic.peakHours || '8:00 AM – 8:00 PM');
        setElemText('traffic-ingress', data.traffic.ingressQuality || 'Direct Ingress');
      }
    } catch (err) {
      console.error('Error rendering traffic:', err);
    }

    try {
      // 5. Section D: Competitors Table
      if (data.competition) {
        setElemText('comp-gap-summary', data.competition.gapSummary || 'High demand deficit');
        const compTableBody = document.getElementById('dash-comp-table-body');
        if (compTableBody && Array.isArray(data.competition.competitors)) {
          compTableBody.innerHTML = data.competition.competitors.map(c => `
            <tr>
              <td><strong>${c.name}</strong><br><span style="font-size:0.75rem;color:var(--text-secondary);">${c.operator || ''}</span></td>
              <td><span class="mono-tag">${c.distanceKm} km</span></td>
              <td>${c.guns || ''}</td>
              <td>${c.avgUtilization || ''}</td>
              <td style="font-size:0.78125rem;color:var(--text-secondary);">${c.gapAnalysis || ''}</td>
            </tr>
          `).join('');
        }
      }
    } catch (err) {
      console.error('Error rendering competitors:', err);
    }

    try {
      // 6. Section E: Grid Feasibility
      if (data.grid) {
        const gridBadge = document.getElementById('dash-grid-badge');
        if (gridBadge) {
          gridBadge.innerText = `${data.grid.status || 'SUITABLE'} FOR FAST CHARGING`;
          gridBadge.className = data.grid.status === 'SUITABLE' ? 'status-pill-badge status-good' : 'status-pill-badge status-warn';
        }
        setElemText('grid-substation-name', data.grid.substationName || 'Local 11kV Substation');
        setElemText('grid-distance', `${data.grid.distanceKm || 0.8} km from property boundary`);
        setElemText('grid-headroom', `${data.grid.availableHeadroomKva || 300} kVA Available Headroom`);
        setElemText('grid-sanction-timeline', data.grid.sanctionFeasibility || 'Standard Commercial Sanction');
        setElemText('grid-feeder-notes', data.grid.notes || '11kV feeder available');
      }
    } catch (err) {
      console.error('Error rendering grid:', err);
    }

    try {
      // 7. Section F: Recommended Deployment Model
      if (data.deploymentModel) {
        setElemText('dash-deploy-title', data.deploymentModel.title || '60kW Dual Fast DC Charger');
        setElemText('dash-deploy-category', data.deploymentModel.category || 'URBAN HUB');
        setElemText('dash-deploy-badge', data.deploymentModel.badge || 'RECOMMENDED');
        setElemText('dash-deploy-summary', data.deploymentModel.summary || 'Optimized configuration for location');

        const reasonsGrid = document.getElementById('dash-deploy-reasons');
        if (reasonsGrid && Array.isArray(data.deploymentModel.reasons)) {
          reasonsGrid.innerHTML = data.deploymentModel.reasons.map((r, i) => `
            <div class="reason-box">
              <strong style="color:var(--accent-orange);display:block;margin-bottom:4px;">0${i + 1} STRATEGIC RATIONALE</strong>
              ${r}
            </div>
          `).join('');
        }
      }
    } catch (err) {
      console.error('Error rendering deployment model:', err);
    }

    try {
      // 8. Section G: CapEx Breakdown
      if (data.capex) {
        setElemText('capex-range-text', `₹${data.capex.totalMinLakh || 25} – ₹${data.capex.totalMaxLakh || 35} Lakhs`);
        const capexListContainer = document.getElementById('dash-capex-list');
        if (capexListContainer && Array.isArray(data.capex.breakdown)) {
          capexListContainer.innerHTML = data.capex.breakdown.map((item) => `
            <div class="capex-item-row">
              <div>
                <strong>${item.category}</strong>
                <span class="mono-tag" style="margin-left:8px;">${item.tag || ''}</span>
              </div>
              <div>
                <span class="mono-tag">${item.percent}%</span>
                <strong style="font-family:var(--font-mono);margin-left:12px;">₹${item.amountLakh}L</strong>
              </div>
            </div>
          `).join('');
        }

        // Cost Reduction Section Dynamic Calculation
        const minSaveLakh = (data.capex.totalMinLakh * 0.22).toFixed(2);
        const maxSaveLakh = (data.capex.totalMaxLakh * 0.30).toFixed(2);
        setElemText('cost-save-capex', `₹${minSaveLakh}L – ₹${maxSaveLakh}L`);
        setElemText('cost-save-opex', '28% – 35% Lower');
        setElemText('cost-save-payback', '4.5 Months Faster');
      }
    } catch (err) {
      console.error('Error rendering capex & cost reduction:', err);
    }

    try {
      // 9. Financial Simulator
      if (data.financials && data.financials.baseline && data.capex) {
        this._initFinancialSimulator(data.financials.baseline, data.capex);
      }
    } catch (err) {
      console.error('Error initializing financial simulator:', err);
    }

    try {
      // 10. Map & Sub-locations
      if (window.EVisionMapManager) {
        window.EVisionMapManager.renderDashboardMap('dashboard-interactive-map', data);
        this._bindDashboardMapControls();
      }

      const candidateList = data.subLocations || data.alternatives || [];
      this._renderSubLocationRecommendations(candidateList, 'roi');
    } catch (err) {
      console.error('Error rendering map or sub-locations:', err);
    }

    try {
      // 11. Verdict Card
      if (data.verdict) {
        setElemText('verdict-headline-text', data.verdict.recommendationHeadline || 'RECOMMENDED');
        setElemText('verdict-inv-stat', data.verdict.investmentSummary || '₹25 – ₹35 Lakhs');
        setElemText('verdict-payback-stat', data.verdict.paybackSummary || '~30 Months');
        setElemText('verdict-profit-stat', data.verdict.projectedMonthlyNetProfit || '₹1.8 Lakhs/mo');

        const landCostStatEl = document.getElementById('verdict-land-cost-stat');
        if (landCostStatEl) {
          const topLandCost = data.verdict.topSpotLandCost || '₹65–80 / sq.ft. / mo';
          landCostStatEl.innerHTML = `${topLandCost} <span class="mono-tag" style="font-size:0.625rem;padding:2px 6px;vertical-align:middle;">MODELED ESTIMATE</span>`;
        }

        const driversList = document.getElementById('verdict-drivers-list');
        if (driversList && Array.isArray(data.verdict.keyDrivers)) {
          driversList.innerHTML = data.verdict.keyDrivers.map(d => `
            <li class="reveal-el"><span class="bullet-dot"></span><span>${d}</span></li>
          `).join('');
        }

        const risksList = document.getElementById('verdict-risks-list');
        if (risksList && Array.isArray(data.verdict.keyRisks)) {
          risksList.innerHTML = data.verdict.keyRisks.map(r => `
            <li class="reveal-el"><span class="bullet-dot" style="background:var(--color-amber);"></span><span>${r}</span></li>
          `).join('');
        }
      }

      const visionLaunchBtn = document.getElementById('dash-btn-launch-vision');
      if (visionLaunchBtn) {
        visionLaunchBtn.href = `3dvision.html?projectType=${encodeURIComponent(this.formData.projectType || 'highway_hub')}`;
      }

      setTimeout(() => {
        this._initScrollReveal();
        this._revealVerdictHeadline();
      }, 120);
    } catch (err) {
      console.error('Error rendering verdict card:', err);
    }
  }

  /**
   * Renders the ROI-Ranked Sub-Location Candidate Recommendations list with dynamic sorting.
   * @param {Array} candidates
   * @param {string} sortKey - 'roi' | 'investment' | 'demand'
   */
  _renderSubLocationRecommendations(candidates, sortKey = 'roi') {
    const container = document.getElementById('dash-alt-sites-grid');
    if (!container || !candidates || !candidates.length) return;

    this.cachedSubLocations = candidates;

    // Clone and sort
    const sorted = [...candidates].sort((a, b) => {
      if (sortKey === 'investment') {
        const aCost = (a.metrics && a.metrics.investmentAvg) || 999;
        const bCost = (b.metrics && b.metrics.investmentAvg) || 999;
        return aCost - bCost;
      } else if (sortKey === 'demand') {
        const aDem = (a.metrics && a.metrics.demandScore) || (a.score || 0);
        const bDem = (b.metrics && b.metrics.demandScore) || (b.score || 0);
        return bDem - aDem;
      } else {
        // Default: 'roi'
        const aRoi = (a.metrics && a.metrics.roiScore) || a.roiScore || a.score || 0;
        const bRoi = (b.metrics && b.metrics.roiScore) || b.roiScore || b.score || 0;
        return bRoi - aRoi;
      }
    });

    container.innerHTML = sorted.map((alt, idx) => {
      const isTop = idx === 0;
      const starIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="#F2542D" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
      const whyPoints = (alt.whyThisSpot || [alt.reason || 'Optimal transit location']).map(pt => `
        <li class="subloc-why-item">
          <span class="subloc-bullet"></span>
          <span>${pt}</span>
        </li>
      `).join('');

      return `
        <div class="subloc-candidate-card reveal-el ${isTop ? 'is-top-pick' : ''}" data-lat="${alt.lat}" data-lng="${alt.lng}" data-alt-id="${alt.id}">
          <div class="subloc-card-header">
            <div class="subloc-header-left">
              <span class="subloc-rank-pill ${isTop ? 'rank-top' : ''}">${starIcon} #${String(idx + 1).padStart(2, '0')}</span>
              <div>
                <h4 class="subloc-card-title">${alt.name}</h4>
                <div class="subloc-locality-meta">
                  <span>${alt.locality || 'Catchment Corridor'}</span>
                  <span>•</span>
                  <span>${alt.distanceKm} km from center</span>
                </div>
              </div>
            </div>
            <div class="subloc-header-right">
              <div class="subloc-roi-badge">
                <span class="subloc-roi-lbl">ROI SCORE</span>
                <span class="subloc-roi-num">${alt.roiScore || alt.score} <small>/ 100</small></span>
              </div>
            </div>
          </div>

          <!-- 4-Box Key Financial & Operating Metrics Grid -->
          <div class="subloc-metrics-grid">
            <div class="subloc-metric-box">
              <span class="subloc-metric-lbl">Estimated ROI</span>
              <div class="subloc-metric-val text-green">${alt.estimatedRoiAnnual || '18–22%'}</div>
              <span class="subloc-metric-sub">annual modeled yield</span>
            </div>

            <div class="subloc-metric-box">
              <span class="subloc-metric-lbl">Payback Period</span>
              <div class="subloc-metric-val text-dark">${alt.paybackYears || '3.2–3.9 Yrs'}</div>
              <span class="subloc-metric-sub">capital recovery</span>
            </div>

            <div class="subloc-metric-box">
              <span class="subloc-metric-lbl">Est. Land / Rent Cost</span>
              <div class="subloc-metric-val text-orange">${alt.landCostLease || '₹65–80 / sq.ft. / mo'}</div>
              <span class="subloc-metric-sub tag-pill">[${alt.landCostTag || 'MODELED ESTIMATE'}]</span>
            </div>

            <div class="subloc-metric-box">
              <span class="subloc-metric-lbl">Recommended Setup</span>
              <div class="subloc-metric-val text-dark font-compact">${alt.recommendedDeployment || '4W DC Fast Hub + 2W'}</div>
              <span class="subloc-metric-sub text-green">${alt.capexDelta || 'Turnkey Ready'}</span>
            </div>
          </div>

          <!-- Expandable Why This Spot Breakdown -->
          <details class="subloc-why-details" ${isTop ? 'open' : ''}>
            <summary class="subloc-why-summary">
              <span style="font-weight:700;">Why this spot:</span>
              <span class="subloc-chevron">▾</span>
            </summary>
            <ul class="subloc-why-list">
              ${whyPoints}
            </ul>
          </details>

          <!-- Card Bottom Action Bar -->
          <div class="subloc-card-footer">
            <div class="subloc-purchase-stat">
              <span style="color:var(--text-muted);font-size:0.75rem;">Purchase Est:</span>
              <strong style="font-size:0.8125rem;color:var(--text-primary);margin-left:4px;">${alt.landCostPurchase || '₹1.2–1.6 Cr (per acre-eq.)'}</strong>
            </div>
            <button type="button" class="btn btn-secondary btn-sm btn-inspect-subloc">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Inspect on Map ↗
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Bind sort buttons
    document.querySelectorAll('.subloc-sort-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-sort') === sortKey);
      btn.onclick = () => {
        const nextSort = btn.getAttribute('data-sort');
        this._renderSubLocationRecommendations(this.cachedSubLocations, nextSort);
      };
    });

    // Bind map pan and hover highlight sync for candidate cards
    document.querySelectorAll('.subloc-candidate-card').forEach(card => {
      const lat = parseFloat(card.getAttribute('data-lat'));
      const lng = parseFloat(card.getAttribute('data-lng'));
      const altId = card.getAttribute('data-alt-id');

      card.addEventListener('click', (e) => {
        // Prevent toggle if clicking details summary
        if (e.target.closest('summary')) return;
        window.EVisionMapManager.panToAlternative(lat, lng, altId);
      });

      card.addEventListener('mouseenter', () => {
        document.querySelectorAll('.subloc-candidate-card').forEach(c => c.classList.remove('map-hovered'));
        card.classList.add('map-hovered');
        window.EVisionMapManager.highlightAlternative(altId, true);
      });

      card.addEventListener('mouseleave', () => {
        card.classList.remove('map-hovered');
        window.EVisionMapManager.highlightAlternative(altId, false);
      });
    });
  }

  /* -------------------------------------------------------------
   * DYNAMIC LIVE FINANCIAL SIMULATOR
   * ------------------------------------------------------------- */
  _initFinancialSimulator(baseline, capex) {
    const tariffSlider = document.getElementById('slider-tariff');
    const priceSlider = document.getElementById('slider-selling-price');
    const utilSlider = document.getElementById('slider-utilization');
    const daysSlider = document.getElementById('slider-days');

    if (!tariffSlider || !priceSlider || !utilSlider || !daysSlider) return;

    // Set baseline initial slider values
    tariffSlider.value = baseline.tariffPerKwh;
    priceSlider.value = baseline.sellingPricePerKwh;
    utilSlider.value = baseline.utilizationPercent;
    daysSlider.value = baseline.operatingDaysPerMonth;

    const recalculate = () => {
      const tariff = parseFloat(tariffSlider.value);
      const price = parseFloat(priceSlider.value);
      const util = parseFloat(utilSlider.value);
      const days = parseInt(daysSlider.value, 10);

      // Slider badge flash effect — momentarily highlights the updating badge
      const flashBadge = (id, text) => {
        const badge = document.getElementById(id);
        if (!badge) return;
        badge.innerText = text;
        badge.classList.add('updating');
        clearTimeout(badge._flashTimer);
        badge._flashTimer = setTimeout(() => badge.classList.remove('updating'), 380);
      };

      flashBadge('badge-val-tariff', `₹${tariff.toFixed(2)} / kWh`);
      flashBadge('badge-val-price', `₹${price.toFixed(2)} / kWh`);
      flashBadge('badge-val-util', `${util}% Capacity`);
      flashBadge('badge-val-days', `${days} Days / mo`);

      // Recalculate Live Numbers
      const totalKw = this.analysisResult.hardwareConfig.reduce((acc, curr) => acc + curr.powerKw, 0) || 120;
      const dailyKwh = Math.round(totalKw * 24 * (util / 100));
      const monthlyKwh = dailyKwh * days;
      const monthlyRevenue = Math.round(monthlyKwh * price);
      const monthlyPowerCost = Math.round(monthlyKwh * tariff);
      const monthlyOpEx = Math.round(monthlyPowerCost + (monthlyRevenue * 0.08) + 15000);
      const monthlyProfit = Math.round(monthlyRevenue - monthlyOpEx);

      const avgCapEx = ((capex.totalMinLakh + capex.totalMaxLakh) / 2) * 100000;
      const paybackMonths = Math.max(10, Math.round(avgCapEx / (monthlyProfit > 0 ? monthlyProfit : 1)));
      const annualRoi = Math.max(0, Math.min(65, Math.round(((monthlyProfit * 12) / avgCapEx) * 100)));

      // Update DOM — flash calc cells to signal new values
      const flashCell = (id, text) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.innerText = text;
        const cell = el.closest('.calc-metric-box');
        if (cell) {
          cell.classList.add('flash');
          clearTimeout(cell._flashTimer);
          cell._flashTimer = setTimeout(() => cell.classList.remove('flash'), 320);
        }
      };

      flashCell('calc-daily-kwh', `${dailyKwh.toLocaleString()} kWh`);
      flashCell('calc-monthly-rev', `₹${(monthlyRevenue / 100000).toFixed(2)}L`);
      flashCell('calc-monthly-profit', `₹${(monthlyProfit / 100000).toFixed(2)}L`);
      flashCell('calc-annual-roi', `${annualRoi}%`);
      document.getElementById('calc-payback-months').innerText = `${paybackMonths} Mo (${(paybackMonths / 12).toFixed(1)} Yrs)`;
    };

    [tariffSlider, priceSlider, utilSlider, daysSlider].forEach(slider => {
      slider.addEventListener('input', recalculate);
    });

    // Run initial calculation
    recalculate();
  }

  /* -------------------------------------------------------------
   * MAP LAYER CONTROLS BINDING
   * ------------------------------------------------------------- */
  _bindDashboardMapControls() {
    document.querySelectorAll('.layer-toggle-btn[data-layer]').forEach(btn => {
      btn.addEventListener('click', () => {
        const layerKey = btn.getAttribute('data-layer');
        btn.classList.toggle('active');
        const isActive = btn.classList.contains('active');
        window.EVisionMapManager.toggleLayer(layerKey, isActive);
      });
    });
  }

  /* -------------------------------------------------------------
   * SCROLL-REVEAL — IntersectionObserver system
   * Observes all .reveal-el elements; adds .is-visible once they
   * enter the viewport. Children get staggered --reveal-delay.
   * ------------------------------------------------------------- */
  _initScrollReveal() {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal-el').forEach(el => el.classList.add('is-visible'));
      return;
    }

    // Tag direct children of reveal-parent groups with stagger delays
    document.querySelectorAll('.reveal-parent').forEach(parent => {
      const children = parent.querySelectorAll(':scope > .reveal-el');
      children.forEach((child, idx) => {
        child.style.setProperty('--reveal-delay', `${idx * 90}ms`);
      });
    });

    // Also stagger any standalone sibling groups
    const groups = {};
    document.querySelectorAll('.reveal-el[data-reveal-group]').forEach(el => {
      const g = el.getAttribute('data-reveal-group');
      if (!groups[g]) groups[g] = [];
      groups[g].push(el);
    });
    Object.values(groups).forEach(els => {
      els.forEach((el, idx) => {
        el.style.setProperty('--reveal-delay', `${idx * 90}ms`);
      });
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // only reveal once
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal-el').forEach(el => observer.observe(el));
    this._scrollObserver = observer;
  }

  /* -------------------------------------------------------------
   * VERDICT HEADLINE — Word-by-word fade+rise reveal
   * ------------------------------------------------------------- */
  _revealVerdictHeadline() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const el = document.getElementById('verdict-headline-text');
    if (!el) return;

    const text = el.innerText;
    const words = text.split(' ');
    el.innerHTML = words.map((word, idx) =>
      `<span class="verdict-word" style="--word-delay:${idx * 52}ms">${word}&nbsp;</span>`
    ).join('');

    // Use IntersectionObserver to trigger the reveal as verdict card scrolls in
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.querySelectorAll('.verdict-word').forEach(w => w.classList.add('revealed'));
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    obs.observe(el.closest('.verdict-card') || el);
  }

  /* -------------------------------------------------------------
   * UTILITIES
   * ------------------------------------------------------------- */
  /**
   * Eased count-up animation using ease-out cubic deceleration.
   * Numbers decelerate as they approach the final value — premium feel.
   * @param {string} elementId
   * @param {number} start
   * @param {number} end
   * @param {number} duration  — ms, typically 900–1200
   * @param {number} [delayMs] — optional pre-delay before starting
   * @param {string} [suffix]  — optional suffix e.g. '%'
   */
  _animateNumber(elementId, start, end, duration, delayMs = 0, suffix = '') {
    const el = document.getElementById(elementId);
    if (!el) return;

    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.innerText = end + suffix;
      return;
    }

    const run = () => {
      let startTimestamp = null;
      // Ease-out cubic: t → 1 - (1-t)^3
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const elapsed = timestamp - startTimestamp;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        const current = Math.floor(eased * (end - start) + start);
        el.innerText = current.toLocaleString() + suffix;
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          el.innerText = end.toLocaleString() + suffix;
        }
      };
      window.requestAnimationFrame(step);
    };

    if (delayMs > 0) {
      setTimeout(run, delayMs);
    } else {
      run();
    }
  }

  /* ==========================================================
   * QUESTIONNAIRE POLISH — Progress Bar, Icons, Card Stagger
   * ========================================================== */

  /**
   * Icon SVG paths keyed by data-value (option cards) and data-vehicle (checkbox cards).
   * Using simple Feather/Lucide-style 24x24 path data.
   */
  static get CARD_ICONS() {
    return {
      // Project Type
      public_station: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
      highway_hub:    '<path d="M3 17l6-14h6l6 14"/><line x1="6" y1="10" x2="18" y2="10"/>',
      fleet_charging: '<rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
      commercial_park:'<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22V12h6v10"/><rect x="8" y="6" width="2" height="2"/><rect x="14" y="6" width="2" height="2"/><rect x="8" y="11" width="2" height="2"/><rect x="14" y="11" width="2" height="2"/>',
      petrol_pump:    '<path d="M4 22V4h10v18H4z"/><rect x="6" y="8" width="4" height="4"/><path d="M14 7h2l3 3v8a1 1 0 0 1-1 1h-1V11h-3"/>',
      workplace:      '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>',
      residential:    '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>',
      // Scale
      small:          '<rect x="2" y="14" width="6" height="8"/><rect x="9" y="8" width="6" height="14"/><rect x="16" y="4" width="6" height="18"/>',
      medium:         '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
      large:          '<path d="M15 3h6v6"/><path d="M9 21H3v-6"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>',
      // Budget
      under_10:       '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
      '10_25':        '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
      '25_50':        '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/><circle cx="18" cy="5" r="2" fill="var(--accent-orange)" stroke="none"/>',
      '50_1cr':       '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
      '1cr_plus':     '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
      not_decided:    '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
      // Grid Capacity
      '30_60':        '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
      '120_240':      '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" style="opacity:0.4;transform:scale(0.6) translate(4px,5px)"/>',
      '360_500':      '<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="M8 17l4-5 4 5"/>',
      custom:         '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
      // Property Types (adaptive step)
      petrol_pump_p:  '<path d="M4 22V4h10v18H4z"/><rect x="6" y="8" width="4" height="4"/>',
      highway_dhaba:  '<path d="M3 17l6-14h6l6 14"/><line x1="6" y1="10" x2="18" y2="10"/>',
      commercial_mall:'<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22V12h6v10"/>',
      residential_apt:'<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
      office_campus:  '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>',
      standalone:     '<circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 1 8 8c0 6-8 14-8 14S4 16 4 10a8 8 0 0 1 8-8z"/>',
      // Vehicles (checkbox cards)
      '2w':           '<circle cx="6" cy="18" r="3"/><circle cx="18" cy="18" r="3"/><path d="M6 18L6 9l6-6 6 9H6"/>',
      '3w':           '<circle cx="12" cy="18" r="3"/><path d="M3 18a9 9 0 0 1 9-9 9 9 0 0 1 9 9"/><path d="M12 9V3l-3 3m3-3l3 3"/>',
      '4w':           '<rect x="1" y="6" width="22" height="12" rx="3"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M5 6l3-4h8l3 4"/>',
      commercial:     '<rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
    };
  }

  /**
   * Injects the 8-segment progress bar below the stepper nav.
   */
  _injectProgressBar() {
    const nav = document.querySelector('.stepper-nav-container');
    if (!nav || document.querySelector('.step-progress-bar')) return;

    const bar = document.createElement('div');
    bar.className = 'step-progress-bar';
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-valuemin', '1');
    bar.setAttribute('aria-valuemax', '8');

    for (let i = 0; i < 8; i++) {
      const seg = document.createElement('div');
      seg.className = 'step-seg';
      seg.dataset.segIndex = String(i);
      bar.appendChild(seg);
    }

    nav.after(bar);
    this._updateProgressBar(0); // paint initial state
  }

  /**
   * Updates the segmented progress bar to reflect stepIndex.
   * Completed = green, active = orange animation, upcoming = neutral.
   */
  _updateProgressBar(stepIndex) {
    const segments = document.querySelectorAll('.step-seg');
    segments.forEach((seg, idx) => {
      seg.classList.remove('seg-completed', 'seg-active');
      if (idx < stepIndex) {
        seg.classList.add('seg-completed');
      } else if (idx === stepIndex) {
        // Force re-trigger the animation even if class already present
        void seg.offsetWidth;
        seg.classList.add('seg-active');
      }
    });

    const bar = document.querySelector('.step-progress-bar');
    if (bar) bar.setAttribute('aria-valuenow', String(stepIndex + 1));
  }

  /**
   * Injects icon badges, checkmark badges, and SVG checkboxes into
   * every option-card and checkbox-card across all steps.
   */
  _injectCardEnhancements() {
    const icons = EVisionPlannerApp.CARD_ICONS;
    const checkSVG = `<svg viewBox="0 0 14 14"><polyline class="check-svg-path" points="2,7 6,11 12,3"/></svg>`;

    // Option cards — add icon badge + checkmark
    document.querySelectorAll('.option-card[data-value]').forEach(card => {
      const val = card.getAttribute('data-value');
      const iconPath = icons[val] || icons['standalone'];

      // Icon badge
      if (!card.querySelector('.card-icon-badge')) {
        const badge = document.createElement('div');
        badge.className = 'card-icon-badge';
        badge.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${iconPath}</svg>`;
        card.insertBefore(badge, card.firstChild);
      }

      // Checkmark badge
      if (!card.querySelector('.card-check')) {
        const check = document.createElement('div');
        check.className = 'card-check';
        check.innerHTML = `<svg viewBox="0 0 12 12" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="2,6 5,9 10,3"/></svg>`;
        card.appendChild(check);
      }
    });

    // Checkbox cards — replace text checkbox with animated SVG, add icon + checkmark
    document.querySelectorAll('.checkbox-card[data-vehicle]').forEach(card => {
      const veh = card.getAttribute('data-vehicle');
      const iconPath = icons[veh] || '';

      // Replace plain text checkbox with SVG stroke-animated version
      const cb = card.querySelector('.custom-checkbox');
      if (cb && !cb.querySelector('svg')) {
        cb.textContent = ''; // remove the ✓ text
        cb.insertAdjacentHTML('beforeend', checkSVG);
      }

      // Icon badge — insert before the checkbox or as first child of the content div
      if (!card.querySelector('.card-icon-badge') && iconPath) {
        const badge = document.createElement('div');
        badge.className = 'card-icon-badge';
        badge.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${iconPath}</svg>`;
        // Insert after the custom-checkbox
        if (cb) cb.after(badge);
      }
    });
  }

  /**
   * Staggers card entrance animation for all selectable cards
   * within a given step card element.
   */
  _staggerCards(stepCard) {
    if (!stepCard) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cards = stepCard.querySelectorAll('.option-card, .checkbox-card, .counter-card');
    if (!cards.length) return;

    if (reduced) {
      cards.forEach(c => c.classList.remove('card-stagger-ready', 'card-stagger-in'));
      return;
    }

    // Set initial invisible state
    cards.forEach((card, idx) => {
      card.classList.remove('card-stagger-in');
      card.classList.add('card-stagger-ready');
      card.style.setProperty('--card-delay', `${idx * 48}ms`);
    });

    // Double rAF forces a paint before we transition to visible
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        cards.forEach(card => {
          card.classList.remove('card-stagger-ready');
          card.classList.add('card-stagger-in');
        });
      });
    });
  }
}

// Instantiate and initialize on DOM Ready or immediately if already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (!window.EVisionPlannerApp) {
      window.EVisionPlannerApp = new EVisionPlannerApp();
      window.EVisionPlannerApp.init();
    }
  });
} else {
  if (!window.EVisionPlannerApp) {
    window.EVisionPlannerApp = new EVisionPlannerApp();
    window.EVisionPlannerApp.init();
  }
}
