This project is an attempt to redesign, as a web application, the HCL features of the traditional y86 pedagogical computer architecture teaching environment.

# Context

The original y86 environment is a Tcl/Tk-based pedagogical tool created by Randal E. BRYANT et David R. O'HALLARON in the context of their course [Computer Systems: A Programmer's Perspective](http://csapp.cs.cmu.edu/).

Because of its simplicity and pedagogical efficiency, this tool has been widely adopted worldwide by the computer architecture teaching community. Yet, as its underlying technologies and design began to obsolete, several me-too's have been created using, notably, web technologies.

At Université de Bordeaux, we indeed used a web-based version of the tool for y86 programming and execution, but still relied on the original version of the tool for HCL programming and processor design. For the sake of simplicity and in order to provide students with a consistent and integrated framework for processor design and machine code execution, we decided to launch a project to create a web-based version of the HCL part as well.

The specifications of the new tool have been provided to a team of four students of the _Projet de Programmation_ informatics Master 1 course at Université de Bordeaux. The version initially presented here is the result of their work. Further contributions are welcome!

# Credits

## The original Master 1 student team

- Alexis BANDET
- Valentin GAISSET
- Romain GUISSET
- Florian SIMBA

Supervised by:

- [Aurélien ESNARD](https://github.com/orel33)
- [François PELLEGRINI](https://www.labri.fr/index.php?n=Annuaires.Profile&id=Pellegrini_ID1084917767)
- Francieli ZANON BOITO

## Sources of code and inspiration

- [js-y86](https://github.com/xsznix/js-y86), by Victor AGUILAR and Xuming ZENG  
  [See it in action](https://xsznix.github.io/js-y86/)
