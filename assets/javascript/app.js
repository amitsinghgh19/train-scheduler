//alert("test");
// Steps to complete:
//Clock for HTML Page

function updateClock() {

  var clock = moment().format("h:mm:ss a");
  var c = $("<h2>");
  var c2 = c.append(clock);
  $("#clock").html(c2);
    
    //reload the whole page every 60 seconds
    //setTimeout(function () { location.reload(1); }, 60000);
    //or
    // Get current time in seconds
    var currentTimeSec = moment();
    console.log("Current Time in seconds:" + moment(currentTimeSec).format("ss"));
    if(moment(currentTimeSec).format("ss")==00)
    {
      // When current seconds=00
        location.reload();
    }
  };
  
  setInterval(updateClock, 1000);


   // 1. Initialize Firebase
   var config = {
    apiKey: "AIzaSyAYqQA6nI2TDHufkMkxOBRJeBRyyzpa7WM",
    authDomain: "train-scheduler-89e7c.firebaseapp.com",
    databaseURL: "https://train-scheduler-89e7c.firebaseio.com",
    projectId: "train-scheduler-89e7c",
    storageBucket: "train-scheduler-89e7c.appspot.com",
    messagingSenderId: "750352923750"
  };
  firebase.initializeApp(config);


  // 2. Create a variable to reference the database
    var database=firebase.database();
    
  // 3. Whenever user click on the button to add new train schedule 
  $("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrainTime =$("#first-train-time-input").val().trim();
    var frequency = $("#frequency-input").val().trim();

    // Creates local "temporary" object for holding new train data
    var newTrain = {
      train_name: trainName,
      train_destination: destination,
      first_train_time: firstTrainTime,
      train_frequency: frequency
    };

    // Uploads new train data to the database
    database.ref().push(newTrain);

    // Log everything to console
    console.log(newTrain.trainName);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrainTime);
    console.log(newTrain.frequency);

    alert("Train info successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-time-input").val("");
    $("#frequency-input").val("");
  });

  // 4. Create Firebase event for adding train info to the database and a row in the html when a user adds an entry
    database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().train_name;
    var destination = childSnapshot.val().train_destination;
    var firstTrainTime = childSnapshot.val().first_train_time;
    var frequency = childSnapshot.val().train_frequency;

    // Log train Info
    console.log(trainName);
    console.log(destination);
    console.log(firstTrainTime);
    console.log(frequency);

    // First Train Time (pushed back 1 year to make sure it comes before current time)
	  var firstTrainTimeConverted = moment(firstTrainTime, "hh:mm A").subtract(1, "years");
	  console.log("First Train Time Converted:" +firstTrainTimeConverted);

    // Current time
    var currentTime = moment();
    console.log("Current Time:" + moment(currentTime).format("HH:mm"));

    // Difference between times
    var differenceBtwTime = moment().diff(moment(firstTrainTimeConverted), "minutes");
    console.log("Difference in time: " + differenceBtwTime);

    // Time apart (remainder)
    var timeRemainder = differenceBtwTime % frequency;
    console.log(timeRemainder);

    // Mins left until next train
    var timeMinutesTillNxtTrain = frequency - timeRemainder;
    console.log("Minutes remaning until next train: " + timeMinutesTillNxtTrain);

    // Next train
    var nextTrainTime = moment().add(timeMinutesTillNxtTrain, "minutes").format("hh:mm A");
    console.log("Next train arrival time: " + nextTrainTime);
    
    // Create the new row and add each train's data into the table
    var newRow = $("<tr>").append(
      $("<td contenteditable='true' id='trnName'>").text(trainName),
      $("<td contenteditable='true' id='trnDest'>").text(destination),
      //$("<td>").text(firstTrainTime),
      $("<td contenteditable='true' id='trnFreq'>").text(frequency),
      $("<td>").text(nextTrainTime),
      $("<td>").text(timeMinutesTillNxtTrain),
      $("<td><button class='btn btn-default btn-primary delete-train'keyD='" + childSnapshot.key + "'  id='delete-train'>X</button></td>"),
      // $("<td><button class='btn btn-default btn-primary update-train'keyU='" + childSnapshot.key + "'  id='update-train'>UPDATE</button></td>")
    );

    // 5. Append the new row to the table
    $("#train-schedule-table > tbody").append(newRow);
   
    //Delete rows
    $(".delete-train").on("click", function (event) {
      var r = confirm("Are you sure you want to Remove this train info from the database?");
      if (r == true) {
        keyref = $(this).attr("keyD");
        database.ref().child(keyref).remove();
        window.location.reload();
      } else {
      
      }
      
    });
    
      // //Update rows
      // $(document.body).on("click", ".update-train", function() {
      //   trainName = $("#trnName").text(); // capture updated train name
      //   database.ref().push(trainName);
      // });

  // If any errors are experienced, log them to console.
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});
  