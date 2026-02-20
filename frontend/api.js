const API_BASE = "http://localhost:3000";

export const API = {
  register: () => `${API_BASE}/api/register`,
  login: () => `${API_BASE}/api/login`,
  incomes: () => `${API_BASE}/api/incomes`,
  expenses: () => `${API_BASE}/api/expenses`,
};
