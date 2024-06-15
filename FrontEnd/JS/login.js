email = document.querySelector("#js-email");
password = document.querySelector("#js-password");
document.querySelector("#js-btnSubmit").addEventListener("click", async (e) => {
	e.preventDefault();
	const response = await fetch("http://localhost:5678/api/users/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email: email.value,
			password: password.value,
		}),
	});
	const data = await response.json();
	if (data.error) {
		alert("E-mail ou mot de passe incorrect");
	} else {
		sessionStorage.setItem("token", data.token);
		window.location.href = "../FrontEnd/homepage_edit.html";
	}
});
