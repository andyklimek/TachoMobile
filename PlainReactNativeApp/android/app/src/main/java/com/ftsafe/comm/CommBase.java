package com.ftsafe.comm;

import android.bluetooth.BluetoothDevice;
import android.content.Context;
import android.hardware.usb.UsbDevice;
import android.os.Handler;
import com.ftsafe.comm.bt3.BT3;
import com.ftsafe.comm.bt3.Bt3Exception;
import com.ftsafe.comm.bt4.BT4;
import com.ftsafe.comm.bt4.BluetoothLeClass;
import com.ftsafe.comm.bt4.Bt4Exception;
import com.ftsafe.comm.usb.CCIDDescriptor;
import com.ftsafe.comm.usb.USB;
import com.ftsafe.comm.usb.USBParse;
import com.ftsafe.ftnative.FTNative;
import com.ftsafe.readerScheme.FTException;
import com.ftsafe.readerScheme.FTReaderInf;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class CommBase {
   private FTReaderInf mReaderInf;
   private Handler mHandler;
   private Context mContext;
   private int mDevType;
   BluetoothDevice mConnectedDevice = null;
   private List<BluetoothDevice> mReaders = new ArrayList();
   private String[] mUsbNames;
   private List<String> mFoundUSBDeviceNameList = new ArrayList();
   BT3 bt3;
   BT4 bt4;
   USB usb;
   private boolean pcsc = false;
   private static final int NO_DO_PPS = 0;
   private static final int DO_PPS = 1;
   private CommCallback mCallback = new CommCallback() {
      public void onResult(int state, Object msg) {
         CommBase.this.native_onStateChanged(state);
         if (state != 113 && state != 129) {
            if (state == 130) {
               CommBase.this.mConnectedDevice = null;
            } else if (state != 512 && state != 256 && state == 17) {
               CommBase.this.mDevType = 0;
               UsbDevice usbDevice = (UsbDevice)msg;
               CommBase.this.mFoundUSBDeviceNameList.add(((UsbDevice)msg).getProductName());
            }
         } else {
            BluetoothDevice device = (BluetoothDevice)msg;
            if (device != null && device.getName() != null && !device.getName().equals("")) {
               CommBase.this.mReaders.add(device);
            }
         }

         if (CommBase.this.mHandler != null) {
            CommBase.this.mHandler.sendMessage(CommBase.this.mHandler.obtainMessage(state, msg));
         }

      }
   };

   public CommBase(int devType, Context context, Handler handler) throws Exception {
      this.mDevType = devType;
      this.mHandler = handler;
      this.mContext = context;
      FTNative.init(this);

      try {
         switch(devType) {
         case 0:
            this.usb = new USB(context, this.mCallback);
            this.mReaderInf = this.usb;
            break;
         case 1:
            this.mReaderInf = new BT3(context, this.mCallback);
            break;
         case 2:
            this.mReaderInf = new BT4(context, this.mCallback);
            break;
         default:
            throw new Exception("FTREADER_TYPE error");
         }

      } catch (Exception var5) {
         throw var5;
      }
   }

   public CommBase() {
      this.pcsc = true;
   }

   public void getPowerState(BluetoothLeClass.ReadPowerCallback callback) {
      BT4.getPowerState(callback);
   }

   public int getDevType() {
      return this.mDevType;
   }

   public synchronized int writeData(int index, byte[] data, int dataLen) {
      try {
         this.mReaderInf.ft_send(index, data, 100);
         return 0;
      } catch (Exception var5) {
         var5.printStackTrace();
         return var5.hashCode();
      }
   }

   public synchronized int readData(int index, int timeout, byte[] data, int[] dataLen) {
      try {
         byte[] temp = this.mReaderInf.ft_recv(index, timeout);
         dataLen[0] = temp.length;
         System.arraycopy(temp, 0, data, 0, temp.length);
         return 0;
      } catch (Exception var6) {
         var6.printStackTrace();
         return var6.hashCode();
      }
   }

   public int getBleFirmwareVersion() throws Exception {
      if (!(this.mReaderInf instanceof USB) && !(this.mReaderInf instanceof BT3)) {
         byte[] version = ((BT4)this.mReaderInf).getBleFirmwareVersion();
         return StrUtil.byte2int(version);
      } else {
         return 0;
      }
   }

   public int isTPDUReader() {
      return this.mDevType == 0 ? 1 : 0;
   }

   public int isTPDUReader_check_by_version(int readerIndex) {
      try {
         if (this.getDevType() == 0) {
            String device = ((USB)this.mReaderInf).getDevice(readerIndex);
            int pid = this.readerGetPid(device);
            byte[] bVersion = this.readerGetFirmwareVersion(device);
            boolean isValid = this.isTPDUVersion(new String(bVersion));
            if (pid == 1283 && isValid) {
               return 1;
            }
         }
      } catch (Exception var6) {
         var6.printStackTrace();
      }

      return 0;
   }

   private boolean isTPDUVersion(String version) {
      boolean ret = false;
      if (version == null) {
         return false;
      } else {
         String[] splitVersion = version.trim().split("\\.");
         int v1 = Integer.parseInt(splitVersion[0]);
         if (v1 >= 5 && v1 < 6) {
            ret = true;
         }

         return ret;
      }
   }

   public int readerFind() throws Exception {
      try {
         this.mFoundUSBDeviceNameList.clear();
         this.mReaders.clear();
         if (!this.pcsc) {
            this.mReaderInf.ft_find();
         } else {
            Class<?> ActivityThread = Class.forName("android.app.ActivityThread");
            Method method = ActivityThread.getMethod("currentActivityThread");
            Object currentActivityThread = method.invoke(ActivityThread);
            Method method2 = currentActivityThread.getClass().getMethod("getApplication");
            Context context = (Context)method2.invoke(currentActivityThread);
            this.mReaders.clear();
            if (this.bt3 == null) {
               this.bt3 = new BT3(context, this.mCallback);
            }

            if (this.bt4 == null) {
               this.bt4 = new BT4(context, this.mCallback);
            }

            if (this.usb == null) {
               this.usb = new USB(context, this.mCallback);
            }

            this.bt3.ft_find();
            this.bt4.ft_find();
            this.usb.ft_find();
         }

         return 0;
      } catch (Exception var6) {
         throw new Exception(var6);
      }
   }

   public void readerBleStopFind() {
      this.mReaderInf.ft_stopfind();
   }

   public String[] readerOpen(Object device) throws Exception {
      this.mReaderInf.ft_open(device);
      if (this.mDevType == 0) {
         String[] names = this.getUSBSlotName(device.toString());

         for(int i = 0; i < names.length; ++i) {
            if (names[i] != null) {
               this.mUsbNames = names;
               return names;
            }
         }

         names = new String[]{new String(this.getUSBReaderName(device.toString()))};
         this.mUsbNames = names;
         return names;
      } else {
         FTNative.init(this);
         return new String[]{((BluetoothDevice)device).getName()};
      }
   }

   public int readerOpen(byte[] name, int[] slotIndex) {
      if (this.bt3 != null) {
         this.bt3.stopScan();
      }

      if (this.bt4 != null) {
         this.bt4.stopScan();
      }

      Iterator var3 = this.mReaders.iterator();

      while(var3.hasNext()) {
         BluetoothDevice device = (BluetoothDevice)var3.next();
         if (device.getName() != null && device.getName().equals(new String(name))) {
            try {
               if (device.getType() == 1) {
                  this.mDevType = 1;
                  this.mReaderInf = this.bt3;
               } else {
                  this.mDevType = 2;
                  this.mReaderInf = this.bt4;
               }

               this.mReaderInf.ft_open(device);
               this.mConnectedDevice = device;
               return 0;
            } catch (Exception var6) {
               var6.printStackTrace();
               return 1;
            }
         }
      }

      try {
         this.mReaderInf = this.usb;
         this.mReaderInf.ft_open(new String(name));
         this.mDevType = 0;

         for(int i = 0; i < this.mUsbNames.length; ++i) {
            if (this.mUsbNames[i].equals(new String(name))) {
               slotIndex[0] = i;
               this.usb.setSlotIndex(i);
               break;
            }
         }

         return 0;
      } catch (Exception var7) {
         var7.printStackTrace();
         return 1;
      }
   }

   public int readerClose(String device) throws Exception {
      try {
         if (this.mReaderInf != null) {
            this.mReaderInf.ft_close(device);
            this.mConnectedDevice = null;
         }

         return 0;
      } catch (Exception var3) {
         var3.printStackTrace();
         return var3.hashCode();
      }
   }

   int listReaders(byte[] names, int[] namesLen) {
      this.mReaders.clear();
      if (this.mConnectedDevice != null) {
         this.mReaders.add(this.mConnectedDevice);
      }

      if (this.bt3 != null) {
         try {
            this.bt3.ft_find();
         } catch (Bt3Exception var9) {
            var9.printStackTrace();
         }
      }

      if (this.bt4 != null) {
         try {
            this.bt4.ft_find();
         } catch (Bt4Exception var7) {
            var7.printStackTrace();
         } catch (InterruptedException var8) {
            var8.printStackTrace();
         }
      }

      String strNames = "";
      Iterator var4 = this.mReaders.iterator();

      while(var4.hasNext()) {
         BluetoothDevice device = (BluetoothDevice)var4.next();
         String name = device.getName();
         if (name != null && !name.equals("")) {
            strNames = strNames + name + "\u0000";
         }
      }

      if (this.usb != null) {
         try {
            var4 = this.mFoundUSBDeviceNameList.iterator();

            while(var4.hasNext()) {
               String name = (String)var4.next();
               if (name != null && !name.equals("")) {
                  strNames = strNames + name + "\u0000";
               }
            }

            if (this.usb != this.mReaderInf) {
               this.usb.ft_close("");
            }
         } catch (Exception var10) {
            var10.printStackTrace();
         }
      }

      if (strNames.length() != 0) {
         namesLen[0] = strNames.length() - 1;
      } else {
         namesLen[0] = 0;
      }

      System.arraycopy(strNames.getBytes(), 0, names, 0, namesLen[0]);
      return 0;
   }

   public byte[] readerPowerOn(String device, int slotIndex, int type) throws Exception {
      int index = slotIndex;
      if (this.mDevType == 0) {
         index = ((USB)this.mReaderInf).getDeviceIndex(device);
         ((USB)this.mReaderInf).setSlotIndex(slotIndex);
      }

      byte[] atr = new byte[128];
      int[] atrLen = new int[1];
      int ret = FTNative.readerPowerOn(index, atr, atrLen, type);
      if (ret != 0) {
         throw new FTException("err : " + ret);
      } else {
         byte[] temp = new byte[atrLen[0]];
         System.arraycopy(atr, 0, temp, 0, atrLen[0]);
         return temp;
      }
   }

   public void readerPowerOff(String device, int slotIndex) throws Exception {
      int index = slotIndex;
      if (this.mDevType == 0) {
         index = ((USB)this.mReaderInf).getDeviceIndex(device);
         ((USB)this.mReaderInf).setSlotIndex(slotIndex);
      }

      int ret = FTNative.readerPowerOff(index);
      if (ret != 0) {
         throw new FTException("err : " + ret);
      }
   }

   public byte[] readerXfrBlock(String device, int slotIndex, byte[] send) throws Exception {
      int index = slotIndex;
      if (this.mDevType == 0) {
         index = ((USB)this.mReaderInf).getDeviceIndex(device);
         ((USB)this.mReaderInf).setSlotIndex(slotIndex);
      }

      int[] outDataLen = new int[]{4096};
      byte[] outdata = new byte[outDataLen[0]];
      int ret = FTNative.readerXfrBlock(index, send, send.length, outdata, outDataLen);
      if (ret != 0) {
         throw new FTException("err : " + ret);
      } else {
         byte[] temp = new byte[outDataLen[0]];
         System.arraycopy(outdata, 0, temp, 0, outDataLen[0]);
         return temp;
      }
   }

   public byte[] readerEscape(String device, byte[] send) throws Exception {
      int index = 0;
      if (this.mDevType == 0) {
         index = ((USB)this.mReaderInf).getDeviceIndex(device);
      }

      int[] outDataLen = new int[]{4096};
      byte[] outdata = new byte[outDataLen[0]];
      int ret = FTNative.readerEscape(index, send, send.length, outdata, outDataLen);
      if (ret != 0) {
         throw new FTException("err : " + ret);
      } else {
         byte[] temp = new byte[outDataLen[0]];
         System.arraycopy(outdata, 0, temp, 0, outDataLen[0]);
         return temp;
      }
   }

   public void readerWriteFlash(String device, int length, byte[] fileData) throws Exception {
      int index = 0;
      if (this.mDevType == 0) {
         index = ((USB)this.mReaderInf).getDeviceIndex(device);
      }

      int ret = FTNative.readerWriteFlash(index, length, fileData);
      if (ret != 0) {
         throw new FTException("err : " + ret);
      }
   }

   public static String Bytes2HexString(byte[] b) {
      String ret = "";

      for(int i = 0; i < b.length; ++i) {
         String hex = Integer.toHexString(b[i] & 255);
         if (hex.length() == 1) {
            hex = '0' + hex;
         }

         ret = ret + hex.toUpperCase();
      }

      return ret;
   }

   public void readerReadFlash(String device, byte[] outData) throws Exception {
      int index = 0;
      if (this.mDevType == 0) {
         index = ((USB)this.mReaderInf).getDeviceIndex(device);
      }

      int ret = FTNative.readerReadFlash(index, outData);
      if (ret != 0) {
         throw new FTException("err : " + ret);
      }
   }

   public void readerGetSerialNum(int index, int[] length, byte[] outData) throws Exception {
      int ret = FTNative.readerGetSerialNum(index, length, outData);
      if (ret != 0) {
         throw new FTException("err : " + ret);
      }
   }

   public void readerGetDeviceHID(int index, int[] length, byte[] outData) throws Exception {
      int ret = FTNative.readerGetDeviceHID(index, length, outData);
      if (ret != 0) {
         throw new FTException("err : " + ret);
      }
   }

   public void readerGetAccessoryModeNumber(int index, int[] length, byte[] outData) throws Exception {
      int ret = FTNative.readerGetAccessoryModeNumber(index, length, outData);
      if (ret != 0) {
         throw new FTException("err : " + ret);
      }
   }

   public int readerSlotStatus(String device, int slotIndex) throws Exception {
      int index = slotIndex;
      if (this.mDevType == 0) {
         index = ((USB)this.mReaderInf).getDeviceIndex(device);
         ((USB)this.mReaderInf).setSlotIndex(slotIndex);
      }

      int[] status = new int[1];
      int ret = FTNative.readerGetSlotStatus(index, status);
      if (ret != 0) {
         throw new FTException("err : " + ret);
      } else {
         return status[0];
      }
   }

   public int readerGetPid(String device) throws Exception {
      if (this.getDevType() != 0) {
         throw new FTException("device type err");
      } else {
         return ((USB)this.mReaderInf).getProductId(device);
      }
   }

   public int readerGetBcdDevice() throws Exception {
      return 0;
   }

   public byte[] readerGetFirmwareVersion(String device) throws Exception {
      if (this.mDevType == 0) {
         return this.mReaderInf != null ? ((USB)this.mReaderInf).getFirmwareVersion(device) : null;
      } else {
         int[] versionLen = new int[]{10};
         byte[] version = new byte[versionLen[0]];
         int ret = FTNative.readerGetFirmwareVersion(version, versionLen);
         if (ret != 0) {
            throw new FTException("err : " + ret);
         } else {
            byte[] temp = new byte[versionLen[0]];
            System.arraycopy(version, 0, temp, 0, versionLen[0]);
            return temp;
         }
      }
   }

   public byte[] getUSBManufacturer(String device) throws Exception {
      return this.mDevType == 0 && this.mReaderInf != null ? ((USB)this.mReaderInf).getManufacturer(device) : new byte[10];
   }

   public byte[] getUSBReaderName(String device) throws Exception {
      if (this.mDevType == 0) {
         return this.usb != null ? this.usb.getReaderName(device) : null;
      } else {
         throw new Exception("device type err");
      }
   }

   public String[] getUSBSlotName(String device) throws Exception {
      return this.usb.getSlotName(device);
   }

   public int getCCIDDescriptorDwFeatures(int readerIndex) {
      byte[] dwFeatures = new byte[4];

      try {
         int bmRequestType = 128;
         int bRequest = 6;
         int wValue = 512;
         int wIndex = 0;
         int wLength = 9;
         byte[] descriptorLengthRecv = this.mReaderInf.ft_control(readerIndex, bmRequestType, bRequest, wValue, wIndex, wLength, 3000);
         byte[] descriptorLength = new byte[]{descriptorLengthRecv[3], descriptorLengthRecv[2]};
          wLength = StrUtil.byteArr2Int(descriptorLength, 0, 2);
         Thread.sleep(100L);
         byte[] recvBuf = this.mReaderInf.ft_control(readerIndex, bmRequestType, bRequest, wValue, wIndex, wLength, 3000);
         List<CCIDDescriptor> ccidDescriptorList = USBParse.getCCIDDescriptorList(recvBuf);
         CCIDDescriptor cciddescriptor = (CCIDDescriptor)ccidDescriptorList.get(((USB)this.mReaderInf).getSlotIndex());

         for(int i = 0; i < 4; ++i) {
            dwFeatures[i] = cciddescriptor.getDwFeatures()[3 - i];
         }
      } catch (Exception var14) {
         var14.printStackTrace();
      }

      return byteArrayToInt(dwFeatures);
   }

   public static int byteArrayToInt(byte[] bytes) {
      int value = 0;

      for(int i = 0; i < 4; ++i) {
         int shift = (3 - i) * 8;
         value += (bytes[i] & 255) << shift;
      }

      return value;
   }

   public void uninit() {
      FTNative.uninit();
   }

   native void native_onStateChanged(int var1);

   public interface CommCallback {
      void onResult(int var1, Object var2);
   }
}
