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

async function getAllExpenseFormBE(page = 1, row = 3) {
  const token = localStorage.getItem("userIdToken");
  try {
    const resData = await axios.get(`${baseUrl}?page=${page}&limit=${row}`, {
      headers: { Authorization: token },
    });
    console.log("PAGINATED RES >>", resData);
    Pagination(resData.data);
    expenseTable.textContent = "";
    ShowDataOnFE(resData.data.expenseData);

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
let download = document.getElementById("download");
download.addEventListener("click", downloadReport);
async function downloadReport() {
  const token = localStorage.getItem("userIdToken");
  try {
    console.log("Download clicked");
    const response = await axios.get(
      "http://localhost:8000/api/expense/download",
      {
        headers: { Authorization: token },
      }
    );
    console.log("Download: >>", response.data.fileUrl);
  } catch (error) {
    console.error(error);
  }
}

// Pagination ===============================================

function Pagination(data) {
  let pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  let row = localStorage.getItem("rows");

  if (data.hasPreviousPage) {
    let btn1 = document.createElement("button");
    btn1.innerHTML = `< ${data.previousPage}`;
    btn1.className = "btn bg-dark-subtle fw-medium px-4 m-2";
    pagination.appendChild(btn1);
    btn1.addEventListener("click", () =>
      getAllExpenseFormBE(data.previousPage, row)
    );
  }

  let btn2 = document.createElement("button");
  btn2.innerHTML = data.currentPage;
  btn2.className = "btn bg-primary text-white  fs-6 fw-bold px-4 m-2";

  pagination.appendChild(btn2);
  btn2.addEventListener("click", () =>
    getAllExpenseFormBE(data.currentPage, row)
  );

  if (data.hasNextPage) {
    let btn3 = document.createElement("button");
    btn3.innerHTML = `${data.nextPage} >`;
    btn3.className = "btn bg-success-subtle fw-medium px-4 m-2";
    pagination.appendChild(btn3);
    btn3.addEventListener("click", () =>
      getAllExpenseFormBE(data.nextPage, row)
    );
  }

  //  rows filter --------------------------

  const row1 = document.getElementById("row1");
  row1.addEventListener("click", () => {
    localStorage.setItem("rows", 5);
    console.log("row>>", localStorage.getItem("rows"));
    getAllExpenseFormBE(data.currentPage, localStorage.getItem("rows"));
  });

  const row2 = document.getElementById("row2");
  row2.addEventListener("click", () => {
    localStorage.setItem("rows", 10);
    console.log("row>>", localStorage.getItem("rows"));
    getAllExpenseFormBE(data.currentPage, localStorage.getItem("rows"));
  });

  const row3 = document.getElementById("row3");
  row3.addEventListener("click", () => {
    localStorage.setItem("rows", 15);
    console.log("row>>", localStorage.getItem("rows"));
    getAllExpenseFormBE(data.currentPage, localStorage.getItem("rows"));
  });
}
