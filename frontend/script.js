const API_URL = "http://localhost:8080/api/expenses";

const form = document.getElementById("expenseForm");
const tableBody = document.querySelector("#expenseTable tbody");
const totalDisplay = document.getElementById("total");
const timeFilter = document.getElementById("time-filter");
const monthSelector = document.getElementById("month-selector");

let editingId = null;

window.onload = () => {
  timeFilter.value = "today";
  fetchExpenses();
};

// Show month selector only if "month" filter is selected
timeFilter.addEventListener("change", () => {
  if (timeFilter.value === "month") {
    monthSelector.style.display = "inline-block";
  } else {
    monthSelector.style.display = "none";
  }
  fetchExpenses();
});

monthSelector.addEventListener("change", fetchExpenses);

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

async function fetchExpenses() {
  const res = await fetch(API_URL);
  const data = await res.json();

  const filter = timeFilter.value;
  const selectedMonth = parseInt(monthSelector.value);
  const now = new Date();

  const filteredData = data.filter((expense) => {
    const expenseDate = new Date(expense.date);

    if (filter === "today") {
      return (
        expenseDate.getDate() === now.getDate() &&
        expenseDate.getMonth() === now.getMonth() &&
        expenseDate.getFullYear() === now.getFullYear()
      );
    } else if (filter === "year") {
      return expenseDate.getFullYear() === now.getFullYear();
    } else if (filter === "month") {
      return (
        expenseDate.getMonth() === selectedMonth &&
        expenseDate.getFullYear() === now.getFullYear()
      );
    }
    return true;
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

  // 👇 Update heading dynamically
  if (filter === "today") {
    totalDisplay.textContent = `Today's Total: ₹${total.toFixed(2)}`;
  } else if (filter === "year") {
    totalDisplay.textContent = `This Year Expense: ₹${total.toFixed(2)}`;
  } else if (filter === "month") {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    totalDisplay.textContent = `${monthNames[selectedMonth]} Expense: ₹${total.toFixed(2)}`;
  } else {
    totalDisplay.textContent = `Total: ₹${total.toFixed(2)}`;
  }
}

async function editExpense(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const expense = await res.json();

  document.getElementById("name").value = expense.title;
  document.getElementById("amount").value = expense.amount;
  document.getElementById("category").value = expense.category;
  document.getElementById("date").value = expense.date;

  editingId = id;
}

async function deleteExpense(id) {
  if (confirm("Are you sure you want to delete this expense?")) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchExpenses();
  }
}
const categoryFilter = document.getElementById("category-filter");  // Add this line near your other `const` declarations

window.onload = () => {
  timeFilter.value = "today";
  categoryFilter.value = "all";   // Initialize category filter to 'all'
  fetchExpenses();
};

// Add this event listener (near your other event listeners)
categoryFilter.addEventListener("change", fetchExpenses);

async function fetchExpenses() {
  const res = await fetch(API_URL);
  const data = await res.json();

  const filter = timeFilter.value;
  const selectedMonth = parseInt(monthSelector.value);
  const selectedCategory = categoryFilter.value.toLowerCase();  // Get selected category here
  const now = new Date();

  const filteredData = data.filter((expense) => {
    const expenseDate = new Date(expense.date);

    // Your existing time filtering logic unchanged
    let timeMatch = false;
    if (filter === "today") {
      timeMatch =
        expenseDate.getDate() === now.getDate() &&
        expenseDate.getMonth() === now.getMonth() &&
        expenseDate.getFullYear() === now.getFullYear();
    } else if (filter === "year") {
      timeMatch = expenseDate.getFullYear() === now.getFullYear();
    } else if (filter === "month") {
      timeMatch =
        expenseDate.getMonth() === selectedMonth &&
        expenseDate.getFullYear() === now.getFullYear();
    } else {
      timeMatch = true;
    }

    // **Add category filtering here, keep your existing logic**
    const categoryMatch =
      selectedCategory === "all" || expense.category.toLowerCase() === selectedCategory;

    return timeMatch && categoryMatch;
  });

  // Your existing code to build table and total display stays the same
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

  // Update total heading text to include category if selected
  let categoryText = "";
  if (selectedCategory !== "all") {
    categoryText = " - " + selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
  }

  if (filter === "today") {
    totalDisplay.textContent = `Today's Total${categoryText}: ₹${total.toFixed(2)}`;
  } else if (filter === "year") {
    totalDisplay.textContent = `This Year Expense${categoryText}: ₹${total.toFixed(2)}`;
  } else if (filter === "month") {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    totalDisplay.textContent = `${monthNames[selectedMonth]} Expense${categoryText}: ₹${total.toFixed(2)}`;
  } else {
    totalDisplay.textContent = `Total${categoryText}: ₹${total.toFixed(2)}`;
  }
}
