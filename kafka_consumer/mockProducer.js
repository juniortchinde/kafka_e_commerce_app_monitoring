const { Kafka } = require('kafkajs');

const kafka = new Kafka({ brokers: ['localhost:9092'] });
const producer = kafka.producer();

async function run() {
  await producer.connect();

  const fakeOrders = [
    { userId: 1, productId: 101, amount: 49.99 },
    { userId: 2, productId: 102, amount: 19.99 },
    { userId: 1, productId: 103, amount: 5.99 },
  ];

  for (const order of fakeOrders) {
    await producer.send({
      topic: 'orders',
      messages: [
        { key: String(order.userId), value: JSON.stringify(order) },
      ],
    });
    console.log('Message envoyé :', order);
  }

  await producer.disconnect();
}

run().catch(console.error);
