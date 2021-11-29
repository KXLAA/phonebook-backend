const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("build"));

morgan.token("json", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(morgan("json"));

let persons = [
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

app.get("/", (request, response) => {
  response.send("<h1>HOME PAGE</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const date = new Date();
  response.send(`<div>
   <p>Phonebook has info for ${persons.length} ${
    persons.length === 1 ? "person" : "people"
  }</p>
   <p>${date}</p>
   </div>`);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  const existingName = persons.find((person) => person.name === body.name);

  if (!body.name) {
    return response.status(404).json({
      error: "name missing",
    });
  }

  if (!body.number) {
    return response.status(404).json({
      error: "number missing",
    });
  }

  if (body.name === existingName) {
    return response.status(404).json({
      error: "name must be unique",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    date: new Date(),
    id: Math.floor(Math.random() * 50),
  };

  persons = persons.concat(person);
  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
