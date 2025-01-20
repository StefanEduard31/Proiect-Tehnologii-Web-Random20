import React, { useState, useEffect } from 'react';
import api from '../services/api'; // Import the Axios instance

function UserManagement() {
  const [users, setUsers] = useState([]); // State for users
  const [newUser, setNewUser] = useState({
    managerId: null,
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    age: '',
    role: ''
  }); // State for new user
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch users. Please try again.');
    }
    
  };

  const addUser = async () => {
    try {
      console.log(newUser);
      await api.post('/users', newUser);
      setSuccess('User added successfully');
      setError('');
      setNewUser({
        managerId: null,
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        age: '',
        role: ''
      });
      fetchUsers(); // Refresh the user list
    } catch (err) {
      console.error(err);
      setError('Failed to add user. Please try again.');
      setSuccess('');
    }
  };

  const assignUser = async (managerId,id) => {
    try {
      await api.put(`users/assign/${managerId}/${id}`);
      setSuccess('Succesful assignment');
    } catch (err) {
      console.error(err);
      setError('Failed to assign');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '1rem' }}>
      <h2>User Management</h2>
      <div style={{ marginBottom: '1rem' }}>
        <h3>Add New User</h3>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            required
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            required
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
        </div>
        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            value={newUser.firstName}
            onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
            required
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            type="text"
            value={newUser.lastName}
            onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
            required
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
        </div>
        <div>
          <label htmlFor="age">Age</label>
          <input
            id="age"
            type="number"
            value={newUser.age}
            onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
            required
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
        </div>
        <div>
          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            required
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          >
            <option value="">Select Role</option>
            <option value="Manager">Manager</option>
            <option value="User">User</option>
          </select>
        </div>
        <button
          onClick={addUser}
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
          Add User
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <h3>User List</h3>
      <ul>
        {users.map((user) => (
        <li key={user.id}>
          {user.username} - {user.role}
        
          {user.role === "User" && (
            <div>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                style={{ marginRight: '1rem' }}
              >
                <option value="">Select User</option>
                {users.filter(user => user.role === "Manager").map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
              <button
                onClick={() => assignUser(selectedUser,user.id )}
                style={{
                  padding: '0.5rem',
                  marginLeft: '1rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Assign user
              </button>
            </div>
          )}
        </li>
          
        ))}
        
      </ul>
    </div>
  );
}

export default UserManagement;