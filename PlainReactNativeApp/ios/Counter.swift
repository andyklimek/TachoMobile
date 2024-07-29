//
//  Counter.swift
//  PlainReactNativeApp
//
//  Created by Antoni Łubisz on 28/07/2024.
//

import Foundation

@objc(Counter)
class Counter: NSObject{
  
  private var count = 0;
  
  @objc
  func increment(){
    count += 1;
    print(count);
  }
}
