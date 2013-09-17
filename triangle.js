/**
 * Created with JetBrains WebStorm.
 * User: seemerlin
 * Date: 9/17/13
 * Time: 12:34 AM
 * To change this template use File | Settings | File Templates.
 */

function Triangle(a, b, c)
{
    this.a = a;
    this.b = b;
    this.c = c;

    this.hover = false;
    this.selected = false;

    this.draw = function()
    {
        var color =  'rgb(255,0,0);';
        if(this.hover) color = 'rgb(0,255,0);';
        if(this.selected) color = 'rgb(0,0,255);';

        _context.beginPath();
        _context.moveTo(a.x, a.y);
        _context.lineTo(b.x, b.y);
        _context.lineTo(c.x, c.y);
        _context.lineTo(a.x, a.y);
        _context.strokeStyle = color;
        _context.lineHeight = 1;
        _context.stroke();
        _context.closePath();
    };

    this.dot = function(a, b, c)
    {
        return (a.x - c.x) * (b.y - c.y) - (b.x - c.x) * (a.y - c.y);
    };

    this.pointInTriangle = function(point)
    {
        var b1, b2, b3;

        b1 = this.dot(point, a, b) < 0;
        b2 = this.dot(point, b, c) < 0;
        b3 = this.dot(point, c, a) < 0;

        return ((b1 == b2) && (b2 == b3));
    }
}
