package com.sonder.fate_core;

import android.os.Build;
import android.os.Bundle;
import androidx.core.splashscreen.SplashScreen;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.installSplashScreen(this);
        registerPlugin(WindowBackgroundPlugin.class);
        super.onCreate(savedInstanceState);

        // Remove the OS-drawn translucent scrim behind 3-button navigation so the
        // bar reflects our own app background instead of an extra dark tint.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            getWindow().setNavigationBarContrastEnforced(false);
        }
    }
}
