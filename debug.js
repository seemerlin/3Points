/**
 * Created with JetBrains WebStorm.
 * User: seemerlin
 * Date: 9/17/13
 * Time: 12:22 AM
 * To change this template use File | Settings | File Templates.
 */

function Debug()
{
    this.div = document.getElementById('debug');
    this.msg = '';

    this.clean = function()
    {
        this.msg = '';
    };

    this.log = function(msg)
    {
        this.msg = msg;
    };

    this.add = function(msg)
    {
        this.msg += msg;
    };

    this.draw = function()
    {
        this.div.innerHTML = this.msg;
    }
}
