
/* Game namespace */
var game = {
    // an object where to store game information
    data: {
        // score
        score: 0,
        option1: "",
        option2: "",
        enemyBaseHealth: 10,
        playerBaseHealth: 10,
        enemyCreepHealth: 2,
        playerHealth: 10,
        enemyCreepAttack: 2,
        playerAttack: 1,
        playerAttackTimer: 1000,
        creepAttackTimer: 2000,
        teamCreepAttackTimer: 1000,
        teamCreep2AttackTimer: 500,
        bubbleTimer: 250,
        playerMoveSpeed: 5,
        creepMoveSpeed: 5,
        gameTimerManager: "",
        HeroDeathManager: "",
        player: "",
        exp: 0,
        gold: 0,
        ability1: 0,
        ability2: 0,
        ability3: 0,
        skill1: 0,
        skill2: 0,
        skill3: 0,
        exp1: 0,
        exp2: 0,
        exp3: 0,
        exp4: 0,
        win: "",
        pausePos: "",
        buyscreen: "",
        pauseScreen: "",
        buytext: "",
        pausetext: "",
        spearTimer: 3000,
        whirlpoolTimer: 5000,
        burstTimer: 1000,
        miniMap: "",
        miniPlayer: "",
        character: ""


    },
    // Run on page load.
    "onload": function() {
        // Initialize the video.
        if (!me.video.init("screen", me.video.CANVAS, 1067, 600, true, '1.0')) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // add "#debug" to the URL to enable the debug Panel
        if (document.location.hash === "#debug") {
            window.onReady(function() {
                me.plugin.register.defer(this, debugPanel, "debug");
            });
        }

        me.state.SPENDEXP = 112;

        me.state.NEW = 113;

        me.state.LOAD = 114;

        me.state.CHAR = 115;

        // Initialize the audio.
        me.audio.init("mp3,ogg");

        // Set a callback to run when loading is complete.
        me.loader.onload = this.loaded.bind(this);

        // Load the resources.
        me.loader.preload(game.resources);

        // Initialize melonJS and display a loading screen.
        me.state.change(me.state.LOADING);
    },
    // Run on game resources loaded.
    "loaded": function() {
        me.pool.register("orcSpear", game.PlayerEntity, true);
        me.pool.register("seaKing", game.SeaKing, true);
        me.pool.register("fish", game.Fish, true);

        me.pool.register("PlayerBase", game.PlayerBaseEntity);
        me.pool.register("EnemyBase", game.EnemyBaseEntity);
        me.pool.register("EnemyCreep", game.EnemyCreep, true);
        me.pool.register("TeamCreep", game.TeamCreep, true);
        me.pool.register("TeamCreep2", game.TeamCreep2, true);
        me.pool.register("Spear", game.SpearThrow);
        me.pool.register("Whirlpool", game.Whirlpool);
        me.pool.register("Bubble", game.Bubble);
        me.pool.register("GameTimerManager", game.GameTimerManager);
        me.pool.register("HeroDeathManager", game.HeroDeathManager);
        me.pool.register("ExperienceManager", game.ExperienceManager);
        me.pool.register("SpendGold", game.SpendGold);
        me.pool.register("Pause", game.Pause);
        me.pool.register("miniMap", game.MiniMap, true);
        me.pool.register("miniPlayer", game.MiniPlayerLocation, true);
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.state.set(me.state.RESTART, new game.RestartScreen());
        me.state.set(me.state.SPENDEXP, new game.SpendExp());
        me.state.set(me.state.NEW, new game.NewProfile());
        me.state.set(me.state.LOAD, new game.LoadProfile());
        me.state.set(me.state.CHAR, new game.Characters());

        // Start the game.
        me.state.change(me.state.MENU);
    }
};
