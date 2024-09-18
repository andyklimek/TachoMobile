package com.ftsafe.comm.bt4;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattDescriptor;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothManager;
import android.content.Context;
import android.os.Build.VERSION;
import com.ftsafe.comm.StrUtil;
import com.ftsafe.util.LogUtil;
import java.util.List;
import java.util.UUID;

public class BluetoothLeClass {
   private BluetoothManager mBluetoothManager;
   private BluetoothAdapter mBluetoothAdapter;
   private String mBluetoothDeviceAddress;
   private BluetoothGatt mBluetoothGatt;
   private boolean isDiscovering = false;
   int powerState = -1;
   ReadPowerCallback mReadPowerCallback;
   public static final UUID UUID_SERVICE_C4_CORILUS = UUID.fromString("46540001-0002-00c4-0000-000000000001");
   public static final UUID UUID_CHAR_WRITE_C4_CORILUS = UUID.fromString("46540002-0002-00c4-0000-000000000001");
   public static final UUID UUID_CHAR_NOTIF_C4_CORILUS = UUID.fromString("46540003-0002-00c4-0000-000000000001");
   public static final UUID UUID_SERVICE_FIRMWARE_VERSION_C4_CORILUS = UUID.fromString("465400F0-0002-00C4-0000-000000000001");
   public static final UUID UUID_CHAR_FIRMWARE_VERSION_C4_CORILUS = UUID.fromString("465400F1-0002-00C4-0000-000000000001");
   public static final UUID UUID_SERVICE_C4 = UUID.fromString("46540001-0002-00c4-0000-465453414645");
   public static final UUID UUID_CHAR_WRITE_C4 = UUID.fromString("46540002-0002-00c4-0000-465453414645");
   public static final UUID UUID_CHAR_NOTIF_C4 = UUID.fromString("46540003-0002-00c4-0000-465453414645");
   public static final UUID UUID_SERVICE_C6 = UUID.fromString("46540001-0002-00c6-0000-465453414645");
   public static final UUID UUID_CHAR_WRITE_C6 = UUID.fromString("46540002-0002-00c6-0000-465453414645");
   public static final UUID UUID_CHAR_NOTIF_C6 = UUID.fromString("46540003-0002-00c6-0000-465453414645");
   public static final UUID UUID_DESC_NOTIF = UUID.fromString("00002902-0000-1000-8000-00805f9b34fb");
   public static final UUID UUID_SERVICE_C4_NEW = UUID.fromString("46540001-0002-00c4-0000-000000000001");
   public static final UUID UUID_SERVICE_C6_NEW = UUID.fromString("46540001-0002-00c6-0000-000000000001");
   public static final UUID UUID_SERVICE_FIRMWARE_VERSION_C4 = UUID.fromString("465400F0-0002-00C4-0000-465453414645");
   public static final UUID UUID_CHAR_FIRMWARE_VERSION_C4 = UUID.fromString("465400F1-0002-00C4-0000-465453414645");
   public static final UUID UUID_SERVICE_FIRMWARE_VERSION_C6 = UUID.fromString("465400F0-0002-00C6-0000-465453414645");
   public static final UUID UUID_CHAR_FIRMWARE_VERSION_C6 = UUID.fromString("465400F1-0002-00C6-0000-465453414645");
   private OnConnectListener mOnConnectListener;
   private OnDisconnectListener mOnDisconnectListener;
   private OnServiceDiscoverListener mOnServiceDiscoverListener;
   private OnDataAvailableListener mOnDataAvailableListener;
   private Context mContext;
   private String retryAddress = "";
   private int retryCount = 0;
   private final BluetoothGattCallback mGattCallback = new BluetoothGattCallback() {
      public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {
         LogUtil.e("[BLE-onConnectionStateChange]status : " + status + ", newState : " + newState);
         if (status != 133 && status != 34) {
            if (newState == 2) {
               if (BluetoothLeClass.this.mOnConnectListener != null) {
                  BluetoothLeClass.this.mOnConnectListener.onConnect(gatt);
               }

               boolean b = BluetoothLeClass.this.mBluetoothGatt.discoverServices();
               if (b) {
               }
            } else if (newState == 0 && BluetoothLeClass.this.mOnDisconnectListener != null) {
               BluetoothLeClass.this.close();
               BluetoothLeClass.this.mOnDisconnectListener.onDisconnect(gatt);
            }

         } else {
            BluetoothLeClass.this.reconnect();
         }
      }

      public void onServicesDiscovered(BluetoothGatt gatt, int status) {
         LogUtil.e("[BLE-onServicesDiscovered]status : " + status);
         if (status != 0) {
            BluetoothLeClass.this.reconnect();
         } else {
            BluetoothLeClass.this.notifyDiscovered();
            boolean b;
            if (BluetoothLeClass.this.mOnServiceDiscoverListener != null) {
               BluetoothLeClass.this.mOnServiceDiscoverListener.onServiceDiscover(gatt);
               b = BluetoothLeClass.this.setCharacteristicNotification(true);
               if (b) {
               }
            }

            b = BluetoothLeClass.this.setCharacteristicNotification(true);
            if (b) {
            }

         }
      }

      public void onCharacteristicRead(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
         LogUtil.e("[BLE-onCharacteristicRead]status : " + status);
         BluetoothLeClass.this.mReadPowerCallback.onPowerRead(characteristic.getValue()[0]);
         if (BluetoothLeClass.this.mOnDataAvailableListener != null) {
            BluetoothLeClass.this.mOnDataAvailableListener.onCharacteristicRead(gatt, characteristic, status);
         }

      }

      public void onCharacteristicChanged(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic) {
         LogUtil.e("[BLE-onCharacteristicChanged]" + StrUtil.byteArr2HexStr(characteristic.getValue()));
         if (BluetoothLeClass.this.mOnDataAvailableListener != null) {
            BluetoothLeClass.this.mOnDataAvailableListener.onCharacteristicChanged(gatt, characteristic);
         }

      }

      public void onCharacteristicWrite(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
         LogUtil.e("[BLE-onCharacteristicWrite]" + StrUtil.byteArr2HexStr(characteristic.getValue()));
         super.onCharacteristicWrite(gatt, characteristic, status);
      }
   };

