// API Call --------------------------------
const baseUrl = `http://localhost:8000/api/`;

const signUpForm = document.getElementById("signup-form");

// form submit event -------------------------------

signUpForm.addEventListener("submit", userSignUp);

async function userSignUp(e) {
  e.preventDefault();

  let name = document.getElementById("userName").value;
  let email = document.getElementById("userEmail").value;
  let password = document.getElementById("userPassword").value;

  // Adding user in backend
  try {
    await axios.post(`${baseUrl}/signup`, {
      userName: name,
      userEmail: email,
      userPassword: password,
    });
    console.log(`${name} added successfully`);
  } catch (error) {
    console.log(error);
  }
  //   cleaning input fields
  signUpForm.userName.value = "";
  signUpForm.userEmail.value = "";
  signUpForm.userPassword.value = "";
}
