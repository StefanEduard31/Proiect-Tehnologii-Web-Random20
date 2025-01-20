import React, { useState, useEffect } from 'react';
import api from '../services/api'; // Import the Axios instance

function TaskManagement() {
  const [tasks, setTasks] = useState([]); // State for tasks
  const [users, setUsers] = useState([]); // State for users
  const [managedUsers, setManagedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [assignedUser, setAssignedUser] = useState(''); // State for selected user
  const [taskName, setName] = useState(''); // State for task name
  const [description, setDescription] = useState(''); // State for task description
  const [deadline, setDeadline] = useState(''); // State for task deadline
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const managerId = localStorage.getItem('userId');

  const fetchData = async () => {
    try {
      const taskResponse = await api.get(`/users/${managerId}/managedTasks`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTasks(taskResponse.data);

      const userResponse = await api.get('/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(userResponse.data);

      const managedUserResponse = await api.get(`/users/assignedUsers/${managerId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setManagedUsers(managedUserResponse.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data. Please try again.');
    }
  };

  const createTask = async () => {
    const taskData = { taskName, description, deadline };
    console.log('Creating task with data:', taskData); // Log the data being sent
    try {
      const response = await api.post('/tasks', taskData);
      const newTask = response.data;

      if (selectedUser && selectedUser !== 'Select User') {
        await api.put(`/tasks/${newTask.id}`, { assignedTo: selectedUser }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      }

      setSuccess('Task created and assigned successfully');
      setError('');
      setName('');
      setDescription('');
      setDeadline('');
      setSelectedUser('');
      fetchData(); // Refresh the task list
    } catch (err) {
      console.error(err);
      setError('Failed to create task. Please try again.');
      setSuccess('');
    }
  };

  const assignTask = async (taskId, userId) => {
    try {
      await api.put(`/tasks/assign/${taskId}/${userId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSuccess('Task assigned successfully');
      setError('');
      fetchData(); // Refresh the task list
    } catch (err) {
      console.error(err);
      setError('Failed to assign task. Please try again.');
      setSuccess('');
    }
  };

  const closeTask = async (taskId) => {
    try {
      await api.put(`/tasks/${taskId}/close`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSuccess('Task assigned successfully');
      setError('');
      fetchData(); // Refresh the task list
    } catch (err) {
      console.error(err);
      setError('Failed to assign task. Please try again.');
      setSuccess('');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '1rem' }}>
      <h2>Task Management</h2>
      <div style={{ marginBottom: '1rem' }}>
        <h3>Create New Task</h3>
        <input
          type="text"
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
        <input
          type="text"
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
        <input
          type="date"
          placeholder="Task Deadline"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
        <button
          onClick={createTask}
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
          Create Task
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <h3>Task List</h3>
      <select
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
        style={{ marginRight: '1rem' }}
      >
        <option value="">All users</option>
        {managedUsers.filter(user => user.role == "User").map((user) => (
          <option key={user.id} value={user.id}>
            {user.username}
          </option>
        ))}
      </select>
      <ul>
        {tasks.filter(task => !selectedUser || task.userId == selectedUser).map((task) => (
          <li key={task.id}>
            <strong>{task.description}</strong> - Status: {task.status}
            {task.assignedTo ? (
              <p>Assigned to: {task.assignedTo}</p>
            ) : (
              <>
                <select
                  value={assignedUser}
                  onChange={(e) => setAssignedUser(e.target.value)}
                  style={{ marginRight: '1rem' }}
                >
                  <option value="">Select User</option>
                  {managedUsers.filter(user => user.role == "User").map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => assignTask(task.id, assignedUser)}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Assign
                </button>
                {task.status === "Completed" && (
                  <div>
                    <button
                      onClick={() => closeTask(task.id)}
                      style={{
                        padding: '0.5rem',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Close
                    </button>
                  </div>
                )}
                
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskManagement;