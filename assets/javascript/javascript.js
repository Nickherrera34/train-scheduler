var minutesAway;
var name = "";
var destination = "";
var frequency;
var nextArrival;
var startTime;


$(document).ready(function(){
	// Initialize Firebase
  var config = {
    apiKey: "AIzaSyA-Y5MQnT5uVZp9wB8Z59l9DFLYM6NS3GE",
    authDomain: "train-scheduler-2e795.firebaseapp.com",
    databaseURL: "https://train-scheduler-2e795.firebaseio.com",
    projectId: "train-scheduler-2e795",
    storageBucket: "",
    messagingSenderId: "356905764795"
  };
  firebase.initializeApp(config);
 ;
  
  var database = firebase.database();


	$("#submit").on("click", function(event){
		event.preventDefault();
		$("#tableBody").empty();

		name = $("#nameInput").val().trim();
		destination = $("#destinationInput").val().trim();
		frequency = $("#frequencyInput").val().trim();
		startTime = $("#startTimeInput").val().trim();
		console.log(name, destination, frequency);

		calculations();

		database.ref().push({
			name: name,
			destination: destination,
			frequency: frequency,
			nextArrival: nextArrival,
			minutesAway: minutesAway,

		});//end of push()


	});

	//on Database Change add elements to table
	database.ref().on("value", function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			var newTableRow = $("<tr>");
			var nameData = $("<td>");
			var destinationData = $("<td>");
			// var startDateData = $("<td>");
			var frequency = $("<td>");			
			var nextArrival = $("<td>");
			var minutesAway = $("<td>");
			nameData.html(childSnapshot.val().name);
			destinationData.html(childSnapshot.val().destination);
			startDateData.html(childSnapshot.val().startDate);
			frequency.html(childSnapshot.val().monthsWorked);
			nextArrival.html(childSnapshot.val().monthlyRate);
			minutesAway.html(childSnapshot.val().totalBilled);
			newTableRow.append(nameData, destinationData, frequency); 
				// nextArrival, minutesAway);
			$("#tableBody").append(newTableRow);
		});
	});


	function calculations(){

		 // First Train Time (pushed back 1 year to make sure it comes before current time)
	    var trnTimeConverted = moment(startTime, "HH:mm").subtract(1, "years");
	    console.log(trnTimeConverted);

	  // Current Time
	    var currentTime = moment();
	    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

	    // Difference between the times
	    var diffTime = moment().diff(moment(trnTimeConverted), "minutes");
	    console.log("DIFFERENCE IN TIME: " + diffTime);

	    // Time apart (remainder)
	    var trnRemainder = diffTime % frequency;
	    console.log(trnRemainder);

	    // Minute Until Train
	    var trnMinutesTill = frequency - trnRemainder;
	    console.log("MINUTES TILL TRAIN: " + trnMinutesTill);

	    // Next Train
	    nextArrival = moment().add(trnMinutesTill, "minutes");
	    console.log("ARRIVAL TIME: " + moment(nextArrival).format("HH:mm"));

	}//end of calculations()

});//end document.ready()