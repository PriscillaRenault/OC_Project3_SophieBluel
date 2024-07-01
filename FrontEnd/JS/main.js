import { createModalGallery, closeModal } from "./modal.js";

document.addEventListener("DOMContentLoaded", () => {
	const openModal = document.querySelector("#js-project-modif");
	const dialog = document.querySelector("#js-dialog");

	openModal.addEventListener("click", async (event) => {
		event.preventDefault();
		dialog.showModal();
		await createModalGallery();
	});

	window.addEventListener("click", (event) => {
		if (event.target === dialog) {
			event.preventDefault();
			closeModal(event);
		}
	});
});
