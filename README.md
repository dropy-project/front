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

1. Changer numéro de version dans app.json
    - app version
    - required server version

2. Changer numéro de version dans xcode (IOS)

3. Changer numéro de version android `/app/build.gradle` :
    - Incrémenter versionCode
    - Changer versionName

4. Vérifier les urls custom de serveur dans app.json (Doit être sur `null`)

5. Mettre productionMode sur **true** dans app.json :
    - `true` : serveur de prodcution
    - `false` : serveur de pré-production / développement

## Release ANDROID

## Release IOS

## Env

> .env à la racine du projet

```
SECRET_ENCRYPTION_KEY=<secret_encryption_key>
```