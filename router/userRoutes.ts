import express , {Express , Router ,  Request , Response} from 'express';
import {router_module} from '../lib/util.ts';
const router : Router = express.Router();
const BASE_ROUTE = '/user';

router.get('/' , (_ , res : Response) => { res.status(200).json({statusCode : 200 , msg : 'the user route is working'}) });

const MODULE: router_module = {
  BASE_ROUTE , router 
}
export default MODULE;

