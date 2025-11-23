
# 🚀 **Interview Practice Partner (AI-Powered Mock Interview System)**

An interactive full-stack AI interview trainer built with **FastAPI**, **React (Vite)**, **Google Gemini**, **Speech-to-Text**, and **Dynamic Evaluation Reports**.

This system conducts real-time interviews, evaluates each response, gives feedback, generates a **final structured report**, and allows users to **view a detailed graphical analysis** (Radar + Bar charts).

---

# 📌 **Features**

### 🎙️ **AI Mock Interview**

* AI asks questions dynamically based on:

  * Selected **Role**
  * Job **Level**
  * User **Persona**
* Supports **text input** + **voice answer input**.

### 💬 **Instant Feedback**

* 1-sentence feedback after every answer.
* Smooth chat UI with animations.

### 📝 **Full Report Generation**

* Detailed question-by-question evaluation
* Strengths, weaknesses, improvement tips
* Radar chart + bar chart for:

  * Communication
  * Accuracy
  * Confidence
  * Overall performance

### 🔊 **Voice Input**

* Built using browser SpeechRecognition API.

### 🎨 **Beautiful UI**

* Responsive
* Smooth animations
* Auto-scrolling chat
* Gradient styles and shadow effects

---

# 🔧 **Tech Stack**

### **Backend**

* FastAPI
* Google Gemini API
* Pydantic
* Python-dotenv
* Uvicorn
* Custom Session Store

### **Frontend**

* React (Vite)
* Chart.js (Radar + Bar)
* CSS animations
* Speech-to-text (Web Speech API)

---

# 📂 **Project Structure**

```
Interview_Practice_Partner/
│
├── backend/
│   ├── app/
│   │   ├── gemini_client.py
│   │   ├── interview_logic.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── session_store.py
│   ├── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── style.css
│   │   ├── components/
│   │       ├── ChatPanel.jsx
│   │       ├── ControlPanel.jsx
│   │       ├── SummaryPanel.jsx
│   │       ├── VoiceControls.jsx
│   │       ├── FullReport.jsx
│   ├── package.json
│   ├── vite.config.js
│
├── .gitignore
└── README.md
```

---

# ⚙️ **Backend Setup (FastAPI)**

### **1. Create virtual environment**

```
cd backend
python -m venv .venv
```

### **2. Activate environment**

Windows:

```
.venv\Scripts\activate
```

### **3. Install dependencies**

```
pip install -r requirements.txt
```

### **4. Add your Gemini API key**

Create `.env` in backend folder:

```
GEMINI_API_KEY=your_key_here
```

### **5. Start FastAPI server**

```
uvicorn app.main:app --reload
```

Backend now runs at:
👉 [http://localhost:8000](http://localhost:8000)

---

# ⚙️ **Frontend Setup (React + Vite)**

### **1. Go to frontend**

```
cd frontend
```

### **2. Install dependencies**

```
npm install
```

### **3. Create `.env` file**

```
VITE_BACKEND_URL=http://localhost:8000
```

### **4. Start frontend**

```
npm run dev
```

Frontend runs at:
👉 [http://localhost:5173](http://localhost:5173)

---

# 📊 **Full Report Page**

Includes:

### ✔ Radar Chart

### ✔ Bar Chart

### ✔ Detailed Analysis per Question

### ✔ Auto-scrolling

### ✔ Back navigation

---

# 🧪 **API Endpoints**

### **POST /start_interview**

Starts an interview session.

### **POST /answer**

Processes answer + gives feedback + sends next question.

### **GET /summary**

Returns final summary.

### **GET /detailed_summary**

Returns full report with charts scoring fields.

---

# 📦 **Backend Requirements**

Your backend `requirements.txt` should include:

```
fastapi
uvicorn
google-generativeai
python-dotenv
pydantic
```

If missing, add:

```
pip install fastapi uvicorn google-generativeai python-dotenv pydantic
pip freeze > requirements.txt
```

---

# 🛠️ **Common Issues & Fixes**

### ❗CORS errors

Make sure FastAPI has:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### ❗Charts not loading

Ensure you destroy previous chart instance before drawing a new one.

---

# ☁️ **Deploying**

### **Frontend (Vercel/Netlify)**

Just build and upload:

```
npm run build
```

### **Backend (Render/Fly.io)**

Deploy FastAPI with Uvicorn.

---

# 🏁 **Final Result**

You now have a:

* Fully working AI interview trainer
* Smart dynamic question generator
* Live feedback system
* Voice-enabled chatting
* Full scoring analytics
* Exportable evaluation panel

Perfect for:
✔ portfolio
✔ interview assignment
✔ AI agent showpiece
