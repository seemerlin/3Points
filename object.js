/**
 * Created with JetBrains WebStorm.
 * User: seemerlin
 * Date: 9/17/13
 * Time: 12:34 AM
 * To change this template use File | Settings | File Templates.
 */

function Object(_triangle)
{
    this.triangle = false;

    if(_triangle instanceof Triangle)
    {
        this.triangle = _triangle;
    }
}
