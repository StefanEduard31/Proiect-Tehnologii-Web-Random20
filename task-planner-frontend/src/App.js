import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import TaskManagement from './components/TaskManagement';
import UserManagement from './components/UserManagement';
import TaskView from './components/TaskView';

function App() {
  return (
    <Router>
      <div>
        <h1>Task Planner</h1>
        <Routes>
          {/* Ruta pentru autentificare */}
          <Route path="/" element={<Login />} />
          {/* Ruta pentru manageri */}
          <Route path="/tasks" element={<TaskManagement />} />
          {/* Ruta pentru administratori */}
          <Route path="/users" element={<UserManagement />} />
          {/* Ruta pentru executanți */}
          <Route path="/my-tasks" element={<TaskView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
