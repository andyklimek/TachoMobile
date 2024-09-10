package com.plainreactnativeapp;

import android.annotation.SuppressLint;
import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.util.Log;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbManager;


import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.ftsafe.readerScheme.FTException;
import com.ftsafe.readerScheme.FTReader;
import com.ftsafe.DK;

import java.util.Arrays;
import java.util.HashMap;

public class CardReaderModule extends ReactContextBaseJavaModule {

    private static final String TAG = "CardReaderModule";

    private FTReader ftReader;
    private UsbDevice device;
    private boolean isConnected;

    @SuppressLint("HandlerLeak")
    private Handler mHandler = new Handler(Looper.getMainLooper()) {
        @SuppressLint("HandlerLeak")
        public void handleMessage(@NonNull Message msg) {
            Log.d(TAG, String.valueOf(msg.what));
            super.handleMessage(msg);
            switch (msg.what) {
                case DK.USB_IN -> {
                    attachToReader();
                }
                case DK.CARD_IN_MASK -> {
                    if (isConnected) {
                        try {
                            ftReader.readerPowerOn(device.getDeviceName(), 0);
                            Log.d(TAG, "Smart card connected");
                        } catch (FTException e) {
                            Log.d(TAG, "Connection to card was not possible.");
                        }
                    }
                }
                case DK.USB_OUT -> {
                    if (isConnected && device != null) {
                        try {
                            ftReader.readerClose(device.getDeviceName());
                            isConnected = false;
                            Log.d(TAG, "Card disconnected");
                        } catch (FTException e) {
                            Log.e(TAG, "Couldn't close connection to smart card reader");
                        }
                    }
                }
            }
        }
    };

    public CardReaderModule(ReactApplicationContext context) {
        super(context);
        this.isConnected = false;
    }

    @Override
    public String getName() {
        return "CardReader";
    }

    @ReactMethod
    public void connectToUsbReader(Promise promise) {
        try {
            if (!isConnected) {
                this.ftReader = new FTReader(getReactApplicationContext(), this.mHandler, DK.FTREADER_TYPE_USB);
                this.ftReader.readerFind();
            }
            promise.resolve("Connected");
        } catch (FTException e) {
            Log.e(TAG, "Error connecting to USB device", e);
            promise.reject(new Throwable("Couldn't find usb reader"));
        }
    }

    @ReactMethod
    public void sendTestCommand(Promise promise) {
        byte[] apduCommand = new byte[]{(byte) 0x00, // CLA
                (byte) 0xA4, // INS
                (byte) 0x04, // P1
                (byte) 0x00, // P2
                (byte) 0x07, // Lc (długość danych)
                (byte) 0xA0, (byte) 0x00, (byte) 0x00, (byte) 0x02, (byte) 0x47, (byte) 0x10, (byte) 0x01 // dane
        };
        try {
            byte[] test = sendCommand(apduCommand);
            promise.resolve("Test command successfully send");
        } catch (FTException e) {
            promise.reject(new Throwable("Failed sending test command"));
        }
    }

    @ReactMethod
    public void sendCommand(ReadableArray commandArray, Promise promise) {
        try {
            byte[] command = new byte[commandArray.size()];
            for (int i = 0; i < commandArray.size(); i++) {
                command[i] = (byte) commandArray.getInt(i);
            }

            byte[] response = sendCommand(command);

            WritableArray responseArray = Arguments.createArray();
            for (byte b : response) {
                responseArray.pushInt(b & 0xFF);
            }

            promise.resolve(responseArray);
        } catch (Exception e) {
            Log.e(TAG, "Sending command from bridge didn't work");
            promise.reject("ERROR", e.getMessage());
        }
    }

    public byte[] sendCommand(byte[] command) throws FTException {
        return ftReader.readerXfr(device.getDeviceName(), 0, command);
    }


    public void attachToReader() {
        try {
            UsbManager usbManager = (UsbManager) getReactApplicationContext().getSystemService(Context.USB_SERVICE);
            HashMap<String, UsbDevice> deviceList = usbManager.getDeviceList();

            UsbDevice selectedDevice = null;
            for (UsbDevice device : deviceList.values()) {
                selectedDevice = device;
                break;
            }

            if (selectedDevice == null) {
                Log.e(TAG, "USB device from feitian wasn't found");
                return;
            }

            String[] devices = this.ftReader.readerOpen(selectedDevice.getDeviceName());
            Log.d(TAG, Arrays.toString(devices) + " Connected");

            this.device = selectedDevice;
            this.isConnected = true;
        } catch (Exception e) {
            Log.e(TAG, "An error occured while attaching to reader");
        }
    }

}
