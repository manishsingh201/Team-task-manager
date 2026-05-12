# Team Task Manager

A full-stack web application for managing team projects and tasks efficiently. Built with React.js frontend and Node.js/Express backend with MongoDB database.

## 🚀 Features

- **User Authentication**: Secure login and signup system
- **Project Management**: Create and manage multiple projects
- **Task Assignment**: Assign tasks to team members with due dates
- **Dashboard**: Visual dashboard with task statistics and progress charts
- **Team View**: Monitor team member performance and task distribution
- **Real-time Updates**: Live updates for task status changes
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Recharts** - Data visualization library
- **React Toastify** - Notification system
- **CSS** - Styling with modern design

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

## 📋 Prerequisites

Before running this application, make sure you have:
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/team-task-manager.git
   cd team-task-manager
   ```

2. **Install backend dependencies**
   ```bash
   cd back-end
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../front-end
   npm install
   ```

4. **Set up environment variables**

   Create a `.env` file in the `back-end` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/team-task-manager
   JWT_SECRET=your-secret-key-here
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system.

## 🚀 Running the Application

1. **Start the backend server**
   ```bash
   cd back-end
   npm start
   ```
   Server will run on http://localhost:5000

2. **Start the frontend**
   ```bash
   cd front-end
   npm start
   ```
   Frontend will run on http://localhost:3000

## 📁 Project Structure

```
team-task-manager/
├── back-end/                 # Backend API
│   ├── models/              # MongoDB models
│   │   ├── user.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/              # API routes
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   ├── server.js            # Main server file
│   └── package.json
├── front-end/               # React frontend
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── pages/           # React components
│   │   │   ├── Dashboard.js
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── Project.js
│   │   │   ├── TeamView.js
│   │   │   └── Layout.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [Your GitHub](https://github.com/your-username)

## 🙏 Acknowledgments

- React.js documentation
- Express.js documentation
- MongoDB documentation
- All contributors and supporters