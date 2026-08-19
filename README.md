# ⚡ EVision India — National EV Infrastructure Command Platform & Spatial AI Feasibility Planner

[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Three.js](https://img.shields.io/badge/Three.js-3D%20Studio-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-GIS%20Mapping-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.org/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-ML%20Engine-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-00C853?style=for-the-badge)](#)

---

## 📌 Project Overview

**EVision India** is an enterprise-grade, national-level Electric Vehicle (EV) infrastructure planning, GIS spatial analytics, and AI feasibility assessment platform. Designed for DISCOMs, municipal bodies, Charge Point Operators (CPOs), and site developers, EVision simplifies the multi-million rupee investment decision of setting up EV charging stations across India.

By uniting **machine learning predictive scoring**, **Vahan RTO vehicle registration analytics**, **OpenCharge Map dataset lookup**, and **3D spatial CAD visualization**, EVision provides end-to-end intelligence from national grid monitoring down to individual station 3D architectural blueprints.

---

## ✨ Key Features & Modules

### 1. 🌐 National Command & Telemetry Platform (`landing.html`)
* **Real-time DISCOM Grid Analytics**: Dynamic grid telemetry, transformer headroom monitoring, and peak-load alert systems.
* **GIS Satellite Intelligence Visuals**: High-resolution spatial maps mapping EV adoption density across Indian states and RTO zones.
* **Tariff & ROI Comparison Engine**: Instant cost-per-kWh, solar net-metering, and peak vs off-peak tariff breakdown.
* **Integrated Authentication Modal**: User registration and login flow (`register.html`).

### 2. 🗺️ AI EV Charging Site Feasibility Planner (`site-planner/dashboard.html`)
* **Interactive Map Location Picker**: Leaflet.js powered location marker with dynamic radius selection (1km - 15km).
* **6-Pillar AI Feasibility Engine**: Real-time 0–100 site scoring based on:
  1. *Demand Density* (Vahan RTO registrations & EV growth)
  2. *Traffic Flow & Dwell Potential* (Highway hubs, petrol pumps, commercial parks)
  3. *DISCOM Grid Headroom* (Local sub-station capacity & line distance)
  4. *Competition Gap* (OpenCharge database proximity & queueing analysis)
  5. *Property & Land Suitability* (Ingress/egress, turning radius, parking area)
  6. *5-Year Adoption Growth Projection* (Regional adoption velocity)
* **Live Competitor Proximity Querying**: Real-time spatial query of nearby existing charging stations with operator and gun type metadata.
* **Financial ROI & Payback Calculator**: Interactive CAPEX, OPEX, monthly revenue, break-even period, and NPV projections.
* **Report Generation**: Export feasibility assessment into comprehensive structured formats.

### 3. 🎨 3D Vision Studio & 2D CAD Generator (`site-planner/3dvision.html`)
* **Interactive 2D CAD Blueprint Tool**: Customize plot width and depth (meters) with dynamic drag-and-place items (DC Fast Chargers, AC Slow Chargers, Solar Canopy, Substation Unit, Amenities).
* **Photorealistic 3D Spatial Visualizer**: Three.js WebGL renderer featuring dynamic lighting, shadows, camera orbit controls, and real-time 3D spatial twin previews of charging hubs.

### 4. 🤖 Backend Machine Learning & API Engine (`python/landing-page/server.py`)
* **Predictive EV Hotspot Model (`ev_hotspot_model.pkl`)**: Trained Scikit-Learn regressor model evaluating RTO-level vehicle registrations, 4W ratios, and state EV penetration averages.
* **Dataset Integrations**: Integrated RTO metadata (`rto_metadata.csv`) and OpenCharge station registry (`charging_stations.csv`).
* **REST API Endpoints**:
  * `POST /api/v1/site-planner/analyze` — Site assessment & 6-pillar score calculation.
  * `GET /api/stations` — Query charging station location data.
  * `POST /api/hotspots/predict` — ML hotspot prediction.
  * `POST /api/business/predict` — Financial ROI & demand modeling.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend UI/UX** | HTML5, CSS3 (Custom Glassmorphism Design System), JavaScript (ES6+) |
| **Styling & Fonts** | Tailwind CSS CDN, Google Fonts (*Unbounded, Syne, Sora, Plus Jakarta Sans, Space Mono*) |
| **Mapping & GIS** | Leaflet.js, OpenStreetMap tiles |
| **3D Rendering & Animations** | Three.js (v0.160.0), OrbitControls, GSAP (GreenSock), ScrollTrigger |
| **Icons & Visuals** | Material Symbols Outlined, Feather Icons |
| **Backend & API** | Python 3.9+ (`http.server`, `socketserver`, `json`, `urllib`) |
| **Data Science & ML** | Scikit-Learn, Pandas, Joblib |
| **Database & Datasets** | Vahan RTO Registration CSVs, OpenCharge Map JSON/CSV Datasets |

---

## 📁 Repository Structure

```
copy of sih/
├── index.html                   # Automatic root redirect to landing.html
├── landing.html                 # National Command & Telemetry Landing Page
├── register.html                # User Auth & Registration Interface
├── nav_global.js                # Universal Navigation & Session Manager
├── hero_bg.mp4                  # Hero Section Background Video
├── css/                         # Global Styling & Component CSS
├── js/                          # Client-side Interactive Scripts
├── images/                      # Asset Images & Icons
├── site-planner/                # Site Assessment & 3D Studio Module
│   ├── dashboard.html           # Interactive Feasibility & ROI Dashboard
│   ├── 3dvision.html            # 2D CAD Blueprint & 3D Spatial Twin Studio
│   └── css/                     # Dashboard & 3D Vision Specific Styles
└── python/                      # Backend Data Engine & ML Pipeline
    ├── models/
    │   ├── ev_hotspot_model.pkl # Trained Scikit-Learn Model (Demand Prediction)
    │   └── rto_metadata.csv     # RTO Geolocation & Registration Statistics
    ├── Backend_EV_charging/     # Master Datasets (OpenCharge, Vahan, Fuel types)
    └── landing-page/
        ├── server.py            # Python HTTP Server & ML API Endpoint Router
        ├── run.bat              # Batch script launcher for Windows
        ├── run.ps1              # PowerShell script launcher
        └── training/            # Model training & feature engineering pipelines
```

---

## 🚀 How to Run Locally

### Prerequisites
* **Python 3.8+** installed on your system.
* **Pip** (Python package installer).

### Step 1: Clone or Navigate to the Workspace
```bash
cd "copy of sih"
```

### Step 2: Install Python Dependencies
```bash
pip install pandas joblib scikit-learn
```

### Step 3: Start the EVision Server

**Option A: Using Python Command**
```bash
cd python/landing-page
python server.py
```

**Option B: Using Windows Batch Script**
Double-click `python/landing-page/run.bat` or run:
```cmd
.\python\landing-page\run.bat
```

**Option C: Using PowerShell Script**
```powershell
.\python\landing-page\run.ps1
```

### Step 4: Open in Browser
Open your browser and navigate to:
👉 **`http://localhost:8000`**

---

## 🌐 Live Deployment Plan — Where & How to Host EVision Live

To deploy EVision live on the web so anyone can access it, you have three primary deployment options ranging from **100% Free Cloud Hosting** to **Enterprise Cloud VPS**.

---

### 📦 Option 1: Free Full-Stack Deployment (Recommended)

Host the **Python ML Backend** on a free container service (**Render** or **Hugging Face Spaces**) and the **Frontend** on **Vercel**, **Netlify**, or **GitHub Pages**.

#### A. Backend Deployment (Render.com / Railway.app)
1. **Create `requirements.txt`** in `python/landing-page/`:
   ```txt
   pandas>=1.5.0
   joblib>=1.2.0
   scikit-learn>=1.0.0
   gunicorn>=20.1.0
   ```
2. **Push project to GitHub**.
3. Log in to [Render.com](https://render.com) -> Click **New Web Service** -> Connect your GitHub repo.
4. Set **Build Command**: `pip install -r python/landing-page/requirements.txt`
5. Set **Start Command**: `python python/landing-page/server.py` (or convert to Flask/FastAPI with `gunicorn`).
6. Render will generate a live API URL like `https://evision-api.onrender.com`.

#### B. Frontend Deployment (Vercel / Netlify / GitHub Pages)
1. Log in to [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
2. Connect your GitHub repository.
3. Set **Root Directory** as `./`.
4. Update API fetch URLs in JS files (`dashboard.html`, `landing.html`) to point to your live Render backend URL (`https://evision-api.onrender.com`).
5. Click **Deploy**. Your site will be live on `https://evision-india.vercel.app`!

---

### 🖥️ Option 2: Single Cloud VPS (All-in-One: DigitalOcean / AWS EC2 / Linode)

Host both frontend and backend together on a virtual server ($4–$6/month).

1. **Provision VPS**: Create an Ubuntu 22.04 LTS instance on **DigitalOcean Droplet**, **AWS EC2 (t3.micro)**, or **Linode**.
2. **Setup Server**:
   ```bash
   sudo apt update && sudo apt install -y python3-pip python3-venv nginx git
   git clone <YOUR_GITHUB_REPO_URL> evision
   cd evision
   python3 -m venv venv
   source venv/bin/activate
   pip install pandas joblib scikit-learn
   ```
3. **Run Backend as System Service (`/etc/systemd/system/evision.service`)**:
   ```ini
   [Unit]
   Description=EVision Python Server
   After=network.target

   [Service]
   User=ubuntu
   WorkingDirectory=/home/ubuntu/evision/python/landing-page
   ExecStart=/home/ubuntu/evision/venv/bin/python server.py
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```
   Start the service: `sudo systemctl daemon-reload && sudo systemctl enable --now evision`
4. **Configure Nginx Reverse Proxy** (`/etc/nginx/sites-available/default`):
   ```nginx
   server {
       listen 80;
       server_name evision.yourdomain.com;

       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```
5. **Add Free SSL Certificate**:
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d evision.yourdomain.com
   ```

---

### 🐳 Option 3: Docker Containerization (Google Cloud Run / AWS App Runner)

Create a single Docker container to run anywhere.

1. **Create `Dockerfile`**:
   ```dockerfile
   FROM python:3.10-slim

   WORKDIR /app

   COPY python/landing-page/requirements.txt ./
   RUN pip install --no-cache-dir -r requirements.txt

   COPY . .

   EXPOSE 8000

   CMD ["python", "python/landing-page/server.py"]
   ```
2. **Build & Run Docker Image**:
   ```bash
   docker build -t evision-app .
   docker run -p 8000:8000 evision-app
   ```
3. **Deploy to Google Cloud Run**:
   ```bash
   gcloud run deploy evision-service --image gcr.io/<PROJECT-ID>/evision-app --platform managed
   ```

---

## 📜 License & Credits

* Developed for **Smart India Hackathon (SIH)** / EV Infrastructure Modernization.
* GIS Maps Powered by **Leaflet.js** & **OpenStreetMap**.
* 3D CAD Renderer powered by **Three.js**.
* Datasets sourced from **Vahan Parivahan RTO Registrations** and **OpenCharge Map**.

---
*EVision India — Powering the Future of Smart Electric Mobility.* ⚡🚗🔋
