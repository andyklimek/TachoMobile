import Foundation
import ExternalAccessory

// All @objc classes and methods are exposed to React Native

@objc(CardReader)
class CardReader: NSObject {
    // Variables to store the reader name, context handle, device list, and card handle
    // These variables are used to interact with the smart card reader
    public var readerName: String = ""
    public var gContxtHandle: SCARDCONTEXT = 0
    public var deviceList: [String] = []
    public var cardHandle: SCARDHANDLE = 0

    private let maxAttempts = 5
    private let scanInterval: TimeInterval = 7.0
    private let retryInterval: TimeInterval = 1.0

    // List of supported protocols for the smart card reader
    // BT interfaces - no suported/commented out
    private let supportedProtocols = [
        "com.ftsafe.ir301",
        "com.ftsafe.iR301",
//        "com.ftsafe.br301",
//        "com.ftsafe.bR301"
    ]


    private let accessoryManager = EAAccessoryManager.shared()

    private let SCARD_E_NO_SMARTCARD: Int64 = 0x8010000C
    private let SCARD_E_READER_UNAVAILABLE: Int64 = 0x80100017

    // Function to establish a context
    // This function is called before any other function to ensure a context is established
    // The context is required to interact with the smart card reader
    @objc
    func establishContext() {
        cleanupContext()  // Ensure previous context is cleaned up

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

    // Function to cleanup the context
    // This function is called when the module is deallocated
    // This is important to avoid memory leaks
    // The context should be cleaned to avoid issues with establishing a new context
    @objc
    func cleanupContext() {
        if gContxtHandle != 0 {
            SCardReleaseContext(gContxtHandle)
            gContxtHandle = 0
            print("Context cleaned up successfully")
        }
    }

    // Function to scan for devices
    // This function is called to scan for devices that match the supported protocols
    private func scanDevice() async -> Bool {
        print("Waiting before scanning for devices...")
        try? await Task.sleep(nanoseconds: UInt64(2 * 1_000_000_000)) // 2-second delay

        print("Scanning for devices...")

        // Get the list of connected accessories that match our supported protocols - facilitate native modules (EAAccessoryManager) instead of using those from SDK
        let connectedAccessories = accessoryManager.connectedAccessories
        for accessory in connectedAccessories {
            for protocolString in accessory.protocolStrings {
                if supportedProtocols.contains(protocolString) {
                    print("Found supported device: \(accessory.name)")
                    self.deviceList.append(accessory.name)
                    self.readerName = accessory.name // Set the reader name to the found accessory
                }
            }
        }

        return !self.deviceList.isEmpty
    }

    // Function to get the list of devices - async function
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

    // Function to get the list of devices - makes maxAttempts number of iterations to scan for devices
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

    // Function to wait for card insertion to avoid errors when connecting to the card
    private func waitForCardInsertion(readerName: String) async throws {
        var readerState = SCARD_READERSTATE()
        readerName.withCString { cString in
            readerState.szReader = cString
        }
        readerState.dwCurrentState = DWORD(SCARD_STATE_UNAWARE)

        var result: LONG
        var attempts = 0

        repeat {
            result = SCardGetStatusChange(self.gContxtHandle, DWORD(INFINITE), &readerState, 1)
            if result != SCARD_S_SUCCESS {
                if Int64(result) == SCARD_E_READER_UNAVAILABLE {
                    print("Reader unavailable, retrying...")
                    attempts += 1
                    try await Task.sleep(nanoseconds: UInt64(retryInterval * 1_000_000_000))
                } else {
                    throw NSError(domain: "CardReaderError", code: Int(result), userInfo: [NSLocalizedDescriptionKey: "Failed to get reader status: \(result)"])
                }
            }
        } while Int64(result) == SCARD_E_READER_UNAVAILABLE && attempts < maxAttempts

        if result != SCARD_S_SUCCESS {
            throw NSError(domain: "CardReaderError", code: Int(result), userInfo: [NSLocalizedDescriptionKey: "Failed to get reader status after multiple attempts"])
        }

        if readerState.dwEventState & DWORD(SCARD_STATE_PRESENT) == 0 {
            throw NSError(domain: "CardReaderError", code: Int(SCARD_E_NO_SMARTCARD), userInfo: [NSLocalizedDescriptionKey: "No smart card present in the reader"])
        }
    }

    // Function to connect to the reader
    // This function is called to connect to the reader
    // The function waits for the card to be inserted before connecting
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


    // Function to send the APDU commands to the card
    // This function allows communication between the app and reader
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

