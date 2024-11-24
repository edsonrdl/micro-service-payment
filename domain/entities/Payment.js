class Payment {
    constructor({ paymentId,orderId, amount , status,paymentDate }) {
        if (!paymentId ||!orderId || !amount || !status||!paymentDate) {
            throw new Error('Todos os campos do pagamrnto são obrigatórios.');
        }

        this.paymentId = paymentId;
        this.orderId = orderId;
        this.amount = amount;
        this.status = status;
        this.paymentDate = paymentDate;
    }
}

module.exports = Payment;
