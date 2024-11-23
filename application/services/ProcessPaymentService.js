const Payment = require("../../domain/entities/Payment");

class ProcessPaymentService {
  constructor(PaymentRepository) {
    this.PaymentRepository = PaymentRepository;
  }
  async execute(PaymentData) {
    try {
      const Payment = new Payment({
        createdAt: PaymentData.CreatedAt,
        PaymentId: PaymentData.PaymentId,
        productName: PaymentData.ProductName,
        quantity: PaymentData.Quantity,
        status: PaymentData.Status,
      });
      await this.PaymentRepository.save(Payment);
      console.log(`Pagamento ${Payment.PaymentId} processado com sucesso.`);
    } catch (err) {
      console.error(`Erro ao processar pedido: ${err.message}`);
      throw err;
    }
  }
}

module.exports = ProcessPaymentService;
