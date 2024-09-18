package com.ftsafe.readerScheme;

import android.content.Context;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import com.ftsafe.Utility;
import com.ftsafe.comm.CommBase;
import com.ftsafe.comm.StrUtil;
import com.ftsafe.comm.bt4.BluetoothLeClass;

public class FTReader {
   CommBase ccidScheme;
   Handler gHandler = null;
   Context mContext;
   int mDeviceType = -1;
   private Handler mHandler = new Handler() {
      public void handleMessage(Message msg) {
         super.handleMessage(msg);
         FTReader.this.gHandlerSendMessage(msg.what, msg.obj);
      }
   };

   public FTReader(Context context, Handler handler, int FTREADER_TYPE) {
      this.gHandler = handler;
      this.mContext = context;
      this.mDeviceType = FTREADER_TYPE;

      try {
         this.ccidScheme = new CommBase(FTREADER_TYPE, context, this.mHandler);
      } catch (Exception var5) {
         this.showErrLog(var5);
      }

   }

   public void readerFind() throws FTException {
      try {
         this.ccidScheme.readerFind();
      } catch (Exception var2) {
         this.throwFTError(var2);
      }

   }

   public void readerBleStopFind() {
      this.ccidScheme.readerBleStopFind();
   }

   public String[] readerOpen(Object device) throws FTException {
      String[] readerNames = null;

      try {
         readerNames = (String[])this.ccidScheme.readerOpen(device);
         if (readerNames == null) {
            throw new FTException("readerNames == null");
         }
      } catch (Exception var4) {
         this.throwFTError(var4);
      }

      return readerNames;
   }

   public void readerClose(String device) throws FTException {
      try {
         this.ccidScheme.readerClose(device);
      } catch (Exception var3) {
         this.throwFTError(var3);
      }

   }

   public byte[] readerPowerOn(String device, int slotIndex) throws FTException {
      byte[] atr = null;
      boolean var4 = false;

      try {
         int type = this.ccidScheme.isTPDUReader();
         atr = (byte[])this.ccidScheme.readerPowerOn(device, slotIndex, type);
      } catch (Exception var6) {
         this.throwFTError(var6);
      }

      return atr;
   }

   public void readerPowerOff(String device, int slotIndex) throws FTException {
      try {
         int cardState = this.readerGetSlotStatus(device, slotIndex);
         if (cardState == 2) {
            this.throwFTError(new FTException("Card absent."));
         }

         this.ccidScheme.readerPowerOff(device, slotIndex);
      } catch (Exception var4) {
         this.throwFTError(var4);
      }

   }

   public byte[] readerXfr(String device, int slotIndex, byte[] send) throws FTException {
      byte[] recv = null;

      try {
         int sendLen = send.length;
         if (sendLen != 4 && sendLen != 5 && (sendLen != 7 || (send[4] & 255) != 0) && (sendLen <= 5 || (send[4] & 255) == 0 || sendLen != (send[4] & 255) + 4 + 1) && (sendLen <= 7 || (send[4] & 255) != 0 || sendLen != (send[5] & 255) * 256 + (send[6] & 255) + 4 + 3) && (sendLen <= 6 || (send[4] & 255) == 0 || sendLen != (send[4] & 255) + 4 + 1 + 1) && (sendLen <= 10 || (send[4] & 255) != 0 || sendLen != (send[5] & 255) * 256 + (send[6] & 255) + 4 + 3 + 3)) {
            throw new Exception("apdu lc le error");
         }

         recv = (byte[])this.ccidScheme.readerXfrBlock(device, slotIndex, send);
         if (recv.length <= 0) {
            throw new Exception("apdu send recv error");
         }
      } catch (Exception var6) {
         this.throwFTError(var6);
      }

      return recv;
   }

   public byte[] readerEscape(String device, byte[] send) throws FTException {
      byte[] recv = null;

      try {
         recv = (byte[])this.ccidScheme.readerEscape(device, send);
      } catch (Exception var5) {
         this.throwFTError(var5);
      }

      return recv;
   }

   public void readerWriteFlash(String device, int length, byte[] fileData) throws FTException {
      try {
         this.ccidScheme.readerWriteFlash(device, length, fileData);
      } catch (Exception var5) {
         this.throwFTError(var5);
      }

   }

   public void readerReadFlash(String device, byte[] outData) throws FTException {
      try {
         this.ccidScheme.readerReadFlash(device, outData);
      } catch (Exception var4) {
         this.throwFTError(var4);
      }

   }

   public void readerGetSerialNum(int index, int[] length, byte[] outData) throws FTException {
      try {
         this.ccidScheme.readerGetSerialNum(index, length, outData);
      } catch (Exception var5) {
         this.throwFTError(var5);
      }

   }

