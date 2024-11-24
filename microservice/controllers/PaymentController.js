const Joi = require('joi');

class PaymentController {
    constructor(processPaymentService) {
        this.processPaymentService = processPaymentService;
    }

    async createPayment(req, res) {
        const paymentSchema = Joi.object({
            paymentId: Joi.string().required(),
            orderId: Joi.string().required(),
            amount: Joi.number().positive().required(),
            status: Joi.string().required(),
            paymentDate: Joi.date().required(),
        });

        const { error } = paymentSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        try {
            const paymentData = req.body;
            await this.processPaymentService.execute(paymentData);
            res.status(201).json({ message: 'Pagamento processado com sucesso.' });
        } catch (err) {
            res.status(500).json({ error: `Erro ao processado pagamento: ${err.message}` });
        }
    }
}

module.exports = PaymentController;
