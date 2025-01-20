import React, { useState, useEffect } from 'react';
import api from '../services/api'; // Importăm instanța Axios configurată
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState(''); // Stare pentru username
  const [password, setPassword] = useState(''); // Stare pentru parolă
  const [error, setError] = useState(''); // Stare pentru mesaje de eroare
  const [users, setUsers] = useState('');
  const navigate = useNavigate(); // Hook pentru navigare

  const handleLogin = async (e) => {
    e.preventDefault(); // Previne reîncărcarea paginii

    try {
      // Cerere către API pentru autentificare
      const response = await api.post('/login', { username, password });

      // Salvează token-ul JWT în localStorage
      localStorage.setItem('token', response.data.data.token);

      const loggedInUser = users.find(user => user.username === username);

      if (loggedInUser) {
        // Salvează id-ul și rolul utilizatorului în localStorage
        localStorage.setItem('userId', loggedInUser.id);
        localStorage.setItem('userRole', loggedInUser.role);

        console.log(loggedInUser.id, loggedInUser.role);
      }

      if(loggedInUser.role == "User")navigate('/my-tasks');
      if(loggedInUser.role == "Manager")navigate('/tasks');
      if(loggedInUser.role == "Admin")navigate("/users")
      // Resetează eroarea și redirecționează utilizatorul
      setError('');
    } catch (err) {
      console.error(err);
      setError('Invalid username or password. Please try again.');
    }
  };

  const fetchData = async () => {
    try {
      const userResponse = await api.get('/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(userResponse.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data. Please try again.');
    }
  };

  useEffect(() => {
      fetchData();
    }, []);
  

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '1rem' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              marginBottom: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              marginBottom: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.5rem',
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Login
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;
