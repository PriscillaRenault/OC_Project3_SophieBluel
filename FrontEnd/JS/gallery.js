//Récupération des travaux depuis l'API
const reponse = await fetch("http://localhost:5678/api/works/");
const works = await reponse.json();

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
