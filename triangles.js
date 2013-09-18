/**
 * Created with JetBrains WebStorm.
 * User: seemerlin
 * Date: 9/19/13
 * Time: 1:25 AM
 * To change this template use File | Settings | File Templates.
 */

function Triangles()
{
    this.item = [];
    this.itemHovered = [];
    this.itemSelected = [];

    this.removeTriangle = function(triangle)
    {
        var pos = this.searchTriangle(triangle);
        this.item.remove(pos);
        this.refresh();
    };

    this.searchTriangle = function(triangle)
    {
        for(var i = 0; i < this.item.length; i++)
        {
            if(this.item[i].id == triangle.id)
            {
                return i;
            }
        }
    };

    this.refresh = function()
    {
        this.itemHovered = [];
        this.itemSelected = [];

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
    }
}