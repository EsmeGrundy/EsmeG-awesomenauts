game.PlayScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        // reset the score
        game.data.score = 0;
        //loads the level
        me.levelDirector.loadLevel("level03");
        //resets the player
        this.resetPlayer(10, 0);
        
        //adds the entities needed to play the game
        var gameTimerManager = me.pool.pull("GameTimerManager", 0, 0, {});
        me.game.world.addChild(gameTimerManager, 0);

        var heroDeathManager = me.pool.pull("HeroDeathManager", 0, 0, {});
        me.game.world.addChild(heroDeathManager, 0);

        var experienceManager = me.pool.pull("ExperienceManager", 0, 0, {});
        me.game.world.addChild(experienceManager, 0);

        var spendGold = me.pool.pull("SpendGold", 0, 0, {});
        me.game.world.addChild(spendGold, 0);
        
        var pause = me.pool.pull("Pause", 0, 0, {});
        me.game.world.addChild(pause, 0);
        
        game.data.miniMap = me.pool.pull("miniMap", 10, 10, {});
        me.game.world.addChild(game.data.miniMap, 30);

        //binds the keys needed for the game
        me.input.bindKey(me.input.KEY.B, "buy");
        me.input.bindKey(me.input.KEY.Q, "skill1");
        me.input.bindKey(me.input.KEY.W, "skill2");
        me.input.bindKey(me.input.KEY.E, "skill3");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.UP, "jump");
        me.input.bindKey(me.input.KEY.A, "attack");
        me.input.bindKey(me.input.KEY.P, "pause");

        // add our HUD to the game world
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);
    },
    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        // remove the HUD from the game world
        me.game.world.removeChild(this.HUD);
    },
    resetPlayer: function(x, y) {
        //adds the entities needed for the game when the player resets
        game.data.player = me.pool.pull(game.data.character, x, y, {});
        me.game.world.addChild(game.data.player, 5);
        
        game.data.miniPlayer = me.pool.pull("miniPlayer", 10, 10, {});
        me.game.world.addChild(game.data.miniPlayer, 31);
    }
});
