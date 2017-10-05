/*

Detect if desktop is locked
The answer depends on whether you want to know if the desktop is locked now, or if you want to be notified when the desktop gets locked (and, presumably, unlocked). It also depends on how you're planning to receive said notifications.

- If you really want a one-off test, then the answer here uses OpenDesktop() and SwitchDesktop() to open a handle to the default desktop and activate it - if this fails then it's a good sign that the desktop is locked right now.
- If you want notification on lock/unlock, and you have a user-mode application with a window and a message pump, then you need to call WTSRegisterSessionNotification() and catch the  WM_WTSSESSION_CHANGE message.
- If you want notifications, and you're running as a Windows service, then you can register for session change events by calling SetServiceStatus() and adding SERVICE_ACCEPT_SESSIONCHANGE to dwControlsAccepted in your status structure. You will then receive callbacks to your own service control HandlerEx() function with dwControl set to SERVICE_CONTROL_SESSIONCHANGE.

*/

int is_session_locked();