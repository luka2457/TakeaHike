$(document).ready(function () {

            function displayHikes() {

                // This function handles events where a submit button is clicked
                $("#search").on("click", function (event) {
                    event.preventDefault();
                    // This line grabs the input from the textbox

                    var search = $("#zip").val().trim();
                    console.log(search);
                    var queryURL = "https://www.google.com/maps/embed/v1/MODE?key=200346208-a20429d4feecdc85e7b352eb15efe568&q=" + search;

                    // Creating an AJAX call for the zip code being searched
                    $.ajax({
                        url: queryURL,
                        method: "GET"
                    }).then(function (response) {
                        console.log(response);

                    });

                    displayHikes();
                });

            };
        });