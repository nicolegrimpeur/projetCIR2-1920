// initailisation de la fenètre de jeu
var game = new Phaser.Game(1152, 648, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

let map0, map1, map2, map3, map4, map5, map6, map7; // stocke les maps, map est la map affiché
let currentMap; // permet de savoir dans quel map on est
let murs, sol, meubles; // stocke les layers des maps
let player, player1, player2, player3; // stocke les sprites de personnages, player est la variable utilisé pour définir le personnage affiché
let fauteuil, fiole_jaune, fiole_bleu, mechant, perso2_sans_fauteuil; // stocke les sprites des objets
let cursors, cursors2, cursors3; // stocke les touches utilisé, cursor pour le curseur, cursor2 pour zqsd, cursor3 pour les autres touches (plein écran, passer au dialogue suivant etc
let fauteuil_ramasse = false; // permet de savoir si les fioles et le fauteuil on déjà était ramassé ou non
let fiole_bleu_ramasse = false;
let fiole_jaune_ramasse = false;
let dialogue; // stocke sous forme de cache le fichier json contenant les dialogues
let count; // stocke où on en est dans les dialogues
let timeout; // stocke les fonctions appelés sous forme variable pour les remettre à 0
let debut_jeu, fin_jeu; // variable stockant le temps du joueur
let speedrun = false; // mode speedrun avec temps affiché
let tp_avant, tp_apres, transparent_dialogue; // stocke les sprites des modèles transparents permettant de lancer les dialogues
let continu = false;

function preload() {
    //Chargement des maps
    this.load.tilemapTiledJSON('map0', '../map/map0.json');
    this.load.tilemapTiledJSON('map1', '../map/map1.json');
    this.load.tilemapTiledJSON('map2', '../map/map2.json');
    this.load.tilemapTiledJSON('map3', '../map/map3.json');
    this.load.tilemapTiledJSON('map4', '../map/map4.json');
    this.load.tilemapTiledJSON('map5', '../map/map5.json');
    this.load.tilemapTiledJSON('map6', '../map/map6.json');
    this.load.tilemapTiledJSON('map7', '../map/map7.json');

    //Chargement des png lié aux maps
    this.load.image('tilePerso', '../tiled/Capture_decran_2020-01-21_a_17.57.21.png');
    this.load.image('tilePersoCopie', '../tiled/Capture_decran_2020-01-21_a_17.57.21 - Copie.png');
    this.load.image('tileJardin', '../tiled/grass_tileset_16x16_preview_0.png');
    this.load.image('tileMetallicOrange', '../tiled/MetallicOrange [16px orthogonal tileset].png');
    this.load.image('tileHopital', '../tiled/hopital.png');
    this.load.image('tileHopital2', '../tiled/hopital - Copie.png');
    this.load.image('tileHopital3', '../tiled/interieur_hopital_sprites.jpg');
    this.load.image('noir', '../tiled/fond-ecran-noir.jpg');
    this.load.image('wing2', '../tiled/pngwing.com (2).png');
    this.load.image('moteur', '../tiled/Deficients-moteur-CMJN.jpg');

    // chargement des objets
    this.load.image('fauteuil', '../tiled/fauteuil.png');
    this.load.image('fiole_bleu', '../tiled/fiole_bleu.png');
    this.load.image('fiole_jaune', '../tiled/fiole_jaune.png');
    this.load.spritesheet('transparent_avant', '../tiled/transparent_avant.png', 50, 50);
    this.load.spritesheet('transparent_apres', '../tiled/transparent_apres.png', 50, 50);
    this.load.spritesheet('transparent_dialogue', '../tiled/transparent_dialogue.png', 50, 50);


    // chargement des personnages
    this.load.spritesheet('dude', '../tiled/dude.png', 48, 60);
    this.load.spritesheet('perso1', '../tiled/perso1_45x60.png', 45, 60);
    this.load.spritesheet('perso2', '../tiled/perso2_45x60.png', 45, 60);
    this.load.spritesheet('perso3', '../tiled/perso3_45x60.png', 45, 60);
    this.load.spritesheet('mechant', '../tiled/mechant.png', 41, 56);
    this.load.spritesheet('perso2_sans_fauteuil', '../tiled/perso2_sansFauteuil.png', 41, 56);

    // chargement des dialogues
    game.load.json('dialogue', '../dialogue/dialogue.json');
}

function create() {
    // fond du jeu
    this.stage.backgroundColor = '#787878';

    // lancement de la physique avec Arcade
    this.physics.startSystem(Phaser.Physics.ARCADE);

    //Ajout des maps et de leurs tilesets
    map0 = this.make.tilemap('map0');
    map0.addTilesetImage('parking', 'noir');
    map0.addTilesetImage('hopital', 'tilePerso');
    map0.addTilesetImage('ambulance', 'wing2');
    map0.addTilesetImage('symbole', 'moteur');
    map0.addTilesetImage('jardin', 'tileJardin');
    map0.addTilesetImage('hopital1', 'tileHopital');

    map1 = this.make.tilemap('map1');
    map1.addTilesetImage('hospital', 'tilePerso');
    map1.addTilesetImage('jardin', 'tileJardin');
    map1.addTilesetImage('niveau 0', 'tileMetallicOrange');
    map1.addTilesetImage('hospital1', 'tileHopital');
    map1.addTilesetImage('tmeuble', 'tileHopital2');
    map1.addTilesetImage('hopital 3', 'tileHopital3');

    map2 = this.make.tilemap('map2');
    map2.addTilesetImage('hospital', 'tilePersoCopie');
    map2.addTilesetImage('hopital', 'tilePerso');
    map2.addTilesetImage('hopital2', 'tileMetallicOrange');
    map2.addTilesetImage('hospital1', 'tileHopital');
    map2.addTilesetImage('tmeuble', 'tileHopital2');
    map2.addTilesetImage('hopital 3', 'tileHopital3');

    map3 = this.make.tilemap('map3');
    map3.addTilesetImage('hopital', 'tilePerso');
    map3.addTilesetImage('hopital2', 'tileMetallicOrange');
    map3.addTilesetImage('hopital3', 'tileHopital');
    map3.addTilesetImage('hopital1', 'tileHopital2');
    map3.addTilesetImage('hopital5', 'tileHopital3');

    map4 = this.make.tilemap('map4');
    map4.addTilesetImage('hopital', 'tilePerso');
    map4.addTilesetImage('hopital6', 'tilePersoCopie');
    map4.addTilesetImage('hopital3', 'tileMetallicOrange');
    map4.addTilesetImage('hopital2', 'tileHopital');
    map4.addTilesetImage('hopital1', 'tileHopital2');
    map4.addTilesetImage('hopital4', 'tileHopital3');

    map5 = this.make.tilemap('map5');
    map5.addTilesetImage('hopital', 'tilePerso');
    map5.addTilesetImage('hopital4', 'tileMetallicOrange');
    map5.addTilesetImage('hopital2', 'tileHopital');
    map5.addTilesetImage('hopital1', 'tileHopital2');
    map5.addTilesetImage('hopital3', 'tileHopital3');

    map6 = this.make.tilemap('map6');
    map6.addTilesetImage('hopital', 'tilePerso');
    map6.addTilesetImage('hopital4', 'tileMetallicOrange');
    map6.addTilesetImage('hopital2', 'tileHopital');
    map6.addTilesetImage('hopital1', 'tileHopital2');
    map6.addTilesetImage('hopital3', 'tileHopital3');

    map7 = this.make.tilemap('map7');
    map7.addTilesetImage('hopital', 'tilePerso');
    map7.addTilesetImage('hopital1', 'tileHopital3');
    map7.addTilesetImage('hopital2', 'tileHopital');

    //Ajout du personnage et ses propriétés physiques
    player1 = this.add.sprite(55, 80, 'perso1');
    this.physics.arcade.enable(player1);
    init_player(player1);
    player2 = this.add.sprite(55, 80, 'perso2');
    this.physics.arcade.enable(player2);
    init_player(player2);
    player3 = this.add.sprite(55, 80, 'perso3');
    this.physics.arcade.enable(player3);
    init_player(player3);

    // ajout des images des personnages
    mechant = this.add.sprite(1152, 648, 'mechant');
    perso2_sans_fauteuil = this.add.sprite(1152, 648, 'perso2_sans_fauteuil');

    // ajout des zones de changements de zones et de dialogue
    tp_avant = this.add.sprite(1152, 648, 'transparent_avant');
    this.physics.arcade.enable(tp_avant);
    tp_apres = this.add.sprite(1152, 648, 'transparent_apres');
    this.physics.arcade.enable(tp_apres);
    transparent_dialogue = this.add.sprite(1152, 648, 'transparent_dialogue');
    this.physics.arcade.enable(transparent_dialogue);

    // ajout des objets à récupérer
    fauteuil = this.add.sprite(10, 10, 'fauteuil');
    this.physics.arcade.enable(fauteuil);
    fiole_bleu = this.add.sprite(1152, 648, 'fiole_bleu');
    this.physics.arcade.enable(fiole_bleu);
    fiole_jaune = this.add.sprite(1152, 648, 'fiole_jaune');
    this.physics.arcade.enable(fiole_jaune);

    //Gestion des contrôles
    cursors = this.input.keyboard.createCursorKeys(); // déplacement avec les flèches directionnelles
    cursors2 = this.input.keyboard.addKeys({
        'up': Phaser.KeyCode.Z,
        'down': Phaser.KeyCode.S,
        'left': Phaser.KeyCode.Q,
        'right': Phaser.KeyCode.D
    }); // déplacement avec zqsd
    cursors3 = this.input.keyboard.addKeys({
        'NUMPAD_0': Phaser.KeyCode.NUMPAD_0,
        'NUMPAD_1': Phaser.KeyCode.NUMPAD_1,
        'NUMPAD_2': Phaser.KeyCode.NUMPAD_2,
        'NUMPAD_3': Phaser.KeyCode.NUMPAD_3,
        'NUMPAD_4': Phaser.KeyCode.NUMPAD_4,
        'NUMPAD_5': Phaser.KeyCode.NUMPAD_5,
        'NUMPAD_6': Phaser.KeyCode.NUMPAD_6,
        'NUMPAD_7': Phaser.KeyCode.NUMPAD_7,
        'A': Phaser.KeyCode.A,
        'E': Phaser.KeyCode.E,
        'P': Phaser.KeyCode.P
    }); // ajout des touches supplémentaires

    // initialisation des dialogues
    count = 3;
    dialogue = game.cache.getJSON('dialogue');
    text = game.add.text(50, 550, "", {fill: '#000000', backgroundColor: '#ffffff', fontSize: 20});

    //Gestion du plein écran avec la touche P
    this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    cursors3.P.onDown.add(gofull, this);
    // permettait de se déplacer dans les textes
    // cursors3.A.onDown.add(updateText_moins, this);
    // cursors3.E.onDown.add(updateText_plus, this);

    // lance la map0
    create_map(0);
    // récupère le temps de départ pour calculer à la fin le temps d'arriver
    debut_jeu = new Date().getTime();
}

function update() {
    // permet les collisions entre les murs et les différents obstacles
    this.physics.arcade.collide(player, murs);
    this.physics.arcade.collide(player, meubles);
    this.physics.arcade.collide(player, sol);

    // lancer les fonctions en fonction des collisions entre les élèments
    this.physics.arcade.overlap(player, fauteuil, takeItem);
    this.physics.arcade.overlap(player, fiole_jaune, takeItem, null, this);
    this.physics.arcade.overlap(player, fiole_bleu, takeItem, null, this);
    this.physics.arcade.overlap(player, tp_avant, map_avant, null, this);
    this.physics.arcade.overlap(player, tp_apres, map_apres, null, this);
    this.physics.arcade.overlap(player, transparent_dialogue, updateText_plus, null, this);

    // associe les clics du numpad à une map
    touche_cursor3();

    // permet les déplacements des personnages
    move();
}

function render() {
    // game.debug.body(player);
    // game.debug.body(item);
    // Input debug info
    // game.debug.inputInfo(32, 32);
    // game.debug.pointer( game.input.activePointer );
}

// associe les touches du pavé numérique à chaque map
function touche_cursor3() {
    if (cursors3.NUMPAD_0.isDown) create_map(0);
    if (cursors3.NUMPAD_1.isDown) create_map(1);
    if (cursors3.NUMPAD_2.isDown) create_map(2);
    if (cursors3.NUMPAD_3.isDown) create_map(3);
    if (cursors3.NUMPAD_4.isDown) create_map(4);
    if (cursors3.NUMPAD_5.isDown) create_map(5);
    if (cursors3.NUMPAD_6.isDown) create_map(6);
    if (cursors3.NUMPAD_7.isDown) create_map(7);
}

// lance le plein écran
function gofull() {
    if (this.scale.isFullScreen) this.scale.stopFullScreen();
    else this.scale.startFullScreen(false);
}

// déplace le personnage en fonction de la touche enfoncée
function move() {
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    //Gauche
    if (cursors.left.isDown || cursors2.left.isDown) {
        if (cursors.down.isDown || cursors2.down.isDown) {
            if (player == player3) player.body.velocity.y = -150;
            else player.body.velocity.y = 150;
        } else if (cursors.up.isDown || cursors2.up.isDown) {
            if (player == player3) player.body.velocity.y = 150;
            else player.body.velocity.y = -150;
        }
        if (player == player3) player.body.velocity.x = 150;
        else player.body.velocity.x = -150;
        if (player == player3) player.animations.play('right');
        else player.animations.play('left');
    }
    //Droite
    else if (cursors.right.isDown || cursors2.right.isDown) {
        if (cursors.down.isDown || cursors2.down.isDown) {
            if (player == player3) player.body.velocity.y = -150;
            else player.body.velocity.y = 150;
        } else if (cursors.up.isDown || cursors2.up.isDown) {
            if (player == player3) player.body.velocity.y = 150;
            else player.body.velocity.y = -150;
        }
        if (player == player3) player.body.velocity.x = -150;
        else player.body.velocity.x = 150;
        if (player == player3) player.animations.play('left');
        else player.animations.play('right');
    }
    //Haut
    else if (cursors.up.isDown || cursors2.up.isDown) {
        if (player == player3) player.body.velocity.y = 150;
        else player.body.velocity.y = -150;
        if (player == player3) player.animations.play('down');
        else player.animations.play('up');
    }
    //Bas
    else if (cursors.down.isDown || cursors2.down.isDown) {
        if (player == player3) player.body.velocity.y = -150;
        else player.body.velocity.y = 150;
        if (player == player3) player.animations.play('up');
        else player.animations.play('down');
    }
    //Default
    else {
        player.animations.stop();
        player.animations.play('face');
    }
}

// récupère l'objet au sol
function takeItem(body1, body2) {
    if (body2 == fauteuil) fauteuil_ramasse = true;
    if (body2 == fiole_jaune) fiole_jaune_ramasse = true;
    if (body2 == fiole_bleu) fiole_bleu_ramasse = true;
    body2.kill();
}

// avance à la map d'avant
function map_avant() {
    create_map(--currentMap);
}

// avance à la map d'après
function map_apres() {
    create_map(++currentMap);
}

// créer la map en fonction de la map rentré en paramètre, et change le personnage de jeu
function create_map(nb_map) {
    // supprime les différents objets
    if (murs != undefined) murs.kill();
    if (sol != undefined) sol.kill();
    if (meubles != undefined) meubles.kill();
    if (player != undefined) player.alpha = 0;

    if (nb_map == 0) {
        meubles = map0.createLayer('accessoire');
        sol = map0.createLayer('sol');
        murs = map0.createLayer('voiture');

        //Activation des collisions sur les obstacles
        map0.setCollisionBetween(18300, 18500, true, 'voiture');
        map0.setCollisionBetween(18000, 20000, true, 'accessoire');

        // le joueur qui joue est le personnage 1
        player = player1;
        // on l'affiche
        player.alpha = 1;
        // et on lui change ses coordonnées
        player.x = 1080;
        player.y = 290;
    } else if (nb_map == 1) {
        //Ajout des murs
        murs = map1.createLayer('mur');
        //Ajout du sol
        sol = map1.createLayer('sol');
        //Ajout des meubles
        meubles = map1.createLayer('meuble');

        map1.setCollision(7179, true, 'mur');
        map1.setCollisionBetween(17302, 19219, true, 'meuble');

        if (fauteuil_ramasse) player = player2;
        else player = player1;
        player.alpha = 1;
        player.x = 1020;
        player.y = 460;
    } else if (nb_map == 2) {
        meubles = map2.createLayer('meuble');
        sol = map2.createLayer('sol');
        murs = map2.createLayer('mur');

        map2.setCollision(7184, true, 'mur');
        map2.setCollision(7178, true, 'mur');

        map2.setCollisionBetween(16000, 21000, true, 'meuble');

        player = player2;
        player.alpha = 1;
        player.x = 500;
        player.y = 365;
    } else if (nb_map == 3) {
        meubles = map3.createLayer('accessoire');
        sol = map3.createLayer('sol');
        murs = map3.createLayer('mur');

        map3.setCollision(7178, true, 'mur');
        map3.setCollision(2689, true, 'mur');

        map3.setCollisionBetween(33000, 37000, true, 'accessoire');

        if (fiole_bleu_ramasse && fiole_jaune_ramasse) player = player3;
        else player = player2;
        player.alpha = 1;
        player.x = 940;
        player.y = 25;
    } else if (nb_map == 4) {
        meubles = map4.createLayer('accessoire');
        sol = map4.createLayer('sol');
        murs = map4.createLayer('mur');

        map4.setCollision(6248, true, 'mur');
        map4.setCollision(6260, true, 'mur');
        map4.setCollision(23375, true, 'mur');

        map4.setCollisionBetween(17000, 21000, true, 'accessoire');

        if (fiole_bleu_ramasse && fiole_jaune_ramasse) player = player3;
        else player = player2;
        player.alpha = 1;
        player.x = 390;
        player.y = 25;
    } else if (nb_map == 5) {
        meubles = map5.createLayer('accessoire');
        sol = map5.createLayer('sol');
        murs = map5.createLayer('mur');

        map5.setCollision(7965, true, 'mur');

        map5.setCollisionBetween(17302, 19219, true, 'accessoire');

        if (fiole_bleu_ramasse && fiole_jaune_ramasse) player = player3;
        else player = player2;
        player.alpha = 1;
        player.x = 866;
        player.y = 60;
    } else if (nb_map == 6) {
        meubles = map6.createLayer('accessoire');
        sol = map6.createLayer('sol');
        murs = map6.createLayer('mur');

        map6.setCollisionBetween(2600, 2690, true, 'mur');

        map6.setCollisionBetween(17000, 19000, true, 'accessoire');

        if (fiole_bleu_ramasse && fiole_jaune_ramasse) player = player3;
        else player = player2;
        player.alpha = 1;
        player.x = 65;
        player.y = 30;
    } else if (nb_map == 7) {
        meubles = map7.createLayer('accessoire');
        sol = map7.createLayer('sol');
        murs = map7.createLayer('mur');

        //Activation des collisions sur le mur
        map7.setCollisionBetween(2600, 3000, true, 'mur');

        //Activation des collisions avec les accessoires
        map7.setCollisionBetween(17000, 20000, true, 'accessoire');

        // Activation des collisions avec les lits qui sont dans le sol
        map7.setCollisionBetween(17000, 18600, true, 'sol');

        player = player1;
        player.alpha = 1;
        player.x = 1050;
        player.y = 30;
    }

    // modifie les emplacements des images
    images(nb_map);

    // modifie la taille des objets et les envoi dans le fond derrière les personnages
    meubles.setScale(1.5);
    meubles.sendToBack();
    murs.setScale(1.5);
    murs.sendToBack();
    sol.setScale(1.5);
    sol.sendToBack();

    // affiche les collisions si besoin
    // murs.debug = true;
    // meubles.debug = true;
    // sol.debug = true;

    // empèche le joueur d'accéder à un map à laquelle il n'a pas accès
    if (!(fiole_bleu_ramasse && fiole_jaune_ramasse) && nb_map == 7 && fauteuil_ramasse) {
        create_map(6);
        call_text(2, false);
    } else if (!fauteuil_ramasse && (nb_map == 2 || nb_map == 3 || nb_map == 4 || nb_map == 5 || nb_map == 6 || nb_map == 7)) {
        create_map(1);
        call_text(0, false);
    } else if (nb_map == 7 && speedrun) {
        fin_jeu = new Date().getTime();
        let temps_jeu = fin_jeu - debut_jeu;
        console.log("minutes : ", Math.floor((temps_jeu % (1000 * 60 * 60)) / (1000 * 60)));
        console.log("secondes : ", Math.floor((temps_jeu % (1000 * 60)) / 1000));
        document.getElementById("fin_jeu_speedrun").innerHTML = "Temps : " + String(Math.floor((temps_jeu % (1000 * 60 * 60)) / (1000 * 60))) + " minutes et " + String(Math.floor((temps_jeu % (1000 * 60)) / 1000)) + " secondes !!!";
    }

    // stocke la map actuelle
    currentMap = nb_map;
}

// initialise les joueurs
function init_player(perso) {
    // modifie la taille et active les collisions avec les bords de la map
    perso.body.setSize(43, 24, 2, 40);
    perso.body.collideWorldBounds = true;

    //Découpage des animations du personnage
    perso.animations.add('left', [3, 4, 5], 10, true);
    perso.animations.add('face', [1], 1, true);
    perso.animations.add('back', [10], 1, true);
    perso.animations.add('right', [6, 7, 8], 10, true);
    perso.animations.add('down', [0, 1, 2], 10, true);
    perso.animations.add('up', [9, 10, 11], 10, true);
    perso.sendToBack();

    // positionne le personnage en bas à droite et le cache
    perso.x = 1152;
    perso.y = 648;
    perso.alpha = 0;
}

// permet de passer au texte d'après
function updateText_plus(body1, body2) {
    // affiche les dialogues une seule fois en allant sur une case qui lance les dialogues
    if ((currentMap == 0 && count == 3) || (currentMap == 1 && count == 11) || (currentMap == 2 && count == 16) || (currentMap == 5 && count == 26 && player == player3) || (currentMap == 7 && count == 29) || continu) {
        continu = false;
        if (dialogue.dialogue.length - 1 > count) count++;
        call_text(count, true);
    }
}

// passe au dialogue précédant
function updateText_moins() {
    if (count > 0) count--;
    call_text(count, true);
}

// affiche les dialogues
function call_text(number, suivant) {
    if (fin_jeu != undefined && number == 37 && speedrun) {
        let temps_jeu = fin_jeu - debut_jeu;
        text.setText(dialogue.dialogue[number] + "Temps : " + String(Math.floor((temps_jeu % (1000 * 60 * 60)) / (1000 * 60))) + " minutes et " + String(Math.floor((temps_jeu % (1000 * 60)) / 1000)) + " secondes !!!");
    } else text.setText(dialogue.dialogue[number]);
    if (timeout != undefined) clearTimeout(timeout);
    if (dialogue.dialogue[number] != "" && suivant && number != 37) timeout = setTimeout(function () {
        continu = true;
        updateText_plus();
    }, 4000);
    else timeout = setTimeout(function () {
        text.setText("");
    }, 4000);
}

// modifie les emplacements des images
function images(nb_map) {
    if (!fiole_jaune_ramasse) {
        if (nb_map == 6) {
            fiole_jaune.x = 50;
            fiole_jaune.y = 560;
        } else {
            fiole_jaune.x = 1152;
            fiole_jaune.y = 648;
        }
    }
    if (!fiole_bleu_ramasse) {
        if (nb_map == 3) {
            fiole_bleu.x = 200;
            fiole_bleu.y = 60;
        } else {
            fiole_bleu.x = 1152;
            fiole_bleu.y = 648;
        }
    }
    if (!fauteuil_ramasse) {
        if (nb_map == 1) {
            fauteuil.x = 100;
            1
            fauteuil.y = 460;
        } else {
            fauteuil.x = 1152;
            fauteuil.y = 648;
        }
    }
    if (nb_map == 7) {
        mechant.x = 580;
        mechant.y = 220;
    } else {
        mechant.x = 1152;
        mechant.y = 648;
    }
    if (nb_map == 1 && !fauteuil_ramasse) {
        perso2_sans_fauteuil.x = 840;
        perso2_sans_fauteuil.y = 35;
    } else {
        perso2_sans_fauteuil.x = 1152;
        perso2_sans_fauteuil.y = 648;
    }
    if (nb_map == 2) {
        if (!(fiole_jaune_ramasse && fiole_bleu_ramasse)) {
            player3.x = 650;
            player3.y = 30;
            player3.alpha = 1;
        }
    } else {
        if (!(fiole_jaune_ramasse && fiole_bleu_ramasse)) {
            player3.x = 1152;
            player3.y = 648;
            player3.alpha = 0;
        }
    }

    if (nb_map == 0) {
        tp_avant.x = 1152;
        tp_avant.y = 648;
        tp_apres.x = 10;
        tp_apres.y = 180;
        transparent_dialogue.x = 1080;
        transparent_dialogue.y = 300;
    } else if (nb_map == 1) {
        tp_avant.x = 1130;
        tp_avant.y = 475;
        tp_apres.x = 550;
        tp_apres.y = 53;
        transparent_dialogue.x = 845;
        transparent_dialogue.y = 125;
    } else if (nb_map == 2) {
        tp_avant.x = 510;
        tp_avant.y = 335;
        tp_apres.x = 1040;
        tp_apres.y = 615;
        transparent_dialogue.x = 650;
        transparent_dialogue.y = 120;
    } else if (nb_map == 3) {
        tp_avant.x = 950;
        tp_avant.y = 1;
        tp_apres.x = 250;
        tp_apres.y = 600;
        transparent_dialogue.x = 1152;
        transparent_dialogue.y = 648;
    } else if (nb_map == 4) {
        tp_avant.x = 405;
        tp_avant.y = 1;
        tp_apres.x = 1000;
        tp_apres.y = 600;
        transparent_dialogue.x = 1152;
        transparent_dialogue.y = 648;
    } else if (nb_map == 5) {
        tp_avant.x = 880;
        tp_avant.y = 1;
        tp_apres.x = 1100;
        tp_apres.y = 70;
        transparent_dialogue.x = 878;
        transparent_dialogue.y = 65;
    } else if (nb_map == 6) {
        tp_avant.x = 1;
        tp_avant.y = 60;
        tp_apres.x = 1105;
        tp_apres.y = 60;
        transparent_dialogue.x = 1152;
        transparent_dialogue.y = 648;
    } else if (nb_map == 7) {
        tp_avant.x = 1095;
        tp_avant.y = 50;
        tp_apres.x = 1152;
        tp_apres.y = 648;
        transparent_dialogue.x = 1045;
        transparent_dialogue.y = 55;
    }
}