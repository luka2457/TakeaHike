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

    function validZip() {

        var valid = /^\d{5}$/.test(zip);
        console.log(valid);
    
        if (valid === false) {
            var inCorrect = $("#incorrectZip");
            var errorMsg = $("<h5>").text("Incorrect zip code format. Please try again.");

            inCorrect.append(errorMsg);

        } else {
            var zipCorrect = $("#incorrectZip");
            var validMsg = $("<h5>").text("Search results for " + zip + ".");

            zipCorrect.append(validMsg);
        };

    };

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

                    var hikeInfo = response.trails[i];


                    var trailName = $("<span id='trail'>").text(trail);
                    var trailLength = $("<span id='trail'>").text(lngth);
                    var trailConditions = $("<span id='trail'>").text(condit);
                    var trailStars = $("<span id='trail'>").text(stars);
                    var trailDifficulty = $("<span id='trail'>").text(diffic);
                    var button = $("<span id='trail'><button class='hikeData' hikeData='" + hikeInfo.name + "'>More Info</button>");

                    tBody.append(trailName, trailLength, trailConditions, trailStars, trailDifficulty, button);
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
            validZip();

            $("#trailResults").empty();
            $("#weatherConditions").empty();
            $("#detailHike").empty();
            $("#hikeImage").empty();

            // This line grabs the input from the textbox
            zip = $("#zip").val().trim();
            console.log(zip);
            weatherPull(zip);
            $("#zip").val("");
        });
        displayHikes();

    };

    function weatherPull(zip) {
        $("#trailResults").empty();
        $("#weatherConditions").empty();
        $("#detailHike").empty();
        $("#hikeImage").empty();

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


            var detailWeather = $("#weatherConditions");

            var cityName = $("<span id='weatherResults'>").html("City: " + name);
            var currentCondit = $("<span id='weatherResults'>").html("Conditions: " + weather);
            var currentTemp = $("<span id='weatherResults'>").html("Current temp: " + tempFix + "&#x2109;");
            var windSpeed = $("<span id='weatherResults'>").html("Wind Speed: " + wind + " mph");
            var currentHumidity = $("<span id='weatherResults'>").html("Humidity: " + humidity + "%");

            // var currentTemp = $("<tr>").html("<td>Current temp: </td><td>" + tempFix + "&#x2109;</td>");
            // var windSpeed = $("<tr>").html("<td>Wind Speed: </td><td>" + wind + " mph</td>");
            // var currentHumidity = $("<tr>").html("<td>Humidity: </td><td>" + humidity + "%</td>");

            // Append the table row to the table body
            detailWeather.append(cityName, currentCondit, currentTemp, windSpeed, currentHumidity);

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