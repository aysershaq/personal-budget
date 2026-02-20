/*
 * JavaScript for the Personal Budget Front-End
 *
 * This file contains logic for handling user interactions, API requests,
 * authentication token management, and dynamic rendering of data on the
 * dashboard. Functions are modular and commented in English for clarity.
 */

// Base URL of the backend API. Adjust this value if your server runs on a
// different host or port. Only relative endpoints are appended to this base.
const API_BASE = 'http://localhost:3000';

/**
 * ✅ Central place for endpoints (YOU write them here)
 * This makes it easy to change routes in one place.
 */
const API = {
  register:` ${API_BASE}/api/register`,
  login: `${API_BASE}/api/login`,
  incomes:  `${API_BASE}/api/income/user`,
  expenses: `${API_BASE}/api/expenses`,
};

/**
 * Generic fetch helper with optional authorization header.
 *
 * @param {string} url Full URL (e.g. API.login)
 * @param {string} method HTTP method (GET, POST, etc.)
 * @param {Object|null} data Request body for POST/PUT/PATCH
 * @returns {Promise<Object>} Parsed JSON response
 * @throws Will throw parsed error object or generic error
 */
async function request(url, method = 'GET', data = null) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] =`Bearer ${token}`;
  }

  const options = { method, headers };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    let error;
    try {
      error = await response.json();
    } catch (e) {
      error = { error: response.statusText };
    }
    throw error;
  }

  return response.json();
}

/**
 * Initialize event listeners for forms and page behaviours. This function
 * detects the presence of specific elements on the page and attaches
 * appropriate handlers. It executes when the DOM content has loaded.
 */
function init() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const addIncomeForm = document.getElementById('addIncomeForm');
  const addExpenseForm = document.getElementById('addExpenseForm');
  const logoutLink = document.getElementById('logoutLink');

  // Attach login handler
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // NOTE: Your original code used email/password here.
      // But your backend login seems to accept identifier + password.
      // Keep as-is if your HTML has email field; otherwise adjust.
      const email = e.target.email?.value?.trim();
      const password = e.target.password?.value;

      const errorElem = document.getElementById('loginError');
      if (errorElem) errorElem.textContent = '';

      try {
        const result = await request(API.login, 'POST', {
          identifier:email ,
          password,
        });
        console.log("login result:", result);

        localStorage.setItem('token', result.token);
        
        window.location.href = 'dashboard.html';
      } catch (err) {
        if (errorElem) {
          errorElem.textContent = err.error || err.message || 'Login failed. Please try again.';
        }
      }
    });
  }

  // Attach registration handler
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // NOTE: Your original code used: name, email, password, income
      const name = e.target.name?.value?.trim();
      const email = e.target.email?.value?.trim();
      const password = e.target.password?.value;
      const income = parseFloat(e.target.income?.value);

      const errorElem = document.getElementById('registerError');
      if (errorElem) errorElem.textContent = '';

      try {
        const result = await request(API.register, 'POST', {
          userName: name,
          email,
          password,
          income,
        });

        // Some backends return token on register, some don’t.
        // Keep it like original behaviour:
        if (result.token) localStorage.setItem('token', result.token);

        window.location.href = 'login.html';
      } catch (err) {
        if (errorElem) {
          errorElem.textContent = err.error || err.message || 'Registration failed. Please try again.';
        }
      }
    });
  }

  // Attach logout handler
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      window.location.href = 'index.html';
    });
  }

  // Attach handlers for adding income
  if (addIncomeForm) {
    addIncomeForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const description = e.target.description?.value?.trim();
      const amount = parseFloat(e.target.amount?.value);

      try {
       

        await request(API.incomes, 'POST', { description, amount });
        e.target.reset();
        await loadDashboardData();
      } catch (err) {
        const dashboardErr = document.getElementById('dashboardError');
        if (dashboardErr) dashboardErr.textContent = err.error || err.message || 'Failed to add income.';
      }
    });
  }

  // Attach handlers for adding expense
  if (addExpenseForm) {
    addExpenseForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const description = e.target.description?.value?.trim();
      const amount = parseFloat(e.target.amount?.value);

      try {
        await request(API.expenses, 'POST', { description, amount });
        e.target.reset();
        await loadDashboardData();
      } catch (err) {
        const dashboardErr = document.getElementById('dashboardError');
        if (dashboardErr) dashboardErr.textContent = err.error || err.message || 'Failed to add expense.';
      }
    });
  }

  // Load dashboard data if on dashboard page
  if (document.getElementById('totalIncome')) {
    loadDashboardData();
  }
}

