# Dropy Front

## Setup & Lancement développement

> Requirements :
> - node >= 16
> - unix
> - xcode (IOS) ou android studio

Intaller dépendances : `npm i`

IOS :
- `cd ios && pos install`
- `npm run ios`

ANDROID :
- `cd android && ./gradlew clean`
- `npm run android`

## Release Checklist

0. `npm i` & `pod install` (IOS)

1. Changer numéro de version dans app.json
    - app version
    - required server version

2. Changer numéro de version dans xcode (IOS)
    - Si xcode pas disponible -> ouvrir le fichier `project.pbxproj` et modifier `MARKETING_VERSION` (2 occurrences)

3. Changer numéro de version android `/app/build.gradle` :
    - Incrémenter versionCode
    - Changer versionName

4. Vérifier les urls custom de serveur dans app.json (Doit être sur `null`)

5. Mettre productionMode sur **true** dans app.json :
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

## Env

> .env à la racine du projet

```
SECRET_ENCRYPTION_KEY=<secret_encryption_key>
```