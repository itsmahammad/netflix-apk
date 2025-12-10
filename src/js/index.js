import { getShows } from "./api.js";
import { searchShow } from "./api.js";

const cards = document.querySelector(".cards")

function createCard(movie, index = 0) {
    const card = document.createElement("div");
    card.className = "movie-card";

    card.style.animationDelay = `${index * 40}ms`;
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
    movies.forEach((movie, i) => {
        cards.appendChild(createCard(movie, i))
    });
}

const searchInput = document.getElementById("search")
const searchButton = document.getElementById("searchButton")

async function performSearch() {
    const name = searchInput.value.trim().toLowerCase();
    if (!name) return;

    const searchResult = await searchShow(name);

    cards.innerHTML = "";
    showMovies(searchResult);

    genreNav.querySelectorAll("li").forEach(li => li.classList.remove("active"));
    showLoadMore(false);
}

searchButton.addEventListener("click", performSearch);


searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        performSearch();
    }
});



const genreNav = document.getElementById("genre-nav");

function populateGenresNavbar(movies) {
    genreNav.innerHTML = `<li class="active" data-genre="all">Home</li>`;
    const genres = new Set();
    movies.forEach(movie => movie.genres.forEach(g => genres.add(g)));

    genres.forEach(genre => {
        const li = document.createElement("li");
        li.textContent = genre;
        li.setAttribute("data-genre", genre);
        genreNav.appendChild(li);
    });
}

genreNav.addEventListener("click", (e) => {
    if (e.target.tagName !== "LI") return;
    genreNav.querySelectorAll("li").forEach(li => li.classList.remove("active"));
    e.target.classList.add("active");
    const selectedGenre = e.target.getAttribute("data-genre");
    filterMovies(selectedGenre);
});

function filterMovies(genre) {
    if (genre === "all") {
        showMovies(allMovies);
        showLoadMore(true);
        return;
    }
    const filtered = allMovies.filter(movie => movie.genres.includes(genre));
    showMovies(filtered);
    showLoadMore(false);
}

let page = 0;

async function loadMore() {
    const shows = await getShows(page);

    allMovies = allMovies.concat(shows);
    showMovies(allMovies);

    if (page === 0) populateGenresNavbar(allMovies);

    page++;
    showLoadMore(true);
}

const loadMoreButton = document.querySelector(".load-more")

loadMoreButton.addEventListener("click", loadMore)

loadMore();

function showLoadMore(show = true) {
    const loadMoreButton = document.querySelector(".load-more");
    if (show) {
        loadMoreButton.style.display = "block";
    } else {
        loadMoreButton.style.display = "none";
    }
}
