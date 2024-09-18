package com.ftsafe.comm.bt4;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothAdapter.LeScanCallback;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanRecord;
import android.bluetooth.le.ScanResult;
import android.bluetooth.le.ScanSettings;
import android.bluetooth.le.ScanSettings.Builder;
import android.content.Context;
import android.content.IntentFilter;
import android.os.ParcelUuid;
import android.os.Build.VERSION;
import android.util.Log;

import com.ftsafe.Utility;
import com.ftsafe.comm.CommBase;
import com.ftsafe.comm.LeBluetoothParsedScanRecord;
import com.ftsafe.readerScheme.FTReaderInf;
import com.ftsafe.util.LogUtil;

import java.io.IOException;
import java.io.PipedInputStream;
import java.io.PipedOutputStream;
import java.util.ConcurrentModificationException;
import java.util.Iterator;
import java.util.List;

public class BT4 implements FTReaderInf {
    private Context tContext;
    private CommBase.CommCallback mCallback;
    MyArrayList<BluetoothDevice> arrayForBlueToothDevice = new MyArrayList();
    BluetoothAdapter mBlueToothAdapter = null;
    BluetoothDevice mBluetoothDevice = null;
    BluetoothDevice mConnectedBluetoothDevice = null;
    PipedInputStream pipeIn = new PipedInputStream();
    PipedOutputStream pipeOut = new PipedOutputStream();
    private LeScanCallback mLeScanCallback;
    private ScanCallback newLeScanCallback;
    static BluetoothLeClass mBluetoothLeClass = null;
    private boolean scanning = false;
    boolean isRecvApdu = false;
    private boolean isDataComing = false;

    public BT4(Context context, CommBase.CommCallback callback) throws Bt4Exception {
        this.tContext = context;
        this.mCallback = callback;
        this.mBlueToothAdapter = BluetoothAdapter.getDefaultAdapter();
        this.initLeScanCallback();
        if (this.mBlueToothAdapter == null) {
            throw new Bt4Exception("BluetoothAdapter.getDefaultAdapter() == null");
        } else {
            IntentFilter filter = new IntentFilter();
            filter.addAction("android.bluetooth.device.action.ACL_DISCONNECTED");
            mBluetoothLeClass = new BluetoothLeClass(this.tContext);
            if (!mBluetoothLeClass.initialize()) {
                throw new Bt4Exception("mBluetoothLeClass.initialize() error");
            } else {
                mBluetoothLeClass.setOnServiceDiscoverListener(new BluetoothLeClass.OnServiceDiscoverListener() {
                    public void onServiceDiscover(BluetoothGatt gatt) {
                    }
                });
                mBluetoothLeClass.setOnConnectListener(new BluetoothLeClass.OnConnectListener() {
                    public void onConnect(BluetoothGatt gatt) {
                    }
                });
                mBluetoothLeClass.setOnDisconnectListener(new BluetoothLeClass.OnDisconnectListener() {
                    public void onDisconnect(BluetoothGatt gatt) {
                        BluetoothDevice device = gatt.getDevice();
                        if (device.getName() != null && BT4.this.mBluetoothDevice != null && device.getName().equals(BT4.this.mBluetoothDevice.getName())) {
                            BT4.this.showLog("ACTION_ACL_DISCONNECTED " + device.getAddress());
                            BT4.this.mHandlerSendMessage(130, device);
                            BT4.this.ft_close("");
                        }

                    }
                });
                mBluetoothLeClass.setOnDataAvailableListener(new BluetoothLeClass.OnDataAvailableListener() {
                    public void onCharacteristicRead(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
                    }

                    public void onCharacteristicChanged(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic) {
                        try {
                            byte[] tmp = characteristic.getValue();
                            if (tmp == null && tmp.length <= 0) {
                                return;
                            }

                            BT4.this.showLog("NEW:" + Utility.bytes2HexStr(tmp));
                            if (tmp[0] == 80 && tmp[1] == 2 && tmp.length == 2) {
                                BT4.this.mHandlerSendMessage(512, "");
                            } else if (tmp[0] == 80 && tmp[1] == 3 && tmp.length == 2) {
                                BT4.this.mHandlerSendMessage(256, "");
                            } else {
                                BT4.this.pipeOut.write(tmp, 0, tmp.length);
                                BT4.this.notifyDataComing();
                            }
                        } catch (IOException var4) {
                            BT4.this.showLog("OnDataAvailableListener.onCharacteristicChanged:" + var4.getMessage());
                        }

                    }
                });

                try {
                    this.pipeIn.connect(this.pipeOut);
                } catch (IOException var5) {
                    throw new Bt4Exception(var5.getMessage());
                }
            }
        }
    }

