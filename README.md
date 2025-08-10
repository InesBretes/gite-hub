Gîte Hub - Administration des Réservations <br>
Application web d'administration pour la gestion des réservations du gîte en Nouvelle-Calédonie.<br>

🏝️ Contexte Métier<br>
3 chambres disponibles<br>
Capacité : 2 personnes + 1 enfant par chambre<br>
Fermeture : Tous les lundis<br>
Tarifs :<br>
Semaine : 5 000 XPF/nuit<br>
Week-end : 7 000 XPF/nuit<br>
Option lit parapluie : +1 000 XPF/séjour<br>
🚀 Lancement de l'Application<br>
Prérequis<br>
Docker et Docker Compose installés<br>
Démarrage avec Docker Compose<br>
bash<br>
# Cloner le projet<br>
git clone <repository-url><br>
cd gite-hub<br>

# Lancer l'application<br>
docker-compose up --build<br>

# L'application sera accessible sur http://localhost:3000<br>
Développement local (optionnel)<br>
bash<br>
# Installer les dépendances<br>
npm install<br>

# Lancer en mode développement<br>
npm start<br>

📁 Structure du Projet<br>
src/<br>
├── components/          # Composants React<br>
│   ├── Dashboard/      # Tableau de bord<br>
│   ├── Reservations/   # Gestion des réservations<br>
│   ├── Calendar/       # Vue calendrier<br>
│   └── Layout/         # Mise en page<br>
├── contexts/           # Contextes React<br>
└── __tests__/          # Tests unitaires<br>
💰 Calcul des Tarifs<br>
Le système calcule automatiquement les tarifs selon :<br>

Type de jour (semaine/week-end)<br>
Durée du séjour<br>
Options supplémentaires (lit parapluie)<br>
Exclusion des lundis (gîte fermé)<br>
🔒 Contraintes Métier<br>
Aucune réservation le lundi<br>
Maximum 3 personnes par chambre (2 adultes + 1 enfant)<br>
Vérification des conflits de réservation<br>
Calcul des prix en temps réel<br>
