const IPaymentRepository = require('../../../../domain/useCases/IPaymentRepository');

class PaymentRepository extends IPaymentRepository {
    constructor(db) {
        super();
        if (!db) {
            throw new Error('A instância do banco de dados é obrigatória.');
        }
        this.collection = db.collection('paymentsCollection');
    }

    async save(payment) {
        try {
            const result = await this.collection.insertOne(payment);
            console.log(`Pedido salvo no Banco de pagamento com ID: ${result.insertedId}`);
        } catch (err) {
            console.error('Erro ao salvar pagamento no Banco:', err);
            throw err;
        }
    }
}

module.exports = PaymentRepository;
