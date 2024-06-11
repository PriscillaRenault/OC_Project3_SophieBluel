export function selectedNavItem() {
	// Sélectionne tous les éléments <a> dans les <li>
	const listNav = document.querySelectorAll("li a");

	// Récupère la valeur stockée dans sessionStorage sous la clé "selectedNav"
	const selectedNav = sessionStorage.getItem("selectedNav");

	if (selectedNav) {
		// Si une valeur est stockée, parcourt tous les éléments de navigation
		listNav.forEach((navElement) => {
			// Vérifie si l'attribut href de l'élément correspond à la valeur stockée
			if (navElement.getAttribute("href") === selectedNav) {
				// Ajoute la classe 'selected' à cet élément pour le marquer comme sélectionné
				navElement.classList.add("selected");
			}
		});
	}

	// Ajoute un écouteur d'événement 'click' à chaque élément de navigation
	listNav.forEach((navElement) => {
		navElement.addEventListener("click", (event) => {
			// Supprime la classe 'selected' de tous les éléments de navigation
			listNav.forEach((navElement) => {
				navElement.classList.remove("selected");
			});

			// Ajoute la classe 'selected' à l'élément cliqué
			event.currentTarget.classList.add("selected");

			// Stocke l'attribut href de l'élément cliqué dans sessionStorage
			sessionStorage.setItem(
				"selectedNav",
				event.currentTarget.getAttribute("href")
			);

			if (event.currentTarget.getAttribute("href").startsWith("#")) {
				// Permet le comportement par défaut pour les ancres internes
				return;
			} else {
				// Empêche le comportement par défaut pour les autres liens
				event.preventDefault();
				// Redirige vers l'URL de l'élément cliqué
				window.location.href = event.currentTarget.getAttribute("href");
			}
		});
	});
}

// Appelle la fonction pour initialiser les écouteurs d'événements et gérer la sélection
selectedNavItem();
