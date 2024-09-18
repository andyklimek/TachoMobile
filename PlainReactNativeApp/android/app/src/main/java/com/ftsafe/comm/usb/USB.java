package com.ftsafe.comm.usb;

import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbDeviceConnection;
import android.hardware.usb.UsbEndpoint;
import android.hardware.usb.UsbInterface;
import android.hardware.usb.UsbManager;
import android.os.Build.VERSION;
import android.util.Log;
import com.ftsafe.Utility;
import com.ftsafe.comm.CommBase;
import com.ftsafe.comm.StrUtil;
import com.ftsafe.readerScheme.FTReaderInf;
import com.ftsafe.util.LogUtil;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

public class USB implements FTReaderInf {
   private Context tContext;
   private UsbManager mUsbManager;
   private static final String ACTION_USB_PERMISSION = "com.android.example.USB_PERMISSION";
   private final int VendorID = 2414;
   private final int VendorID_1 = 1254;
   private final int VendorID_2 = 1546;
   private final int VendorID_3 = 5902;
   private static final int MAX_BUFFER_LEN = 16384;
   public List<UsbDevice> mUsbDeviceList = new ArrayList();
   public List<UsbDeviceConnection> mUsbDeviceConnectionList = new ArrayList();
   public List<Boolean> mIsRecievingList = new ArrayList();
   public UsbDevice mUsbDevice = null;
   public UsbDeviceConnection mUsbDeviceConnection = null;
   private UsbInterface[] mUsbInterfaceArray = new UsbInterface[16];
   private CommBase.CommCallback mCallback;
   private static BroadcastReceiver mUsbReceiver;
   private String productName = "";
   private int slotIndex = 0;
   int n = 0;

   public USB(Context context, CommBase.CommCallback callback) throws UsbException {
      this.tContext = context;
      this.mCallback = callback;
      this.mUsbManager = (UsbManager)this.tContext.getSystemService("usb");
      if (this.mUsbManager == null) {
         throw new UsbException("create mUsbManager failed!");
      } else {
         if (mUsbReceiver == null) {
            mUsbReceiver = new BroadcastReceiver() {
               public void onReceive(Context context, Intent intent) {
                  String action = intent.getAction();
                  USB.this.showLog(action);
                  UsbDevice device = (UsbDevice)intent.getParcelableExtra("device");
                  if ("com.android.example.USB_PERMISSION".equals(action)) {
                     synchronized(this) {
                        if (intent.getBooleanExtra("permission", false)) {
                           if (device != null) {
                              if (VERSION.SDK_INT >= 21) {
                                 USB.this.showLog("usb device : " + device.getProductName());
                              } else {
                                 try {
                                    throw new UsbException("Device Not Found");
                                 } catch (UsbException var9) {
                                    var9.printStackTrace();
                                 }
                              }

                              if (!USB.this.mUsbDeviceList.contains(device)) {
                                 UsbDeviceConnection usbDeviceConnection = USB.this.mUsbManager.openDevice(device);
                                 if (usbDeviceConnection == null) {
                                    return;
                                 }

                                 USB.this.mUsbDeviceList.add(device);
                                 USB.this.mUsbDeviceConnectionList.add(usbDeviceConnection);
                              }

                              if (VERSION.SDK_INT >= 21) {
                                 USB.this.productName = device.getProductName();
                              }
                           } else {
                              USB.this.showLog("usb permission granted");
                           }
                        } else {
                           USB.this.showLog("permission denied for device");
                        }
                     }
                  } else if ("android.hardware.usb.action.USB_DEVICE_ATTACHED".equals(action)) {
                     USB.this.showLog("USB DEVICE ATTACHED");
                     if (VERSION.SDK_INT >= 21) {
                        HashMap<String, UsbDevice> deviceList = USB.this.mUsbManager.getDeviceList();
                        if (deviceList.isEmpty()) {
                           try {
                              throw new UsbException("Device Not Found");
                           } catch (UsbException var8) {
                              var8.printStackTrace();
                           }
                        } else {
                           Iterator<UsbDevice> usbDeviceIter = deviceList.values().iterator();
                           if (usbDeviceIter.hasNext()) {
                              UsbDevice usbDevice = (UsbDevice)usbDeviceIter.next();
                              if (USB.this.mUsbManager.hasPermission(usbDevice) && USB.this.mUsbManager.hasPermission(device)) {
                                 USB.this.mHandlerSendMessage(17, device);
                              }
                           } else if (USB.this.mUsbManager.hasPermission(device)) {
                              USB.this.mHandlerSendMessage(17, device);
                           }
                        }
                     }
                  } else if ("android.hardware.usb.action.USB_DEVICE_DETACHED".equals(action)) {
                     USB.this.showLog("USB DEVICE DETACHED");
                     if (VERSION.SDK_INT >= 21) {
                        USB.this.mHandlerSendMessage(18, device);
                     }

                     if (!USB.this.mUsbDeviceList.contains(device)) {
                        return;
                     }

                     int index = USB.this.mUsbDeviceList.indexOf(device);
                     USB.this.mUsbDeviceList.remove(index);
                     USB.this.mUsbDeviceConnectionList.remove(index);
                  }

               }
            };
         }

         IntentFilter filter = new IntentFilter();
         filter.addAction("com.android.example.USB_PERMISSION");
         filter.addAction("android.hardware.usb.action.USB_DEVICE_ATTACHED");
         filter.addAction("android.hardware.usb.action.USB_DEVICE_DETACHED");
         this.tContext.getApplicationContext().registerReceiver(mUsbReceiver, filter);
      }
   }

