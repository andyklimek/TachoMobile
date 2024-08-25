package com.plainreactnativeapp;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.util.Arrays;

import com.ftsafe.readerScheme.FTReader;
import com.ftsafe.readerScheme.FTException;

public class ApduModule extends ReactContextBaseJavaModule {

    FTReader mFtReader;

    public ApduModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "ApduModule";
    }

    public void openConnection() {
        if (mFtReader == null) {
            return;
        }

        try {
            mFtReader.readerOpen(null);
        } catch (FTException e) {
            e.printStackTrace();
        }

    }
}
