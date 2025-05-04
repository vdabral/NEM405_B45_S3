const express = require("express");
const app = express();
app.use((req, res) => {
  res.status(404).send("404 not found");
});
app.get("/home", (req, res) => {
  res.status(200).send("Welcome to Home Page");
});
app.get("/aboutus", (req, res) => {
  res.status(200).json({ message: "Welcome to About Us" });
});
app.get("/contactus", (req, res) => {
  const contact = {
    name: "Rahul",
    Address: "Dehradun",
    Mubile: 8855446641,
  };
  res.status(200).json(contact);
});

app.listen(3000, () => {
  console.log("Server Started");
});
