const getCards = document.querySelector(".get-cards");
const pokemonCards = document.querySelector(".pokemon-cards");
let totalPokemon;

getCards.addEventListener('click', () => {
    let threeRandomPokemon = [];
    //generate the names and links for all available Pokemon in the API.
    axios.get('https://pokeapi.co/api/v2/pokemon?limit=2000&offset=0')
        .then(res => {
            let pokemonResults = res.data.results;
            totalPokemon = pokemonResults.length;
            //select 3 random Pokemon
            for (let i = 1; i < 4; i++) {
                let pokemonSelected = Math.floor(Math.random() * totalPokemon);
                threeRandomPokemon.push(axios.get(pokemonResults[pokemonSelected].url));
            }
            return Promise.all(threeRandomPokemon);
        })
        .then(threeRandomPokemon => {
            for (let i = 0; i < 3; i++) {
                let currentPokemonCard = pokemonCards.children[i];
                let currentPokemonCardImageElement = currentPokemonCard.children[0];
                let currentPokemonCardTitleElement = currentPokemonCard.children[1].children[0];
                let currentPokemonCardDescriptionElement = currentPokemonCard.children[1].children[1];

                let currentPokemon = threeRandomPokemon[i].data;
                let currentPokemonImageURL = currentPokemon.sprites.front_default;
                currentPokemonCardImageElement.setAttribute('src', currentPokemonImageURL);
                //send request to species route of selected Pokemon to obtain Pokemon description.
                axios.get(currentPokemon.species.url)
                    .then(res => {
                        let currentPokemonName = res.data.name;
                        console.log("You selected the Pokemon ", currentPokemonName);
                        currentPokemonCardImageElement.setAttribute('alt', currentPokemonName);
                        currentPokemonCardTitleElement.innerText = currentPokemonName;
                        
                        let textEntries = res.data.flavor_text_entries;
                        //traverse the text entries until you find an English description.
                        for (let i = 0; i < textEntries.length; i++) {
                            if (textEntries[i].language.name == "en") {
                                let currentPokemonDescription = textEntries[i].flavor_text;
                                currentPokemonCardDescriptionElement.innerText = currentPokemonDescription;
                                break;
                            }
                        }
                    })
                    .catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));
});