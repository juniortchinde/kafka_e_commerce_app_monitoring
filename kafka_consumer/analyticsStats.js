class AnalyticsStats {
  constructor() {
    this.orders = [];
  }

  // Ajouter une commande
  addOrder(order) {
    this.orders.push(order);
  }

  // Revenu total
  getTotalRevenue() {
    return this.orders.reduce((sum, o) => sum + o.amount, 0);
  }

  // Nombre total de commandes
  getTotalOrders() {
    return this.orders.length;
  }

  // Moyenne du montant des commandes
  getAverageOrderAmount() {
    if (this.orders.length === 0) return 0;
    return this.getTotalRevenue() / this.orders.length;
  }

  // Commandes groupées par utilisateur
  getOrdersByUser() {
    const grouped = {};
    this.orders.forEach(order => {
      if (!grouped[order.userId]) grouped[order.userId] = [];
      grouped[order.userId].push(order);
    });
    return grouped;
  }

  // Produit le plus commandé
  getMostOrderedProduct() {
    const productCounts = {};
    this.orders.forEach(order => {
      const productId = order.productId;
      productCounts[productId] = (productCounts[productId] || 0) + 1;
    });

    let maxCount = 0;
    let mostOrdered = null;
    for (const [productId, count] of Object.entries(productCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mostOrdered = productId;
      }
    }
    return { productId: mostOrdered, count: maxCount };
  }

  // Affichage des stats
  printStats() {
    console.log('📊 Total revenue:', this.getTotalRevenue().toFixed(2));
    console.log('📈 Total orders:', this.getTotalOrders());
    console.log('💰 Average order amount:', this.getAverageOrderAmount().toFixed(2));
    console.log('📦 Most ordered product:', this.getMostOrderedProduct());
    console.log('👥 Orders by user:', this.getOrdersByUser());
  }
}

module.exports = new AnalyticsStats();