   public void setOnConnectListener(OnConnectListener l) {
      this.mOnConnectListener = l;
   }

   public void setOnDisconnectListener(OnDisconnectListener l) {
      this.mOnDisconnectListener = l;
   }

   public void setOnServiceDiscoverListener(OnServiceDiscoverListener l) {
      this.mOnServiceDiscoverListener = l;
   }

   public void setOnDataAvailableListener(OnDataAvailableListener l) {
      this.mOnDataAvailableListener = l;
   }

   public BluetoothLeClass(Context c) {
      this.mContext = c;
   }

   public void readPowerState(ReadPowerCallback callback) {
      this.mReadPowerCallback = callback;
      if (this.mBluetoothGatt == null) {
         this.mReadPowerCallback.onPowerRead(-1);
      } else {
         BluetoothGattCharacteristic characteristic = this.mBluetoothGatt.getService(UUID.fromString("0000180f-0000-1000-8000-00805f9b34fb")).getCharacteristic(UUID.fromString("00002a19-0000-1000-8000-00805f9b34fb"));
         Boolean readFlag = false;
         readFlag = this.mBluetoothGatt.readCharacteristic(characteristic);
      }
   }

   public boolean initialize() {
      if (this.mBluetoothManager == null) {
         this.mBluetoothManager = (BluetoothManager)this.mContext.getSystemService("bluetooth");
         if (this.mBluetoothManager == null) {
            return false;
         }
      }

      this.mBluetoothAdapter = this.mBluetoothManager.getAdapter();
      return this.mBluetoothAdapter != null;
   }

   private void reconnect() {
      this.close();
      if (!this.retryAddress.equals("") && this.retryCount < 3) {
         ++this.retryCount;
         this.connect(this.retryAddress);
      }

   }

