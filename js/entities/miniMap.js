game.MiniMap = me.Entity.extend({
    init: function(x, y, settings){
        this.setSuper(x, y, settings);
        this.floating = true;
    },
     setSuper: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "mini-map",
                width: 282,
                height: 160,
                spritewidth: "282",
                spriteheight: "160",
                getShape: function() {
                    return (new me.Rect(0, 0, 282, 160)).toPolygon();
                }
            }]);
    }
});


