const express = require('express'); // Filtro de rotas da API
const app = express();
const bodyParser = require('body-parser');
const port = 4444;
const morgan = require('morgan');

const jwt = require('jsonwebtoken');
const configs = require('./configs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('segredoSegredoso', configs.secret);

app.use(morgan('dev'));

route = express.Router();
routeAuth = require('./auth')(express);


app.use('/', route);
app.use('/', routeAuth);

module.exports = {
    app,
    route,
    routeAuth
}

app.listen(port, () => {
    console.log('Escutando na porta: ' + port);
})