   public boolean connect(String address) {
      if (this.mBluetoothAdapter != null && address != null) {
         this.retryAddress = address;
         this.retryCount = 0;
         if (address.equals(this.mBluetoothDeviceAddress) && this.mBluetoothGatt != null) {
            this.isDiscovering = true;
            if (this.mBluetoothGatt.connect()) {
               boolean ret = this.waitForDiscovering(6000L);
               if (!ret) {
                  this.disconnect();
                  return false;
               } else {
                  return true;
               }
            } else {
               this.disconnect();
               return false;
            }
         } else {
            BluetoothDevice device = this.mBluetoothAdapter.getRemoteDevice(address);
            if (device == null) {
               this.disconnect();
               return false;
            } else {
               this.isDiscovering = true;
               if (VERSION.SDK_INT >= 23) {
                  this.mBluetoothGatt = device.connectGatt(this.mContext, false, this.mGattCallback, 2);
               } else {
                  this.mBluetoothGatt = device.connectGatt(this.mContext, false, this.mGattCallback);
               }

               boolean isNeedGattConnect = false;
               if (VERSION.SDK_INT >= 31) {
                  isNeedGattConnect = this.mBluetoothGatt != null;
               } else {
                  isNeedGattConnect = this.mBluetoothGatt.connect();
               }

               if (isNeedGattConnect) {
                  boolean ret = this.waitForDiscovering(6000L);
                  if (!ret) {
                     this.disconnect();
                     this.mBluetoothGatt = null;
                     return false;
                  } else {
                     this.mBluetoothDeviceAddress = address;
                     return true;
                  }
               } else {
                  this.mBluetoothDeviceAddress = address;
                  this.disconnect();
                  return false;
               }
            }
         }
      } else {
         return false;
      }
   }

   public void disconnect() {
      if (this.mBluetoothAdapter != null && this.mBluetoothGatt != null) {
         this.mBluetoothGatt.disconnect();
         this.close();
      }
   }

   public void close() {
      if (this.mBluetoothGatt != null) {
         this.mBluetoothGatt.close();
         this.mBluetoothGatt = null;
      }
   }

   public void readCharacteristic(BluetoothGattCharacteristic characteristic) {
      if (this.mBluetoothAdapter != null && this.mBluetoothGatt != null) {
         this.mBluetoothGatt.readCharacteristic(characteristic);
      }
   }

   public boolean setCharacteristicNotification(boolean enabled) {
      if (this.mBluetoothAdapter != null && this.mBluetoothGatt != null) {
         BluetoothGattService gattService = this.mBluetoothGatt.getService(UUID_SERVICE_C4);
         if (gattService == null) {
            gattService = this.mBluetoothGatt.getService(UUID_SERVICE_C6);
         }

         if (gattService == null) {
            gattService = this.mBluetoothGatt.getService(UUID_SERVICE_C4_CORILUS);
         }

         if (gattService == null) {
            return false;
         } else {
            BluetoothGattCharacteristic gattChar = gattService.getCharacteristic(UUID_CHAR_NOTIF_C4);
            if (gattChar == null) {
               gattChar = gattService.getCharacteristic(UUID_CHAR_NOTIF_C6);
            }

            if (gattChar == null) {
               gattChar = gattService.getCharacteristic(UUID_CHAR_NOTIF_C4_CORILUS);
            }

            if (gattChar == null) {
               return false;
            } else {
               boolean status = this.mBluetoothGatt.setCharacteristicNotification(gattChar, enabled);
               if (!status) {
                  return false;
               } else {
                  BluetoothGattDescriptor gattDesc = gattChar.getDescriptor(UUID_DESC_NOTIF);
                  if (gattDesc == null) {
                     return false;
                  } else {
                     status = gattDesc.setValue(BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE);
                     if (!status) {
                        return false;
                     } else {
                        status = this.mBluetoothGatt.writeDescriptor(gattDesc);
                        return status;
                     }
                  }
               }
            }
         }
      } else {
         return false;
      }
   }

   public void writeCharacteristic(BluetoothGattCharacteristic characteristic) {
      this.mBluetoothGatt.writeCharacteristic(characteristic);
   }

   public List<BluetoothGattService> getSupportedGattServices() {
      return this.mBluetoothGatt == null ? null : this.mBluetoothGatt.getServices();
   }

   public BluetoothGatt getBluetoothGatt() {
      return this.mBluetoothGatt;
   }

