
# GUC Portal

**GUC Portal** is the official frontend interface for an academic and administrative web system tailored for students, instructors, and admins at the German University in Cairo (GUC). It connects to a custom-built backend powered by **Flask** and **Selenium**, offering dynamic data scraping and secure API communication.

> 🔗 Backend Repo: [GUC API (Flask + Selenium)](https://github.com/seifsamehtolba/guc-api)

---

## 🎯 Features

- 🔐 User authentication with role-based access
- 📚 View and manage course data
- 🧑‍🎓 Student dashboard with grades, schedule, and notifications
- 🧑‍🏫 Instructor view for class management and student tracking
- 🏛️ Admin tools for managing users and data
- 🔄 Live integration with university systems via Selenium-powered scraping

---

## 🧰 Tech Stack

- **Frontend**: React + React Router
- **Styling**: CSS / Tailwind (optional)
- **API Communication**: Axios or fetch
- **Backend**: Python Flask + Selenium (data scraper + API)

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/seifsamehtolba/guc-portal.git
cd guc-portal
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

> Adjust the API URL based on your Flask server location.

### 4. Start the development server

```bash
npm run dev
```

The app should now be running at `http://localhost:5173`.

---

## 📁 Project Structure

```
guc-portal/
├── src/
│   ├── components/     # UI components
│   ├── pages/          # Views and routes
│   ├── services/       # API logic
│   ├── context/        # Global state (auth, user)
│   └── App.jsx
├── .env
└── vite.config.js
```

---

## 🧪 Backend Notes

This frontend is built to work with a custom Flask backend that:

- Uses **Selenium** to scrape real-time university data
- Provides a **REST API** for the frontend to consume
- Handles user sessions, role validation, and secure routing

---

## 🚀 Deployment

1. Build for production:

```bash
npm run build
```

2. Deploy the `dist/` folder using your hosting provider (e.g., Netlify, Vercel).

---

## 🤝 Contributing

Contributions are welcome!  
Please fork the repo and submit a pull request for features, fixes, or enhancements.

---

## 📄 License

MIT License — See the [LICENSE](LICENSE) file for details.
