const { Kafka } = require('kafkajs');
const analyticsStats = require('./analyticsStats');
const Table = require('cli-table3');
const chalk = require('chalk');

const kafka = new Kafka({ brokers: ['localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'analytics-group' });

async function run() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'orders', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const order = JSON.parse(message.value.toString());
      analyticsStats.addOrder(order);

      console.clear();

      console.log(chalk.blueBright.bold(' Nouvelle commande reçue :'), order);

      console.log(chalk.green('\n === Tableau de bord des ventes ==='));
      console.log(`${chalk.bold('Revenu total')}: ${analyticsStats.getTotalRevenue().toFixed(2)} €`);
      console.log(`${chalk.bold('Nombre total de commandes')}: ${analyticsStats.getTotalOrders()}`);
      console.log(`${chalk.bold('Montant moyen par commande')}: ${analyticsStats.getAverageOrderAmount().toFixed(2)} €`);

      const mostOrdered = analyticsStats.getMostOrderedProduct();
      if (mostOrdered) {
        console.log(`${chalk.bold('Produit le plus commandé')} : Produit ${mostOrdered.productId} (${mostOrdered.count} fois)`);
      }

      const table = new Table({
head: [
  chalk.bold.white('Utilisateur'),
  chalk.bold.white('Commandes'),
  chalk.bold.white('Total (€)'),
],
        colWidths: [20, 20, 20],
      });

      const ordersByUser = analyticsStats.getOrdersByUser();
      for (const [userId, orders] of Object.entries(ordersByUser)) {
        const total = orders.reduce((sum, o) => sum + o.amount, 0);
        table.push([`Utilisateur ${userId}`, orders.length, total.toFixed(2)]);
      }

      console.log('\n' + table.toString());
    },
  });
}

run().catch(error => {
  console.error(chalk.red('Une erreur est survenue dans le consommateur Kafka :'), error);
});
