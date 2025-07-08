const API_URL = "http://localhost:8080/api/expenses";

const form = document.getElementById("expenseForm");
const tableBody = document.querySelector("#expenseTable tbody");

let editingId = null;

// Fetch all expenses on page load
window.onload = fetchExpenses;

// Add or update expense
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const expense = {
    title: document.getElementById("name").value, // Title field
    amount: parseFloat(document.getElementById("amount").value),
    category: document.getElementById("category").value, // Category field
    date: document.getElementById("date").value,
  };

  if (editingId) {
    await fetch(`${API_URL}/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expense),
    });
    editingId = null;
  } else {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expense),
    });
  }

  form.reset();
  fetchExpenses();
});

// Fetch and display all expenses
async function fetchExpenses() {
  const res = await fetch(API_URL);
  const data = await res.json();

  tableBody.innerHTML = "";
  data.forEach((expense) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${expense.title}</td>
      <td>${expense.amount}</td>
      <td>${expense.category}</td> <!-- Category added back here -->
      <td>${expense.date}</td>
      <td class="actions">
        <button class="edit" onclick="editExpense(${expense.id})">Edit</button>
        <button class="delete" onclick="deleteExpense(${expense.id})">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

// Edit expense
async function editExpense(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const expense = await res.json();

  document.getElementById("name").value = expense.title;
  document.getElementById("amount").value = expense.amount;
  document.getElementById("category").value = expense.category; // Populate the category
  document.getElementById("date").value = expense.date;

  editingId = id;
}

// Delete expense
async function deleteExpense(id) {
  if (confirm("Are you sure you want to delete this expense?")) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchExpenses();
  }
}
