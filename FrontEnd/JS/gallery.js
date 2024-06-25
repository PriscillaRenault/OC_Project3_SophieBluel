import { fetchWorks, fetchCategories } from "./api.js";

//Retrieve works from the API
const works = await fetchWorks();

//Retrieve filters gallery from the API
const filters = await fetchCategories();

// Create gallery
function createGallery(works) {
	const gallery = document.querySelector("#js-gallery");
	for (let i = 0; i < works.length; i++) {
		const project = works[i];
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

// Create filters buttons
function createFilters(filters) {
	const filter = document.querySelector("#js-filters");
	filters.unshift({ id: 0, name: "All" });
	for (let i = 0; i < filters.length; i++) {
		const category = filters[i];
		const filterElement = document.createElement("button");
		filterElement.textContent = category.name;
		filterElement.dataset.categoryId = category.id;
		filter.appendChild(filterElement);
	}
}
createFilters(filters);

// manage filters
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

		document.querySelector("#js-gallery").innerHTML = "";

		createGallery(filteredProjects);
	});
});
