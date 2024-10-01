import express from 'express';
import { getUsersHandler } from './../handlers/usersHandler';

const routes = express.Router(); // Make sure to use Router, not just express()

routes.get('/users', getUsersHandler);

export default routes;
