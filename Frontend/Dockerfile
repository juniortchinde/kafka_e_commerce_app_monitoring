# Étape unique : développement avec Vite
FROM node:18

# Répertoire de travail
WORKDIR /app

# Copier les fichiers dans le conteneur
COPY . .

# Installer les dépendances
RUN npm install

# Exposer le port Vite
EXPOSE 5173

# Lancer Vite avec accès externe
CMD ["npm", "run", "dev", "--", "--host"]
