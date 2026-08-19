/**
 * EVision 3D Vision & 2D CAD Blueprint Facility Studio
 * Integrated Architectural Spatial Twin & CAD Drafting Engine
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. FACILITY CATALOG & METRIC DEFINITIONS (INR ₹ PRICING)
     ========================================================================== */
  const FACILITY_TYPES = {
    EV_CHARGER: {
      type: 'EV_CHARGER',
      name: 'Ultra-Fast DC Dual Charger',
      category: 'charging',
      defaultWidth: 5,
      defaultDepth: 6,
      defaultHeight: 3.5,
      color: '#F2542D',
      icon: '⚡',
      powerKw: 180,
      baseCostInr: 1600000,
      description: 'Dual-gun CCS2 180kW DC fast charger with solar canopy'
    },
    EV_SWAP: {
      type: 'EV_SWAP',
      name: 'Automated Battery Swap Station',
      category: 'charging',
      defaultWidth: 6,
      defaultDepth: 5,
      defaultHeight: 3.2,
      color: '#3B82F6',
      icon: '🔋',
      powerKw: 75,
      baseCostInr: 2200000,
      description: 'Automated 2W/3W smart robotic battery exchange kiosk'
    },
    STORE: {
      type: 'STORE',
      name: 'Highway Express Mart',
      category: 'building',
      defaultWidth: 12,
      defaultDepth: 8,
      defaultHeight: 4.2,
      color: '#0284C7',
      icon: '🛒',
      powerKw: 25,
      baseCostInr: 2800000,
      description: 'Retail convenience store with glass facade & HVAC'
    },
    CAFE: {
      type: 'CAFE',
      name: 'Chai & Coffee Kiosk',
      category: 'building',
      defaultWidth: 8,
      defaultDepth: 7,
      defaultHeight: 3.8,
      color: '#D97706',
      icon: '☕',
      powerKw: 20,
      baseCostInr: 2100000,
      description: 'Quick-service cafe with timber pergola & deck seating'
    },
    WASHROOM: {
      type: 'WASHROOM',
      name: 'Public Restrooms & Sanitization',
      category: 'building',
      defaultWidth: 6,
      defaultDepth: 5,
      defaultHeight: 3.4,
      color: '#7C3AED',
      icon: '🚻',
      powerKw: 8,
      baseCostInr: 850000,
      description: 'Hygienic accessible restrooms with baby-care stall'
    },
    AIR_WATER: {
      type: 'AIR_WATER',
      name: 'Tyre Air & Nitrogen Bay',
      category: 'amenity',
      defaultWidth: 3.5,
      defaultDepth: 3.5,
      defaultHeight: 2.8,
      color: '#06B6D4',
      icon: '💨',
      powerKw: 5,
      baseCostInr: 180000,
      description: 'Digital tyre air pressure dispenser & windscreen wash'
    },
    PARKING_EV: {
      type: 'PARKING_EV',
      name: 'Dedicated EV Priority Bays',
      category: 'parking',
      defaultWidth: 6,
      defaultDepth: 5,
      defaultHeight: 0.1,
      color: '#059669',
      icon: '🅿️',
      powerKw: 0,
      baseCostInr: 150000,
      description: '2 EV priority bays with green road coating & painted stripes'
    },
    PARKING_CAR: {
      type: 'PARKING_CAR',
      name: 'Customer Parking (3 Stalls)',
      category: 'parking',
      defaultWidth: 7.5,
      defaultDepth: 5,
      defaultHeight: 0.1,
      color: '#475569',
      icon: '🚗',
      powerKw: 0,
      baseCostInr: 120000,
      description: '3 asphalt passenger car parking stalls with demarcation'
    },
    TRANSFORMER: {
      type: 'TRANSFORMER',
      name: '11kV HT Substation & Compact Transformer',
      category: 'utility',
      defaultWidth: 4.5,
      defaultDepth: 4,
      defaultHeight: 3.0,
      color: '#DC2626',
      icon: '⚡',
      powerKw: 0,
      baseCostInr: 950000,
      description: '250-500 kVA dedicated step-down transformer yard'
    },
    GREENERY: {
      type: 'GREENERY',
      name: 'Landscape Green Belt & Trees',
      category: 'landscape',
      defaultWidth: 6,
      defaultDepth: 4,
      defaultHeight: 4.5,
      color: '#16A34A',
      icon: '🌳',
      powerKw: 0,
      baseCostInr: 95000,
      description: 'Lush tree belt with permeable soil and shrubbery'
    },
    LIGHT_POLE: {
      type: 'LIGHT_POLE',
      name: 'Solar Smart Street Light',
      category: 'utility',
      defaultWidth: 1.5,
      defaultDepth: 1.5,
      defaultHeight: 6.0,
      color: '#EAB308',
      icon: '💡',
      powerKw: -0.5,
      baseCostInr: 45000,
      description: 'Solar LED illumination mast with night glow point light'
    },
    AD_BOARD: {
      type: 'AD_BOARD',
      name: 'Large Advertisement Board',
      category: 'commercial',
      defaultWidth: 8,
      defaultDepth: 2,
      defaultHeight: 6,
      color: '#F59E0B',
      icon: '📢',
      powerKw: 5,
      baseCostInr: 350000,
      description: 'High-visibility roadside dual-sided unipole billboard'
    }
  };

  /* ==========================================================================
     2. PRESET BLUEPRINT LAYOUTS
     ========================================================================== */
  const PRESETS = [
    {
      id: 'highway_hub',
      name: '⚡ EV Highway Superhub',
      description: 'Full express highway station with Mart, Cafe, Restrooms & 4 Fast DC Stalls',
      plot: { width: 52, depth: 36 },
      facilities: [
        { type: 'STORE', name: 'Highway Express Mart', x: 4, y: 3, width: 13, depth: 8, height: 4.2, rotation: 0, color: '#0284C7', powerKw: 25, baseCostInr: 2800000 },
        { type: 'CAFE', name: 'Chai & Coffee Kiosk', x: 18, y: 3, width: 9, depth: 8, height: 3.8, rotation: 0, color: '#D97706', powerKw: 20, baseCostInr: 2100000 },
        { type: 'WASHROOM', name: 'Public Restrooms', x: 28, y: 3, width: 7, depth: 6, height: 3.4, rotation: 0, color: '#7C3AED', powerKw: 8, baseCostInr: 850000 },
        { type: 'AIR_WATER', name: 'Tyre Air & Water', x: 36, y: 3, width: 4, depth: 4, height: 2.8, rotation: 0, color: '#06B6D4', powerKw: 5, baseCostInr: 180000 },
        { type: 'TRANSFORMER', name: '11kV 500kVA Substation', x: 43, y: 3, width: 5, depth: 5, height: 3.0, rotation: 0, color: '#DC2626', powerKw: 0, baseCostInr: 950000 },
        { type: 'EV_CHARGER', name: 'Ultra-Fast DC Stall A', x: 4, y: 16, width: 5.5, depth: 7, height: 3.5, rotation: 0, color: '#F2542D', powerKw: 240, baseCostInr: 1800000 },
        { type: 'EV_CHARGER', name: 'Ultra-Fast DC Stall B', x: 11, y: 16, width: 5.5, depth: 7, height: 3.5, rotation: 0, color: '#F2542D', powerKw: 240, baseCostInr: 1800000 },
        { type: 'EV_CHARGER', name: 'Ultra-Fast DC Stall C', x: 18, y: 16, width: 5.5, depth: 7, height: 3.5, rotation: 0, color: '#F2542D', powerKw: 180, baseCostInr: 1600000 },
        { type: 'EV_CHARGER', name: 'Ultra-Fast DC Stall D', x: 25, y: 16, width: 5.5, depth: 7, height: 3.5, rotation: 0, color: '#F2542D', powerKw: 180, baseCostInr: 1600000 },
        { type: 'PARKING_EV', name: 'EV Priority Bays', x: 33, y: 16, width: 6, depth: 5, height: 0.1, rotation: 0, color: '#059669', powerKw: 0, baseCostInr: 150000 },
        { type: 'PARKING_CAR', name: 'Visitor Parking', x: 41, y: 16, width: 8, depth: 5, height: 0.1, rotation: 0, color: '#475569', powerKw: 0, baseCostInr: 120000 },
        { type: 'GREENERY', name: 'Frontage Landscape', x: 4, y: 28, width: 20, depth: 4, height: 4.5, rotation: 0, color: '#16A34A', powerKw: 0, baseCostInr: 180000 },
        { type: 'LIGHT_POLE', name: 'Solar Lamp Post A', x: 2, y: 14, width: 1.5, depth: 1.5, height: 6.0, rotation: 0, color: '#EAB308', powerKw: -0.5, baseCostInr: 45000 },
        { type: 'LIGHT_POLE', name: 'Solar Lamp Post B', x: 49, y: 14, width: 1.5, depth: 1.5, height: 6.0, rotation: 0, color: '#EAB308', powerKw: -0.5, baseCostInr: 45000 }
      ]
    },
    {
      id: 'petrol_pump',
      name: '⛽ Petrol Pump Retrofit Hub',
      description: 'Forecourt integration with dual DC chargers, tyre bay & retail mart',
      plot: { width: 42, depth: 28 },
      facilities: [
        { type: 'STORE', name: 'Forecourt Convenience Mart', x: 4, y: 3, width: 12, depth: 7, height: 4.0, rotation: 0, color: '#0284C7', powerKw: 20, baseCostInr: 2400000 },
        { type: 'AIR_WATER', name: 'Digital Air & Nitrogen', x: 18, y: 3, width: 4, depth: 4, height: 2.8, rotation: 0, color: '#06B6D4', powerKw: 5, baseCostInr: 180000 },
        { type: 'TRANSFORMER', name: '11kV HT Compact Unit', x: 33, y: 3, width: 4.5, depth: 4, height: 3.0, rotation: 0, color: '#DC2626', powerKw: 0, baseCostInr: 950000 },
        { type: 'EV_CHARGER', name: 'Dual 120kW DC Fast Charger', x: 6, y: 14, width: 6, depth: 7, height: 3.5, rotation: 0, color: '#F2542D', powerKw: 120, baseCostInr: 1400000 },
        { type: 'EV_CHARGER', name: 'Dual 60kW DC Fast Charger', x: 15, y: 14, width: 6, depth: 7, height: 3.5, rotation: 0, color: '#F2542D', powerKw: 60, baseCostInr: 1100000 },
        { type: 'PARKING_EV', name: 'EV Priority Bay', x: 24, y: 14, width: 6, depth: 5, height: 0.1, rotation: 0, color: '#059669', powerKw: 0, baseCostInr: 150000 },
        { type: 'GREENERY', name: 'Perimeter Garden', x: 4, y: 23, width: 14, depth: 3, height: 4.5, rotation: 0, color: '#16A34A', powerKw: 0, baseCostInr: 95000 },
        { type: 'LIGHT_POLE', name: 'Forecourt Mast Light', x: 37, y: 20, width: 1.5, depth: 1.5, height: 6.0, rotation: 0, color: '#EAB308', powerKw: -0.5, baseCostInr: 45000 }
      ]
    },
    {
      id: 'commercial_park',
      name: '🏢 Urban Mall & Commercial Hub',
      description: 'Destination charging with Battery Swap, Cafe, EV Priority Stalls & 3 Fast DC Guns',
      plot: { width: 46, depth: 32 },
      facilities: [
        { type: 'CAFE', name: 'Mall Promenade Cafe', x: 4, y: 3, width: 10, depth: 8, height: 3.8, rotation: 0, color: '#D97706', powerKw: 25, baseCostInr: 2200000 },
        { type: 'EV_SWAP', name: '2W/3W Battery Swap Depot', x: 16, y: 3, width: 7, depth: 6, height: 3.2, rotation: 0, color: '#3B82F6', powerKw: 75, baseCostInr: 2200000 },
        { type: 'TRANSFORMER', name: '250 kVA Transformer Yard', x: 36, y: 3, width: 5, depth: 4, height: 3.0, rotation: 0, color: '#DC2626', powerKw: 0, baseCostInr: 950000 },
        { type: 'EV_CHARGER', name: 'High-Power DC Stall 1', x: 4, y: 15, width: 5.5, depth: 7, height: 3.5, rotation: 0, color: '#F2542D', powerKw: 180, baseCostInr: 1600000 },
        { type: 'EV_CHARGER', name: 'High-Power DC Stall 2', x: 12, y: 15, width: 5.5, depth: 7, height: 3.5, rotation: 0, color: '#F2542D', powerKw: 180, baseCostInr: 1600000 },
        { type: 'PARKING_EV', name: 'EV Priority Bays A', x: 20, y: 15, width: 6, depth: 5, height: 0.1, rotation: 0, color: '#059669', powerKw: 0, baseCostInr: 150000 },
        { type: 'PARKING_EV', name: 'EV Priority Bays B', x: 28, y: 15, width: 6, depth: 5, height: 0.1, rotation: 0, color: '#059669', powerKw: 0, baseCostInr: 150000 },
        { type: 'GREENERY', name: 'Promenade Green Bed', x: 4, y: 25, width: 18, depth: 4, height: 4.5, rotation: 0, color: '#16A34A', powerKw: 0, baseCostInr: 140000 },
        { type: 'LIGHT_POLE', name: 'Architectural Bollard Light', x: 42, y: 15, width: 1.5, depth: 1.5, height: 6.0, rotation: 0, color: '#EAB308', powerKw: -0.5, baseCostInr: 45000 }
      ]
    },
    {
      id: 'fleet_charging',
      name: '🚚 Fleet & Logistics Depot',
      description: 'Dedicated commercial depot with high-power fast charging & Battery Swapping',
      plot: { width: 54, depth: 38 },
      facilities: [
        { type: 'STORE', name: 'Fleet Operations Office', x: 4, y: 3, width: 14, depth: 8, height: 4.2, rotation: 0, color: '#0284C7', powerKw: 25, baseCostInr: 2800000 },
        { type: 'EV_SWAP', name: 'Robotic Battery Swap A', x: 20, y: 3, width: 8, depth: 6, height: 3.2, rotation: 0, color: '#3B82F6', powerKw: 100, baseCostInr: 2500000 },
        { type: 'EV_SWAP', name: 'Robotic Battery Swap B', x: 30, y: 3, width: 8, depth: 6, height: 3.2, rotation: 0, color: '#3B82F6', powerKw: 100, baseCostInr: 2500000 },
        { type: 'TRANSFORMER', name: '11kV 650kVA Dedicated Substation', x: 42, y: 3, width: 6, depth: 5, height: 3.0, rotation: 0, color: '#DC2626', powerKw: 0, baseCostInr: 1200000 },
        { type: 'EV_CHARGER', name: 'Fleet Fast DC Dispenser 1', x: 4, y: 16, width: 6, depth: 8, height: 3.6, rotation: 0, color: '#F2542D', powerKw: 240, baseCostInr: 1900000 },
        { type: 'EV_CHARGER', name: 'Fleet Fast DC Dispenser 2', x: 12, y: 16, width: 6, depth: 8, height: 3.6, rotation: 0, color: '#F2542D', powerKw: 240, baseCostInr: 1900000 },
        { type: 'EV_CHARGER', name: 'Fleet Fast DC Dispenser 3', x: 20, y: 16, width: 6, depth: 8, height: 3.6, rotation: 0, color: '#F2542D', powerKw: 240, baseCostInr: 1900000 },
        { type: 'PARKING_CAR', name: 'Van Staging Stalls', x: 29, y: 16, width: 10, depth: 6, height: 0.1, rotation: 0, color: '#475569', powerKw: 0, baseCostInr: 180000 },
        { type: 'AIR_WATER', name: 'Fleet Maintenance Bay', x: 42, y: 16, width: 5, depth: 5, height: 2.8, rotation: 0, color: '#06B6D4', powerKw: 10, baseCostInr: 250000 },
        { type: 'LIGHT_POLE', name: 'High-Mast Floodlight', x: 2, y: 30, width: 1.5, depth: 1.5, height: 6.0, rotation: 0, color: '#EAB308', powerKw: -0.5, baseCostInr: 45000 }
      ]
    },
    {
      id: 'public_station',
      name: '⚡ Public Urban Fast Station',
      description: 'Standard urban multi-gun DC charging station with amenities',
      plot: { width: 44, depth: 30 },
      facilities: [
        { type: 'STORE', name: 'Express Mart & Lounge', x: 4, y: 3, width: 11, depth: 7, height: 4.0, rotation: 0, color: '#0284C7', powerKw: 20, baseCostInr: 2400000 },
        { type: 'WASHROOM', name: 'Public Restrooms', x: 17, y: 3, width: 6, depth: 5, height: 3.4, rotation: 0, color: '#7C3AED', powerKw: 8, baseCostInr: 850000 },
        { type: 'TRANSFORMER', name: '250 kVA Transformer', x: 32, y: 3, width: 4.5, depth: 4, height: 3.0, rotation: 0, color: '#DC2626', powerKw: 0, baseCostInr: 950000 },
        { type: 'EV_CHARGER', name: 'Dual 120kW Fast DC Dispenser 1', x: 4, y: 14, width: 6, depth: 7, height: 3.5, rotation: 0, color: '#F2542D', powerKw: 120, baseCostInr: 1400000 },
        { type: 'EV_CHARGER', name: 'Dual 120kW Fast DC Dispenser 2', x: 13, y: 14, width: 6, depth: 7, height: 3.5, rotation: 0, color: '#F2542D', powerKw: 120, baseCostInr: 1400000 },
        { type: 'PARKING_EV', name: 'EV Priority Bays', x: 22, y: 14, width: 6, depth: 5, height: 0.1, rotation: 0, color: '#059669', powerKw: 0, baseCostInr: 150000 },
        { type: 'PARKING_CAR', name: 'Visitor Parking', x: 30, y: 14, width: 8, depth: 5, height: 0.1, rotation: 0, color: '#475569', powerKw: 0, baseCostInr: 120000 },
        { type: 'GREENERY', name: 'Greenery Buffer', x: 4, y: 24, width: 15, depth: 3, height: 4.5, rotation: 0, color: '#16A34A', powerKw: 0, baseCostInr: 95000 }
      ]
    }
  ];

  /* ==========================================================================
     3. REACTIVE STATE MANAGER
     ========================================================================== */
  class VisionState {
    constructor() {
      this.plot = { width: 52, depth: 36 };
      this.facilities = [];
      this.selectedId = null;
      this.timeOfDay = 'day';
      this.listeners = [];
      this.nextId = 1;
    }

    subscribe(fn) {
      this.listeners.push(fn);
    }

    notify(event, payload) {
      this.listeners.forEach(fn => {
        try { fn(event, payload); } catch (e) { console.error('VisionState listener error:', e); }
      });
    }

    setPlot(w, d) {
      this.plot.width = Math.max(10, Math.min(250, Number(w)));
      this.plot.depth = Math.max(10, Math.min(250, Number(d)));
      this.notify('PLOT_CHANGE', this.plot);
    }

    setTimeOfDay(time) {
      this.timeOfDay = time;
      this.notify('TIME_CHANGE', time);
    }

    addFacility(typeKey, x = null, y = null) {
      const def = FACILITY_TYPES[typeKey];
      if (!def) return null;

      const posX = x !== null ? x : Math.max(2, Math.min(this.plot.width - def.defaultWidth - 2, 6));
      const posY = y !== null ? y : Math.max(2, Math.min(this.plot.depth - def.defaultDepth - 2, 6));

      const newFacility = {
        id: `f_${Date.now()}_${this.nextId++}`,
        type: def.type,
        name: def.name,
        category: def.category,
        x: posX,
        y: posY,
        width: def.defaultWidth,
        depth: def.defaultDepth,
        height: def.defaultHeight,
        rotation: 0,
        color: def.color,
        powerKw: def.powerKw,
        baseCostInr: def.baseCostInr
      };

      this.facilities.push(newFacility);
      this.selectFacility(newFacility.id);
      this.notify('FACILITY_ADDED', newFacility);
      return newFacility;
    }

    updateFacility(id, updates) {
      const f = this.facilities.find(item => item.id === id);
      if (!f) return;
      Object.assign(f, updates);
      this.notify('FACILITY_UPDATED', f);
    }

    deleteFacility(id) {
      const idx = this.facilities.findIndex(item => item.id === id);
      if (idx !== -1) {
        const removed = this.facilities.splice(idx, 1)[0];
        if (this.selectedId === id) this.selectedId = null;
        this.notify('FACILITY_DELETED', removed);
      }
    }

    duplicateFacility(id) {
      const f = this.facilities.find(item => item.id === id);
      if (!f) return;
      const clone = JSON.parse(JSON.stringify(f));
      clone.id = `f_${Date.now()}_${this.nextId++}`;
      clone.x = Math.min(this.plot.width - clone.width, clone.x + 2);
      clone.y = Math.min(this.plot.depth - clone.depth, clone.y + 2);
      clone.name = `${f.name} (Copy)`;
      this.facilities.push(clone);
      this.selectFacility(clone.id);
      this.notify('FACILITY_ADDED', clone);
    }

    selectFacility(id) {
      this.selectedId = id;
      this.notify('SELECTION_CHANGED', this.getSelectedFacility());
    }

    getSelectedFacility() {
      return this.facilities.find(f => f.id === this.selectedId) || null;
    }

    loadPreset(presetId) {
      const preset = PRESETS.find(p => p.id === presetId) || PRESETS[0];
      this.plot = { ...preset.plot };
      this.facilities = preset.facilities.map((f, i) => ({
        ...f,
        id: `f_pre_${i}_${Date.now()}`,
        category: FACILITY_TYPES[f.type]?.category || 'building'
      }));
      this.selectedId = null;
      this.notify('PRESET_LOADED', preset);
    }

    clear() {
      this.facilities = [];
      this.selectedId = null;
      this.notify('CLEARED');
    }
  }

  /* ==========================================================================
     4. 2D CAD BLUEPRINT CANVAS ENGINE
     ========================================================================== */
  class Vision2DEngine {
    constructor(canvas, state) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.state = state;

      this.panX = 30;
      this.panY = 30;
      this.scale = 16;
      this.zoom = 1;

      this.isDragging = false;
      this.isPanning = false;
      this.dragStart = { x: 0, y: 0 };
      this.panStart = { x: 0, y: 0 };
      this.itemInitial = null;

      this.initEvents();
      this.state.subscribe(() => this.render());
      this.autoFit();
    }

    autoFit() {
      if (!this.canvas || !this.canvas.parentElement) return;
      const rect = this.canvas.parentElement.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(dpr, dpr);

      const availableW = rect.width - 60;
      const availableH = rect.height - 60;
      const scaleX = availableW / (this.state.plot.width || 50);
      const scaleY = availableH / (this.state.plot.depth || 35);

      this.scale = Math.max(6, Math.min(28, Math.min(scaleX, scaleY)));
      this.panX = Math.max(20, (rect.width - this.state.plot.width * this.scale) / 2);
      this.panY = Math.max(20, (rect.height - this.state.plot.depth * this.scale) / 2);
      this.render();
    }

    initEvents() {
      if (window.ResizeObserver && this.canvas.parentElement) {
        const ro = new ResizeObserver(() => this.autoFit());
        ro.observe(this.canvas.parentElement);
      }
      window.addEventListener('resize', () => this.autoFit());

      this.canvas.addEventListener('mousedown', (e) => {
        const pos = this.getCanvasPos(e);
        const clickedFacility = this.getFacilityAt(pos.x, pos.y);

        if (e.button === 1 || e.shiftKey) {
          this.isPanning = true;
          this.panStart = { x: e.clientX - this.panX, y: e.clientY - this.panY };
          return;
        }

        if (clickedFacility) {
          this.state.selectFacility(clickedFacility.id);
          this.isDragging = true;
          this.dragStart = pos;
          this.itemInitial = { x: clickedFacility.x, y: clickedFacility.y };
        } else {
          this.state.selectFacility(null);
        }
        this.render();
      });

      window.addEventListener('mousemove', (e) => {
        if (this.isPanning) {
          this.panX = e.clientX - this.panStart.x;
          this.panY = e.clientY - this.panStart.y;
          this.render();
          return;
        }

        if (!this.isDragging) return;
        const sel = this.state.getSelectedFacility();
        if (!sel || !this.itemInitial) return;

        const pos = this.getCanvasPos(e);
        const dx = (pos.x - this.dragStart.x) / this.scale;
        const dy = (pos.y - this.dragStart.y) / this.scale;

        let newX = Math.round((this.itemInitial.x + dx) * 2) / 2;
        let newY = Math.round((this.itemInitial.y + dy) * 2) / 2;

        newX = Math.max(0, Math.min(this.state.plot.width - sel.width, newX));
        newY = Math.max(0, Math.min(this.state.plot.depth - sel.depth, newY));

        sel.x = newX;
        sel.y = newY;
        this.state.notify('FACILITY_UPDATED', sel);
        this.render();
      });

      window.addEventListener('mouseup', () => {
        this.isDragging = false;
        this.isPanning = false;
      });

      this.canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const factor = e.deltaY < 0 ? 1.08 : 0.92;
        this.scale = Math.max(5, Math.min(45, this.scale * factor));
        this.render();
      });

      this.canvas.addEventListener('dragover', (e) => e.preventDefault());
      this.canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        const typeKey = e.dataTransfer.getData('text/plain');
        if (!typeKey || !FACILITY_TYPES[typeKey]) return;

        const pos = this.getCanvasPos(e);
        const metricX = Math.max(0, Math.round(((pos.x - this.panX) / this.scale) * 2) / 2);
        const metricY = Math.max(0, Math.round(((pos.y - this.panY) / this.scale) * 2) / 2);

        this.state.addFacility(typeKey, metricX, metricY);
      });
    }

    getCanvasPos(e) {
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }

    getFacilityAt(px, py) {
      const mx = (px - this.panX) / this.scale;
      const my = (py - this.panY) / this.scale;

      for (let i = this.state.facilities.length - 1; i >= 0; i--) {
        const f = this.state.facilities[i];
        if (mx >= f.x && mx <= f.x + f.width && my >= f.y && my <= f.y + f.depth) {
          return f;
        }
      }
      return null;
    }

    render() {
      const rect = this.canvas.parentElement ? this.canvas.parentElement.getBoundingClientRect() : { width: 600, height: 400 };
      const w = rect.width;
      const h = rect.height;

      this.ctx.clearRect(0, 0, w, h);

      // Blueprint dark background
      this.ctx.fillStyle = '#0D1117';
      this.ctx.fillRect(0, 0, w, h);

      this.ctx.save();
      this.ctx.translate(this.panX, this.panY);

      const plotW = this.state.plot.width * this.scale;
      const plotH = this.state.plot.depth * this.scale;

      this.ctx.fillStyle = '#161B22';
      this.ctx.fillRect(0, 0, plotW, plotH);

      // Grid Lines
      this.ctx.lineWidth = 0.5;
      for (let x = 0; x <= this.state.plot.width; x++) {
        this.ctx.strokeStyle = x % 5 === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)';
        this.ctx.beginPath();
        this.ctx.moveTo(x * this.scale, 0);
        this.ctx.lineTo(x * this.scale, plotH);
        this.ctx.stroke();
      }

      for (let y = 0; y <= this.state.plot.depth; y++) {
        this.ctx.strokeStyle = y % 5 === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)';
        this.ctx.beginPath();
        this.ctx.moveTo(0, y * this.scale);
        this.ctx.lineTo(plotW, y * this.scale);
        this.ctx.stroke();
      }

      // Outer Plot Border
      this.ctx.strokeStyle = '#F2542D';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(0, 0, plotW, plotH);

      // Facilities
      this.state.facilities.forEach(f => {
        const fx = f.x * this.scale;
        const fy = f.y * this.scale;
        const fw = f.width * this.scale;
        const fh = f.depth * this.scale;
        const isSelected = f.id === this.state.selectedId;

        this.ctx.fillStyle = isSelected ? 'rgba(242, 84, 45, 0.25)' : 'rgba(30, 41, 59, 0.85)';
        this.ctx.fillRect(fx, fy, fw, fh);

        this.ctx.strokeStyle = isSelected ? '#F2542D' : (f.color || '#38BDF8');
        this.ctx.lineWidth = isSelected ? 2.5 : 1.5;
        this.ctx.strokeRect(fx, fy, fw, fh);

        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 11px "Space Mono", monospace';
        const label = `${FACILITY_TYPES[f.type]?.icon || '📦'} ${f.name}`;
        this.ctx.fillText(label, fx + 6, fy + 16, fw - 10);

        this.ctx.fillStyle = '#94A3B8';
        this.ctx.font = '9px "Space Mono", monospace';
        this.ctx.fillText(`${f.width}m × ${f.depth}m (${f.height}m H)`, fx + 6, fy + 29, fw - 10);

        if (isSelected) {
          this.ctx.strokeStyle = 'rgba(242, 84, 45, 0.4)';
          this.ctx.lineWidth = 6;
          this.ctx.strokeRect(fx - 2, fy - 2, fw + 4, fh + 4);
        }
      });

      this.ctx.restore();

      // Legend
      this.ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      this.ctx.fillRect(10, 10, 200, 26);
      this.ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      this.ctx.strokeRect(10, 10, 200, 26);
      this.ctx.fillStyle = '#E2E8F0';
      this.ctx.font = '10px "Space Mono", monospace';
      this.ctx.fillText(`PLOT: ${this.state.plot.width}m × ${this.state.plot.depth}m (${this.state.plot.width * this.state.plot.depth} m²)`, 16, 27);
    }
  }

  /* ==========================================================================
     5. THREE.JS POINTER LOCK CONTROLS (GENUINE FIRST PERSON)
     ========================================================================== */
  class SimplePointerLockControls {
    constructor(camera, domElement) {
      this.camera = camera;
      this.domElement = domElement;
      this.isLocked = false;
      this.minPolarAngle = 0.05;
      this.maxPolarAngle = Math.PI - 0.05;
      this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
      this.vec = new THREE.Vector3();

      this.onMouseMove = (event) => {
        if (!this.isLocked) return;
        const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        this.euler.setFromQuaternion(this.camera.quaternion);
        this.euler.y -= movementX * 0.0022;
        this.euler.x -= movementY * 0.0022;
        this.euler.x = Math.max(Math.PI / 2 - this.maxPolarAngle, Math.min(Math.PI / 2 - this.minPolarAngle, this.euler.x));
        this.camera.quaternion.setFromEuler(this.euler);
      };

      this.onPointerlockChange = () => {
        this.isLocked = (document.pointerLockElement === this.domElement);
        console.log(`[Camera] Pointer lock: ${this.isLocked ? 'ON' : 'OFF'}`);
      };

      this.onPointerlockError = () => {
        console.warn('[Camera] Pointer lock error');
      };

      document.addEventListener('mousemove', this.onMouseMove, false);
      document.addEventListener('pointerlockchange', this.onPointerlockChange, false);
      document.addEventListener('pointerlockerror', this.onPointerlockError, false);
    }

    lock() {
      if (this.domElement && this.domElement.requestPointerLock) {
        this.domElement.requestPointerLock();
      }
    }

    unlock() {
      if (document.exitPointerLock) {
        document.exitPointerLock();
      }
    }

    moveForward(distance) {
      this.camera.getWorldDirection(this.vec);
      this.vec.y = 0;
      this.vec.normalize();
      this.camera.position.addScaledVector(this.vec, distance);
    }

    moveRight(distance) {
      this.camera.getWorldDirection(this.vec);
      this.vec.y = 0;
      this.vec.normalize();
      this.vec.cross(this.camera.up);
      this.camera.position.addScaledVector(this.vec, distance);
    }

    dispose() {
      document.removeEventListener('mousemove', this.onMouseMove, false);
      document.removeEventListener('pointerlockchange', this.onPointerlockChange, false);
      document.removeEventListener('pointerlockerror', this.onPointerlockError, false);
    }
  }

  /* ==========================================================================
     6. THREE.JS SPATIAL VISUALIZATION ENGINE (Self-Contained Module)
     ========================================================================== */
  class Scene3DEngine {
    constructor(containerElement, state) {
      console.log('[ThreeView] Initializing...');
      this.container = containerElement;
      this.state = state;

      if (!this.container) {
        console.error('[ThreeView] Error: Container element not found!');
        return;
      }
      console.log('[ThreeView] Container:', this.container);

      // Three.js Core
      this.scene = new THREE.Scene();
      this.camera = null;
      this.renderer = null;
      this.controls = null;
      this.pointerControls = null;

      // Camera System Modes: "top" | "iso" | "walkthrough" | "tour"
      this.cameraMode = 'iso';
      this.clock = new THREE.Clock();
      this.tourAngle = 0;
      this.keyState = { forward: false, backward: false, left: false, right: false, shift: false };
      this.hudEl = document.getElementById('vision-walkthrough-hud');

      // Lighting refs
      this.sunLight = null;
      this.ambientLight = null;
      this.hemiLight = null;

      // Mesh map (facilityId -> THREE.Group)
      this.facilityMeshes = new Map();
      this.groundGroup = new THREE.Group();
      this.lightPoles = [];
      this.resizeObserver = null;
      this.isDestroyed = false;

      this.init();
      this.buildGround();
      this.syncFacilities();

      // Listen to reactive state changes
      this.state.subscribe((event) => {
        if (this.isDestroyed) return;
        if (event === 'PLOT_CHANGE') {
          this.buildGround();
          this.syncFacilities();
          if (this.cameraMode === 'iso') this.fitCameraToScene();
        } else if (event === 'TIME_CHANGE') {
          this.updateLighting();
        } else if (event === 'PRESET_LOADED') {
          this.buildGround();
          this.syncFacilities();
          if (this.cameraMode === 'iso') this.fitCameraToScene();
        } else {
          this.syncFacilities();
        }
      });

      this.animate();
      console.log('[ThreeView] Render loop started');
    }

    init() {
      // Clear any prior canvas to avoid duplicate renderer
      while (this.container.firstChild) {
        this.container.removeChild(this.container.firstChild);
      }

      const rect = this.container.getBoundingClientRect();
      const width = rect.width > 0 ? rect.width : (this.container.clientWidth || 700);
      const height = rect.height > 0 ? rect.height : (this.container.clientHeight || 450);

      console.log(`[ThreeView] Container size: ${Math.round(width)} x ${Math.round(height)}`);

      // 1. Camera
      this.camera = new THREE.PerspectiveCamera(45, (width > 0 && height > 0 ? width / height : 1.5), 0.1, 2000);
      this.camera.position.set(26, 40, 50);

      // 2. WebGL Renderer
      this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      this.renderer.setSize(width > 0 ? width : 700, height > 0 ? height : 450);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap || THREE.PCFShadowMap;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.15;

      // Renderer canvas styling: fill container 100%
      this.renderer.domElement.style.display = 'block';
      this.renderer.domElement.style.width = '100%';
      this.renderer.domElement.style.height = '100%';
      this.container.appendChild(this.renderer.domElement);
      console.log('[ThreeView] Renderer initialized');

      // 3. OrbitControls (for ISO mode)
      const OrbitControlsConstructor = THREE.OrbitControls || (window.OrbitControls);
      if (OrbitControlsConstructor) {
        this.controls = new OrbitControlsConstructor(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2 - 0.02;
        const pw = Number(this.state.plot.width) || 52;
        const pd = Number(this.state.plot.depth) || 36;
        this.controls.target.set(pw / 2, 0, pd / 2);
      }

      // 4. PointerLockControls (for Walkthrough mode)
      this.pointerControls = new SimplePointerLockControls(this.camera, this.renderer.domElement);

      // 5. Walkthrough Interaction & Keyboard Listeners
      this.renderer.domElement.addEventListener('click', () => {
        if (this.cameraMode === 'walkthrough' && this.pointerControls) {
          this.pointerControls.lock();
        }
      });

      window.addEventListener('keydown', (e) => {
        if (this.cameraMode !== 'walkthrough') return;
        const activeTag = (document.activeElement && document.activeElement.tagName) || '';
        if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT') return;

        if (e.code === 'KeyW' || e.code === 'ArrowUp') { this.keyState.forward = true; e.preventDefault(); }
        if (e.code === 'KeyS' || e.code === 'ArrowDown') { this.keyState.backward = true; e.preventDefault(); }
        if (e.code === 'KeyA' || e.code === 'ArrowLeft') { this.keyState.left = true; e.preventDefault(); }
        if (e.code === 'KeyD' || e.code === 'ArrowRight') { this.keyState.right = true; e.preventDefault(); }
        if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.keyState.shift = true;
      });

      window.addEventListener('keyup', (e) => {
        if (e.code === 'KeyW' || e.code === 'ArrowUp') this.keyState.forward = false;
        if (e.code === 'KeyS' || e.code === 'ArrowDown') this.keyState.backward = false;
        if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.keyState.left = false;
        if (e.code === 'KeyD' || e.code === 'ArrowRight') this.keyState.right = false;
        if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.keyState.shift = false;
      });

      // 6. Lighting
      this.ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      this.scene.add(this.ambientLight);

      this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x475569, 0.6);
      this.hemiLight.position.set(0, 80, 0);
      this.scene.add(this.hemiLight);

      this.sunLight = new THREE.DirectionalLight(0xfffbeb, 1.3);
      this.sunLight.position.set(50, 70, 40);
      this.sunLight.castShadow = true;
      this.sunLight.shadow.mapSize.width = 2048;
      this.sunLight.shadow.mapSize.height = 2048;
      this.sunLight.shadow.camera.near = 0.5;
      this.sunLight.shadow.camera.far = 250;
      const shadowD = 80;
      this.sunLight.shadow.camera.left = -shadowD;
      this.sunLight.shadow.camera.right = shadowD;
      this.sunLight.shadow.camera.top = shadowD;
      this.sunLight.shadow.camera.bottom = -shadowD;
      this.sunLight.shadow.bias = -0.0005;
      this.scene.add(this.sunLight);

      this.scene.add(this.groundGroup);
      this.updateLighting();


      console.log('[ThreeView] Scene initialized');
      console.log('[ThreeView] Scene children:', this.scene.children);

      // 8. ResizeObserver for hidden tabs & dynamic layouts
      if (window.ResizeObserver) {
        this.resizeObserver = new ResizeObserver(() => this.onResize());
        this.resizeObserver.observe(this.container);
      }
      window.addEventListener('resize', () => this.onResize());
    }

    onResize() {
      if (this.isDestroyed || !this.container || !this.renderer || !this.camera) return;

      const rect = this.container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Skip if container is currently hidden (0x0 dimensions)
      if (width <= 0 || height <= 0) return;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height, false);
    }

    updateLighting() {
      const mode = this.state.timeOfDay || 'day';

      if (mode === 'day') {
        this.scene.background = new THREE.Color(0x87ceeb);
        this.sunLight.intensity = 1.3;
        this.sunLight.color.setHex(0xffffff);
        this.sunLight.position.set(50, 70, 40);
        this.ambientLight.intensity = 0.6;
        this.hemiLight.intensity = 0.6;
      } else if (mode === 'sunset') {
        this.scene.background = new THREE.Color(0xfdba74);
        this.sunLight.intensity = 0.9;
        this.sunLight.color.setHex(0xf97316);
        this.sunLight.position.set(60, 20, 25);
        this.ambientLight.intensity = 0.45;
        this.hemiLight.intensity = 0.45;
      } else if (mode === 'night') {
        this.scene.background = new THREE.Color(0x070a13);
        this.sunLight.intensity = 0.1;
        this.sunLight.color.setHex(0x38bdf8);
        this.ambientLight.intensity = 0.25;
        this.hemiLight.intensity = 0.25;
      }

      for (const poleLight of this.lightPoles) {
        poleLight.visible = mode === 'night' || mode === 'sunset';
      }
    }

    buildGround() {
      while (this.groundGroup.children.length > 0) {
        const obj = this.groundGroup.children[0];
        this.groundGroup.remove(obj);
      }

      const plotW = Number(this.state.plot.width) || 52;
      const plotD = Number(this.state.plot.depth) || 36;

      // 1. Asphalt Main Surface
      const groundGeo = new THREE.PlaneGeometry(plotW, plotD);
      const groundMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.85,
        metalness: 0.1,
        side: THREE.DoubleSide
      });
      const groundMesh = new THREE.Mesh(groundGeo, groundMat);
      groundMesh.rotation.x = -Math.PI / 2;
      groundMesh.position.set(plotW / 2, 0, plotD / 2);
      groundMesh.receiveShadow = true;
      this.groundGroup.add(groundMesh);

      // 2. Concrete Curb Edge
      const curbMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.6, side: THREE.DoubleSide });
      const curbThickness = 0.4;
      const curbHeight = 0.2;

      const northCurb = new THREE.Mesh(new THREE.BoxGeometry(plotW + curbThickness * 2, curbHeight, curbThickness), curbMat);
      northCurb.position.set(plotW / 2, curbHeight / 2, -curbThickness / 2);
      northCurb.receiveShadow = true;
      this.groundGroup.add(northCurb);

      const southCurb = new THREE.Mesh(new THREE.BoxGeometry(plotW + curbThickness * 2, curbHeight, curbThickness), curbMat);
      southCurb.position.set(plotW / 2, curbHeight / 2, plotD + curbThickness / 2);
      southCurb.receiveShadow = true;
      this.groundGroup.add(southCurb);

      const westCurb = new THREE.Mesh(new THREE.BoxGeometry(curbThickness, curbHeight, plotD), curbMat);
      westCurb.position.set(-curbThickness / 2, curbHeight / 2, plotD / 2);
      westCurb.receiveShadow = true;
      this.groundGroup.add(westCurb);

      const eastCurb = new THREE.Mesh(new THREE.BoxGeometry(curbThickness, curbHeight, plotD), curbMat);
      eastCurb.position.set(plotW + curbThickness / 2, curbHeight / 2, plotD / 2);
      eastCurb.receiveShadow = true;
      this.groundGroup.add(eastCurb);

      // 3. Surrounding Grass Lawn
      const grassGeo = new THREE.PlaneGeometry(plotW + 40, plotD + 40);
      const grassMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.9, side: THREE.DoubleSide });
      const grassMesh = new THREE.Mesh(grassGeo, grassMat);
      grassMesh.rotation.x = -Math.PI / 2;
      grassMesh.position.set(plotW / 2, -0.05, plotD / 2);
      grassMesh.receiveShadow = true;
      this.groundGroup.add(grassMesh);

      // 4. Subtle CAD Ground Grid
      const grid = new THREE.GridHelper(Math.max(plotW, plotD) * 1.5, 30, 0xF2542D, 0x475569);
      grid.position.set(plotW / 2, 0.01, plotD / 2);
      this.groundGroup.add(grid);


    }

    syncFacilities() {
      this.lightPoles = [];
      const currentIds = new Set(this.state.facilities.map(f => f.id));
      console.log('[ThreeView] Facilities received:', this.state.facilities.length);

      // Remove deleted items
      for (const [id, meshGroup] of this.facilityMeshes.entries()) {
        if (!currentIds.has(id)) {
          this.scene.remove(meshGroup);
          this.facilityMeshes.delete(id);
        }
      }

      // Add or Update existing items
      for (const f of this.state.facilities) {
        console.log('[ThreeView] Creating facility:', f.name, f);
        let group = this.facilityMeshes.get(f.id);

        if (!group) {
          group = this.create3DModel(f);
          this.scene.add(group);
          this.facilityMeshes.set(f.id, group);
        } else {
          // Rebuild mesh if size or type changed
          if (group.userData.type !== f.type || group.userData.width !== Number(f.width) || group.userData.depth !== Number(f.depth) || group.userData.height !== Number(f.height)) {
            this.scene.remove(group);
            group = this.create3DModel(f);
            this.scene.add(group);
            this.facilityMeshes.set(f.id, group);
          }
        }

        // Coordinate Conversion: 2D X -> 3D X, 2D Y -> 3D Z
        const width = Number(f.width) || 4;
        const depth = Number(f.depth) || 4;
        const posX = Number(f.x) + width / 2;
        const posZ = Number(f.y) + depth / 2;
        group.position.set(posX, 0, posZ);
        group.rotation.y = -(Number(f.rotation) || 0) * (Math.PI / 180);

        console.log(`[ThreeView] Object position: ${group.position.x}, ${group.position.y}, ${group.position.z}`);

        // Selection Highlight
        const isSelected = f.id === this.state.selectedId;
        this.setGroupHighlight(group, isSelected);
      }

      console.log('[ThreeView] Objects created:', this.facilityMeshes.size);
    }

    setGroupHighlight(group, isSelected) {
      group.traverse((child) => {
        if (child.isMesh && child.userData.isOutline) {
          child.visible = isSelected;
        }
      });
    }

    create3DModel(f) {
      const group = new THREE.Group();
      const w = Number(f.width) || 4;
      const d = Number(f.depth) || 4;
      const h = Number(f.height) || 3;
      group.userData = { id: f.id, type: f.type, width: w, depth: d, height: h };

      let mainColor;
      try {
        mainColor = new THREE.Color(f.color || '#F2542D');
      } catch (e) {
        mainColor = new THREE.Color(0xF2542D);
      }

      if (f.type === 'STORE' || f.type === 'CAFE' || f.type === 'WASHROOM') {
        // --- BUILDING GENERATOR ---
        const wallMat = new THREE.MeshStandardMaterial({
          color: f.type === 'STORE' ? 0xf8fafc : f.type === 'CAFE' ? 0xfef3c7 : 0xede9fe,
          roughness: 0.4,
          side: THREE.DoubleSide
        });
        const glassMat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          roughness: 0.1,
          metalness: 0.8,
          transparent: true,
          opacity: 0.7,
          side: THREE.DoubleSide
        });
        const roofMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8, side: THREE.DoubleSide });

        const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat);
        bodyMesh.position.y = h / 2;
        bodyMesh.castShadow = true;
        bodyMesh.receiveShadow = true;
        group.add(bodyMesh);

        const roofMesh = new THREE.Mesh(new THREE.BoxGeometry(w + 0.4, 0.4, d + 0.4), roofMat);
        roofMesh.position.y = h + 0.2;
        roofMesh.castShadow = true;
        group.add(roofMesh);

        const glassMesh = new THREE.Mesh(new THREE.BoxGeometry(w * 0.7, h * 0.5, 0.1), glassMat);
        glassMesh.position.set(0, h * 0.4, d / 2 + 0.05);
        group.add(glassMesh);

        const canopyMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.3, side: THREE.DoubleSide });
        const canopy = new THREE.Mesh(new THREE.BoxGeometry(w * 0.4, 0.2, 1.5), canopyMat);
        canopy.position.set(0, h * 0.65, d / 2 + 0.75);
        canopy.castShadow = true;
        group.add(canopy);

        const signMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.2, side: THREE.DoubleSide });
        const signBox = new THREE.Mesh(new THREE.BoxGeometry(w * 0.5, 0.8, 0.3), signMat);
        signBox.position.set(0, h + 0.8, d / 2 - 0.2);
        signBox.castShadow = true;
        group.add(signBox);

      } else if (f.type === 'EV_CHARGER') {
        // --- EV CHARGER & SOLAR CANOPY GENERATOR ---
        const padMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8, side: THREE.DoubleSide });
        const pad = new THREE.Mesh(new THREE.BoxGeometry(w, 0.15, d), padMat);
        pad.position.y = 0.075;
        pad.receiveShadow = true;
        group.add(pad);

        const roofMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8, roughness: 0.2, side: THREE.DoubleSide });
        const solarRoof = new THREE.Mesh(new THREE.BoxGeometry(w + 0.6, 0.2, d + 0.4), roofMat);
        solarRoof.position.y = h;
        solarRoof.castShadow = true;
        group.add(solarRoof);

        const poleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
        const pole1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, h), poleMat);
        pole1.position.set(-w / 2 + 0.4, h / 2, -d / 2 + 0.4);
        pole1.castShadow = true;
        group.add(pole1);

        const pole2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, h), poleMat);
        pole2.position.set(w / 2 - 0.4, h / 2, -d / 2 + 0.4);
        pole2.castShadow = true;
        group.add(pole2);

        const chargerMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.3, side: THREE.DoubleSide });
        const screenMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });

        for (let i = -1; i <= 1; i += 2) {
          const charger = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.0, 0.6), chargerMat);
          charger.position.set(i * (w * 0.25), 1.0, -d * 0.2);
          charger.castShadow = true;
          group.add(charger);

          const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.4), screenMat);
          screen.position.set(i * (w * 0.25), 1.4, -d * 0.2 + 0.31);
          screen.userData = { isLedScreen: true };
          group.add(screen);
        }

      } else if (f.type === 'EV_SWAP') {
        // --- BATTERY SWAP STATION ---
        const swapBox = new THREE.Mesh(
          new THREE.BoxGeometry(w, h, d),
          new THREE.MeshStandardMaterial({ color: 0x1E3A8A, roughness: 0.4, metalness: 0.6, side: THREE.DoubleSide })
        );
        swapBox.position.y = h / 2;
        swapBox.castShadow = true;
        group.add(swapBox);

        const batMat = new THREE.MeshBasicMaterial({ color: 0x38BDF8 });
        for (let bx = -w * 0.35; bx <= w * 0.35; bx += 0.8) {
          for (let by = 0.8; by <= h * 0.7; by += 0.7) {
            const bat = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.15), batMat);
            bat.position.set(bx, by, d / 2 + 0.05);
            group.add(bat);
          }
        }

      } else if (f.type === 'AIR_WATER') {
        // --- AIR & WATER PUMP BAY ---
        const padMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.7, side: THREE.DoubleSide });
        const pad = new THREE.Mesh(new THREE.BoxGeometry(w, 0.1, d), padMat);
        pad.position.y = 0.05;
        pad.receiveShadow = true;
        group.add(pad);

        const towerMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.3, side: THREE.DoubleSide });
        const tower = new THREE.Mesh(new THREE.BoxGeometry(0.8, h, 0.8), towerMat);
        tower.position.set(0, h / 2, 0);
        tower.castShadow = true;
        group.add(tower);

        const gaugeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
        const gauge = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.1), gaugeMat);
        gauge.rotation.x = Math.PI / 2;
        gauge.position.set(0, h * 0.75, 0.41);
        group.add(gauge);

      } else if (f.type === 'TRANSFORMER') {
        // --- 11kV TRANSFORMER YARD ---
        const transBody = new THREE.Mesh(
          new THREE.BoxGeometry(w, h * 0.8, d),
          new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3, side: THREE.DoubleSide })
        );
        transBody.position.y = (h * 0.8) / 2;
        transBody.castShadow = true;
        group.add(transBody);

        const insMat = new THREE.MeshStandardMaterial({ color: 0x991B1B, roughness: 0.2 });
        [-w * 0.3, 0, w * 0.3].forEach(ix => {
          const ins = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 0.8, 8), insMat);
          ins.position.set(ix, h * 0.8 + 0.4, 0);
          ins.castShadow = true;
          group.add(ins);
        });

      } else if (f.type === 'PARKING_CAR' || f.type === 'PARKING_EV') {
        // --- PARKING STALLS ---
        const matColor = f.type === 'PARKING_EV' ? 0x064e3b : 0x334155;
        const stripeColor = f.type === 'PARKING_EV' ? 0x34d399 : 0xffffff;

        const stallMesh = new THREE.Mesh(
          new THREE.PlaneGeometry(w, d),
          new THREE.MeshStandardMaterial({ color: matColor, roughness: 0.9, side: THREE.DoubleSide })
        );
        stallMesh.rotation.x = -Math.PI / 2;
        stallMesh.position.y = 0.01;
        stallMesh.receiveShadow = true;
        group.add(stallMesh);

        const lineMat = new THREE.MeshBasicMaterial({ color: stripeColor });
        const stripe1 = new THREE.Mesh(new THREE.PlaneGeometry(0.15, d), lineMat);
        stripe1.rotation.x = -Math.PI / 2;
        stripe1.position.set(-w / 2 + 0.1, 0.02, 0);
        group.add(stripe1);

        const stripe2 = new THREE.Mesh(new THREE.PlaneGeometry(0.15, d), lineMat);
        stripe2.rotation.x = -Math.PI / 2;
        stripe2.position.set(w / 2 - 0.1, 0.02, 0);
        group.add(stripe2);

      } else if (f.type === 'GREENERY') {
        // --- GREENERY & TREES ---
        const grassBed = new THREE.Mesh(
          new THREE.BoxGeometry(w, 0.2, d),
          new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.9, side: THREE.DoubleSide })
        );
        grassBed.position.y = 0.1;
        grassBed.receiveShadow = true;
        group.add(grassBed);

        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
        const foliageMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 });

        const numTrees = Math.max(1, Math.floor(w / 3));
        for (let i = 0; i < numTrees; i++) {
          const treeX = -w / 2 + (w / (numTrees + 1)) * (i + 1);
          const treeZ = (Math.random() - 0.5) * (d * 0.4);

          const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 1.8), trunkMat);
          trunk.position.set(treeX, 0.9, treeZ);
          trunk.castShadow = true;
          group.add(trunk);

          const foliage = new THREE.Mesh(new THREE.ConeGeometry(1.2, 3.0, 7), foliageMat);
          foliage.position.set(treeX, 2.8, treeZ);
          foliage.castShadow = true;
          group.add(foliage);
        }

      } else if (f.type === 'LIGHT_POLE') {
        // --- SMART LIGHT POLE ---
        const poleMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, h), poleMat);
        pole.position.y = h / 2;
        pole.castShadow = true;
        group.add(pole);

        const headMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 0.8 });
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.6), headMat);
        head.position.set(0, h, 0.3);
        group.add(head);

        const pointLight = new THREE.PointLight(0xffedd5, 1.5, 18);
        pointLight.position.set(0, h - 0.2, 0.3);
        pointLight.castShadow = true;
        pointLight.visible = this.state.timeOfDay === 'night' || this.state.timeOfDay === 'sunset';
        group.add(pointLight);

        this.lightPoles.push(pointLight);

      } else if (f.type === 'AD_BOARD') {
        // --- LARGE ROADSIDE ADVERTISEMENT BILLBOARD ---
        const boardHeight = h * 0.55;
        const poleHeight = h - boardHeight / 2;
        const poleRadius = 0.22;
        const poleOffset = Math.max(1.0, w * 0.32);

        // 1. Concrete Ground Base Pedestals
        const pedMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8, side: THREE.DoubleSide });
        [-poleOffset, poleOffset].forEach(px => {
          const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 0.4, 16), pedMat);
          ped.position.set(px, 0.2, 0);
          ped.receiveShadow = true;
          ped.castShadow = true;
          group.add(ped);
        });

        // 2. Heavy Steel Support Columns (Two Sturdy Vertical Pillars)
        const steelMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.25 });
        [-poleOffset, poleOffset].forEach(px => {
          const pillar = new THREE.Mesh(new THREE.CylinderGeometry(poleRadius, poleRadius, poleHeight, 16), steelMat);
          pillar.position.set(px, poleHeight / 2, 0);
          pillar.castShadow = true;
          pillar.receiveShadow = true;
          group.add(pillar);
        });

        // 3. Steel Horizontal Cross-Beam / Support Structure
        const beamMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, metalness: 0.7, roughness: 0.4 });
        const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(w * 0.75, 0.3, 0.3), beamMat);
        crossBeam.position.set(0, poleHeight - 0.2, 0);
        crossBeam.castShadow = true;
        group.add(crossBeam);

        // 4. Billboard Main Frame Box
        const frameDepth = Math.max(0.35, d * 0.3);
        const frameMat = new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.3, metalness: 0.6, side: THREE.DoubleSide });
        const boardFrame = new THREE.Mesh(new THREE.BoxGeometry(w, boardHeight, frameDepth), frameMat);
        boardFrame.position.set(0, h - boardHeight / 2, 0);
        boardFrame.castShadow = true;
        boardFrame.receiveShadow = true;
        group.add(boardFrame);

        // 5. Display Billboard Panels (Front and Back)
        const displayMat = new THREE.MeshStandardMaterial({
          color: mainColor,
          roughness: 0.25,
          metalness: 0.2,
          side: THREE.DoubleSide
        });

        const frontScreen = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.3, boardHeight - 0.3), displayMat);
        frontScreen.position.set(0, h - boardHeight / 2, frameDepth / 2 + 0.02);
        group.add(frontScreen);

        const backScreen = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.3, boardHeight - 0.3), displayMat);
        backScreen.rotation.y = Math.PI;
        backScreen.position.set(0, h - boardHeight / 2, -frameDepth / 2 - 0.02);
        group.add(backScreen);

        // 6. Top Overhead Floodlight Armatures
        const lightArmMat = new THREE.MeshStandardMaterial({ color: 0x64748B, metalness: 0.8 });
        const lampMat = new THREE.MeshStandardMaterial({ color: 0xFEF08A, emissive: 0xFEF08A, emissiveIntensity: 0.8 });

        const lampCount = Math.max(2, Math.floor(w / 2.5));
        for (let i = 0; i < lampCount; i++) {
          const lx = -w / 2 + (w / (lampCount + 1)) * (i + 1);
          const arm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.7), lightArmMat);
          arm.position.set(lx, h + 0.12, frameDepth / 2 + 0.3);
          group.add(arm);

          const fixture = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.08, 0.18), lampMat);
          fixture.position.set(lx, h + 0.08, frameDepth / 2 + 0.6);
          group.add(fixture);
        }
      }

      // Selection Outline Box
      const outlineGeo = new THREE.BoxGeometry(w + 0.2, h + 0.2, d + 0.2);
      const outlineMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe, wireframe: true });
      const outlineMesh = new THREE.Mesh(outlineGeo, outlineMat);
      outlineMesh.position.y = h / 2;
      outlineMesh.userData = { isOutline: true };
      outlineMesh.visible = f.id === this.state.selectedId;
      group.add(outlineMesh);

      return group;
    }

    fitCameraToScene() {
      if (!this.camera) return;

      const box = new THREE.Box3();
      if (this.facilityMeshes.size > 0) {
        for (const group of this.facilityMeshes.values()) {
          box.expandByObject(group);
        }
      }
      box.expandByObject(this.groundGroup);

      if (box.isEmpty()) {
        const pw = Number(this.state.plot.width) || 52;
        const pd = Number(this.state.plot.depth) || 36;
        box.min.set(0, 0, 0);
        box.max.set(pw, 5, pd);
      }

      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.z, 25);
      const fov = (this.camera.fov || 45) * (Math.PI / 180);
      let cameraDistance = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.35;
      cameraDistance = Math.max(cameraDistance, 35);

      this.camera.position.set(center.x + cameraDistance * 0.45, cameraDistance * 0.7, center.z + cameraDistance * 0.7);
      this.camera.lookAt(center);

      if (this.controls) {
        this.controls.target.copy(center);
        this.controls.update();
      }

      console.log(`[ThreeView] Scene bounds: ${Math.round(size.x)}x${Math.round(size.z)}`);
      console.log(`[ThreeView] Camera positioned at: (${Math.round(this.camera.position.x)}, ${Math.round(this.camera.position.y)}, ${Math.round(this.camera.position.z)})`);
    }

    /* Mutually Exclusive Camera Modes: "top" | "iso" | "walkthrough" | "tour" */
    setCameraMode(mode) {
      this.cameraMode = mode;
      console.log(`[Camera] Mode: ${mode.toUpperCase()}`);

      const pw = Number(this.state.plot.width) || 52;
      const pd = Number(this.state.plot.depth) || 36;
      const centerX = pw / 2;
      const centerZ = pd / 2;

      // Sync UI button active classes
      const camBtns = {
        'top': document.getElementById('vision-cam-top'),
        'iso': document.getElementById('vision-cam-iso'),
        'walkthrough': document.getElementById('vision-cam-walk'),
        'tour': document.getElementById('vision-cam-tour') || document.getElementById('vision-cam-rotate')
      };
      Object.entries(camBtns).forEach(([k, btn]) => {
        if (btn) btn.classList.toggle('active', k === mode);
      });

      if (mode === 'top') {
        if (this.controls) this.controls.enabled = false;
        if (this.pointerControls) this.pointerControls.unlock();
        if (this.hudEl) this.hudEl.style.display = 'none';

        const topHeight = Math.max(pw, pd) * 1.4;
        this.camera.position.set(centerX, topHeight, centerZ + 0.01);
        this.camera.lookAt(centerX, 0, centerZ);
        if (this.controls) {
          this.controls.target.set(centerX, 0, centerZ);
        }
      } else if (mode === 'iso') {
        if (this.pointerControls) this.pointerControls.unlock();
        if (this.hudEl) this.hudEl.style.display = 'none';
        if (this.controls) {
          this.controls.enabled = true;
          this.controls.autoRotate = false;
        }
        this.fitCameraToScene();
      } else if (mode === 'walkthrough') {
        if (this.controls) this.controls.enabled = false;
        if (this.hudEl) this.hudEl.style.display = 'block';

        // Position camera inside forecourt at eye level (1.75m)
        this.camera.position.set(4, 1.75, centerZ);
        this.camera.lookAt(centerX, 1.75, centerZ);
        if (this.pointerControls) {
          this.pointerControls.euler.set(0, -Math.PI / 2, 0, 'YXZ');
        }
      } else if (mode === 'tour') {
        if (this.controls) this.controls.enabled = false;
        if (this.pointerControls) this.pointerControls.unlock();
        if (this.hudEl) this.hudEl.style.display = 'none';
        this.tourAngle = 0;
      }
    }

    setCameraView(viewName) {
      if (viewName === 'walk' || viewName === 'walkthrough') {
        this.setCameraMode('walkthrough');
      } else if (viewName === 'top') {
        this.setCameraMode('top');
      } else if (viewName === 'tour') {
        this.setCameraMode('tour');
      } else {
        this.setCameraMode('iso');
      }
    }

    toggleAutoRotate() {
      if (this.cameraMode === 'tour') {
        this.setCameraMode('iso');
        return false;
      } else {
        this.setCameraMode('tour');
        return true;
      }
    }

    animate() {
      if (this.isDestroyed) return;
      requestAnimationFrame(() => this.animate());

      const delta = this.clock.getDelta();

      if (this.cameraMode === 'iso') {
        if (this.controls && this.controls.enabled) {
          this.controls.update();
        }
      } else if (this.cameraMode === 'walkthrough') {
        this.updateWalkthrough(delta);
      } else if (this.cameraMode === 'tour') {
        this.updateTour(delta);
      }

      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    }

    updateWalkthrough(delta) {
      if (!this.pointerControls) return;
      const speed = (this.keyState.shift ? 16 : 8) * Math.min(delta, 0.1);

      if (this.keyState.forward) this.pointerControls.moveForward(speed);
      if (this.keyState.backward) this.pointerControls.moveForward(-speed);
      if (this.keyState.left) this.pointerControls.moveRight(-speed);
      if (this.keyState.right) this.pointerControls.moveRight(speed);

      // Keep fixed eye-level height
      this.camera.position.y = 1.75;
    }

    updateTour(delta) {
      const pw = Number(this.state.plot.width) || 52;
      const pd = Number(this.state.plot.depth) || 36;
      const centerX = pw / 2;
      const centerZ = pd / 2;
      const radius = Math.max(pw, pd) * 0.92;
      const height = Math.max(pw, pd) * 0.52;

      this.tourAngle = (this.tourAngle || 0) + delta * 0.32;

      this.camera.position.x = centerX + Math.cos(this.tourAngle) * radius;
      this.camera.position.z = centerZ + Math.sin(this.tourAngle) * radius;
      this.camera.position.y = height + Math.sin(this.tourAngle * 2) * 2.5;
      this.camera.lookAt(centerX, 1.5, centerZ);
    }

    destroy() {
      this.isDestroyed = true;
      if (this.pointerControls) {
        this.pointerControls.dispose();
      }
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }
      if (this.renderer) {
        this.renderer.dispose();
        if (this.renderer.domElement && this.renderer.domElement.parentElement) {
          this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
        }
        this.renderer = null;
      }
    }
  }

  /* ==========================================================================
     6. PROPERTY INSPECTOR FORM CONTROLLER
     ========================================================================== */
  class VisionInspector {
    constructor(state, elements) {
      this.state = state;
      this.els = elements;

      this.initEvents();
      this.state.subscribe(() => this.update());
    }

    initEvents() {
      const updateCurrent = () => {
        const sel = this.state.getSelectedFacility();
        if (!sel) return;

        sel.name = this.els.inputName.value;
        sel.width = Math.max(1, parseFloat(this.els.inputW.value) || sel.width);
        sel.depth = Math.max(1, parseFloat(this.els.inputD.value) || sel.depth);
        sel.height = Math.max(0.1, parseFloat(this.els.inputH.value) || sel.height);
        sel.rotation = parseInt(this.els.inputRot.value, 10) || 0;
        sel.color = this.els.inputColor.value;

        this.state.notify('FACILITY_UPDATED', sel);
      };

      ['input', 'change'].forEach(evt => {
        this.els.inputName?.addEventListener(evt, updateCurrent);
        this.els.inputW?.addEventListener(evt, updateCurrent);
        this.els.inputD?.addEventListener(evt, updateCurrent);
        this.els.inputH?.addEventListener(evt, updateCurrent);
        this.els.inputRot?.addEventListener(evt, updateCurrent);
        this.els.inputColor?.addEventListener(evt, updateCurrent);
      });

      this.els.btnCopy?.addEventListener('click', () => {
        if (this.state.selectedId) this.state.duplicateFacility(this.state.selectedId);
      });

      this.els.btnDel?.addEventListener('click', () => {
        if (this.state.selectedId) this.state.deleteFacility(this.state.selectedId);
      });
    }

    update() {
      const sel = this.state.getSelectedFacility();
      if (!sel) {
        if (this.els.emptyMsg) this.els.emptyMsg.style.display = 'block';
        if (this.els.formContainer) this.els.formContainer.style.display = 'none';
        return;
      }

      if (this.els.emptyMsg) this.els.emptyMsg.style.display = 'none';
      if (this.els.formContainer) this.els.formContainer.style.display = 'block';

      this.els.inputName.value = sel.name;
      this.els.inputW.value = sel.width;
      this.els.inputD.value = sel.depth;
      this.els.inputH.value = sel.height;
      this.els.inputRot.value = sel.rotation || 0;
      this.els.inputColor.value = sel.color || '#F2542D';
    }
  }

  /* ==========================================================================
     7. REAL-TIME SITE ANALYTICS & CAPEX ENGINE
     ========================================================================== */
  class VisionAnalytics {
    constructor(state, elements) {
      this.state = state;
      this.els = elements;

      this.state.subscribe(() => this.update());
      this.update();
    }

    update() {
      const totalPlotArea = this.state.plot.width * this.state.plot.depth;
      let builtArea = 0;
      let greenArea = 0;
      let evPowerKw = 0;
      let totalStalls = 0;
      let estimatedCapExInr = 0;

      this.state.facilities.forEach(f => {
        const area = f.width * f.depth;
        if (f.category === 'building' || f.category === 'commercial') builtArea += area;
        if (f.category === 'landscape') greenArea += area;
        if (f.powerKw) evPowerKw += f.powerKw;
        if (f.type === 'EV_CHARGER') totalStalls += 2;
        if (f.type === 'PARKING_EV' || f.type === 'PARKING_CAR') totalStalls += 2;
        if (f.baseCostInr) estimatedCapExInr += f.baseCostInr;
      });

      const coverageRatio = totalPlotArea > 0 ? ((builtArea / totalPlotArea) * 100).toFixed(1) : 0;
      const capexLakhs = (estimatedCapExInr / 100000).toFixed(1);

      if (this.els.statPlotArea) this.els.statPlotArea.textContent = `${totalPlotArea.toLocaleString()} m²`;
      if (this.els.statBuiltArea) this.els.statBuiltArea.textContent = `${builtArea} m² (${coverageRatio}%)`;
      if (this.els.statGreenArea) this.els.statGreenArea.textContent = `${greenArea} m²`;
      if (this.els.statPowerKw) this.els.statPowerKw.textContent = `${evPowerKw} kW`;
      if (this.els.statStalls) this.els.statStalls.textContent = `${totalStalls} Bays`;
      if (this.els.statCost) this.els.statCost.textContent = `₹${capexLakhs} Lakhs`;
    }
  }

  /* ==========================================================================
     8. EXPORTER ENGINE (2D/3D PNG & JSON)
     ========================================================================== */
  class VisionExporter {
    constructor(state, engine2D, engine3D) {
      this.state = state;
      this.engine2D = engine2D;
      this.engine3D = engine3D;
    }

    export2DPng() {
      const srcCanvas = this.engine2D.canvas;
      const temp = document.createElement('canvas');
      temp.width = srcCanvas.width;
      temp.height = srcCanvas.height + 70;
      const ctx = temp.getContext('2d');

      ctx.fillStyle = '#0D1117';
      ctx.fillRect(0, 0, temp.width, temp.height);
      ctx.drawImage(srcCanvas, 0, 0);

      ctx.fillStyle = '#161B22';
      ctx.fillRect(0, srcCanvas.height, temp.width, 70);
      ctx.strokeStyle = '#F2542D';
      ctx.lineWidth = 2;
      ctx.strokeRect(4, srcCanvas.height + 4, temp.width - 8, 62);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('EVISION 3D VISION — FACILITY BLUEPRINT CAD PLAN', 16, srcCanvas.height + 26);

      ctx.fillStyle = '#F2542D';
      ctx.font = '11px "Space Mono", monospace';
      ctx.fillText(`Plot: ${this.state.plot.width}m × ${this.state.plot.depth}m | Facilities: ${this.state.facilities.length} | Generated: ${new Date().toLocaleDateString()}`, 16, srcCanvas.height + 48);

      const link = document.createElement('a');
      link.download = `evision-blueprint-${Date.now()}.png`;
      link.href = temp.toDataURL('image/png');
      link.click();
    }

    export3DPng() {
      if (!this.engine3D || !this.engine3D.renderer || !this.engine3D.scene || !this.engine3D.camera) return;
      this.engine3D.renderer.render(this.engine3D.scene, this.engine3D.camera);
      const dataUrl = this.engine3D.renderer.domElement.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `evision-3d-render-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    }

    saveJson() {
      const data = {
        version: '2.0',
        plot: this.state.plot,
        facilities: this.state.facilities,
        exportedAt: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.download = `evision-layout-${Date.now()}.json`;
      link.href = URL.createObjectURL(blob);
      link.click();
    }

    loadJson(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          if (json.plot) this.state.plot = json.plot;
          if (json.facilities) this.state.facilities = json.facilities;
          this.state.selectedId = null;
          this.state.notify('PRESET_LOADED');
        } catch (err) {
          alert('Invalid layout JSON file');
        }
      };
      reader.readAsText(file);
    }
  }

  /* ==========================================================================
     9. GLOBAL BOOTSTRAPPER & INTEGRATION CONTROLLER
     ========================================================================== */
  let globalState = null;
  let globalEngine2D = null;
  let globalEngine3D = null;

  function initVision3DStudio() {
    const canvas2DEl = document.getElementById('vision-blueprint-canvas');
    const viewport3DEl = document.getElementById('vision-3d-viewport');

    if (!canvas2DEl || !viewport3DEl) {
      return;
    }

    // Ensure THREE is loaded before initializing
    if (typeof THREE === 'undefined') {
      setTimeout(initVision3DStudio, 50);
      return;
    }

    // Prevent duplicate initializations
    if (globalState) {
      if (globalEngine2D) globalEngine2D.autoFit();
      if (globalEngine3D) globalEngine3D.onResize();
      return;
    }

    globalState = new VisionState();
    globalEngine2D = new Vision2DEngine(canvas2DEl, globalState);
    globalEngine3D = new Scene3DEngine(viewport3DEl, globalState);

    // Populate Facility Palette List
    const paletteContainer = document.getElementById('vision-palette-list');
    if (paletteContainer) {
      paletteContainer.innerHTML = '';
      Object.values(FACILITY_TYPES).forEach(def => {
        const card = document.createElement('div');
        card.className = 'vision-palette-card';
        card.draggable = true;
        card.innerHTML = `
          <div class="vision-palette-icon">${def.icon}</div>
          <div class="vision-palette-meta">
            <div class="vision-palette-name">${def.name}</div>
            <div class="vision-palette-specs">
              <span>${def.defaultWidth}m × ${def.defaultDepth}m</span>
              <span>₹${(def.baseCostInr / 100000).toFixed(1)}L</span>
            </div>
          </div>
        `;

        card.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', def.type);
        });

        card.addEventListener('click', () => {
          globalState.addFacility(def.type);
        });

        paletteContainer.appendChild(card);
      });
    }

    // Populate Presets Select
    const presetSelect = document.getElementById('vision-preset-select');
    if (presetSelect) {
      presetSelect.innerHTML = '';
      PRESETS.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.name;
        presetSelect.appendChild(opt);
      });

      presetSelect.addEventListener('change', () => {
        globalState.loadPreset(presetSelect.value);
        const wInput = document.getElementById('vision-plot-w');
        const dInput = document.getElementById('vision-plot-d');
        if (wInput) wInput.value = globalState.plot.width;
        if (dInput) dInput.value = globalState.plot.depth;
        globalEngine2D.autoFit();
      });
    }

    // Dimensions
    const inputPlotW = document.getElementById('vision-plot-w');
    const inputPlotD = document.getElementById('vision-plot-d');
    const btnApplyPlot = document.getElementById('vision-btn-apply-plot');

    btnApplyPlot?.addEventListener('click', () => {
      globalState.setPlot(inputPlotW.value, inputPlotD.value);
      globalEngine2D.autoFit();
    });

    // Time of day lighting
    const selectTime = document.getElementById('vision-time-of-day');
    selectTime?.addEventListener('change', () => {
      globalState.setTimeOfDay(selectTime.value);
    });

    // View mode tabs (Split / 2D / 3D)
    const viewContainer = document.getElementById('vision-viewports-container');
    const tabSplit = document.getElementById('vision-tab-split');
    const tab2D = document.getElementById('vision-tab-2d');
    const tab3D = document.getElementById('vision-tab-3d');

    function setViewMode(mode) {
      if (!viewContainer) return;
      viewContainer.className = `vision-viewports-container mode-${mode}`;
      [tabSplit, tab2D, tab3D].forEach(b => b?.classList.remove('active'));
      if (mode === 'split') tabSplit?.classList.add('active');
      if (mode === '2d') tab2D?.classList.add('active');
      if (mode === '3d') tab3D?.classList.add('active');

      setTimeout(() => {
        if (globalEngine2D) globalEngine2D.autoFit();
        if (globalEngine3D) globalEngine3D.onResize();
      }, 50);
    }

    tabSplit?.addEventListener('click', () => setViewMode('split'));
    tab2D?.addEventListener('click', () => setViewMode('2d'));
    tab3D?.addEventListener('click', () => setViewMode('3d'));

    // Palette Hamburger Toggle
    const btnPaletteToggle = document.getElementById('vision-palette-toggle');
    const workspaceEl = document.querySelector('.vision-workspace');
    btnPaletteToggle?.addEventListener('click', () => {
      if (workspaceEl) {
        workspaceEl.classList.toggle('palette-collapsed');
        setTimeout(() => {
          if (globalEngine2D) globalEngine2D.autoFit();
          if (globalEngine3D) globalEngine3D.onResize();
        }, 260);
      }
    });

    // Camera mode buttons (Top CAD, Iso 45, Walkthrough, 3D Tour)
    document.getElementById('vision-cam-top')?.addEventListener('click', () => {
      if (globalEngine3D) globalEngine3D.setCameraMode('top');
    });
    document.getElementById('vision-cam-iso')?.addEventListener('click', () => {
      if (globalEngine3D) globalEngine3D.setCameraMode('iso');
    });
    document.getElementById('vision-cam-walk')?.addEventListener('click', () => {
      if (globalEngine3D) globalEngine3D.setCameraMode('walkthrough');
    });
    document.getElementById('vision-cam-tour')?.addEventListener('click', () => {
      if (globalEngine3D) globalEngine3D.setCameraMode('tour');
    });
    document.getElementById('vision-cam-rotate')?.addEventListener('click', () => {
      if (globalEngine3D) globalEngine3D.setCameraMode('tour');
    });

    // Inspector
    const inspector = new VisionInspector(globalState, {
      emptyMsg: document.getElementById('vision-inspector-empty'),
      formContainer: document.getElementById('vision-inspector-form'),
      inputName: document.getElementById('vision-item-name'),
      inputW: document.getElementById('vision-item-w'),
      inputD: document.getElementById('vision-item-d'),
      inputH: document.getElementById('vision-item-h'),
      inputRot: document.getElementById('vision-item-rot'),
      inputColor: document.getElementById('vision-item-col'),
      btnCopy: document.getElementById('vision-btn-duplicate'),
      btnDel: document.getElementById('vision-btn-delete')
    });

    // Analytics
    const analytics = new VisionAnalytics(globalState, {
      statPlotArea: document.getElementById('vision-stat-plot-area'),
      statBuiltArea: document.getElementById('vision-stat-built-area'),
      statGreenArea: document.getElementById('vision-stat-green-area'),
      statPowerKw: document.getElementById('vision-stat-ev-power'),
      statStalls: document.getElementById('vision-stat-stalls'),
      statCost: document.getElementById('vision-stat-cost')
    });

    // Exporter
    const exporter = new VisionExporter(globalState, globalEngine2D, globalEngine3D);
    document.getElementById('vision-export-2d')?.addEventListener('click', () => exporter.export2DPng());
    document.getElementById('vision-export-3d')?.addEventListener('click', () => exporter.export3DPng());
    document.getElementById('vision-save-json')?.addEventListener('click', () => exporter.saveJson());

    const fileInput = document.getElementById('vision-file-input-json');
    document.getElementById('vision-load-json')?.addEventListener('click', () => fileInput?.click());
    fileInput?.addEventListener('change', (e) => {
      if (e.target.files[0]) exporter.loadJson(e.target.files[0]);
    });

    document.getElementById('vision-clear-all')?.addEventListener('click', () => {
      if (confirm('Clear all facilities from the 3D blueprint?')) globalState.clear();
    });

    // Auto-load preset from URL or Highway Hub default
    const urlParams = new URLSearchParams(window.location.search);
    const urlPreset = urlParams.get('preset') || urlParams.get('projectType') || 'highway_hub';
    globalState.loadPreset(urlPreset);
    if (presetSelect) presetSelect.value = urlPreset;
    if (inputPlotW) inputPlotW.value = globalState.plot.width;
    if (inputPlotD) inputPlotD.value = globalState.plot.depth;
    
    setTimeout(() => {
      if (globalEngine2D) globalEngine2D.autoFit();
      if (globalEngine3D) {
        globalEngine3D.onResize();
        globalEngine3D.fitCameraToScene();
      }
    }, 100);
  }

  // Self-contained Three view initialization helper
  window.initThreeView = function (container, state) {
    return new Scene3DEngine(container, state || globalState);
  };

  // Expose global initializer
  window.initVision3D = initVision3DStudio;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVision3DStudio);
  } else {
    initVision3DStudio();
  }

})();
