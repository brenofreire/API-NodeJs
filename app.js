const app = require('./Configs/server').app;
const route = require('./Configs/server').route;
const routeAuth = require('./Configs/server').routeAuth;

const rotasUsuario = require('./Controllers/UsuarioController')(route, routeAuth);