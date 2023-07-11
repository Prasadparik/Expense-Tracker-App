// API Call --------------------------------
const baseUrl = `http://localhost:8000/api/`;

const logInForm = document.getElementById("login-form");
const messageBox = document.getElementById("message-box");

// form submit event -------------------------------

logInForm.addEventListener("submit", userLogIn);

async function userLogIn(e) {
  e.preventDefault();

  let email = document.getElementById("userEmail").value;
  let password = document.getElementById("userPassword").value;

  //   Message Toast
  function toastMessage(color, param) {
    let message = document.createElement("Div");
    message.className = `bg-${color}-subtle p-3 fw-medium text-${color} rounded`;
    message.appendChild(document.createTextNode(param));
    messageBox.appendChild(message);
  }

  // Adding user in backend
  try {
    await axios
      .post(`${baseUrl}login`, {
        userEmail: email,
        userPassword: password,
      })
      .then((res) => console.log(res));
    toastMessage("success", `${email} is added successfully`);
    console.log(`logged in successfully `);
  } catch (error) {
    console.log("Error", error);
    toastMessage("danger", error.response.data);
  }

  //   cleaning input fields
  logInForm.userEmail.value = "";
  logInForm.userPassword.value = "";
}
