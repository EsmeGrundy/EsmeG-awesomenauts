game.GameManager = Object.extend({
    init: function(x, y, settings) {
        this.now = new Date().getTime();
        this.lastCreep = new Date().getTime();
        this.paused = false;
        this.alwaysUpdate = true;
    },
    update: function() {
        this.now = new Date().getTime();

        if (game.data.player.dead) {
            me.game.world.removeChild(game.data.player);
            me.state.current().resetPlayer(10, 0);
        }
        if (Math.round(this.now / 1000) % 20 === 0 && (this.now - this.lastCreep >= game.data.creepAttackTimer)) {
            game.data.gold += 1;
            console.log("current gold: " + game.data.gold);
        }

        if (Math.round(this.now / 1000) % 10 === 0 && (this.now - this.lastCreep >= game.data.creepAttackTimer)) {
            this.lastCreep = this.now;
            var creep = me.pool.pull("EnemyCreep", 1000, 0, {});
            me.game.world.addChild(creep, 5);
        }

        return true;
    }
});


