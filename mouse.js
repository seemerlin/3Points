/**
 * Created with JetBrains WebStorm.
 * User: seemerlin
 * Date: 9/17/13
 * Time: 12:42 AM
 * To change this template use File | Settings | File Templates.
 */

function Mouse()
{
    this.x = 0;
    this.y = 0;

    this.mousemove = function (evt)
    {
        this.x = evt.pageX;
        this.y = evt.pageY;
    }
}
