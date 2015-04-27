game.Characters = me.ScreenObject.extend({
    onResetEvent: function() {
        me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage("exp-screen")), -10);
        me.input.bindKey(me.input.KEY.F1, "F1");
        me.input.bindKey(me.input.KEY.F2, "F2");
        me.input.bindKey(me.input.KEY.F3, "F3");
        me.input.bindKey(me.input.KEY.F4, "F4");
        me.input.bindKey(me.input.KEY.F5, "F5");
        var goldProductionCost = ((Number(game.data.exp1) + 1) * 5);
        me.game.world.addChild(new (me.Renderable.extend({
            init: function() {
                this._super(me.Renderable, 'init', [10, 10, 300, 50]);
                this.font = new me.Font("Arial", 26, "white");


            },
            draw: function(renderer) {
                this.font.draw(renderer.getContext(), "PRESS F1 to F4 TO BUY, PRESS F5 TO SKIP", this.pos.x, this.pos.y);
                this.font.draw(renderer.getContext(), "CURRENT EXP: " + game.data.exp.toString(), this.pos.x + 100, this.pos.y + 50);
                this.font.draw(renderer.getContext(), "F1: SEA KING", this.pos.x, this.pos.y + 100);
                this.font.draw(renderer.getContext(), "F2: ORC", this.pos.x, this.pos.y + 150);
                this.font.draw(renderer.getContext(), "F3: FISH", this.pos.x, this.pos.y + 200);
                this.font.draw(renderer.getContext(), "F4: UNICORN", this.pos.x, this.pos.y + 250);
            }
        })));
        this.handler = me.event.subscribe(me.event.KEYDOWN, function(action, keyCode, edge) {
            if (action === "F1") {
                game.data.character = "seaKing";
                me.state.change(me.state.PLAY);
            } else if (action === "F2") {
                game.data.character = "orcSpear";
                me.state.change(me.state.PLAY);
            }
            else if (action === "F3") {
                me.state.change(me.state.PLAY);
            }
            else if (action === "F4") {
                me.state.change(me.state.PLAY);
            }
            else if (action === "F5") {
                me.state.change(me.state.PLAY);
            }
        });
    },
    /**	
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        me.input.unbindKey(me.input.KEY.F1, "F1");
        me.input.unbindKey(me.input.KEY.F2, "F2");
        me.input.unbindKey(me.input.KEY.F3, "F3");
        me.input.unbindKey(me.input.KEY.F4, "F4");
        me.input.unbindKey(me.input.KEY.F5, "F5");
        me.event.unsubscribe(this.handler);
    }
});



