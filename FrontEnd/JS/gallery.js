//Récupération des travaux depuis l'API
const reponse = await fetch("http://localhost:5678/api/works/");
const works = await reponse.json();
console.log(works);

const reponsefilter = await fetch("http://localhost:5678/api/categories/");
const filters = await reponsefilter.json();
console.log(filters);

// Création de la galerie
function createGallery(works) {
	for (let i = 0; i < works.length; i++) {
		const project = works[i];
		const gallery = document.getElementById("js-gallery");
		const projectElement = document.createElement("figure");
		const projectImg = document.createElement("img");
		projectImg.src = project.imageUrl;
		projectImg.alt = project.title;
		const projectTitle = document.createElement("figcaption");
		projectTitle.textContent = project.title;

		gallery.appendChild(projectElement);
		projectElement.appendChild(projectImg);
		projectElement.appendChild(projectTitle);
	}
}
createGallery(works);

// Création des filtres
function createFilters(filters) {
	const filter = document.getElementById("js-filters");
	const filterAll = document.createElement("button");
	filterAll.textContent = "Tous";
	filterAll.dataset.categoryId = "0";
	filter.appendChild(filterAll);
	for (let i = 0; i < filters.length; i++) {
		const category = filters[i];
		const filterElement = document.createElement("button");
		filterElement.textContent = category.name;
		filterElement.dataset.categoryId = category.id;
		filter.appendChild(filterElement);
	}
}
createFilters(filters);

// Gestion des filtres
const filterButtons = document.querySelectorAll("[data-category-id]");

filterButtons.forEach((btn) => {
	btn.addEventListener("click", () => {
		const categoryId = parseInt(btn.getAttribute("data-category-id"));
		let filteredProjects;
		if (categoryId === 0) {
			filteredProjects = works;
		} else {
			filteredProjects = works.filter(function (work) {
				return work.categoryId === categoryId;
			});
		}

		document.getElementById("js-gallery").innerHTML = "";

		createGallery(filteredProjects);
	});
});
