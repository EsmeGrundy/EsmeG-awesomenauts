game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, "init", [x, y, {
                image: "orcSpear",
                height: 64,
                width: 64,
                spriteheight: "64",
                spritewidth: "64",
                getShape: function() {
                    return(new me.Rect(0, 0, 64, 64)).toPolygon();
                }

            }]);

        this.body.setVelocity(5, 20);
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        this.facing = "right";

        this.renderable.addAnimation("idle", [78]);
        this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
        this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);

        this.renderable.setCurrentAnimation("idle");
    },
    update: function(delta) {
        if (me.input.isKeyPressed("right")) {
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            this.flipX(true);
        }
        else if (me.input.isKeyPressed("left")) {
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            this.flipX(false);
        }
        else {
            this.body.vel.x = 0;
        }
        //checks if the up arrow key is pressed
        if (me.input.isKeyPressed("jump")) {
            //checks if mario is not already jumping or falling
            if (!this.body.jumping && !this.body.falling) {
                //sets mario's velocity in the y direction to the y velocity from setVelocity and smooths animation
                this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                //makes jumping variable true
                this.body.jumping = true;
            }
        }


        if (me.input.isKeyPressed("attack")) {
            if (!this.renderable.isCurrentAnimation("attack")) {
                this.renderable.setCurrentAnimation("attack");
                this.renderable.setAnimationFrame();
            }
        }
        else if (this.body.vel.x !== 0) {
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        } else {
            this.renderable.setCurrentAnimation("idle");
        }



        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this.body.update(delta);

        this._super(me.Entity, "update", [delta]);

        return true;

    },
    
    collideHandler: function(response){
        if(response.b.type === 'EnemyBaseEntity'){
            var ydif = this.pos.y - response.b.pos.y;
            var xdif = this.pos.x - response.b.pos.x;
            
            console.log("xdif" + xdif + "ydif" + ydif);
            
            if(xdif >- 35 && this.facing==='right'){
                this.body.vel.x = 0;
                this.pos.x = this.pos.x - 1;
            }
            else if(xdif<60 && this.facing === 'left'){
                this.body.vel.x = 0;
                this.pos.x = this.pos.x + 1;
            }
        }
    }
});

game.PlayerBaseEntity = me.Entity.extend({
    init: function(x, y, settings) {
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
        this.broken = false;
        this.health = 10;
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);
        this.type = "PlayerBaseEntity";

        this.renderable.addAnimation("idle", [0]);
        this.renderable.addAnimation("broken", [1]);
        this.renderable.setCurrentAnimation("idle");
    },
    update: function(delta) {
        if (this.health <= 0) {
            this.broken = true;
            this.renderable.setCurrentAnimation("broken");
        }

        this.body.update(delta);

        this._super(me.Entity, "update", [delta]);

        return true;
    },
    onCollision: function() {

    }
});

game.EnemyBaseEntity = me.Entity.extend({
    init: function(x, y, settings) {
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
        this.broken = false;
        this.health = 10;
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);

        this.type = "EnemyBaseEntity";

        this.renderable.addAnimation("idle", [0]);
        this.renderable.addAnimation("broken", [1]);
        this.renderable.setCurrentAnimation("idle");
    },
    update: function(delta) {
        if (this.health <= 0) {
            this.broken = true;
            this.renderable.setCurrentAnimation("broken");
        }

        this.body.update(delta);

        this._super(me.Entity, "update", [delta]);
        return true;
    },
    onCollision: function() {

    }
});