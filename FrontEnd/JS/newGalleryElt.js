export function addListenerFormAddPhoto() {
	const formAddPhoto = document.querySelector("#js-formAddPhoto");
	formAddPhoto.addEventListener("submit", async (event) => {
		event.preventDefault();
		const formData = new FormData(formAddPhoto);
		const response = await fetch("http://localhost:5678/api/works/", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${sessionStorage.getItem("token")}`,
			},
			body: formData,
		});
		if (response === 201) {
		} else {
			const error = await response.json();
			alert(error.message);
		}
	});
}
