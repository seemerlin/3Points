/**
 * Created with JetBrains WebStorm.
 * User: seemerlin
 * Date: 9/19/13
 * Time: 1:24 AM
 * To change this template use File | Settings | File Templates.
 */

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
//        this.merge();

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
            if(this.item[i].id == point.id)
            {
                return i;
            }
        }
    }

//    this.merge = function()
//    {
//        for(var i = 0; i < this.item.length; i++)
//        {
//            for(var j = 0; j < this.item.length; j++)
//            {
//                if(i != j) // skip self
//                {
//                    // TODO: Add snap point to external config
//                    if(this.item[i].distance(this.item[j]) < 9)
//                    {
//                        // TODO: Replace point id in triangles
//                        this.item.remove(j);
//                        i = 0;
//
//                        break;
//                    }
//                }
//            }
//        }
//    }
}
