package com.ftsafe.comm.bt3;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.util.Log;

import com.ftsafe.Utility;
import com.ftsafe.comm.CommBase;
import com.ftsafe.comm.StrUtil;
import com.ftsafe.readerScheme.FTReaderInf;
import com.ftsafe.util.LogUtil;

import java.io.IOException;
import java.io.PipedInputStream;
import java.io.PipedOutputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Set;
import java.util.UUID;

public class BT3 implements FTReaderInf {
    private Context tContext;
    private CommBase.CommCallback mCallback;
    ArrayList<BluetoothDevice> arrayForBlueToothDevice = new ArrayList();
    BluetoothAdapter mBlueToothAdapter = null;
    BluetoothDevice mBluetoothDevice = null;
    BluetoothSocket mBlueToothSocket = null;
    PipedInputStream pipeIn = new PipedInputStream();
    PipedOutputStream pipeOut = new PipedOutputStream();
    byte[] readData = null;
    BroadcastReceiver mBt3FoundReceiver;
    BroadcastReceiver mBt3DisconnectReceiver;
    public static final String BT_NAME = "FT_";
    public static final String BT_NAME_1 = "ID_";
    private boolean connecting = false;
    private boolean isRecvApdu = false;
    private boolean isDataComing = false;

    public BT3(Context context, CommBase.CommCallback callback) throws Bt3Exception {
        this.tContext = context;
        this.mCallback = callback;
        this.mBlueToothAdapter = BluetoothAdapter.getDefaultAdapter();
        if (this.mBlueToothAdapter == null) {
            throw new Bt3Exception("BluetoothAdapter.getDefaultAdapter() == null");
        } else {
            (new Thread(new Runnable() {
                public void run() {
                    while (true) {
                        while (true) {
                            try {
                                if (BT3.this.mBluetoothDevice != null && BT3.this.mBlueToothSocket != null && BT3.this.mBlueToothSocket.isConnected()) {
                                    byte[] tmp = new byte[1024];
                                    if (BT3.this.mBlueToothSocket.getInputStream().available() == 0) {
                                        Thread.sleep(100L);
                                    } else {
                                        int len = BT3.this.mBlueToothSocket.getInputStream().read(tmp);
                                        LogUtil.e("[RECV]" + StrUtil.byteArr2HexStr(tmp, 0, len));
                                        if (tmp[0] == 80 && tmp[1] == 2 && len == 2) {
                                            BT3.this.mHandlerSendMessage(512, "");
                                        } else if (tmp[0] == 80 && tmp[1] == 3 && len == 2) {
                                            BT3.this.mHandlerSendMessage(256, "");
                                        } else if (BT3.this.isRecvApdu) {
                                            BT3.this.pipeOut.write(tmp, 0, len);
                                            BT3.this.notifyDataComing();
                                        } else {
                                            BT3.this.showLog("dirty data:" + Utility.bytes2HexStr(tmp, len));
                                        }
                                    }
                                } else {
                                    Thread.sleep(1000L);
                                }
                            } catch (Exception var3) {
                                return;
                            }
                        }
                    }
                }
            })).start();

            try {
                this.pipeIn.connect(this.pipeOut);
            } catch (IOException var4) {
                throw new Bt3Exception(var4.getMessage());
            }
        }
    }

    public Boolean isFtExist() {
        return this.mBluetoothDevice != null && this.mBlueToothSocket != null;
    }

    public void ft_find() throws Bt3Exception {
        this.registerFoundBroadcast();
        if (this.mBlueToothAdapter == null) {
            this.arrayForBlueToothDevice.clear();
            throw new Bt3Exception("mBlueToothAdapter == null");
        } else {
            Set<BluetoothDevice> pairedDevices = this.mBlueToothAdapter.getBondedDevices();
            Iterator var2;
            BluetoothDevice bluetoothDevice;
            if (pairedDevices.size() > 0) {
                var2 = pairedDevices.iterator();

                label56:
                while (true) {
                    do {
                        do {
                            do {
                                do {
                                    if (!var2.hasNext()) {
                                        break label56;
                                    }

                                    bluetoothDevice = (BluetoothDevice) var2.next();
                                } while (this.arrayForBlueToothDevice.contains(bluetoothDevice));
                            } while (bluetoothDevice.getName() == null);
                        } while (!bluetoothDevice.getName().startsWith("FT_"));
                    } while (this.isFtExist() && this.mBlueToothSocket.isConnected() && this.mBluetoothDevice.getName().equals(bluetoothDevice.getName()));

                    this.arrayForBlueToothDevice.add(bluetoothDevice);
                }
            }

            var2 = this.arrayForBlueToothDevice.iterator();

            while (var2.hasNext()) {
                bluetoothDevice = (BluetoothDevice) var2.next();
                this.mHandlerSendMessage(113, bluetoothDevice);
            }

            if (!this.mBlueToothAdapter.isDiscovering()) {
                this.arrayForBlueToothDevice.clear();
                this.mBlueToothAdapter.cancelDiscovery();
                this.mBlueToothAdapter.startDiscovery();
            }
        }
    }

