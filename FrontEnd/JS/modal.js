//Retrieve works from the API
const reponse = await fetch("http://localhost:5678/api/works/");
const works = await reponse.json();

const openModal = document.querySelector("#js-project-modif");
const dialog = document.querySelector("#js-dialog");
dialog.innerHTML = "";

let btnAddPhoto;

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

	// ----- close modal ------
	closeBtn.addEventListener("click", (event) => {
		event.preventDefault();
		dialog.close();
		window.location.href = "./homepage_edit.html";
	});
	window.addEventListener("click", (event) => {
		if (event.target == dialog) {
			dialog.close();
			window.location.href = "./homepage_edit.html";
		}
	});

	let projectElement;
	for (let i = 0; i < works.length; i++) {
		const project = works[i];
		projectElement = document.createElement("figure");
		projectElement.dataset.id = project.id;
		const projectImg = document.createElement("img");
		projectImg.src = project.imageUrl;
		projectImg.alt = project.title;

		trashIcon = document.createElement("span");
		trashIcon.classList.add("js-trashIcon", "trashIcon");
		trashIcon.setAttribute("dataset", trashIcon);
		trashIcon.innerHTML = '<i class="fa-solid fa-trash-can trashIcon"></i>';

		galleryMini.appendChild(projectElement);
		projectElement.appendChild(projectImg);
		projectElement.appendChild(trashIcon);
	}

	// Add click event to the trash icon
	galleryMini.addEventListener("click", async (event) => {
		if (event.target.classList.contains("trashIcon")) {
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
					const updatedWorks = await response.json();
					console.log("works after delete", updatedWorks);
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
}
openModal.addEventListener("click", (event) => {
	event.preventDefault();
	dialog.showModal();
	createModalGallery(works);
});

// btnAddPhoto.addEventListener("click", (event) => {
// 	event.preventDefault();
// 	dialog.close();
// 	dialog.innerHTML = "";
// });
