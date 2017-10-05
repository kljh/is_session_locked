// build with npm install

const addon = require('./build/release/addon');

// test 
if (!module.parent) {
    console.log("module.parent is null, we're running the main module");
    setInterval(function () { console.log(addon.is_session_locked_v8()); }, 1000); 
}

// exports.is_session_locked = is_session_locked_v8; // invoke the native implementation
exports.is_session_locked = function() {
    return addon.is_session_locked_v8(); // invoke the native implementation
}