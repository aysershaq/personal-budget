/*
  Dashboard page JavaScript
  Handles fetching and displaying user data, summary, envelopes, transactions, and reports.
  Also supports adding envelopes, adding transactions, deleting, updating, and logging out.
*/

// API base path
const API_BASE_URL = 'https://personal-budget-d0po.onrender.com/api'



// Utility function for API requests
async function apiRequest(path, method = 'GET', body = null) {
  const token = localStorage.getItem('token');
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (token) options.headers['Authorization'] = `Bearer ${token}`;
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    alert(errorData.message || errorData.error || 'Request failed');
    throw new Error(errorData.message || errorData.error || 'Request failed');
  }

  const contentType = response.headers.get('Content-Type') || '';
  if (contentType.includes('application/json')) return await response.json();
  return null;
}

// DOM element references
const userInfoEl = document.getElementById('user-info');
const summaryInfoEl = document.getElementById('summary-info');
const envelopeListEl = document.getElementById('envelope-list');
const transactionListEl = document.getElementById('transaction-list');
const reportsSectionEl = document.getElementById('reports-section');
const addEnvelopeForm = document.getElementById('add-envelope-form');
const addTransactionForm = document.getElementById('add-transaction-form');
const transactionTypeSelect = document.getElementById('transaction-type');
const transactionEnvelopeSelect = document.getElementById('transaction-envelope');
const transactionToEnvelopeSelect = document.getElementById('transaction-to-envelope');
// NOTE: you don't have this input in HTML currently. Keep null-safe.
const transactionCategoryInput = document.getElementById('transaction-category');

/* ---------------------------
   DATE FILTER
---------------------------- */

function toISODateOnly(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getDefaultRange() {
  const today = new Date();
  const from = new Date(today.getFullYear(), today.getMonth(), 1);
  const to = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  return { from: toISODateOnly(from), to: toISODateOnly(to) };
}

let selectedRange = getDefaultRange();

function ensureReportsFilterUI() {
  if (document.getElementById('reports-filter-form')) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'reports-filter';
  wrapper.innerHTML = `
    <h3>Reports Filter</h3>
    <form id="reports-filter-form" class="reports-filter-form">
      <label>
        Start date:
        <input type="date" id="reports-from" required />
      </label>

      <label>
        End date:
        <input type="date" id="reports-to" required />
      </label>

      <button type="submit" id="apply-reports-filter">Apply</button>
      <button type="button" id="reset-reports-filter">Reset</button>
    </form>
  `;

const filterContainer = document.getElementById('reports-filter-container');
if (filterContainer) filterContainer.appendChild(wrapper);
else reportsSectionEl.parentNode.insertBefore(wrapper, reportsSectionEl);
  const fromInput = document.getElementById('reports-from');
  const toInput = document.getElementById('reports-to');

  fromInput.value = selectedRange.from;
  toInput.value = selectedRange.to;

  document.getElementById('reports-filter-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const from = fromInput.value;
    const to = toInput.value;

    if (!from || !to) return;
    if (new Date(from) >= new Date(to)) {
      alert('End date must be after start date');
      return;
    }

    selectedRange = { from, to };
    await loadReports(selectedRange.from, selectedRange.to);
  });

  document.getElementById('reset-reports-filter').addEventListener('click', async () => {
    selectedRange = getDefaultRange();
    fromInput.value = selectedRange.from;
    toInput.value = selectedRange.to;
    await loadReports(selectedRange.from, selectedRange.to);
  });
}

/* ---------------------------
   Helpers
---------------------------- */

function normalizeToArray(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data.flat(2);
  if (Array.isArray(data.data)) return data.data.flat(2);
  if (Array.isArray(data.envelopes)) return data.envelopes.flat(2);
  return Object.values(data).flat(2);
}

/* ---------------------------
   Delete + Update features
---------------------------- */

// Adjust if your backend differs:
// - Delete transaction: DELETE /transactions/:id
// - Delete envelope: DELETE /envelops/:id
// - Update envelope: PUT /envelops/:id  (or PATCH)

async function deleteTransaction(transactionId) {
  if (!transactionId) return;
  const ok = confirm('Delete this transaction?');
  if (!ok) return;

  await apiRequest(`/transactions/${transactionId}`, 'DELETE');
  await loadDashboard();
}

function normalizeToArray(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data.flat(3);

  if (Array.isArray(data.transactions)) return data.transactions.flat(3);
  if (Array.isArray(data.data)) return data.data.flat(3);
  if (Array.isArray(data.rows)) return data.rows.flat(3);

  return Object.values(data).flat(3);
}

