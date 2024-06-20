//Retrieve works from the API
const reponse = await fetch("http://localhost:5678/api/works/");
const works = await reponse.json();

// Create gallery
export function createGallery(works) {
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
