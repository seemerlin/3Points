/**
 * Created with JetBrains WebStorm.
 * User: seemerlin
 * Date: 9/17/13
 * Time: 12:34 AM
 * To change this template use File | Settings | File Templates.
 */

function Triangle(a, b, c)
{
    this.id = unique();

    this.a_id = a.id;
    this.b_id = b.id;
    this.c_id = c.id;

    this.hover = false;
    this.selected = false;

    this.getA = function()
    {
        return _points.getPointById(this.a_id);
    }

    this.getB = function()
    {
        return _points.getPointById(this.b_id);
    }

    this.getC = function()
    {
        return _points.getPointById(this.c_id);
    }

    this.draw = function()
    {
        var color =  'rgba(33,33,33,.5);';
        if(this.hover) color = 'rgba(0,255,0,.5);';
        if(this.selected) color = 'rgba(0,0,255.5);';

        var a = this.getA();
        var b = this.getB();
        var c = this.getC();

        _context.beginPath();
        _context.moveTo(a.x, a.y);
        _context.lineTo(b.x, b.y);
        _context.lineTo(c.x, c.y);
        _context.lineTo(a.x, a.y);
        _context.strokeStyle = color;
        _context.lineHeight = 0.5;
        _context.stroke();
        _context.closePath();
    };

    this.dot = function(_a, _b, _c)
    {
        return (_a.x - _c.x) * (_b.y - _c.y) - (_b.x - _c.x) * (_a.y - _c.y);
    };

    this.pointInTriangle = function(point)
    {
        var b1, b2, b3;

        var a = this.getA();
        var b = this.getB();
        var c = this.getC();

        b1 = this.dot(point, a, b) < 0;
        b2 = this.dot(point, b, c) < 0;
        b3 = this.dot(point, c, a) < 0;

        return ((b1 == b2) && (b2 == b3));
    }
}
