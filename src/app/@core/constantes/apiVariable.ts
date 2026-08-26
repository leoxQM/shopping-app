import { environment } from "../../../environments/environment.development";
import { environment as environmentProd } from "../../../environments/environment";

//const appStore = environment.apiAppStore; //desarrollo
const appStore = environmentProd.apiAppStore; //produccion

const controllerProducts: string = appStore+'productos';
const controllerUsuarios: string = appStore + 'usuarios';
const controllerAuth: string = environment.apiAuth;

export const constantesApiStore = {
  obtenerProductos: controllerProducts,
  obtenerXCategoria: controllerProducts+'/categoria/',
  baseImagenes: environment.baseImagenes,
  obtenerUsuarios: controllerUsuarios,
  registrarUsuario: controllerAuth + 'register'
}

