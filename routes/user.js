const express = require("express");
const router = express.Router();
const User = require("../modules/User");
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json("Veuillez renseigner un email");
    }
    if (!password) {
      return res.status(400).json("Veuillez renseigner un mot de passe");
    }
    const salt = uid2(16);
    const hash = SHA256(password + salt).toString(encBase64);
    const token = uid2(64);
    const newUser = new User({
      email: email,
      token: token,
      hash: hash,
      salt: salt,
    });
    await newUser.save();
    res.status(201).json({ id: newUser._id, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userFind = await User.findOne({ email: email });
    if (!userFind) {
      console.log("hello");
      res.status(400).json("Adresse mail ou mot de passe erroné");
    } else if (
      SHA256(password + userFind.salt).toString(encBase64) !== userFind.hash
    ) {
      res.status(400).json("Adresse mail ou mot de passe erroné");
    } else {
      res.status(200).json({
        token: userFind.token,
        characters: userFind.characters,
        comics: userFind.comics,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
