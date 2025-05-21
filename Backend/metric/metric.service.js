const {
    Kafka,
    ErrorCodes, CompressionTypes, // You can specify additional optional properties for further configuration.
} = require('@confluentinc/kafka-javascript').KafkaJS;


const producer = async (message) => {
    const producer = new Kafka().producer({
        'bootstrap.servers': 'localhost:9092',
    });

    await producer.connect();

    const deliveryReports = await producer.send({
        topic: 'test-topic',
        messages: message
    });
    console.log({deliveryReports});
    await producer.disconnect();
};

module.exports = {producer}
