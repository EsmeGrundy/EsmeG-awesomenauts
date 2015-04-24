game.Bubble = me.Entity.extend({
    init: function(x, y, settings) {
        this.setSuper(x, y, {});
        this.setAttributes();
        this.setFlags();
        this.type = "bubble";
    },
    setSuper: function(x, y, settings) {
        this._super(me.Entity, "init", [x, y, {
                image: "bubble",
                height: 64,
                width: 64,
                spriteheight: "64",
                spritewidth: "64",
                getShape: function() {
                    return(new me.Rect(0, 0, 64, 64)).toPolygon();
                }

            }]);
    },
    setAttributes: function(facing) {
        this.body.setVelocity(8, 0);
        this.attack = (game.data.ability3 * 2);
        this.facing = facing;
    },
    setFlags: function() {
        this.alwaysUpdate = true;
    },
    update: function(delta) {
        this.move();
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    move: function() {
        if (this.facing === "left"){
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
        }else{
            this.body.vel.x += this.body.accel.x * me.timer.tick;
        }
    },
    collideHandler: function(response) {
        if (response.b.type === 'EnemyBaseEntity' || response.b.type === 'EnemyCreep' || response.b.type === 'TeamCreep' || response.b.type === 'TeamCreep2') {
            response.b.loseHealth(this.attack);
            me.game.world.removeChild(this);
        }
    }
});




