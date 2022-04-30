const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const port = 9001;
const saltRounds = 10;
const app = express();

app.get('/', (req, res) => {
  res.send("Welcome to DungX's web")
})

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/dungx");
}

const Schema = mongoose.Schema;

const account = new Schema(
  {
    username: String,
    password: String,
    role: String,
  },
  {
    collection: "account",
  }
);

const AccountModel = mongoose.model("account", account);

// Api
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Register
app.post("/register", (req, res) => { 
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  AccountModel.findOne({
    username: username,
  })
    .then((data) => {
      if (data) 
        res.status(500).json("Account already exists!");
      else {
        bcrypt.hash(password, saltRounds, function (err, hash) {
          AccountModel.create({
            username: username,
            password: hash,
            role: role,
          })
            .then((data) => {
              res.status(200).json("Sign Up Success!");
            })
            .catch((err) => {
              console.log(err);
            });
        });
      }
    })
    .catch(() => {
      console.log(err);
    });
});

// Login
const keyToken = "dungx2607";
const timeToken = 120;
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  AccountModel.findOne({
    username: username,
  })
    .then((data) => {
      if (data) {
        bcrypt.compare(password, data.password, function (err, result) {
          if (result) {
            const token = jwt.sign(
              {
                id: data._id,
                role: data.role,
              },
              keyToken,
              { expiresIn: timeToken }
            );
            res.status(200).json({
              token: token,
            });
          } else {
            res.status(500).json("Wrong password!");
          }
        });
      } else {
        res.status(500).json("Account does not exist!");
      }
    })
    .catch(() => {
      console.log(err);
    });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
