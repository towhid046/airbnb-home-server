import express from 'express';
import { getProperties } from '../handlers/propertyHandler';

const routes = express.Router();

routes.get('/properties', getProperties);

export default routes;
