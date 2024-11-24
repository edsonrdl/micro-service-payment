require('dotenv').config();
const amqp = require('amqplib');
const ReconnectScheduler = require('../../scheduler/ReconnectScheduler');

class RabbitMqService {
    constructor(config) {
        this.config = config;
        this.connection = null;
        this.channel = null;
        this.isConnected = false;
        this.onReconnectCallback = null; 
    }


    async connect() {
        try {
            console.log('Tentando conectar a fila de pagamento...');
            this.connection = await amqp.connect(this.config.url);
            this.channel = await this.connection.createChannel();

 
            await this.channel.assertExchange(this.config.exchange, 'direct', { durable: true });
            await this.channel.assertQueue(this.config.queue, { durable: true });
            await this.channel.bindQueue(this.config.queue, this.config.exchange, this.config.routingKey);

            this.isConnected = true;
            console.log('Fila conectada e configurado.');

    
            this.connection.on('close', async () => {
                console.error('Conexão com fila de pagamento foi fechada. Tentando reconectar...');
                this.isConnected = false;
                await this.handleReconnect();
            });

 
            this.connection.on('error', async (err) => {
                console.error('Erro na conexão com fila de pagamento:', err.message);
                this.isConnected = false;
                await this.handleReconnect();
            });

        
            if (this.onReconnectCallback) {
                await this.onReconnectCallback();
            }
        } catch (err) {
            console.error('Erro ao conectar a fila de pagamento:', err.message);
            this.isConnected = false;
            throw err;
        }
    }

  
    async consume(callback) {
        if (!this.channel) {
            throw new Error('Canal fila de pagamento não configurado. Conecte-se primeiro.');
        }

        console.log('Iniciando consumo de mensagens fila de pagamento...');
        await this.channel.consume(this.config.queue, async (msg) => {
            if (msg) {
                try {
                    
                    await callback(msg.content.toString());
                    this.channel.ack(msg); 
                } catch (err) {
                    console.error('Erro ao processar mensagem de pagamento:', err.message);
                    this.channel.nack(msg, false, false); 
                }
            }
        });
    }

    async close() {
        if (this.channel) await this.channel.close();
        if (this.connection) await this.connection.close();
        console.log('Conexão com RabbitMQ encerrada.');
    }

    async handleReconnect() {
        const reconnectFn = async () => {
            console.log('Tentando reconectar ao RabbitMQ...');
            await this.connect();
        };

   
        await new ReconnectScheduler(10, 5000).schedule(reconnectFn);
    }


    setOnReconnectCallback(callback) {
        this.onReconnectCallback = callback;
    }
}

module.exports = RabbitMqService;