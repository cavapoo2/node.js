//use npm i pm2 to install pm2, then do :
//./node_modules/pm2/bin/pm2 start script.js
//./node_modules/pm2/bin/pm2 list
//./node_modules/pm2/bin/pm2 info script
//logs are in .pm2 in home directory
//clear logs by doing flush
'use strict';
// script.js
let count = 1;
function loop() {
console.log(count++);
setTimeout(loop, 1000);
}
loop();
