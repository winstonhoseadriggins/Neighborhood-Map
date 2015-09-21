var Model = [
          {name: 'Jimmy\'s Food Store', address_1: '4901 Bryan St', address_2: 'Dallas, TX 75206', phone: '(214) 823-6180', lat: 32.804476, lng:  -96.773658,
          url: 'https://www.jimmysfoodstore.com', locationId: 122958},
          {name: 'Dolly Python', address_1: '1916 N Haskell Ave', address_2: 'Dallas, TX 75204', phone: '(214) 887-3434', lat: 32.802272, lng: -96.785943,
          url: 'http://www.dollypythonvintage.com', locationId: 567284},
          {name: 'The Samurai Collection', address_1: '2501 N Harwood St', address_2: 'Dallas, TX 75201', phone: '(214) 965-1032', lat: 32.791917, lng: -96.806217,
          url: 'http://www.samuraicollection.org', locationId: 91523867},
          {name: 'Pecan Lodge', address_1: '2702 Main St', address_2: 'Dallas, TX 75226', phone: '(214) 748-8900', lat: 32.783925, lng: -96.783820,
          url: 'http://www.pecanlodge.com', locationId: 289297740},
          {name: 'Smoke', address_1: '901 Fort Worth Ave', address_2: 'Dallas, TX 75208', phone: '(214) 393-4141', lat: 32.769605, lng:  -96.837312,
          url: 'http://smokerestaurant.com', locationId: 152607},
          {name: 'Dallas Museum of Art', address_1: '1717 N Harwood St', address_2: 'Dallas, TX 75201', phone: '(214) 922-1200', lat: 32.787814, lng: -96.800793,
          url: 'https://www.dma.org', locationId: 294352157},
          {name: 'Luscher\'s Red Hots', address_1: '2653 Commerce St', address_2: 'Dallas, TX 75226', phone: '(214) 434-1006', lat: 32.783485, lng: -96.784181,
          url: 'http://www.luschers.com', locationId: 627073515},
          {name: 'Oddfellows', address_1: '316 W 7th St', address_2: 'Dallas, TX 75208', phone: '(214) 944-5958', lat: 32.748872, lng: -96.826812,
          url: 'http://oddfellowsdallas.com', locationId: 526179323},
          {name: 'We are 1976', address_1: '313 N Bishop Ave', address_2: 'Dallas, TX 75208', phone: '(214) 821-1976', lat: 32.748334, lng: -96.829321,
          url: 'http://www.weare1976.com', locationId: 684487},
          {name: 'The Cedars Social', address_1: '1326 S Lamar', address_2: 'Dallas, TX 75215', phone: '(214) 928-7700', lat: 32.769119, lng: -96.795821,
          url: 'http://www.thecedarssocial.com', locationId: 236668314}
];


