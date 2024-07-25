package com.plainreactnativeapp;

import androidx.annotation.NonNull;

import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.hardware.usb.*;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.util.Arrays;

public class ApduModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private final int TIMEOUT = 2000;

    // USB settings
    private UsbManager mUsbManager;
    private UsbEndpoint epOut;
    private UsbEndpoint epIn;
    private UsbInterface usbInterface;
    private UsbDeviceConnection connection;
    private UsbDevice mPendingDevice;
    private Promise mPendingPromise;

    // APDU sender / receiver
    private StringBuilder result;

    private static final String ACTION_USB_PERMISSION = "com.plainreactnativeapp.USB_PERMISSION";

    public ApduModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;

        mUsbManager = (UsbManager) reactContext.getSystemService(Context.USB_SERVICE);
        PendingIntent permIntent = PendingIntent.getBroadcast(context, 0, new Intent(ACTION_USB_PERMISSION), PendingIntent.FLAG_IMMUTABLE);
        IntentFilter filter = new IntentFilter(ACTION_USB_PERMISSION);
        reactContext.registerReceiver(usbReceiver, filter);
    }

    @NonNull
    @Override
    public String getName() {
        return "Apdu";
    }

    private final BroadcastReceiver usbReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            if (ACTION_USB_PERMISSION.equals(action)) {
                synchronized (this) {
                    UsbDevice device = intent.getParcelableExtra(UsbManager.EXTRA_DEVICE);
                    if (device != null && device.equals(mPendingDevice)) {
                        boolean granted = intent.getBooleanExtra(UsbManager.EXTRA_PERMISSION_GRANTED, false);
                        if (granted) {
                            proceedWithDevice(device);
                        } else {
                            mPendingPromise.reject("PermissionDenied", "USB permission was denied");
                        }
                    }
                }
            }
        }
    };

    @ReactMethod
    public void listUsbDevices(Promise promise) {
        try {
            if (mUsbManager == null) {
                promise.reject("USB Manager Error", "Unable to access USB Manager");
                return;
            }

            WritableArray devicesArray = Arguments.createArray();
            for (UsbDevice device : mUsbManager.getDeviceList().values()) {
                WritableMap deviceMap = Arguments.createMap();
                deviceMap.putString("deviceName", device.getDeviceName());
                deviceMap.putInt("deviceId", device.getDeviceId());
                deviceMap.putInt("vendorId", device.getVendorId());
                deviceMap.putInt("productId", device.getProductId());
                deviceMap.putString("version", device.getVersion());
                devicesArray.pushMap(deviceMap);
            }

            Log.i("ListingUsbDevices", "Usb devices were listed");
            promise.resolve(devicesArray);
        } catch (Exception e) {
            Log.e("ListingUsbDevices", "Failed to list USB devices", e);
            promise.reject("ListingUsbDevicesFailed", "Failed to list USB devices", e);
        }
    }

    private UsbDevice getDeviceById(int deviceId) {
        try {
            if (mUsbManager == null) {
                Log.e("GetDeviceById", "Unable to access USB Manager");
                return null;
            }

            for (UsbDevice device : mUsbManager.getDeviceList().values()) {
                if (device.getDeviceId() == deviceId) {
                    return device;
                }
            }

            Log.e("GetDeviceById", "No USB device found with the given ID: " + deviceId);
            return null;
        } catch (Exception e) {
            Log.e("GetDeviceById", "Failed to get USB device by ID", e);
            return null;
        }
    }

    @ReactMethod
    public void openDevice(int deviceId, Promise promise) {
        UsbDevice device = getDeviceById(deviceId);

        if (device == null) {
            Log.e("DeviceNotFoundError", "Device with provided id wasn't found");
            promise.reject("DeviceNotFoundError", "Unable to find device with provided ID");
            return;
        }

        mPendingDevice = device;
        mPendingPromise = promise;

        if (!mUsbManager.hasPermission(device)) {
            PendingIntent permIntent = PendingIntent.getBroadcast(reactContext, 0, new Intent(ACTION_USB_PERMISSION), PendingIntent.FLAG_IMMUTABLE);
            mUsbManager.requestPermission(device, permIntent);
        } else {
            proceedWithDevice(device);
        }
    }

    @ReactMethod
    public void closeDevice(Promise promise) {
        if(connection == null) {
            Log.i("NoDeviceOpened", "Developer tried to disconnect null device");
            promise.reject("NoDeviceOpened", "Any device is currently connected");
        }
        else {
            connection.close();
            Log.i("ConnectionClosed", "Connection to the device was closed");
            promise.resolve("Connection was closed");
        }
    }

    private void proceedWithDevice(UsbDevice device) {
        try {
            connection = mUsbManager.openDevice(device);
            if (connection == null) {
                mPendingPromise.reject("ConnectionNotEstablished", "Couldn't establish connection to USB device");
                return;
            }

            for (int i = 0; i < device.getInterfaceCount(); i++) {
                usbInterface = device.getInterface(i);
                connection.claimInterface(usbInterface, true);

                for (int j = 0; j < usbInterface.getEndpointCount(); j++) {
                    UsbEndpoint end = usbInterface.getEndpoint(j);
                    if (end.getType() == UsbConstants.USB_ENDPOINT_XFER_BULK) {
                        if (end.getDirection() == UsbConstants.USB_DIR_OUT) {
                            epOut = end;
                        } else if (end.getDirection() == UsbConstants.USB_DIR_IN) {
                            epIn = end;
                        }
                    }
                }
            }

            if (epOut == null) {
                mPendingPromise.reject("EndpointError", "Output endpoint not found");
                return;
            }

            if (epIn == null) {
                mPendingPromise.reject("EndpointError", "Input endpoint not found");
                return;
            }

            byte[] atrCommand = new byte[]{(byte)0xFF, 0x00, 0x48, 0x00, 0x00};
            write(connection, epOut, atrCommand);
            read(connection, epIn);

            Log.i("DeviceOpened", "Device was successfully opened");
            mPendingPromise.resolve("Connection established");
        } catch (Exception e) {
            Log.e("OpenDeviceError", "Failed to open USB device", e);
            mPendingPromise.reject("OpenDeviceError", "Failed to open USB device", e);
        }
    }

    public void write(UsbDeviceConnection connection, UsbEndpoint epOut, byte[] command) {
        result = new StringBuilder();
        int byteCount = connection.bulkTransfer(epOut, command, command.length, TIMEOUT);
        if (byteCount < 0) {
            Log.e("WriteError", "An error occurred while transferring command to smartcard");
        } else {
            for (byte bb : command) {
                result.append(String.format("%02X", bb));
            }
            Log.i("CommandSent", "Command sent: " + Arrays.toString(command));
        }
    }

    public int read(UsbDeviceConnection connection, UsbEndpoint epIn) {
        result = new StringBuilder();
        final byte[] buffer = new byte[epIn.getMaxPacketSize()];
        int byteCount = connection.bulkTransfer(epIn, buffer, buffer.length, TIMEOUT);

        if (byteCount >= 0) {
            for (byte bb : buffer) {
                result.append(String.format(" %02X ", bb));
            }

            Log.i("ReadSuccess", "Buffer received was: " + result.toString());
        } else {
            Log.e("ReadError", "Problem occurred while reading response from smartcard. Byte count: " + byteCount + result.toString());
        }

        return byteCount;
    }
}
