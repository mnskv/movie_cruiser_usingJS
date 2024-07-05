let movieList = [];
let favMovieList = [];

function getMovies() {
    return fetch('http://localhost:3000/movies')
        .then(response => response.json())
        .then(movies => {
            movieList = movies; // Store movies locally
            const moviesList = document.getElementById('moviesList');
            moviesList.innerHTML = ''; // Clear previous list
            movies.forEach(movie => {
                const movieItem = createMovieListItem(movie, false); // Pass false for movies list
                moviesList.appendChild(movieItem);
            });

            return movies;
        })
        .catch(error => {
            console.error('Error fetching movies:', error);
            return Promise.reject(error);
        });
}

function getFavourites() {
    return fetch('http://localhost:3000/favourites')
        .then(response => response.json())
        .then(favourites => {
            favMovieList = favourites; // Store favorites locally
            const favouritesList = document.getElementById('favouritesList');
            favouritesList.innerHTML = ''; // Clear previous list
            favourites.forEach(favourite => {
                const favouriteItem = createMovieListItem(favourite, true); // Pass true for favourites list
                favouritesList.appendChild(favouriteItem);
            });

            return favourites;
        })
        .catch(error => {
            console.error('Error fetching favourites:', error);
            return Promise.reject(error);
        });
}

function addFavourite(movieId) {
    const existingFavourite = favMovieList.find(favourite => favourite.id === movieId);
    if (existingFavourite) {
        alert('Movie is already added to favourites');
        return Promise.reject({ message: 'Movie is already added to favourites' });
    }

    const movieToAdd = movieList.find(movie => movie.id === movieId);
    if (!movieToAdd) {
        return Promise.reject({ message: 'Movie not found' });
    }

    return fetch('http://localhost:3000/favourites', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(movieToAdd)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to add movie to favourites: ${response.statusText}`);
        }
        return response.json();
    })
    .then(addedFavourite => {
        favMovieList.push(addedFavourite); // Update local favourites list
        const favouritesList = document.getElementById('favouritesList');
        const favouriteItem = createMovieListItem(addedFavourite, true); // Pass true for favourites list
        favouritesList.appendChild(favouriteItem);
        return favMovieList; // Return the updated favourites list as expected by the test case
    })
    .catch(error => {
        console.error('Error adding to favourites:', error);
        return Promise.reject(error);
    });
}

function createMovieListItem(movie, isFavourite) {
    const li = document.createElement('li');
    li.innerHTML = `
        <div>
            <h4 id="title">Movie: ${movie.title}</h4>
            <img src="${movie.posterPath}" alt="${movie.title}" height="200" width="200">
            <p id="overview">${movie.overview}</p>
            ${!isFavourite ? `<button class="btn btn-dark btn-lg btn-block addToFavourites" data-movie-id="${movie.id}">Add to Favourites</button>` : ''}
        </div>
    `;
    if (!isFavourite) {
        li.querySelector('.addToFavourites').addEventListener('click', () => addFavourite(movie.id));
    }
    return li;
}

module.exports = {
    getMovies,
    getFavourites,
    addFavourite
};

// Ignore the Uncaught ReferenceError: module is not defined error while running this script in the browser
