package com.ftsafe.comm.usb;

public class CCIDDescriptor {
   public static final int CCID_HEAD_LEN = 10;
   public static final int DW_PROTOCOLS_LEN = 4;
   public static final int DW_FEATURES_LEN = 4;
   public static final int DW_PROTOCOLS_INDEX = 6;
   public static final int DW_FEATURES_INDEX = 40;
   private byte[] dwProtocols = new byte[4];
   private byte[] dwFeatures = new byte[4];

   public void parse(byte[] data, int index, int len) {
      System.arraycopy(data, index + 6, this.dwProtocols, 0, 4);
      System.arraycopy(data, index + 40, this.dwFeatures, 0, 4);
   }

   public byte[] getDwProtocols() {
      return this.dwProtocols;
   }

   public byte[] getDwFeatures() {
      return this.dwFeatures;
   }
}
