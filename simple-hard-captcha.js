/**
 * Created by shuding on 9/30/15.
 * <ds303077135@gmail.com>
 */

var path = require('path');

var Canvas = require('canvas');
var font   = new Canvas.Font('ArialBlack', path.join(__dirname, 'static', 'ArialBlack'));
font.addFace(path.join(__dirname, 'static', 'ArialBlack'), 'normal');

module.exports = SHC;

var ZOOM          = 2;
var FIXED_OPTIONS = {
    chrlst:    'ABCDEFGHJKLMNPQRSTUVXYZ',
    zoom:      ZOOM,
    lineWidth: 1,
    width:     ~~(75 * ZOOM),
    height:    ~~(14 * ZOOM)
};

var rndpnm = function (r, m) {
    return (Math.random() - 0.5) * r * m;
};
var rndpm  = function (r, m) {
    return (Math.random()) * r * m;
};

function Transformer() {
    var ox, oy, ct, st;
    this.setTrs = function (x, y, t) {
        ox = x;
        oy = y;
        ct = Math.cos(t);
        st = Math.sin(t);
    };
    this.text   = function (ctx, ctxfun, str, x, y) {
        ctxfun.call(ctx, str, x * ct - y * st, x * st + y * ct + 24);
    };
}

function SHC() {
    this.width     = FIXED_OPTIONS.width;
    this.height    = FIXED_OPTIONS.height;
    this.zoom      = FIXED_OPTIONS.zoom;
    this.chrlst    = FIXED_OPTIONS.chrlst;
    this.lineWidth = FIXED_OPTIONS.lineWidth;

    this.icanvas        = new Canvas();
    this.icanvas.width  = this.width;
    this.icanvas.height = this.height;
}

SHC.prototype.draw = function () {
    var cntletter = 4;
    var anglerange = 0.3;
    var padding = -0.05;
    var paddedwidth = 1 - padding;
    var offxrange = 0.05;
    var stylebg   = "white";
    var stylefg = "black";
    var xhl;

    var ctx  = this.icanvas.getContext('2d');
    ctx.addFont(font);
    ctx.font = "44pt 'ArialBlack'";
    //ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    var trs     = new Transformer();
    var capstr  = "";
    var letters = new Array(cntletter);

    for (xhl = 0; xhl < cntletter; xhl++) {
        letters[xhl]       = {};
        letters[xhl].chr   = this.chrlst[Math.floor(Math.random() * this.chrlst.length)];
        letters[xhl].x     = this.width * padding * 0.5 + (xhl + 0.5) * this.width * paddedwidth / cntletter + rndpnm(offxrange, this.width);
        letters[xhl].y     = this.height * 0.45;
        letters[xhl].angle = rndpnm(anglerange, Math.PI);
        letters[xhl].fill  = (Math.random()) < 0.5 ? 0 : 1;

        if ("NWV".indexOf(letters[xhl].chr) !== -1 && xhl > 0 && "NWV".indexOf(letters[xhl - 1].chr) !== -1) {
            letters[xhl].chr = "A";
        }
        capstr += letters[xhl].chr;
    }

    ctx.fillStyle = stylebg;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.strokeStyle = stylefg;
    ctx.lineWidth   = 6 * this.zoom;
    ctx.beginPath();
    for (var xhn = 0; xhn < 5; xhn++) {
        ctx.moveTo(rndpm(1, this.width), rndpm(1, this.height));
        ctx.lineTo(rndpm(1, this.width), rndpm(1, this.height));
    }
    ctx.stroke();

    ctx.strokeStyle = stylebg;
    for (xhl = 0; xhl < cntletter; xhl++) {
        ctx.save();
        trs.setTrs(0, 0, -(letters[xhl].angle));
        ctx.rotate(letters[xhl].angle);
        ctx.lineWidth = (letters[xhl].fill ? 2 : 3) * this.zoom;
        trs.text(ctx, ctx.strokeText, letters[xhl].chr, letters[xhl].x, letters[xhl].y);
        ctx.restore();
    }

    ctx.lineWidth   = this.zoom * this.lineWidth;
    ctx.fillStyle   = stylefg;
    ctx.strokeStyle = stylefg;
    for (xhl = 0; xhl < cntletter; xhl++) {
        ctx.save();
        trs.setTrs(0, 0, -(letters[xhl].angle));
        ctx.rotate(letters[xhl].angle);
        trs.text(ctx, letters[xhl].fill === 0 ? ctx.strokeText : ctx.fillText, letters[xhl].chr, letters[xhl].x, letters[xhl].y);
        ctx.restore();
    }

    ctx.strokeStyle = stylebg;
    for (xhl = 0; xhl < cntletter; xhl++) {
        ctx.lineWidth = (letters[xhl].fill === 0 ? 1 : 2) * this.zoom;
        ctx.beginPath();
        ctx.moveTo(letters[xhl].x + rndpnm(1, this.width / cntletter), this.height / 2 + rndpnm(1, this.height) / 2);
        ctx.lineTo(letters[xhl].x + rndpnm(1, this.width / cntletter), this.height / 2 + rndpnm(1, this.height) / 2);
        ctx.stroke()
    }

    this.result = capstr;
};

SHC.prototype.toDataURL = function () {
    return this.icanvas.toDataURL();
};
