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

var drivercont = 0;
var totaltime = 0;
var availables = ["null"];
var gridzone1 = document.getElementById("ContentPlaceHolder1_gridZone1");

var taxis = document.getElementById("ContentPlaceHolder1_cbNewJobsCabs");

var tstatus = ["Desconectado","Activo","Ocupado","Receso","Problemas","Aceptado","Positivo","Asignado"];
var jobstatus =["Asignada","Aceptada","Positivo","Completada","Negativa","Rechazada"];

function mostrarDrivers(name,status) {
	if(name){
	var row = gridzone1.insertRow(drivercont);
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	cell1.innerHTML = name;
	//cell2.innerHTML = status;
	switch (status){
		case 1: row.bgColor="lightgreen";
			cell2.innerHTML = "Activo";
			break;
		case 2: row.bgColor="OrangeRed";
			cell2.innerHTML = "Ocupado";
			break;
		case 3: row.bgColor="orange";
			cell2.innerHTML="Receso";
			break;
		case 4: row.bgColor="mediumpurple";
			cell2.innerHTML="Problemas";
			break;
		case 5: row.bgColor="White";
			cell2.innerHTML="Aceptada";
			break;
		case 6: row.bgColor="LightSkyBlue";
			cell2.innerHTML="Positivo";
			break;
		case 7: row.bgColor="LightGoldenrodYellow";
			cell2.innerHTML="Asignado";
			break;
			default : return;
	}
	document.getElementById("ContentPlaceHolder1_lblZone1Total").innerHTML = ("Total " + gridzone1.rows.length);
		}
	else if (drivercont==0) {document.getElementById("ContentPlaceHolder1_lblZone1Total").innerHTML = ("Total " + drivercont);}
};

function listadrivers(input){
	input = input;
	for (let value of availables){
			let option = document.createElement("option");
			let option2 = document.createElement("option");
			if (value=="null"){
				if (input){
					option.text = "...";
					option.value = value;
					input.add(option);
					}
					option2.text = "...";
					option2.value = value;
					taxis.add(option2);
				}
				else{
					if (input){
						option.text = value;
						option.value = value;
						input.add(option);
					}
						option2.text = value;
						option2.value = value;
						taxis.add(option2);
				}
	
	}
};
	var dbRefRecentJobs = firebase.database().ref("recentjobs");
	var dbRefDrivers = firebase.database().ref("drivers");
	var dbRefPendingTasks = firebase.database().ref("pendingtasks");

	dbRefDrivers.orderByChild("ranking").on("value", function(snapshot) {
		availables = ["null"];
		gridzone1.innerHTML = "";
		drivercont = 0;
		snapshot.forEach(function(data) {
			var status = data.child("status");
			if (status.val()!==0){
				mostrarDrivers(data.child("name").val(),data.child("status").val());
				drivercont++;
				if (status.val()==1){
					availables.push(data.child("name").val());
				}
			}
			else {mostrarDrivers(null,null);}
			});
	});

	var dataCarrera = ["numTelf","comentario","addressname","fulladdress","genero","cab","time"];
	var generos = ["17H","18H","1716","1816"];

function carreraNueva() {
	
	var numTelf = document.getElementById("ContentPlaceHolder1_txtNumber").value;
	var addressname = document.getElementById("ContentPlaceHolder1_txtAddressName").value;
	var fulladdress = document.getElementById("txtAddress").value;
	var comentario = document.getElementById("ContentPlaceHolder1_txtAddress2").value;
	var genero = document.getElementById("ContentPlaceHolder1_generoDropDownList").value;
	var cab = document.getElementById("ContentPlaceHolder1_cbNewJobsCabs").value;
	
	if((numTelf)&&(addressname)&&(fulladdress)&&(genero!=="5")){
	
	var newpendingTask = dbRefPendingTasks.push();
		newpendingTask.set({
			'numTelf' : numTelf,
			'addressname': addressname,
			'fulladdress' : fulladdress,
			'comentario' : comentario,
			'genero' : genero,
			'cab' : cab,
			'time' : Date.now()
						})
			.then(function() {
			console.log('Synchronization succeeded');
			document.getElementById("ContentPlaceHolder1_txtNumber").value = "";
			document.getElementById("ContentPlaceHolder1_txtAddressName").value = "";
			document.getElementById("txtAddress").value = "";
			document.getElementById("ContentPlaceHolder1_txtAddress2").value = "";
			document.getElementById("ContentPlaceHolder1_generoDropDownList").selectedIndex = 0;
			document.getElementById("ContentPlaceHolder1_cbNewJobsCabs").selectedIndex = 0;
  			})
  			.catch(function(error) {
			console.log('Synchronization failed');
  			});
	}
	else
		alert("Debe ingresar todo los campos");
	};

