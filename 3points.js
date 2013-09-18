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

var _points = new Points();
var _triangles = new Triangles();

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
        case 77: // m - move world
        {
            _screen.move(_mouse.position);

            break;
        }

        case 70: // f - select triangle
        {
            for(var t = 0; t < _triangles.item.length; t++)
            {
                // TODO: Add snap point to external config
                if(_triangles.item[t].pointInTriangle( _mouse.position )) // snap point
                {
                    _triangles.item[t].hover = true;
                }
                else
                {
                    _triangles.item[t].hover = false;
                }
            }

            _triangles.refresh();

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
            if( !_mouse.snap[s].selected )
            {
                _mouse.snap[s].selected = _mouse.position.equal( _mouse.snapPositon) ? true : false;
            }
            else
            {
                _mouse.snap[s].selected = false;
            }
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
        case 32:    // space - select all
        {
            for(var p = 0; p < _points.item.length; p++)
            {
                _points.item[p].selected = true;
            }

            _points.refresh();

            break;
        }

        case 67:    // c - clear
        {
            for(var p = 0; p < _points.item.length; p++)
            {
                _points.item[p].hover = false;
                _points.item[p].selected = false;
            }

            break;
        }

        case 90:    // z - remove triangle
        {
            var trianglesToRemove = [];

            for(var p = 0; p < _points.itemSelected.length; p++)
            {
                // validate triangles
                for(var i = 0; i < _triangles.item.length; i++)
                {
                    if( _triangles.item[i].a.id == _points.itemSelected[p].id ||
                        _triangles.item[i].b.id == _points.itemSelected[p].id ||
                        _triangles.item[i].c.id == _points.itemSelected[p].id )
                    {
                        trianglesToRemove.push( _triangles.item[i] );
                    }
                }
            }

            for(var t = 0; t < trianglesToRemove.length; t++)
            {
                _triangles.removeTriangle( trianglesToRemove[t] );
            }

            break;
        }

        case 88:    // x - remove point
        {
            var pointToRemove = [];
            var trianglesToRemove = [];

            for(var p = 0; p < _points.itemSelected.length; p++)
            {
                // validate triangles
                for(var i = 0; i < _triangles.item.length; i++)
                {
                    if( _triangles.item[i].a.id == _points.itemSelected[p].id ||
                        _triangles.item[i].b.id == _points.itemSelected[p].id ||
                        _triangles.item[i].c.id == _points.itemSelected[p].id )
                    {
                        trianglesToRemove.push( _triangles.item[i] );
                    }
                }

                pointToRemove.push( _points.itemSelected[p] );
            }

            for(var t = 0; t < trianglesToRemove.length; t++)
            {
                _triangles.removeTriangle( trianglesToRemove[t] );
            }

            for(var p = 0; p < pointToRemove.length; p++)
            {
                console.log('remove point');
                _points.removePoint( pointToRemove[p] );
            }

            _points.refresh();

            break;
        }

        case 84:    // t - create triangle
        {

            if(_points.itemSelected.length == 3)
            {
                _triangles.item.push( new Triangle(
                    _points.itemSelected[0],
                    _points.itemSelected[1],
                    _points.itemSelected[2]
                ) );

                for(var p = 0; p < _points.item.length; p++)
                {
                    _points.item[ p ].selected = false;
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

    for(var t = 0; t < _triangles.item.length; t++)
    {
        _triangles.item[t].hover = false;
    }

    _debug.log('keyup');
}

function onmousewheel(evt)
{
    var e = window.event || e; // old IE support
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

    if(delta > 0)
    {
        _screen.upScale();
    }
    else
    {
        _screen.downScale();
    }

    console.log(delta/10);
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

    if (document.addEventListener)
    {
        // IE9, Chrome, Safari, Opera
        document.addEventListener("mousewheel", onmousewheel, false);
        // Firefox
        document.addEventListener("DOMMouseScroll", onmousewheel, false);
    }
    else
    {
        document.attachEvent("onmousewheel", onmousewheel);
    }
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

    for(var t = 0; t < _triangles.item.length; t++)
    {
        _triangles.item[t].draw();
    }

    for(var p = 0; p < _points.item.length; p++)
    {
        _points.item[p].draw();
    }
}
