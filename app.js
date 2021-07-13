const express = require("express");

const PORT = 1234;

// Importing all the pokemon for our data file
const allPokemon = require("./data");

const app = express();

// Configurando o Express para aceitar requisições com o body do tipo JSON
app.use(express.json());

// -- Define your route listeners here! --

// 1. A GET /pokemon route, that serves an array of objects containing data about all the Pokemons
app.get("/pokemon", (req, res) => {
  return res.json(allPokemon); // allPokemon é a array contendo todos os objetos de Pokemon
});

// 2. An GET /pokemon/:id route, that serves an object of a specific Pokemon (search in the array using the provided id)
app.get("/pokemon/:id", (req, res) => {
  const id = req.params.id; // ATENÇÃO: os parâmetros SEMPRE são strings. Cuidado ao compará-los com tipos numéricos.

  const foundPokemon = allPokemon.find((currentPokemon) => {
    return currentPokemon.id === Number(id); // Temos que converter o parâmetro de rota para número para podermos fazer a comparação correta
  });

  if (foundPokemon) {
    return res.json(foundPokemon);
  }

  return res.json({ msg: "Pokemon not found." });
});

// 3. A GET /search route, where the user can search Pokemons by name or type (when searching by type, should return all the pokemon found with that type)
app.get("/search", (req, res) => {
  // Caso a url seja `?name=jigglypuff` o objeto `query` será o seguinte:
  // {
  //   name: "jigglypuff";
  // }

  // Fazemos um loop pra iterar sobre cada propriedade (chave) do objeto query
  for (let key in req.query) {
    // nesse caso, key = 'name'
    const filteredPokemon = allPokemon.filter((currentPokemon) => {
      // Pesquisando por tipos
      if (key === "types") {
        return currentPokemon.types.includes(req.query.types);
      }

      // Pesquisando por nome
      return currentPokemon.name
        .toLowerCase()
        .includes(req.query.name.toLowerCase());
    });

    if (filteredPokemon.length) {
      return res.json(filteredPokemon);
    }

    return res.json({ msg: "No Pokemon matches this search." });
  }
});

// 4. A POST /pokemon route, that inserts the new Pokemon into the existing list of all Pokemons (don't worry about persisting the data to the disk, we're gonan learn that later)

app.post("/pokemon", (req, res) => {
  const formData = req.body;

  // Pegando o último id da lista de todos os Pokemons
  const lastId = allPokemon[allPokemon.length - 1].id;

  // O novo Pokemon vai continuar a sequencia de ids
  const newPokemon = { ...formData, id: lastId + 1 };

  allPokemon.push(newPokemon);

  return res.json(newPokemon);
});

// 5. A PUT /pokemon/:id route, that updates an existing Pokemon with the provided data

app.put("/pokemon/:id", (req, res) => {
  const formData = req.body;

  // Encontrar o Pokemon com o id do parametro de rota
  const id = req.params.id;

  const foundPokemon = allPokemon.find((currentPokemon) => {
    return currentPokemon.id === Number(id);
  });

  if (foundPokemon) {
    // Atualiza o elemento da array com os dados do corpo (body) da requisição
    const index = allPokemon.findIndex((currentPokemon) => {
      return currentPokemon.id === Number(id);
    });

    if (index > -1) {
      allPokemon[index] = { ...foundPokemon, ...formData };

      return res.json(allPokemon[index]);
    } else {
      return res.json({ msg: "Pokemon not found." });
    }
  }

  return res.json({ msg: "Pokemon not found." });
});

// 6. A DELETE /pokemon/:id route, that deletes an existing Pokemon and returns a success message

app.delete("/pokemon/:id", (req, res) => {
  const id = req.params.id;

  const index = allPokemon.findIndex((currentPokemon) => {
    return currentPokemon.id === Number(id);
  });

  if (index > -1) {
    allPokemon.splice(index, 1);
    return res.json({ msg: "Pokemon successfully removed." });
  }

  return res.json({ msg: "Pokemon not found." });
});

app.listen(PORT, () => console.log(`Server up and running at port ${PORT}`));
