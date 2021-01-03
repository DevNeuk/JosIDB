
// Create needed constants
const bookformjs = document.querySelector('#bookform');
const fnameInput = document.querySelector('#fname');
const lnameInput = document.querySelector('#lname');
const purposeInput = document.querySelector('#purpose');
const emailIDInput = document.querySelector('#emailID');
const appointmentdateInput = document.querySelector('#appointmentdate');
const starttimeInput = document.querySelector('#starttime');
const endtimeInput = document.querySelector('#endtime');
const notesInput = document.querySelector('#comments');
const btn = document.querySelector('.btn');
const message = document.querySelector('.message');

// Create an instance of a db object for us to store the open database in
let db;

window.onload = function () {
    // Open our database; it is created if it doesn't already exist
    
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
        // Run the displayData() function to display the notes already in the IDB
        //displayData();

        // Setup the database tables if this has not already been done
    request.onupgradeneeded = function (e) {
            // Grab a reference to the opened database
            let db = e.target.result;

            // Create an objectStore to store our notes in (basically like a single table)
            // including a auto-incrementing key
            let objectStore = db.createObjectStore('bookappointment_os', { keyPath: 'id', autoIncrement: true });

            // Define what data items the objectStore will contain
            objectStore.createIndex('bookingdata', 'bookingdata', { unique: false });       

            console.log('Database setup complete');
        };
    
    bookformjs.addEventListener('submit', addBooking);

    // Function to create an appointment and the booking details to the DB
    function addBooking(e) {
        // prevent default 
        e.preventDefault();           
        
        // Check for blank fields before submission

        if (fnameInput.value === '' || lnameInput.value === '' || purposeInput.value === '' || emailIDInput.value === '' || appointmentdateInput.value === '' || starttimeInput.value === '' || endtimeInput.value === '') {
            message.innerHTML = 'Please enter all fields';
            
        } else {

            let bookingID = getRandomInt(0, 10000);

            function getRandomInt(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
            }
            // grab the values entered into the form fields and store them in an object ready for being inserted into the DB
            let newBooking = { fname: fnameInput.value, lname: lnameInput.value, emailID: emailIDInput.value, purpose: purposeInput.value, appointmentdate: appointmentdateInput.value, starttime: starttimeInput.value, endtime: endtimeInput.value, notes: notesInput.value, bookingID: bookingID };
            
            // open a read/write db transaction, ready for adding the data
            let transaction = db.transaction(['bookappointment_os'], 'readwrite');

            // call an object store that's already been added to the database
            let objectStore = transaction.objectStore('bookappointment_os');

            // Make a request to add our newItem object to the object store
            let request = objectStore.add(newBooking);
            request.onsuccess = function () {
                // Clear the form, ready for adding the next entry
                fnameInput.value = '';
                lnameInput.value = '';
                emailIDInput.value = '';
                appointmentdateInput.value = '';
                purposeInput.value = '';
                starttimeInput.value = '';
                endtimeInput.value = '';
                notesInput.value = '';
                message.innerHTML = `Booking Success and your booking ID is ${bookingID}`;
            };

            // Report on the success of the transaction completing, when everything is done
            transaction.oncomplete = function () {
                console.log('Transaction completed: database modification finished.');

                // update the display of data to show the newly added item, by running displayData() again.
                //displayData();
            };

            transaction.onerror = function () {
                console.log('Transaction not opened due to error');
            };
        }
        
        
    }
};