import { fetchWorks, deleteWork, checkFormAddPhoto } from "./api.js";
import { createGallery } from "./galleryEdit.js";

let works;

// function close modal
export const closeModal = () => {
	const dialog = document.querySelector("#js-dialog");
	dialog.close();
	dialog.classList.remove("dialog");
	dialog.classList.add("hidden");
};

//base modal create dialog and title and call header
export const baseModal = () => {
	const dialog = document.querySelector("#js-dialog");
	dialog.classList.remove("hidden");
	dialog.classList.add("dialog");
	dialog.innerHTML = "";
	const titleDialog = document.createElement("h2");

	const headerModal = createHeaderModal();
	dialog.appendChild(headerModal);
	dialog.appendChild(titleDialog);
};

//header modal with return arrow and close button
const createHeaderModal = () => {
	const headerModal = document.createElement("div");
	headerModal.classList.add("headerModal");

	const returnArrow = document.createElement("span");
	returnArrow.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
	returnArrow.classList.add("returnArrow");

	const closeBtn = document.createElement("span");
	closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
	closeBtn.classList.add("xmark");
	closeBtn.addEventListener("click", closeModal);

	headerModal.appendChild(returnArrow);
	headerModal.appendChild(closeBtn);

	return headerModal;
};

//action click on return arrow and delete returnArrow on ModalGallery
const updateReturnArrow = () => {
	const returnArrow = document.querySelector(".returnArrow");
	if (returnArrow.parentElement.classList.contains("headerGallery")) {
		returnArrow.innerHTML = "";
	} else {
		returnArrow.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
		returnArrow.addEventListener("click", createModalGallery);
	}
};

