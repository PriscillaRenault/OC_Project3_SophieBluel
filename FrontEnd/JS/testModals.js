//Retrieve works from the API
const reponse = await fetch("http://localhost:5678/api/works/");
const works = await reponse.json();

const openModal = document.querySelector("#js-project-modif");
const dialog = document.querySelector("#js-dialog");
dialog.innerHTML = "";

let btnAddPhoto;
let closeBtn;
let titleDialog;

// ----- Function Base modal ------

const baseModal = () => {
	dialog.classList.add("dialog");
	dialog.innerHTML = "";
	closeBtn = document.createElement("span");
	closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
	closeBtn.classList.add("xmark");
	closeBtn.addEventListener("click", closeModal);

	titleDialog = document.createElement("h2");
	titleDialog.textContent = "";

	dialog.appendChild(closeBtn);
	dialog.appendChild(titleDialog);
};

// ----- Function close modal ------
const closeModal = (event) => {
	event.preventDefault();
	dialog.close();
	window.location.href = "./homepage_edit.html";
};
window.addEventListener("click", (event) => {
	if (event.target == dialog) {
		event.preventDefault();
		closeModal(event);
	}
});

// Create modal delete project
function createModalGallery(works) {
	baseModal();
	titleDialog.textContent = "Galerie photo";

	const galleryMini = document.createElement("div");
	galleryMini.classList.add("gallery-mini");
	galleryMini.id = "js-galleryMini";

	let projectElement;
	for (let i = 0; i < works.length; i++) {
		const project = works[i];
		projectElement = document.createElement("figure");
		projectElement.dataset.id = project.id;
		const projectImg = document.createElement("img");
		projectImg.src = project.imageUrl;
		projectImg.alt = project.title;

		const trashIcon = document.createElement("span");
		trashIcon.classList.add("js-trashIcon", "trashIcon");
		trashIcon.setAttribute("dataset", trashIcon);
		trashIcon.innerHTML = '<i class="fa-solid fa-trash-can trashIcon"></i>';

		dialog.appendChild(galleryMini);
		galleryMini.appendChild(projectElement);
		projectElement.appendChild(projectImg);
		projectElement.appendChild(trashIcon);
	}

	// Add click event to the trash icon
	galleryMini.addEventListener("click", async (event) => {
		if (event.target.classList.contains("trashIcon")) {
			event.preventDefault();
			projectElement = event.target.closest("figure");
			const id = projectElement.dataset.id;
			console.log(`trying to delete project with id : ${id}`);

			const token = sessionStorage.getItem("token");
			if (!token) {
				console.log("No token");
				return;
			}

			try {
				const response = await fetch(
					`http://localhost:5678/api/works/${id}`,
					{
						method: "DELETE",
						headers: {
							"Content-Type": "application/json",
							authorization:
								"Bearer " + sessionStorage.getItem("token"),
						},
					}
				);

				console.log("response", response);

				if (response.ok) {
					console.log(`id supprimé = ${id}`);
					const index = works.findIndex((work) => work.id === id);
					if (index !== -1) {
						works.splice(index, 1);
					}
					const updatedWorks = await response.json();
					console.log("works after delete", updatedWorks);
					projectElement.remove();
					dialog.innerHTML = "";
					createModalGallery(updateWorks);
				} else {
					console.log(
						`Error ${response.status} ${response.statusText}`
					);
					const result = await response.json();
					console.log("Error details : ", result);
				}
			} catch (error) {
				console.error("Error during fetch : ", error);
			}
		}
	});

	btnAddPhoto = document.createElement("input");
	btnAddPhoto.type = "submit";
	btnAddPhoto.value = "Ajouter une photo";
	dialog.appendChild(btnAddPhoto);
	btnAddPhoto.addEventListener("click", (event) => {
		event.preventDefault();
		dialog.showModal();
		createModalAddPhoto();
	});
}
openModal.addEventListener("click", (event) => {
	event.preventDefault();
	dialog.showModal();
	createModalGallery(works);
});

const createModalAddPhoto = () => {
	baseModal();

	dialog.innerHTML = "";
	const titleDialog = document.createElement("h2");
	titleDialog.textContent = "Ajout photo";
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
	labelPhoto.for = "photo";
	labelPhoto.textContent = "+ Ajouter photo";
	const inputPhoto = document.createElement("input");
	inputPhoto.type = "file";
	inputPhoto.name = "photo";
	inputPhoto.id = "photo";

	const containerTitle = document.createElement("div");
	containerTitle.classList.add("containerTitleCategory");
	const labelTitle = document.createElement("label");
	labelTitle.for = "title";
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
	labelCategory.for = "category";
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
	const btnAddPhoto = document.createElement("input");
	btnAddPhoto.type = "submit";
	btnAddPhoto.value = "Envoyer";
	btnAddPhoto.classList.add("invalid");
	dialog.appendChild(titleDialog);
	dialog.appendChild(formAddPhoto);
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
	dialog.appendChild(btnAddPhoto);
};
