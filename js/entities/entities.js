game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this.setSuper(x, y, settings);
        this.setPlayerTimers();
        this.setAttributes();
        this.type = "PlayerEntity";
        this.setFlags();
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        this.addAnimation();
        this.renderable.setCurrentAnimation("idle");
    },
    setSuper: function(x, y, settings) {
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
    },
    setPlayerTimers: function() {
        this.now = new Date().getTime();
        this.lastHit = this.now;
        this.lastSpear = this.now;
        this.lastWhirlpool = this.now;
        this.lastBurst = this.now;
        this.lastAttack = new Date().getTime();
    },
    setAttributes: function() {
        this.health = 20;
        this.body.setVelocity(game.data.playerMoveSpeed, 20);
        this.attack = game.data.playerAttack;
    },
    setFlags: function() {
        this.facing = "right";
        this.dead = false;
        this.attacking = false;
    },
    addAnimation: function() {
        this.renderable.addAnimation("idle", [78]);
        this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124], 80);
        this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
    },
    update: function(delta) {
        this.now = new Date().getTime();
        this.dead = this.checkIfDead();
        this.checkKeyPressesAndMove();
        this.checkAbilityKeys();
        this.setAnimation();

        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;

    },
    checkIfDead: function() {
        //if the player's health is less than or equal to 0...
        if (this.health <= 0) {
            //checkIfDead returns a value of true
            return true;
            //the player's position is reset
            this.pos.x = 10;
            this.pos.y = 0;
            //the player's health is reset
            this.health = game.data.playerHealth;
        }
    },
    checkKeyPressesAndMove: function() {
        //if the player presses the right arrow key..
        if (me.input.isKeyPressed("right")) {
            //the player moves right as dictated by the moveRight function
            this.moveRight();
        }
        //if the player presses the left arrow key...
        else if (me.input.isKeyPressed("left")) {
            //the player moves left as dictated by the moveLeft function
            this.moveLeft();
        }
        //if no arrow key is pressed
        else {
            //the player does not move
            this.body.vel.x = 0;
        }
        //checks if the up arrow key is pressed
        if (me.input.isKeyPressed("jump")) {
            //checks if mario is not already jumping or falling
            if (!this.body.jumping && !this.body.falling) {
                this.jump();
            }
        }
        //this.attacking is true if the "a" key is pressed
        this.attacking = me.input.isKeyPressed("attack");
    },
    moveRight: function() {
        //sets the direction the player is facing to right
        this.facing = "right";
        //moves the player's position to the right
        this.body.vel.x += this.body.accel.x * me.timer.tick;
        //flips the animation
        this.flipX(true);
    },
    moveLeft: function() {
        //sets the direction the player is facing to left
        this.facing = "left";
        //moves the position of the player to the left
        this.body.vel.x -= this.body.accel.x * me.timer.tick;
        //the animation stays the same
        this.flipX(false);
    },
    jump: function() {
        //sets mario's velocity in the y direction to the y velocity from setVelocity and smooths animation
        this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
        //makes jumping variable true
        this.body.jumping = true;
    },
    checkAbilityKeys: function() {
        // if the "q" key is pressed...
        if (me.input.isKeyPressed("skill1")) {
            //the level of ability1 is increased
            game.data.ability1 += 1;
            this.Bubble();
        }
        //if the "w" key is pressed...
        else if (me.input.isKeyPressed("skill2")) {
            //the level of ability2 is increased
            game.data.ability2 += 1;
            this.makeWhirlpool();
        }
        //if the "e" key is pressed...
        else if (me.input.isKeyPressed("skill3")) {
            //the level of ability3 is increased
            game.data.ability3 += 1;
            this.throwSpear();
        }
    },
    throwSpear: function() {
         //if at least 3 seconds have passed since the last whirlpool was created and the level of ability3 is more than 0
        if (this.now - this.lastSpear >= game.data.spearTimer && game.data.ability3 > 0) {
            this.lastSpear = this.now;
            //adds the spear to the world
            var spear = me.pool.pull("spear", this.pos.x, this.pos.y, {}, this.facing);
            me.game.world.addChild(spear, 10);
        }
    },
    makeWhirlpool: function() {
        //if at least 5 seconds have passed since the last whirlpool was created and the level of ability2 is more than 0
        if (this.now - this.lastWhirlpool >= game.data.whirlpoolTimer && game.data.ability2 > 0) {
            this.lastWhirlpool = this.now;
            //adds a whirlpool to the world
            var whirlpool = me.pool.pull("whirlpool", this.pos.x, this.pos.y, {}, this.facing);
            me.game.world.addChild(whirlpool, 10);
        }
    },
    Bubble: function() {
         //if at least 1 seconds have passed since the last whirlpool was created and the level of ability1 is more than 0
        if (this.now - this.lastBurst >= game.data.burstTimer && game.data.ability1 > 0) {
            this.lastBurst = this.now;
            //adds a bubble to the world
            var bubble = me.pool.pull("bubble", this.pos.x, this.pos.y, {}, this.facing);
            me.game.world.addChild(bubble, 10);
        }
    },
    setAnimation: function() {
        //if the attack key is pressed...
        if (this.attacking) {
            //and if the animation is not already "attack"...
            if (!this.renderable.isCurrentAnimation("attack")) {
                //set the animation to "attack" and then "idle"
                this.renderable.setCurrentAnimation("attack", "idle");
                this.renderable.setAnimationFrame();
            }
        }
        //if the player is moving and it is not attacking
        else if (this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")) {
            //and if the player is not already walking
            if (!this.renderable.isCurrentAnimation("walk")) {
                //the animation is set to walk
                this.renderable.setCurrentAnimation("walk");
            }
        }
        //if the player is not attacking
        else if (!this.renderable.isCurrentAnimation("attack")) {
            //the player is idle
            this.renderable.setCurrentAnimation("idle");
        }
    },
    loseHealth: function(damage) {
        //the health decreases by the value passed to the function
        this.health = this.health - damage;
    },
    collideHandler: function(response) {
        //if the player collides with something, then a function containing the response is called
        if (response.b.type === 'EnemyBaseEntity') {
            this.collideWithEnemyBase(response);
        }
        else if (response.b.type === 'EnemyCreep') {
            this.collideWithEnemyCreep(response);
        }
        else if (response.b.type === 'TeamCreep') {
            this.collideWithTeamCreep(response);
        }
        else if (response.b.type === 'TeamCreep2') {
            this.collideWithTeamCreep2(response);
        }
    },
    collideWithEnemyBase: function(response) {
        var ydif = this.pos.y - response.b.pos.y;
        var xdif = this.pos.x - response.b.pos.x;

        if (ydif < -60 && xdif < 60 && xdif > -40) {
            this.body.falling = false;
            this.body.vel.y = -1;
        }
        else if (xdif > -30 && this.facing === 'right') {
            this.body.vel.x = 0;
            this.pos.x = this.pos.x - 1;
        }
        else if (xdif < 70 && this.facing === 'left') {
            this.body.vel.x = 0;
            this.pos.x = this.pos.x + 1;
        }

        if (this.renderable.isCurrentAnimation("attack") && this.now - this.lastHit >= game.data.playerAttackTimer) {
            this.lastHit = this.now;
            response.b.loseHealth(game.data.playerAttack);
        }
    },
    collideWithEnemyCreep: function(response) {
        var xdif = this.pos.x - response.b.pos.x;
        var ydif = this.pos.y - response.b.pos.y;

        this.stopMovement(xdif);
        if (this.checkAttack(xdif, ydif)) {
            this.hitCreep(response);
        }
    },
    collideWithTeamCreep: function(response) {
        var xdif = this.pos.x - response.b.pos.x;
        var ydif = this.pos.y - response.b.pos.y;

        this.stopMovement(xdif);
        if (this.checkAttack(xdif, ydif)) {
            this.hitCreep(response);
        }
    },
    collideWithTeamCreep2: function(response) {
        var xdif = this.pos.x - response.b.pos.x;
        var ydif = this.pos.y - response.b.pos.y;

        this.stopMovement(xdif);
        if (this.checkAttack(xdif, ydif)) {
            this.hitCreep(response);
        }
    },
    stopMovement: function(xdif) {
        if (xdif > 30) {
            this.pos.x = this.pos.x + 1;
            this.body.vel.x === 0;
        } else if (xdif < -30) {
            this.pos.x = this.pos.x - 1;
            this.body.vel.x === 0;
        }
    },
    checkAttack: function(xdif, ydif) {
        if (this.renderable.isCurrentAnimation("attack") && (this.now - this.lastHit >= game.data.playerAttackTimer) && (Math.abs(ydif) <= 40) &&
                (((xdif > 0) && this.facing === "left") || ((xdif < 0) && this.facing === "right"))) {
            this.lastHit = this.now;
            return true;
        }
        return false;
    },
    hitCreep: function(response) {
        if (response.b.health <= this.attack) {
            game.data.gold += 1;
        }
        response.b.loseHealth(game.data.playerAttack);
    }
});