/**
 * Load the dashboard data from the server and render it on the page.
 * This function fetches incomes and expenses, calculates totals, updates
 * the DOM, and draws the spending chart. If the token is invalid or
 * missing, the user is redirected back to the login page.
 */
async function loadDashboardData() {

  console.log('LOAD DASHBOARD VERSION WITH USER ID');

  try {
    const [incomes, expenses] = await Promise.all([
      request(API.incomes, 'GET'),
      request(API.expenses, 'GET'),
    ]);

    const totalIncome = incomes.reduce((sum, inc) => sum + parseFloat(inc.amount), 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const balance = totalIncome - totalExpenses;

    document.getElementById('totalIncome').textContent = `$${totalIncome.toFixed(2)}`;
    document.getElementById('totalExpenses').textContent = `$${totalExpenses.toFixed(2)}`;
    document.getElementById('balance').textContent = `$${balance.toFixed(2)}`;

    renderEntryList('incomeList', incomes);
    renderEntryList('expenseList', expenses);

    drawSpendingChart(incomes, expenses);
  } catch (err) {
    // If unauthorized, redirect to login
    const msg = (err.error || err.message || '').toString().toLowerCase();
    if (msg.includes('unauthorized') || msg.includes('missing or invalid') || msg.includes('invalid or expired')) {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    } else {
      const dashboardErr = document.getElementById('dashboardError');
      if (dashboardErr) dashboardErr.textContent = err.error || err.message || 'Failed to load data.';
    }
  }
}

/**
 * Render a list of entries (incomes or expenses) into the specified UL element.
 *
 * @param {string} listId The ID of the UL element to populate
 * @param {Array<Object>} entries An array of entry objects with description and amount
 */
function renderEntryList(listId, entries) {
  const listElem = document.getElementById(listId);
  if (!listElem) return;

  listElem.innerHTML = '';
  entries.forEach((entry) => {
    const li = document.createElement('li');

    const desc = document.createElement('span');
    desc.textContent = entry.description;

    const amt = document.createElement('span');
    amt.textContent = `$${parseFloat(entry.amount).toFixed(2)}`;

    li.appendChild(desc);
    li.appendChild(amt);

    listElem.appendChild(li);
  });
}

/**
 * Draw a pie chart showing the distribution of incomes versus expenses. Uses
 * Chart.js to create a simple doughnut chart. When incomes or expenses
 * arrays are empty, placeholders are used to avoid chart errors.
 *
 * @param {Array<Object>} incomes The array of income objects
 * @param {Array<Object>} expenses The array of expense objects
 */
function drawSpendingChart(incomes, expenses) {
  const incomeTotal = incomes.reduce((sum, inc) => sum + parseFloat(inc.amount), 0);
  const expensesTotal = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  const canvas = document.getElementById('spendingChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Destroy existing chart if present to avoid duplicates
  if (window.spendingChart) {
    window.spendingChart.destroy();
  }

  window.spendingChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Income', 'Expenses'],
      datasets: [
        {
          data: [incomeTotal, expensesTotal],
          backgroundColor: [
            'rgba(0, 112, 243, 0.7)',
            'rgba(220, 53, 69, 0.7)',
          ],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    },
  });
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);