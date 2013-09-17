/**
 * Created with JetBrains WebStorm.
 * User: seemerlin
 * Date: 9/17/13
 * Time: 12:00 AM
 * To change this template use File | Settings | File Templates.
 */

function Screen () {

    this.width = 0;
    this.height = 0;
    // TODO: Add grid size and grid color external config
    this.grid = 10;
    this.gridColor = 'rgb(222,222,222)';

    this.drawGrid = function ()
    {
        for(var x = 0; x < this.width; x+=this.grid)
        {
            for(var y = 0; y < this.height; y+=this.grid)
            {
                _context.fillStyle = this.gridColor;
                _context.fillRect(x,y,1,1);
            }
        }
    }
}
