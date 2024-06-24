import { fetchWorks, deleteWork, checkFormAddPhoto } from "./api.js";
import { createGallery } from "./galleryEdit.js";

let works;

export const closeModal = (event) => {
	event.preventDefault();
	const dialog = document.querySelector("#js-dialog");
	dialog.close();
	dialog.classList.remove("dialog");
	dialog.classList.add("hidden");
};

export const baseModal = () => {
	const dialog = document.querySelector("#js-dialog");
	dialog.classList.remove("hidden");
	dialog.classList.add("dialog");
	dialog.innerHTML = "";

	const headerModal = createHeaderModal();
	dialog.appendChild(headerModal);
};

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

	const titleDialog = document.createElement("h2");

	headerModal.appendChild(returnArrow);
	headerModal.appendChild(closeBtn);
	headerModal.appendChild(titleDialog);

	return headerModal;
};

const updateReturnArrow = () => {
	const returnArrow = document.querySelector(".returnArrow");
	returnArrow.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
	returnArrow.addEventListener("click", createModalGallery);
};

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

const createProjectElement = (project) => {
	const projectElement = document.createElement("figure");
	projectElement.dataset.id = project.id;

	const projectImg = document.createElement("img");
	projectImg.src = project.imageUrl;
	projectImg.alt = project.title;

	const trashIcon = document.createElement("span");
	trashIcon.classList.add("js-trashIcon", "trashIcon");
	trashIcon.innerHTML =
		'<i class="fa-solid fa-trash-can js-trashIcon trashIcon"></i>';

	projectElement.appendChild(projectImg);
	projectElement.appendChild(trashIcon);

	return projectElement;
};

const handleDelete = async (event) => {
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
			console.log(`Error ${response.status} ${response.statusText}`);
		}
	} catch (error) {
		console.error("Error during fetch: ", error);
	}
};

const updateMainGallery = async () => {
	const gallery = document.querySelector("#js-gallery");
	gallery.innerHTML = "";
	works = await fetchWorks();
	createGallery(works);
};

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
		event.preventDefault();
		await checkFormAddPhoto();
		updateMainGallery();
	});

	return formAddPhoto;
};

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

	inputPhoto.addEventListener("change", () => {
		const file = inputPhoto.files[0];
		const maxSize = 4 * 1024 * 1024;

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
				imgPreview.src = e.target.result;
				imgPreview.alt = "Image preview";
				imgPreview.classList.remove("hidden");
				imgPreview.classList.add("show");
				svgPhoto.classList.add("hidden");
				labelPhoto.classList.add("hidden");
				textSizePhoto.classList.add("hidden");
			};
			reader.readAsDataURL(file);
		}
	});

	containerPhoto.appendChild(svgPhoto);
	containerPhoto.appendChild(imgPreview);
	containerPhoto.appendChild(labelPhoto);
	containerPhoto.appendChild(inputPhoto);
	containerPhoto.appendChild(textSizePhoto);

	return containerPhoto;
};

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

	containerTitle.appendChild(labelTitle);
	containerTitle.appendChild(inputTitle);

	return containerTitle;
};

const createContainerCategory = () => {
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

	containerCategory.appendChild(labelCategory);
	containerCategory.appendChild(selectCategory);

	return containerCategory;
};

const createBtnSendNewPhoto = () => {
	const btnSendNewPhoto = document.createElement("input");
	btnSendNewPhoto.type = "submit";
	btnSendNewPhoto.value = "Valider";
	btnSendNewPhoto.classList.add("secondary");
	btnSendNewPhoto.disabled = true;

	btnSendNewPhoto.addEventListener("click", checkFields);

	return btnSendNewPhoto;
};

const checkFields = () => {
	const inputPhoto = document.querySelector("#image");
	const inputTitle = document.querySelector("#title");
	const selectCategory = document.querySelector("#category");
	const btnSendNewPhoto = document.querySelector(".secondary");

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
