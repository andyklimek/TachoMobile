package com.ftsafe.comm;

import android.annotation.SuppressLint;
import android.os.ParcelUuid;
import android.os.Build.VERSION;
import android.util.ArrayMap;
import android.util.SparseArray;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public final class LeBluetoothParsedScanRecord {
   private static final String TAG = "LeBluetoothParsedScanRecord";
   private static final int DATA_TYPE_FLAGS = 1;
   private static final int DATA_TYPE_SERVICE_UUIDS_16_BIT_PARTIAL = 2;
   private static final int DATA_TYPE_SERVICE_UUIDS_16_BIT_COMPLETE = 3;
   private static final int DATA_TYPE_SERVICE_UUIDS_32_BIT_PARTIAL = 4;
   private static final int DATA_TYPE_SERVICE_UUIDS_32_BIT_COMPLETE = 5;
   private static final int DATA_TYPE_SERVICE_UUIDS_128_BIT_PARTIAL = 6;
   private static final int DATA_TYPE_SERVICE_UUIDS_128_BIT_COMPLETE = 7;
   private static final int DATA_TYPE_LOCAL_NAME_SHORT = 8;
   private static final int DATA_TYPE_LOCAL_NAME_COMPLETE = 9;
   private static final int DATA_TYPE_TX_POWER_LEVEL = 10;
   private static final int DATA_TYPE_SERVICE_DATA = 22;
   private static final int DATA_TYPE_MANUFACTURER_SPECIFIC_DATA = 255;
   public static final int UUID_BYTES_16_BIT = 2;
   public static final int UUID_BYTES_32_BIT = 4;
   public static final int UUID_BYTES_128_BIT = 16;
   public static final ParcelUuid BASE_UUID = ParcelUuid.fromString("00000000-0000-1000-8000-00805F9B34FB");
   private final int mAdvertiseFlags;
   private final List<ParcelUuid> mServiceUuids;
   private final SparseArray<byte[]> mManufacturerSpecificData;
   private final Map<ParcelUuid, byte[]> mServiceData;
   private final int mTxPowerLevel;
   private final String mDeviceName;
   private final byte[] mBytes;

   public int getAdvertiseFlags() {
      return this.mAdvertiseFlags;
   }

   public List<ParcelUuid> getServiceUuids() {
      return this.mServiceUuids;
   }

   public SparseArray<byte[]> getManufacturerSpecificData() {
      return this.mManufacturerSpecificData;
   }

   public byte[] getManufacturerSpecificData(int manufacturerId) {
      return (byte[])this.mManufacturerSpecificData.get(manufacturerId);
   }

   public Map<ParcelUuid, byte[]> getServiceData() {
      return this.mServiceData;
   }

   public byte[] getServiceData(ParcelUuid serviceDataUuid) {
      return serviceDataUuid == null ? null : (byte[])this.mServiceData.get(serviceDataUuid);
   }

   public int getTxPowerLevel() {
      return this.mTxPowerLevel;
   }

   public String getDeviceName() {
      return this.mDeviceName;
   }

   public byte[] getBytes() {
      return this.mBytes;
   }

   private LeBluetoothParsedScanRecord(List<ParcelUuid> serviceUuids, SparseArray<byte[]> manufacturerData, Map<ParcelUuid, byte[]> serviceData, int advertiseFlags, int txPowerLevel, String localName, byte[] bytes) {
      this.mServiceUuids = serviceUuids;
      this.mManufacturerSpecificData = manufacturerData;
      this.mServiceData = serviceData;
      this.mDeviceName = localName;
      this.mAdvertiseFlags = advertiseFlags;
      this.mTxPowerLevel = txPowerLevel;
      this.mBytes = bytes;
   }

   @SuppressLint({"NewApi"})
   public static LeBluetoothParsedScanRecord parseFromBytes(byte[] scanRecord) {
      if (scanRecord == null) {
         return null;
      } else {
         int currentPos = 0;
         int advertiseFlag = -1;
         List<ParcelUuid> serviceUuids = new ArrayList();
         String localName = null;
         int txPowerLevel = Integer.MIN_VALUE;
         SparseArray<byte[]> manufacturerData = new SparseArray();
         Object serviceData;
         if (VERSION.SDK_INT >= 19) {
            serviceData = new ArrayMap();
         } else {
            serviceData = new HashMap();
         }

         try {
            int dataLength;
            for(; currentPos < scanRecord.length; currentPos += dataLength) {
               int length = scanRecord[currentPos++] & 255;
               if (length == 0) {
                  break;
               }

               dataLength = length - 1;
               int fieldType = scanRecord[currentPos++] & 255;
               switch(fieldType) {
               case 1:
                  advertiseFlag = scanRecord[currentPos] & 255;
                  break;
               case 2:
               case 3:
                  parseServiceUuid(scanRecord, currentPos, dataLength, 2, serviceUuids);
                  break;
               case 4:
               case 5:
                  parseServiceUuid(scanRecord, currentPos, dataLength, 4, serviceUuids);
                  break;
               case 6:
               case 7:
                  parseServiceUuid(scanRecord, currentPos, dataLength, 16, serviceUuids);
                  break;
               case 8:
               case 9:
                  localName = (new String(extractBytes(scanRecord, currentPos, dataLength))).trim();
                  break;
               case 10:
                  txPowerLevel = scanRecord[currentPos];
                  break;
               case 22:
                  int serviceUuidLength = 2;
                  byte[] serviceDataUuidBytes = extractBytes(scanRecord, currentPos, serviceUuidLength);
                  ParcelUuid serviceDataUuid = parseUuidFrom(serviceDataUuidBytes);
                  byte[] serviceDataArray = extractBytes(scanRecord, currentPos + serviceUuidLength, dataLength - serviceUuidLength);
                  ((Map)serviceData).put(serviceDataUuid, serviceDataArray);
                  break;
               case 255:
                  int manufacturerId = ((scanRecord[currentPos + 1] & 255) << 8) + (scanRecord[currentPos] & 255);
                  byte[] manufacturerDataBytes = extractBytes(scanRecord, currentPos + 2, dataLength - 2);
                  manufacturerData.put(manufacturerId, manufacturerDataBytes);
               }
            }

            if (serviceUuids.isEmpty()) {
               serviceUuids = null;
            }

            return new LeBluetoothParsedScanRecord(serviceUuids, manufacturerData, (Map)serviceData, advertiseFlag, txPowerLevel, localName, scanRecord);
         } catch (Exception var17) {
            return new LeBluetoothParsedScanRecord((List)null, (SparseArray)null, (Map)null, -1, Integer.MIN_VALUE, (String)null, scanRecord);
         }
      }
   }

   public String toString() {
      return "ScanRecord [mAdvertiseFlags=" + this.mAdvertiseFlags + ", mServiceUuids=" + this.mServiceUuids + ", mManufacturerSpecificData=" + StrUtil.toString(this.mManufacturerSpecificData) + ", mServiceData=" + StrUtil.toString(this.mServiceData) + ", mTxPowerLevel=" + this.mTxPowerLevel + ", mDeviceName=" + this.mDeviceName + "]";
   }

   private static int parseServiceUuid(byte[] scanRecord, int currentPos, int dataLength, int uuidLength, List<ParcelUuid> serviceUuids) {
      while(dataLength > 0) {
         byte[] uuidBytes = extractBytes(scanRecord, currentPos, uuidLength);
         serviceUuids.add(parseUuidFrom(uuidBytes));
         dataLength -= uuidLength;
         currentPos += uuidLength;
      }

      return currentPos;
   }

   private static byte[] extractBytes(byte[] scanRecord, int start, int length) {
      byte[] bytes = new byte[length];
      System.arraycopy(scanRecord, start, bytes, 0, length);
      return bytes;
   }

   public static ParcelUuid parseUuidFrom(byte[] uuidBytes) {
      if (uuidBytes == null) {
         throw new IllegalArgumentException("uuidBytes cannot be null");
      } else {
         int length = uuidBytes.length;
         if (length != 2 && length != 4 && length != 16) {
            throw new IllegalArgumentException("uuidBytes length invalid - " + length);
         } else if (length == 16) {
            ByteBuffer buf = ByteBuffer.wrap(uuidBytes).order(ByteOrder.LITTLE_ENDIAN);
            long msb = buf.getLong(8);
            long lsb = buf.getLong(0);
            return new ParcelUuid(new UUID(msb, lsb));
         } else {
            long shortUuid;
            if (length == 2) {
               shortUuid = (long)(uuidBytes[0] & 255);
               shortUuid += (long)((uuidBytes[1] & 255) << 8);
            } else {
               shortUuid = (long)(uuidBytes[0] & 255);
               shortUuid += (long)((uuidBytes[1] & 255) << 8);
               shortUuid += (long)((uuidBytes[2] & 255) << 16);
               shortUuid += (long)((uuidBytes[3] & 255) << 24);
            }

            long msb = BASE_UUID.getUuid().getMostSignificantBits() + (shortUuid << 32);
            long lsb = BASE_UUID.getUuid().getLeastSignificantBits();
            return new ParcelUuid(new UUID(msb, lsb));
         }
      }
   }
}
