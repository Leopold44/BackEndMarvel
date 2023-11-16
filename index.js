const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const axios = require("axios");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/marvel");
const User = require("./modules/User");

const userRouter = require("./routes/user");
app.use(userRouter);

app.post("/", async (req, res) => {
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

app.post("/comics", async (req, res) => {
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

app.post("/character/:id", async (req, res) => {
  try {
    const { token } = req.body;
    const { id } = req.params;
    const userFind = await User.findOne({ token: token });
    const indexChar = userFind.characters.indexOf(id);
    if (indexChar !== -1) {
      userFind.characters.splice(indexChar, 1);
      await userFind.save();
      return res.status(201).json({
        message: "personnage supprimé des favoris",
        characters: userFind.characters,
      });
    } else {
      userFind.characters.push(id);
      await userFind.save();
      return res.status(201).json({
        message: "personnage ajouté dans les favoris",
        characters: userFind.characters,
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post("/comics/:id", async (req, res) => {
  try {
    const { token } = req.body;
    const { id } = req.params;
    const userFind = await User.findOne({ token: token });
    const indexComics = userFind.comics.indexOf(id);
    if (indexComics !== -1) {
      userFind.comics.splice(indexComics, 1);
      await userFind.save();
      return res.status(201).json({
        message: "comics supprimé des favoris",
        comics: userFind.comics,
      });
    } else {
      userFind.comics.push(id);
      await userFind.save();
      return res.status(201).json({
        message: "comics ajouté dans les favoris",
        comics: userFind.comics,
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post("/favorite", async (req, res) => {
  try {
    const favoriteChar = req.body.char;
    const favoriteComics = req.body.comics;
    const characters = [];
    const comics = [];
    const sizePicture = "/portrait_xlarge.";
    console.log(favoriteChar);
    for (let i = 0; i < favoriteChar.length; i++) {
      const response = await axios.get(
        `https://lereacteur-marvel-api.herokuapp.com/character/${favoriteChar[i]}?apiKey=X7DCv47pkgb5APGd`
      );
      const character = {
        picture: `${response.data.thumbnail.path}${sizePicture}${response.data.thumbnail.extension}`,
        name: response.data.name,
        description: response.data.description,
        id: response.data._id,
      };
      characters.push(character);
    }
    for (let i = 0; i < favoriteComics.length; i++) {
      const response = await axios.get(
        `https://lereacteur-marvel-api.herokuapp.com/comic/${favoriteComics[i]}?apiKey=X7DCv47pkgb5APGd`
      );
      const comic = {
        picture: `${response.data.thumbnail.path}${sizePicture}${response.data.thumbnail.extension}`,
        name: response.data.name,
        description: response.data.description,
        id: response.data._id,
      };
      comics.push(comic);
    }
    res.status(200).json({ characters: characters, comics: comics });
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
