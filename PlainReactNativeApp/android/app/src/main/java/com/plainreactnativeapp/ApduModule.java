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
    private final int TIMEOUT = 1000;

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

    private static final byte CCID_MESSAGE_TYPE_PC_TO_RDR_ICC_POWER_ON = 0x62;
    private static final byte CCID_MESSAGE_TYPE_PC_TO_RDR_XFR_BLOCK = 0x6F;
    private static final byte CCID_MESSAGE_TYPE_RDR_TO_PC_DATA_BLOCK = (byte) 0x80;
    private static final int CCID_HEADER_LENGTH = 10;

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
                deviceMap.putInt("protocol", device.getDeviceProtocol());
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
        if (connection == null) {
            Log.i("NoDeviceOpened", "Developer tried to disconnect null device");
            promise.reject("NoDeviceOpened", "Any device is currently connected");
        } else {
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
            else {
                Log.i("ConnectionEstablished", "Connection to device was established");
            }

            for (int i = 0; i < device.getInterfaceCount(); i++) {
                usbInterface = device.getInterface(i);
                connection.claimInterface(usbInterface, true);

                Log.i("End", String.valueOf(usbInterface.getEndpointCount()));
                Log.i("Device", String.valueOf(device.getDeviceClass()));

                for (int j = 0; j < usbInterface.getEndpointCount(); j++) {
                    UsbEndpoint end = usbInterface.getEndpoint(j);
                    Log.i("dssd", String.valueOf(end.getType()));
                    if (end.getType() == UsbConstants.USB_ENDPOINT_XFER_BULK) {
                        if (end.getDirection() == UsbConstants.USB_DIR_OUT) {
                            Log.i("EndpointConnected", "UsbDirOut connected");
                            epOut = end;
                        } else if (end.getDirection() == UsbConstants.USB_DIR_IN) {
                            Log.i("EndpointConnected", "UsbDirIn connected");
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

            byte[] powerOnCommand = new byte[]{(byte) 0x00, (byte) 0xA4, (byte) 0x00, (byte) 0x00, (byte) 0x02, (byte) 0x3F, (byte) 0x00};
            write(connection, epOut, powerOnCommand);
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
        int byteCount = -1;
        byteCount = connection.bulkTransfer(epIn, buffer, buffer.length, TIMEOUT);

        if (byteCount >= 0) {
            for (int i = 0; i < byteCount; i++) {
                result.append(String.format(" %02X ", buffer[i]));
            }
            Log.i("ReadSuccess", "Buffer received was: " + result.toString());
        } else {
            Log.e("ReadError", "Problem occurred while reading response from smartcard. Byte count: " + byteCount);
        }

        return byteCount;
    }
}
