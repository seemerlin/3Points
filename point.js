/**
 * Created with JetBrains WebStorm.
 * User: seemerlin
 * Date: 9/17/13
 * Time: 12:33 AM
 * To change this template use File | Settings | File Templates.
 */

function Point(x, y)
{
    this.x = x;
    this.y = y;

    this.hover = false;
    this.selected = false;

    this.draw = function()
    {
        _context.fillStyle = 'rgb(255,0,0)';
        _context.fillRect(this.x-0.5, this.y-0.5, 2, 2);

        var color =  'rgb(255,0,0);';
        if(this.hover) color = 'rgb(255,0,0);';
        if(this.selected) color = 'rgb(0,0,255);';

        if(this.hover || this.selected)
        {
            _context.beginPath();
            _context.arc(this.x+0.5, this.y+0.5, 2, 0, Math.PI*2,false);
            _context.strokeStyle = color;
            _context.lineHeight = 2;
            _context.stroke();
            _context.closePath();
        }
    }

    this.distance = function(point)
    {
        if(point instanceof Point)
        {
            return Math.sqrt(Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2));
        }

        return _screen.height * _screen.width;
    }
}