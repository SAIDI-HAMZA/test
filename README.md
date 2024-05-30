## Documentation de l'API Hospeech

**Introduction**

Ce document fournit une description des fonctionnalités de l'API Hospeech, accompagnée d'exemples d'utilisation.

**Présentation de l'API Hospeech**

Hospeech est une API qui permet de convertir du texte en parole et de la parole en texte. Elle offre des fonctionnalités pour générer des fichiers audio à partir de texte et pour transcrire des fichiers audio en texte.

**Fonctionnalités clés**

* **Texte-parole (TextToAudio):** Convertit du texte en audio dans une langue cible.
* **Parole-texte (AudioToText):** Transcrit un fichier audio en texte dans une langue cible.

**Points d'accès**

L'API Hospeech propose deux points d'accès principaux:

**1. TextToAudio**

* **Description:** Convertit une chaîne de texte fournie en format audio.
* **Méthode:** POST
* **URL:** [http://ec2-34-246-205-93.eu-west-1.compute.amazonaws.com:8080/translations/TextToAudio](http://ec2-34-246-205-93.eu-west-1.compute.amazonaws.com:8080/translations/TextToAudio)
* **Corps de la requête (JSON):**
    * `text` (obligatoire): La chaîne de texte à convertir en audio.
    * `targetLanguage` (obligatoire): Le code de langue cible pour l'audio généré. (par exemple, fr-FR pour le français)
* **Exemple de requête:**
```json
{
  "text": "Bonjour, monde ! Je suis un exemple de texte à convertir en audio.",
  "targetLanguage": "fr-FR"
}
```
* **Réponse:** (Détails manquants dans la collection Postman fournie)
* **Exemple de réponse:** (Détails manquants dans la collection Postman fournie)

**2. AudioToText**

* **Description:** Convertit un fichier audio téléchargé en texte.
* **Méthode:** POST
* **URL:** [http://ec2-34-246-205-93.eu-west-1.compute.amazonaws.com:8080/translations/Streaming](http://ec2-34-246-205-93.eu-west-1.compute.amazonaws.com:8080/translations/Streaming)
* **En-têtes de requête:**
    * Content-Type: application/octet-stream (**Désactivé dans la collection fournie**)
* **Corps de la requête (formulaire-données):**
    * `originalLanguage` (obligatoire): Le code de langue du fichier audio source. (par exemple, fr-FR pour le français)
    * `targetLanguage` (obligatoire): Le code de langue cible pour le texte converti. (par exemple, en-EN pour l'anglais)
    * `file` (obligatoire): Le fichier audio à convertir (chemin d'accès au fichier sur le système effectuant la requête).
* **Exemple de requête:**
```
En-têtes:
Content-Type: application/octet-stream

Corps de la requête (formulaire-données):
originalLanguage: fr-FR
targetLanguage: en-EN
file: /chemin/vers/votre/fichier/audio.wav
```
* **Réponse:** (Détails manquants dans la collection Postman fournie)
* **Exemple de réponse:** (Détails manquants dans la collection Postman fournie)

**Remarques**

* La documentation pour les payloads de requête et de réponse est limitée en raison d'informations manquantes dans la collection Postman fournie.
* Envisagez d'ajouter des détails tels que les codes de statut de réponse attendus, les mécanismes de gestion des erreurs et les modèles de données (schémas) pour les corps de requête et de réponse.
* N'oubliez pas de tester soigneusement l'API avant de l'utiliser en production.

**N'hésitez pas à me contacter si vous avez des questions ou si vous souhaitez des précisions supplémentaires.**
