game.Unicorn = me.Entity.extend({
    init: function(x, y, settings) {
        this.setSuper(x, y, settings);
        this.setPlayerTimers();
        this.type = "PlayerEntity";
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        this.addAnimation();
        this.renderable.setCurrentAnimation("explode");
        game.data.win = true;
    },
    setSuper: function(x, y, settings) {
        this._super(me.Entity, "init", [x, y, {
                image: "unicorn",
                height: 64,
                width: 64,
                spriteheight: "64",
                spritewidth: "64",
                getShape: function() {
                    return(new me.Rect(0, 0, 64, 64)).toPolygon();
                }

            }]);
    },
    setPlayerTimers: function() {
        this.now = new Date().getTime();
        this.spawn = this.now;
    },
    addAnimation: function() {
        this.renderable.addAnimation("idle", [0]);
        this.renderable.addAnimation("explode", [0, 1, 2, 3, 4, 5], 80);
    },
    update: function(delta) {
        this.now = new Date().getTime();
        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;

    }
});

