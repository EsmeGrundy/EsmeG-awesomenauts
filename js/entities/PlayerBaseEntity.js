game.PlayerBaseEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this.setSuper(x, y, settings);
        this.setAttributes();
        this.setFlags();

        this.body.onCollision = this.onCollision.bind(this);
        this.type = "PlayerBaseEntity";

        this.addAnimations();
    },
    setSuper: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "tower",
                width: 100,
                height: 100,
                spritewidth: "100",
                spriteheight: "100",
                getShape: function() {
                    return (new me.Rect(0, 0, 100, 70)).toPolygon();
                }
            }]);
    },
    setAttributes: function() {
        this.health = game.data.playerBaseHealth;
    },
    setFlags: function() {
        this.broken = false;
        this.alwaysUpdate = true;
    },
    addAnimations: function() {
        this.renderable.addAnimation("idle", [0]);
        this.renderable.addAnimation("broken", [1]);
        this.renderable.setCurrentAnimation("idle");
    },
    update: function(delta) {
        this.broken = this.checkIfBroken();
        this.break();
        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    checkIfBroken: function() {
        if (this.health <= 0) {
            return true;
            
        }
    },
    break: function(){
        if(this.broken){
            game.data.win = false;
            this.renderable.setCurrentAnimation("broken");
        }
    },
    loseHealth: function(damage) {
        this.health = this.health - damage;
         console.log("player base health: " + this.health);
    },
    onCollision: function() {

    }
});


