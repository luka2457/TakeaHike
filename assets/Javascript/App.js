$(document).ready(function () {

    function displayHikes() {

        // This function handles events where a submit button is clicked
        // $("#search").on("click", function (event) {
        //     event.preventDefault();
        //     // This line grabs the input from the textbox

        //     var search = $("#zip").val().trim();
        //     console.log(search);
        var queryURL = "https://www.hikingproject.com/data/get-trails?lat=40.0274&lon=-105.2519&maxDistance=10&key=200346208-a20429d4feecdc85e7b352eb15efe568";

        // Creating an AJAX call for the zip code being searched
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            for (i = 0; i < response.trails.length; i++) {
                var trail = response.trails[i].name;
                var lngth = response.trails[i].length;
                var condit = response.trails[i].conditionStatus;
                var stars = response.trails[i].stars;
                var diffic = response.trails[i].difficulty;

                var tBody = $("tbody");
                var tRow = $("<tr>");

                var trailName = $("<td>").text(trail);
                var trailLength = $("<td>").text(lngth);
                var trailConditions = $("<td>").text(condit);
                var trailStars = $("<td>").text(stars);
                var trailDifficulty = $("<td>").text(diffic);

                // Append the newly created table data to the table row
                tRow.append(trailName, trailLength, trailConditions, trailStars, trailDifficulty);
                // Append the table row to the table body
                tBody.append(tRow);
            }

        });

    };

    function displayWeather() {

        // function handles events where a submit button is clicked
        $("#search").on("click", function (event) {
            event.preventDefault();
            // This line grabs the input from the textbox

            var zip = $("#zip").val().trim();
            console.log(zip);

            $.ajax({
                url: "http://api.openweathermap.org/data/2.5/weather?zip=" + zip + ",us&APPID=1b51cc23ba0f775c5bf239d8814745e3",
                method: "GET"
            }).then(function (response) {
                console.log(response);
                console.log(response.name);
                console.log(response.weather[0].main);
                console.log(response.main.temp);
                console.log(response.coord);

                // for (i = 0; i < response.trails.length; i++) {
                //     var trail = response.trails[i].name;
                //     var lngth = response.trails[i].length;
                //     var condit = response.trails[i].conditionStatus;
                //     var stars = response.trails[i].stars;
                //     var diffic = response.trails[i].difficulty;
    
                //     var tBody = $("tbody");
                //     var tRow = $("<tr>");
    
                //     var trailName = $("<td>").text(trail);
                //     var trailLength = $("<td>").text(lngth);
                //     var trailConditions = $("<td>").text(condit);
                //     var trailStars = $("<td>").text(stars);
                //     var trailDifficulty = $("<td>").text(diffic);
    
                //     // Append the newly created table data to the table row
                //     tRow.append(trailName, trailLength, trailConditions, trailStars, trailDifficulty);
                //     // Append the table row to the table body
                //     tBody.append(tRow);
            });
        });
    };

    displayHikes();
    displayWeather();

});