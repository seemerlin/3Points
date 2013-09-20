/**
 * Created with JetBrains WebStorm.
 * User: seemerlin
 * Date: 9/21/13
 * Time: 12:18 AM
 * To change this template use File | Settings | File Templates.
 */

function RGB(r,g,b)
{
    this.r = r;
    this.g = g;
    this.b = b;

    this.alpha = 1;

    this.rgb = function()
    {
        return 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
    };

    this.rgba = function()
    {
        return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.alpha + ')';
    }
}
