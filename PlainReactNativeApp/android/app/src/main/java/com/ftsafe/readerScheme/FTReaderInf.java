package com.ftsafe.readerScheme;

public interface FTReaderInf {
   Boolean isFtExist();

   void ft_find() throws Exception;

   void ft_stopfind();

   void ft_open(Object var1) throws Exception;

   void ft_close(String var1);

   byte[] ft_control(int var1, int var2, int var3, int var4, int var5, int var6, int var7) throws Exception;

   void ft_send(int var1, byte[] var2, int var3) throws Exception;

   byte[] ft_recv(int var1, int var2) throws Exception;
}