   public Boolean isFtExist() {
      return this.mUsbDeviceConnectionList.size() != 0;
   }

   public void ft_find() throws UsbException {
      IntentFilter filter = new IntentFilter();
      filter.addAction("com.android.example.USB_PERMISSION");
      filter.addAction("android.hardware.usb.action.USB_DEVICE_ATTACHED");
      filter.addAction("android.hardware.usb.action.USB_DEVICE_DETACHED");
      this.tContext.getApplicationContext().registerReceiver(mUsbReceiver, filter);
      HashMap<String, UsbDevice> deviceList = this.mUsbManager.getDeviceList();
      Iterator<String> iterator = deviceList.keySet().iterator();
      Iterator<UsbDevice> usbDeviceCountIter = deviceList.values().iterator();
      UsbDevice usbDeviceCounttag = null;
      int usbDeviceCount = 0;

      while(true) {
         do {
            if (!iterator.hasNext()) {
               this.mHandlerSendMessage(19, usbDeviceCount);
               if (deviceList.isEmpty()) {
                  throw new UsbException("Device Not Found");
               }

               PendingIntent mPermissionIntent;
               if (VERSION.SDK_INT >= 31) {
                  mPermissionIntent = PendingIntent.getBroadcast(this.tContext.getApplicationContext(), 0, new Intent("com.android.example.USB_PERMISSION"), PendingIntent.FLAG_IMMUTABLE);
               } else {
                  mPermissionIntent = PendingIntent.getBroadcast(this.tContext.getApplicationContext(), 0, new Intent("com.android.example.USB_PERMISSION"), PendingIntent.FLAG_IMMUTABLE);
               }

               Iterator usbDeviceIter = deviceList.values().iterator();

               while(true) {
                  Boolean usbPerssionFlag;
                  UsbDevice usbDevice;
                  label77:
                  do {
                     if (!usbDeviceIter.hasNext()) {
                        return;
                     }

                     Iterator<UsbDevice> usbDeviceIter1 = deviceList.values().iterator();
                     usbPerssionFlag = false;
                     usbDevice = (UsbDevice)usbDeviceIter.next();

                     while(true) {
                        UsbDevice usbDevice1;
                        do {
                           if (!usbDeviceIter1.hasNext()) {
                              continue label77;
                           }

                           usbDevice1 = (UsbDevice)usbDeviceIter1.next();
                        } while(usbDevice1.getVendorId() != 2414 && usbDevice1.getVendorId() != 1254 && usbDevice1.getVendorId() != 1546 && usbDevice1.getVendorId() != 5902);

                        if (this.mUsbManager.hasPermission(usbDevice1)) {
                           usbPerssionFlag = true;
                        } else {
                           usbPerssionFlag = false;
                        }
                     }
                  } while(usbDevice.getVendorId() != 2414 && usbDevice.getVendorId() != 1254 && usbDevice.getVendorId() != 1546 && usbDevice.getVendorId() != 5902);

                  if (!this.mUsbManager.hasPermission(usbDevice)) {
                     this.mUsbManager.requestPermission(usbDevice, mPermissionIntent);
                     throw new UsbException("Device Not Found");
                  }

                  if (VERSION.SDK_INT >= 21) {
                     this.productName = usbDevice.getProductName();
                  }

                  if (usbPerssionFlag) {
                     this.mHandlerSendMessage(17, usbDevice);
                     this.showLog(this.productName + " has USB_PERMISSION");
                  }
               }
            }

            String key = (String)iterator.next();
            usbDeviceCounttag = (UsbDevice)usbDeviceCountIter.next();
         } while(usbDeviceCounttag.getVendorId() != 2414 && usbDeviceCounttag.getVendorId() != 1254 && usbDeviceCounttag.getVendorId() != 1546 && usbDeviceCounttag.getVendorId() != 5902);

         ++usbDeviceCount;
      }
   }