    public Boolean isFtExist() {
        return this.mBluetoothDevice != null && mBluetoothLeClass.getBluetoothGatt() != null ? true : false;
    }

    public void ft_find() throws Bt4Exception, InterruptedException, ConcurrentModificationException {
        if (this.mBlueToothAdapter.isEnabled()) {
            if (this.mBlueToothAdapter.isDiscovering() && this.scanning) {
                if (this.mBlueToothAdapter.isDiscovering() && this.scanning) {
                    Iterator var3 = this.arrayForBlueToothDevice.iterator();

                    while (var3.hasNext()) {
                        BluetoothDevice device = (BluetoothDevice) var3.next();
                        this.mHandlerSendMessage(129, device);
                    }
                }

            } else {
                this.arrayForBlueToothDevice.clear();
                if (this.mBlueToothAdapter != null) {
                    if (VERSION.SDK_INT >= 21) {
                        this.mBlueToothAdapter.getBluetoothLeScanner().stopScan(this.newLeScanCallback);
                        ScanSettings settings = (new Builder()).setScanMode(2).build();
                        this.mBlueToothAdapter.getBluetoothLeScanner().startScan((List) null, settings, this.newLeScanCallback);
                        this.scanning = true;
                    } else if (VERSION.SDK_INT >= 18) {
                        this.mBlueToothAdapter.stopLeScan(this.mLeScanCallback);
                        this.mBlueToothAdapter.startLeScan(this.mLeScanCallback);
                        this.scanning = true;
                    }

                    Thread.sleep(1000L);
                } else {
                    throw new Bt4Exception("mBlueToothAdapter == null");
                }
            }
        }
    }

    public void ft_stopfind() {
        this.stopScan();
    }

    public void stopScan() {
        if (this.mBlueToothAdapter != null) {
            if (VERSION.SDK_INT >= 21) {
                if (this.newLeScanCallback != null) {
                    this.mBlueToothAdapter.getBluetoothLeScanner().stopScan(this.newLeScanCallback);
                    this.scanning = false;
                }
            } else if (VERSION.SDK_INT >= 18 && this.mLeScanCallback != null) {
                this.mBlueToothAdapter.stopLeScan(this.mLeScanCallback);
                this.scanning = false;
            }

        }
    }

    public void ft_open(Object device) throws Bt4Exception {
        try {
            if (device == null) {
                throw new Exception("device == null");
            } else {
                this.stopScan();
                if (this.mBluetoothDevice != null && !this.mBluetoothDevice.equals(device)) {
                    this.ft_close((String) device);
                }

                this.mBluetoothDevice = (BluetoothDevice) device;
                if (mBluetoothLeClass.getBluetoothGatt() == null && !mBluetoothLeClass.connect(this.mBluetoothDevice.getAddress())) {
                    this.mConnectedBluetoothDevice = this.mBluetoothDevice;
                    throw new Exception("mBluetoothLeClass.connect failed");
                } else {
                    Thread.sleep(100L);
                }
            }
        } catch (Exception var3) {
            throw new Bt4Exception(var3.getMessage());
        }
    }

    public void ft_close(String device) {
        if (this.mBluetoothDevice != null) {
            mBluetoothLeClass.disconnect();
            mBluetoothLeClass.close();
            this.mBluetoothDevice = null;
        }
    }

    private byte[] intsToBytes(int[] a) {
        byte[] b = new byte[a.length];

        for (int i = 0; i < a.length; ++i) {
            b[i] = (byte) a[i];
        }

        return b;
    }

