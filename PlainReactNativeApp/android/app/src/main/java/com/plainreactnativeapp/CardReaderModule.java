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

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

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
                            byte[] resp = sendCommand(new byte[]{(byte) 0x00, (byte) 0xa4, (byte) 0x04, (byte) 0x0c, (byte) 0x06, (byte) 0xff, (byte) 0x54, (byte) 0x41, (byte) 0x43, (byte) 0x48, (byte) 0x4f});
                            Log.d(TAG, Arrays.toString(resp) + " Card connected");
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
            this.ftReader = new FTReader(getReactApplicationContext(), this.mHandler, DK.FTREADER_TYPE_USB);
            this.ftReader.readerFind();
            promise.resolve("Waiting to give permission by user...");
        } catch (FTException e) {
            Log.e(TAG, "Error connecting to USB device", e);
            promise.reject(new Throwable("Couldn't find usb reader"));
        }
    }

    public byte[] sendCommand(byte[] command) {
        try {
            byte[] resp = ftReader.readerXfr(device.getDeviceName(), 0, command);
            return resp;
        } catch (FTException e) {
            throw new RuntimeException(e);
        }
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
