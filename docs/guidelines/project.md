# Projets de Programmation 2019-2020 - Master 1 Informatique

> Sujet : Réalisation d'un environnement d'exécution y86+HCL en Python ou en
> node.JS

Mots-clés :

- Architecture des processeurs
- Simulateur
- Assembleur
- Langage de description logique
- y86
- Python
- node.JS

## Résumé

Plusieurs environnements pédagogiques existent pour l'apprentissage des
fondamentaux de l'architecture des ordinateurs et des processeurs. L'un des
précurseurs, toujours très utilisé, est l'environnement « y86 » créé par les
professeurs R. :E. Bryant et D. R.  O'Hallaron, dans le cadre de leur cours
« Computer Systems: A Programmer's Perspective » de l'université Carnegie-Mellon
[1]. Le langage y86 est une version rudimentaire du langage x86 d'Intel, visant
à mettre en lumière les aspects pédagogiques essentiels d'une architecture CISC,
tout en occultant la complexité d'un processeur réel.

Cet environnement est constitué d'un ensemble d'outils permettant d'aborder la
programmation et la conception des processeurs :

- Un assembleur (compilateur), appelé **yas**, permettant de traduire un code
source écrit dans le langage d'assemblage y86 (.ys) en code objet en langage
machine y86 (.yo) ;
- Un simulateur, en mode texte et/ou graphique, permettant d'exécuter, en mode
pas à pas ou rapide, un code en langage machine y86. La version texte est
intéressante pour des questions d'accessibilité, et la version graphique est
basée sur les bibliothèques **Tcl/Tk** ;
- Un second compilateur, appelé **hcl2c**, permettant de traduire un code source
en langage HCL (une version rudimentaire du langage VHDL) décrivant le câblage
de certains composants du processeur, en code objet (en langage C) intégrable
dans une nouvelle version du simulateur, pour en modifier le comportement une
fois celui-ci recompilé par l'utilisateur. 

Les outils logiciels proposés, novateurs à l'époque, sont utilisés dans de
nombreux enseignements, comme par exemple à l'université de Bordeaux [2].
Cependant, ces outils sont maintenant en voie d'obsolescence. Plusieurs projets
récents offrent une partie des fonctionnalités décrites ci-dessus, mais pas
intégralement [3,4].

Le but de ce projet est de créer un clone intégralement fonctionnel de
l'environnement y86 originel, et disposant de fonctionnalités pédagogiques
avancées. Ce clone serait réalisé soit en Python, soit en node.JS. L'intérêt de
ce deuxième langage est qu'il pourrait être possible de reprendre une partie du
code existant d'un outil web [3], permettant à une version web de coexister avec
une version applicative autonome.

- [1] http://www.csapp.cs.cmu.edu/ 
- [2] http://dept-info.labri.fr/ENSEIGNEMENT/archi/supports.html 
- [3] http://dept-info.labri.fr/ENSEIGNEMENT/archi/js-y86/index.html 
- [4] https://github.com/linusyang/python-y86 

## Travail demandé

Le travail demandé aux étudiants comprend notamment les tâches suivantes :

- Étude de l'environnement y86 existant et de ses limites ;
- Étude des environnements clones existants [3,4] et de leur possibilité de
reprise et d'extension, dans leur langage propre ;
- Définition du cahier des charges de la nouvelle solution. Ce cahier des
charges proposera un maquettage de l'interface du simulateur, en mode graphique
mais également textuel (voir ci-dessous) ;
- Création des briques logicielles suivantes :
  - Un module d'assembleur yas, appelable soit en ligne de commande, soit en
  tant que module de bibliothèque, soit au sein de l'environnement graphique de
  travail. Ces dernières modalités d'appel ont pour but de bénéficier de sorties
  complémentaires au simple code .yo, et qui seront nécessaires à
  l'interactivité de l'interface (balisage des codes source et objet) ;
  - Un simulateur (environnement d'exécution), convivial, permettant de suivre
  en temps réel l'évolution de toutes les variables d'état du processeur suite à
  l'exécution d'une instruction. En particulier, on s'attendra à ce que les
  écritures mémoire soient mises en valeur, pour détecter les conflits entre
  zones de pile, de données et de code. Le niveau de détail lors de l'exécution
  d'une instruction pourra être paramétré. On pourra réfléchir à une interface
  en mode texte du simulateur, permettant à des étudiants non-voyants de
  l'utiliser ;
  - Un module compilateur de langage HCL, remplaçant hcl2c. Selon le langage de
  réalisation choisi, il devra générer des modules de code Python ou node.JS
  pouvant être intégrés nativement dans le simulateur, sans nécessiter d'actions
  importantes de la part de l'utilisateur. Cela suppose de réaliser une
  décomposition modulaire du simulateur de façon à ce que les parties
  susceptibles d'être générées par le compilateur puissent être facilement
  intégrées. Au démarrage, le simulateur pourra demander, en présence de
  plusieurs modules, lequel l'utilisateur souhaitera utiliser, si cela n'a pas
  été précisé en ligne de commande. 

L'ensemble des codes produits devra respecter les standards de documentation en
vigueur. Les commentaires seront en anglais. Des documentations d'utilisation et
de maintenance seront fournies. L'interface du logiciel devra être conçue pour
être multilingue.

De façon annexe, des améliorations pourront être apportées aux autres outils
utilisés en cours, tels que le simulateur JavaScript en ligne [3], qui est
également utile aux étudiants car ne nécessitant aucune installation.

## Matériels et logiciels nécessaires

Poste de travail disposant d'un environnement Python ou node.JS. Les
développements devront s'effectuer en premier lieu sous Linux, mais des tests
sous Windows et MacOS seront potentiellement utiles pour détecter des problèmes
de portabilité.

Tous les développements seront intégralement placés sous licence libre GPL v3,
dans un dépôt public (le GitLab d'Inria).

## Coordonnées du responsable

- Nom du responsable : François PELLEGRINI
- Adresse : Inria Bordeaux Sud-Ouest, bureau B.423
- Téléphone : Pas joignable par téléphone
- Courriel : francois.pellegrini@u-bordeaux.fr

