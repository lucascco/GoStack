const express = require("express");

const server = express();

server.use(express.json());

const projects = [];
let countReq = 0;

server.use((req, res, next) => {
  countReq += 1;
  console.log("Qtd requisições", countReq);
  next();
});

function verifyProjectsExist(req, res, next) {
  let indexProject = undefined;
  const project = projects.find((proj, idx) => {
    if (proj.id === req.params.id) {
      indexProject = idx;
      return true;
    }
  });
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }
  req.project = project;
  req.indexProject = indexProject;
  return next();
}

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.get("/projects/:id", verifyProjectsExist, (req, res) => {
  return res.json(req.project);
});

server.post("/projects", (req, res) => {
  const { id, title, tasks } = req.body;
  projects.push({ id, title, tasks });
  return res.json(projects);
});

server.post("/projects/:id/tasks", verifyProjectsExist, (req, res) => {
  const { title } = req.body;
  req.project.tasks.push(title);
  return res.json(req.project);
});

server.put("/projects/:id", verifyProjectsExist, (req, res) => {
  req.project.title = req.body.title;
  return res.json(projects);
});

server.delete("/projects/:id", verifyProjectsExist, (req, res) => {
  projects.splice(req.indexProject, 1);
  return res.json(projects);
});

server.listen(3000);
