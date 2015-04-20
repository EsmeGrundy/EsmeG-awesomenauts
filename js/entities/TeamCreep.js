game.TeamCreep = me.Entity.extend({
    init: function(x, y, settings) {
        this.setSuper(x, y, {});
        this.setCreepTimers();
        this.setAttributes();
        this.setFlags();
        this.type = "EnemyCreep";
        this.addAnimations();
    },
    setSuper: function(x, y, settings) {
        this._super(me.Entity, "init", [x, y, {
                image: "creep2",
                height: 64,
                width: 64,
                spriteheight: "64",
                spritewidth: "64",
                getShape: function() {
                    return(new me.Rect(0, 0, 64, 64)).toPolygon();
                }

            }]);
    },
    setCreepTimers: function() {
        //keeps track of when creep last attacks anything
        this.lastAttacking = new Date().getTime();
        //keeps track of last time creep hit anything
        this.lastHit = new Date().getTime();
        this.now = new Date().getTime();
    },
    setAttributes: function() {
        this.health = game.data.enemyCreepHealth;
        this.body.setVelocity(3, 20);
    },
    setFlags: function() {
        this.alwaysUpdate = true;
        //lets us know if the enemy is currently attacking
        this.attacking = false;
    },
    addAnimations: function() {
        this.renderable.addAnimation("walk", [69, 70, 71, 72, 73, 74, 75, 76, 77], 80);
        this.renderable.setCurrentAnimation("walk");
    },
    update: function(delta) {
        this.now = new Date().getTime();
        this.checkIfDead();
        this.move();
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    checkIfDead: function() {
        if (this.health <= 0) {
            me.audio.play("creep-die");
            me.game.world.removeChild(this);
        }
    },
    move: function() {
        this.body.vel.x -= this.body.accel.x * me.timer.tick;
    },
    collideHandler: function(response) {
        if (response.b.type === 'PlayerBaseEntity') {
            this.collidedWithPlayerBase(response);
        } else if (response.b.type === 'PlayerEntity') {
            var xdif = this.pos.x - response.b.pos.x;

            this.attacking = true;

            if (xdif > 0) {
                //keeps moving the creep to the right to maintain its position
                this.pos.x = this.pos.x + 1;
                this.body.vel.x = 0;
            }
            //checks that it has been at lest one second since creep has hit something
            if ((this.now - this.lastHit >= 1000) && (xdif > 0)) {
                //updates lastHit timer
                this.lastHit = this.now;
                //makes player call loseHealth function and passes damage of 1
                response.b.loseHealth(1);
            }
        }
    },
    collidedWithPlayerBase: function(response) {
        this.attacking = true;
        this.lastAttacking = this.now;
        this.body.vel.x = 0;
        //keeps moving the creep to the right to maintain its position
        this.pos.x = this.pos.x + 1;
        //checks that it has been at lest one second since creep has hit base
        if ((this.now - this.lastHit >= 1000)) {
            //updates lastHit timer
            this.lastHit = this.now;
            //makes player base call loseHealth function and passes damage of 1
            response.b.loseHealth(1);
        }
    },
    loseHealth: function(damage) {
        this.health = this.health - damage;
        console.log("enemy health: " + this.health);
    }

});