   public void ft_stopfind() {
   }

   public void ft_open(Object deviceName) throws UsbException {
      if (!(deviceName instanceof String)) {
         throw new UsbException("Device open param null");
      } else {
         HashMap<String, UsbDevice> deviceList = this.mUsbManager.getDeviceList();
         if (deviceList.isEmpty()) {
            throw new UsbException("No device exist");
         } else {
            UsbDevice usbDevice = null;
            Iterator var4 = deviceList.values().iterator();

            while(var4.hasNext()) {
               UsbDevice usbDeviceTemp = (UsbDevice)var4.next();
               if (VERSION.SDK_INT >= 21 && usbDeviceTemp.getDeviceName().equals(deviceName)) {
                  usbDevice = usbDeviceTemp;
                  break;
               }
            }

            if (usbDevice == null) {
               throw new UsbException("Device Open Failed");
            } else {
               UsbDeviceConnection usbDeviceConnection = this.mUsbManager.openDevice(usbDevice);
               if (usbDeviceConnection == null) {
                  throw new UsbException("Device Open Failed");
               } else {
                  Iterator var8 = this.mUsbDeviceList.iterator();

                  UsbDevice usbDeviceExist;
                  do {
                     if (!var8.hasNext()) {
                        this.mUsbDeviceList.add(usbDevice);
                        this.mUsbDeviceConnectionList.add(usbDeviceConnection);
                        this.mIsRecievingList.add(true);
                        this.startRecieving(usbDevice);
                        return;
                     }

                     usbDeviceExist = (UsbDevice)var8.next();
                  } while(VERSION.SDK_INT < 21 || !usbDeviceExist.getProductName().equals(deviceName));

               }
            }
         }
      }
   }

   public void ft_close(String device) {
      int readerIndex;
      try {
         readerIndex = this.getDeviceIndex(device);
      } catch (UsbException var7) {
         var7.printStackTrace();
         return;
      }

      UsbDevice usbDevice = (UsbDevice)this.mUsbDeviceList.get(readerIndex);
      UsbDeviceConnection usbDeviceConnection = (UsbDeviceConnection)this.mUsbDeviceConnectionList.get(readerIndex);
      int devInterfaceNum = usbDevice.getInterfaceCount();

      for(int j = 0; j < devInterfaceNum; ++j) {
         usbDeviceConnection.releaseInterface(usbDevice.getInterface(j));
      }

      usbDeviceConnection.close();
      this.mUsbDeviceList.remove(readerIndex);
      this.mUsbDeviceConnectionList.remove(readerIndex);
      this.mIsRecievingList.remove(readerIndex);
   }

