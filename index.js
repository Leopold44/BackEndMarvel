const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const axios = require("axios");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/marvel");

app.get("/", async (req, res) => {
  try {
    const title = req.body.title || "";
    const page = req.query.page;
    const characters = [];
    const sizePicture = "/portrait_xlarge.";
    const nbCharactersByPage = 100;
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=X7DCv47pkgb5APGd&skip=${
        (page - 1) * nbCharactersByPage
      }&name=${title}`
    );
    for (i = 0; i < response.data.results.length; i++) {
      const character = {
        picture: `${response.data.results[i].thumbnail.path}${sizePicture}${response.data.results[i].thumbnail.extension}`,
        name: response.data.results[i].name,
        description: response.data.results[i].description,
        id: response.data.results[i]._id,
      };
      characters.push(character);
    }
    res.status(200).json(characters);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

app.get("/comics", async (req, res) => {
  try {
    const title = req.body.title || "";
    const page = req.query.page;
    const comics = [];
    const sizePicture = "/portrait_xlarge.";
    const nbComicsByPage = 100;
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=X7DCv47pkgb5APGd&skip=${
        (page - 1) * nbComicsByPage
      }&title=${title}`
    );
    for (i = 0; i < response.data.results.length; i++) {
      const comic = {
        picture: `${response.data.results[i].thumbnail.path}${sizePicture}${response.data.results[i].thumbnail.extension}`,
        name: response.data.results[i].title,
        description: response.data.results[i].description,
        id: response.data.results[i]._id,
      };
      comics.push(comic);
    }
    res.status(200).json(comics);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

app.get("/character/:id", async (req, res) => {
  try {
    const comics = [];
    const sizePicture = "/portrait_xlarge.";
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics/${req.params.id}?apiKey=X7DCv47pkgb5APGd`
    );
    for (i = 0; i < response.data.comics.length; i++) {
      const comic = {
        picture: `${response.data.comics[i].thumbnail.path}${sizePicture}${response.data.comics[i].thumbnail.extension}`,
        name: response.data.comics[i].title,
        description: response.data.comics[i].description,
        id: response.data.comics[i]._id,
      };
      comics.push(comic);
    }
    res.status(200).json(comics);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "page non trouvée" });
});
app.listen(3000, () => {
  console.log("seveur lancé");
});
