export async function checkFormAddPhoto() {
	const formAddPhoto = document.querySelector("#js-formAddPhoto");
	console.log(formAddPhoto);

	const imageInput = formAddPhoto.querySelector("[data-js-photo='true']"); // Sélection avec data-attribute
	const image = imageInput.files[0];
	const maxSize = 4 * 1024 * 1024;

	if (!["image/jpeg", "image/png"].includes(image.type)) {
		alert("Le format du fichier n'est pas valide.");
		return;
	}
	if (image.size > maxSize) {
		alert("Le fichier est trop volumineux.");
		return;
	}

	console.log("Form Add Photo");

	const formData = new FormData(formAddPhoto); // Toutes les données du formulaire sont automatiquement ajoutées ici.

	try {
		const response = await fetch("http://localhost:5678/api/works/", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${sessionStorage.getItem("token")}`, // Seul l'en-tête Authorization est nécessaire
			},
			body: formData, // Le formData gère automatiquement le bon Content-Type
		});

		if (response.status === 201) {
			// Success, handle accordingly
			alert("Photo ajoutée avec succès!");
		} else {
			const error = await response.json();
			alert(error.message);
		}
	} catch (error) {
		console.error("Error during fetch:", error);
		alert("Une erreur est survenue.");
	}
}
