const API_URL = "http://localhost:8080/api/expenses";

const form = document.getElementById("expenseForm");
const tableBody = document.querySelector("#expenseTable tbody");
const totalDisplay = document.getElementById("total");
const timeFilter = document.getElementById("time-filter");

let editingId = null;

// Fetch all expenses on page load
window.onload = fetchExpenses;

// Re-fetch when time filter changes
timeFilter.addEventListener("change", fetchExpenses);

// Add or update expense
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const expense = {
    title: document.getElementById("name").value,
    amount: parseFloat(document.getElementById("amount").value),
    category: document.getElementById("category").value,
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

// Fetch and display filtered expenses
async function fetchExpenses() {
  const res = await fetch(API_URL);
  const data = await res.json();

  const filter = timeFilter.value;
  const now = new Date();

  const filteredData = data.filter((expense) => {
    const expenseDate = new Date(expense.date);

    if (filter === "week") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      return expenseDate >= oneWeekAgo && expenseDate <= now;

    } else if (filter === "month") {
      return (
        expenseDate.getMonth() === now.getMonth() &&
        expenseDate.getFullYear() === now.getFullYear()
      );

    } else if (filter === "year") {
      return expenseDate.getFullYear() === now.getFullYear();
    }

    return true; // "all"
  });

  tableBody.innerHTML = "";
  let total = 0;

  filteredData.forEach((expense) => {
    total += expense.amount;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${expense.title}</td>
      <td>${expense.amount}</td>
      <td>${expense.category}</td>
      <td>${expense.date}</td>
      <td class="actions">
        <button class="edit" onclick="editExpense(${expense.id})">Edit</button>
        <button class="delete" onclick="deleteExpense(${expense.id})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  totalDisplay.textContent = `Total: ₹${total.toFixed(2)}`;
}

// Edit expense
async function editExpense(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const expense = await res.json();

  document.getElementById("name").value = expense.title;
  document.getElementById("amount").value = expense.amount;
  document.getElementById("category").value = expense.category;
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