var ViewModel = function () {

     var self = this;

// ** self.markerList is an empty array that is populated the markers ** //

     self.markerList = ko.observableArray([]);

// ** Instagram API ** //

     function loadData() {

// ** locations array holds the url to be passed into the ajax call ** //
          var url = 'https://api.instagram.com/v1/locations/';
          var key = '/media/recent?access_token=1962684669.6f4a010.676642d0021149d7b7d58a8cec924c0d';
          var locations = [];
               for (var i = 0; i < Model.length; i++){
               locations.push(url + Model[i].locationId + key);
               }

          var instagramRequestTO = setTimeout (function(){
          $('imgData').text("Instagram information is not available at this time... Please try again later.");
          }, 3000);

     $.each(locations, function(i,u){
          $.ajax(u,
               {
               type: "Get",
               dataType: "jsonp",
               cache: false,
               jasonp: "callback",
               asynch: false,
               success: function (response) {
                    self.markerList()[i].pic = response.data[i].images.low_resolution.url;

               clearTimeout(instagramRequestTO);

               }

          });

     });

     return false;

     }

$(loadData);

     var pinIcon = new google.maps.MarkerImage('images/pegasus.png', /* Custom map marker */
                null, /* size is determined at runtime */
                null, /* origin is 0,0 */
                null, /* anchor is bottom center of the scaled image */
                new google.maps.Size(42, 42)
                );

// ** Adding the markers to the map for each location in the array. **  //

     var marker;
          for (var i = 0; i < Model.length; i ++) {
               marker = new google.maps.Marker({
                    position: new google.maps.LatLng(Model[i].lat, Model[i].lng),
                    map: map,
                    icon: pinIcon,
                    title: Model[i].name,
                    address_1: Model[i].address_1,
                    address_2: Model[i].address_2,
                    phone: Model[i].phone,
                    pic: Model[i].pic,
                    url: Model[i].url,
                    locationId:'https://api.instagram.com/v1/locations/' + Model[i].locationId + '/media/recent?access_token=1962684669.6f4a010.676642d0021149d7b7d58a8cec924c0d',
                    animation: google.maps.Animation.DROP
               });

          self.markerList.push(marker);

// ** Initialize the Google Maps InfoWindow for display, when needed. ** //

     var infoWindow = new google.maps.InfoWindow();

// ** displayInfoAndBounce() is called when either an item clicked on in our list ** //
// ** or when a marked location is clicked on the map. ** //
//
// ** infowindow content is set **
//
// ** m = the Google Maps marker passed to this function ** //

     function displayInfoAndBounce(m) {
          infoWindow.setContent('<h2>' + m.title + '</h2>' + m.address_1 +
               '<br>' + m.address_2 + '<br>' + m.phone + '</br>' +
               '<a href=' + m.url + '>' + m.url + '</a>' + '<br>' + '<img src=' + m.pic + '>' + '</br>');

          infoWindow.open(map, m);

// ** Sets the marker in motion by checking it's status and animating it if it's idle. ** //

          if (m.getAnimation() !== null) {
               m.setAnimation(null);
          } else {
               m.setAnimation(google.maps.Animation.BOUNCE);
          }

// ** Moves the map to the markers location and assigns the new current marker. ** //

          map.panTo(m.position);

          }

// ** setTimeout() added to keep the markers from bouncing infinitely and set timing ** //

     function stopAnimation(m) {
          setTimeout (function(){
               m.setAnimation(null);
          }, 3500);
     }

// ** Filter/Search functionality ** //

     self.filter = function() {

// ** Taking the value of var str input into #filter and using .replace ** //
// ** to replace the begining lowercase letters of a word with their value ** //
// ** capitialized. **//

          var str = $('#filter').val();

          str = str.toLowerCase().replace(/\b[a-z]/g, function(self) {
               return self.toUpperCase();
          });

// ** Show/Hide list items depending on the text entered by user ** //

          $(".locList > li").each(function(){
               $(this).text().search(str) > -1 ? $(this).show() : $(this).hide();
          });

          for(var i = 0; i < self.markerList().length; i++){
          self.markerList()[i].setMap(self.markerList()[i].title.search(str) > -1 ? map : null);
          }

     };

// ** Add locations from array to the place list and the mobile dropdown-menu ** //

// ** locations added to #uiList ** //

          $('#uiList .locList').append('<li><a>' + Model[i].name +
               '<br>' + Model[i].address_1 + '<br>' + Model[i].address_2 +
               '<br>' + Model[i].phone + '<br>' + '<hr>' + '</a></li>');

// ** 'click' binding for list ** //

          $('#uiList .locList li a').last().bind('click', function(m) {
               return function () {
                    displayInfoAndBounce(m);
                    stopAnimation(m);
               };

     }(marker));

// ** Bind the click events for each map marker with the displayInfoAndBounce()function. ** //
// ** We pass the Google Maps marker as a parameter to the function, so it knows where to move the map, ** //
// ** what info to show, and identifies the marker to animate ** //

     google.maps.event.addListener(marker, 'click', function() {
          displayInfoAndBounce(this);
          stopAnimation(this);
          });

     }
};

//** Initialize Google Maps **//

var map = new google.maps.Map(document.getElementById('map-canvas'),{
      center: new google.maps.LatLng(32.789356, -96.801788),
      zoom: 13,
});

$(document).ready(function(){
ko.applyBindings(new ViewModel());
});