function nopendingjobs(){
	document.getElementById('ContentPlaceHolder1_imgJobsToBeAssigned').style.display = 'none';
	document.getElementById('ContentPlaceHolder1_gridPendingJobs').innerHTML = '=( sin carreras pendientes';
	listadrivers();
};

dbRefPendingTasks.once("value")
.then(function(snapshot) {
				if (!snapshot.exists()) {
					nopendingjobs();		
				}
				else return true;
				});

	var tablependings = document.getElementById('ContentPlaceHolder1_gridPendingJobs');
	var pendinghead = ["Telefono","Comentarios","Nombre Direcc.","Direccion","Genero","Taxi","Time","&nbsp;"];

function updatependingjobs(childSnapshot) {
	
	if (!childSnapshot.exists()) {
			nopendingjobs();
			return;
		}
		if (tablependings.rows.length<1) {
		document.getElementById('ContentPlaceHolder1_imgJobsToBeAssigned').style.display = 'visible';
		tablependings.innerHTML = '';
		var row = tablependings.insertRow(-1);
		
		for (i=0 ; i <= childSnapshot.numChildren() ; i++ ) {
			var headerCell = document.createElement("th");
			headerCell.setAttribute("scope","col");
			headerCell.innerHTML = pendinghead[i];
			row.appendChild(headerCell);
		};
	}

	
		var row = tablependings.insertRow(-1);
	for (i=0 ; i <= childSnapshot.numChildren() ; i++ ) {
		
			var tabledata = document.createElement("td");
			if (i<4){
			var input = document.createElement("input");
				if (i==0){
					input.style.height = "38px";
					input.style.width = "85px";
					input.setAttribute("type","text");
					input.setAttribute("id",`phonecontainer${row.rowIndex}`)
				}
				else if (i==1){
					input.setAttribute("type","text");
					input.style.height = "38px";
					input.setAttribute("id",`commentcontainer${row.rowIndex}`)
				}
				else if (i==2){
					input.setAttribute("type","text");
					input.style.height = "38px";
					input.setAttribute("id",`addresnamecont${row.rowIndex}`)
				}
				else if (i==3){
					input.setAttribute("type","text");
					input.style.height = "38px";
					input.setAttribute("id",`fulladdresscont${row.rowIndex}`)
				}
			input.setAttribute("value",childSnapshot.child(dataCarrera[i]).val());
			tabledata.appendChild(input);
			row.appendChild(tabledata);
			}
		if(i==4){
			var input = document.createElement("SELECT");
			input.style.height = "38px";
			for (let value of generos) {
				var option = document.createElement("option");
				option.text = value;
				option.value = value;
				input.add(option);
			}
			input.setAttribute("id",`genselect${row.rowIndex}`)
			input.value = childSnapshot.child(dataCarrera[i]).val();
			tabledata.appendChild(input);
			row.appendChild(tabledata);
		}
		if(i==5){
			
			taxis.innerHTML = '';
			var input = document.createElement("SELECT");
			input.setAttribute("id",`selectcab${row.rowIndex}`);
			input.style.height = "38px";
			listadrivers(input);
			input.value = childSnapshot.child(dataCarrera[i]).val();
			tabledata.appendChild(input);
			row.appendChild(tabledata);
		}
		if(i==6){
			tabledata.className = "timer";
			
			var timestamp = childSnapshot.child(dataCarrera[i]).val();
			tabledata.setAttribute("valor2",timestamp);
			tabledata.setAttribute("id",`timerid${row.rowIndex}`);
			var actualtime = new Date().getTime();
			var totaltime = actualtime-timestamp;
			tabledata.setAttribute("value",totaltime);
			tabledata.innerHTML = millisToMinutesAndSeconds(totaltime);
			tabledata.style.color = "Red";
			tabledata.style.fontWeight = "Bold";
			row.appendChild(tabledata);
		};
		if (i==7){
			for(t=0 ; t<4 ; t++){
				if(t==0){
				inputdiv = document.createElement("div");
				inputdiv.style.width = "75px";
					section = document.createElement("a");
					section.setAttribute("onclick",`update(${row.rowIndex},"save","${childSnapshot.key}")`);
				section.setAttribute("title","Actualizar");
				iclass = document.createElement("button");
				iclass.className = "btn btn-success";
					iclass.innerHTML = "S";
				section.appendChild(iclass);
				inputdiv.appendChild(section);
				}
				if(t==1){
					input = document.createElement("a");
					iclass = document.createElement("button");
					input.setAttribute("onclick",`update(${row.rowIndex},"AUTO","${childSnapshot.key}")`);
					iclass.className = "btn btn-info";
					iclass.innerHTML = "A"
					input.appendChild(iclass);
					inputdiv.appendChild(input);
				}
				if(t==2){
					input = document.createElement("span");
					
					section = document.createElement("a");
					//var pkey = childSnapshot.key;
					//pkey.toString();
					section.setAttribute("onclick",`deleted(${row.rowIndex},"${childSnapshot.key}")`);
					iclass = document.createElement("button");
					iclass.className = "btn btn-danger";
					iclass.innerHTML = "B"
					section.appendChild(iclass);
					input.appendChild(section);
					inputdiv.appendChild(input);
					
				}
				if(t==3){
					
					input = document.createElement("span");
					section = document.createElement("a");
					section.setAttribute("onclick",`update(${row.rowIndex},"RESERVAR","${childSnapshot.key}")`);
					iclass = document.createElement("button");
					iclass.className = "btn btn-secondary";
					iclass.innerHTML = "R"
					section.appendChild(iclass);
					input.appendChild(section);
					inputdiv.appendChild(input);
				}
				tabledata.appendChild(inputdiv);
				row.appendChild(tabledata);
				}
		}

		}
};

