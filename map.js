var firebaseConfig = {
    apiKey: "AIzaSyD3vFhz2lyOHHff37Ug0pVCUasB3t1AA7E",
    authDomain: "mytaxiapp10-b750f.firebaseapp.com",
    databaseURL: "https://mytaxiapp10-b750f.firebaseio.com",
    projectId: "mytaxiapp10-b750f",
    storageBucket: "",
    messagingSenderId: "333287307973",
    appId: "1:333287307973:web:663797bb9c566d39018eac"
  };

firebase.initializeApp(firebaseConfig);

var tstatus = ["desconectado","active","busy","recess","problems","accepted","positive","assigned"];

var dbRefDrivers = firebase.database().ref("drivers");

dbRefDrivers.orderByChild("status").startAt(1).on("value", function(snapshot) {
	
			var markers = [];
            markersLayer.clearLayers();
	
		snapshot.forEach(function(data) {
			
					
			latitud = data.child("latitud").val();
			longitud = data.child("longitud").val();
			title = data.child("name").val();
			status =  tstatus[data.child("status").val()];
			
			var marker;

			var url = 'Images/';
            url += 'cabs' + '/';
            url += title + status + '.png';
            var cabIcon = new LeafIcon({ iconUrl: url });
            marker = L.marker([latitud, longitud], { icon: cabIcon });
			
			markersLayer.addLayer(marker);
			
			});
	});
