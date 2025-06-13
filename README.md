# GSB Frontend - Angular Application

## Description
Application frontend développée en Angular pour le système de gestion GSB pour le concours de BTS. Cette application fournit une interface utilisateur moderne et responsive pour la gestion des rapports de frais, l'authentification des utilisateurs et l'administration du système.

## Technologies Utilisées
- **Angular** (version récente)
- **TypeScript**
- **PrimeNG** - Composants UI
- **SCSS** - Styles personnalisés
- **RxJS** - Gestion des observables
- **Angular Router** - Navigation
- **Angular Forms** - Gestion des formulaires

## Fonctionnalités Principales
- 🔐 **Authentification et autorisation**
- 👤 **Gestion des profils utilisateurs**
- 🌐 **Support multilingue**
- 📱 **Interface responsive**
- 🎨 **Mode sombre et clair avec variables CSS**
- 📊 **Tableaux de bord interactifs**
- 📋 **Gestion des formulaires**

## Structure du Projet
```
src/
├── app/
│   ├── layout/
│   │   └── component/
│   │       ├── app.topbar.scss
│   │       └── ...
│   ├── core/
│   ├── shared/
│   ├── features/
│   └── assets/
├── environments/
└── styles/
```

## Installation et Configuration

### Prérequis
- Node.js (version 16+)
- npm ou yarn
- Angular CLI

### Installation
```bash
# Cloner le repository
git clone [repository-url]
cd bts-gsbfrontend-angular

# Installer les dépendances
npm install

# Ou avec yarn
yarn install
```

## Scripts Disponibles

```bash
# Démarrer en mode développement
npm run start
# ou
ng serve

# Build pour la production
npm run build
# ou
ng build --prod

# Lancer les tests
npm run test
# ou
ng test

# Lancer les tests e2e
npm run e2e
# ou
ng e2e

# Linter le code
npm run lint
# ou
ng lint
```

## Configuration du Développement

### Serveur de Développement
```bash
ng serve
```
L'application sera disponible sur `http://localhost:4200/`

### Build de Production
```bash
ng build --prod
```
Les fichiers de build seront générés dans le dossier `dist/`

## Mode sombre et Styles
- Support des modes clair/sombre
- Composants PrimeNG personnalisés
- Styles SCSS modulaires

## Support
Pour toute question ou problème, me contacter.
