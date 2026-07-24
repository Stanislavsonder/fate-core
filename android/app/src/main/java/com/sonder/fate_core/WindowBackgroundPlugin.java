package com.sonder.fate_core;

import android.graphics.Color;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * On Android 15+ the OS enforces edge-to-edge and no longer lets apps color the
 * status/navigation bars (they're transparent overlays over the window content).
 * The window's root background is what actually shows through in any gap between
 * the WebView and the screen edges, so we expose it here to keep it in sync with
 * the app's (device-independent) light/dark theme.
 */
@CapacitorPlugin(name = "WindowBackground")
public class WindowBackgroundPlugin extends Plugin {

    @PluginMethod
    public void setColor(PluginCall call) {
        String color = call.getString("color");
        if (color == null) {
            call.reject("color is required");
            return;
        }

        getActivity().runOnUiThread(() -> getActivity().getWindow().getDecorView().setBackgroundColor(Color.parseColor(color)));
        call.resolve();
    }
}
