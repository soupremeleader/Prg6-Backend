import express from "express";
import Project from "./schemas/Project.js";
import { faker } from "@faker-js/faker";
import "dotenv/config";

const routes = express.Router();

routes.get("/", (req, res, next) => {
  if (req.header("Accept") === "application/json") {
    next();
  } else {
    res.status(415).send();
  }
});

routes.post("/", (req, res, next) => {
  if (
    req.header("Accept") === "application/json" ||
    "application/x-www-form-urlencoded"
  ) {
    next();
  } else {
    res.status(415).send();
  }
});

routes.post("/seed", (req, res, next) => {
  if (
    req.header("Accept") === "application/json" ||
    "application/x-www-form-urlencoded"
  ) {
    next();
  } else {
    res.status(415).send();
  }
});

routes.get("/:id", (req, res, next) => {
  if (req.header("Accept") === "application/json") {
    next();
  } else {
    res.status(415).send();
  }
});

routes.put("/:id", (req, res, next) => {
  if (req.header("Accept") === "application/json") {
    next();
  } else {
    res.status(415).send();
  }
});

routes.delete("/:id", (req, res, next) => {
  if (req.header("Accept") === "application/json") {
    next();
  } else {
    res.status(415).send();
  }
});

routes.options("/", (req, res) => {
  res.header("Allow", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Methods", ["GET", "POST"]);
  res.status(200).send();
});

routes.options("/:id", (req, res) => {
  res.header("Allow", "GET, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Methods", ["GET", "PUT", "DELETE"]);
  res.status(200).send();
});

routes.get("/", async (req, res) => {
  try {
    const projects = await Project.find({});
    let collection = {
      items: projects,
      _links: {
        self: {
          href: process.env.URL,
        },
        collection: {
          href: process.env.URL,
        },
      },
    };
    res.json(collection);
  } catch (e) {
    res.json(e);
  }
});

routes.post("/", async ({ body }, res) => {
  try {
    await Project.create({
      title: body.title,
      type: body.type,
      size: body.size,
      wool: body.wool,
      row: body.row,
      link: body.link,
    });

    res.status(201).json({
      message: `Project has been added to the database.`,
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

routes.post("/seed", async ({ body }, res) => {
  try {
    if (body.reset) {
      await Project.deleteMany({});
    }

    let { amount: amount } = body;

    let randomTypes = ["crochet", "knit", "embroidery"];
    let randomSizes = ["3.5mm", "4mm", "5mm", "6mm", "10mm"];
    for (let i = 0; i < amount; i++) {
      let randomType = Math.floor(Math.random() * randomTypes.length);
      let randomSize = Math.floor(Math.random() * randomSizes.length);
      await Project.create({
        title: faker.book.title(),
        type: randomTypes[randomType],
        size: randomSizes[randomSize],
        wool: faker.color.rgb(),
        row: Math.floor(Math.random() * 200),
        link: faker.internet.url(),
      });
    }
    res.status(201).json({
      message: `${amount} projects have been added to the database.`,
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

routes.get("/:id", async ({ params }, res) => {
  try {
    const project = await Project.findById(params.id);
    if (project === null) {
      return res.status(404).json("project doesn't exist");
    }
    res.json(project);
  } catch (e) {
    res.status(400).json(e);
  }
});

routes.put("/:id", async ({ params, body }, res) => {
  const { id: _id } = params;
  const {
    title: title,
    type: type,
    size: size,
    wool: wool,
    row: row,
    link: link,
  } = body;

  if (
    typeof title === "undefined" ||
    typeof type === "undefined" ||
    typeof size === "undefined" ||
    typeof wool === "undefined" ||
    typeof row === "undefined" ||
    typeof link === "undefined" ||
    title === "" ||
    type === "" ||
    size === "" ||
    wool === "" ||
    row === "" ||
    link === ""
  ) {
    res
      .status(400)
      .json("title, type, size, wool, row and link cannot be empty");
    return;
  }
  const newProject = {
    title,
    type,
    size,
    wool,
    row,
    link,
  };
  console.log(newProject);

  try {
    await Project.findByIdAndUpdate(_id, newProject);
    res.json(newProject);
  } catch (e) {
    res.status(404).json(e);
  }
});

routes.delete("/:id", async ({ params }, res) => {
  const { id: _id } = params;
  try {
    const deletedProject = await Project.findByIdAndDelete(_id);
    res.status(204).json(`${deletedProject} has been deleted.`);
  } catch (e) {
    res.status(404).json(e);
  }
});

export default routes;
