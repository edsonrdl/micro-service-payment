const Payment = require("../../domain/entities/Payment");

class ProcessPaymentService {
  constructor(PaymentRepository) {
    this.PaymentRepository = PaymentRepository;
  }
  async execute(PaymentData) {
    try {
      const Payment = new Payment({
        paymentId: PaymentData.PaymentId,
        orderId: PaymentData.OrderId,
        amount: PaymentData.Amount,
        status: PaymentData.Status,
        paymentDate: PaymentData.PaymentDate,
      });
      await this.PaymentRepository.save(Payment);
      console.log(`Pagamento ${Payment.PaymentId} processado com sucesso.`);
    } catch (err) {
      console.error(`Erro ao processar pagamento: ${err.message}`);
      throw err;
    }
  }
}

module.exports = ProcessPaymentService;
