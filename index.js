const express = require("express");
const mysql = require("mysql");
const app = express();
var multer = require("multer");
var upload = multer();
const cors = require("cors");
var nodemailer = require("nodemailer");
const port = 9000;

app.use(cors(9000));
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(upload.array());
app.use(express.static("public"));

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "jsainadh@2000",
  database: "budgetmanager",
});

conn.connect((err) => {
  if (err) console.log(err);
  conn.query(
    "CREATE TABLE IF NOT EXISTS users(name  VARCHAR(40) NOT NULL, email VARCHAR(40) NOT NULL, password VARCHAR(40) NOT NULL, PRIMARY KEY (email))"
  );
});

// if (typeof localStorage === "undefined" || localStorage === null) {
//   var LocalStorage = require("node-localstorage").LocalStorage;
//   localStorage = new LocalStorage("./scratch");
// }

// console.log(localStorage.getItem('logged'));
var Logged = "no";

app.post("/", (req, res) => {
  // code that checks wether user already their or not and send verification mail to registration mail
  // we need to create local storage value  here that says wherther the user is logged in or not
  var email = req.body.email;
  var password = req.body.password;
  var sql = `select * from users where email = '${email}' and password = '${password}'`;
  conn.query(sql, (err, ress) => {
    if (err) console.log(err);
    console.log(ress);
    if (ress.length === 0) {
      res.redirect("/register");
    } else {
      // res.send("hello")
      // localStorage.setItem("logged", "yes");
      Logged = "yes";
      res.redirect(`http://localhost:3000/budgeting/`);
    }
  });
});

app.get("/", (req, res) => {
  res.sendFile("views/Login.html", { root: __dirname });
});

app.get("/register", (req, res) => {
  res.sendFile("views/Signup.html", { root: __dirname });
});

app.post("/register", (req, res) => {
  // code that stores user info in database
  // res.sendFile("views/Login.html", { root: __dirname });
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var confirmpassword = req.body.confirmpassword;
  if (password !== confirmpassword) {
    // alert("password and confirm password do not match")
    res.redirect("/register");
  } else {
    var sql = `insert into users(name, email, password) values('${username}', '${email}', '${password}')`;
    conn.query(sql, (err) => {
      if (err) console.log(err);
    });
    res.redirect("/");
  }
});

app.get("/logged", (req, res) => {
  res.send(Logged);
});

app.get("/loggedout", (req, res) => {
  Logged = "no";
  res.send("hello")
});

app.post('/data',(req, res) => {
  console.log(JSON.parse(((req.body.data))));
})

app.listen(port, () => {
  console.log("listening on port " + port);
});
