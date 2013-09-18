/**
 * Created with JetBrains WebStorm.
 * User: seemerlin
 * Date: 9/17/13
 * Time: 12:42 AM
 * To change this template use File | Settings | File Templates.
 */

function Mouse()
{
    this.position = new Point(0, 0);
    this.lastPosition = new Point(0, 0);

    this.snapPositon = new Point(0, 0);
    this.snap = [];

    this.mousemove = function (evt)
    {
        this.lastPosition.x = this.position.x;
        this.lastPosition.y = this.position.y;

        this.position.x = evt.pageX;
        this.position.y = evt.pageY;
    }
}
