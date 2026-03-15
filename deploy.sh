#!/bin/bash
cd /var/www/sbexcandidature

# Récupération des dernières modifications (si Git)
git pull origin main

# Installation des dépendances
npm install

# Build
npm run build

# Redémarrage de l'application
pm2 restart sbexcandidature-app

echo "Déploiement terminé !"