   public String getDevice(int readerIndex) throws UsbException {
      if (readerIndex >= 0 && readerIndex < this.mUsbDeviceList.size()) {
         return VERSION.SDK_INT >= 21 ? ((UsbDevice)this.mUsbDeviceList.get(readerIndex)).getProductName() : "";
      } else {
         throw new UsbException("readerIndex illegal, readerIndex : " + readerIndex);
      }
   }

   public int getDeviceIndex(String device) throws UsbException {
      if (this.mUsbDeviceList != null && this.mUsbDeviceList.size() != 0) {
         for(int i = 0; i < this.mUsbDeviceList.size(); ++i) {
            UsbDevice usbDevice = (UsbDevice)this.mUsbDeviceList.get(i);
            if (VERSION.SDK_INT >= 21 && usbDevice.getDeviceName().equals(device)) {
               return i;
            }
         }

         throw new UsbException("device not connected");
      } else {
         throw new UsbException("no device connected");
      }
   }

   public int getProductId(String device) throws UsbException {
      int readerIndex = this.getDeviceIndex(device);
      if (readerIndex >= 0 && readerIndex < this.mUsbDeviceList.size()) {
         return ((UsbDevice)this.mUsbDeviceList.get(readerIndex)).getProductId();
      } else {
         throw new UsbException("readerIndex illegal, index : " + readerIndex + ", list len : " + this.mUsbDeviceList.size());
      }
   }

   public byte[] getFirmwareVersion(String device) throws UsbException {
      int readerIndex = this.getDeviceIndex(device);
      if (readerIndex >= 0 && readerIndex < this.mUsbDeviceConnectionList.size()) {
         byte[] descriptor = ((UsbDeviceConnection)this.mUsbDeviceConnectionList.get(readerIndex)).getRawDescriptors();
         return (descriptor[13] + "." + StrUtil.byte2HexStr(descriptor[12])).getBytes();
      } else {
         throw new UsbException("readerIndex illegal, index : " + readerIndex + ", list len : " + this.mUsbDeviceList.size());
      }
   }

   public byte[] getManufacturer(String device) throws Exception {
      int readerIndex = this.getDeviceIndex(device);
      if (readerIndex >= 0 && readerIndex < this.mUsbDeviceConnectionList.size()) {
         byte[] descriptor = ((UsbDeviceConnection)this.mUsbDeviceConnectionList.get(readerIndex)).getRawDescriptors();
         byte[] buffer = new byte[255];
         int idxMan = descriptor[14];
         int idxPrd = descriptor[15];

         for(int i = 0; i < 5; ++i) {
            int rdo = ((UsbDeviceConnection)this.mUsbDeviceConnectionList.get(readerIndex)).controlTransfer(128, 6, 768 | idxMan, 0, buffer, 255, 3000);
            if (rdo > 0) {
               String manufacturer = new String(buffer, 2, rdo - 2, "UTF-16LE");
               return manufacturer.getBytes();
            }

            Thread.sleep(100L);
         }

         return null;
      } else {
         throw new UsbException("readerIndex illegal, index : " + readerIndex + ", list len : " + this.mUsbDeviceList.size());
      }
   }

