package com.ftsafe.ftnative;

import com.ftsafe.comm.CommBase;

public class FTNative {
   public static native void init(CommBase var0);

   public static native void uninit();

   public static native int readerPowerOn(int var0, byte[] var1, int[] var2, int var3);

   public static native int readerPowerOff(int var0);

   public static native int readerWriteFlash(int var0, int var1, byte[] var2);

   public static native int readerReadFlash(int var0, byte[] var1);

   public static native int readerGetSerialNum(int var0, int[] var1, byte[] var2);

   public static native int readerGetDeviceHID(int var0, int[] var1, byte[] var2);

   public static native int readerGetAccessoryModeNumber(int var0, int[] var1, byte[] var2);

   public static native int readerXfrBlock(int var0, byte[] var1, int var2, byte[] var3, int[] var4);

   public static native int readerEscape(int var0, byte[] var1, int var2, byte[] var3, int[] var4);

   public static native int readerGetSlotStatus(int var0, int[] var1);

   public static native int readerGetFirmwareVersion(byte[] var0, int[] var1);

   static {
      System.loadLibrary("FTReaderPCSC_2.0.1.3");
   }
}
