// Declarations
const gamesContainer = document.querySelector(".gamesContainer");
const moreBtn = document.querySelector(".moreBtn button");
const searchInput = document.querySelector(".searchContainer__input #search");
const selectPlatform = document.querySelector("#platform");
const selectGenre = document.querySelector("#genre");
const scoreBtn = document.querySelector(".score");

let limit = 10;
let counter = 1;
let responsesDisplayed = [];
let responsesFetched = [];
let input = "";

// bool variables
let sortScore = false; // descending

// Event listeners
moreBtn.addEventListener("click", async () => {
  renderMore(responsesFetched);
});

searchInput.addEventListener("change", async () => {
  input = searchInput.value;
  const data = await search(input);
  renderFresh(data);
});

scoreBtn.addEventListener("click", async (e) => {
  const data = await sortByScore(sortScore);
  sortScore = !sortScore;

  renderFresh(data);
});

selectPlatform.addEventListener("change", async (e) => {
  if (selectPlatform.options[selectPlatform.options.selectedIndex].value) {
    const data = await sortByPlatforms(
      selectPlatform.options[selectPlatform.options.selectedIndex].value
    );
    renderFresh(data);
  } else {
    fetchAndRender();
  }
});

selectGenre.addEventListener("change", async (e) => {
  if (selectGenre.options[selectGenre.options.selectedIndex].value) {
    const data = await sortByGenre(
      selectGenre.options[selectGenre.options.selectedIndex].value
    );
    renderFresh(data);
  } else {
    fetchAndRender();
  }
});

// Functions
async function fetchRequest() {
  const data = await fetch("http://starlord.hackerearth.com/gamesarena")
    .then((data) => data.json())
    .then((response) => response);

  return data;
}

async function renderGames(gamesResponse) {
  gamesResponse.forEach((game) => {
    if (game.title) {
      responsesDisplayed.push(game);

      const gameDiv = document.createElement("div");
      gameDiv.classList.add("game__card");

      const title = document.createElement("h3");
      title.id = "title";
      title.innerText = game.title;
      gameDiv.appendChild(title);

      if (game.editors_choice === "Y") {
        const editor = document.createElement("h4");
        editor.id = "editor";
        editor.innerText = "Editor's choice";
        gameDiv.appendChild(editor);
      }

      const genre = document.createElement("h3");
      genre.id = "genre";
      genre.innerText = game.genre;
      gameDiv.appendChild(genre);

      const platform = document.createElement("p");
      platform.id = "platform";
      platform.innerText = game.platform;
      gameDiv.appendChild(platform);

      const score = document.createElement("p");
      score.id = "score";
      score.innerText = game.score;
      gameDiv.appendChild(score);

      gamesContainer.appendChild(gameDiv);
    }
  });

  console.log(gamesResponse);
}

function removeChildren() {
  while (gamesContainer.firstChild) {
    gamesContainer.removeChild(gamesContainer.firstChild);
  }
}

async function setPlatformsAvailable() {
  const data = await fetchRequest();
  let platforms = [];

  data.forEach((obj) => {
    if (obj.platform && !platforms.includes(obj.platform)) {
      platforms.push(obj.platform);

      const option = document.createElement("option");
      option.value = obj.platform;
      option.innerText = obj.platform;

      selectPlatform.appendChild(option);
    }
  });
}

async function setGenreAvailable() {
  const data = await fetchRequest();
  let genres = [];

  data.forEach((obj) => {
    if (obj.genre && !genres.includes(obj.genre)) {
      genres.push(obj.genre);

      const option = document.createElement("option");
      option.value = obj.genre;
      option.innerText = obj.genre;

      selectGenre.appendChild(option);
    }
  });
}

// Render methods
async function fetchAndRender() {
  const data = await fetchRequest();

  // Reset counter
  counter = 0;
  limit = data.length > 10 ? limit : data.length;
  responsesDisplayed = [];
  removeChildren();

  responsesFetched = data;

  const filteredResponses = data.slice(counter, counter + limit);
  counter += limit;
  renderGames(filteredResponses);
}

function renderFresh(games) {
  // Reset counter
  counter = 0;
  limit = games.length > 10 ? limit : games.length;
  responsesDisplayed = [];
  removeChildren();

  responsesFetched = games;
  const filteredResponses = games.slice(counter, counter + limit);
  counter += limit;
  renderGames(filteredResponses);
}

function renderMore(responsesFetched) {
  const filteredResponses = responsesFetched.slice(counter, counter + limit);
  counter += limit;
  renderGames(filteredResponses);
}

// Sort & Search methods
async function sortByScore(asc) {
  const data = await fetchRequest();

  data.sort((a, b) => {
    if (a.score < b.score) return asc ? -1 : 1;
    if (a.score > b.score) return asc ? 1 : -1;

    return 0;
  });

  return data;
}

async function sortByPlatforms(option) {
  const data = await fetchRequest();
  const filteredData = data.filter((game) => game.platform === option);

  return filteredData;
}

async function sortByGenre(option) {
  const data = await fetchRequest();
  const filteredData = data.filter((game) => game.genre === option);

  return filteredData;
}

async function search(title) {
  const responseData = await fetchRequest();
  let filteredData = [];

  for (i = 1; i < responseData.length; i++) {
    if (responseData[i].title.toLowerCase().indexOf(title.toLowerCase()) > -1) {
      filteredData.push(responseData[i]);
    }
  }

  return filteredData;
}

fetchAndRender();
setPlatformsAvailable();
setGenreAvailable();
