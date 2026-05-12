# DevMatch 🚀  
### A Developer Matching & Collaboration Platform

DevMatch is a full-stack MERN application designed to help developers connect, collaborate, and build meaningful professional relationships based on shared interests, skills, and goals.

Inspired by swipe-based platforms like Tinder, DevMatch provides a modern and engaging way for developers to discover like-minded peers for networking, learning, side projects, startups, and open-source collaboration.

---

# ✨ Features

- 🔐 Secure Authentication using JWT & bcrypt
- 👤 Developer Profile Management
- ❤️ Swipe-Based Matching System
- 💬 Real-Time Chat using Socket.IO
- 🌐 Responsive User Interface
- 📡 RESTful API Architecture
- ☁️ MongoDB Atlas Database Integration
- 🚀 MERN Stack Implementation
- ⭐ Premium Collaboration Features (Planned)

---

# 🛠️ Tech Stack

## Frontend
- React.js
- React Router DOM
- Axios
- Socket.IO Client

## Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt
- Socket.IO

## Deployment
- Vercel (Frontend)
- Render / Railway (Backend)
- MongoDB Atlas (Database)

---

# 📁 Project Structure

```bash
DevMatch/
│
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # React Components
│   │   ├── context/       # Auth Context
│   │   └── App.js         # Main App Router
│   └── package.json
│
├── server/                 # Node.js Backend
│   ├── models/            # Mongoose Models (User, Match, Message)
│   ├── routes/            # API Routes (auth, users, matches)
│   ├── middleware/        # JWT Auth Middleware
│   ├── server.js          # Main Server Entry Point
│   ├── .env               # Environment Variables
│   └── package.json
│
├── package.json           # Root Package (for running both)
├── README.md
└── .gitignore
```

---

# ⚙️ Installation & Setup

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas Account (or local MongoDB)

## 1. Clone Repository

```bash
git clone https://github.com/your-username/devmatch.git
cd devmatch
```

---

# 🔧 Backend Setup

## Navigate to backend folder

```bash
cd server
```

## Install dependencies

```bash
npm install
```

## Create `.env` file

Create a `.env` file in the server folder with the following variables:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/devmatch?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:3000
```

### Getting MongoDB URI:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get your connection string: `mongodb+srv://username:password@cluster...`
4. Replace `username` and `password` with your credentials

## Run Backend Server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

---

# 🎨 Frontend Setup

## Navigate to client folder

```bash
cd client
```

## Install dependencies

```bash
npm install
```

## Run Frontend Server

```bash
npm start
```

Client will open at `http://localhost:3000`

---

# 🚀 Running the Complete Application

### From root directory (requires concurrently to be installed):

```bash
npm start
```

This will run both client and server simultaneously.

Alternatively, run in separate terminals:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm start
```

---

# 🛣️ API Endpoints

## Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

## Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/users` - Get all users for swiping

## Matches
- `POST /api/matches/swipe` - Like or dislike a user
- `GET /api/matches/matches` - Get mutual matches

---

# 🎯 Usage Flow

1. **Register/Login** - Create an account or sign in
2. **Complete Profile** - Add skills, interests, bio, and social links
3. **Discover** - Swipe through developer profiles
4. **Match** - Like developers you want to connect with
5. **Chat** - Real-time messaging with matched developers (coming soon)

---

# 📝 Features to Add

- [ ] Real-time messaging interface
- [ ] User notifications
- [ ] Search and filter by skills
- [ ] User reviews and ratings
- [ ] Group collaboration spaces
- [ ] Project board integration
- [ ] Mobile responsive improvements

---

# 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Protected API routes
- CORS configuration
- Environment variable protection

---

# 🐛 Troubleshooting

### Port 5000 is already in use
```bash
lsof -i :5000  # Check what's using the port
kill -9 <PID>  # Kill the process
```

### MongoDB connection error
- Verify your MONGO_URI in `.env`
- Check MongoDB Atlas IP whitelist
- Ensure network access is enabled

### CORS errors
- Check that `CLIENT_URL` in `.env` matches your frontend URL
- Verify `http://localhost:3000` is whitelisted

---

# 📄 License

This project is licensed under the MIT License.

---

# 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

# 📧 Contact

For any questions or suggestions, please reach out to the project maintainer.

---

**Happy Coding! 🎉**

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

# 🎨 Frontend Setup

## Open new terminal

```bash
cd client
```

## Install dependencies

```bash
npm install
```

## Create `.env` file

```env
REACT_APP_API_URL=http://localhost:5000
```

## Start Frontend

```bash
npm start
```

Frontend runs on:

```bash
http://localhost:3000
```

---

# 🗄️ MongoDB Setup

1. Create MongoDB Atlas account
2. Create Cluster
3. Create Database User
4. Whitelist IP Address
5. Copy Connection String

Example:

```bash
mongodb+srv://username:password@cluster.mongodb.net/devmatch
```

Paste it inside:

```env
MONGO_URI=
```

---

# 🔑 API Endpoints

## Authentication

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/auth/register` | Register User |
| POST | `/api/auth/login` | Login User |

---

## Users

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/users/:id` | Get User Profile |
| PUT | `/api/users/update` | Update Profile |

---

## Swipe System

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/swipes` | Swipe User |
| GET | `/api/matches` | Get Matches |

---

## Chat

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/messages` | Send Message |
| GET | `/api/messages/:chatId` | Get Chat History |

---

# 💬 Socket.IO Example

## Backend

```javascript
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("User Connected");
});
```

## Frontend

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");
```

---

# 🔐 Authentication Flow

1. User Registration
2. Password Hashing using bcrypt
3. JWT Token Generation
4. Protected Route Verification
5. Authorized User Access

---

# 🧪 Testing

```bash
npm test
```

Recommended Tools:
- Jest
- Mocha
- Postman

---

# 🚀 Deployment

## Frontend (Vercel)

```bash
npm run build
```

Deploy the `client/build` folder.

---

## Backend (Render)

1. Push code to GitHub
2. Create Web Service on Render
3. Add Environment Variables
4. Deploy

---

# 📌 Future Enhancements

- GitHub Integration
- AI-Based Matching Algorithm
- File & Media Sharing
- Push Notifications
- Video Calling
- Mobile Application
- Admin Dashboard
- Collaborative Code Editor



# 📄 License

This project is developed for educational and academic purposes.