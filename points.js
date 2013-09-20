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
        var pos = this.searchPointById(point.id);
        this.item.remove(pos);
        this.refresh();
    }

    this.refresh = function()
    {
        this.merge();

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


    this.getPointById = function(id)
    {
        return this.item[ this.searchPointById(id) ];
    }

    this.searchPointById = function(id)
    {
        for(var i = 0; i < this.item.length; i++)
        {
            if(this.item[i].id == id)
            {
                return i;
            }
        }
    };

    this.inArray = function(points, point)
    {
        for(var i = 0; i < points.length; i++)
        {
            if(points[i].id == point.id)
            {
                return true;
            }
        }

        return false;
    }

    this.merge = function()
    {
        var pointsToRemove = [];
        var pointsToSave = [];

        for(var i = 0; i < this.item.length; i++)
        {
            for(var j = 0; j < this.item.length; j++)
            {
                if(i != j && !this.inArray(pointsToSave, this.item[i]))
                {
                    if(this.item[i].distance(this.item[j]) < 9)
                    {
                        pointsToRemove.push( this.item[i] );
                        pointsToSave.push( this.item[j] );

                        for(var t = 0; t < _triangles.item.length; t++)
                        {
                            if( _triangles.item[t].a_id == this.item[i].id )
                            {
                                console.log('replace a');
                                _triangles.item[t].a_id = this.item[ j ].id;
                            }

                            if( _triangles.item[t].b_id == this.item[i].id )
                            {
                                console.log('replace b');
                                _triangles.item[t].b_id = this.item[ j ].id;
                            }

                            if( _triangles.item[t].c_id == this.item[i].id )
                            {
                                console.log('replace c');
                                _triangles.item[t].c_id = this.item[ j ].id;
                            }
                        }
                    }
                }
            }
        }

        if(pointsToRemove.length)
        {
            console.log(pointsToRemove);

            for(var p = 0; p < pointsToRemove.length; p++)
            {
                console.log('remove point');
                this.removePoint( pointsToRemove[p] );
            }
        }
    }
}
