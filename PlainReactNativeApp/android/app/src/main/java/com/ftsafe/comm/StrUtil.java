package com.ftsafe.comm;

import android.util.SparseArray;
import java.util.Arrays;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

public class StrUtil {
   public static String byteArr2HexStr(byte[] bt) {
      return byteArr2HexStr(bt, "");
   }

   public static String byteArr2HexStr(byte[] bt, String sep) {
      return byteArr2HexStr(bt, 0, bt.length, sep);
   }

   public static String byteArr2HexStr(byte[] bt, int end, String sep) {
      return byteArr2HexStr(bt, 0, end, sep);
   }

   public static String byteArr2HexStr(byte[] bt, int start, int end) {
      return byteArr2HexStr(bt, start, end, "");
   }

   public static String byteArr2HexStr(byte[] bt, int start, int end, String sep) {
      if (bt != null && bt.length >= end && start >= 0 && start < end) {
         StringBuffer sb = new StringBuffer();

         for(int i = start; i < end; ++i) {
            sb.append(byte2HexStr(bt[i])).append(sep);
         }

         return sb.toString();
      } else {
         throw new RuntimeException("param format error");
      }
   }

   public static String byte2HexStr(byte b) {
      int i = (b & 240) >> 4;
      int j = b & 15;
      char c = (char)(i > 9 ? 65 + i % 10 : 48 + i);
      char d = (char)(j > 9 ? 65 + j % 10 : 48 + j);
      return "" + c + d;
   }

   public static byte[] hexStr2ByteArr(String str) {
      if (str != null && str.length() % 2 == 0) {
         byte[] bt = new byte[str.length() / 2];

         for(int i = 0; i < bt.length; ++i) {
            bt[i] = (byte)((hexChar2Byte(str.charAt(2 * i)) << 4) + hexChar2Byte(str.charAt(2 * i + 1)));
         }

         return bt;
      } else {
         throw new RuntimeException("param format error.");
      }
   }

   public static byte hexChar2Byte(char c) throws RuntimeException {
      if (c >= '0' && c <= '9') {
         return (byte)(c - 48);
      } else if (c >= 'A' && c <= 'F') {
         return (byte)(c - 65 + 10);
      } else if (c >= 'a' && c <= 'f') {
         return (byte)(c - 97 + 10);
      } else {
         throw new RuntimeException("param format error.");
      }
   }

   public static byte hexStr2Byte(String str) {
      if (str != null && str.length() <= 2) {
         return str.length() == 1 ? hexChar2Byte(str.charAt(0)) : (byte)((hexChar2Byte(str.charAt(1)) << 4) + hexChar2Byte(str.charAt(0)));
      } else {
         throw new RuntimeException("param format error.");
      }
   }

   public static <T extends Comparable<T>> boolean compare(List<T> a, List<T> b) {
      if (a.size() != b.size()) {
         return false;
      } else {
         Collections.sort(a);
         Collections.sort(b);

         for(int i = 0; i < a.size(); ++i) {
            if (!((Comparable)a.get(i)).equals(b.get(i))) {
               return false;
            }
         }

         return true;
      }
   }

   public static String toString(SparseArray<byte[]> array) {
      if (array == null) {
         return "null";
      } else if (array.size() == 0) {
         return "{}";
      } else {
         StringBuilder buffer = new StringBuilder();
         buffer.append('{');

         for(int i = 0; i < array.size(); ++i) {
            buffer.append(array.keyAt(i)).append("=").append(Arrays.toString((byte[])array.valueAt(i)));
         }

         buffer.append('}');
         return buffer.toString();
      }
   }

   public static <T> String toString(Map<T, byte[]> map) {
      if (map == null) {
         return "null";
      } else if (map.isEmpty()) {
         return "{}";
      } else {
         StringBuilder buffer = new StringBuilder();
         buffer.append('{');
         Iterator it = map.entrySet().iterator();

         while(it.hasNext()) {
            Entry<T, byte[]> entry = (Entry)it.next();
            Object key = entry.getKey();
            buffer.append(key).append("=").append(Arrays.toString((byte[])map.get(key)));
            if (it.hasNext()) {
               buffer.append(", ");
            }
         }

         buffer.append('}');
         return buffer.toString();
      }
   }

   public static int byteArr2Int(byte[] b, int start, int len) {
      int sum = 0;
      int end = start + len;

      for(int i = start; i < end; ++i) {
         int n = b[i] & 255;
         --len;
         n <<= len * 8;
         sum += n;
      }

      return sum;
   }

   public static int byte2int(byte[] res) {
      int targets = res[0] & 255 | res[1] << 8 & '\uff00' | res[2] << 24 >>> 8 | res[3] << 24;
      return targets;
   }

   public static byte[] int2byte(int res) {
      byte[] targets = new byte[]{(byte)(res & 255), (byte)(res >> 8 & 255), (byte)(res >> 16 & 255), (byte)(res >>> 24)};
      return targets;
   }
}
