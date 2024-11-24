require('dotenv').config();
const RabbitMqService = require('../services/rabbitmqservice/RabbitMqService');
const ProcessPaymentService = require('../../application/services/ProcessPaymentService');
const ReconnectScheduler = require('../scheduler/ReconnectScheduler');

class RabbitMqConsumer {
    constructor(config, paymentRepository) {
        this.rabbitMqService = new RabbitMqService(config);
        this.paymentRepository = paymentRepository; 
        this.scheduler = new ReconnectScheduler(10, 5000);
        this.isConsuming = false; 
    }
   
    async start() {
        try {
            console.log('Conectando ao RabbitMQ e iniciando consumo da fila de pagamento...');
            await this.rabbitMqService.connect(); 

        
            this.rabbitMqService.setOnReconnectCallback(() => this.restartConsuming());

         
            await this.startConsuming();
            console.log('Consumidor de processamento de pagamento iniciado com sucesso.');
        } catch (err) {
            console.error('Erro ao iniciar o consumidor de processamento de pagamento:', err.message);

            await this.scheduler.schedule(() => this.start());
        }
    }


    async startConsuming() {
        if (this.isConsuming) return; 

        this.isConsuming = true; 
        try {
            await this.rabbitMqService.consume(async (message) => {
                console.log('Mensagem  recebida payment_queue:', message);

                const processOrderUseService = new ProcessPaymentService(this.paymentRepository);
                try {
            
                    await processOrderUseService.execute(JSON.parse(message));
                    console.log('Mensagem  payment_queue processada com sucesso.');
                } catch (err) {
                    console.error('Erro ao processar mensagem payment_queue:', err.message);
                }
            });
        } catch (err) {
            console.error('Erro ao iniciar o consumo de mensagens processamento de pagamento:', err.message);
        }
    }

    async restartConsuming() {
        console.log('Reiniciando consumo de processamento de pagamento...');
        this.isConsuming = false;
        await this.startConsuming(); 
    }


    async stop() {
        console.log('Encerrando consumidor RabbitMQ...');
        await this.rabbitMqService.close();
        this.isConsuming = false; 
    }
}

module.exports = RabbitMqConsumer;