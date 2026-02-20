/*
  Login page JavaScript
  Handles user login and redirects to the dashboard on success.
*/

// Utility for making API requests
async function apiRequest(path, method = 'GET', body = null) {
  const token = localStorage.getItem('token');
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }
  if (body) {
    options.body = JSON.stringify(body);
  }
  const response = await fetch('https://personal-budget-d0po.onrender.com/api'+path,options)
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    alert(errorData.message || 'Request failed');
    throw new Error(errorData.message || 'Request failed');
  }
  const contentType = response.headers.get('Content-Type') || '';
  if (contentType.includes('application/json')) {
    return await response.json();
  }
  return null;
}

// Initialize login form handling
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    try {
      const result = await apiRequest('/login', 'POST', { identifier, password });
      localStorage.setItem('token', result.token);
      // Redirect to dashboard after successful login
      window.location.href = 'dashboard.html';
    } catch (err) {
      console.error('Login error:', err);
    }
  });
});
