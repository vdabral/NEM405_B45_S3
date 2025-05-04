const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());

const readUsers = () => {
  const data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  return data.users || [];
};

const hidePassword = (user) => {
  const { password, ...rest } = user;
  return rest;
};

app.post("/users", (req, res) => {
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let users = data.users;
  let id = users.length > 0 ? users[users.length - 1].id + 1 : 1;
  let userTobeAdded = { ...req.body, id };
  users.push(userTobeAdded);
  fs.writeFileSync("./db.json", JSON.stringify(data));
  res.status(201).send("User added succesfully");
});

app.get("/users", (req, res) => {
  try {
    let users = readUsers();
    let filteredUsers = users.map(hidePassword);
    res.status(200).json(filteredUsers);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});

app.get("/users/:id", (req, res) => {
  const userId = Number(req.params.id);
  const users = readUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) {
    res.status(404).json({ message: "User Not Found" });
  } else {
    res.status(200).json(hidePassword(user));
  }
});

app.put("/users/:id", (req, res) => {
  const userId = Number(req.params.id);
  const updateData = req.body;
  if (updateData.email) {
    return res.status(400).json({ message: "Email cannot be updated" });
  }
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let users = data.users || [];
  const foundIndex = users.findIndex((user) => user.id === userId);
  if (foundIndex === -1) {
    return res.status(404).json({ message: "User Not Found" });
  }
  const updatedUser = {
    ...users[foundIndex],
    ...updateData,
    email: users[foundIndex].email,
  };
  users[foundIndex] = updatedUser;
  data.users = users;
  fs.writeFileSync("./db.json", JSON.stringify(data));
  res.status(200).json({ message: "User Updated" });
});

app.delete("/users/:id", (req, res) => {
  const userId = Number(req.params.id);
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let users = data.users || [];
  const foundIndex = users.findIndex((user) => user.id === userId);
  if (foundIndex === -1) {
    return res.status(404).json({ message: "User Not Found" });
  }
  const filteredUsers = users.filter((user) => user.id !== userId);
  data.users = filteredUsers;
  fs.writeFileSync("./db.json", JSON.stringify(data));
  res.status(200).json({ message: "User Deleted" });
});

app.get("/users/search", (req, res) => {
  const search = req.query.username?.toLowerCase();
  if (!search) {
    return res.status(400).json({ message: "Username query is required" });
  }
  const users = readUsers();
  const filtered = users.filter((user) =>
    user.username.toLowerCase().includes(search)
  );
  if (filtered.length === 0) {
    return res.status(404).json({ message: "No users found" });
  }
  res.status(200).json(filtered.map(hidePassword));
});

app.use((req, res) => {
  res.status(404).json({ message: "404 Not Found" });
});

app.listen(3000, () => {
  console.log("Server Started");
});
