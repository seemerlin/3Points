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

var points = [];
var triangles = [];

function run()
{
    init();
    resize();

    loop();
}

function mousedown(evt)
{
    _debug.log('mousedown');

    if(hover_points.length)
    {
        for(var p = 0; p < hover_points.length; p++)
        {
            points[hover_points[p]].selected = !points[hover_points[p]].selected;
        }
    }
    else
    {
        // add new point
        points.push( new Point(_mouse.x, _mouse.y) );
    }
}

function mousemove(evt)
{
    _debug.log('mousemove');
    _mouse.mousemove(evt);

    hover_points = [];
    for(var p = 0; p < points.length; p++)
    {
        // TODO: Add snap point to external config
        if(points[p].distance(new Point(_mouse.x, _mouse.y)) < 10 && !points[p].selected) // snap point
        {
            points[p].hover = true;
            hover_points.push(p);
        }
        else
        {
            points[p].hover = false;
        }
    }

    switch(_keyCode)
    {
        case 70: // f - select triangle
        {
            for(var t = 0; t < triangles.length; t++)
            {
                // TODO: Add snap point to external config
                if(triangles[t].pointInTriangle(new Point(_mouse.x, _mouse.y))) // snap point
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
}

function keydown(evt)
{
    _debug.log('keydown ' + evt.keyCode);

    _keyCode = evt.keyCode;

    switch(evt.keyCode)
    {
        case 67:    // c - clear
        {
            for(var p = 0; p < points.length; p++)
            {
                points[p].hover = false;
                points[p].selected = false;
            }

            break;
        }

        case 88:    // x - remove point
        {
            for(var p = 0; p < points.length; p++)
            {
                if(points[p].selected)
                {
                    points.remove(p);
                    p = 0;
                }
            }

            break;
        }

        case 84:    // t - create triangle
        {
            var selected_points = [];
            for(var p = 0; p < points.length; p++)
            {
                if(points[p].selected)
                {
                    selected_points.push(p);
                }
            }

            if(selected_points.length == 3)
            {
                _debug.log('New triangle');

                triangles.push( new Triangle( points[selected_points[0]], points[selected_points[1]], points[selected_points[2]] ) );
                for(var p = 0; p < selected_points.length; p++)
                {
                    points[selected_points[p]].selected = false;
                }
            }
            else
            {
                _debug.log('Invalid point count ' + selected_points);
            }

            break;
        }
    }
}

function keyup(evt)
{
    _keyCode = false;

    for(var p = 0; p < points.length; p++)
    {
        points[p].hover = false;
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
    requestAnimationFrame(loop);
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

    for(var p = 0; p < points.length; p++)
    {
        points[p].draw();
    }
}
