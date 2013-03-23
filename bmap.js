var seens = [];
function setBrewery(id)
{
    function getBrewery(bid){
	$.get('http://api.untappd.com/v4/brewery/info/' + bid + '?client_id=E96E7134C344BEA3492EC30315C714ECCABF85AE&client_secret=199CC4FAF040E3716C0D70F4CD14EC81E5D822CF', function(data){
		brewery = data.response.brewery.brewery_name;
		$("#header").append("<h1>"+brewery+"</h1>");
	    });
    };

    getBrewery(id);

    function getData(bid) {
	$.get('http://api.untappd.com/v4/brewery/checkins/' + bid + '?client_id=E96E7134C344BEA3492EC30315C714ECCABF85AE&client_secret=199CC4FAF040E3716C0D70F4CD14EC81E5D822CF', function(data) {
		drinks = trim(data.response.checkins.items);
		process(drinks,(1000*60*20)/drinks.length)
		    });
    };

    getData(id);
    setInterval(function(){getData(id)},2060*1000);

    
}

function trim(drinks)
{
    ndrinks = new Array();
    for(i = 0; i < drinks.length ; i++)
    {
	id = drinks[i].checkin_id;
	if (seens.indexOf(id) < 0)
	{
	    ndrinks.push(drinks[i]);
	}
    }
    
    return ndrinks;
}

function process(drinks,to)
{
    if (drinks.length > 0) {
	processDrink(drinks[drinks.length-1]);
	setTimeout(function(){process(drinks.slice(0,drinks.length-1),to)},to);
    }
}

function processDrink(drink)
{
    //Get the elements we need
    drinkname = drink.beer.beer_name;
    badgeurl = drink.beer.beer_label;
    drinkurl = drink.media.items[0];
    if (drink.media.items[0]){
	drinkurl = drink.media.items[0].photo.photo_img_sm;
    }
    venue = drink.venue.venue_name;
    id = drink.checkin_id;
    $("#footer").html("<img style='float: left' height=95% src='" + badgeurl + "' />");
    if (drinkurl){
	$("#footer").append("<img style='float: right' height=95% src='" + drinkurl + "' />");
    }
    $("#footer").append("<h2>" + drinkname + "</h2>");
    if (venue)
    {
	$("#footer").append("<h2>" + venue + "</h2>");
    }
    
 
    if (drink.venue.location) {
	var currentPoint = new google.maps.LatLng(drink.venue.location.lat,drink.venue.location.lng);
	mapClose.panTo(currentPoint);
	mapFar.panTo(currentPoint);
	markerClose = new google.maps.Marker({position:currentPoint,title:"Hello"});
	markerFar = new google.maps.Marker({position:currentPoint,title:"Hello"});
	markerClose.setMap(mapClose);
	markerFar.setMap(mapFar);
    }

    seens.push(id);
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