async function deleteEnvelope(envelopeId) {
  if (!envelopeId || Number.isNaN(Number(envelopeId))) return;

  try {
    // 1) fetch transactions related to this envelope
    const result = await apiRequest(`/transactions-by-envelop/${envelopeId}`);

    // 2) normalize to real transactions array
    const items = normalizeToArray(result);

    // keep only objects that look like transactions (have id or amount/type)
    const txs = items.filter(
      (x) => x && typeof x === 'object' && (x.id != null || x.amount != null || x.type != null)
    );

    console.log('transactions-by-envelop raw:', result);
    console.log('normalized items:', items);
    console.log('filtered txs:', txs);

    // 3) if there are transactions -> block delete
    if (txs.length > 0) {
      alert(`Cannot delete envelope with ${txs.length} transaction(s). Move them first.`);
      return;
    }

    // 4) confirm then delete
    const ok = confirm('Are you sure you want to delete this envelope?');
    if (!ok) return;

    await apiRequest(`/envelops/${envelopeId}`, 'DELETE');
    await loadDashboard();
  } catch (err) {
    console.error('Delete envelope error:', err);
    alert(err.message || 'Failed to delete envelope');
  }
}
async function updateEnvelope(envelopeId, payload) {
  if (!envelopeId) return;
  await apiRequest(`/envelops/${envelopeId}`, 'PATCH', payload);
  
  
}

/* ---------------------------
   Populate envelope options
---------------------------- */
function populateEnvelopeOptions(envelopes) {
   transactionEnvelopeSelect.innerHTML = '';
  transactionToEnvelopeSelect.innerHTML = '';

  const envelopesArray = normalizeToArray(envelopes)
    .filter((env) => env && typeof env === 'object' && env.id != null && !Number.isNaN(Number(env.id)));

  if (!envelopesArray.length) {
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = 'No envelopes available';
    transactionEnvelopeSelect.appendChild(opt);
    transactionToEnvelopeSelect.appendChild(opt.cloneNode(true));
    return;
  }

  envelopesArray.forEach((env) => {
    const option = document.createElement('option');
    option.value = String(env.id); // always a string numeric
    option.textContent = `${env.title ?? env.name ?? 'Unnamed'} (${env.balance ?? env.current_balance ?? 0})`;
    transactionEnvelopeSelect.appendChild(option);

    const toOption = option.cloneNode(true);
    transactionToEnvelopeSelect.appendChild(toOption);
  });
}

// Render user details
function renderUserInfo(user) {
  userInfoEl.innerHTML = `
    <h3>User Info</h3>
    <p><strong>Name:</strong> ${user.user.user_name}</p>
    <p><strong>Email:</strong> ${user.user.email}</p>
  `;
}

// Render summary report
function renderSummary(summary) {
  summaryInfoEl.innerHTML = `
    <h3>Summary</h3>
    <p><strong>Total Income:</strong> ${summary.summary.total_income}</p>
    <p><strong>Total Expense:</strong> ${summary.summary.total_expense}</p>
    <p><strong>Net Cash Flow:</strong> ${summary.summary.net_cashflow}</p>
    <p><strong>Transactions Count:</strong> ${summary.summary.tx_count}</p>
  `;
}

/* ---------------------------
   Render envelopes (UPDATED)
   - delete button
   - edit button + inline edit form
---------------------------- */
function renderEnvelopes(envelopes) {
  const envelopesArray = normalizeToArray(envelopes);

  if (!envelopesArray.length) {
    envelopeListEl.innerHTML = '<h3>Envelopes</h3><p>No envelopes found.</p>';
    return;
  }

     console.log(envelopesArray)

  const listItems = envelopesArray
    .map((env) => {
      const title = env.title ?? env.name ?? 'Unnamed';
      const bal = env.balance ?? env.current_balance ?? 0;

      return `
        <li class="envelope-item">
          <div class="envelope-row" style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:5px">
            <span><strong>${title}</strong>: ${bal}</span>

            <div class="envelope-actions" style="display:flex;gap:8px;">
              <button class="secondary btn-edit-envelope"
                      data-envelope-id="${env.id}"
                      data-envelope-title="${String(title).replaceAll('"', '&quot;')}"
                      data-envelope-balance="${bal}">
                Edit
              </button>

              <button class="danger btn-delete-envelope" data-envelope-id="${env.id}">Delete</button>
            </div>
          </div>

          <!-- inline edit form (hidden by default) -->
         <form class="edit-envelope-form hidden"
      data-envelope-id="${env.id}">
            <input type="text" class="edit-envelope-title" required value="${String(title).replaceAll('"', '&quot;')}" />
            <input type="number" class="edit-envelope-balance" required min="0" step="0.01" value="${bal}" />
            <button type="submit" class="primary">Save</button>
            <button type="button" class="secondary btn-cancel-edit" data-envelope-id="${env.id}">Cancel</button>
          </form>
        </li>
      `;
    })
    .join('');

 
  envelopeListEl.innerHTML = `<h3>Envelopes</h3><ul class="list">${listItems}</ul>`;
}

