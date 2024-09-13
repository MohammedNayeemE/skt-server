import {Router} from 'express';
export interface router_module {
  BASE_ROUTE : string ,
  router : Router
}
export interface Room {
  [ key : string ] : string ,
}
