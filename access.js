var domain = "127.0.0.1:5000";

function login() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // Data to be sent in the request body
    var data = {
        username: username,
        password: password
    };

    // Options for the fetch() request
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Specify content type as JSON
        },
        body: JSON.stringify(data) // Convert data to JSON string
    };

    var h = document.getElementById("h");

    try {
        // Make a POST request using fetch()
        fetch('http://' + domain + "/login", options)
            .then(function(response) {
                if (!response.ok) {
                    console.error('Network response was not ok');
                }
                r = response
                return response.json();
            })
            .then(function(data) {
                console.log(data);
                h.innerHTML = data['message']; // Display the response data

                if (r.status === 200) {
                    console.log('Redirecting...');
                    location.assign(`Chat`);
                } else {
                    console.log('Login unsuccessful');
                }
            })
            .catch(function(error) {
                console.error('Fetch error:', error); // Display error if fetch failed
            });
    } catch (error) {
        console.error('Error:', error);
        h.innerHTML = "ERROR: " + error;
    }
}
