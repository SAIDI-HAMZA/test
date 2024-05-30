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
* **Réponse:**
```json
{
  "audio": "base64encodedAudioData",
  "statusCode": 200,
  "statusMessage": "Success"
}
```
* **Exemple de réponse:**
```
{
  "audio": "SGVsbG8sIG1vbmRlICEgSW50ZXJtZWN0aW9uIG9mIHRoZSBBUEkgSG9zcGVlY2ggdG8gYmUgY29udmVydGVkIGludG8gYW51ZGlvLg==",
  "statusCode": 200,
  "statusMessage": "Success"
}
```

**2. AudioToText**

* **Description:** Convertit un fichier audio téléchargé en texte.
* **Méthode:** POST
* **URL:** [http://ec2-34-246-205-93.eu-west-1.compute.amazonaws.com:8080/translations/Streaming](http://ec2-34-246-205-93.eu-west-1.compute.amazonaws.com:8080/translations/Streaming)
* **En-têtes de requête:**
    * Content-Type: application/octet-stream
* **Corps de la requête (formulaire-données):**
    * `originalLanguage` (obligatoire): Le code de langue du fichier audio source. (par exemple, fr-FR pour le français)
    * `targetLanguage` (obligatoire): Le code de langue cible pour le texte converti. (par exemple, en-EN pour l'anglais)
    * `file` (obligatoire): Le fichier audio à convertir (chemin d'accès au fichier sur le système effectuant la requête). Le fichier audio doit être au format .wav et avoir une résolution de 16 bits.
* **Exemple de requête:**
```
En-têtes:
Content-Type: application/octet-stream

Corps de la requête (formulaire-données):
originalLanguage: fr-FR
targetLanguage: en-EN
file: /chemin/vers/votre/fichier/audio.wav
```
* **Exemple de réponse:**
```
{
  "text": "Hello, world! I am an example of audio to convert to text.",
  "statusCode": 200,
  "statusMessage": "Success"
}
```
