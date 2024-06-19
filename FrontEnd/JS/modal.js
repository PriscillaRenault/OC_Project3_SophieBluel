import { fetchWorks, deleteWork } from "./api.js";

// Fonction de fermeture de la modal
export const closeModal = (event) => {
	event.preventDefault();
	const dialog = document.querySelector("#js-dialog");
	dialog.close();
	window.location.href = "./homepage_edit.html";
};

// Fonction de base pour initialiser la modal
export const baseModal = () => {
	const dialog = document.querySelector("#js-dialog");
	dialog.classList.add("dialog");
	dialog.innerHTML = "";

	const closeBtn = document.createElement("span");
	closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
	closeBtn.classList.add("xmark");
	closeBtn.addEventListener("click", closeModal);

	const titleDialog = document.createElement("h2");
	titleDialog.textContent = "";

	dialog.appendChild(closeBtn);
	dialog.appendChild(titleDialog);
};

// Fonction pour créer la modal d'ajout de photo
export const createModalAddPhoto = () => {
	baseModal();
	const dialog = document.querySelector("#js-dialog");

	const titleDialog = document.createElement("h2");
	titleDialog.textContent = "Ajout photo";
	dialog.appendChild(titleDialog);

	const formAddPhoto = document.createElement("form");
	formAddPhoto.classList.add("formAddPhoto");

	const containerPhoto = document.createElement("div");
	containerPhoto.classList.add("containerPhoto");
	const svgPhoto = document.createElement("svg");
	svgPhoto.classList.add("svgPhoto");
	svgPhoto.innerHTML = '<i class="fa-regular fa-image"></i>';
	const textSizePhoto = document.createElement("p");
	textSizePhoto.textContent = "jpg, png : 4mo max";
	const labelPhoto = document.createElement("label");
	labelPhoto.htmlFor = "photo";
	labelPhoto.textContent = "+ Ajouter photo";
	const inputPhoto = document.createElement("input");
	inputPhoto.type = "file";
	inputPhoto.name = "photo";
	inputPhoto.id = "photo";

	const containerTitle = document.createElement("div");
	containerTitle.classList.add("containerTitleCategory");
	const labelTitle = document.createElement("label");
	labelTitle.htmlFor = "title";
	labelTitle.textContent = "Titre";
	labelTitle.classList.add("labelTitleCategory");
	const inputTitle = document.createElement("input");
	inputTitle.type = "text";
	inputTitle.name = "title";
	inputTitle.id = "title";
	inputTitle.classList.add("inputTitleCategory");

	const containerCategory = document.createElement("div");
	containerCategory.classList.add("containerTitleCategory");
	const labelCategory = document.createElement("label");
	labelCategory.htmlFor = "category";
	labelCategory.textContent = "Catégorie";
	labelCategory.classList.add("labelTitleCategory");
	const selectcategory = document.createElement("select");
	selectcategory.name = "category";
	selectcategory.id = "category";
	selectcategory.innerHTML = `
        <option value="0"></option>
        <option value="1">Objets</option>
        <option value="2">Appartements</option>
        <option value="3">Hotels et restaurants</option>
    `;
	selectcategory.classList.add("inputTitleCategory");

	const btnSubmit = document.createElement("input");
	btnSubmit.type = "submit";
	btnSubmit.value = "Envoyer";
	btnSubmit.classList.add("invalid");

	formAddPhoto.appendChild(containerPhoto);
	containerPhoto.appendChild(svgPhoto);
	containerPhoto.appendChild(labelPhoto);
	containerPhoto.appendChild(inputPhoto);
	containerPhoto.appendChild(textSizePhoto);

	formAddPhoto.appendChild(containerTitle);
	containerTitle.appendChild(labelTitle);
	containerTitle.appendChild(inputTitle);

	formAddPhoto.appendChild(containerCategory);
	containerCategory.appendChild(labelCategory);
	containerCategory.appendChild(selectcategory);

	dialog.appendChild(formAddPhoto);
	dialog.appendChild(btnSubmit);
};

// Fonction pour créer la modal de galerie
export const createModalGallery = async () => {
	baseModal();
	const dialog = document.querySelector("#js-dialog");
	const titleDialog = dialog.querySelector("h2");
	titleDialog.textContent = "Galerie photo";

	// Récupérer les travaux via l'API
	const works = await fetchWorks();

	const galleryMini = document.createElement("div");
	galleryMini.classList.add("gallery-mini");
	galleryMini.id = "js-galleryMini";

	works.forEach((project) => {
		const projectElement = document.createElement("figure");
		projectElement.dataset.id = project.id;

		const projectImg = document.createElement("img");
		projectImg.src = project.imageUrl;
		projectImg.alt = project.title;

		const trashIcon = document.createElement("span");
		trashIcon.classList.add("js-trashIcon", "trashIcon");
		trashIcon.setAttribute("dataset", trashIcon);
		trashIcon.innerHTML = '<i class="fa-solid fa-trash-can trashIcon"></i>';

		projectElement.appendChild(projectImg);
		projectElement.appendChild(trashIcon);
		galleryMini.appendChild(projectElement);
	});

	dialog.appendChild(galleryMini);

	galleryMini.addEventListener("click", async (event) => {
		if (event.target.classList.contains("trashIcon")) {
			event.preventDefault();
			const projectElement = event.target.closest("figure");
			const id = projectElement.dataset.id;
			const token = sessionStorage.getItem("token");
			if (!token) {
				console.log("No token");
				return;
			}

			try {
				const response = await deleteWork(id, token);
				if (response.ok) {
					projectElement.remove();
				} else {
					console.log(
						`Error ${response.status} ${response.statusText}`
					);
				}
			} catch (error) {
				console.error("Error during fetch: ", error);
			}
		}
	});

	const btnAddPhoto = document.createElement("input");
	btnAddPhoto.type = "submit";
	btnAddPhoto.value = "Ajouter une photo";
	dialog.appendChild(btnAddPhoto);
	btnAddPhoto.addEventListener("click", (event) => {
		event.preventDefault();
		createModalAddPhoto();
	});
};
