//create required constants
const viewformjs = document.querySelector('#viewform');
const emailIDInput = document.querySelector('#emailID');
const btn = document.querySelector('.btn');
const msg = document.querySelector('.msg');

window.onload = function () {
    // Let us open our database
    let request = window.indexedDB.open('bookappointment_db', 1);
    // onerror handler signifies that the database didn't open successfully
    request.onerror = function () {
        console.log('Database failed to open');
    };

    // onsuccess handler signifies that the database opened successfully
    request.onsuccess = function () {
        console.log('Database opened successfully');

        // Store the opened database object in the db variable. This is used a lot below
        db = request.result;
        

    };

    viewformjs.addEventListener('submit', viewBooking);
    
    function viewBooking(e) {
        // prevent default 
        e.preventDefault();
        if (emailIDInput.value === '') {
            msg.innerHTML = 'Please enter email ID';
        } else {
            let bookingStore = getObjectStore('bookappointment_db');
            let transaction = db.transaction(['bookappointment_os']);
            let viewbookingrequest = bookingStore.get(emailIDInput.value);
            viewbookingrequest.onerror = function (event) {
                // Handle errors!
            };
            viewbookingrequest.onsuccess = function (event) {
                // Do something with the request.result!

                console.log("Name for SSN 444-44-4444 is " + viewbookingrequest.result);
            };
            transaction.oncomplete = function () {
                console.log('Data Retrieved successfully');

                // update the display of data to show the newly added item, by running displayData() again.
                //displayData();
            };

            transaction.onerror = function () {
                console.log('Data not retrieved due to error');
            };
        }
    }
    
    
};