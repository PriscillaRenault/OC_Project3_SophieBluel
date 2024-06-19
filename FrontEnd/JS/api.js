export const fetchWorks = async () => {
	const response = await fetch("http://localhost:5678/api/works/");
	return await response.json();
};

export const deleteWork = async (id, token) => {
	return await fetch(`http://localhost:5678/api/works/${id}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			authorization: "Bearer " + token,
		},
	});
};
