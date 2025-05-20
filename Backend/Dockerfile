# Utilise une image officielle Node.js
FROM node:18

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers de l'application dans le conteneur
COPY . .
# Installe les dépendances
RUN npm install

# Expose le port utilisé par ton serveur Node.js
EXPOSE 4000

# Commande pour démarrer l'application
CMD ["node", "server.js"]
