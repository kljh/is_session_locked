#include <Windows.h>
#include <stdio.h>

int is_session_locked() {
  HDESK hwnd = OpenInputDesktop(0, false, 0x100);
  BOOL bSwitch = false;
  if (hwnd) {
    bSwitch = SwitchDesktop(hwnd);
    BOOL bClose = CloseDesktop(hwnd);
  } else {
    // Error: "Could not access the desktop..."
  }
  return !bSwitch;
}