dbRefPendingTasks.on('child_added', function(childSnapshot) {
		updatependingjobs(childSnapshot);
		//console.log(childSnapshot);
});

dbRefPendingTasks.on('child_removed', function() {
	
	dbRefPendingTasks.once("value")
		.then(function(snapshot) {
				if (!snapshot.exists()) {
					nopendingjobs();		
				}
				else{
					tablependings.innerHTML = '';
					snapshot.forEach(function(childSnapshot) {
						updatependingjobs(childSnapshot);
				  	});
					
				}
		});
});




//CONVERTIDOR DE MILISEGUNDOS
function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
};

//CONTADOR DE SEGUNDOS
setInterval(function(){
	var	alltimers = [];
	var alltimers = document.getElementsByClassName("timer");
	for (let i=0 ; i < alltimers.length ; i++){
		var time = alltimers[i].getAttribute("value");
		var timer = Number(time) + 1000;
		var newtime = millisToMinutesAndSeconds(timer);

		alltimers[i].innerHTML = '';
		alltimers[i].innerHTML = newtime;
		alltimers[i].setAttribute("value",timer)

		
	}}, 1000);

var tablerecentjobs = document.getElementById("ContentPlaceHolder1_gridCompletedJobs");

//funcion buscar ranking driver
function lookdriverindex(cabnumber){
	//console.log("Selected cab is " + cabnumber);
	gridzone1 = document.getElementById("ContentPlaceHolder1_gridZone1");
	let ndrivers = gridzone1.rows.length;
	for (let i=0;i<ndrivers;i++){
		if (cabnumber==gridzone1.rows[i].cells[0].innerText) return i+1;
	}
	
};

