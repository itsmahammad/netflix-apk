const details = document.querySelector(".movie-detail");
const movie = JSON.parse(sessionStorage.getItem("selectedMovie"));

details.innerHTML = `
    <img src="${movie.image?.original}" alt="${movie.name}">
    <div class="movie-info">
        <h1>${movie.name}</h1>
        <p><strong>Genres:</strong> ${movie.genres.join(", ")}</p>
        <p><strong>Rating:</strong> ${movie.rating?.average || "N/A"}</p>
        <p><strong>Runtime:</strong> ${movie.runtime || "?"} min</p>
        <p><strong>Summary:</strong> ${movie.summary}</p>
        <a href="index.html">Back to Home</a>
    </div>
`;
