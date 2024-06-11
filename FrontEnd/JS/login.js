email = document.querySelector("#email");
password = document.querySelector("#password");
document
	.querySelector('.form input[type="submit"]')
	.addEventListener("click", async (e) => {
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
			alert(data.error);
		} else {
			sessionStorage.setItem("token", data.token);
			window.location.href = "../homepage_edit.html";
		}
	});
