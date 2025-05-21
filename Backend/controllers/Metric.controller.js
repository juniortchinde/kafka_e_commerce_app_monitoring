const {
    Kafka,
    ErrorCodes, CompressionTypes, // You can specify additional optional properties for further configuration.
} = require('@confluentinc/kafka-javascript').KafkaJS;


const produceMessage = async (req, res) => {

    const { sessionId, eventType, timestamp, details,} = req.body;

    const producer = new Kafka().producer({
        'bootstrap.servers': process.env.KAFKA_BROKER
    });

    await producer.connect();

    switch (eventType) {
        case "click":
            await producer.send({
                topic: 'user',
                key: eventType,
                value: JSON.stringify({
                    eventType,
                    timestamp,
                    details,
                }),
                compression: CompressionTypes.GZIP,
            });
            break
        case "mouseOver":
            await producer.send({
                topic: 'user.mousemove',
                key: sessionId,
                value: JSON.stringify({
                    eventType,
                    timestamp,
                    details,
                }),
                compression: CompressionTypes.GZIP,
            });
            break

        case "scroll":
            await producer.send({
                topic: 'user.scroll',
                key: sessionId,
                value: JSON.stringify({
                    eventType,
                    timestamp,
                    details,
                }),
                compression: CompressionTypes.GZIP,
            });
            break

        case "navigation":
            await producer.send({
                topic: 'user.navigation',
                key: sessionId,
                value: JSON.stringify({
                    eventType,
                    timestamp,
                    details,
                }),
                compression: CompressionTypes.GZIP,
            });
            break
    }

    await producer.disconnect();
};

module.exports = {produceMessage}
