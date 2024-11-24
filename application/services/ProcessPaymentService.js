const Payment = require("../../domain/entities/Payment");

class ProcessPaymentService {
  constructor(paymentRepository) {
    this.paymentRepository = paymentRepository;
  }
  async execute(PaymentData) {
    try {
      const payment = new Payment({
        paymentId: PaymentData.PaymentId,
        orderId: PaymentData.OrderId,
        amount: PaymentData.Amount,
        status: PaymentData.Status,
        paymentDate: PaymentData.PaymentDate,
      });
      await this.paymentRepository.save(payment);
      console.log(`Pagamento ${payment.PaymentId} processado com sucesso.`);
    } catch (err) {
      console.error(`Erro ao processar pagamento: ${err.message}`);
      throw err;
    }
  }
}

module.exports = ProcessPaymentService;
