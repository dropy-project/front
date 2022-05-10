## Setup projet :

### MacOS

- Installer nvm (node version manager) : `brew install nvm`
  
  - `nvm install --lts` Pour installer un version "long term support" de node
  - `nvm alias default system` Pour dire que la version par défaut de nvm est celle sur le système

- Installer Xcode depuis l'app store

- Clone le projet

- Intaller les dépendances : `npm i`

- Installer les dépendances cocoapods (IOS) : `cd ios && pod install`

- Lancer xcode et ouvrir le **dossier ios** qui se trouve dans le projet.

- Cliquer sur le projet : 
  
  - ![](./assets/readmeIcons/2022-05-08-15-49-46-image.png)

- Aller dans "Signing & Capabilities"
  
  - Choisir une Team (Compte Apple)
  
  - ![](./assets/readmeIcons/2022-05-08-15-50-30-image.png)

- Sélectionner un simulateur 
  
  - ![](./assets/readmeIcons/2022-05-08-15-51-05-image.png)

- Lancer une build
  
  - ![](./assets/readmeIcons/2022-05-08-15-51-24-image.png)
