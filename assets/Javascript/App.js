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
    displayHikes();
});