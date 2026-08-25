import { environment } from "../../../environments/environment.development";

const appStore = environment.apiAppStore;

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

