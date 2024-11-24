class IPaymentRepository {
    async save(payment) {
        throw new Error('Método "save" não implementado.');
    }
}

module.exports = IPaymentRepository;
