// Aqui utilizamos o node juntamente com o framework fastify

// import { DatabaseMemory } from './database-memory.js';
import { fastify } from 'fastify';
import { DatabasePostgres } from './database-postgres.js';

// const database = new DatabaseMemory();
const server = fastify();
const database = new DatabasePostgres();

server.get('/videos', async (request, response) => {
    const search = request.query.search;

   const videos = await database.list(search);

   return response.send(videos);
});

server.post('/videos', async (request, response) => {
    const { title, description, duration } = request.body;

    await database.create({
        title: title,
        description: description,
        duration: duration,
    });

    return response.status(201).send();
});

server.put('/videos/:id', async (request, response) => {
    const videoId = request.params.id;
    const { title, description, duration } = request.body;

    await database.update(videoId, {
        title: title,
        description: description,
        duration: duration
    });

    return response.status(204).send();
}); 

server.delete('/videos/:id', async (request, response) => {
    const videoId = request.params.id;

    await database.delete(videoId);
    
    return response.status(204).send();
});

server.listen({
    port: process.env.PORT ?? 3333,
});