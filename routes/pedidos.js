const express = require('express');
const router = express.Router();
const mysql = require('../mysql')

router.get('/', (req, res, next) => {
    const id = req.body.id_pedido;
    const quantidade = req.body.quantidade;
    
    mysql.getConnection((error, conn) => {
        
        if (error) {return res.status(500).send({error: error});}
        
        conn.query(
            'SELECT * FROM pedidos;', 
            (error, result, field) => {
                conn.release();

                if(error) {res.status(500).send({error: error, response: null});}
                
                const response = {
                    quantidade: result.length,
                    produtos: result.map((pedid) => {
                        return {
                            id_pedido: pedid.id_pedido,
                            id_produto: pedid.id_produto,
                            quantidade: pedid.quantidade,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna um pedido',
                                url: `http://localhost:3000/pedidos/${pedid.id_pedido}`
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
    const id = req.body.id_produto;
    const quantidade = req.body.quantidade;

    mysql.getConnection((error, conn) => {
        
        if (error) {return res.status(500).send({error: error});}
        
        conn.query(
            'INSERT INTO pedidos (id_produto, quantidade) VALUES (?,?);', 
            [id, quantidade],
            (error, result, field) => {
                conn.release();

                if(error) {res.status(500).send({error: error, response: null});}
                
                const response = {
                    mensagem:  'Pedido efetuado com sucesso',
                    pedidoCriado:  {
                        id_pedido: result.insertId,
                        id_produto: id,
                        quantidade: quantidade
                    } 
                }
                res.status(201).send({response});

            }
        )
    })
});
    

router.get('/:id_pedido', (req, res, next) => {
    const id = req.params.id_pedido;
    res.status(200).send({
        message: `Detalhes do pedido ${id}`
    })
});

router.patch('/:id_pedido', (req, res, next) => {
    const id = req.params.id_pedido;
    res.status(200).send({
        message: 'Pedido atualizado com sucesso'
    })
});

router.delete('/:id_pedido', (req, res, next) => {
    const id = req.params.id_pedido;
    res.status(201).send({
        message: 'Pedido excluido com sucesso'
    })
;})



module.exports = router;