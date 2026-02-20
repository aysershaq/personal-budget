/*
  Register page JavaScript
  Handles user registration and redirects to login on success.
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
  const response = await fetch('http://localhost:3000/api' + path, options);
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

// Initialize register form handling
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('register-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();
    try {
      await apiRequest('/register', 'POST', { name, email, password });
      alert('Registration successful! Please log in.');
      // Redirect to login page after successful registration
      window.location.href = 'login.html';
    } catch (err) {
      console.error('Registration error:', err);
    }
  });
});
