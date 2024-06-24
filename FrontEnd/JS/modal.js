import { fetchWorks, deleteWork } from "./api.js";
import { createGallery } from "./galleryEdit.js";
import { checkFormAddPhoto } from "./api.js";

let titleDialog;
let headerModal;
let closeBtn;
let returnArrow;
let works;

// Fonction de fermeture de la modal
export const closeModal = (event) => {
	event.preventDefault();
	const dialog = document.querySelector("#js-dialog");
	dialog.close();
	dialog.classList.remove("dialog");
	dialog.classList.add("hidden");
};

// Fonction de base pour initialiser la modal
export const baseModal = () => {
	const dialog = document.querySelector("#js-dialog");
	dialog.classList.remove("hidden");
	dialog.classList.add("dialog");
	dialog.innerHTML = "";

	headerModal = document.createElement("div");
	headerModal.classList.add("headerModal");

	returnArrow = document.createElement("span");
	returnArrow.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
	returnArrow.classList.add("returnArrow");

	closeBtn = document.createElement("span");
	closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
	closeBtn.classList.add("xmark");
	closeBtn.addEventListener("click", closeModal);

	titleDialog = document.createElement("h2");
	titleDialog.textContent = "";

	dialog.appendChild(headerModal);
	headerModal.appendChild(returnArrow);
	headerModal.appendChild(closeBtn);
	dialog.appendChild(titleDialog);
};

const updateReturnArrow = () => {
	const returnArrow = document.querySelector(".returnArrow");
	if (returnArrow.parentElement.classList.contains("headerGallery")) {
		returnArrow.innerHTML = "";
	} else {
		returnArrow.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
		returnArrow.addEventListener("click", createModalGallery);
	}
};

// Fonction pour créer la modal de galerie
export const createModalGallery = async () => {
	baseModal();
	const dialog = document.querySelector("#js-dialog");
	headerModal.classList.add("headerGallery");
	titleDialog = dialog.querySelector("h2");
	titleDialog.textContent = "Galerie photo";

	// Récupérer les travaux via l'API
	works = await fetchWorks();

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
		trashIcon.classList.add("js-trashIcon", "js-trashIcon");
		// trashIcon.setAttribute("dataset", trashIcon);
		trashIcon.innerHTML =
			'<i class="fa-solid fa-trash-can js-trashIcon trashIcon"></i>';

		galleryMini.appendChild(projectElement);
		projectElement.appendChild(projectImg);
		projectElement.appendChild(trashIcon);
	});

	dialog.appendChild(galleryMini);
	updateReturnArrow();

	galleryMini.addEventListener("click", async (event) => {
		if (event.target.classList.contains("js-trashIcon")) {
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
					updateMainGallery();
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
	btnAddPhoto.classList.add("primary");
	dialog.appendChild(btnAddPhoto);
	btnAddPhoto.addEventListener("click", (event) => {
		event.preventDefault();
		createModalAddPhoto();
	});
};

const updateMainGallery = async () => {
	const gallery = document.querySelector("#js-gallery");
	gallery.innerHTML = "";
	works = await fetchWorks();
	createGallery(works);
};

// Function to create the modal to add a photo
export const createModalAddPhoto = () => {
	baseModal();
	const dialog = document.querySelector("#js-dialog");
	const titleDialog = dialog.querySelector("h2");
	titleDialog.textContent = "Ajout Photo";
	dialog.appendChild(titleDialog);

	const formAddPhoto = document.createElement("form");
	formAddPhoto.classList.add("formAddPhoto");
	formAddPhoto.id = "js-formAddPhoto";

	const containerPhoto = document.createElement("div");
	containerPhoto.classList.add("containerPhoto");
	const svgPhoto = document.createElement("svg");
	svgPhoto.classList.add("svgPhoto");
	svgPhoto.innerHTML = '<i class="fa-regular fa-image"></i>';
	const textSizePhoto = document.createElement("p");
	textSizePhoto.textContent = "jpg, png : 4mo max";
	const labelPhoto = document.createElement("label");
	labelPhoto.htmlFor = "image";
	labelPhoto.textContent = "+ Ajouter photo";
	const inputPhoto = document.createElement("input");
	inputPhoto.type = "file";
	inputPhoto.name = "image";
	inputPhoto.id = "image";

	// Ajout du gestionnaire d'événements pour l'aperçu de l'image
	inputPhoto.addEventListener("change", () => {
		// Sélection avec data-attribute
		const file = inputPhoto.files[0];

		const maxSize = 4 * 1024 * 1024;

		if (!file) {
			alert("Veuillez sélectionner une image.");
			return;
		}

		if (!["image/jpeg", "image/png"].includes(file.type)) {
			alert("Le format du fichier n'est pas valide.");
			return;
		}
		if (file.size > maxSize) {
			alert("Le fichier est trop volumineux.");
			return;
		}

		if (file) {
			const reader = new FileReader();
			reader.onload = function (e) {
				const imgPreview = new Image();
				imgPreview.src = e.target.result;
				imgPreview.alt = "Image preview";
				// Effacer le contenu précédent de containerPhoto
				containerPhoto.innerHTML = "";
				containerPhoto.appendChild(imgPreview);
			};
			reader.readAsDataURL(file);
		}
		checkFields(); // Vérifier les champs après la sélection de l'image
	});

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
	containerCategory.classList.add("containerCategory");
	const labelCategory = document.createElement("label");
	labelCategory.htmlFor = "category";
	labelCategory.textContent = "Catégorie";
	labelCategory.classList.add("labelTitleCategory");
	const selectCategory = document.createElement("select");
	selectCategory.name = "category";
	selectCategory.id = "category";
	selectCategory.innerHTML = `
        <option value="0"></option>
        <option value="1">Objets</option>
        <option value="2">Appartements</option>
        <option value="3">Hotels et restaurants</option>
    `;
	selectCategory.classList.add("inputTitleCategory");

	const btnSendNewPhoto = document.createElement("input");
	btnSendNewPhoto.type = "submit";
	btnSendNewPhoto.value = "Valider";
	btnSendNewPhoto.classList.add("secondary");
	btnSendNewPhoto.disabled = true;

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
	containerCategory.appendChild(selectCategory);

	formAddPhoto.appendChild(btnSendNewPhoto);

	dialog.appendChild(formAddPhoto);

	updateReturnArrow();

	const checkFields = () => {
		if (
			inputPhoto.files.length > 0 &&
			inputTitle.value.trim() !== "" &&
			selectCategory.value !== "0"
		) {
			btnSendNewPhoto.disabled = false;
			btnSendNewPhoto.classList.remove("secondary");
			btnSendNewPhoto.classList.add("primary");
		} else {
			btnSendNewPhoto.disabled = true;
			btnSendNewPhoto.classList.remove("primary");
			btnSendNewPhoto.classList.add("secondary");
		}
	};

	inputPhoto.addEventListener("change", checkFields);
	inputTitle.addEventListener("input", checkFields);
	selectCategory.addEventListener("change", checkFields);

	formAddPhoto.addEventListener("submit", async (event) => {
		event.preventDefault();
		await checkFormAddPhoto();
	});
};
