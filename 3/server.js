const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

app.get("/dishes", (req, res) => {
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  res.json(data.dishes);
});

app.get("/dishes/get", (req, res) => {
  let name = req.query.name;
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  const filteredDishes = data.dishes.filter((dish) =>
    dish.name.toLowerCase().includes(name.toLowerCase())
  );

  if (filteredDishes.length > 0) {
    res.json(filteredDishes);
  } else {
    res.status(404).json({ error: "Dish not found" });
  }
});

app.get("/dishes/:id", (req, res) => {
  let dishId = parseInt(req.params.id);
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let dishes = data.dishes;
  let foundIndex = dishes.findIndex((el) => el.id === dishId);

  if (foundIndex === -1) {
    res.status(404).json({ message: "Dish not found" });
  } else {
    let filteredDishes = dishes.filter((dish) => dish.id == dishId);
    data.dishes = filteredDishes;
    res.json({ message: "Dish found successfully", dishes: filteredDishes });
  }
});
app.post("/dishes", (req, res) => {
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let dishes = data.dishes;
  let newId = dishes.length > 0 ? dishes[dishes.length - 1].id + 1 : 1;
  let dishTobeAdded = { ...req.body, id: newId };
  dishes.push(dishTobeAdded);
  fs.writeFileSync("./db.json", JSON.stringify(data, null));
  res
    .status(201)
    .json({ message: "Dish added successfully", dish: dishTobeAdded });
});
app.delete("/dishes/:id", (req, res) => {
  let dishId = parseInt(req.params.id);
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let dishes = data.dishes;
  let foundIndex = dishes.findIndex((el) => el.id === dishId);

  if (foundIndex === -1) {
    res.status(404).json({ message: "Dish not found" });
  } else {
    let filteredDishes = dishes.filter((dish) => dish.id !== dishId);
    data.dishes = filteredDishes;
    fs.writeFileSync("./db.json", JSON.stringify(data, null, 2));
    res.json({ message: "Dish deleted successfully", dishes: filteredDishes });
  }
});
app.patch("/dishes/:id", (req, res) => {
  let dishId = parseInt(req.params.id);
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let dishes = data.dishes;
  let foundIndex = dishes.findIndex((el) => el.id === dishId);

  if (foundIndex === -1) {
    res.status(404).json({ message: "Dish not found" });
  } else {
    let updateDishes = dishes.map((dish, id) => {
      if (dish.id == dishId) {
        return { ...dish, ...req.body };
      } else {
        return dish;
      }
    });
    data.dishes = updateDishes;
    fs.writeFileSync("./db.json", JSON.stringify(data));
    res.json({ message: "Dish updated successfully", dishes: updateDishes });
  }
});
app.put("/dishes/:id", (req, res) => {
  let dishId = parseInt(req.params.id);
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let dishes = data.dishes;
  let foundIndex = dishes.findIndex((el) => el.id === dishId);

  if (foundIndex === -1) {
    res.status(404).json({ message: "Dish not found" });
  } else {
    let updateDishes = dishes.map((dish, id) => {
      if (dish.id == dishId) {
        return { ...dish, ...req.body };
      } else {
        return dish;
      }
    });
    data.dishes = updateDishes;
    fs.writeFileSync("./db.json", JSON.stringify(data));
    res.json({ message: "Dish updated successfully", dishes: updateDishes });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "404 Not Found" });
});

app.listen(3000, () => {
  console.log("Server Started");
});