   public void readerGetDeviceHID(int index, int[] length, byte[] outData) throws FTException {
      try {
         this.ccidScheme.readerGetDeviceHID(index, length, outData);
      } catch (Exception var5) {
         this.throwFTError(var5);
      }

   }

   public void readerGetAccessoryModeNumber(int index, int[] length, byte[] outData) throws FTException {
      try {
         this.ccidScheme.readerGetAccessoryModeNumber(index, length, outData);
      } catch (Exception var5) {
         this.throwFTError(var5);
      }

   }

   public int readerGetSlotStatus(String device, int slotIndex) throws FTException {
      try {
         int status = this.ccidScheme.readerSlotStatus(device, slotIndex);
         switch(status) {
         case 0:
            return 0;
         case 1:
            return 1;
         case 2:
            return 2;
         }
      } catch (Exception var4) {
         this.throwFTError(var4);
      }

      return 2;
   }

   public int readerGetType(String device) throws FTException {
      try {
         if (this.ccidScheme.getDevType() == 0) {
            int pid = this.ccidScheme.readerGetPid(device);
            switch(pid) {
            case 257:
               return 257;
            case 1283:
               return 100;
            case 1544:
               return 103;
            case 1545:
               return 109;
            case 1546:
               return 110;
            case 1547:
               return 111;
            case 1548:
               return 112;
            case 1549:
               return 104;
            case 1561:
               return 107;
            case 1562:
               return 105;
            case 1564:
               return 106;
            case 1570:
               return 108;
            case 1571:
               return 102;
            case 1572:
               return 101;
            default:
               return 120;
            }
         } else {
            byte[] send = new byte[]{-91, 90, 56, 23};
            byte[] recv = this.readerEscape(device, send);
            String type = this.parseRecvData(recv, recv.length - 2);
            return type == null ? 120 : this.stringType2IntType(type);
         }
      } catch (Exception var5) {
         this.throwFTError(var5);
         return 120;
      }
   }

   public byte[] readerGetSerialNumber(String device) throws FTException {
      byte[] result = null;

      try {
         byte[] send;
         if (this.ccidScheme.getDevType() == 2) {
            send = new byte[]{-91, 90, 50, 49};
            result = this.readerEscapeWithParseSw1Sw2(device, send);
         } else if (this.ccidScheme.getDevType() == 1) {
            send = new byte[]{90, -91, 49, 49};
            result = this.readerEscapeWithParseSw1Sw2(device, send);
         } else {
            int type = this.readerGetType(device);
             if (type != 100 && type != 101 && type != 102 && type != 108 && type != 103 && type != 109 && type != 110 && type != 111 && type != 112 && type != 257) {
               if (type == 104) {
                  send = new byte[]{-91, 90, 112, 0};
                  result = this.readerEscapeWithParseSw1Sw2(device, send);
               } else {
                  if (type != 105 && type != 106 && type != 107) {
                     throw new Exception("Not Support");
                  }

                  send = new byte[]{90, -91, 49, 49};
                  result = this.readerEscapeWithParseSw1Sw2(device, send);
               }
            } else {
               send = new byte[]{-91, 90, 50, 49};
               result = this.readerEscapeWithParseSw1Sw2(device, send);
            }
         }
      } catch (Exception var5) {
         this.throwFTError(var5);
      }

      if (result.length != 8) {
         result = this.mergeResult(result);
      }

      return result;
   }

   private byte[] mergeResult(byte[] src) {
      if (src.length % 2 != 0) {
         return src;
      } else {
         byte[] result = new byte[src.length / 2];

         try {
            for(int i = 0; i < src.length / 2; ++i) {
               result[i] = (byte)(StrUtil.hexChar2Byte((char)src[i * 2]) * 16 + StrUtil.hexChar2Byte((char)src[i * 2 + 1]));
            }
         } catch (RuntimeException var4) {
            if (var4.getMessage().equals("param format error.")) {
               return src;
            }
         }

         return result;
      }
   }

   public String readerGetFirmwareVersion(String device) throws FTException {
      try {
         byte[] bVersion = this.ccidScheme.readerGetFirmwareVersion(device);
         return new String(bVersion);
      } catch (Exception var3) {
         this.throwFTError(var3);
         return "";
      }
   }

   public String getBleFirmwareVersion() throws Exception {
      if (this.ccidScheme.getDevType() != 1 && this.ccidScheme.getDevType() != 0) {
         int versionInt = this.ccidScheme.getBleFirmwareVersion();
         byte[] versionByte = StrUtil.int2byte(versionInt);
         return StrUtil.byteArr2HexStr(versionByte, 0, 3);
      } else {
         return "";
      }
   }

