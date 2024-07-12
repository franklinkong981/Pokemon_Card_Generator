const getCards = document.querySelector(".get-cards");
let totalPokemon;

getCards.addEventListener('click', () => {
    let threeRandomPokemon = [];
    //generate the names and links for all available Pokemon in the API.
    axios.get('https://pokeapi.co/api/v2/pokemon?limit=2000&offset=0')
        .then(res => {
            pokemonResults = res.data.results;
            totalPokemon = pokemonResults.length;
            //select 3 random Pokemon
            for (let i = 1; i < 4; i++) {
                pokemonSelected = Math.floor(Math.random() * totalPokemon);
                threeRandomPokemon.push(axios.get(pokemonResults[pokemonSelected].url));
            }
            return Promise.all(threeRandomPokemon);
        })
        .then(threeRandomPokemon => {
            for (let i = 0; i < 4; i++) {
                currentPokemon = threeRandomPokemon[i].data;
                //send request to species route of selected Pokemon to obtain Pokemon description.
                axios.get(currentPokemon.species.url)
                    .then(res => {
                        console.log("You selected the Pokemon ", res.data.name);
                        textEntries = res.data.flavor_text_entries;
                        //traverse the text entries until you find an English description.
                        for (let i = 0; i < textEntries.length; i++) {
                            if (textEntries[i].language.name == "en") {
                                console.log(textEntries[i].flavor_text);
                                break;
                            }
                        }
                    })
                    .catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));
});