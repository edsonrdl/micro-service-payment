require('dotenv').config({ path: './config/.env' });

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config/config');
const MongoDbRepository = require('./infrastructure/persistence/repositories/mongoRespositories/MongoDbRepository');
const PaymentRepository = require('./infrastructure/persistence/repositories/PaymentRepository/PaymentRepository');
const RabbitMqConsumer = require('./infrastructure/messaging/RabbitMqConsumer');
const PaymentController = require('./microservice/controllers/PaymentController');
const PaymentRoutes = require('./microservice/routes/PaymentRoutes.JS');

(async function startSystem() {
    try {
        const app = express();


        app.use(cors({ origin: config.server.allowedOrigin }));
        app.use(bodyParser.json());

        console.log('Inicializando o sistema...');


        const mongoDbRepository = new MongoDbRepository(config.mongoDb);
        const db = await mongoDbRepository.connect();
        const PaymentRepository = new PaymentRepository(db);

   
        const rabbitMqConsumer = new RabbitMqConsumer(config.rabbitMq, PaymentRepository);
        await rabbitMqConsumer.start();

     
        const PaymentController = new PaymentController(PaymentRepository);
        app.use('/api/Payments', PaymentRoutes(PaymentController));

        app.listen(config.server.port, () => {
            console.log(`Servidor rodando na porta ${config.server.port}`);
        });

        process.on('SIGINT', async () => {
            console.log('\nEncerrando o sistema...');
            await mongoDbRepository.closeConnection();
            await rabbitMqConsumer.stop();
            process.exit(0);
        });

    } catch (err) {
        console.error('Erro ao iniciar o sistema:', err.message);
        process.exit(1);
    }
})();