    public void ft_stopfind() {
        this.stopScan();
    }

    public void stopScan() {
        if (this.mBlueToothAdapter != null) {
            this.mBlueToothAdapter.cancelDiscovery();
        }
    }

    public void ft_open(Object device) throws Bt3Exception {
        if (device == null) {
            throw new Bt3Exception("device == null");
        } else {
            this.registerDisconnectBroadcast();
            this.mBlueToothAdapter.cancelDiscovery();

            try {
                if (this.mBlueToothSocket != null && this.mBlueToothSocket.isConnected() && this.mBluetoothDevice.getAddress().equals(((BluetoothDevice) device).getAddress())) {
                    this.showLog("donaaaaaaaaaaaaaaaaaaaaaa");
                    return;
                }

                this.connect((BluetoothDevice) device);
            } catch (Exception var5) {
                try {
                    this.connect((BluetoothDevice) device);
                } catch (Exception var4) {
                    throw new Bt3Exception(var4.getMessage());
                }
            }

        }
    }

    private void connect(BluetoothDevice device) throws IOException, InterruptedException {
        this.connecting = true;

        try {
            this.mBluetoothDevice = device;
            this.mBlueToothSocket = this.mBluetoothDevice.createInsecureRfcommSocketToServiceRecord(UUID.fromString("00001101-0000-1000-8000-00805F9B34FB"));
            this.mBlueToothSocket.connect();
            this.arrayForBlueToothDevice.clear();
            this.connecting = false;
        } catch (Exception var3) {
            this.connecting = false;
            throw var3;
        }
    }

    private void registerFoundBroadcast() {
        if (this.mBt3FoundReceiver == null) {
            this.mBt3FoundReceiver = new BroadcastReceiver() {
                public void onReceive(Context context, Intent intent) {
                    if ("android.bluetooth.device.action.FOUND".equals(intent.getAction())) {
                        BluetoothDevice device = (BluetoothDevice) intent.getParcelableExtra("android.bluetooth.device.extra.DEVICE");
                        if (device.getType() != 1) {
                            return;
                        }

                        if (!BT3.this.arrayForBlueToothDevice.contains(device) && device.getName() != null && !device.getName().startsWith("FT_") && device.getName().startsWith("ID_")) {
                        }
                    }

                }
            };
            IntentFilter filter = new IntentFilter();
            filter.addAction("android.bluetooth.device.action.FOUND");
            this.tContext.getApplicationContext().registerReceiver(this.mBt3FoundReceiver, filter);
        }

    }

    private void registerDisconnectBroadcast() {
        if (this.mBt3DisconnectReceiver == null) {
            this.mBt3DisconnectReceiver = new BroadcastReceiver() {
                public void onReceive(Context context, Intent intent) {
                    if ("android.bluetooth.device.action.ACL_DISCONNECTED".equals(intent.getAction())) {
                        BluetoothDevice device = (BluetoothDevice) intent.getParcelableExtra("android.bluetooth.device.extra.DEVICE");
                        if (BT3.this.mBluetoothDevice == null || !BT3.this.mBluetoothDevice.getAddress().equals(device.getAddress())) {
                            return;
                        }

                        if (BT3.this.connecting) {
                            return;
                        }

                        BT3.this.mBluetoothDevice = null;
                        if (BT3.this.mBlueToothSocket != null && BT3.this.mBlueToothSocket.isConnected()) {
                            try {
                                BT3.this.mBlueToothSocket.close();
                            } catch (IOException var5) {
                                BT3.this.showLog("mBlueToothSocket.close()::do-nothing::" + var5.getMessage());
                            }
                        }

                        BT3.this.mBlueToothSocket = null;
                        BT3.this.mHandlerSendMessage(114, "");
                        BT3.this.unregisterBroadcast();
                    }

                }
            };
            IntentFilter filter = new IntentFilter();
            filter.addAction("android.bluetooth.device.action.ACL_DISCONNECTED");
            this.tContext.getApplicationContext().registerReceiver(this.mBt3DisconnectReceiver, filter);
        }

    }

