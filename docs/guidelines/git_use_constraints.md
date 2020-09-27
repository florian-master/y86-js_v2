# À propos de l'utilisation de git en PdP

## Règle 1: Dépôt git Savanne du CREMI

Chaque groupe de projet doit créer un dépôt git sur le serveur Savanne du CREMI.
Le nom du projet doit être clair et proche du nom du projet qui apparaît sur le
site PdP (par ex. ne pas utiliser d'acronymes). Le lien du dépôt sera envoyé au
chargé de TD et au client.

## Règle 2: Identifiants Git

Chacun des membres d'un groupe de projet n'utilisera que son identifiant
d'étudiant en "@etu.u-bordeaux.fr" pour committer (les pseudonymes sont
proscrits).

## Règle 3: Structure du dépôt git des projets

Les dépots git devront nécessairement avoir l'arborescence suivante :

```
.
|
+- organiz/
   |
   +- meeting_reports/  # Compte-rendus des TD
|     |
|     +- 20_01_26-meeting.txt # TD du 26 janvier 2020
      +- ...
|  +- backlog_tasks   # Fichiers avec tâches à faire et en réalisation
|  +- architecture/   # Description/diagrammes du projet.
|
+- docs/  # Documents à produire pendant le PdP
|  |
|  +- requirements /  # Analyse des besoins et des contraintes
|  +- report/         # Mémoire 
|  +- slides/
      |
      +- audit/      # slides de l'audit de mi-parcours
      +- defense/    # slides de la soutenance 
|
+- data/ # Contient les données du projet
|
+- src/ # Contient les fichiers sources du projet
```

**N.B.:** au moment de la création du dépôt, pour définir un répertoire vide, on
y mettra (par convention) un fichier vide nommé '.gitkeep', car sinon git
refusera de le prendre en compte.

## Règle 4: Contributions obligatoires

Au cours du semestre, chacun des membres d'un groupe de projet doit commiter sur
le dépôt une part suffisamment importante de code, de données, de modifications
consistantes. Si la contribution globale d'un des membres est jugée trop peu
importante, sa note de projet sera révisée à la baisse.

À ce titre, l'historique git fait également partie des éléments qui font partie
du rendu global d'un projet.

## Règle 5: Workflow git

Au minimum, l'état du projet doit être mergé dans la branche 'master' puis
poussé sur le dépôt Savanne du CREMI avant chaque TD et pour chaque rendu. Les
travaux qui se trouvent dans d'autres branches que 'master' ne seront considérés
que si cela est notifié au chargé de TD et discuté avec lui au préalable.

## Règle 6: Cohérence du dépôt git

Ne jamais inclure dans un dépôt git des fichiers qui peuvent être générés à
partir des autres. Par exemple, on n'y inclura aucun code objet issu d'une
compilation du code source inclus dans le dépôt, ou d'un .pdf issu d'un fichier
latex.

## Règle 7: Ajout de contributions extérieures

Tout code extérieur au projet ou données qui n'ont pas été produits au cours du
projet doivent être commités séparemment et tels quels AVANT TOUTE AUTRE
MODIFICATION. Le commentaire du commit devra décrire clairement l'origine de ce
code ou de ces données.

## Règle 8: Comptes-rendus de TD

À l'issue de chaque TD, les groupes de projet devront rédiger un compte-rendu
dans un fichier .txt qui explicite les éléments importants (questions,
problèmes, tâches, tests, etc.) qui y ont été discutées avec le chargé de TD. Le
nom de chaque fichier sera du type "20_01_16-meeting.txt" pour le compte-rendu
du 16 janvier 2020, et sera déposé dans le répertoire organiz/meeting_reports/ 
u dépôt git.

