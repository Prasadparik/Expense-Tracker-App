// API URL ====================================================

const baseUrl = `http://localhost:8000/api/expense`;

// ===========================================================
const addExpenseFrom = document.getElementById("addExpenseFrom");
const expenseTable = document.getElementById("expenseTable");
const displayUserName = document.getElementById("displayUserName");
// const premium = document.getElementById("rzp-button1");

// displayUserName
let b = document.createElement("b");
b.appendChild(
  document.createTextNode(`👋 ${localStorage.getItem("userName")}`)
);
displayUserName.appendChild(b);

// form submit event ------------------
addExpenseFrom.addEventListener("submit", addExpenseToDB);
// Delete Event
expenseTable.addEventListener("click", deleteExpense);
// Buy Premium Event
// premium.addEventListener("click", buyPremium);

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
  const token = localStorage.getItem("userIdToken");

  try {
    const response = await axios.post(baseUrl, expenseObj, {
      headers: { Authorization: token },
    });
    console.log(response);
  } catch (error) {
    console.log(error);
  }
  location.reload();
  //   clear input fields
  addExpenseFrom.amount.value = "";
  addExpenseFrom.category.value = "";
  addExpenseFrom.description.value = "";
}

// Get Data From Backend ===========================================

async function getAllExpenseFormBE() {
  const token = localStorage.getItem("userIdToken");
  try {
    const resData = await axios.get(baseUrl, {
      headers: { Authorization: token },
    });
    console.log(resData.data);

    ShowDataOnFE(resData.data);

    // filters ========================

    const dailyFilter = document.getElementById("dailyFilter");
    dailyFilter.addEventListener("click", () => {
      expenseTable.textContent = "";
      document.getElementById("filterHeading").innerHTML = "Daily Expenses";
      ShowDataOnFE(resData.data, 0, 10);
    });
    const monthlyFilter = document.getElementById("monthlyFilter");
    monthlyFilter.addEventListener("click", () => {
      expenseTable.textContent = "";
      document.getElementById("filterHeading").innerHTML = "Monthly Expenses";
      ShowDataOnFE(resData.data, 0, 7);
    });
    const yearlyFilter = document.getElementById("yearlyFilter");
    yearlyFilter.addEventListener("click", () => {
      expenseTable.textContent = "";
      document.getElementById("filterHeading").innerHTML = "Yearly Expenses";
      ShowDataOnFE(resData.data, 0, 4);
    });
  } catch (error) {
    console.log(error);
  }
}
getAllExpenseFormBE();

// ShowDataOnFE =====================================================

async function ShowDataOnFE(data, start, end) {
  // Date  Filter--------------
  console.log("eaf", start, end);

  let s = start;
  let e = end;
  if (start === undefined) {
    var filteredData = data;
    console.log("filteredData", filteredData);
  } else {
    var filteredData = data.filter((data) => {
      let updatedAt = data.updatedAt.slice(s, e);
      let currentDate = new Date().toJSON().slice(s, e);
      if (updatedAt === currentDate) {
        return data;
      }
    });
    console.log("filteredData", filteredData);
    console.log("filteredData DATA", data, start, end);
  }

  // mapping the elements
  filteredData.map((data) => {
    let tr = document.createElement("tr");
    let tdAmount = document.createElement("td");
    let tdCategory = document.createElement("td");
    let tdDescription = document.createElement("td");

    let tdEdit = document.createElement("td");
    let tdDelete = document.createElement("td");
    let tdID = document.createElement("td");
    tdID.style.display = "none";

    let btnEdit = document.createElement("edit");
    let btnDelete = document.createElement("delete");
    btnEdit.className = "btn btn-outline-dark edit";
    btnDelete.className = "btn btn-outline-danger delete";
    btnEdit.appendChild(document.createTextNode("Edit"));
    btnDelete.appendChild(document.createTextNode("Delete"));

    tdAmount.appendChild(document.createTextNode(data.amount));
    tdCategory.appendChild(document.createTextNode(data.category));
    tdDescription.appendChild(document.createTextNode(data.description));
    tdEdit.appendChild(btnEdit);
    tdDelete.appendChild(btnDelete);
    tdID.appendChild(document.createTextNode(data._id));

    tr.appendChild(tdAmount);
    tr.appendChild(tdDescription);
    tr.appendChild(tdCategory);

    tr.appendChild(tdEdit);
    tr.appendChild(tdDelete);
    tr.appendChild(tdID);

    return expenseTable.appendChild(tr);
  });
}

// Dlete Expense From Backend ===========================================

async function deleteExpense(e) {
  if (e.target.classList.contains("delete"))
    if (confirm("Are you sure you want to delete ?"))
      var li = e.target.parentElement.parentElement;
  console.log("DEL >>>", li.childNodes[5].innerText);
  // --------------------------------
  const token = localStorage.getItem("userIdToken");

  try {
    const response = await axios.delete(
      `${baseUrl}/${li.childNodes[5].innerText}`,
      {
        headers: { Authorization: token },
      }
    );
    console.log(response);
  } catch (error) {
    console.log(error);
  }

  expenseTable.removeChild(li);
}

// Ckeck Is Premium Account =====================================
function checkForPremiumAccount(params) {
  const token = localStorage.getItem("userIdToken");

  const decodeJwtToken = (token) => {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  };

  const checkIsPremium = decodeJwtToken(token).ispremiumuser;
  console.log(checkIsPremium);

  if (checkIsPremium) {
    document.getElementById("premiumMessage").style.display = "block";
    document.getElementById("rzp-button1").style.display = "none";
  } else {
    document.getElementById("rzp-button1").style.display = "block";
  }
}
checkForPremiumAccount();
// ZAZORPAY  ------------------------------------------------

document.getElementById("rzp-button1").onclick = async function (e) {
  const token = localStorage.getItem("userIdToken");

  const response = await axios.get("http://localhost:8000/api/purchase", {
    headers: { Authorization: token },
  });

  console.log("RES::", response);

  var options = {
    key: response.data.key_id,
    order_id: response.data.order.id,

    handler: async function (response) {
      const res = await axios.post(
        "http://localhost:8000/api/purchase/updateTransactionStatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        },
        {
          headers: { Authorization: token },
        }
      );
      alert("You are a Premium User Now");
      console.log("RESS>>", res);

      localStorage.setItem("userIdToken", res.data.token);
      checkForPremiumAccount();
    },
  };
  var rzp1 = new Razorpay(options);
  e.preventDefault();
  rzp1.open();
};

// Download Report ============================================================

async function downloadReport(data) {
  try {
    // const response = await axios.get();
  } catch (error) {
    console.error(error);
  }
}
