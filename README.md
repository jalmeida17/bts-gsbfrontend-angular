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
- **Angular Forms** - Gestion des formulaires*
- **Chart.js** - Création de stats

## Fonctionnalités Principales
- 🔐 **Authentification et autorisation**
- 👤 **Gestion des profils utilisateurs**
- 🌐 **Support multilingue (Pour la prochaine version)**
- 📱 **Marche bien sur téléphone**
- 🎨 **Mode sombre et clair avec variables CSS**
- 📊 **Tableaux de bord interactifs avec des statistiques**
- 📋 **Gestion des formulaires**

## Structure du Projet
```
bts-gsbfrontend-angular/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── editBill/
│   │   │   ├── newBill/
│   │   │   └── viewBill/
│   │   ├── layout/
│   │   │   ├── component/
│   │   │   │   ├── app.topbar.ts
│   │   │   │   ├── app.menu.ts
│   │   │   │   ├── app.sidebar.ts
│   │   │   │   └── ...
│   │   │   └── service/
│   │   │       └── layout.service.ts
│   │   ├── pages/
│   │   │   ├── admin-dashboard/
│   │   │   ├── admin-stats/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   └── notfound/
│   │   └── transloco/
│   ├── assets/
│   │   ├── gsb_dark.png
│   │   ├── gsb_light.png
│   │   ├── i18n/
│   │   └── layout/
│   ├── guards/
│   │   ├── admin.guard.ts
│   │   └── auth.guard.ts
│   ├── interceptors/
│   │   └── auth.interceptor.ts
│   ├── models/
│   │   ├── bill.model.ts
│   │   └── user.model.ts
│   └── services/
│       ├── auth.service.ts
│       ├── bill.service.ts
│       └── user.service.ts
├── angular.json
├── package.json
└── tailwind.config.js
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
