$(document).ready(function () {

    var currentHike;

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAvJVY4ZDVhoRpJcISV0G62u_ltjYhfYBo",
        authDomain: "takeahike-e9281.firebaseapp.com",
        databaseURL: "https://takeahike-e9281.firebaseio.com",
        projectId: "takeahike-e9281",
        storageBucket: "takeahike-e9281.appspot.com",
        messagingSenderId: "266652195403"
    };

    firebase.initializeApp(config);

    var dataRef = firebase.database();
    var zip = 0;

    function displayHikes() {

        $("#trailResults").empty();

        dataRef.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function (snapshot) {
            var lon = snapshot.val().lon;
            var lat = snapshot.val().lat;

            var queryURL = "https://www.hikingproject.com/data/get-trails?lat=" + lat + "&lon=" + lon + "&maxDistance=10&key=200346208-a20429d4feecdc85e7b352eb15efe568";

            // Creating an AJAX call for the zip code being searched
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {

                currentHike = response.trails;

                for (i = 0; i < 10; i++) {
                    var trail = response.trails[i].name;
                    var lngth = response.trails[i].length;
                    var condit = response.trails[i].conditionStatus;
                    var stars = response.trails[i].stars;
                    var diffic = response.trails[i].difficulty;

                    var tBody = $("#trailResults");
                    var tRow = $("<tr>");

                    var hikeInfo = response.trails[i];


                    var trailName = $("<td>").text(trail);
                    var trailLength = $("<td>").text(lngth);
                    var trailConditions = $("<td>").text(condit);
                    var trailStars = $("<td>").text(stars);
                    var trailDifficulty = $("<td>").text(diffic);
                    var button = $("<td><button class='hikeData' hikeData='" + hikeInfo.name + "'>More Info</button>");

                    // Append the newly created table data to the table row
                    tRow.append(trailName, trailLength, trailConditions, trailStars, trailDifficulty, button);
                    // Append the table row to the table body
                    tBody.append(tRow);
                };

                getHikeInfo();

            });
        });
    };

    function getHikeInfo() {

        $(".hikeData").click(function () {

            $("#detailHike").empty();
            $("#hikeImage").empty();

            console.log($(this).attr('hikeData'));
            for (j = 0; j < currentHike.length; j++) {

                if (currentHike[j].name === $(this).attr('hikeData')) {
                    console.log('match found');
                    console.log(currentHike[j]);

                    var detailBody = $("#detailHike");
                    var detailRow = $("<tr>");
                    var imgUrl = currentHike[j].imgMedium;

                    var detailName = $("<tr>").text("Name: " + currentHike[j].name);
                    var detailLocation = $("<tr>").text("Location: " + currentHike[j].location);
                    var detailSummary = $("<tr>").text("Summary: " + currentHike[j].summary);
                    var detailDifficulty = $("<tr>").text("Difficulty: " + currentHike[j].difficulty);
                    var detailLength = $("<tr>").text("Trail Length: " + currentHike[j].length);
                    var detailAscent = $("<tr>").text("Elevation Gain: " + currentHike[j].ascent);
                    var detailConditionStatus = $("<tr>").text("Trail Condition: " + currentHike[j].conditionStatus);
                    var detailConditionDate = $("<tr>").text("Trail Condition as of: " + currentHike[j].conditionDate);
                    var detailStars = $("<tr>").text("Trail Rating: " + currentHike[j].stars + " stars");

                    detailRow.append(detailName, detailLocation, detailSummary, detailDifficulty, detailLength, detailAscent, detailConditionStatus, detailConditionDate, detailStars, detailImage);
                    detailBody.append(detailRow);

                    var imageBody = $("#hikeImage");

                    var detailImage = $("<img>").attr("src", imgUrl);

                    imageBody.append(detailImage);
                };
            };
        });
    };

    function displayWeather() {

        // function handles events where a submit button is clicked
        $("#search").on("click", function (event) {
            event.preventDefault();

            $("#trailResults").empty();
            $("#weatherConditions").empty();

            // This line grabs the input from the textbox
            zip = $("#zip").val().trim();
            weatherPull(zip);
        });
        displayHikes();
    };

    function weatherPull(zip) {
        $("#trailResults").empty();
        $("#weatherConditions").empty();
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/weather?zip=" + zip + ",us&APPID=1b51cc23ba0f775c5bf239d8814745e3",
            method: "GET"
        }).then(function (response) {
            console.log(response);


            var name = response.name;
            var weather = response.weather[0].main;
            var temp = ((response.main.temp - 273.15) * 1.80 + 32);
            var tempFix = temp.toFixed(0);
            var wind = response.wind.speed;
            var humidity = response.main.humidity;


            var tBody = $("#weatherConditions");
            var tRow = $("<tr>");

            var cityName = $("<tr>").html("<td>City: </td><td>" + name + "</td>");
            var currentCondit = $("<tr>").html("<td>Conditions: </td><td>" + weather + "</td>");
            var currentTemp = $("<tr>").html("<td>Current temp: </td><td>" + tempFix + "</td>");
            var windSpeed = $("<tr>").html("<td>Wind Speed: </td><td>" + wind + " mph</td>");
            var currentHumidity = $("<tr>").html("<td>Humidity: </td><td>" + humidity + "%</td>");



            // Append the newly created table data to the table row
            tRow.append(cityName);
            tRow.append(currentCondit);
            tRow.append(currentTemp);
            tRow.append(windSpeed);
            tRow.append(currentHumidity);
            // Append the table row to the table body
            tBody.append(tRow);

            var lon = response.coord.lon;
            var lat = response.coord.lat;
            dataRef.ref().push({

                name: name,
                lat: lat,
                lon: lon,
                zip: zip,
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            });
        });
        showRecent();
    };

    function showRecent() {

        var recentSearches = [];
        var recentZip = [];
        dataRef.ref().orderByChild("dateAdded").limitToLast(2).on("value", function (snapshot) {
            snapshot.forEach(function (data) {
                recentSearches.push(data.val().name);
                recentZip.push(data.val().zip);
            });
            $("#recenthtml1").html("<a id='recentSearch1'>" + recentSearches[1] + "</a>");
            $("#recenthtml2").html("<a id='recentSearch2'>" + recentSearches[0] + "</a>");


            $("#recentSearch1").on("click", function () {
                weatherPull(recentZip[1]);
            });
            $("#recentSearch2").on("click", function () {
                weatherPull(recentZip[0]);
            });
        });
    };


    displayWeather();

    $("#trailResults").empty();
    $("#weatherConditions").empty();

});