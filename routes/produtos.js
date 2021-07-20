const express = require('express');
const router = express.Router();
const mysql = require('../mysql')

router.get('/', (req, res, next) => {
    
    mysql.getConnection((error, conn) => {
        
        if (error) {
            return res.status(500).send({
                error: error
            });
        }
        
        conn.query(
            'SELECT * FROM produtos;', 
            (error, result, field) => {
                conn.release();

                if(error) {
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                
                const response = {
                    quantidade: result.length,
                    produtos: result.map((prod) => {
                        return {
                            id_produto: prod.id_produto,
                            nome: prod.nome,
                            preco: prod.preco,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna um produto',
                                url: `http://localhost:3000/produtos/${result.id_produto}`
                            }
                        }
                    })
                }
                res.status(201).send({response});

            }
        )
    })
});

router.post('/', (req, res, next) => {
    const nome = req.body.nome;
    const preco = req.body.preco;

    mysql.getConnection((error, conn) => {
        
        if (error) {
            return res.status(500).send({
                error: error
            });
        }
        
        conn.query(
            'INSERT INTO produtos (nome, preco) VALUES (?,?);', 
            [nome, preco],
            (error, result, field) => {
                conn.release();

                if(error) {
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                
                const response = {
                    mensagem:  'Produto criado com sucesso',
                    produtoCriado:  {
                        id_produto: result.insertId,
                        nome: req.body.nome,
                        preco: req.body.preco
                    } 
                }
                res.status(201).send({response});

            }
        )
    })
});

router.get('/:id_produto', (req, res, next) => {
    const id = req.params.id_produto;
    
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            })
        }

        conn.query(
            'SELECT * FROM produtos WHERE id_produto = ?;',
            [id],
            (error, result, field) => {
                conn.release();

                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }

                if(result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Produto não encontrado'
                    });
                }
                
                const response = {
                    produto:  {
                        id_produto: result[0].id_produto,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos',
                            url: 'http://localhost:3000/produtos'
                        }
                    } 
                }
                res.status(201).send({response});
            }
        )
    })
});

router.patch('/:id_produto', (req, res, next) => {
    const id = req.params.id_produto;
    const nome = req.body.nome;
    const preco = req.body.preco;

    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            });
        }

        conn.query(
            'UPDATE produtos SET nome = ?, preco = ? WHERE id_produto = ?',
            [nome, preco, id], (error, result, field) => {
                conn.release();
                
                if (error) {
                    return res.status(500).send({
                        error: error
                    });
                }

                const response = {
                    mensagem:  'Produto atualizado com sucesso',
                    produtoCriado:  {
                        id_produto: id,
                        nome: nome,
                        preco: preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes do produto atulizado',
                            url: `http://localhost:3000/produtos/${id}`
                        }
                    } 
                }
                res.status(201).send({response});
            }
        )
    })
});

router.delete('/:id_produto', (req, res, next) => {
    const id = req.params.id_produto;
    
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            });
        }

        conn.query(
            'DELETE FROM produtos WHERE id_produto = ?',
            [id], (error, result, field) => {
                conn.release();
                
                if (error) {
                    return res.status(500).send({
                        error: error
                    });
                }

                const response = {
                    mensagem:  'Produto deletado com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Inserir um produto novo',
                        url: 'http://localhost:3000/produtos'
                        }
                }
                res.status(201).send({response}); 
            }
        )
    })
})



module.exports = router;