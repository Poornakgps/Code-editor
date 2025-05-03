const express = require('express');
const routes = require("./Routes/routes.js");
const app = express();
const cors = require('cors');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("hi there this is server.js file!!");
});


app.listen(5001, () => {
  console.log("Server is running on port 5001");
});