   public byte[] readerGetUID(String device) throws FTException {
      try {
         byte[] send;
         if (this.ccidScheme.getDevType() == 2) {
            send = new byte[]{-91, 90, 49, 49};
            return this.readerEscapeWithParseSw1Sw2(device, send);
         } else if (this.ccidScheme.getDevType() == 1) {
            send = new byte[]{90, -91, 112, 49};
            return this.readerEscapeWithParseSw1Sw2(device, send);
         } else {
            int type = this.readerGetType(device);
             if (type != 100 && type != 101 && type != 102 && type != 103 && type != 104 && type != 108 && type != 109 && type != 110 && type != 111 && type != 112 && type != 257) {
               if (type != 105 && type != 106 && type != 107) {
                  throw new Exception("Not Support");
               } else {
                  send = new byte[]{90, -91, 112, 49};
                  return this.readerEscapeWithParseSw1Sw2(device, send);
               }
            } else {
               send = new byte[]{-91, 90, 49, 49};
               return this.readerEscapeWithParseSw1Sw2(device, send);
            }
         }
      } catch (Exception var4) {
         this.throwFTError(var4);
         return null;
      }
   }

   public byte[] FT_AutoTurnOffReader(String device, boolean isOpen) throws FTException {
      int type = this.readerGetType(device);

      try {
         byte[] send;
         if (this.ccidScheme.getDevType() != 0 || type != 107 && type != 106) {
            if (isOpen) {
               send = new byte[]{-91, 90, 57, 1};
               return this.readerEscape(device, send);
            } else {
               send = new byte[]{-91, 90, 57, 2};
               return this.readerEscape(device, send);
            }
         } else if (isOpen) {
            send = new byte[]{90, -91, 96, 48};
            return this.readerEscape(device, send);
         } else {
            send = new byte[]{90, -91, 96, 49};
            return this.readerEscape(device, send);
         }
      } catch (Exception var5) {
         this.throwFTError(var5);
         return null;
      }
   }

   public byte[] readerGetManufacturer(String device) throws FTException {
      try {
         if (this.ccidScheme.getDevType() == 0) {
            return this.ccidScheme.getUSBManufacturer(device);
         } else {
            byte[] send = new byte[]{-91, 90, 56, 19};
            byte[] recv = this.readerEscapeWithParseSw1Sw2(device, send);
            return this.parseRecvData(recv, recv.length).getBytes();
         }
      } catch (Exception var4) {
         this.throwFTError(var4);
         return null;
      }
   }

   public byte[] readerGetHardwareInfo(String device) throws FTException {
      int type = this.readerGetType(device);
      if (this.ccidScheme.getDevType() == 0 && (type == 107 || type == 106)) {
         throw new FTException("Not Support");
      } else {
         try {
            byte[] send = new byte[]{-91, 90, 52, 1};
            return this.readerEscapeWithParseSw1Sw2(device, send);
         } catch (Exception var6) {
            try {
               byte[] send = new byte[]{-91, 90, 56, 21};
               return this.readerEscapeWithParseSw1Sw2(device, send);
            } catch (Exception var5) {
               var5.printStackTrace();
               this.throwFTError(var6);
               return null;
            }
         }
      }
   }

   public byte[] readerGetReaderName(String device) throws FTException {
      try {
         if (this.ccidScheme.getDevType() == 0) {
            return this.ccidScheme.getUSBReaderName(device);
         } else {
            byte[] recv = new byte[]{-91, 90, 56, 22};
            byte[] dataWithoutSw1Sw2 = this.readerEscapeWithParseSw1Sw2(device, recv);
            String sn = this.parseRecvData(dataWithoutSw1Sw2, dataWithoutSw1Sw2.length);
            Log.e("FtSafe", "读卡器类型：：：：：：" + sn);
            return sn.getBytes();
         }
      } catch (Exception var5) {
         this.throwFTError(var5);
         return null;
      }
   }

   public static String getSDKVersion() {
      return "2.0.1.3";
   }

   public static String getAppVersion() {
      return "1.0.2";
   }