   public boolean writeCharacteristic(byte[] value) {
      LogUtil.e("[BT4-SEND]" + StrUtil.byteArr2HexStr(value));
      List<BluetoothGattService> services = this.mBluetoothGatt.getServices();
      if (services != null && services.size() != 0) {
         BluetoothGattService gattService = this.mBluetoothGatt.getService(UUID_SERVICE_C4);
         if (gattService == null) {
            gattService = this.mBluetoothGatt.getService(UUID_SERVICE_C6);
         }

         if (gattService == null) {
            gattService = this.mBluetoothGatt.getService(UUID_SERVICE_C4_CORILUS);
         }

         if (gattService == null) {
            return false;
         } else {
            BluetoothGattCharacteristic gattChar = gattService.getCharacteristic(UUID_CHAR_WRITE_C4);
            if (gattChar == null) {
               gattChar = gattService.getCharacteristic(UUID_CHAR_WRITE_C6);
            }

            if (gattChar == null) {
               gattChar = gattService.getCharacteristic(UUID_CHAR_WRITE_C4_CORILUS);
            }

            if (gattChar == null) {
               return false;
            } else {
               boolean status = gattChar.setValue(value);
               if (!status) {
                  return false;
               } else {
                  status = this.mBluetoothGatt.writeCharacteristic(gattChar);
                  return status;
               }
            }
         }
      } else {
         return false;
      }
   }

   public boolean getBleFirmwareVersion() {
      List<BluetoothGattService> services = this.mBluetoothGatt.getServices();
      if (services != null && services.size() != 0) {
         BluetoothGattService gattService = this.mBluetoothGatt.getService(UUID_SERVICE_FIRMWARE_VERSION_C4);
         if (gattService == null) {
            gattService = this.mBluetoothGatt.getService(UUID_SERVICE_FIRMWARE_VERSION_C6);
         }

         if (gattService == null) {
            gattService = this.mBluetoothGatt.getService(UUID_SERVICE_FIRMWARE_VERSION_C4_CORILUS);
         }

         if (gattService == null) {
            return false;
         } else {
            BluetoothGattCharacteristic gattChar = gattService.getCharacteristic(UUID_CHAR_FIRMWARE_VERSION_C4);
            if (gattChar == null) {
               gattChar = gattService.getCharacteristic(UUID_CHAR_FIRMWARE_VERSION_C6);
            }

            if (gattChar == null) {
               gattChar = gattService.getCharacteristic(UUID_CHAR_FIRMWARE_VERSION_C4_CORILUS);
            }

            if (gattChar == null) {
               return false;
            } else {
               if (this.mBluetoothGatt.setCharacteristicNotification(gattChar, true)) {
                  BluetoothGattDescriptor gattDesc = gattChar.getDescriptor(UUID_DESC_NOTIF);
                  if (gattDesc != null && gattDesc.setValue(BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE)) {
                     this.mBluetoothGatt.writeDescriptor(gattDesc);
                  }
               }

               try {
                  Thread.sleep(100L);
               } catch (InterruptedException var5) {
                  var5.printStackTrace();
               }

               boolean status = gattChar.setValue(new byte[]{1});
               if (!status) {
                  return false;
               } else {
                  status = this.mBluetoothGatt.writeCharacteristic(gattChar);
                  return status;
               }
            }
         }
      } else {
         return false;
      }
   }

   synchronized boolean waitForDiscovering(long miller) {
      if (this.isDiscovering) {
         long start = System.currentTimeMillis();

         while(true) {
            try {
               this.wait(miller);
            } catch (InterruptedException var7) {
               var7.printStackTrace();
            }

            if (!this.isDiscovering) {
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

   synchronized void notifyDiscovered() {
      this.isDiscovering = false;
      this.notify();
   }

   public interface ReadPowerCallback {
      void onPowerRead(int var1);
   }

   public interface OnDataAvailableListener {
      void onCharacteristicRead(BluetoothGatt var1, BluetoothGattCharacteristic var2, int var3);

      void onCharacteristicChanged(BluetoothGatt var1, BluetoothGattCharacteristic var2);
   }

   public interface OnServiceDiscoverListener {
      void onServiceDiscover(BluetoothGatt var1);
   }

   public interface OnDisconnectListener {
      void onDisconnect(BluetoothGatt var1);
   }

   public interface OnConnectListener {
      void onConnect(BluetoothGatt var1);
   }
}
