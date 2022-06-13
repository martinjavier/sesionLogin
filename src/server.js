import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import auth from "./middleware/auth.middleware.js";
import mongoStore from "connect-mongo";

// Configuramos dotenv
dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    store: mongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      options: {
        userNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    //cookie: {maxAge: 3000}
  })
);

// http://localhost:3000/contador

app.get("/contador", (req, res) => {
  if (req.session.contador) {
    req.session.contador++;
    res.send(`Has visto la página ${req.session.contador} veces`);
  } else {
    req.session.contador = 1;
    res.send("Bienvenido");
  }
});

// http://localhost:3000/login?user=coderhouse&password=123456

app.get("/login", (req, res) => {
  const { user, password } = req.query;
  if (user === "coderhouse" && password == "123456") {
    req.session.login = true;
    //res.send("Login correcto");
    res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Vista de Productos</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
      <style>body { padding-top: 50px; }</style>
    </head>
    <body>    
      <div class="container">
        <div class="jumbotron">
          <h1>Login correcto</h1>
          <h2>Bienvenido ${user}</h2>
        </div>
      </div>
        
    </body>
    </html>`);
  } else {
    res.send("Login incorrecto");
  }
});

// http://localhost:3000/restringida

app.get("/restringida", auth, (req, res) => {
  res.send("Información restringida");
});

// http://localhost:3000/logout

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (!err) {
      res.status(200).send("Salió de la aplicación");
    } else {
      res.json(err);
    }
  });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🔥 Server started on localhost on http://localhost:${PORT}`);
});

server.on("error", (err) => console.log(err));
