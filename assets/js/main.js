


 $(document).ready(function() {       

 			// Menu settings
			$('#menuToggle, .menu-close').on('click', function(){
				$('#menuToggle').toggleClass('active');
				$('body').toggleClass('body-push-toleft');
				$('#theMenu').toggleClass('menu-open');
			});    

	  //       $(function() {   $( "#draggable" ).draggable(); });

	       

                   


	 	    function initialize(){
                  
                     

		            geocoder = new google.maps.Geocoder();
		            address = document.getElementById('address').value;

		            var mapOptions = {
			    		zoom: 20,
			    		disableDefaultUI: true,
			    		zoomControl: true,
			    		panControl: true,
			    		mapTypeControl: true,
			    		scaleControl: true,
			    		streetViewControl: true,
			    		overviewMapControl: true,
			    		mapTypeId:google.maps.MapTypeId.SATELLITE,
			    		tilt: 0
			    	};
		           
			    	geocoder.geocode( { 'address': address}, function(results, status) {
		                if (status == google.maps.GeocoderStatus.OK) {
		                 map.setCenter(results[0].geometry.location);
		                 x = results[0].geometry.location;

		                 }
		             }); 
			    
		         
			        var map = new google.maps.Map(document.getElementById("mapDiv"), mapOptions);


				    var mapOptions45 = {
				    		zoom: 20,
				    		disableDefaultUI: true,
				    		mapTypeId:google.maps.MapTypeId.SATELLITE,
				    		tilt: 45
				    };
		           

			    	geocoder.geocode( { 'address': address}, function(results, status) {
		                if (status == google.maps.GeocoderStatus.OK) {
		                 map45.setCenter(results[0].geometry.location);
		                 x = results[0].geometry.location;

		                 }
		            }); 
			    
		         
			    	var map45 = new google.maps.Map(document.getElementById("mapDiv45"), mapOptions45);
			    
			     
				    addButtons(map);
			        drawEditablePolygon(map);			    

	    	}

	     
		 function addButtons(map){

		    	document.getElementById('btnTerrain').addEventListener('click', function(){
		    	map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
		    	});

			    document.getElementById('btnRoadmap').addEventListener('click', function(){
			    map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
			    });

			    document.getElementById('btnSatellite').addEventListener('click', function(){
			    map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
			    });


			    document.getElementById('btnHybrid').addEventListener('click', function(){
			    map.setMapTypeId(google.maps.MapTypeId.HYBRID);
			    });

			     document.getElementById('btnCompass').addEventListener('click', function(){
			       $('#draggable').toggle();
			    });

			    document.getElementById('btnInspector').addEventListener('click', function(){
			       $('#mapDiv45').toggle();
			    });

	    	}
	   

	    function drawEditablePolygon(map) {

            	geocoder = new google.maps.Geocoder();
            	address = document.getElementById('address').value;
	    		geocoder.geocode( { 'address': address}, function(results, status) {
                		if (status == google.maps.GeocoderStatus.OK) {

                 				 map.setCenter(results[0].geometry.location);

				                 lat = results[0].geometry.location.lat();
				                 lon = results[0].geometry.location.lng();
				                 lat_adjacent = Number(results[0].geometry.location.lat()) + 0.0001;
				                 lon_adjacent = Number(results[0].geometry.location.lng()) + 0.0001;

				                 console.log("LAT: " + lat + " | ADJACENT LAT: " + lat_adjacent + " LON: " + lon + " | ADJACENT LON: " + lon_adjacent);
                                 console.log(results[0].geometry);
								 var natureCoords = [
				                 new google.maps.LatLng(lat, lon_adjacent),   
				                 new google.maps.LatLng(lat, lon),   
				                 new google.maps.LatLng(lat_adjacent, lon),   
				                 new google.maps.LatLng(lat_adjacent, lon_adjacent) ];

						         var natureArea = new google.maps.Polygon({
						         path: natureCoords,
						         strokeColor: "#FFFFFF",
						         strokeOpacity: 0.8,
						         strokeWeight: 2,
						         fillColor: "#00FF00",
						         fillOpacity: 0.6,
						         editable: true,
						         draggable: true
						         });

		         				natureArea.setMap(map);
		         				document.getElementById('placeListing').addEventListener('click', function() {
		         					valueToBeStored = calculateValue();
		         					storeInDB(valueToBeStored);

		         				});
					            document.getElementById('calculate').addEventListener('click', function(){
					            	valueToBeStored = calculateValue()
					            });

					            function calculateValue(){

							            surface_area =  Number(google.maps.geometry.spherical.computeArea(natureArea.getPath()));

							            size_premimum = Number(surface_area * 0.15);
							            size_standard = Number(surface_area * 0.10);

								        document.getElementById('results').innerHTML = "Surface Area = " + surface_area.toFixed(0) + " sq meter <br/>";
								        document.getElementById('results').innerHTML += "Size by using premium solar panels (SunPower) = " + size_premimum.toFixed(2) + " kW <br/>";
								        document.getElementById('results').innerHTML += "Size by using standard solar panels = " + size_standard.toFixed(2) + " kW <br/>";
					                    var tilt = parseInt(document.getElementById('tilt').value);
					                    var azimuth = parseInt(document.getElementById('azimuth').value); 
                   						var requestUrl="http://developer.nrel.gov/api/pvwatts/v5.json?api_key=j3q56adLB5f8m98CwVYUkC95NC8h1GMK6mcSt9OP&lat=" + lat + "&lon=" + lon + "&timeframe=monthly&system_capacity=" + size_premimum + "&module_type=1&losses=14&array_type=1&tilt=" + tilt + "&azimuth=" + azimuth + "&callback=?";
										
										$.getJSON(requestUrl, { }, function (data){ 
											console.log(data.outputs);
				                            energyGenerated = data.outputs.ac_annual;
				                            lease = energyGenerated * 0.2 * 0.15;
				                            document.getElementById('results').innerHTML += "Estimated Electricity Production = " + energyGenerated.toFixed(2) + " kWh per year <br/>";
				                            document.getElementById('results').innerHTML += "<h3>You can lease your roof for $" + lease.toFixed(2) + " per year, for 25 years. </h3>";

                            			});

                            			

                   						var requestUtilityCompanies ="http://developer.nrel.gov/api/census_rate/v3.json?api_key=j3q56adLB5f8m98CwVYUkC95NC8h1GMK6mcSt9OP&region=block&id=101&lat=" + lat + "&lon=" + lon; 
  
                    					$.getJSON(requestUtilityCompanies, { }, function (data){
                    					    document.getElementById('results2').innerHTML = "<strong>Potentially Interested Companies: </strong> <br/>";
                    						document.getElementById('results2').innerHTML += "Utility Companies in Your Area: <br/>";
                    						var i=0;
                    						utility='';
                    						while(data.outputs.utility_info[i]){
                  							console.log(data.outputs.utility_info[i].utility_name);
        									document.getElementById('results2').innerHTML += data.outputs.utility_info[i].utility_name + "<br />";
        									utility += data.outputs.utility_info[i].utility_name ;
        									i++;
        									}

        									document.getElementById('results2').innerHTML += "<button id='listnow' class='btn btn-primary'> List Now </button> <br /> <br/>";

                                            document.getElementById('listnow').addEventListener('click', function(){
        									$('#menuToggle').toggleClass('active');
											$('body').toggleClass('body-push-toleft');
											$('#theMenu').toggleClass('menu-open');
        									});

      									});

      									

      									value1 = "123";
      									value2 = "12324.234325";
      									value3 = "hallo";
      									return [value1, value2, value3];

      							};

      							function storeInDB(data){
      									data1 = data[1];
      									data2 = data[2]; 
      									/* get all the variables */ 
      									          		var name =  $("#name").val(); 
          												var email =  $("#email").val(); 
          												var phoneNumber =  $("#phoneNumber").val(); 
      									var fb = new Firebase("https://solarpanel.firebaseio.com");
    
							          		fb.push({ 	name: name,
														email: email,
														phoneNumber: phoneNumber,
														address: document.getElementById('address').value,
														roofArea: surface_area.toFixed(0), 
														leasingPrice: lease.toFixed(2),
														energyGenerated: energyGenerated.toFixed(2), 
														localElectricityComp: utility,
                                                       
														
							 				}); 
							 	};
		                 
		                 } /* END OF IF CONDITION */

		             }); /* END OF GEOCODER OPENING */
        
         	}


              $("#calculateValue").click(function(){
          	
                initialize()
          		/* WRITE YOUR CODE HERE TO CALCULATE THINGS */


          })

       
	    google.maps.event.addDomListener(window, "load", initialize);
	    




	     $('#update_address').click( function(){
	        $('#results').empty();
    		initialize();
           
	    }); 

	    });
	     



	      $(function() {
    $( "#draggable" ).draggable();
     $( "#mapDiv45" ).draggable();
  });