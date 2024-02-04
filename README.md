# Public-dApp
SALON Tom, FOURNIEZ Théo, GILLOT Quentin

## Explication du Projet
Nous avons développé une application de crowdfunding décentralisée permettant aux utilisateurs majeurs (vérification d'identité) de faire financer leur projet en vendant des parts de leurs entreprises sous la forme de token.
L'application contient donc 2 principales fonctionnalités : 
- La création d'un projet ainsi que de son token
- La possibilité d'investir dans les projets d'autres créateurs via l'achat de token

## Répartion du travail
Nous avons réparti le travail en agissant chacun sur une des briques principales du projet (Frontend, Smart Contract et Serveur IA de reconnaissance de pièce d'identité)

### Front
Tom s'est occupé de la partie frontend en designant l'ensemble des maquettes au préalable. 
Il s'est ensuite occupé de construire l'ensemble de l'interface utilisateur et de faire le lien avec le smart contract en appelant les différentes fonctions permettant le fonctionnement de l'application : 
Connexion à l'application en appelant Metamask : 
![image](https://github.com/SalonTom/public-d-app/assets/119957865/13c840c4-8cec-4f26-9524-31af86458059)
Page de vérification d'identité :

Page de création de projet : 

Investissement sur un projet : 



### Smart Contract
Théo s'est occupé de l'ensemble de la conception des smart contracts : 
- ProjectToken : ce smart contract héritant d'ERC20 permet la création (au nombre de 100) et le mint de token spécifié par l'utilisateur lors de la création de son projet sur la plateforme.
- ProjectTokenFactory : il gère l'ensemble de la logique de l'application, ce smart contract est appelé pour la création de projet, la récupération de l'ensemble des projets et est également appelé par l'api pour whitelister les différents utilisateurs en fonction du retour de celle-ci.
- ProjectTokenMarket : il permet l'ajout de token sur le marché grâce au mécanisme d'allowance ainsi que le transfert de token de compte en compte grâce au mécanisme d'approval.

### Serveur IA de reconnaissance de pièce d'identité
Quentin s'est occupé de la conception du serveur python permettant la validation de majorité des utilisateurs:
- un endpoint REST est exposé sur le serveur qui reçoit une image en entrée
- l'image est passée dans une IA qui à travers plusieurs mécanismes (rotation, greyscale,...) récupère l'ensemble du texte reconnu sur l'image
- un ensemble de règles (regex) sont définies pour récupèrer uniquement les données qui nous intéressent ici à savoir la date de naissance et le numéro de carte d'identité
- le serveur agit en tâche de fond grâce à la parallélisation de threads permettant à plusieurs utilisateurs d'appeler le endpoint à la fois et sans bloquer l'action de l'utilisateur sur le frontend.
- la carte d'identité est entièrement supprimée par le serveur après le traitement de l'IA

