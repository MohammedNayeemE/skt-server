import express , {Express , Router ,  Request , Response} from 'express';
import {router_module} from '../lib/util.ts';
const router : Router = express.Router();
const BASE_ROUTE = '/model';

const MODULE : router_module = { 
  BASE_ROUTE , router 
}

export default MODULE;


