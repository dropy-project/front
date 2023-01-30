# Dropy Front

## Setup & Lancement développement

> Requirements :
> - node >= 16
> - unix
> - xcode (IOS) ou android studio
>    - (Utilisateur Mac) Installer watchman: `brew update && brew install watchman`
> - Ne pas avoir nvm d'installé

Intaller dépendances : `npm i`

Installer husky : `npx husky install`

IOS :
- `sudo xcode-select --switch /Applications/Xcode.app`
- `cd ios && pos install`
- `npm run ios`

ANDROID :
- `cd android && ./gradlew clean`
- `npm run android`

Creer un fichier .env

## Env

> .env à la racine du projet

```
SECRET_ENCRYPTION_KEY=<secret_encryption_key>

DEV_ACCOUNT_USERNAME=<username>
DEV_ACCOUNT_EMAIL=<email>
DEV_ACCOUNT_PASSWORD=<password>
```

> Rebuilb l'app pour que les changements prennent effet

## Utiliser l'application avec un serveur custom (Custom Urls)
- Lancer l'app et se rendre dans les reglages
- Activer le mode developpeur en restant appuyer sur le numero de version en bas des reglages
- Rentrer les url d'API et de Socket
    - api : `http://<ip-locale-ordi>:<port-api>`
    - socket: `http://<ip-locale-socket>:<port-socket>`


## Release Checklist

0. `npm i` & `pod install` (IOS)

1. Changer numéro de version dans app.json
    - app version
    - required server version

2. Changer numéro de version dans xcode (IOS)
    - Changer numéro marketing (x.x.x)
        - Si xcode pas disponible -> ouvrir le fichier `project.pbxproj` et modifier `MARKETING_VERSION` (2 occurrences)
    - Changer build number (x)
        - Si xcode pas disponible -> ouvrir le fichier `project.pbxproj` et modifier `CURRENT_PROJECT_VERSION` (2 occurrences)

3. Changer numéro de version android `/app/build.gradle` :
    - Incrémenter versionCode
    - Changer versionName

4. Mettre productionMode sur **true** dans app.json :
    - `true` : serveur de production
    - `false` : serveur de pré-production / développement

## Release ANDROID

> Il est nécéssaire d'avoir le fichier release.keystore disponible sur discord (il est en gitignore)

### APK (Build rapide)

`npm run apk-android`

L'apk est dans `android/app/build/outputs/apk/release`

Pour rendre l'apk disponible en téléchargemnt depuis le site de dropy :

1. Upload le .apk sur le serveur (sftp ou autre)
2. placer le .apk dans www/html/nom_build.apk
3. la build est téléchargeable à l'adresse https://dropy-app.com/nom_build.apk

### Bundle (Pour le store)

`npm run bundle-android`

Le bundle est dans `android/app/build/outputs/bundle/release`

## Release IOS

Depuis xcode:

1. Passer en `release`
2. Selectionner un build-only-device
3. Product > Archive
4. Upload l'archive sur l'app store
5. Attendre que la build soit process
6. Ajouter une attestation -> chiffrement = oui car protocol https dans l'app
7. Ajouter la build au groupe de test
8. Lancer une review TestFlight
