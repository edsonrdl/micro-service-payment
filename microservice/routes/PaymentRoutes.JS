const express = require('express');

module.exports = (orderController) => {
    const router = express.Router();

    router.post('/', (req, res) => orderController.createOrder(req, res));

    console.log('Rotas configuradas com sucesso.');
    return router;
};
