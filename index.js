const morgan = require("morgan");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(cors());

morgan.token(
  "data",
  (req, res) => req.method === "POST" && JSON.stringify(req.body)
);

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

let contacts = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
  );
});

app.get("/api/contacts", (request, response) => {
  response.json(contacts);
});

app.get("/api/contacts/:id", (request, response) => {
  const id = Number(request.params.id);
  const contact = contacts.find((person) => person.id === id);
  if (contact) {
    response.json(contact);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/contacts/:id", (request, response) => {
  const id = Number(request.params.id);
  contacts = contacts.filter((person) => person.id !== id);
  response.status(204).end();
});

app.post("/api/contacts", (request, response) => {
  const id = Math.floor(Math.random() * 100000);
  const { name, number } = request.body;
  if (!name || !number) {
    return response.status(400).json({
      error: "Invalid input",
    });
  }
  const exists = contacts.find((p) => p.name === name);
  if (exists) {
    return response.status(400).json({
      error: "Name already exists",
    });
  }
  const contact = { name, number, id };
  contacts.push(contact);
  response.json(contact);
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
