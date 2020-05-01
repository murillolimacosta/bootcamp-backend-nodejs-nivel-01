const express = require('express');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());

const projects = [];

/**
 * Função que simula a aplicação de um middleware, 
 * utilizando um log simples.
 * 
 * @param {object} request 
 * @param {object} response 
 * @param {object} next 
 * 
 * @return {function}
 * 
 * @author Murillo Lima Costa
 */
function logRequests(request, response, next) {

    const { method, url } = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.log(logLabel);

    return next();
}

/**
 * Registro da função "logRequests" como middleware,
 * para todos os métodos registrados.
 */
app.use(logRequests);

/**
 * Função que simula a aplicação de um middleware, 
 * utilizando uma simples do parâmetro id.
 * 
 * @param {object} request 
 * @param {object} response 
 * @param {object} next 
 * 
 * @return {function} next()
 * 
 * @author Murillo Lima Costa
 */
function validateProjectId(request, response, next) {
    
    const { id } = request.params;

    if (!isUuid(id)) {
        return response.status(400).json({ error: "Invalid project ID." });
    }

    return next();
}

/**
 * Registro da função "logRequests" como middleware,
 * somente para métodos com o tipo de parâmetro 
 * 'route'.
 */  
app.use('/projects/:id', validateProjectId);

/**
 *  Método que retorna a lista de projetos.
 */
app.get('/projects', (request,response) => {

    const { title } = request.query;

    const result = title 
        ? projects.filter(project => project.title.includes(title))
        : projects;

    return response.json(result);
});

/**
 * Método que inserção de projetos.
 */
app.post('/projects', (request,response) => {

    const {title, owner} = request.body;

    // Montando o novo projeto
    const project = { id: uuid(), title, owner }

    // Adicinando na array projects
    projects.push(project);

    return response.json(project);
});

/**
 * Método de alteração de projetos
 */
app.put('/projects/:id', (request,response) => {

    const {id} = request.params;
    const {title, owner} = request.body;

    const projectIndex = projects.findIndex(project => project.id === id);

    if (projectIndex < 0) {
        return response.status(400).json({ error: 'Project not found!' });
    }

    const project = { id, title, owner };

    // Alterando a array na posição requisitada
    projects[projectIndex] = project;

    return response.json(project);
});

/**
 * Método de exclusão de projetos.
 */
app.delete('/projects/:id', (request,response) => {

    const {id} = request.params;

    const projectIndex = projects.findIndex(project => project.id === id);

    if (projectIndex < 0) {
        return response.status(400).json({ error: 'Project not found!' });
    }

    projects.splice(projectIndex,1);

    return response.status(204).send();
});

// Registrando a porta 3333
app.listen(3333, () => {
    console.log("Backend started!");
});