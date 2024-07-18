const getCards = document.querySelector(".get-cards");
const pokemonCards = document.querySelector(".pokemon-cards");
let totalPokemon;

getCards.addEventListener('click', async () => {
    let threeRandomPokemon = [];
    //generate the names and links for all available Pokemon in the API.
    try {
        let allPokemonResponse = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=2000&offset=0');
        let allPokemonResults = allPokemonResponse.data.results;
        let totalPokemon = allPokemonResults.length;
        
        //select 3 random Pokemon
        for (let i = 1; i < 4; i++) {
            let pokemonSelected = Math.floor(Math.random() * totalPokemon);
            threeRandomPokemon.push(axios.get(allPokemonResults[pokemonSelected].url));
        }
        threeRandomPokemon = await Promise.all(threeRandomPokemon);
    }
    catch(e) {
        console.log(e);
    }

    //update each of the Pokemon cards on display
    for (let i = 0; i < 3; i++) {
        let currentPokemonCard = pokemonCards.children[i];
        let currentPokemonCardImageElement = currentPokemonCard.children[0];
        let currentPokemonCardTitleElement = currentPokemonCard.children[1].children[0];
        let currentPokemonCardDescriptionElement = currentPokemonCard.children[1].children[1];

        let currentPokemon = threeRandomPokemon[i].data;
        let currentPokemonImageURL = currentPokemon.sprites.front_default;
        currentPokemonCardImageElement.setAttribute('src', currentPokemonImageURL);
        let currentPokemonSpeciesResult, currentPokemonName;

        //send request to species route of selected Pokemon to obtain Pokemon description.
        try {
            currentPokemonSpeciesResult = await axios.get(currentPokemon.species.url);
            currentPokemonName = currentPokemonSpeciesResult.data.name;
            console.log("You selected the Pokemon ", currentPokemonName);
        }
        catch(e) {
            console.log(e);
        }

        //update the current Pokemon card's image and title
        currentPokemonCardImageElement.setAttribute('alt', currentPokemonName);
        currentPokemonCardTitleElement.innerText = currentPokemonName;
        
        //update the current Pokemon card's description
        let textEntries = currentPokemonSpeciesResult.data.flavor_text_entries;
        //traverse the text entries until you find an English description.
        for (let i = 0; i < textEntries.length; i++) {
            if (textEntries[i].language.name == "en") {
                let currentPokemonDescription = textEntries[i].flavor_text;
                currentPokemonCardDescriptionElement.innerText = currentPokemonDescription;
                break;
            }
        }
    }
});