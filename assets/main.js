;(function(){

	//autocomplete feature bindings
	var a1 = AutoComplete.init({
			container: "#team",
			suggetionArea: "#suggetion-area-1",
			dataSource: {
				data: data,
				property: "team"
			},
			events : {
				onselect : function(data, dataFilter) {
					document.getElementById("employee").value = "";
					document.getElementById("employee").removeAttribute("disabled");
					a2.setDataSource(data.employees);
				}
			}
		});

	var a2 = AutoComplete.init({
		container: "#employee",
		suggetionArea: "#suggetion-area-2",
		dataSource: ["Engineering", "Finance", "HR"],
		events : {
			onselect : function(data, dataFilter) {

			}
		}
	});

	var cance_btn = function(e) {
		var team = document.getElementById("team").value,
			employee = document.getElementById("employee").value,
			check;

		if(team || employee){
			check = confirm("Do you want to close ?");
			!check && e.preventDefault();
		}
	};

	var ok_btn = function(e) {
		e.preventDefault();
		var team = document.getElementById("team").value,
			employee = document.getElementById("employee").value,
			check = false;

		if(!team || !employee) {
			alert("Please select options");
			return;
		}	
		for(var i=0; i<data.length; i++) {
			if(data[i].team === team && data[i].employees.indexOf(employee) !== -1) {
				check = true;
				break;
			}
		}

		if(check)	
			console.log("Valid");
		else 
			alert("employee name typed does not match an employee in the data");	
	};

	//btn interations
	document.getElementById("closelBtn").addEventListener("click", cance_btn);
	document.getElementById("cancelBtn").addEventListener("click", cance_btn);
	document.getElementById("okBtn").addEventListener("click", ok_btn);

})();