   public byte[] getReaderName(String device) throws Exception {
      int readerIndex = this.getDeviceIndex(device);
      if (readerIndex >= 0 && readerIndex < this.mUsbDeviceConnectionList.size()) {
         byte[] descriptor = ((UsbDeviceConnection)this.mUsbDeviceConnectionList.get(readerIndex)).getRawDescriptors();
         byte[] buffer = new byte[255];
         int idxPrd = descriptor[15];

         for(int i = 0; i < 5; ++i) {
            int rdo = ((UsbDeviceConnection)this.mUsbDeviceConnectionList.get(readerIndex)).controlTransfer(128, 6, 768 | idxPrd, 1033, buffer, 255, 3000);
            if (rdo > 0) {
               String product = new String(buffer, 2, rdo - 2, "UTF-16LE");
               return product.getBytes();
            }

            Thread.sleep(100L);
         }

         return null;
      } else {
         throw new UsbException("readerIndex illegal, index : " + readerIndex + ", list len : " + this.mUsbDeviceList.size());
      }
   }

   public String[] getSlotName(String device) throws Exception {
      int readerIndex = this.getDeviceIndex(device);
      if (readerIndex >= 0 && readerIndex < this.mUsbDeviceConnectionList.size()) {
         int interNum = ((UsbDevice)this.mUsbDeviceList.get(readerIndex)).getInterfaceCount();
         byte[] buffer = new byte[255];
         String[] slotNames = new String[interNum];
         if (VERSION.SDK_INT >= 21) {
            for(int i = 0; i < interNum; ++i) {
               slotNames[i] = ((UsbDevice)this.mUsbDeviceList.get(readerIndex)).getInterface(i).getName();
            }
         } else {
            byte[] descriptor = ((UsbDeviceConnection)this.mUsbDeviceConnectionList.get(readerIndex)).getRawDescriptors();
            int[] interfaceIndex = USBParse.getInterfaceIndexFromRawDescriptor(descriptor);

            for(int i = 0; i < interNum; ++i) {
               int rdo = ((UsbDeviceConnection)this.mUsbDeviceConnectionList.get(readerIndex)).controlTransfer(128, 6, 768 | interfaceIndex[i], 1033, buffer, 255, 3000);
               slotNames[i] = new String(buffer, 2, rdo - 2, "UTF-16LE");
            }
         }

         return slotNames;
      } else {
         throw new UsbException("readerIndex illegal, index : " + readerIndex + ", list len : " + this.mUsbDeviceList.size());
      }
   }

   public byte[] ft_control(int readerIndex, int requestType, int request, int value, int index, int length, int timeOut) throws UsbException {
      if (readerIndex >= 0 && readerIndex < this.mUsbDeviceConnectionList.size()) {
         UsbDeviceConnection usbDeviceConnection = (UsbDeviceConnection)this.mUsbDeviceConnectionList.get(readerIndex);
         if (usbDeviceConnection == null) {
            throw new UsbException("No Device Found");
         } else {
            byte[] recvBuf = new byte[length];
            int len = usbDeviceConnection.controlTransfer(requestType, request, value, index, recvBuf, length, timeOut);
            if (len <= 0) {
               throw new UsbException("mUsbDeviceConnection.controlTransfer error");
            } else {
               byte[] retBuffer = new byte[len];
               System.arraycopy(recvBuf, 0, retBuffer, 0, len);
               return retBuffer;
            }
         }
      } else {
         throw new UsbException("readerIndex illegal, index : " + readerIndex + ", list len : " + this.mUsbDeviceList.size());
      }
   }