    public byte[] ft_control(int readerIndex, int requestType, int request, int value, int index, int length, int timeOut) throws Bt4Exception {
        if (requestType == 128 && request == 6 && value == 256 && index == 0) {
            return this.intsToBytes(new int[]{18, 1, 16, 1, 0, 0, 0, 8, 110, 9, 35, 6, 16, 1, 1, 2, 0, 1});
        } else if (requestType == 128 && request == 6 && value == 512 && index == 0) {
            return this.intsToBytes(new int[]{9, 2, 93, 0, 1, 1, 0, 128, 150, 9, 4, 0, 0, 3, 11, 0, 0, 0, 54, 33, 16, 1, 0, 7, 3, 0, 0, 0, 160, 15, 0, 0, 224, 46, 0, 0, 4, 0, 42, 0, 0, 44, 128, 10, 0, 46, 15, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 4, 4, 0, 15, 1, 0, 0, 255, 255, 0, 0, 0, 1, 7, 5, 3, 2, 64, 0, 0, 7, 5, 133, 2, 64, 0, 0});
        } else if (requestType == 128 && request == 6 && value == 769 && index == 1033) {
            return this.intsToBytes(new int[]{6, 3, 70, 0, 84, 0});
        } else if (requestType == 128 && request == 6 && value == 770 && index == 1033) {
            if (this.mBluetoothDevice == null) {
                return this.intsToBytes(new int[]{28, 3, 66, 0, 76, 0, 85, 0, 69, 0, 84, 0, 79, 0, 79, 0, 84, 0, 72, 0, 32, 0, 52, 0, 46, 0, 48, 0});
            } else {
                char[] name = this.mBluetoothDevice.getName().toCharArray();
                int[] data = new int[name.length * 2 + 2];
                data[0] = data.length;
                data[1] = 3;

                for (int i = 0; i < name.length; ++i) {
                    data[2 + i * 2] = name[i];
                    data[2 + i * 2 + 1] = 0;
                }

                return this.intsToBytes(data);
            }
        } else {
            return null;
        }
    }

    public void ft_send(int out, byte[] writeDataBuff, int timeOut) throws Bt4Exception {
        try {
            Log.e("FTSafe", "BT4_SendData:" + Utility.bytes2HexStr(writeDataBuff));
            this.pipeIn = new PipedInputStream();
            this.pipeOut = new PipedOutputStream();

            try {
                this.pipeIn.connect(this.pipeOut);
            } catch (IOException var9) {
                var9.printStackTrace();
            }

            int total = writeDataBuff.length;
            int sendleng = 0;

            while (total > 0) {
                try {
                    Thread.sleep(10L);
                } catch (InterruptedException var8) {
                    var8.printStackTrace();
                }

                byte[] data;
                int i;
                if (total <= 20) {
                    data = new byte[total];
                    System.arraycopy(writeDataBuff, sendleng, data, 0, total);
                    total -= total;
                    int var10000 = sendleng + total;

                    for (i = 0; i < 10 && !mBluetoothLeClass.writeCharacteristic(data); ++i) {
                        Thread.sleep(100L);
                    }

                    if (i >= 10) {
                        this.isRecvApdu = false;
                        throw new Exception("ft_send:mBluetoothLeClass.writeCharacteristic(data1)");
                    }
                    break;
                }

                data = new byte[20];
                System.arraycopy(writeDataBuff, sendleng, data, 0, 20);
                total -= 20;
                sendleng += 20;

                for (i = 0; i < 10 && !mBluetoothLeClass.writeCharacteristic(data); ++i) {
                    Thread.sleep(100L);
                }

                if (i == 10) {
                    this.isRecvApdu = false;
                    throw new Exception("ft_send:mBluetoothLeClass.writeCharacteristic(data1)");
                }

                Thread.sleep(10L);
            }

        } catch (Exception var10) {
            throw new Bt4Exception(var10.getMessage());
        }
    }

    public byte[] ft_recv(int in, int timeOut) throws Bt4Exception {
        this.showLog("timeout:" + timeOut);
        return this.BlueToothRead(timeOut);
    }

    public static void getPowerState(BluetoothLeClass.ReadPowerCallback callback) {
        mBluetoothLeClass.readPowerState(callback);
    }

