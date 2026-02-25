# Taram Immo - Plateforme Immobilière Fullstack

Ce projet est une application de gestion immobilière.

---

## Architecture du Projet

Le projet est organisé de manière modulaire pour séparer les responsabilités :
* **/frontend :** Application Next.js avec authentification et gestion de rôles.
* **/scripts :** Outil d'analyse de données en Python pour le reporting statistique.
* **/supabase** : Schémas SQL et politiques de sécurité (RLS).

```text
.
├── /frontend           # Application Next.js 16 (App Router)
│   ├── /app            # Routes (Accueil, Login, Dashboard)
│   └── /lib            # Configuration Supabase Client
├── /scripts            # Script Python d'analyse (stats.py)
└── /supabase           # Scripts SQL (Tables & Politiques RLS)

```

## Installation et Lancement
### Frontend (Next.js)
cd frontend
npm install
* **Créez un fichier .env.local avec :**
* **NEXT_PUBLIC_SUPABASE_URL=votre_url**
* **NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon**
npm run dev

### Statistiques (Python)
cd scripts
pip install python-dotenv psycopg2-binary
* **Créez un fichier .env avec :**
* **SUPABASE_DB_URL=votre_uri_postgresql**
python stats.py


# Raisonnement technique

## Pourquoi Supabase est-il adapté ici ?
Pour une application immobilière comme Taram Immo, Supabase est idéal car il offre :
* **Backend-as-a-Service :** Évite de gérer un serveur API complexe pour un MVP, tout en offrant une base PostgreSQL relationnelle robuste pour lier les profils aux propriétés.
* **Sécurité intégrée :** Le couple Auth/RLS permet de sécuriser l'accès aux données sensibles directement au niveau de la base, sans code middleware supplémentaire.

## Où placer la logique métier : frontend, RLS, scripts externes ?
Pour assurer la maintenabilité et la sécurité, j'ai réparti la logique selon le principe de responsabilité unique :
* **RLS (Sécurité critique) :** On y place les règles de visibilité et d'autorisation d'accès aux données (ex: is_published = true pour les clients). C'est le dernier rempart.
* **Frontend (UX & Navigation) :** On y gère le parcours utilisateur, le masquage des éléments d'interface selon le rôle (Agent/Client) et la gestion des états de session pour une expérience fluide.
* **Scripts externes (Analyse) :** On y déporte les traitements lourds ou périodiques (agrégations, calculs de moyennes) pour ne pas ralentir l'application utilisateur en temps réel.

## À quoi servirait Python dans un projet réel comme celui-ci ?
Dans un contexte de production réelle, Python agirait comme un moteur d'automatisation et d'intelligence :
* **Import/Export de données (ETL) :** Synchronisation automatique avec des portails immobiliers tiers pour maintenir les annonces à jour.
* **Reporting & Notifications :** Génération de rapports hebdomadaires de performance pour les agents ou envoi automatique d'alertes mail lorsque le prix d'un bien baisse.
* **Nettoyage de données :** Détection automatique d'anomalies ou de doublons dans les annonces saisies.

## Limites de cette architecture à grande échelle ?
* **Gestion des connexions :** Une montée en charge massive nécessiterait d'autres solutions pour gérer le grand nombre de connexions directes à PostgreSQL.
* **Maintenance de la logique :** Avoir la sécurité en SQL (RLS) et la logique applicative en TypeScript peut fragmenter le code. Sur un projet très vaste, une couche API intermédiaire pourrait être nécessaire pour centraliser les règles métier complexes.
* **Complexité du Frontend :** Si trop de logique métier est portée par le client, l'application peut devenir lourde à charger et difficile à déboguer.