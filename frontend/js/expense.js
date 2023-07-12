// API URL ====================================================

const baseUrl = `http://localhost:8000/api/expense`;

// ===========================================================
const addExpenseFrom = document.getElementById("addExpenseFrom");
const expenseTable = document.getElementById("expenseTable");

// form submit event ------------------
addExpenseFrom.addEventListener("submit", addExpenseToDB);

// addExpenseToDB--------------------------------

async function addExpenseToDB(e) {
  e.preventDefault();

  // getting input values
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;

  const expenseObj = {
    amount: amount,
    category: category,
    description: description,
  };

  //   Sending data to Backend

  try {
    const response = await axios.post(baseUrl, expenseObj);
    console.log(response);
  } catch (error) {
    console.log(error);
  }

  //   clear input fields
  addExpenseFrom.amount.value = "";
  addExpenseFrom.category.value = "";
  addExpenseFrom.description.value = "";
}

// Get Data From Backend ===========================================

async function getAllExpenseFormBE() {
  try {
    const resData = await axios.get(baseUrl);
    console.log(resData.data);
    ShowDataOnFE(resData.data);
  } catch (error) {
    console.log(error);
  }
}
getAllExpenseFormBE();

// ShowDataOnFE =====================================================

async function ShowDataOnFE(data) {
  // mapping the elements
  console.warn(data);
  const MAPdata = data.map((data) => {
    let tr = document.createElement("tr");
    let tdAmount = document.createElement("td");
    let tdCategory = document.createElement("td");
    let tdDescription = document.createElement("td");

    let tdEdit = document.createElement("td");
    let tdDelete = document.createElement("td");
    let btnEdit = document.createElement("edit");
    let btnDelete = document.createElement("delete");
    btnEdit.className = "btn btn-outline-dark";
    btnDelete.className = "btn btn-outline-danger";
    btnEdit.appendChild(document.createTextNode("Edit"));
    btnDelete.appendChild(document.createTextNode("Delete"));

    tdAmount.appendChild(document.createTextNode(data.amount));
    tdCategory.appendChild(document.createTextNode(data.category));
    tdDescription.appendChild(document.createTextNode(data.description));
    tdEdit.appendChild(btnEdit);
    tdDelete.appendChild(btnDelete);

    tr.appendChild(tdAmount);
    tr.appendChild(tdDescription);
    tr.appendChild(tdCategory);

    tr.appendChild(tdEdit);
    tr.appendChild(tdDelete);

    return expenseTable.appendChild(tr);
  });
  console.error(MAPdata);
}
