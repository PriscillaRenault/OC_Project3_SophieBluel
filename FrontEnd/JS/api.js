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
	console.log("Form Add Photo Element:", formAddPhoto);

	const formData = new FormData(formAddPhoto); // Toutes les données du formulaire sont automatiquement ajoutées ici.
	console.log("Form Data:", formData);

	try {
		const response = await fetch("http://localhost:5678/api/works/", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${sessionStorage.getItem("token")}`,
			},
			body: formData,
		});

		if (response.status === 201) {
			// Success, handle accordingly
			alert("Photo ajoutée avec succès!");
		} else {
			const error = await response.json();
			console.log("Error response:", error);
			alert(error.message);
		}
	} catch (error) {
		console.error("Error during fetch:", error);
		alert("Une erreur est survenue.");
	}
}
