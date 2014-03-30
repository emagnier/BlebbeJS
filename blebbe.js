//	BlebbeJS - 2014
//  MIT License - Copyright (c) 2014 P-E Magnier
//	https://github.com/PEMagnier/Blebbe

function blebbe(id_element, tailleminimumdestuiles, taillemaximaldestuiles, repartition_formes) { // repartition_formes : petit, moyen, gros
    var matrice = (function () {
        var matrix = [
            []
        ];
        return function (base) {
            if(base) {
                matrix = base;
                ajouter_div();
            }
            return matrix;
        };
    })();

    var quantite_forme = (function () {
        var quantite = [0, 0, 0]; // petits carrés, moyens et grands.
        return function (quantity) {
            if(quantity) {
                quantite = quantity;
            }
            return quantite;
        };
    })();

    function ajouter_ligne_vierge_matrice() {
        var matrix = matrice(),
            nouvelle_ligne = new Array(matrix[0].length);
        matrix.push(nouvelle_ligne);
        matrice(matrix);
    }

    function aleatoire() {
        var total = 0;
        for(var i = 0; i < 3; i++) {
            total += repartition_formes[i];
        }
        var nb_aleatoire = 1 + Math.floor(Math.random() * total);
        return nb_aleatoire > repartition_formes[0]; // true = 2 carrés, 1 carré sinon.
    }

    function gros() {
        var quantite = quantite_forme();
        return quantite[1] / repartition_formes[1] > quantite[2] / repartition_formes[2]; // true = ajouter un gros
    }

    // s'occupe de numéroter les tuiles :
    var donner_numero_div = (function () {
        var numero = 0;
        return function (att) {
            if(!att) {
                numero++;
                if(typeof att == 'number') {
                    numero = att;
                }
            }
            return numero;
        };
    })();

    // "replacer" est la fonction qui s'éxécute lorsque l'on redimenssionne la fenêtre
    var is_replacer_executing = (function () {
        var executing = false;
        return function (execute) {
            if(typeof execute != 'undefined') {
                executing = execute;
            }
            return executing;
        };
    })();

    // si la fonction ecrire_matrice est en train de s'éxécuter :
    var is_executing = (function () {
        var executing = false;
        return function (execute) {
            if(typeof execute != 'undefined') {
                executing = execute;
            }
            return executing;
        };
    })();

    // le moodboard est basé sur une matrice généré par la fonction suivante :
    function ecrire_matrice(replace) {
        var matrix = matrice(),
            proprietes = properties(),
            val1 = proprietes[1],
            val2 = proprietes[2],
            somme = val1 + val2,
            nb_ligne = matrix.length,
            nb_colonne = matrix[0].length;
        is_executing(true);
        var avant_derniere_ligne = nb_ligne - 2,
            derniere_ligne = nb_ligne - 1;

        function remplir_matrice() {
            var tampon_ligne = matrix[avant_derniere_ligne],
                tampon_valeur, nb_aleatoire;
            for(var b = 0; b < nb_colonne; b++) {
                tampon_valeur = tampon_ligne[b];
                if(typeof tampon_valeur == 'undefined') {
                    if(b < nb_colonne - 1) {
                        if(typeof tampon_ligne[b + 1] == 'undefined') {
                            nb_aleatoire = aleatoire();
                            if(nb_aleatoire) {
                                tampon_ligne[b] = -2; // -2 est utilisé pour signifier une tuile de largeur 2 (les moyennes et les grosses), -1 est utilisé pour les petites
                                tampon_ligne[b + 1] = -2;
                            } else {
                                tampon_ligne[b] = -1;
                            }
                        } else {
                            tampon_ligne[b] = -1;
                        }
                    } else {
                        tampon_ligne[b] = -1;
                    }
                }
            }
            var numero_a_ajouter, taille;
            for(var c = 0; c < nb_colonne; c++) {
                if(tampon_ligne[c] == -1) {
                    numero_a_ajouter = donner_numero_div();
                    matrix[avant_derniere_ligne][c] = numero_a_ajouter;
                    var quantite = quantite_forme();
                    quantite[0]++;
                    quantite_forme(quantite);
                } else {
                    if(tampon_ligne[c] == -2) {
                        var quantiteForme;
                        taille = gros();
                        numero_a_ajouter = donner_numero_div();
                        matrix[avant_derniere_ligne][c] = numero_a_ajouter;
                        matrix[avant_derniere_ligne][c + 1] = numero_a_ajouter;
                        if(taille) {
                            matrix[derniere_ligne][c] = numero_a_ajouter;
                            matrix[derniere_ligne][c + 1] = numero_a_ajouter;
                            quantiteForme = quantite_forme();
                            quantiteForme[2]++;
                            quantite_forme(quantiteForme);
                        } else {
                            quantiteForme = quantite_forme();
                            quantiteForme[1]++;
                            quantite_forme(quantiteForme);
                        }
                    }
                }
            }
            if(replace) {
                if(replace > donner_numero_div(true)) {
                    assez_de_lignes();
                }
            }
            matrice(matrix);
            is_executing(false);
        }

        function assez_de_lignes() // permet de rajouter des lignes vierges en cas de manque
        {
            if(nb_ligne < 2) {
                ajouter_ligne_vierge_matrice();
                nb_ligne++;
                avant_derniere_ligne++;
                derniere_ligne++;
                assez_de_lignes();
            } else {
                var ajouterligne = true,
                    tampon;
                for(var a = 0; a < nb_colonne; a++) {
                    tampon = matrix[avant_derniere_ligne][a];
                    if(typeof tampon == 'undefined') {
                        ajouterligne = false;
                    }
                }
                if(ajouterligne) {
                    ajouter_ligne_vierge_matrice();
                    nb_ligne++;
                    avant_derniere_ligne++;
                    derniere_ligne++;
                    assez_de_lignes();
                } else {
                    remplir_matrice();
                }
            }
        }
        if(somme > ((nb_ligne - 2) * (proprietes[0] / nb_colonne))) {
            assez_de_lignes();
        } else {
            is_executing(false);
        }
    }

    function lancer_ecrire_matrice() // le passage par cette fonction intermédiaire permet d'éviter à "ecrire_matrice" d'être éxécuté plusieurs fois en même temps
    {
        var executing = is_executing();
        if(executing) {
            setTimeout(function () {
                lancer_ecrire_matrice();
            }, 100);
        } else {
            ecrire_matrice();
        }
    }

    var largeur_moodboard = (function () {
        var moodboard = document.getElementById(id_element),
            largeur = parseInt(getComputedStyle(moodboard, null).width.replace(/px/, ''));
        return function (l) {
            if(l) {
                largeur = l;
            }
            return largeur;
        };
    })();

    var hauteur_moodboard = (function () {
        var moodboard = document.getElementById(id_element),
            hauteur = parseInt(getComputedStyle(moodboard, null).height.replace(/px/, ''));
        return function (h) {
            if(h) {
                hauteur = h;
            }
            return hauteur;
        };
    })();

    function properties() {
        var moodboard = document.getElementById("BlebbeJS"),
            proprietes = [];
        proprietes[0] = largeur_moodboard();
        proprietes[1] = hauteur_moodboard();
        proprietes[2] = moodboard.scrollTop || moodboard.scrollY || $("#BlebbleJS").scrollTop();
        return proprietes; // tableau contenant 3 entrées :
        //  1. la largeur du moodboard
        //  2. la hauteur du moodboard
        //  3. la position du scroll
    }

    var deja_apparu = (function () { // concerne les tuiles déjà visibles
        var apparu = [0];
        return function (nouveau) {
            if(nouveau) {
                apparu = nouveau;
            }
            return apparu;
        };
    })();

    function faire_apparaitre() {
        function animer() // apparition des tuiles (fondu et déplacement vers le haut)
        {
            $("#" + id).animate({
                top: hauteur,
                opacity: 1
            }, 400, "easeOutQuart", function () {});
        }
        var nombre_div = donner_numero_div(true),
            visible = deja_apparu(),
            nb_visible = visible.length,
            non_apparu = [],
            present;
        for(var d = 1; d <= nombre_div; d++) {
            present = false;
            for(var e = 0; e < nb_visible; e++) {
                if(d == visible[e]) {
                    present = true;
                }
            }
            if(!present) {
                non_apparu.push(d);
            }
        }
        var proprietes = properties(),
            val1 = proprietes[1],
            val2 = proprietes[2],
            somme = val1 + val2,
            nb_non_apparu = non_apparu.length,
            top = 0,
            element,
            hauteur,
            id;
        for(var f = 0; f < nb_non_apparu; f++) {
            id = "tuile" + non_apparu[f];
            element = document.getElementById(id);
            top = parseInt(getComputedStyle(element, null).top.replace(/px/, ''));
            if(top < somme) {
                hauteur = parseInt(getComputedStyle(element, null).top.replace(/px/, ''));
                element.style.top = (hauteur + 2 * parseInt(getComputedStyle(element, null).height.replace(/px/, ''))) + 'px';
                animer();
                visible.push(non_apparu[f]);
            }
        }
        deja_apparu(visible);
        agrandir_matrice();
    }

    var deja_cree = (function () { // div déjà insérés dans le DOM
        var created = [0];
        return function (ajout) {
            if(ajout) {
                created = ajout;
            }
            return created;
        };
    })();

    function ajouter_div() {
        function deplacer(id, topend, leftend, widthend, heightend) { // déplace/redimenssionne les tuiles lors d'un redimmenssion de la fenêtre
            $("#" + id).animate({
                top: topend,
                left: leftend,
                width: widthend,
                height: heightend
            }, 400, "easeOutQuart", function () {});
        }
        var moodboard = document.getElementById("BlebbeJS"),
            nombre_div = donner_numero_div(true),
            created = deja_cree(),
            nb_cree = created.length,
            non_cree = [],
            present;
        for(var d = 1; d <= nombre_div; d++) {
            present = false;
            for(var e = 0; e < nb_cree; e++) {
                if(d == created[e]) {
                    present = true;
                }
            }
            if(!present) {
                non_cree.push(d);
            }
        }
        var nombre_non_cree = non_cree.length,
            dvs,
            matrix = matrice(),
            nombre_ligne = matrix.length,
            nombre_colonne = matrix[0].length,
            proprietes = properties(),
            largeur_tuile = Math.floor(proprietes[0] / nombre_colonne),
            indice,
            ligne,
            colonne,
            largeur = 0,
            hauteur = 0;
        for(var f = 0; f < nombre_non_cree; f++) {
            for(var g = 0; g < nombre_ligne; g++) {
                indice = matrix[g].indexOf(non_cree[f]);
                if(indice != -1) {
                    ligne = g;
                    colonne = indice;
                    g = nombre_ligne;
                }
            }
            if(f == nombre_non_cree - 1) {
                var scroll = document.getElementById("scroll");
                scroll.style.top = (ligne * largeur_tuile + 200) + 'px';
            }
            if(colonne == nombre_colonne - 1) {
                largeur = largeur_tuile;
                hauteur = largeur_tuile;
            } else {
                if(matrix[ligne][colonne] != matrix[ligne][colonne + 1]) {
                    largeur = largeur_tuile;
                    hauteur = largeur_tuile;
                } else {
                    largeur = 2 * largeur_tuile;
                    if(matrix[ligne][colonne] != matrix[ligne + 1][colonne]) {
                        hauteur = largeur_tuile;
                    } else {
                        hauteur = 2 * largeur_tuile;
                    }
                }
            }
            if(!document.getElementById("tuile" + non_cree[f])) {
                dvs = document.createElement("div");
                dvs.id = "tuile" + non_cree[f];
                dvs.style.opacity = 0;
                dvs.style.position = "absolute";
                dvs.style.top = (ligne * largeur_tuile) + 'px';
                dvs.style.left = (colonne * largeur_tuile) + 'px';
                dvs.style.width = largeur + 'px';
                dvs.style.height = hauteur + 'px';
                moodboard.appendChild(dvs);
            } else {
                deplacer("tuile" + non_cree[f], ligne * largeur_tuile, colonne * largeur_tuile, largeur, hauteur);
            }
            created.push(non_cree[f]);
        }
        deja_cree(created);
        faire_apparaitre();
    }

    function agrandir_matrice() // faut-il générer d'autres tuiles ou pas ?
    {
        var matrix = matrice(),
            proprietes = properties(),
            val1 = proprietes[1],
            val2 = proprietes[2],
            somme = val1 + val2,
            nb_ligne = matrix.length,
            nb_colonne = matrix[0].length;
        if(somme > ((nb_ligne - 2) * (proprietes[0] / nb_colonne))) {
            lancer_ecrire_matrice();
        }
    }

    var replacer_en_attente = (function () { // si on veut exécuter "replacer" alors que la fonction s'éxécute déjà, on place sa deuxième éxécution en attente. Cette fonction permet d'interdire de placer en attente plus d'une fois.
        var executing = false;
        return function (execute) {
            if(typeof execute != 'undefined') {
                executing = execute;
            }
            return executing;
        };
    })();

    function replacer() // éxécuté lorsque la fenêtre est redimmenssionnée.
    {
        function fini(nombre_id) {
            var cree = deja_cree(),
                indice = cree.indexOf(nombre_id);
            if(indice != -1) {
                is_replacer_executing(false);
                replacer_en_attente(false);
            } else {
                setTimeout(function () {
                    fini(nombre_id);
                }, 20);
            }
        }
        is_replacer_executing(true);
        var moodboard = document.getElementById("BlebbeJS"),
            nombredetuilesenlargeur = 1,
            nombre_id = donner_numero_div(true),
            tailleminimumdestuiles = 100,
            taillemaximaldestuiles = 150;
        quantite_forme([0, 0, 0]);
        var largeurdumoodboard = parseInt(getComputedStyle(moodboard, null).width.replace(/px/, ''));
        largeur_moodboard(largeurdumoodboard);
        hauteur_moodboard(parseInt(getComputedStyle(moodboard, null).height.replace(/px/, '')));
        donner_numero_div(0);
        deja_cree([0]);
        if(largeurdumoodboard > tailleminimumdestuiles) {
            while(largeurdumoodboard / nombredetuilesenlargeur > taillemaximaldestuiles) {
                nombredetuilesenlargeur++;
            }
        }
        matrice([new Array(nombredetuilesenlargeur)]);
        ecrire_matrice(nombre_id);
        fini(nombre_id);
    }

    (function () {
        var contenant = document.getElementById(id_element),
            moodboard = document.createElement("div");
        moodboard.id = "BlebbeJS";
        moodboard.style.width = "100%";
        moodboard.style.height = "100%";
        moodboard.style.position = "relative"; // un autre div est créé à cause de la position relative, évitant les éventuelles interférences.
        moodboard.style.overflowX = "hidden";
        moodboard.style.margin = 0;
        moodboard.style.padding = 0;
        contenant.appendChild(moodboard);
        var largeurdumootboard = parseInt(getComputedStyle(moodboard, null).width.replace(/px/, '')),
            nombredetuilesenlargeur = 1,
            proprietes = properties(),
            dvs = document.createElement("div");
        dvs.id = "scroll";
        dvs.style.width = "1px";
        dvs.style.height = "1px";
        dvs.style.opacity = 0;
        dvs.style.position = "absolute";
        dvs.style.top = (proprietes[1] + 200) + 'px';
        moodboard.appendChild(dvs);
        if(largeurdumootboard > tailleminimumdestuiles) {
            while(largeurdumootboard / nombredetuilesenlargeur > taillemaximaldestuiles) {
                nombredetuilesenlargeur++;
            }
        }
        matrice([new Array(nombredetuilesenlargeur)]);
        agrandir_matrice(parseInt(getComputedStyle(moodboard, null).width.replace(/px/, '')));

        // événements :
        moodboard.addEventListener("scroll", function () {
            setTimeout(function () {
                agrandir_matrice();
                faire_apparaitre();
            }, 100);
        });

        window.onresize = function () {
            var execute = is_replacer_executing(),
                attente = replacer_en_attente();
            if(execute) {
                if(!attente) {
                    setTimeout(function () {
                        replacer_en_attente(true);
                    }, 1000);
                    replacer_en_attente(true);
                }
            } else {
                replacer();
            }
        };

    })();
}
