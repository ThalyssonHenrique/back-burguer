const express = require("express");
const port = 3003;
const uuid = require("uuid");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const orders = [];

const checkClientId = (request, response, next) => {
  const { id } = request.params;

  const index = orders.findIndex((client) => client.id === id);

  if (index < 0) {
    return response.status(404).json({ Error: "Client not found" });
  }

  request.checkIndex = index;
  request.checkId = id;

  next();
};

app.get("/orders", (request, response) => {
  return response.json(orders);
});

app.post("/orders", (request, response) => {
  const { order, client } = request.body;

  const clients = { id: uuid.v4(), order, client };

  orders.push(clients);
  return response.status(201).json(clients);
});

app.put("/orders/:id", checkClientId, (request, response) => {
  const { order, client } = request.body;
  const index = request.checkIndex;
  const id = request.checkId;

  const updateClients = { id, order, client };

  orders[index] = updateClients;

  return response.status(201).json(updateClients);
});

app.delete("/orders/:id", checkClientId, (request, response) => {
  const index = request.checkIndex;

  orders.splice(index, 1);

  return response.status(204).json();
});

app.listen(port, () => {
  console.log(`💀† Started server on port ${port} †💀`);
});
