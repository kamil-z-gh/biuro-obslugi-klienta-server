const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;

const fs = require("fs");
const path = require("path");
const pathToFile = path.resolve("./data.json");

const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

const getResources = () => JSON.parse(fs.readFileSync(pathToFile));

app.use("/api/items", (req, res) => {
  const resources = getResources();

  if (req.query.search) {
    const filteredRes = resources.filter((item) =>
      item.name.toLowerCase().includes(req.query.search[0].toLowerCase())
    );

    return res.send(filteredRes);
  }

  return res.send(resources);
});

app.use("/api/item", (req, res) => {
  const resources = getResources();

  if (req.method === "DELETE") {
    console.log("usuwam");

    const updatedResources = resources.filter(
      (item) => item.id !== req.body.itemId
    );
    console.log("PRZED:");
    console.log(resources);
    console.log("PO:");
    console.log(updatedResources);

    console.log("req.body: ");
    console.log(req.body);

    console.log(req);

    fs.writeFile(
      pathToFile,
      JSON.stringify(updatedResources, null, 2),
      (error) => {
        if (error) {
          return res.status(422).send("Cannot store data in the file!");
        }

        return res.send("Item has been saved!");
      }
    );
  }

  if (req.method === "GET") {
    const resource = resources.filter((item) => item.id === req.query.id)[0];

    return res.send(resource);
  }

  if (req.method === "POST") {
    const newResource = {
      ...req.body,
      id: Date.now().toString(),
    };
    resources.unshift(newResource);

    fs.writeFile(pathToFile, JSON.stringify(resources, null, 2), (error) => {
      if (error) {
        return res.status(422).send("Cannot store data in the file!");
      }

      return res.send("Data has been saved!");
    });
  }

  if (req.method === "PUT") {
    const resToEditID = resources.findIndex((item) => item.id === req.body.id);

    resources[resToEditID] = req.body;

    fs.writeFile(pathToFile, JSON.stringify(resources, null, 2), (error) => {
      if (error) {
        return res.status(422).send("Cannot store data in the file!");
      }

      return res.send("Data has been saved!");
    });
  }
});

app.listen(PORT, () => {
  console.log("server is listening od port: " + PORT);
});
