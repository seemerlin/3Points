/**
 * Created with JetBrains WebStorm.
 * User: seemerlin
 * Date: 9/16/13
 * Time: 11:58 PM
 * To change this template use File | Settings | File Templates.
 */

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
            || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());

var uniqueVariable = 0;
function unique()
{
    console.log('unique');
    uniqueVariable++;
    return uniqueVariable;
}

Array.prototype.remove = function (index) {
    this.splice(index, 1);
};

var _canvas = false;
var _context = false;

var _screen = new Screen();
var _debug = new Debug();
var _mouse = new Mouse();

var _keyCode = false;

var hover_points = [];
var hover_triangles = [];

var selected_points = [];
var selected_triangles = [];

var active_points = [];

var triangles = [];

function Points ()
{
    this.item = [];
    this.itemHovered = [];
    this.itemSelected = [];

    this.removePoint = function(point)
    {
        var pos = this.searchPoint(point);
        this.item.remove(pos);
        this.refresh();
    }

    this.refresh = function()
    {
        this.merge();

        this.itemHovered = [];
        this.itemSelected = [];

        var h = 0;
        for(var i = 0; i < this.item.length; i++)
        {
            if(this.item[i].hover)
            {
                this.itemHovered.push(this.item[i]);
            }

            if(this.item[i].selected)
            {
                this.itemSelected.push(this.item[i]);
            }
        }
    };

    this.searchPoint = function(point)
    {
        for(var i = 0; i < this.item.length; i++)
        {
            if(this.item[i].equal( point ))
            {
                return i;
            }
        }
    };

    this.merge = function()
    {
        for(var i = 0; i < this.item.length; i++)
        {
            for(var j = 0; j < this.item.length; j++)
            {
                if(i != j) // skip self
                {
                    // TODO: Add snap point to external config
                    if(this.item[i].distance(this.item[j]) < 9)
                    {
                        // TODO: Search this point in triangles

                        this.item.remove(j);
                        i = 0;

                        break;
                    }
                }
            }
        }
    }
}

var _points = new Points();

function run()
{
    init();
    resize();

    loop();
}

function mousedown(evt)
{
    _debug.log('mousedown');

    if(_points.itemHovered.length)
    {
        for(var p = 0; p < _points.itemHovered.length; p++)
        {
            _mouse.snap.push( _points.item[ _points.searchPoint(_points.itemHovered[p]) ] );
        }


        console.log('add snap');
        _mouse.snapPositon.x = _mouse.position.x;
        _mouse.snapPositon.y = _mouse.position.y;
    }
    else
    {
        _points.item.push( new Point( _mouse.position.x, _mouse.position.y) );
    }

    _points.refresh();
}

function mousemove(evt)
{
    _debug.log('mousemove');

    _mouse.mousemove(evt);

    if(_mouse.snap.length)
    {
        for(var i = 0; i < _mouse.snap.length; i++)
        {
            _mouse.snap[i].x = _mouse.position.x;
            _mouse.snap[i].y = _mouse.position.y;
        }

        return;
    }

//    hover_points = [];
    for(var p = 0; p < _points.item.length; p++)
    {
        // TODO: Add snap point to external config
        if(_points.item[p].distance( _mouse.position ) < 9) // snap point
        {
            _points.item[p].hover = true;
        }
        else
        {
            _points.item[p].hover = false;
        }
    }

    _points.refresh();

    switch(_keyCode)
    {
        case 70: // f - select triangle
        {
            for(var t = 0; t < triangles.length; t++)
            {
                // TODO: Add snap point to external config
                if(triangles[t].pointInTriangle( _mouse.position )) // snap point
                {
                    triangles[t].hover = true;
                }
                else
                {
                    triangles[t].hover = false;
                }
            }

            break;
        }
    }
}

function mouseup(evt)
{
    _debug.log('mouseup');

    if(_mouse.snap.length)
    {
        for(var s = 0; s < _mouse.snap.length; s++)
        {
            _mouse.snap[s].selected = _mouse.position.equal( _mouse.snapPositon) ? true : false;
        }
    }

    _mouse.snap = [];

    _points.refresh();
}

function keydown(evt)
{
    _debug.log('keydown ' + evt.keyCode);

    _keyCode = evt.keyCode;

    switch(evt.keyCode)
    {
        case 67:    // c - clear
        {
            for(var p = 0; p < _points.item.length; p++)
            {
                _points.item[p].hover = false;
                _points.item[p].selected = false;
            }

            break;
        }

        case 88:    // x - remove point
        {
            var pointToRemove = [];
            for(var p = 0; p < _points.itemSelected.length; p++)
            {
//                    // validate triangles
//                    for(var i = 0; i < triangles.length; i++)
//                    {
//                        console.log('a ' + triangles[i].a.equal(points[p]) + ' b ' + triangles[i].b.equal(points[p]) + ' c ' + triangles[i].c.equal(points[p]))
//                        if( triangles[i].a.equal(points[p]) ||
//                            triangles[i].b.equal(points[p]) ||
//                            triangles[i].c.equal(points[p]) )
//                        {
//                            console.log('remove triangle');
//                            triangles.remove(i);
//                            i = 0;
//                        }
//                    }

                console.log('prepare points to remove');
                pointToRemove.push(_points.itemSelected[p]);
            }

            for(var p = 0; p < pointToRemove.length; p++)
            {
                console.log('remove point');
                _points.removePoint( pointToRemove[p] );
            }

            break;
        }

        case 84:    // t - create triangle
        {

            if(_points.itemSelected.length == 3)
            {
                triangles.push( new Triangle(
                    _points.itemSelected[0],
                    _points.itemSelected[1],
                    _points.itemSelected[2]
                ) );

                for(var p = 0; p < _points.itemSelected.length; p++)
                {
                    _points.item[ _points.searchPoint(_points.itemSelected[p]) ].selected = false;
                }
            }
            else
            {
                _debug.log('Invalid point count ' + _points.itemSelected.length);
            }

            break;
        }
    }

    _points.refresh();
}

function keyup(evt)
{
    _keyCode = false;

    for(var p = 0; p < _points.item.length; p++)
    {
        _points.item[p].hover = false;
    }

    for(var t = 0; t < triangles.length; t++)
    {
        triangles[t].hover = false;
    }

    _debug.log('keyup');
}

function init()
{
    _canvas = document.getElementById('c');
    _canvas.style.position = 'absolute';
    _context = _canvas.getContext('2d');

    document.onmousedown = mousedown;
    document.onmousemove = mousemove;
    document.onmouseup = mouseup;

    document.onkeydown = keydown;
    document.onkeyup = keyup;
}

function resize()
{
    _screen.width = document.documentElement.clientWidth;
    _screen.height = document.documentElement.clientHeight;

    if (_canvas)
    {
        _canvas.width = _screen.width;
        _canvas.height = _screen.height;
    }
}

function loop()
{
//    requestAnimationFrame(loop);
    setInterval("draw()", 1000/10);
    draw();
}

function draw()
{
    _context.fillStyle = "rgb(255,255,255)";
    _context.fillRect(0, 0, _screen.width, _screen.height);

    _screen.drawGrid();

    _debug.draw();

    for(var t = 0; t < triangles.length; t++)
    {
        triangles[t].draw();
    }

    for(var p = 0; p < _points.item.length; p++)
    {
        _points.item[p].draw();
    }
}
