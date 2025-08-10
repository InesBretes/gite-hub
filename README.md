Gîte Hub - Administration des Réservations
Application web d'administration pour la gestion des réservations du gîte en Nouvelle-Calédonie.

🏝️ Contexte Métier
3 chambres disponibles
Capacité : 2 personnes + 1 enfant par chambre
Fermeture : Tous les lundis
Tarifs :
Semaine : 5 000 XPF/nuit
Week-end : 7 000 XPF/nuit
Option lit parapluie : +1 000 XPF/séjour
🚀 Lancement de l'Application
Prérequis
Docker et Docker Compose installés
Démarrage avec Docker Compose
bash
# Cloner le projet
git clone <repository-url>
cd gite-hub

# Lancer l'application
docker-compose up --build

# L'application sera accessible sur http://localhost:3000
Développement local (optionnel)
bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm start

📁 Structure du Projet
src/
├── components/          # Composants React
│   ├── Dashboard/      # Tableau de bord
│   ├── Reservations/   # Gestion des réservations
│   ├── Calendar/       # Vue calendrier
│   └── Layout/         # Mise en page
├── contexts/           # Contextes React
└── __tests__/          # Tests unitaires
💰 Calcul des Tarifs
Le système calcule automatiquement les tarifs selon :

Type de jour (semaine/week-end)
Durée du séjour
Options supplémentaires (lit parapluie)
Exclusion des lundis (gîte fermé)
🔒 Contraintes Métier
Aucune réservation le lundi
Maximum 3 personnes par chambre (2 adultes + 1 enfant)
Vérification des conflits de réservation
Calcul des prix en temps réel
