<div align="center">
  <img src="https://via.placeholder.com/150x150/000000/FFFFFF?text=RASU" alt="RASU Logo" width="120" height="120" />

  # RASU — AI-Powered Fashion E-Commerce

  [![Live Demo](https://img.shields.io/badge/Live%20Demo-rasu.rkdev.online-00e5ff?style=for-the-badge&logo=vercel)](https://rasu.rkdev.online)
  [![GitHub Stars](https://img.shields.io/github/stars/Rah7858/RASU?style=for-the-badge&color=yellow)](https://github.com/Rah7858/RASU)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

## ✨ Overview
RASU is a premium, futuristic streetwear e-commerce platform blending high-end fashion aesthetics with bleeding-edge artificial intelligence. It delivers a hyper-personalized shopping experience through an integrated AI Stylist, automated size recommendations, and intelligent outfit curation. 
**[Experience the live platform here →](https://rasu.rkdev.online)**

## 🚀 Live Demo
- **🌐 Live Site**: [rasu.rkdev.online](https://rasu.rkdev.online)
- **👤 Demo Login**: 
  - **Email**: demo@rasu.com
  - **Password**: Demo@1234

## 🤖 AI Features
- **AI Style Assistant**: A persistent, conversational AI stylist powered by Google Gemini that remembers your preferences and curates personalized looks.
- **AI Size Recommender**: Intelligent fitting engine analyzing height, weight, and fit preference to instantly suggest the perfect size.
- **AI Outfit Builder**: Dynamic engine that analyzes any viewed product to instantly curate perfectly matched complimentary pieces.

## ⚡ Key Features
### 🛍️ Shopping
- Premium glassmorphism UI with flawless cross-device responsiveness (320px to 4K).
- Advanced product filtering, sorting, and seamless cart/wishlist management.
- Real-time animated order tracking with an intuitive visual timeline.

### 🔐 Auth
- Secure JWT-based authentication with bcrypt password hashing.
- Role-based access control (Customers vs. Admins).
- Protected API endpoints and frontend routes.

### 🤖 AI Integration
- Google Gemini 2.5 Flash API utilized for ultra-fast, intelligent fashion recommendations.
- Local sessionStorage caching to prevent redundant AI API calls and ensure instantaneous page loads.

### 👨‍💼 Admin Dashboard
- Comprehensive `/admin` control center protected by dedicated admin authentication.
- Data-rich dashboard with Recharts-powered metrics (Revenue, Orders, User Growth).
- Full CRUD management for Products, Orders, and Users.

## 🛠️ Tech Stack
| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Auth** | JSON Web Tokens (JWT), bcrypt |
| **AI** | Google Gemini API (2.5 Flash) |
| **3D / Animations** | Three.js, Framer Motion |
| **Payments** | Razorpay (Test Mode Integration) |
| **Deployment** | Vercel (Frontend), Render (Backend) |

## 📸 Screenshots

> *Add high-resolution screenshots here before publishing.*

<!-- Homepage Screenshot -->
![Homepage Preview](https://via.placeholder.com/800x450/111111/FFFFFF?text=Homepage+Screenshot)

<!-- Shop Page Screenshot -->
![Shop Page Preview](https://via.placeholder.com/800x450/111111/FFFFFF?text=Shop+Page+Screenshot)

<!-- Product Detail Screenshot -->
![Product Detail with AI Features](https://via.placeholder.com/800x450/111111/FFFFFF?text=Product+Details+%2B+AI+Outfit+Builder)

<!-- AI Chatbot Screenshot -->
![AI Style Chatbot](https://via.placeholder.com/800x450/111111/FFFFFF?text=AI+Style+Chatbot+Screenshot)

<!-- Admin Dashboard Screenshot -->
![Admin Dashboard Overview](https://via.placeholder.com/800x450/111111/FFFFFF?text=Admin+Dashboard+Screenshot)

## 🏗️ Architecture
```text
[Frontend - React/Tailwind]
       │
       ▼
[REST API - Express.js] ──────────► [Google Gemini AI API]
       │
       ▼
[Database - MongoDB Atlas]
```

## ⚙️ Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB instance)
- Google Gemini API key (Free at Google AI Studio)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/Rah7858/RASU.git
cd RASU

# 2. Install Frontend dependencies
cd frontend
npm install

# 3. Setup Frontend Environment Variables
cp .env.example .env
# Open .env and add your Gemini API key and Razorpay Keys

# 4. Start the Frontend Development Server
npm run dev
```

*(Note: Repeat the installation process for the backend directory once configured).*

### Environment Variables
The frontend requires the following environment variables. A `.env.example` file is provided in the `frontend/` directory.

```env
# Backend API URL (e.g. http://localhost:5000)
VITE_API_BASE_URL=

# Google Gemini API Key
# Get your free key at: https://aistudio.google.com/app/apikey
VITE_GEMINI_API_KEY=

# Razorpay Keys (Test Mode)
# Get your keys at: https://dashboard.razorpay.com
VITE_RAZORPAY_KEY_ID=
```

## 📡 API Endpoints (Backend Reference)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Create a new user account | No |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT | No |
| `GET` | `/api/products` | Fetch all products with filters | No |
| `GET` | `/api/products/:id` | Fetch single product details | No |
| `POST` | `/api/orders` | Create a new order | Yes |
| `GET` | `/api/orders/:id` | Track an order | Yes |
| `GET` | `/api/admin/stats` | Get dashboard metrics | Yes (Admin) |

## 🚀 Deployment

1. **Frontend (Vercel)**:
   - Connect repository to Vercel.
   - Set Framework Preset to `Vite`.
   - Add the necessary Environment Variables.
   - Deploy.

2. **Backend (Render)**:
   - Connect repository.
   - Specify Root Directory as `backend/`.
   - Add MongoDB connection string and JWT Secrets to Environment Variables.
   - Deploy.

3. **Database (MongoDB Atlas)**:
   - Create cluster, whitelist IP `0.0.0.0/0`.
   - Copy connection string to backend environment variables.

## 👨‍💻 Author

**Rahul Kumar**
Full-Stack Developer

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Rah7858)
[![Portfolio](https://img.shields.io/badge/Portfolio-00e5ff?style=for-the-badge&logo=Web&logoColor=black)](https://rkdev.online)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/Rah7858)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:rahul.work1017@gmail.com)

## 📄 License

This project is licensed under the [MIT License](LICENSE).
