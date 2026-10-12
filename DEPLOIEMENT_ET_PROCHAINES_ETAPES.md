# Diego Intelligence 224 — publication et prochaines étapes

## Ce que contient cette version
- Interface mobile de Diego Intelligence 224.
- Création de maquettes à partir de modèles locaux.
- Aperçu du site généré et export ZIP.
- Serveur Node.js optionnel pour une future connexion à un fournisseur d’IA.
- Adresse de contact affichée : ibrahimadiegobaldes@gmail.com.

## Pour publier gratuitement une première version
1. Décompressez le ZIP sur un ordinateur ou importez les fichiers dans un dépôt Git.
2. Pour un hébergement statique, publiez le dossier `public/`.
3. Ouvrez le lien de test fourni par l’hébergeur sur votre Samsung.
4. Testez la génération locale, l’aperçu et le téléchargement ZIP.
5. Si tout fonctionne, vous pourrez connecter un nom de domaine personnalisé dans les paramètres de l’hébergeur.

Les services gratuits, limites et conditions peuvent changer. Vérifiez les conditions avant de vous inscrire.

## Domaine
`diegointelligence224.com` est une proposition, pas un domaine confirmé. Il faut vérifier sa disponibilité puis l’enregistrer. Ne communiquez jamais un mot de passe ni une clé API dans cette conversation.

## Pour activer une vraie génération IA
Le fichier `server.js` expose une route API prévue pour un fournisseur compatible. Hébergez le serveur Node.js séparément et configurez `AI_BASE_URL`, `AI_API_KEY` et `AI_MODEL` comme variables secrètes dans l’hébergeur. Une API peut être payante; contrôlez le prix et les limites. Le site statique seul ne fournit pas de véritable IA autonome.

## Avant une mise en production publique
Le prototype n’a pas encore de comptes utilisateurs, base de données, système de paiement, application Android compilée ni protection complète contre les abus. Il faut effectuer des tests et ajouter les protections adaptées avant de l’ouvrir largement au public.
