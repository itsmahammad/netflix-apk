
const url = "https://api.tvmaze.com/shows"

export async function getShows(page = 0) {
    const response = await fetch(`${url}?page=${page}`)
    return response.json()
}

export async function searchShow(name) {
    const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${name}`)
    return response.data.map(card => card.show)
}

