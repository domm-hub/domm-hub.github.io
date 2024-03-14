var main_server = "127.0.0.1:5000"
var pass, usernameh; // Declare variables outside the loop

const params = new URLSearchParams(window.location.search);
for (const param of params) {
    if (param[0] === "password") {
        pass = param[1];
    }
    if (param[0] === "username") {
        usernameh = param[1];
    }
}

const data = { username: usernameh, password: pass };
const options = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
};

try {
    fetch(main_server + "/get_avaliable_usernames", options)
        .then(response => {
            if (!response.ok) {
                console.error('Network response was not ok');
                console.log(response.json())
                console.log(response)
            }
            return response.json();
        })
        .then(data => {
            const dag = document.getElementById("cars");

            data.forEach(ob => {
                dag.innerHTML += `<option>${ob}</option>`;
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Failed to fetch available usernames");
        });
} catch (error) {
    console.error('Error:', error);
    alert("An error occurred while fetching available usernames");
}

function send() {
    const message = document.getElementById("Send").value;
    const recipient = document.getElementById("cars").value;

    const data = { password: pass, sender: usernameh, message: message, recipient: recipient };
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    try {
        fetch(main_server + "/send_message", options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const d = document.getElementById("messages");
                d.innerHTML += `<div style='float: left;'>${message}</div>`;
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Failed to send message");
            });
    } catch (error) {
        console.error('Error:', error);
        alert("An error occurred while sending message");
    }
}
