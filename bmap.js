
function setBrewery(id)
{
    $.get('brewery.json', function(data){
	    brewery = $.parseJSON(data).response.brewery.brewery_name;
	 $("#header").append("<h1>"+brewery+"</h1>");
    });


    $.get('tb.json', function(data) {
	    process($.parseJSON(data).response.checkins.items)
    });
}

function process(drinks)
{
    if (drinks.length > 0) {
	processDrink(drinks[0]);
	setTimeout(function(){process(drinks.slice(1,drinks.length))},5000);
    }
}

function processDrink(drink)
{
    //Get the elements we need
    drinkname = drink.beer.beer_name;
    badgeurl = drink.beer.beer_label;
    $("#footer").html(drinkname);
    $("#footer").append("<img src='" + badgeurl + "' />");
 
    if (drink.venue.location) {
	var currentPoint = new google.maps.LatLng(drink.venue.location.lat,drink.venue.location.lng);
	map.panTo(currentPoint);
	marker = new google.maps.Marker({position:currentPoint,title:"Hello"});
	marker.setMap(map);
    }
}

//  increases zoomFluid value at 1/2  second intervals
function zoomTo(){
    if(zoomFluid==10) return 0;
    else {
	zoomFluid ++;
	map.setZoom(zoomFluid);
	setTimeout("zoomTo()", 500);
    }
}