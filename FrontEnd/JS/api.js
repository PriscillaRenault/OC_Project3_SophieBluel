import { closeModal } from "./modal.js";

export const fetchWorks = async () => {
	const response = await fetch("http://localhost:5678/api/works/");
	return await response.json();
};

export const deleteWork = async (id, token) => {
	return await fetch(`http://localhost:5678/api/works/${id}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			authorization: "Bearer " + token,
		},
	});
};

export async function checkFormAddPhoto() {
	const formAddPhoto = document.querySelector("#js-formAddPhoto");

	const formData = new FormData(formAddPhoto); // Toutes les données du formulaire sont automatiquement ajoutées ici.

	const response = await fetch("http://localhost:5678/api/works/", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${sessionStorage.getItem("token")}`,
		},
		body: formData,
	});

	if (response.status === 201) {
		// Success, handle accordingly
		closeModal();
	} else {
		const error = await response.json();
		console.log("Error response:", error);
		alert(error.message);
	}
}
