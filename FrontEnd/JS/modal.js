//Retrieve works from the API
const reponse = await fetch("http://localhost:5678/api/works/");
const works = await reponse.json();

const openModal = document.querySelector("#js-project-modif");
const dialog = document.querySelector("#js-dialog");
dialog.innerHTML = "";

function createModalGallery(works) {
	dialog.classList.add("dialog");
	let trashIcon;

	const closeBtn = document.createElement("span");
	closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
	closeBtn.classList.add("xmark");

	const title = document.createElement("h2");
	title.textContent = "Galerie photo";

	const galleryMini = document.createElement("div");
	galleryMini.classList.add("gallery-mini");
	galleryMini.id = "js-galleryMini";

	dialog.appendChild(closeBtn);
	dialog.appendChild(title);
	dialog.appendChild(galleryMini);

	closeBtn.addEventListener("click", (event) => {
		event.preventDefault();
		dialog.close();
		window.location.href = "../FrontEnd/homepage_edit.html";
	});

	for (let i = 0; i < works.length; i++) {
		const project = works[i];
		const projectElement = document.createElement("figure");
		projectElement.dataset.id = project.id;
		const projectImg = document.createElement("img");
		projectImg.src = project.imageUrl;
		projectImg.alt = project.title;

		trashIcon = document.createElement("span");
		trashIcon.classList.add("js-trashIcon", "trashIcon");
		trashIcon.setAttribute("dataset", trashIcon);
		trashIcon.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

		galleryMini.appendChild(projectElement);
		projectElement.appendChild(projectImg);
		projectElement.appendChild(trashIcon);
	}

	document
		.querySelector("#js-galleryMini")
		.addEventListener("click", async (event) => {
			if (event.target.classList.contains("js-galleryMini")) {
				const id = event.target.parentElement.dataset.id;
				const response = await fetch(
					`http://localhost:5678/api/works/${id}`,
					{
						method: "DELETE",
					}
				);
				if (response.status === 200) {
					event.target.parentElement.remove();
					createModalGallery(works);
				} else {
					console.log("error");
				}
			}
		});
	const btnAddPhoto = document.createElement("input");
	btnAddPhoto.type = "submit";
	btnAddPhoto.value = "Ajouter une photo";
	dialog.appendChild(btnAddPhoto);
}
openModal.addEventListener("click", (event) => {
	event.preventDefault();
	dialog.showModal();
	createModalGallery(works);
});
