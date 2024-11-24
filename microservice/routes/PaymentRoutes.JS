const express = require('express');

module.exports = (paymentController) => {
    const router = express.Router();

    router.post('/', (req, res) => paymentController.createPayment(req, res));

    console.log('Rotas configuradas com sucesso.');
    return router;
};
