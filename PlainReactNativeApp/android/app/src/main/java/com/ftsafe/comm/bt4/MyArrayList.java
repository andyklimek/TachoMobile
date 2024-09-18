package com.ftsafe.comm.bt4;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;
import java.util.Map.Entry;

public class MyArrayList<T> extends ArrayList<T> {
   private static final int DELAY_TIME = 1500;
   private Map<T, Timer> map = new HashMap();

   public boolean add(final T t) {
      Timer timer = new Timer();
      timer.schedule(new TimerTask() {
         public void run() {
            MyArrayList.this.remove(t);
         }
      }, 1500L);
      this.map.put(t, timer);
      return super.add(t);
   }

   public void resetTimer(final T t) {
      Timer timer = (Timer)this.map.get(t);
      if (timer != null) {
         timer.cancel();
         timer.purge();
         this.map.remove(t);
         timer = new Timer();
         this.map.put(t, timer);
         timer.schedule(new TimerTask() {
            public void run() {
               MyArrayList.this.remove(t);
            }
         }, 1500L);
      }

   }

   public boolean remove(Object o) {
      try {
         Timer timer = (Timer)this.map.get(o);
         if (timer != null) {
            timer.cancel();
            timer.purge();
            this.map.remove(o);
         }

         return super.remove(o);
      } catch (Exception var3) {
         var3.printStackTrace();
         return false;
      }
   }

   public void clear() {
      Iterator var1 = this.map.entrySet().iterator();

      while(var1.hasNext()) {
         Entry<T, Timer> entry = (Entry)var1.next();
         ((Timer)entry.getValue()).cancel();
         ((Timer)entry.getValue()).purge();
      }

      this.map.clear();
      super.clear();
   }
}
