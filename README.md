# Diego Intelligence 224 — prototype web version 2.1

**Fondateur et créateur :** BALDE IBRAHIMA DIEGO  
**Contact officiel :** ibrahimadiegobaldes@gmail.com  
**Adresse web souhaitée :** diegointelligence224.com (à vérifier et enregistrer séparément)  
**Devise :** « L’intelligence au service de l’humanité. »

Cette version améliore le prototype initial : interface mobile, plusieurs types de projets, aperçu isolé, export ZIP dans le navigateur, mode local, serveur Node.js optionnel et branchement possible sur une API compatible Chat Completions.

## 1. Tester sur un ordinateur

1. Installe Node.js 18 ou plus récent.
2. Ouvre un terminal dans ce dossier.
3. Exécute `npm install`, puis `npm start`.
4. Ouvre `http://localhost:3000`.

## 2. Tester sur un Samsung sans installer Node.js

Le moyen le plus simple est d'ouvrir `public/index.html` depuis un hébergement web statique ou de lancer le serveur sur un ordinateur. Le mode local utilise JavaScript côté navigateur. Certaines fonctions PWA et le service worker ne sont disponibles que via HTTP/HTTPS, pas avec un fichier ouvert directement.

## 3. Activer le mode IA

Le mode IA est optionnel. Il nécessite un fournisseur d'API compatible avec `/chat/completions`, un modèle et une clé. Configure les variables d'environnement sur un serveur privé :
- `AI_BASE_URL`
- `AI_API_KEY`
- `AI_MODEL`

Copie `.env.example` comme guide, mais le projet ne charge pas automatiquement le fichier `.env`. Sur un hébergeur, ajoute les variables dans son panneau de configuration. En local, définis-les dans l'environnement avant `npm start`, ou installe et configure un chargeur dotenv si tu sais le faire.

**Les API peuvent coûter de l'argent.** Vérifie le prix, les limites et les conditions du fournisseur avant d'activer le mode IA. Ne publie jamais la clé dans le dossier `public`.

## 4. Limites honnêtes

- Le mode local produit des maquettes, pas des applications complètes.
- Le mode IA génère un petit ensemble de fichiers web; le code doit être relu et testé.
- Pas de comptes, base de données, paiement, déploiement automatique ou APK Android.
- Aucun service ne peut garantir une IA entièrement gratuite et illimitée.
- Le code généré peut être incorrect ou dangereux : ne le publie pas sans examen.

## 5. Suite du développement

1. Déposer le code dans un dépôt Git privé et faire une sauvegarde.
2. Tester l'interface et l'export ZIP.
3. Choisir un hébergement adapté.
4. Décider d'un fournisseur IA après avoir comparé les coûts et les limites gratuites.
5. Ajouter des tests automatiques, une authentification et une base de données seulement quand le besoin est clair.
6. Préparer une vraie application Android avec une chaîne de compilation distincte.

## Sécurité

Le serveur ajoute des en-têtes de base et limite la taille des requêtes, mais ce prototype n'est pas prêt pour une exposition publique à grande échelle. Avant un lancement public, ajouter notamment limitation de débit, protection contre les abus, journaux prudents, tests de sécurité, contrôle de coûts et politique de confidentialité.


## Publication simple (version statique)

Le dossier `public/` contient le site web qui peut être hébergé sur un service statique. Déposez le contenu de ce dossier sur un hébergeur statique compatible, ou importez le projet dans un dépôt Git puis configurez le dossier de publication sur `public`. Testez l'interface et l'export ZIP après publication.

**Limites importantes :** cette publication statique permet d'utiliser les modèles locaux du navigateur, mais elle ne lance pas `server.js`. La génération par IA nécessite un serveur Node.js hébergé séparément et une clé API enregistrée dans les variables secrètes du serveur. Ne mettez jamais une clé API dans `public/`.

Le nom de domaine `diegointelligence224.com` est seulement une adresse souhaitée : sa disponibilité n'a pas été vérifiée et il faudra l'enregistrer auprès d'un registraire si elle est disponible. L'adresse e-mail de contact est `ibrahimadiegobaldes@gmail.com`.