// Render transactions (UPDATED + delete column)
function renderTransactions(transactions) {
  const transactionsArray = normalizeToArray(transactions);

  if (!transactionsArray.length) {
    transactionListEl.innerHTML = '<h3>Recent Transactions</h3><p>No transactions found.</p>';
    return;
  }

  const rows = transactionsArray
    .map((tx) => {
      const date = new Date(tx.transaction_date || tx.date || Date.now()).toLocaleDateString();
      const type = tx.type || (tx.amount >= 0 ? 'income' : 'expense');
      const envName = tx.envelope_name || tx.envelop_name || tx.envelope?.name || tx.envelope?.title || '-';
      const id = tx.id;
const toenv = tx.to_envelop;
      return `
        <tr>
          <td>${date}</td>
          <td>${type}</td>
          <td>${tx.amount}</td>
          <td>${envName}</td>
          <td>${toenv}</td>

          <td>
            <button class="danger btn-delete-transaction" data-transaction-id="${id}">Delete</button>
          </td>
        </tr>
      `;
    })
    .join('');

  transactionListEl.innerHTML = `
    <h3>Recent Transactions</h3>
    <table class="table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Type</th>
          <th>Amount</th>
          <th>From Envelope</th>
          <th>To Envelope</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

// Render reports
function renderReports(byEnvelope, budgetVsActual) {
  let byEnvelopeSection = '<h3>By Envelope</h3>';

  const byEnvArray = Array.isArray(byEnvelope)
    ? byEnvelope.flat(1)
    : Object.values(byEnvelope).flat(1);

  if (byEnvArray && byEnvArray.length) {
    const rows = byEnvArray
      .map((c) => `<tr><td>${c.name}</td><td>${c.total_expense}</td></tr>`)
      .join('');
    byEnvelopeSection += `<table class="table"><thead><tr><th>Envelope</th><th>Total Expenses</th></tr></thead><tbody>${rows}</tbody></table>`;
  } else {
    byEnvelopeSection += '<p>No data.</p>';
  }

  let budgetSection = '<h3>Budget vs Actual</h3>';

  const budgetVsActualArray = Array.isArray(budgetVsActual)
    ? budgetVsActual.flat(1)
    : Object.values(budgetVsActual).flat(1);

    console.log("budget vs actual",budgetVsActualArray)

  if (budgetVsActualArray && budgetVsActualArray.length) {
    const budgetRows = budgetVsActualArray
      .map((b) => {
        const actual = b.actual || b.total_expense || 0;
        const budgeted = b.budgeted || b.balance || 0;
        const diff = b.difference !== undefined ? b.difference : (Number(budgeted) - Number(actual));
        return `<tr><td>${b.title || b.name}</td><td>${budgeted}</td><td>${actual}</td><td>${diff}</td></tr>`;
      })
      .join('');
    budgetSection += `<table class="table"><thead><tr><th>Envelope</th><th>Budgeted</th><th>Actual</th><th>Difference</th></tr></thead><tbody>${budgetRows}</tbody></table>`;
  } else {
    budgetSection += '<p>No data.</p>';
  }

  reportsSectionEl.innerHTML = `${byEnvelopeSection}${budgetSection}`;
}

/* ---------------------------
   LOAD REPORTS
---------------------------- */
async function loadReports(from, to) {
  try {
    const summary = await apiRequest(`/reports/summary?from=${from}&to=${to}`);
    renderSummary(summary);

    const byEnvelope = await apiRequest(`/reports/by-envelop?from=${from}&to=${to}`);

    let budgetVsActual = [];
    try {
      budgetVsActual = await apiRequest(`/reports/budget-vs-actual?from=${from}&to=${to}`);
    } catch (err) {
      budgetVsActual = [];
    }

    renderReports(byEnvelope, budgetVsActual);
  } catch (err) {
    console.error('Reports error:', err);
  }
}

// Load dashboard data
async function loadDashboard() {
  try {
    const user = await apiRequest('/user');
    renderUserInfo(user);

    const envelopes = await apiRequest('/envelops');
    renderEnvelopes(envelopes);
    populateEnvelopeOptions(envelopes);

      
    const transactions = await apiRequest('/transactions?limit=10');
    renderTransactions(transactions);
      
    ensureReportsFilterUI();
    await loadReports(selectedRange.from, selectedRange.to);
  } catch (err) {
    console.log('Dashboard error:', err);
    localStorage.removeItem('token');
  }
}

// Event listeners for forms and actions
document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('token')) {
    window.location.href = 'login.html';
    return;
  }

  // Delete + Edit actions via event delegation
  envelopeListEl.addEventListener('click', (e) => {

  // DELETE
  const deleteBtn = e.target.closest('.btn-delete-envelope');
  if (deleteBtn) {
    const envelopeId = Number(deleteBtn.dataset.envelopeId);
    deleteEnvelope(envelopeId);
    return;
  }

  // EDIT BUTTON
  const editBtn = e.target.closest('.btn-edit-envelope');
  if (editBtn) {
    const envelopeId = Number(editBtn.dataset.envelopeId);

    // hide all edit forms first (only one open at a time)
   envelopeListEl.querySelectorAll('.edit-envelope-form')
  .forEach(f => f.classList.add('hidden'));

  const form = envelopeListEl.querySelector(
  `.edit-envelope-form[data-envelope-id="${envelopeId}"]`
);

    if (form) form.classList.remove('hidden');

    return;
  }

  // CANCEL BUTTON
  const cancelBtn = e.target.closest('.btn-cancel-edit');
  if (cancelBtn) {
    const envelopeId = Number(cancelBtn.dataset.envelopeId);
    const form = envelopeListEl.querySelector(
  `.edit-envelope-form[data-envelope-id="${envelopeId}"]`
);
;

    if (form) form.classList.add('hidden');

    return;
  }

});

  // Save edit (submit)
envelopeListEl.addEventListener('submit', async (e) => {
  const form = e.target.closest('form.edit-envelope-form');
  if (!form) return;

  e.preventDefault();

  const envelopeId = Number(form.dataset.envelopeId);
  const newTitle = form.querySelector('.edit-envelope-title').value.trim();
  const newBalance = parseFloat(form.querySelector('.edit-envelope-balance').value);
console.log("new balance ",newBalance)
  if (!envelopeId || !newTitle || Number.isNaN(newBalance)) {
    alert('Please enter valid title and balance');
    return;
  }

  try {
    await updateEnvelope(envelopeId, { title: newTitle, balance: newBalance });

    // hide form after save
    form.classList.add('hidden');

    // refresh UI so the <span><strong>title</strong>: balance</span> updates
    await loadDashboard();
  } catch (err) {
    console.error('Update envelope error:', err);
  }
});

  // Delete transaction via event delegation
  transactionListEl.addEventListener('click', async (e) => {
    const btn = e.target.closest('.btn-delete-transaction');
    if (!btn) return;

    const transactionId = Number(btn.dataset.transactionId);
    try {
      await deleteTransaction(transactionId);
    } catch (err) {
      console.error('Delete transaction error:', err);
    }
  });

  loadDashboard();

  document.getElementById('logout-button').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  });

  // Add envelope
  addEnvelopeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('envelope-name').value.trim();
    const balance = parseFloat(document.getElementById('envelope-budget').value);

    try {
      await apiRequest('/envelops', 'POST', { title, balance });
      await loadDashboard();
      document.getElementById('envelope-name').value = '';
      document.getElementById('envelope-budget').value = '';
    } catch (err) {
      console.error('Envelope add error:', err);
    }
  });

  // Toggle transfer fields
  transactionTypeSelect.addEventListener('change', () => {
    const isTransfer = transactionTypeSelect.value === 'transfer';
    document.querySelectorAll('.transfer-only').forEach((el) => {
      if (isTransfer) el.classList.remove('hidden');
      else el.classList.add('hidden');
    });
  });

  // Add transaction
  addTransactionForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const type = transactionTypeSelect.value;
    const amount = parseFloat(document.getElementById('transaction-amount').value);
    const envelopeId = parseInt(transactionEnvelopeSelect.value, 10);
const date = document.getElementById('transaction-date').value
    const body = { type, amount ,date };

    try {
      if (type === 'transfer') {
        const toEnvelopeId = parseInt(transactionToEnvelopeSelect.value, 10);
        await apiRequest(`/transfer/${envelopeId}/${toEnvelopeId}`,'POST',body)
      } else {
        // your backend expects two params, keep it consistent
        await apiRequest(`/transactions/${envelopeId}`, 'POST', body);
      }

      await loadDashboard();

      addTransactionForm.reset();
      transactionTypeSelect.dispatchEvent(new Event('change'));
    } catch (err) {
      console.error('Transaction add error:', err);
    }
  })
})

