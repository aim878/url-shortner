# SnapURL — URL Shortener

A fast, minimal, and beautiful URL shortener built with **Node.js** and **Express**.

![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)
![Express](https://img.shields.io/badge/Express-4.x-blue?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

---

## ✨ Features

- 🔗 Shorten any long URL instantly
- ✏️ Custom aliases (e.g. `/my-link`)
- 📊 Click tracking per short URL
- 🗑️ Delete links
- 🎨 Clean dark UI with copy-to-clipboard
- ⚡ Zero database required (in-memory store)

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/aim878/url-shortener.git
cd url-shortener
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment (optional)
```bash
cp .env.example .env
```
Edit `.env` to set your port or domain:
```env
PORT=3000
BASE_URL=https://yourdomain.com
```

### 4. Start the server
```bash
# Production
npm start

# Development (auto-restart)
npm run dev
```

### 5. Open in browser
```
http://localhost:3000
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/shorten` | Shorten a URL |
| `GET` | `/api/urls` | Get all short URLs |
| `GET` | `/api/stats/:shortId` | Get stats for a link |
| `DELETE` | `/api/urls/:shortId` | Delete a short URL |
| `GET` | `/:shortId` | Redirect to original URL |

### POST `/api/shorten`
```json
{
  "url": "https://your-long-url.com",
  "customAlias": "my-link"
}
```

**Response:**
```json
{
  "shortUrl": "http://localhost:3000/my-link",
  "shortId": "my-link",
  "originalUrl": "https://your-long-url.com"
}
```

> **Alias rules:** letters, numbers, `-` and `_` only — max 30 characters.

---

## 🗂️ Project Structure

```
url-shortener/
├── src/
│   └── index.js        # Express server + API routes
├── public/
│   ├── index.html      # Frontend UI
│   └── 404.html        # 404 page
├── .env.example        # Environment variable template
├── .gitignore
├── package.json
└── README.md
```

---

## 🔮 Future Improvements

- [ ] MongoDB/PostgreSQL integration
- [ ] User authentication
- [ ] QR code generation
- [ ] Link expiry dates
- [ ] Analytics dashboard

---

## 👤 Author

**Ahmad Hassan**
- LinkedIn: [linkedin.com/in/aimhassan](https://linkedin.com/in/aimhassan)
- GitHub: [github.com/aim878](https://github.com/aim878)

---

## 📄 License

MIT © Ahmad Hassan