   public void ft_send(int readerIndex, byte[] writeDataBuff, int timeOut) throws UsbException {
      LogUtil.e("[ft_send] " + readerIndex);
      if (readerIndex >= 0 && readerIndex < this.mUsbDeviceList.size()) {
         UsbDevice usbDevice = (UsbDevice)this.mUsbDeviceList.get(readerIndex);
         if (usbDevice == null) {
            throw new UsbException("No Device Found");
         } else {
            UsbDeviceConnection usbDeviceConnection = (UsbDeviceConnection)this.mUsbDeviceConnectionList.get(readerIndex);
            if (this.slotIndex >= usbDevice.getInterfaceCount()) {
               throw new UsbException("index out of interface array");
            } else {
               UsbEndpoint endpoint = null;
               UsbInterface usbInterface = usbDevice.getInterface(this.slotIndex);
               int ret;
               if (usbInterface != null) {
                  for(ret = 0; ret < usbInterface.getEndpointCount(); ++ret) {
                     UsbEndpoint tempEndPoint = usbInterface.getEndpoint(ret);
                     if (tempEndPoint.getType() == 2 && tempEndPoint.getDirection() == 0) {
                        endpoint = usbInterface.getEndpoint(ret);
                        this.showLog(" SENDEndPointgetAddress:" + endpoint.getAddress());
                        this.showLog(" SENDEndPointgetAttributes:" + endpoint.getAttributes());
                        break;
                     }
                  }
               }

               if (endpoint == null) {
                  throw new UsbException("usb_send endpoint error:" + this.slotIndex);
               } else {
                  LogUtil.e("[SEND]" + StrUtil.byteArr2HexStr(writeDataBuff));
                  if (VERSION.SDK_INT >= 21) {
                     this.showLog(usbDevice.getProductName() + " SEND:" + Utility.bytes2HexStr(writeDataBuff));
                  }

                  ret = usbDeviceConnection.bulkTransfer(endpoint, writeDataBuff, writeDataBuff.length, timeOut);
                  Log.e("FTSafe", "USB_SendData:" + Utility.bytes2HexStr(writeDataBuff));
                  if (ret < 0) {
                     throw new UsbException("usb_send error:" + ret);
                  }
               }
            }
         }
      } else {
         throw new UsbException("readerIndex illegal, index : " + readerIndex + ", list len : " + this.mUsbDeviceList.size());
      }
   }

   public byte[] ft_recv(int readerIndex, int timeOut) throws UsbException {
      if (readerIndex >= 0 && readerIndex < this.mUsbDeviceList.size()) {
         UsbDevice usbDevice = (UsbDevice)this.mUsbDeviceList.get(readerIndex);
         if (usbDevice == null) {
            throw new UsbException("No Device Found");
         } else {
            UsbDeviceConnection usbDeviceConnection = (UsbDeviceConnection)this.mUsbDeviceConnectionList.get(readerIndex);
            if (this.slotIndex >= usbDevice.getInterfaceCount()) {
               throw new UsbException("index out of interface array");
            } else {
               UsbEndpoint endpoint = null;
               UsbInterface usbInterface = usbDevice.getInterface(this.slotIndex);
               if (usbInterface != null) {
                  for(int j = 0; j < usbInterface.getEndpointCount(); ++j) {
                     UsbEndpoint tempEndPoint = usbInterface.getEndpoint(j);
                     if (tempEndPoint.getType() == 2 && tempEndPoint.getDirection() == 128) {
                        endpoint = usbInterface.getEndpoint(j);
                        break;
                     }
                  }
               }

               if (endpoint == null) {
                  throw new UsbException("usb_send endpoint error:" + this.slotIndex);
               } else {
                  byte[] readDataBuff = new byte[16384];
                  int len = usbDeviceConnection.bulkTransfer(endpoint, readDataBuff, readDataBuff.length, timeOut);
                  if (len < 0) {
                     throw new UsbException("usb_recv error len:" + len);
                  } else if (len == 0) {
                     return this.ft_recv(this.slotIndex, timeOut);
                  } else {
                     LogUtil.e("[RECV]" + StrUtil.byteArr2HexStr(readDataBuff, 0, len));
                     byte[] retBuffer = new byte[len];
                     System.arraycopy(readDataBuff, 0, retBuffer, 0, len);
                     Log.e("FTSafe", "USB_RecvData:" + Utility.bytes2HexStr(retBuffer));
                     this.showLog("RECV:" + Utility.bytes2HexStr(retBuffer));
                     return retBuffer;
                  }
               }
            }
         }
      } else {
         throw new UsbException("readerIndex illegal, index : " + readerIndex + ", list len : " + this.mUsbDeviceList.size());
      }
   }

