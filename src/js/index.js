import { getShows } from "./api.js";
import { searchShow } from "./api.js";

const cards = document.querySelector(".cards")

function createCard(movie) {
    const card = document.createElement("div");
    card.className = "movie-card";
    card.innerHTML = `
        <div class="movie-image">
            <img src="${movie.image?.medium}" alt="${movie.name}">
        </div>
        <div class="movie-info">
            <h3 class="title">${movie.name}</h3>
            <div class="details">
                <span class="rating">⭐ ${movie.rating?.average || "N/A"} </span>
                <span class="runtime">${movie.runtime} min</span>
                <span class="genres">${movie.genres.join(", ")}</span>
            </div>
        </div>
    `;

    card.addEventListener("click", () => {
        sessionStorage.setItem("selectedMovie", JSON.stringify(movie));
        window.location.href = "detail.html";
    });

    return card;
}


let allMovies = []
function showMovies(movies) {
    cards.innerHTML = ""
    movies.forEach(movie => {
        cards.appendChild(createCard(movie))
    });
}

async function loadMovies() {
    const data = await getShows()
    allMovies = data
    showMovies(allMovies)
    populateGenreNav(allMovies)
}

loadMovies()

const searchInput = document.getElementById("search")
const searchButton = document.getElementById("searchButton")

searchButton.addEventListener("click", async () => {
    const name = searchInput.value.trim().toLowerCase()
    if (!name) return;

    const searchResult = await searchShow(name)

    cards.innerHTML = "";
    showMovies(searchResult);

    genreNav.querySelectorAll("li").forEach(li => li.classList.remove("active"));
    genreNav.querySelector("[data-genre='all']").classList.add("active");
});



const genreNav = document.getElementById("genre-nav");

function populateGenreNav(movies) {
    genreNav.innerHTML = `<li class="active" data-genre="all">Home</li>`;
    const genres = new Set();
    movies.forEach(movie => movie.genres.forEach(g => genres.add(g)));

    genres.forEach(genre => {
        const li = document.createElement("li");
        li.textContent = genre;
        li.dataset.genre = genre;
        genreNav.appendChild(li);
    });
}

genreNav.addEventListener("click", (e) => {
    if (e.target.tagName !== "LI") return;
    genreNav.querySelectorAll("li").forEach(li => li.classList.remove("active"));
    e.target.classList.add("active");
    const selectedGenre = e.target.dataset.genre;
    filterMovies(selectedGenre);
});

function filterMovies(genre) {
    if (genre === "all") {
        showMovies(allMovies);
        return;
    }
    const filtered = allMovies.filter(movie => movie.genres.includes(genre));
    showMovies(filtered);
}