//FUNCION PARA BOTONES DE ACCION PENDING
function update(data,action,parentkey){
	
	pkey = parentkey;
	action = action;
	if (action=="save"){
		var selectedcab = document.getElementById("selectcab"+data).value;
		//console.log(selectedcab);
		
		if(selectedcab!="null"){
		
		var number = document.getElementById("phonecontainer"+data).value.substr(6,9);
		var fullnumber = document.getElementById("phonecontainer"+data).value;
		var comentario = document.getElementById("commentcontainer"+data).value;
		var addresname = document.getElementById("addresnamecont"+data).value;
		var fulladdress = document.getElementById("fulladdresscont"+data).value;
		var genero = document.getElementById("genselect"+data).value;
		
		var timervalue = document.getElementById("timerid"+data).getAttribute("valor2");
		//var status = jobstatus[0];
	
		dbRefRecentJobs.child(selectedcab).set({
			numTelf : fullnumber,
		    addressname: addresname,
			fulladdress : fulladdress,
			comentario : comentario,
			genero : genero,
			cab : selectedcab,
			time : timervalue,
			status : 0
  			},function(error){
			if (error){
			console.log(error);
			}
			else{
				console.log("Datos guardados correctamente");
				dbRefPendingTasks.child(pkey).remove().then(function() {
					console.log("Eliminada exitosamente de los pendientes");

					dbRefDrivers.child(selectedcab).child("status").set(7);
					
					let actualposition = lookdriverindex(selectedcab);
					let cont = 1;
					//console.log("La posicion del driver es " + actualposition)
					
					dbRefDrivers.orderByChild("ranking").startAt(1).once("value")
						.then(function(snapshot) {

						snapshot.forEach(function(childSnapshot) {
							
							if (actualposition>cont){
								cont++;
							}
							else{
							dbRefDrivers.child(childSnapshot.key).child("ranking").transaction(function(ranking){
								return ranking-1;							
							
							});	
							}
						})
					dbRefDrivers.child(selectedcab).child("ranking").transaction(function(ranking) {
						return snapshot.numChildren(); });
					})
					
				})
					.catch(function(error){
					console.log("Ocurrio Un error durante el proceso de bajada" + error);
					});
			}
	})
		}
		else{
		var number = document.getElementById("phonecontainer"+data).value;
		var comentario = document.getElementById("commentcontainer"+data).value;
		var addresname = document.getElementById("addresnamecont"+data).value;
		var fulladdress = document.getElementById("fulladdresscont"+data).value;
		var genero = document.getElementById("genselect"+data).value;
		
		dbRefPendingTasks.child(parentkey).update({
			
			numTelf : number,
		    addressname: addresname,
			fulladdress : fulladdress,
			comentario : comentario,
			genero : genero,
			cab : selectedcab
			
		},function(error){
			if (error){
			console.log(error);
		}else{
			console.log("UPDATE OK");
		}
		});
	}
}
};