   private byte[] ft_recv_interrupt(int readerIndex, int slotIndex, int timeOut) throws UsbException {
      if (readerIndex >= 0 && readerIndex < this.mUsbDeviceList.size()) {
         UsbDevice usbDevice = (UsbDevice)this.mUsbDeviceList.get(readerIndex);
         if (usbDevice == null) {
            throw new UsbException("No Device Found");
         } else {
            UsbDeviceConnection usbDeviceConnection = (UsbDeviceConnection)this.mUsbDeviceConnectionList.get(readerIndex);
            if (slotIndex >= usbDevice.getInterfaceCount()) {
               throw new UsbException("index out of interface array");
            } else {
               UsbEndpoint endpoint = null;
               UsbInterface usbInterface = usbDevice.getInterface(slotIndex);
               if (usbInterface != null) {
                  for(int j = 0; j < usbInterface.getEndpointCount(); ++j) {
                     UsbEndpoint tempEndPoint = usbInterface.getEndpoint(j);
                     if (tempEndPoint.getType() == 3 && tempEndPoint.getDirection() == 128) {
                        endpoint = usbInterface.getEndpoint(j);
                        break;
                     }
                  }
               }

               if (endpoint == null) {
                  throw new UsbException("usb_send endpoint error:" + slotIndex);
               } else {
                  byte[] readDataBuff = new byte[16384];
                  int len = usbDeviceConnection.bulkTransfer(endpoint, readDataBuff, readDataBuff.length, timeOut);
                  if (len < 0) {
                     throw new UsbException("usb_recv error len:" + len);
                  } else {
                     byte[] retBuffer = new byte[len];
                     System.arraycopy(readDataBuff, 0, retBuffer, 0, len);
                     this.showLog("INTERRUPT RECV:" + Utility.bytes2HexStr(retBuffer));
                     return retBuffer;
                  }
               }
            }
         }
      } else {
         throw new UsbException("readerIndex illegal, index : " + readerIndex + ", list len : " + this.mUsbDeviceList.size());
      }
   }

   public String getProductName() {
      return this.productName;
   }

   private void mHandlerSendMessage(int what, Object obj) {
      if (this.mCallback != null) {
         this.mCallback.onResult(what, obj);
      }

   }

   private void showLog(String log) {
      String className = Thread.currentThread().getStackTrace()[3].getClassName();
      String methodName = Thread.currentThread().getStackTrace()[3].getMethodName();
      this.mHandlerSendMessage(16, "[LOG]" + className + ":" + methodName + "--->" + log);
   }

   public void setSlotIndex(int slotIndex) {
      this.slotIndex = slotIndex;
   }

   public int getSlotIndex() {
      return this.slotIndex;
   }

   private void startRecieving(final UsbDevice usbDevice) {
      (new Thread(new Runnable() {
         public void run() {
            while(USB.this.mUsbDeviceList.size() != 0) {
               int readerIndex = USB.this.mUsbDeviceList.indexOf(usbDevice);

               for(int i = 0; i < usbDevice.getInterfaceCount(); ++i) {
                  try {
                     byte[] tmp = USB.this.ft_recv_interrupt(readerIndex, i, 2000);
                     int len = tmp.length;
                     if (tmp[0] == 80 && tmp[1] == 2 && len == 2) {
                        USB.this.mHandlerSendMessage(512 | i, usbDevice.getDeviceName());
                     } else if (tmp[0] == 80 && tmp[1] == 3 && len == 2) {
                        USB.this.mHandlerSendMessage(256 | i, usbDevice.getDeviceName());
                     }
                  } catch (UsbException var5) {
                  }
               }
            }

         }
      })).start();
   }
}
