import React, { useState, useEffect } from 'react';
import api from '../services/api'; // Import the Axios instance

function TaskView() {
  const [tasks, setTasks] = useState([]); // Initialize tasks as an empty array
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCompleted, setShowCompleted] = useState(false); // State for checkbox

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks');
        if (Array.isArray(response.data)) {
          setTasks(response.data); // Ensure the fetched data is an array
        } else {
          setError('Failed to fetch tasks');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch tasks');
      }
    };

    fetchTasks();
  }, []);

  const completeTask = async (taskId) => {
    try {
      await api.put(`/tasks/${taskId}/complete`);
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: 'Completed' } : task
      ));
      setSuccess('Task completed successfully');
    } catch (err) {
      console.error(err);
      setError('Failed to complete task');
    }
  };

  const handleCheckboxChange = () => {
    setShowCompleted(!showCompleted);
  };

  const userId = localStorage.getItem('userId'); // Get the logged-in user's ID from localStorage
  const filteredTasks = showCompleted ? tasks.filter(task => task.userId === parseInt(userId)) : tasks.filter(task => task.userId === parseInt(userId) && task.status !== 'Completed' && task.status !== 'Closed');

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '1rem' }}>
      <h2>My Tasks</h2>
      <label>
        <input
          type="checkbox"
          checked={showCompleted}
          onChange={handleCheckboxChange}
        />
        Show full task history
      </label>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id}>
            <strong>{task.description}</strong> - Status: {task.status}
            {task.status !== 'Completed' && task.status !== 'Closed' && (
              <button
                onClick={() => completeTask(task.id)}
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
                Complete Task
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskView;