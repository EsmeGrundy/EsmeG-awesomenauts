game.Characters = me.ScreenObject.extend({
    onResetEvent: function() {
        //adds the screen to the world
        me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage("exp-screen")), -10);
        //binds the keys the player can use to buy things to the game
        me.input.bindKey(me.input.KEY.F1, "F1");
        me.input.bindKey(me.input.KEY.F2, "F2");
        me.input.bindKey(me.input.KEY.F3, "F3");
        me.input.bindKey(me.input.KEY.F4, "F4");
        me.input.bindKey(me.input.KEY.F5, "F5");
        me.input.bindKey(me.input.KEY.F6, "F6");
        me.game.world.addChild(new (me.Renderable.extend({
            init: function() {
                this._super(me.Renderable, 'init', [10, 10, 300, 50]);
                this.font = new me.Font("Arial", 26, "white");


            },
            draw: function(renderer) {
                this.font.draw(renderer.getContext(), "PRESS F1 to F5 TO BUY, PRESS F6 TO SKIP", this.pos.x, this.pos.y);
                this.font.draw(renderer.getContext(), "CURRENT EXP: " + game.data.exp.toString(), this.pos.x + 100, this.pos.y + 50);
                this.font.draw(renderer.getContext(), "F1: SEA KING", this.pos.x, this.pos.y + 100);
                this.font.draw(renderer.getContext(), "F2: ORC", this.pos.x, this.pos.y + 150);
                this.font.draw(renderer.getContext(), "F3: FISH", this.pos.x, this.pos.y + 200);
                this.font.draw(renderer.getContext(), "F4: NARWHAL", this.pos.x, this.pos.y + 250);
                this.font.draw(renderer.getContext(), "F5: UNICORN", this.pos.x, this.pos.y + 300);
            }
        })));
        this.handler = me.event.subscribe(me.event.KEYDOWN, function(action, keyCode, edge) {
            if (action === "F1") {
                //if the player presses F1, then the game loads the seaKing character
                game.data.character = "seaKing";
                me.state.change(me.state.PLAY);
            } else if (action === "F2") {
                //if the player presses F2, then the game loads the orc character
                game.data.character = "orcSpear";
                me.state.change(me.state.PLAY);
            }
            else if (action === "F3") {
                //if the player presses F3, then the game loads the fish character
                game.data.character = "fish";
                me.state.change(me.state.PLAY);
            }
            else if (action === "F4") {
                //if the player presses F4, then the game loads the narwhal character
                game.data.character = "narwhal";
                me.state.change(me.state.PLAY);
            }
             else if (action === "F5") {
                 //if the player presses F5, then the game loads the unicorn character
                game.data.character = "unicorn";
                me.state.change(me.state.PLAY);
            }
            else if (action === "F6") {
                //if the player presses F5, the game starts (the play screen is activated)
                me.state.change(me.state.PLAY);
            }
        });
    },
    /**	
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        //unbinds the keys so the player can use them for other purposes during the game
        me.input.unbindKey(me.input.KEY.F1, "F1");
        me.input.unbindKey(me.input.KEY.F2, "F2");
        me.input.unbindKey(me.input.KEY.F3, "F3");
        me.input.unbindKey(me.input.KEY.F4, "F4");
        me.input.unbindKey(me.input.KEY.F5, "F5");
        me.input.unbindKey(me.input.KEY.F6, "F6");
        me.event.unsubscribe(this.handler);
    }
});



