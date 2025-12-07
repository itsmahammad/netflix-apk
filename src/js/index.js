import { getShows } from "./api.js";
import { searchShow } from "./api.js";

const cards = document.querySelector(".cards")

function createCard(movie) {
    return `
    <div class="movie-card">
        <div class="movie-image">
            <img src="${movie.image?.medium}" alt="${movie.name}">
        </div>

        <div class="movie-info">
            <h3 class="title">${movie.name}</h3>

            <div class="details">
                <span class="rating">⭐ ${movie.rating?.average}</span>
                <span class="runtime">${movie.runtime} min</span>
                <span class="genres">${movie.genres.join(", ")}</span>
            </div>

        </div>
    </div>
    `;
}


function showMovies(movies) {
    movies.forEach(movie => {
        cards.innerHTML += createCard(movie)
    });
}

async function loadMovies() {
    const data = await getShows()
    showMovies(data)
}

loadMovies()

const searchInput = document.getElementById("search")
const searchButton = document.getElementById("searchButton")

searchButton.addEventListener("click", async () => {
    const name = searchInput.value.trim().toLowerCase()
    let searchResult = await searchShow(name)

    if (!name) return;

    cards.innerHTML = "";

    showMovies(searchResult)
})

const homeButton = document.querySelector(".nav-buttons li");
homeButton.addEventListener("click", () => {
    cards.innerHTML = ""
    loadMovies();
});
