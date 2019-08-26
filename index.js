const express = require("express");

const server = express();

server.use(express.json());

let numOfReq = 0;
const projects = [];

//Middlaware que verifica se o projeto existe
function verifyProjectExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "O projeto não foi encontrado" });
  }

  return next();
}

//Middleware de log da aplicação
function logApp(req, res, next) {
  numOfReq++;

  console.log(`Número de requisições na aplicação: ${numOfReq}`);

  return next();
}

server.use(logApp);

//Rota que lista todos os projetos
server.get("/projects", (req, res) => {
  return res.json(projects);
});

//Rota que cadastra um novo projeto
server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = { id, title, tasks: [] };

  projects.push(project);

  return res.json(project);
});

//Rota que edita um projeto
server.put("/projects/:id", verifyProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

//Rota que deleta um projeto
server.delete("/projects/:id", verifyProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

server.post("/projects/:id/tasks", verifyProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});
server.listen(3333);