//var recenthead = ["&nbsp;","Telefono","Comentarios","Nombre Direcc.","Direccion","Genero","Taxi","Estado","Time","&nbsp;"];
var recentjobtitle = ["&nbsp;","numTelf","comentario","addressname","fulladdress","genero","cab","status","time"];
	dbRefRecentJobs.on("child_added", function(childSnapshot) {
			
			var cell = new Array;
			var	row = tablerecentjobs.insertRow(tablerecentjobs.rows.length);
		
			row.setAttribute("id",childSnapshot.child("time").val());
			var date = new Date(Number(childSnapshot.child("time").val()));
			var hours = date.getHours();
			var minutes = "0" + date.getMinutes();
			var seconds = "0" + date.getSeconds();
			// Will display time in 10:30:23 format
			formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
		
				for (i=0;i<10;i++){
				//if (i==0) continue;
				if (i==7) {cell[i] = row.insertCell(i);
						  cell[i].innerHTML = jobstatus[childSnapshot.child(recentjobtitle[i]).val()];
						  }
				else if (i==8){
					cell[i] = row.insertCell(i);
					cell[i].innerHTML = formattedTime;
				}
				else if (i==9){
					cell[i] = row.insertCell(i);
					for(t=0 ; t<3 ; t++){
					if(t==0){
					recentdiv = document.createElement("div");
					recentdiv.style.width = "75px";
					recentsection = document.createElement("a");
						recentsection.setAttribute("onclick",`cancel`);
						recentsection.setAttribute("title","Cancelado");
					riclass = document.createElement("button");
					riclass.className = "btn btn-secondary";
						riclass.innerHTML = "C";
					recentsection.appendChild(riclass);
					recentdiv.appendChild(recentsection);
					}
					if(t==1){
						rinput = document.createElement("a");
						rinput.setAttribute("title","Negativo");
						riclass = document.createElement("button");
						rinput.setAttribute("onclick",`negative`);
						riclass.className = "btn btn-danger";
						riclass.innerHTML = "N"
						rinput.appendChild(riclass);
						recentdiv.appendChild(rinput);
					}
					if(t==2){
						rinput = document.createElement("span");

						recentsection = document.createElement("a");
						//var pkey = childSnapshot.key;
						//pkey.toString();
						recentsection.setAttribute("onclick",`up`);
						recentsection.setAttribute("title","Subir");
						riclass = document.createElement("button");
						riclass.className = "btn btn-info";
						riclass.innerHTML = "S"
						recentsection.appendChild(riclass);
						rinput.appendChild(recentsection);
						recentdiv.appendChild(rinput);

					}
					cell[i].appendChild(recentdiv);
					
					}
					
				}
			else {cell[i] = row.insertCell(i);
			
			cell[i].innerHTML = childSnapshot.child(recentjobtitle[i]).val();
			row.appendChild(cell[i]);
			}
			}
 			if (childSnapshot.child(recentjobtitle[7]).val()==0) row.style.backgroundColor="LightGoldenrodYellow";
				
			dbRefRecentJobs.child(childSnapshot.child(recentjobtitle[6]).val()).on('child_changed', function(schildSnapshot) {
				
				var actualrow = tablerecentjobs.rows[document.getElementById(childSnapshot.child("time").val()).rowIndex];
				
				switch(schildSnapshot.val()){
						
				case 1:
						actualrow.style.backgroundColor="White";
						actualrow.cells[7].innerHTML = "Aceptada";
						break;
				case 2:
						actualrow.style.backgroundColor="LightSkyBlue";
						actualrow.cells[7].innerHTML = "Positivo";
						break;
				case 3:
						actualrow.style.backgroundColor="LightGrey";
						actualrow.cells[7].innerHTML = "Completada";
						break;
				case 4:
						actualrow.style.backgroundColor="OrangeRed";
						actualrow.cells[7].innerHTML = "Negativa";
						break;
				case 5: actualrow.style.backgroundColor="palevioletred";
						actualrow.cells[7].innerHTML = "Rechazada";
				default: return;
			}

			});

	});


//funcion para borrar carreras de PendingJobs (PENDIENTE)
function deleted(index,parentkey){
	var r = confirm('Estas seguro que deseas Eliminar la Carrera?')
	if (r==true){
	//update(index,"borrar");
	//console.log(parentkey);
	var pendingjob = dbRefPendingTasks.child(parentkey)
		pendingjob.remove()
  .then(function() {
    console.log("Remove succeeded.")

  })
  .catch(function(error) {
    console.log("Remove failed: " + error.message)
  });
	
		
	
	}
	};