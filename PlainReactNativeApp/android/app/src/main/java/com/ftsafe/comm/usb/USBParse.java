package com.ftsafe.comm.usb;

import java.util.ArrayList;
import java.util.List;

public class USBParse {
   static final int TAG_INTERFACE = 4;
   static final int CONFIG_DESCRIPTOR_LEN = 9;
   static final int CONFIG_DESCRIPTOR_TYPE = 2;
   static final int CONFIG_DESCRIPTOR_NUM_INTERFACES = 4;
   static final int CCID_DESCRIPTOR_LEN = 54;
   static final int CCID_DESCRIPTOR_TYPE = 33;

   public static int[] getInterfaceIndexFromRawDescriptor(byte[] rawDescriptor) {
      int[] temp = new int[10];
      int index = 0;

      byte len;
      for(int i = 0; i < rawDescriptor.length; i += len) {
         len = rawDescriptor[i];
         int tag = rawDescriptor[i + 1];
         if (tag == 4) {
            temp[index] = rawDescriptor[len - 1];
            ++index;
         }
      }

      int[] interfaceIndex = new int[index];

      for(int i = 0; i < index; ++i) {
         interfaceIndex[i] = temp[i];
      }

      return interfaceIndex;
   }

   public static List<CCIDDescriptor> getCCIDDescriptorList(byte[] data) {
      List<CCIDDescriptor> ccidDescriptorList = new ArrayList();

      byte len;
      for(int i = 0; i < data.length; i += len) {
         len = data[i];
         if (len == 54 && data[i + 1] == 33) {
            CCIDDescriptor ccidDescriptor = new CCIDDescriptor();
            ccidDescriptor.parse(data, i, len);
            ccidDescriptorList.add(ccidDescriptor);
         }
      }

      return ccidDescriptorList;
   }
}
