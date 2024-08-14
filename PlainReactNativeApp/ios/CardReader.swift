import Foundation

@objc(CardReader)
class CardReader: NSObject {
    public var readerName: String = ""
    public var gContxtHandle: SCARDCONTEXT = 0
    public var deviceList: [String] = []
    public var cardHandle: SCARDHANDLE = 0
    
  private let maxAttempts = 3
  private let scanInterval: TimeInterval = 3.0
      
    @objc
    func establishContext() {
        SCardReleaseContext(gContxtHandle)
        var contextHandle: SCARDCONTEXT = 0
        let result = SCardEstablishContext(DWORD(SCARD_SCOPE_SYSTEM), nil, nil, &contextHandle)
        
        if result != SCARD_S_SUCCESS {
            print("Failed to establish context: \(result)")
        } else {
            print("Context established successfully")
            gContxtHandle = contextHandle
        }
    }
      
    private func scanDevice() async -> Bool {
        print("run")
        var readerNameLength: DWORD = 0
          
        let ret = SCardListReaders(self.gContxtHandle, nil, nil, &readerNameLength)
        if ret != SCARD_S_SUCCESS {
            return false
        }
      
          
        let mszReaders = UnsafeMutablePointer<CChar>.allocate(capacity: Int(readerNameLength))
        defer { mszReaders.deallocate() }
          
        let retList = SCardListReaders(self.gContxtHandle, nil  , mszReaders, &readerNameLength)
        if retList != SCARD_S_SUCCESS {
            return false
        }
          
        var readerPointer = mszReaders
        print(String(cString: mszReaders))
        while readerPointer.pointee != 0 {
            let readerName = String(cString: readerPointer)
        
            if self.isCardReader(readerName: readerName) {
                self.deviceList.append(readerName)
            }
            readerPointer = readerPointer.advanced(by: readerName.count + 1)
        }
          
        return !self.deviceList.isEmpty
    }
      
    private func isCardReader(readerName: String) -> Bool {
        return readerName.contains("FT")
    }
      
    @objc
    func getDeviceListPromise(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        Task {
            do {
                let devices = try await getDeviceList()
                resolve(devices)
            } catch {
                reject("NO_DEVICES", error.localizedDescription, error)
            }
        }
    }
      
    private func getDeviceList() async throws -> [String] {
        self.deviceList.removeAll()
          
        var counter = 0
        while counter < maxAttempts && self.deviceList.isEmpty {
//            if (counter != 0) {
//              self.establishContext()
//            }
//           
            if await scanDevice() {
                return self.deviceList
            }
            counter += 1
            try await Task.sleep(nanoseconds: UInt64(1 * 1_000_000_000))
        }
          
        throw NSError(domain: "CardReaderError", code: 0, userInfo: [NSLocalizedDescriptionKey: "No devices found after \(maxAttempts) attempts"])
    }
  
    @objc
    func connectReader(_ readerName: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        var dwActiveProtocol: DWORD = 0
        var cardHandle: SCARDHANDLE = 0
        
        let result = SCardConnect(gContxtHandle,
                                  readerName.cString(using: .utf8),
                                  DWORD(SCARD_SHARE_SHARED),
                                  DWORD(SCARD_PROTOCOL_T0 | SCARD_PROTOCOL_T1),
                                  &cardHandle,
                                  &dwActiveProtocol)
        
        if result == SCARD_S_SUCCESS {
            self.cardHandle = cardHandle
            print(cardHandle)
            resolve(NSNumber(value: Int(cardHandle)))
        } else {
            let errorMessage = "Failed to connect to reader: \(result)"
            reject("CONNECT_ERROR", errorMessage, nil)
        }
    }
  
//    @objc
//    func connectReader(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
//        Task {
//            do {
//                try await connectToReader()
//                resolve(NSNumber(value: Int(self.cardHandle)))
//            } catch {
//                let errorMessage = "Failed to connect to reader: \(error.localizedDescription)"
//                reject("CONNECT_ERROR", errorMessage, error)
//            }
//        }
//    }
//
//    private func connectToReader() async throws {
//        print("yo")
//
//        // Monitor the reader status
//        var readerState = SCARD_READERSTATE()
//        let readerName = self.deviceList.first ?? ""
//            readerName.withCString { cString in
//                readerState.szReader = cString
//            }
//        readerState.dwCurrentState = DWORD(SCARD_STATE_UNAWARE)
//
//        while true {
//            let result = SCardGetStatusChange(self.gContxtHandle, DWORD(INFINITE), &readerState, 1)
//            print(result)
//            if result != SCARD_S_SUCCESS {
//                throw NSError(domain: "CardReaderError", code: Int(result), userInfo: [NSLocalizedDescriptionKey: "Failed to get reader status: \(result)"])
//            }
//
//            if readerState.dwEventState & DWORD(SCARD_STATE_PRESENT) != 0 {
//                // A reader is available, try to connect to it
//                var dwActiveProtocol: DWORD = 0
//                var cardHandle: SCARDHANDLE = 0
//
//                let connectResult = SCardConnect(
//                    self.gContxtHandle,
//                    readerState.szReader,
//                    DWORD(SCARD_SHARE_SHARED),
//                    DWORD(SCARD_PROTOCOL_T0 | SCARD_PROTOCOL_T1),
//                    &cardHandle,
//                    &dwActiveProtocol
//                )
//
//                if connectResult == SCARD_S_SUCCESS {
//                    self.cardHandle = cardHandle
//                    return
//                } else {
//                    throw NSError(domain: "CardReaderError", code: Int(connectResult), userInfo: [NSLocalizedDescriptionKey: "Failed to connect to reader: \(connectResult)"])
//                }
//            }
//
//            // Wait for the reader status to change
//            try await Task.sleep(nanoseconds: UInt64(self.scanInterval * 1_000_000_000))
//        }
//    }
  
    @objc
    func sendAPDUCommand(_ apduCommand: [UInt8], resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        // Ensure the card is connected
        guard self.cardHandle != 0 else {
            reject("NOT_CONNECTED", "No card connected", nil)
            return
        }

        var pioSendPci: SCARD_IO_REQUEST = SCARD_IO_REQUEST(dwProtocol: DWORD(SCARD_PROTOCOL_T0), cbPciLength: 0)
        var pioRecvPci: SCARD_IO_REQUEST = SCARD_IO_REQUEST(dwProtocol: DWORD(SCARD_PROTOCOL_T0), cbPciLength: 0)
        var pbRecvBuffer = [UInt8](repeating: 0, count: 256)
        var pcbRecvLength: DWORD = 256

        let rv = SCardTransmit(self.cardHandle,
                               &pioSendPci,
                               apduCommand,
                               DWORD(apduCommand.count),
                               &pioRecvPci,
                               &pbRecvBuffer,
                               &pcbRecvLength)

        if rv == SCARD_S_SUCCESS {
            // Truncate the buffer to the actual received length
            let receivedData = Array(pbRecvBuffer.prefix(Int(pcbRecvLength)))
            resolve(receivedData)
        } else {
            let errorMessage = "Failed to send APDU command: \(rv)"
            reject("TRANSMIT_ERROR", errorMessage, nil)
        }
    }
}
