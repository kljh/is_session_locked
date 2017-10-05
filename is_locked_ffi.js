"use strict";
/*

Detect if desktop is locked
The answer depends on whether you want to know if the desktop is locked now, or if you want to be notified when the desktop gets locked (and, presumably, unlocked). It also depends on how you're planning to receive said notifications.

- If you really want a one-off test, then the answer here uses OpenDesktop() and SwitchDesktop() to open a handle to the default desktop and activate it - if this fails then it's a good sign that the desktop is locked right now.
- If you want notification on lock/unlock, and you have a user-mode application with a window and a message pump, then you need to call WTSRegisterSessionNotification() and catch the  WM_WTSSESSION_CHANGE message.
- If you want notifications, and you're running as a Windows service, then you can register for session change events by calling SetServiceStatus() and adding SERVICE_ACCEPT_SESSIONCHANGE to dwControlsAccepted in your status structure. You will then receive callbacks to your own service control HandlerEx() function with dwControl set to SERVICE_CONTROL_SESSIONCHANGE.

Requires: 
npm install -O ffi
*/

var ref = require('ref');
var ffi = require('ffi');

// user32.dll
var HDESK = ref.refType('int');
var HWND = ref.refType('int');
var user32 = ffi.Library('user32', {
   'OpenInputDesktop': [ HDESK, [ 'int32', 'bool', 'int32' ] ],
   'SwitchDesktop': [ 'bool', [ HDESK ] ],
   'CloseDesktop': [ 'bool', [ HDESK ] ],
   'GetActiveWindow' : [ HWND, [] ],
    });

// wtsapi32.dll
var wtsapi32 = ffi.Library('wtsapi32', {
    'WTSRegisterSessionNotification': [ 'bool', [ 'int', 'int' ] ],
    });

// advapi32.dll
var SERVICE_STATUS_HANDLE = ref.refType('int');
var LPCTSTR = ref.refType(ref.types.CString);
var LPHANDLER_FUNCTION_EX = ref.refType('void'); // !! type for a callback function ??
var LPVOID = ref.refType('void');
var advapi32 = ffi.Library('advapi32', {
    'RegisterServiceCtrlHandlerExA': [ SERVICE_STATUS_HANDLE, [ LPCTSTR, LPHANDLER_FUNCTION_EX, LPVOID ] ],
    });

// FFI declaration works fine
//console.log("user32.OpenInputDesktop", user32.OpenInputDesktop);
//console.log("user32.SwitchDesktop", user32.SwitchDesktop);
//console.log("user32.CloseDesktop", user32.CloseDesktop);

function is_locked_desktop() {
    
    var dwFlags = 0 // DF_ALLOWOTHERACCOUNTHOOK (1)
    var fInherit = false; 
    var dwDesiredAccess = 256; // DESKTOP_SWITCHDESKTOP (0x0100L)
    
    console.log("calling OpenInputDesktop...");
    var hwnd = user32.OpenInputDesktop(dwFlags, fInherit, dwDesiredAccess);
    console.log("hwnd", hwnd);
        
    var bsw = false
    if (hwnd) {
        bsw = user32.SwitchDesktop(hwnd);
        if (bsw) {
            var bClose = user32.closeDesktop(hwnd);
        }
    } else {
        // Error: "Could not access the desktop..."
    }
    return bsw;
}

function is_locked_hwnd() {
    // Handle of the window to receive session change notifications. (requires a windowed program !!)
    var hwnd = user32.GetActiveWindow();
    var NOTIFY_FOR_ALL_SESSIONS = 1;
    var isregistered = wtsapi32.WTSRegisterSessionNotification(hwnd, NOTIFY_FOR_ALL_SESSIONS);
    console.log(isregistered); 
}
    
function is_locked_svc() {
    
    /*
    DWORD WINAPI HandlerEx(
      _In_ DWORD  dwControl,
      _In_ DWORD  dwEventType,
      _In_ LPVOID lpEventData,
      _In_ LPVOID lpContext
    );
    */
    var handler_ex_callback = function() { 
        console.log("callback");
    }
    
    var zero = undefined
    var tmp = advapi32.RegisterServiceCtrlHandlerExA("myservice", handler_ex_callback, zero)
}

console.log("begin");
for (var i = 0; i < 100; i++) {
    var  bsw = is_locked_desktop();
    console.log("bsw", bsw);
    Sleep(2000)
}
console.log("done");

