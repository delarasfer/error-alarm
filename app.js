const ErrorService = require('./errorService')


logError = (error) => console.log('->'+error); // Existing logError function
sendMail = (msj) => {
    //Here add code to send mail
    console.log('----------------------------------');
    console.log('error event: send alarm via email: ' + msj);
    console.log('----------------------------------');
}

const originalCode = logError; // Store the original existing function and send to new function with implemented logic

errorService = new ErrorService(originalCode,10, 60, sendMail); // Detects 10 errors in a 60 secs time span

logError = errorService.logError; // now existing function is replaced with a new function that is wrapped with desired logic

function wait(millis){
    return new Promise(resolve => {
        setTimeout(resolve,millis);
    });
}

var array = Array.from(Array(200).keys()); //Iterates 200 times to check algorithm
var promise = Promise.resolve();
array.forEach((i) => {
  promise = promise.then(() => {
    logError('Error nbr: '+(i+1));  // This represent how exiting code doesn't detects the change made
    return wait(((i+1) % 20 == 0) ? 50000 : 2000); //Every 20 errors wait 50 secs before resuming 2 secs
  });
});

promise.then(function () {
  console.log('Loop finished.');
});
  