   private byte[] readerEscapeWithParseSw1Sw2(String device, byte[] send) throws Exception {
      byte[] recv = this.readerEscape(device, send);
      int len = recv.length;
      byte[] sw;
      if (recv[len - 2] == -112 && recv[len - 1] == 0) {
         sw = new byte[len - 2];
         System.arraycopy(recv, 0, sw, 0, len - 2);
         return sw;
      } else {
         sw = new byte[]{recv[len - 2], recv[len - 1]};
         String errLog = "[" + Utility.bytes2HexStr(sw) + "]";
         if (sw[0] == 108) {
            switch(sw[1]) {
            case 71:
               errLog = errLog + "Error with module communication";
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
            case 91:
            case 92:
            case 93:
            case 94:
            case 95:
            case 96:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
            case 123:
            case 124:
            case 125:
            case 126:
            case 127:
            default:
               break;
            case 112:
               errLog = errLog + "Plaintext validation error";
               break;
            case (byte) 128:
               errLog = errLog + "Data length error";
               break;
            case (byte) 129:
               errLog = errLog + "LC length and data length not equal";
               break;
            case (byte) 130:
               errLog = errLog + "UID exist";
               break;
            case (byte) 131:
               errLog = errLog + "UID can't generate";
               break;
            case (byte) 132:
               errLog = errLog + "Ciphertext decryption data comparison error";
               break;
            case (byte) 133:
               errLog = errLog + "HID exist";
               break;
            case (byte) 134:
               errLog = errLog + "Out of storage range";
               break;
            case (byte) 135:
               errLog = errLog + "Unable to erase storage space normally";
               break;
            case(byte)  136:
               errLog = errLog + "Unable to read storage space normally";
               break;
            case (byte) 137:
               errLog = errLog + "Unable to write storage space normally";
               break;
            case (byte) 138:
               errLog = errLog + "Seed error";
               break;
            case (byte) 139:
               errLog = errLog + "Data error in data area";
               break;
            case (byte) 140:
               errLog = errLog + "Address byte check error";
               break;
            case (byte) 141:
               errLog = errLog + "The program is in space byte detection error";
               break;
            case (byte) 142:
               errLog = errLog + "Update step error";
               break;
            case (byte) 143:
               errLog = errLog + "Cipher check error";
            }

            throw new Exception(errLog);
         } else {
            return recv;
         }
      }
   }

   private String parseRecvData(byte[] data, int dataLen) {
      String result = "";
      if (data.length < dataLen) {
         return new String(data);
      } else if (data[0] != dataLen) {
         return new String(data);
      } else if (data[1] != 3) {
         return new String(data);
      } else if (dataLen % 2 != 0) {
         return new String(data);
      } else {
         for(int i = 2; i < dataLen; ++i) {
            if (i % 2 == 0) {
               result = result + (char)data[i];
            } else if (data[i] != 0) {
               return new String(data);
            }
         }

         return result;
      }
   }

   private int stringType2IntType(String stringType) {
      if (stringType.toUpperCase().contains("R301E")) {
         return 100;
      } else if (stringType.toUpperCase().contains("BR301FC4")) {
         return 101;
      } else if (stringType.toUpperCase().contains("BR500")) {
         return 102;
      } else if (stringType.toUpperCase().contains("R502_CL")) {
         return 103;
      } else if (stringType.toUpperCase().contains("R502_DUAL")) {
         return 104;
      } else if (stringType.toUpperCase().contains("BR301")) {
         return 105;
      } else if (stringType.toUpperCase().contains("IR301_LT")) {
         return 106;
      } else if (stringType.toUpperCase().contains("IR301")) {
         return 107;
      } else {
         return stringType.toUpperCase().contains("VR504") ? 108 : 120;
      }
   }

   private void gHandlerSendMessage(final int what, final Object obj) {
      if (this.mDeviceType == 0) {
         this.gHandler.sendMessage(this.gHandler.obtainMessage(what, 100, 100, obj));
      } else {
         (new Thread(new Runnable() {
            public void run() {
               if (FTReader.this.gHandler != null) {
                  FTReader.this.ccidScheme.getPowerState(new BluetoothLeClass.ReadPowerCallback() {
                     public void onPowerRead(int state) {
                        FTReader.this.gHandler.sendMessage(FTReader.this.gHandler.obtainMessage(what, state, state, obj));
                     }
                  });
               }

            }
         })).start();
      }

   }

   private void throwFTError(Exception e) throws FTException {
      String className = Thread.currentThread().getStackTrace()[3].getClassName();
      String methodName = Thread.currentThread().getStackTrace()[3].getMethodName();
      e.printStackTrace();
      throw new FTException("[ERROR][" + className + ":" + methodName + "][" + e.getMessage() + "][" + e.toString() + "]");
   }

   private void showErrLog(Exception e) {
      String className = Thread.currentThread().getStackTrace()[3].getClassName();
      String methodName = Thread.currentThread().getStackTrace()[3].getMethodName();
      this.showLog("ERROR::" + className + ":" + methodName + " [" + e.getMessage() + "][" + e.toString() + "]");
   }

   private void showLog(String log) {
      String className = Thread.currentThread().getStackTrace()[3].getClassName();
      String methodName = Thread.currentThread().getStackTrace()[3].getMethodName();
      this.gHandlerSendMessage(80, "[LOG]" + className + ":" + methodName + "--->" + log);
   }
}
