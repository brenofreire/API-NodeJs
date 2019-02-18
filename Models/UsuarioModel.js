const banco = require('../Configs/banco');
const server = require('../Configs/server');
const jwt = require('jsonwebtoken');
const Configs = require('../Configs/configs');

const login = function (usuario, senha) {
    return new Promise((response, error) => {
        let query_consultar_conta = `
            SELECT * FROM usuarios WHERE
            usuario = '${usuario}' AND
            senha = '${senha}' LIMIT 1
        `
        banco.query(query_consultar_conta).then(result => {
            if (result.length == 1) {
                let dados_usuario = {
                    id_usuario: result[0].id,
                    usuario: result[0].usuario,
                    email: result[0].email,
                    permissao: result[0].permissao
                }
                var token = jwt.sign({ data: JSON.stringify(dados_usuario) }, Configs.secret, {
                    expiresIn: 60 * 60 * 24
                })
                response(token);
            } else {
                error('Login ou senha inválidos.');
            }
        });
    });
}
const criar_usuario = function (usuario, email, senha) {
    return new Promise((response, error) => {
        let query_criar_usuario = `
            INSERT INTO usuarios (
                usuario,
                email,
                senha
            ) VALUES (
                '${usuario}',
                '${email}',
                '${senha}'
            )
        `;
        let query_consultar_usuario = `
            SELECT * FROM usuarios
            WHERE usuario = '${usuario}' LIMIT 1 
        `
        let query_consultar_email = `
            SELECT * FROM usuarios
            WHERE email = '${email}'
        `
        let regex_usuario = new RegExp('^[a-zA-Z0-9_\.-]{3,32}$');
        let regex_email = new RegExp('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}')
        if (regex_usuario.test(usuario))
            if (regex_email.test(email))
                banco.query(query_consultar_usuario).then(result => {
                    if (result.length == 0)
                        banco.query(query_consultar_email).then(result => {
                            if (result.length == 0)
                                banco.query(query_criar_usuario).then(result => {
                                    if (result)
                                        response('Usuário criado com sucesso!');
                                    else
                                        response('Houve um erro inesperado.');
                                }).catch(err => {
                                    error(err);
                                });
                            else
                                response('Email já cadastrado no sistema');

                        });
                    else
                        response('Usuário já cadastrado no sistema');
                }).catch(err => {
                    error(err);
                });
            else
                response('O email deve ter o formato email@email.com')
        else {
            response('Usuário deve ter somente letras, números ou underline. O usário deve ter entre 6 e 32 carcteres.')
        }
    });
}
const listar_usuarios = function (id_usuario) {
    return new Promise((response, error) => {
        let query_listar_usuario = `
            SELECT * FROM usuarios 
            WHERE id = ${id_usuario} 
        `;
        banco.query(query_listar_usuario).then(result => {
            response(result);
        }).catch(err => {
            error(err);
        });
    });
}
const atualizar_senha = function (usuario, senha, nova_senha) {
    return new Promise((response, error) => {
        let query_consultar_senha = `
            SELECT * FROM usuarios 
            WHERE
                usuario = '${usuario}' AND
                senha   = '${senha}'
            LIMIT 1
        `;
        let query_atualizar_senha = `
            UPDATE usuarios
            SET
                senha   = '${nova_senha}'
            WHERE 
                usuario = '${usuario}' AND
                senha   = '${senha}'
        `

        banco.query(query_consultar_senha).then(result => {
            if (result.length > 0) {
                banco.query(query_atualizar_senha).then(result => {
                    response('Senha alterada com sucesso!');
                }).catch(err => {
                    error(err);
                });
            } else {
                response('Não existe usuário com este login e senha');
            }
        });
    });
}
const criar_propriedade_usuario = function (id_usuario, propriedade) {
    return new Promise((response, error) => {
        slug = propriedade.nome.toLowerCase();
        slug = slug.replace(/ /g, '-');
        let query_criar_propriedade = `
            INSERT INTO usuario_propriedades (
                nome,
                descricao,
                id_usuario,
                slug
            ) VALUES (
                '${propriedade.nome}',
                '${propriedade.descricao}',
                '${id_usuario}',
                '${slug}'
            )
        `
        let query_consultar_propriedade = `
            SELECT * FROM usuario_propriedades
            WHERE 
                slug = '${slug}' AND
                id_usuario = '${id_usuario}'            
            LIMIT 1        
        `
        banco.query(query_consultar_propriedade).then(result => {
            if (result.length == 0) {
                banco.query(query_criar_propriedade).then(result => {
                    response('Propriedade criada com sucesso');
                }).catch(err => {
                    error(err);
                });
            } else {
                response('Propriedade já cadastrada neste usuário');
            }
        }).catch(err => {
            error(err)
        });
    })
}
const listar_propriedades_usuario = function (id_usuario, limit) {
    return new Promise((response, error) => {
        const query_consultar_propriedade_usuario = `
            SELECT 
            usuarios.id as user_id,
            usuarios.usuario,
            usuario_propriedades.nome,
            usuario_propriedades.id
            FROM usuarios
            INNER JOIN usuario_propriedades ON usuarios.id = usuario_propriedades.id_usuario
            WHERE usuarios.id = '${id_usuario}'
            LIMIT ${limit}
        `
        banco.query(query_consultar_propriedade_usuario).then(usuario => {
            response(usuario);
        }).catch(err => {
            error(err);
        });
    });
}
const remover_propriedade = function (id_usuario, id_propriedade) {
    return new Promise((response, error) => {
        let query_consultar_propriedade = `
            SELECT * FROM usuario_propriedades
            WHERE
                id_usuario = '${id_usuario}' AND
                id = '${id_propriedade}'
        `
        let query_deletar_propriedade = `
            DELETE FROM usuario_propriedades 
            WHERE
                id_usuario = '${id_usuario}' AND
                id = '${id_propriedade}'
        `
        banco.query(query_consultar_propriedade).then(result => {
            if (result.length > 0) {
                banco.query(query_deletar_propriedade).then(result => {
                    if (result.affectedRows > 0) {
                        response('Propriedade removida com sucesso!')
                    } else {
                        response('Nada foi alteradao...');
                    }
                });
            } else {
                response('Não existe nenhuma propriedade para este usuário com este id.');
            }
        });
    });
}

module.exports = {
    login,
    criar_usuario,
    listar_usuarios,
    atualizar_senha,
    criar_propriedade_usuario,
    listar_propriedades_usuario,
    remover_propriedade
}