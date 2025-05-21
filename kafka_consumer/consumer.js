const { Kafka } = require('kafkajs');
const analyticsStats = require('./analyticsStats');

const kafka = new Kafka({ brokers: ['localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'analytics-group' });

async function run() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'orders', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const order = JSON.parse(message.value.toString());
      analyticsStats.addOrder(order);

      console.clear(); // Efface la console pour un affichage "live"
      console.log('📥 Nouvelle commande reçue :', order);

      console.log('\n📊 === Tableau de bord des ventes ===');
      console.log(`💰 Revenu total : ${analyticsStats.getTotalRevenue().toFixed(2)} €`);
      console.log(`🧾 Nombre total de commandes : ${analyticsStats.getTotalOrders()}`);
      console.log(`📉 Montant moyen par commande : ${analyticsStats.getAverageOrderAmount().toFixed(2)} €`);

      const mostOrdered = analyticsStats.getMostOrderedProduct();
      if (mostOrdered) {
        console.log(`🔥 Produit le plus commandé : Produit ${mostOrdered.productId} (${mostOrdered.count} fois)`);
      }

      console.log('\n👤 Commandes par utilisateur :');
      const ordersByUser = analyticsStats.getOrdersByUser();
      for (const [userId, orders] of Object.entries(ordersByUser)) {
        const total = orders.reduce((sum, o) => sum + o.amount, 0);
        console.log(` - Utilisateur ${userId} : ${orders.length} commande(s), ${total.toFixed(2)} €`);
      }
    },
  });
}

run().catch(console.error);
