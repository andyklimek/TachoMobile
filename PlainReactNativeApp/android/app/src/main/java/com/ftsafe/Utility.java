package com.ftsafe;

import java.util.Locale;

public class Utility {
   private static byte charToByte(char c) {
      return (byte)"0123456789ABCDEF".indexOf(c);
   }

   public static byte[] hexStrToBytes(String hexString) {
      return hexString != null && !hexString.equals("") ? hexStrToBytes(hexString, hexString.length() / 2) : null;
   }

   public static byte[] hexStrToBytes(String hexString, int len) {
      if (hexString != null && !hexString.equals("")) {
         hexString = hexString.toUpperCase(Locale.getDefault());
         char[] hexChars = hexString.toCharArray();
         byte[] d = new byte[len];

         for(int i = 0; i < len; ++i) {
            int pos = i * 2;
            d[i] = (byte)(charToByte(hexChars[pos]) << 4 | charToByte(hexChars[pos + 1]));
         }

         return d;
      } else {
         return null;
      }
   }

   public static String bytes2HexStr(byte[] src) {
      return src != null && src.length > 0 ? bytes2HexStr(src, src.length) : null;
   }

   public static String bytes2HexStr(byte[] src, int len) {
      StringBuilder stringBuilder = new StringBuilder("");
      if (src != null && src.length > 0) {
         for(int i = 0; i < len; ++i) {
            int v = src[i] & 255;
            String hv = Integer.toHexString(v);
            if (hv.length() < 2) {
               stringBuilder.append(0);
            }

            stringBuilder.append(hv + "");
         }

         return stringBuilder.toString();
      } else {
         return null;
      }
   }
}