    private void initLeScanCallback() {
        if (VERSION.SDK_INT >= 21) {
            this.newLeScanCallback = new ScanCallback() {
                public void onScanResult(int callbackType, ScanResult result) {
                    if (result != null) {
                        try {
                            BluetoothDevice device = result.getDevice();
                            int rssi = result.getRssi();
                            ScanRecord mScanRecord = result.getScanRecord();
                            List<ParcelUuid> radioUuids = mScanRecord.getServiceUuids();
                            String radioName = mScanRecord.getDeviceName();
                            if (radioName != null) {
                                radioName = radioName.trim();
                            }

                            if (BT4.this.arrayForBlueToothDevice.contains(device)) {
                                BT4.this.arrayForBlueToothDevice.resetTimer(device);
                                BT4.this.mHandlerSendMessage(129, device);
                            } else {
                                LeBluetoothParsedScanRecord parsedScanRecord = LeBluetoothParsedScanRecord.parseFromBytes(mScanRecord.getBytes());
                                if (radioUuids != null) {
                                    Iterator var9 = radioUuids.iterator();

                                    while (true) {
                                        ParcelUuid parcelUuid;
                                        do {
                                            if (!var9.hasNext()) {
                                                return;
                                            }

                                            parcelUuid = (ParcelUuid) var9.next();
                                        } while (!parcelUuid.getUuid().equals(BluetoothLeClass.UUID_SERVICE_C4) && !parcelUuid.getUuid().equals(BluetoothLeClass.UUID_SERVICE_C6) && !parcelUuid.getUuid().equals(BluetoothLeClass.UUID_SERVICE_C4_NEW) && !parcelUuid.getUuid().equals(BluetoothLeClass.UUID_SERVICE_C6_NEW) && !parcelUuid.getUuid().equals(BluetoothLeClass.UUID_SERVICE_FIRMWARE_VERSION_C4) && !parcelUuid.getUuid().equals(BluetoothLeClass.UUID_SERVICE_FIRMWARE_VERSION_C6) && !parcelUuid.getUuid().equals(BluetoothLeClass.UUID_SERVICE_C4_CORILUS));

                                        BT4.this.showLog("find ble device : " + device.getName());
                                        BT4.this.arrayForBlueToothDevice.add(device);
                                        BT4.this.mHandlerSendMessage(129, device);
                                    }
                                }
                            }
                        } catch (Exception var11) {
                            var11.printStackTrace();
                        }
                    }
                }

                public void onScanFailed(int errorCode) {
                }
            };
        } else if (VERSION.SDK_INT >= 18) {
            this.mLeScanCallback = new LeScanCallback() {
                public void onLeScan(BluetoothDevice device, int rssi, byte[] scanRecord) {
                    if (device.getName() != null && (device.getName().startsWith("FT_") || device.getName().startsWith("ID_"))) {
                        if (BT4.this.arrayForBlueToothDevice.contains(device)) {
                            BT4.this.arrayForBlueToothDevice.resetTimer(device);
                        } else {
                            LeBluetoothParsedScanRecord parsedScanRecord = LeBluetoothParsedScanRecord.parseFromBytes(scanRecord);
                            List<ParcelUuid> radioUuids = parsedScanRecord.getServiceUuids();
                            if (radioUuids != null) {
                                Iterator var6 = radioUuids.iterator();

                                while (true) {
                                    ParcelUuid parcelUuid;
                                    do {
                                        if (!var6.hasNext()) {
                                            return;
                                        }

                                        parcelUuid = (ParcelUuid) var6.next();
                                    } while (!parcelUuid.getUuid().equals(BluetoothLeClass.UUID_SERVICE_C4) && !parcelUuid.getUuid().equals(BluetoothLeClass.UUID_SERVICE_C6) && !parcelUuid.getUuid().equals(BluetoothLeClass.UUID_SERVICE_C4_NEW) && !parcelUuid.getUuid().equals(BluetoothLeClass.UUID_SERVICE_C6_NEW) && !parcelUuid.getUuid().equals(BluetoothLeClass.UUID_SERVICE_FIRMWARE_VERSION_C4) && !parcelUuid.getUuid().equals(BluetoothLeClass.UUID_SERVICE_FIRMWARE_VERSION_C6) && !parcelUuid.getUuid().equals(BluetoothLeClass.UUID_SERVICE_C4_CORILUS));

                                    BT4.this.showLog("find ble device : " + device.getName());
                                    BT4.this.arrayForBlueToothDevice.add(device);
                                    BT4.this.mHandlerSendMessage(129, device);
                                }
                            }
                        }
                    }
                }
            };
        }

    }

