package com.ftsafe.comm.usb;

public class UsbException extends Exception {
   public UsbException() {
   }

   public UsbException(String errMsg) {
      super(errMsg);
   }
}
