package com.plainreactnativeapp;

import android.bluetooth.BluetoothDevice;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbManager;


import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.ftsafe.readerScheme.FTException;
import com.ftsafe.readerScheme.FTReader;
import com.ftsafe.DK;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

public class CardReaderModule extends ReactContextBaseJavaModule {

    private FTReader ftReader;
    private ReactApplicationContext mContext;
    private Handler mHandler;
    private UsbManager usbManager;

    // Bluetooth and USB device lists to manage connections
    private List<BluetoothDevice> listDevice;
    private static List<String> connectedDeviceList = new ArrayList<>();
    private static boolean isConnected = false;
    private static final String TAG = "CardReaderModule";

    public CardReaderModule(ReactApplicationContext context) {
        super(context);
        this.mContext = context;
    }

    @Override
    public String getName() {
        return "CardReader";
    }

    @ReactMethod
    public void connectToUsbReader() {
        try {
            // Initialize the FTReader instance for USB
            ftReader = new FTReader(getReactApplicationContext(), null, DK.FTREADER_TYPE_USB);

            // Find all connected USB devices
            ftReader.readerFind();

            // Check for connected USB devices
            HashMap<String, UsbDevice> deviceList = usbManager.getDeviceList();
            if (deviceList.isEmpty()) {
                Log.d(TAG, "No USB devices found");
                return;
            }

            // Iterate over connected USB devices
            Iterator<Map.Entry<String, UsbDevice>> deviceIterator = deviceList.entrySet().iterator();
            while (deviceIterator.hasNext()) {
                Map.Entry<String, UsbDevice> entry = deviceIterator.next();
                UsbDevice device = entry.getValue();

                // Check if the device has the required permission
                if (usbManager.hasPermission(device)) {
                    // Attempt to connect to the device
                    String[] connectedDeviceSlots = ftReader.readerOpen(device.getDeviceName());
                    Log.d(TAG, "Connected to USB device: " + device.getDeviceName());

                    // If connected, you can handle further operations like card reading here
                    // ...
                } else {
                    Log.d(TAG, "No permission to access USB device: " + device.getDeviceName());
                    // You might want to request permission here
                    // ...
                }
            }
        } catch (FTException e) {
            Log.e(TAG, "Error connecting to USB device", e);
        }
    }


}
