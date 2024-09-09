import Foundation
import ExternalAccessory

@objc(CardReader)
class CardReader: NSObject {
    public var readerName: String = ""
    public var gContxtHandle: SCARDCONTEXT = 0
    public var deviceList: [String] = []
    public var cardHandle: SCARDHANDLE = 0
    
    private let maxAttempts = 5
    private let scanInterval: TimeInterval = 7.0
    private let retryInterval: TimeInterval = 1.0
    private let supportedProtocols = [
        "com.ftsafe.ir301",
        "com.ftsafe.iR301",
    ]
    
    private let accessoryManager = EAAccessoryManager.shared()
    
    private let SCARD_E_NO_SMARTCARD: Int64 = 0x8010000C
    private let SCARD_E_READER_UNAVAILABLE: Int64 = 0x80100017 

    @objc
    func establishContext() {
        cleanupContext()

        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) { [weak self] in
            guard let self = self else { return }

            var contextHandle: SCARDCONTEXT = 0
            let result = SCardEstablishContext(DWORD(SCARD_SCOPE_SYSTEM), nil, nil, &contextHandle)
            
            if result != SCARD_S_SUCCESS {
                print("Failed to establish context: \(result)")
            } else {
                print("Context established successfully")
                self.gContxtHandle = contextHandle
            }
        }
    }
    
    @objc
    func cleanupContext() {
        if gContxtHandle != 0 {
            SCardReleaseContext(gContxtHandle)
            gContxtHandle = 0
            print("Context cleaned up successfully")
        }
    }

    private func scanDevice() async -> Bool {
        print("Waiting before scanning for devices...")
        try? await Task.sleep(nanoseconds: UInt64(2 * 1_000_000_000))

        print("Scanning for devices...")
        
        let connectedAccessories = accessoryManager.connectedAccessories
        for accessory in connectedAccessories {
            for protocolString in accessory.protocolStrings {
                if supportedProtocols.contains(protocolString) {
                    print("Found supported device: \(accessory.name)")
                    self.deviceList.append(accessory.name)
                    self.readerName = accessory.name
                }
            }
        }
        
        return !self.deviceList.isEmpty
    }

    @objc
    func getDeviceListPromise(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        Task {
            do {
                let devices = try await getDeviceList()
                print(devices)
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
            if counter != 0 {
                self.establishContext()
            }
            
            if await scanDevice() {
                return self.deviceList
            }
            counter += 1
            try await Task.sleep(nanoseconds: UInt64(1 * 1_000_000_000))
        }
        
        throw NSError(domain: "CardReaderError", code: 0, userInfo: [NSLocalizedDescriptionKey: "No devices found after \(maxAttempts) attempts"])
    }

    private func waitForCardInsertion(readerName: String) async throws {
        print(readerName)
        var readerState = SCARD_READERSTATE()
        readerName.withCString { cString in
            readerState.szReader = cString
        }
        readerState.dwCurrentState = DWORD(SCARD_STATE_UNAWARE)

        var result: LONG
        var attempts = 0
      
        result = SCardGetStatusChange(self.gContxtHandle, DWORD(INFINITE), &readerState, 1)

        repeat {
            result = SCardGetStatusChange(self.gContxtHandle, DWORD(INFINITE), &readerState, 1)
            print(readerState)
            print(EAAccessoryManager.shared().connectedAccessories)
            print("Bluetooth status: \(EAAccessoryManager.shared().connectedAccessories.count)")
          if result != SCARD_S_SUCCESS {
                if Int64(result) == SCARD_E_READER_UNAVAILABLE {
                    print("Reader unavailable, retrying...")
                    attempts += 1
                    try await Task.sleep(nanoseconds: UInt64(retryInterval * 1_000_000_000))
                } else {
                    print("here1")
                    throw NSError(domain: "CardReaderError", code: Int(result), userInfo: [NSLocalizedDescriptionKey: "Failed to get reader status: \(result)"])
                }
            }
        } while Int64(result) == SCARD_E_READER_UNAVAILABLE && attempts < maxAttempts

        if result != SCARD_S_SUCCESS {
            print("here2")
            throw NSError(domain: "CardReaderError", code: Int(result), userInfo: [NSLocalizedDescriptionKey: "Failed to get reader status after multiple attempts"])
        }

        if readerState.dwEventState & DWORD(SCARD_STATE_PRESENT) == 0 {
            throw NSError(domain: "CardReaderError", code: Int(SCARD_E_NO_SMARTCARD), userInfo: [NSLocalizedDescriptionKey: "No smart card present in the reader"])
        }
    }

    @objc
    func connectReader(_ readerName: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        Task {
            do {
                try await self.waitForCardInsertion(readerName: readerName)
              
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
                    print("Connected to reader: \(readerName)")
                    resolve(NSNumber(value: Int(cardHandle)))
                } else if Int64(result) == SCARD_E_NO_SMARTCARD {
                    let errorMessage = "No smart card present in the reader."
                    reject("NO_SMARTCARD", errorMessage, nil)
                } else if Int64(result) == SCARD_E_READER_UNAVAILABLE {
                    for attempt in 1...3 {
                        print("Retrying connection attempt \(attempt)...")
                        try await Task.sleep(nanoseconds: UInt64(retryInterval * 1_000_000_000))
                        let retryResult = SCardConnect(gContxtHandle,
                                                       readerName.cString(using: .utf8),
                                                       DWORD(SCARD_SHARE_SHARED),
                                                       DWORD(SCARD_PROTOCOL_T0 | SCARD_PROTOCOL_T1),
                                                       &cardHandle,
                                                       &dwActiveProtocol)
                        
                        if retryResult == SCARD_S_SUCCESS {
                            self.cardHandle = cardHandle
                            print("Connected to reader on attempt \(attempt): \(readerName)")
                            resolve(NSNumber(value: Int(cardHandle)))
                            return
                        }
                    }
                    let errorMessage = "Failed to connect to reader after retries."
                    reject("CONNECT_ERROR", errorMessage, nil)
                } else {
                    let errorMessage = "Failed to connect to reader: \(result)"
                    reject("CONNECT_ERROR", errorMessage, nil)
                }
            } catch {
                reject("CONNECT_ERROR", error.localizedDescription, error)
            }
        }
    }
  
    @objc
    func sendAPDUCommand(_ apduCommand: [UInt8], resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
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
            let receivedData = Array(pbRecvBuffer.prefix(Int(pcbRecvLength)))
            resolve(receivedData)
        } else {
            let errorMessage = "Failed to send APDU command: \(rv)"
            reject("TRANSMIT_ERROR", errorMessage, nil)
        }
    }
}