//create first modal with gallery
export const createModalGallery = async () => {
	baseModal();
	const dialog = document.querySelector("#js-dialog");
	const headerModal = dialog.querySelector(".headerModal");
	headerModal.classList.add("headerGallery");

	const titleDialog = dialog.querySelector("h2");
	titleDialog.textContent = "Galerie photo";

	works = await fetchWorks();
	const galleryMini = createGalleryMini(works);
	dialog.appendChild(galleryMini);

	updateReturnArrow();

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

//create gallery mini with all works inside the modal
const createGalleryMini = (works) => {
	const galleryMini = document.createElement("div");
	galleryMini.classList.add("gallery-mini");
	galleryMini.id = "js-galleryMini";

	works.forEach((project) => {
		const projectElement = createProjectElement(project);
		galleryMini.appendChild(projectElement);
	});

	galleryMini.addEventListener("click", async (event) => {
		if (event.target.classList.contains("js-trashIcon")) {
			event.preventDefault();
			await handleDelete(event);
		}
	});

	return galleryMini;
};

//create project element with image and trash icon
const createProjectElement = (project) => {
	const projectElement = document.createElement("figure");
	projectElement.dataset.id = project.id;

	const projectImg = document.createElement("img");
	projectImg.src = project.imageUrl;
	projectImg.alt = project.title;

	const trashIcon = document.createElement("span");
	trashIcon.classList.add("js-trashIcon");
	trashIcon.innerHTML =
		'<i class="fa-solid fa-trash-can js-trashIcon trashIcon"></i>';

	projectElement.appendChild(projectImg);
	projectElement.appendChild(trashIcon);

	return projectElement;
};
//delete project
const handleDelete = async (event) => {
	const projectElement = event.target.closest("figure");
	const id = projectElement.dataset.id;
	const token = sessionStorage.getItem("token");

	const response = await deleteWork(id, token);
	if (response.ok) {
		projectElement.remove();
		updateMainGallery();
	} else {
		console.log(`Error ${response.status} ${response.statusText}`);
	}
};

// update main gallery on window
const updateMainGallery = async () => {
	const gallery = document.querySelector("#js-gallery");
	gallery.innerHTML = "";
	works = await fetchWorks();
	createGallery(works);
};

//create modal add photo
export const createModalAddPhoto = () => {
	baseModal();
	const dialog = document.querySelector("#js-dialog");
	const titleDialog = dialog.querySelector("h2");
	titleDialog.textContent = "Ajout Photo";
	dialog.appendChild(titleDialog);

	const formAddPhoto = createFormAddPhoto();
	dialog.appendChild(formAddPhoto);

	updateReturnArrow();
};

//create form to add photo
const createFormAddPhoto = () => {
	const formAddPhoto = document.createElement("form");
	formAddPhoto.classList.add("formAddPhoto");
	formAddPhoto.id = "js-formAddPhoto";

	const containerPhoto = createContainerPhoto();
	const containerTitle = createContainerTitle();
	const containerCategory = createContainerCategory();
	const btnSendNewPhoto = createBtnSendNewPhoto();

	formAddPhoto.appendChild(containerPhoto);
	formAddPhoto.appendChild(containerTitle);
	formAddPhoto.appendChild(containerCategory);
	formAddPhoto.appendChild(btnSendNewPhoto);

	formAddPhoto.addEventListener("submit", async (event) => {
		checkFields();
		event.preventDefault();
		await checkFormAddPhoto();
		updateMainGallery();
	});

	return formAddPhoto;
};
//create container photo
const createContainerPhoto = () => {
	const containerPhoto = document.createElement("div");
	containerPhoto.classList.add("containerPhoto");

	const svgPhoto = document.createElement("svg");
	svgPhoto.classList.add("svgPhoto");
	svgPhoto.innerHTML = '<i class="fa-regular fa-image"></i>';

	const imgPreview = document.createElement("img");
	imgPreview.classList.add("imgPreview");
	imgPreview.classList.add("hidden");

	const textSizePhoto = document.createElement("p");
	textSizePhoto.textContent = "jpg, png : 4mo max";

	const labelPhoto = document.createElement("label");
	labelPhoto.htmlFor = "image";
	labelPhoto.textContent = "+ Ajouter photo";

	const inputPhoto = document.createElement("input");
	inputPhoto.type = "file";
	inputPhoto.name = "image";
	inputPhoto.id = "image";
	inputPhoto.required = true;
	inputPhoto.accept = "image/jpeg, image/png";

	const maxSize = 4 * 1024 * 1024; // 4 Mo

	// hide image preview
	const hideImagePreview = () => {
		imgPreview.classList.add("hidden");
		imgPreview.classList.remove("show");
		svgPhoto.classList.remove("hidden");
		labelPhoto.classList.remove("hidden");
		textSizePhoto.classList.remove("hidden");
		imgPreview.src = "";
	};

	// handle change event on inputPhoto
	const handleChange = () => {
		const file = inputPhoto.files[0];
		if (file) {
			if (file.type === "image/jpeg" || file.type === "image/png") {
				if (file.size <= maxSize) {
					const reader = new FileReader();
					reader.onload = function (e) {
						imgPreview.src = e.target.result;
						imgPreview.alt = "Image preview";
						imgPreview.classList.remove("hidden");
						imgPreview.classList.add("show");
						svgPhoto.classList.add("hidden");
						labelPhoto.classList.add("hidden");
						textSizePhoto.classList.add("hidden");
					};
					reader.readAsDataURL(file);
				} else {
					alert(
						"Le fichier est trop volumineux. Veuillez sélectionner un fichier de taille inférieure à 4 Mo."
					);
					hideImagePreview();
				}
			} else {
				alert("Le fichier doit être au format JPEG ou PNG.");
				hideImagePreview();
			}
		} else {
			hideImagePreview();
		}
		checkFields();
	};

	inputPhoto.addEventListener("change", handleChange);

	containerPhoto.appendChild(svgPhoto);
	containerPhoto.appendChild(imgPreview);
	containerPhoto.appendChild(labelPhoto);
	containerPhoto.appendChild(inputPhoto);
	containerPhoto.appendChild(textSizePhoto);

	return containerPhoto;
};

//create input title
const createContainerTitle = () => {
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
	inputTitle.required = true;

	inputTitle.addEventListener("change", checkFields);

	containerTitle.appendChild(labelTitle);
	containerTitle.appendChild(inputTitle);

	return containerTitle;
};

// create select for category
const createContainerCategory = () => {
	const containerCategory = document.createElement("div");
	containerCategory.classList.add("containerTitleCategory");
	containerCategory.classList.add("containerCategory");

	const labelCategory = document.createElement("label");
	labelCategory.htmlFor = "category";
	labelCategory.textContent = "Catégorie";
	labelCategory.classList.add("labelTitleCategory");
	labelCategory.required = true;

	const selectCategory = document.createElement("select");
	selectCategory.name = "category";
	selectCategory.id = "category";
	selectCategory.innerHTML = `
        <option>
		</option>
        <option value="1">Objets</option>
        <option value="2">Appartements</option>
        <option value="3">Hotels et restaurants</option>
    `;
	selectCategory.classList.add("inputTitleCategory");

	selectCategory.addEventListener("change", checkFields);

	containerCategory.appendChild(labelCategory);
	containerCategory.appendChild(selectCategory);

	return containerCategory;
};

// create button to send new project into the gallery
const createBtnSendNewPhoto = () => {
	const btnSendNewPhoto = document.createElement("input");
	btnSendNewPhoto.type = "submit";
	btnSendNewPhoto.value = "Valider";
	btnSendNewPhoto.classList.add("secondary");
	btnSendNewPhoto.disabled = true;
	btnSendNewPhoto.id = "btnSendNewPhoto";

	return btnSendNewPhoto;
};
//function to check if all fields are filled to enable the button send
const checkFields = () => {
	const inputTitle = document.querySelector("#title");
	const selectCategory = document.querySelector("#category");
	const btnSendNewPhoto = document.querySelector("#btnSendNewPhoto");

	let valid = true;

	// Reset custom validity messages
	inputTitle.setCustomValidity("");
	selectCategory.setCustomValidity("");

	// Check Title
	if (!inputTitle.value.trim()) {
		valid = false;
		inputTitle.setCustomValidity("Le titre est requis.");
	}

	// Check Category
	if (!selectCategory.value) {
		valid = false;
		selectCategory.setCustomValidity("Veuillez choisir une catégorie.");
	}

	// Report validity messages after all checks
	selectCategory.reportValidity();
	inputTitle.reportValidity();

	// Update button state
	if (valid) {
		btnSendNewPhoto.disabled = false;
		btnSendNewPhoto.classList.remove("secondary");
		btnSendNewPhoto.classList.add("primary");
	} else {
		btnSendNewPhoto.disabled = true;
		btnSendNewPhoto.classList.remove("primary");
		btnSendNewPhoto.classList.add("secondary");
	}
};
