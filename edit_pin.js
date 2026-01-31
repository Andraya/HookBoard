// Get pin ID from URL
const urlParams = new URLSearchParams(window.location.search); //search part of a URL after the question mark, to get query parameters
const pinId = urlParams.get('id'); //get the value of the 'id' parameter and store it in pinId variable

if (pinId) { //if pinId exists, do the following; if not, do nothing
    document.getElementById('pinId').value = pinId; //set the value of the element with id 'pinId' to the pinId; hidden input field to store pin ID
    document.getElementById('editForm').action = `/edit_pin/${pinId}`; //set the form action to the edit URL for the pin; this is where the form will be submitted

    // Fetch pin data and pre-fill form; so the user can see existing data and edit it
    fetch('/data/pins.json')
        .then(response => response.json()) //fetch the pins data from the server and parse it as JSON; response.json() returns a promise that resolves with the parsed JSON data
        .then(pins => { //once the JSON data is available, do the following
            const pin = pins.find(p => p.id == pinId); //find the pin with the matching ID in the pins array
            if (pin) { //if the pin is found, pre-fill the form fields with the pin data
                document.getElementById('title').value = pin.title;
                document.getElementById('tags').value = pin.tags.join(', ');
                document.getElementById('difficulty').value = pin.difficulty || '';
                document.getElementById('time').value = pin.time || '';
                document.getElementById('productionCost').value = pin.productionCost || '';
                document.getElementById('usedMaterials').value = pin.usedMaterials.join(', ');
            }
        });
}