    private void unregisterBroadcast() {
        if (this.mBt3FoundReceiver != null) {
            this.tContext.getApplicationContext().unregisterReceiver(this.mBt3FoundReceiver);
            this.mBt3FoundReceiver = null;
        }

        if (this.mBt3DisconnectReceiver != null) {
            this.tContext.getApplicationContext().unregisterReceiver(this.mBt3DisconnectReceiver);
            this.mBt3DisconnectReceiver = null;
        }

    }

    public void ft_close(String device) {
        if (this.mBlueToothSocket != null && this.mBlueToothSocket.isConnected()) {
            try {
                this.mBlueToothSocket.close();
            } catch (IOException var3) {
                this.showLog("ft_close::mBlueToothSocket.close()::do-nothing::" + var3.getMessage());
            }
        }

    }

    private byte[] intsToBytes(int[] a) {
        byte[] b = new byte[a.length];

        for (int i = 0; i < a.length; ++i) {
            b[i] = (byte) a[i];
        }

        return b;
    }

    public byte[] ft_control(int readerIndex, int requestType, int request, int value, int index, int length, int timeOut) throws Bt3Exception {
        if (requestType == 128 && request == 6 && value == 256 && index == 0) {
            return this.intsToBytes(new int[]{18, 1, 16, 1, 0, 0, 0, 32, 110, 9, 26, 6, 69, 1, 1, 2, 0, 1});
        } else if (requestType == 128 && request == 6 && value == 512 && index == 0) {
            return this.intsToBytes(new int[]{9, 2, 93, 0, 1, 1, 0, 128, 128, 9, 4, 0, 0, 3, 11, 0, 0, 0, 54, 33, 0, 1, 0, 7, 3, 0, 0, 0, 116, 14, 0, 0, 116, 14, 0, 0, 0, 218, 38, 0, 0, 72, 219, 4, 0, 53, 16, 1, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 190, 4, 4, 0, 16, 1, 0, 0, 255, 255, 0, 0, 0, 1, 7, 5, 1, 2, 32, 0, 0, 7, 5, 129, 2, 32, 0, 0});
        } else if (requestType == 128 && request == 6 && value == 769 && index == 1033) {
            return this.intsToBytes(new int[]{6, 3, 70, 0, 84, 0});
        } else if (requestType == 128 && request == 6 && value == 770 && index == 1033) {
            if (this.mBluetoothDevice == null) {
                return this.intsToBytes(new int[]{28, 3, 66, 0, 76, 0, 85, 0, 69, 0, 84, 0, 79, 0, 79, 0, 84, 0, 72, 0, 32, 0, 51, 0, 46, 0, 48, 0});
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

    public void ft_send(int out, byte[] writeDataBuff, int timeOut) throws Bt3Exception {
        try {
            LogUtil.e("[send]" + StrUtil.byteArr2HexStr(writeDataBuff));
            this.pipeIn = new PipedInputStream();
            this.pipeOut = new PipedOutputStream();

            try {
                this.pipeIn.connect(this.pipeOut);
            } catch (IOException var5) {
                var5.printStackTrace();
            }

            this.mBlueToothSocket.getOutputStream().write(writeDataBuff);
            Log.e("FTSafe", "BT3_SendData:" + Utility.bytes2HexStr(writeDataBuff));
            this.mBlueToothSocket.getOutputStream().flush();
        } catch (Exception var6) {
            throw new Bt3Exception("bt3:ft_send:" + var6.getMessage());
        }
    }

    public byte[] ft_recv(int in, int timeOut) throws Bt3Exception {
        return this.BlueToothRead(timeOut);
    }

    private byte[] BlueToothRead(int timeout) throws Bt3Exception {
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
            readDataBuff = new byte[len + 10];
            System.arraycopy(recvHead, 0, readDataBuff, 0, 10);
            if (len > 0) {
                this.getPipeByte(readDataBuff, 10, len, timeout);
            }

            this.isRecvApdu = false;
            Log.e("FTSafe", "BT3_RecvData:" + Utility.bytes2HexStr(readDataBuff));
            return readDataBuff;
        } catch (Exception var5) {
            throw new Bt3Exception("BlueToothRead:" + var5.getMessage());
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

    private void mHandlerSendMessage(int what, Object obj) {
        if (this.mCallback != null) {
            this.mCallback.onResult(what, obj);
        }

    }

    private void showLog(String log) {
        String className = Thread.currentThread().getStackTrace()[3].getClassName();
        String methodName = Thread.currentThread().getStackTrace()[3].getMethodName();
        this.mHandlerSendMessage(112, "[LOG]" + className + ":" + methodName + "--->" + log);
    }
}
