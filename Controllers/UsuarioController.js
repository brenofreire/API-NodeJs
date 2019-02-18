const Usuario = require('../Models/UsuarioModel');
const jwt = require('jsonwebtoken');
const Configs = require('../Configs/configs');

let rotas = (route, routeAuth) => {
    route.post('/login', (requisicao, resposta) => {
        let usuario = requisicao.body.usuario;
        let senha = requisicao.body.senha;
        Usuario.login(usuario, senha).then(result => {
            resposta.json({
                mensagem: 'Este é o seu token',
                token: result
            });
        }).catch(err => {
            resposta.json(err);
        });
    });
    route.post('/cadastrar', (requisicao, resposta) => {
        usuario = requisicao.body.usuario;
        email = requisicao.body.email;
        senha = requisicao.body.senha;
        Usuario.criar_usuario(usuario, email, senha).then(result => {
            resposta.json(result);
        }).catch(erro => {
            resposta.json(erro);
            console.log(erro);
        })
    });
    routeAuth.get('/listar/:id_usuario', (requisicao, resposta) => {
        id_usuario = requisicao.params.id_usuario;
        Usuario.listar_usuarios(id_usuario).then(result => {
            resposta.json(result);
        }).catch(err => {
            resposta.json(err);
        });
    });
    routeAuth.post('/usuario/atualizar/senha', (requisicao, resposta) => {
        let usuario = requisicao.body.usuario;
        let senha = requisicao.body.senha;
        let nova_senha = requisicao.body.nova_senha;

        Usuario.atualizar_senha(usuario, senha, nova_senha).then(result => {
            resposta.json(result);
        }).catch(err => {
            resposta.json(err);
        });
    });
    routeAuth.post('/cadastrar/propriedade', (requisicao, resposta) => {
        let usuario = requisicao.body.id_usuario;
        let propriedade = requisicao.body.propriedade;
        Usuario.criar_propriedade_usuario(usuario, propriedade).then(result => {
            resposta.json(result);
        }).catch(erro => {
            resposta.send(erro);
        });
    });
    routeAuth.get('/usuario/listar/propriedade/:id_usuario/:limit', (requisicao, resposta) => {
        let id_usuario = requisicao.params.id_usuario;
        let limit = requisicao.params.limit;
        Usuario.listar_propriedades_usuario(id_usuario, limit).then(result => {
            resposta.json(result);
        }).catch(err => {
            resposta.json(err);
        });
    });
    routeAuth.get('/produto/:id_propriedade/remover', (requisicao, resposta) => {
        let token = requisicao.headers.authorization;
        let decoded = jwt.verify(token, Configs.secret);
        decoded = JSON.parse(decoded.data);

        let id_propriedade = requisicao.params.id_propriedade;
        let id_usuario = decoded.id_usuario;

        Usuario.remover_propriedade(id_usuario, id_propriedade).then(result => {
            resposta.json(result);
        }).catch(err => {
            resposta.json(err);
        });
    });
}

module.exports = rotas;