    private byte[] BlueToothRead(int timeout) throws Bt4Exception {
        try {
            byte[] readDataBuff = null;
            this.isRecvApdu = true;

            byte[] recvHead;
            do {
                recvHead = new byte[10];
                this.getPipeByte(recvHead, 0, 1, timeout);
            } while ((recvHead[0] & 128) != 128);

            this.getPipeByte(recvHead, 1, 9, timeout);
            int len = (recvHead[1] & 255) + ((recvHead[2] & 255) << 8) + ((recvHead[3] & 255) << 16) + ((recvHead[4] & 255) << 24);
            if (len > 65538) {
                len = 65538;
            }

            readDataBuff = new byte[len + 10];
            System.arraycopy(recvHead, 0, readDataBuff, 0, 10);
            if (len > 0) {
                this.getPipeByte(readDataBuff, 10, len, timeout);
            }

            this.isRecvApdu = false;
            Log.e("FTSafe", "BT4_RecvData:" + Utility.bytes2HexStr(readDataBuff));
            return readDataBuff;
        } catch (Exception var5) {
            throw new Bt4Exception("BlueToothRead:" + var5.getMessage());
        }
    }

    private void getPipeByte(byte[] buf, int pos, int getLen, int timeout) throws Exception {
        while (true) {
            try {
                if (this.pipeIn.available() >= getLen) {
                    byte[] tt = new byte[getLen];
                    this.pipeIn.read(tt, 0, getLen);
                    System.arraycopy(tt, 0, buf, pos, getLen);
                    return;
                }

                this.isDataComing = false;
                if (!this.waitForDataComing((long) timeout)) {
                    throw new Exception("getPipeByte timeout");
                }
            } catch (IOException var6) {
                throw new Exception(var6.getMessage());
            }
        }
    }

    synchronized boolean waitForDataComing(long miller) {
        if (!this.isDataComing) {
            long start = System.currentTimeMillis();

            while (true) {
                try {
                    this.wait(miller);
                } catch (InterruptedException var7) {
                    var7.printStackTrace();
                }

                if (this.isDataComing) {
                    break;
                }

                long now = System.currentTimeMillis();
                if (now - start >= miller) {
                    return false;
                }

                miller -= now - start;
                start = now;
            }
        }

        return true;
    }

    synchronized void notifyDataComing() {
        this.isDataComing = true;
        this.notify();
    }

    public byte[] getBleFirmwareVersion() throws Exception {
        this.pipeIn = new PipedInputStream();
        this.pipeOut = new PipedOutputStream();

        try {
            this.pipeIn.connect(this.pipeOut);
        } catch (IOException var5) {
            var5.printStackTrace();
        }

        int i;
        for (i = 0; i < 10 && !mBluetoothLeClass.getBleFirmwareVersion(); ++i) {
            try {
                Thread.sleep(100L);
            } catch (InterruptedException var4) {
                var4.printStackTrace();
            }
        }

        if (i >= 10) {
            throw new Exception("ft_send:mBluetoothLeClass.getBleFirmwareVersion()");
        } else {
            while (true) {
                try {
                    int len = this.pipeIn.available();
                    if (len > 0) {
                        byte[] buf = new byte[len];
                        this.pipeIn.read(buf);
                        return buf;
                    }

                    this.isDataComing = false;
                    if (!this.waitForDataComing(3000L)) {
                        throw new Exception("getPipeByte timeout");
                    }
                } catch (IOException var6) {
                    throw new Exception(var6.getMessage());
                }
            }
        }
    }

    private void mHandlerSendMessage(int what, Object obj) {
        if (this.mCallback != null) {
            this.mCallback.onResult(what, obj);
        }

    }

    private void showLog(String log) {
        LogUtil.e(log);
        String className = Thread.currentThread().getStackTrace()[3].getClassName();
        String methodName = Thread.currentThread().getStackTrace()[3].getMethodName();
        this.mHandlerSendMessage(128, "[LOG]" + className + ":" + methodName + "--->" + log);
    }
}
