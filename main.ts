
/**
 * M5Stack unit gesture sensor (PAJ7620U2)
 * The PAJ7620 integrates gesture recognition function with general I2C interface.
 * It can recognize 9 gestures: up, down, left, right, forward, backward, 
 * clockwise, anti-clockwise, and wave.
 */
//% color=#0079B9 icon="\uf256" block="M5 Gesture"
namespace m5gesture {
    // Device ID
    const PAJ7620_IIC_ADDR = 0x73;
    const PAJ7620_PARTID = 0x7620;

    // Register Bank Select
    const PAJ7620_REGITER_BANK_SEL = 0xEF;

    // Register Bank 0
    const PAJ7620_ADDR_PART_ID_LOW = 0x00;
    const PAJ7620_ADDR_PART_ID_HIGH = 0x01;
    const PAJ7620_ADDR_GES_PS_DET_FLAG_0 = 0x43;
    const PAJ7620_ADDR_GES_PS_DET_FLAG_1 = 0x44;

    // Banks
    const PAJ7620_BANK0 = 0;
    const PAJ7620_BANK1 = 1;

    let isInitialized = false;

    /**
     * Gesture types
     */
    export enum Gesture {
        //% block="None"
        None = 0x00,
        //% block="Right"
        Right = 0x01,
        //% block="Left"
        Left = 0x02,
        //% block="Up"
        Up = 0x04,
        //% block="Down"
        Down = 0x08,
        //% block="Forward"
        Forward = 0x10,
        //% block="Backward"
        Backward = 0x20,
        //% block="Clockwise"
        Clockwise = 0x40,
        //% block="Anti-Clockwise"
        AntiClockwise = 0x80,
        //% block="Wave"
        Wave = 0x100
    }

    // Initialization register array
    const initRegArray: number[][] = [
        [0xEF, 0x00], [0x32, 0x29], [0x33, 0x01], [0x34, 0x00],
        [0x35, 0x01], [0x36, 0x00], [0x37, 0x07], [0x38, 0x17],
        [0x39, 0x06], [0x3A, 0x12], [0x3F, 0x00], [0x40, 0x02],
        [0x41, 0xFF], [0x42, 0x01], [0x46, 0x2D], [0x47, 0x0F],
        [0x48, 0x3C], [0x49, 0x00], [0x4A, 0x1E], [0x4B, 0x00],
        [0x4C, 0x20], [0x4D, 0x00], [0x4E, 0x1A], [0x4F, 0x14],
        [0x50, 0x00], [0x51, 0x10], [0x52, 0x00], [0x5C, 0x02],
        [0x5D, 0x00], [0x5E, 0x10], [0x5F, 0x3F], [0x60, 0x27],
        [0x61, 0x28], [0x62, 0x00], [0x63, 0x03], [0x64, 0xF7],
        [0x65, 0x03], [0x66, 0xD9], [0x67, 0x03], [0x68, 0x01],
        [0x69, 0xC8], [0x6A, 0x40], [0x6D, 0x04], [0x6E, 0x00],
        [0x6F, 0x00], [0x70, 0x80], [0x71, 0x00], [0x72, 0x00],
        [0x73, 0x00], [0x74, 0xF0], [0x75, 0x00], [0x80, 0x42],
        [0x81, 0x44], [0x82, 0x04], [0x83, 0x20], [0x84, 0x20],
        [0x85, 0x00], [0x86, 0x10], [0x87, 0x00], [0x88, 0x05],
        [0x89, 0x18], [0x8A, 0x10], [0x8B, 0x01], [0x8C, 0x37],
        [0x8D, 0x00], [0x8E, 0xF0], [0x8F, 0x81], [0x90, 0x06],
        [0x91, 0x06], [0x92, 0x1E], [0x93, 0x0D], [0x94, 0x0A],
        [0x95, 0x0A], [0x96, 0x0C], [0x97, 0x05], [0x98, 0x0A],
        [0x99, 0x41], [0x9A, 0x14], [0x9B, 0x0A], [0x9C, 0x3F],
        [0x9D, 0x33], [0x9E, 0xAE], [0x9F, 0xF9], [0xA0, 0x48],
        [0xA1, 0x13], [0xA2, 0x10], [0xA3, 0x08], [0xA4, 0x30],
        [0xA5, 0x19], [0xA6, 0x10], [0xA7, 0x08], [0xA8, 0x24],
        [0xA9, 0x04], [0xAA, 0x1E], [0xAB, 0x1E], [0xCC, 0x19],
        [0xCD, 0x0B], [0xCE, 0x13], [0xCF, 0x64], [0xD0, 0x21],
        [0xD1, 0x0F], [0xD2, 0x88], [0xE0, 0x01], [0xE1, 0x04],
        [0xE2, 0x41], [0xE3, 0xD6], [0xE4, 0x00], [0xE5, 0x0C],
        [0xE6, 0x0A], [0xE7, 0x00], [0xE8, 0x00], [0xE9, 0x00],
        [0xEE, 0x07], [0xEF, 0x01], [0x00, 0x1E], [0x01, 0x1E],
        [0x02, 0x0F], [0x03, 0x10], [0x04, 0x02], [0x05, 0x00],
        [0x06, 0xB0], [0x07, 0x04], [0x08, 0x0D], [0x09, 0x0E],
        [0x0A, 0x9C], [0x0B, 0x04], [0x0C, 0x05], [0x0D, 0x0F],
        [0x0E, 0x02], [0x0F, 0x12], [0x10, 0x02], [0x11, 0x02],
        [0x12, 0x00], [0x13, 0x01], [0x14, 0x05], [0x15, 0x07],
        [0x16, 0x05], [0x17, 0x07], [0x18, 0x01], [0x19, 0x04],
        [0x1A, 0x05], [0x1B, 0x0C], [0x1C, 0x2A], [0x1D, 0x01],
        [0x1E, 0x00], [0x21, 0x00], [0x22, 0x00], [0x23, 0x00],
        [0x25, 0x01], [0x26, 0x00], [0x27, 0x39], [0x28, 0x7F],
        [0x29, 0x08], [0x30, 0x03], [0x31, 0x00], [0x32, 0x1A],
        [0x33, 0x1A], [0x34, 0x07], [0x35, 0x07], [0x36, 0x01],
        [0x37, 0xFF], [0x38, 0x36], [0x39, 0x07], [0x3A, 0x00],
        [0x3E, 0xFF], [0x3F, 0x00], [0x40, 0x77], [0x41, 0x40],
        [0x42, 0x00], [0x43, 0x30], [0x44, 0xA0], [0x45, 0x5C],
        [0x46, 0x00], [0x47, 0x00], [0x48, 0x58], [0x4A, 0x1E],
        [0x4B, 0x1E], [0x4C, 0x00], [0x4D, 0x00], [0x4E, 0xA0],
        [0x4F, 0x80], [0x50, 0x00], [0x51, 0x00], [0x52, 0x00],
        [0x53, 0x00], [0x54, 0x00], [0x57, 0x80], [0x59, 0x10],
        [0x5A, 0x08], [0x5B, 0x94], [0x5C, 0xE8], [0x5D, 0x08],
        [0x5E, 0x3D], [0x5F, 0x99], [0x60, 0x45], [0x61, 0x40],
        [0x63, 0x2D], [0x64, 0x02], [0x65, 0x96], [0x66, 0x00],
        [0x67, 0x97], [0x68, 0x01], [0x69, 0xCD], [0x6A, 0x01],
        [0x6B, 0xB0], [0x6C, 0x04], [0x6D, 0x2C], [0x6E, 0x01],
        [0x6F, 0x32], [0x71, 0x00], [0x72, 0x01], [0x73, 0x35],
        [0x74, 0x00], [0x75, 0x33], [0x76, 0x31], [0x77, 0x01],
        [0x7C, 0x84], [0x7D, 0x03], [0x7E, 0x01]
    ]

    /**
     * Write data to register
     */
    function writeReg(reg: number, value: number): void {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = value;
        pins.i2cWriteBuffer(PAJ7620_IIC_ADDR, buf);
    }

    /**
     * Read data from register
     */
    function readReg(reg: number, len: number = 1): number {
        pins.i2cWriteNumber(PAJ7620_IIC_ADDR, reg, NumberFormat.UInt8BE);
        if (len == 1) {
            return pins.i2cReadNumber(PAJ7620_IIC_ADDR, NumberFormat.UInt8BE);
        } else {
            let buf = pins.i2cReadBuffer(PAJ7620_IIC_ADDR, len);
            return buf[0];
        }
    }

    /**
     * Select register bank
     */
    function selectBank(bank: number): void {
        writeReg(PAJ7620_REGITER_BANK_SEL, bank);
    }

    /**
     * Initialize the M5 gesture sensor
     */
    //% blockId=m5gesture_init
    //% block="initialize gesture sensor"
    //% weight=100
    //% blockGap=8
    export function init(): void {
        basic.pause(100);
        
        // Check device ID
        selectBank(PAJ7620_BANK0);
        basic.pause(10);
        
        let lowByte = readReg(PAJ7620_ADDR_PART_ID_LOW);
        let highByte = readReg(PAJ7620_ADDR_PART_ID_HIGH);
        let partId = (highByte << 8) | lowByte;
        
        if (partId != PAJ7620_PARTID) {
            isInitialized = false;
            return;
        }

        // Write initialization registers
        for (let i = 0; i < initRegArray.length; i++) {
            writeReg(initRegArray[i][0], initRegArray[i][1]);
        }

        selectBank(PAJ7620_BANK0);
        basic.pause(100);
        isInitialized = true;
    }

    /**
     * Get detected gesture
     * Returns the currently detected gesture
     */
    //% blockId=m5gesture_get_gesture
    //% block="gesture"
    //% weight=80
    export function getGesture(): Gesture {
        if (!isInitialized) {
            return Gesture.None;
        }

        let gesture = 0;
        
        // Read gesture flag register 1 first (for Wave detection)
        let flag1 = readReg(PAJ7620_ADDR_GES_PS_DET_FLAG_1);
        gesture = flag1 << 8;

        if (gesture == Gesture.Wave) {
            basic.pause(1000);
            return Gesture.Wave;
        }

        // Read gesture flag register 0
        let flag0 = readReg(PAJ7620_ADDR_GES_PS_DET_FLAG_0);
        gesture = flag0 & 0x00FF;

        // Short pause for other gestures
        if (gesture != Gesture.None) {
            basic.pause(100);
        }

        // Handle Forward/Backward with longer pause
        if (gesture == Gesture.Forward || gesture == Gesture.Backward) {
            basic.pause(200);
        }

        return gesture as Gesture;
    }

    /**
     * Check if a specific gesture matches the detected gesture
     * @param value the detected gesture value
     * @param gesture the gesture to check against
     */
    //% blockId=m5gesture_is_gesture
    //% block="gesture %value is %gesture"
    //% value.shadow="m5gesture_get_gesture"
    //% weight=70
    export function isGesture(value: number, gesture: Gesture): boolean {
        return value == gesture;
    }

    /**
     * Get gesture name as string
     * @param gesture the gesture to convert to string
     */
    //% blockId=m5gesture_gesture_name
    //% block="name of gesture %gesture"
    //% gesture.shadow="m5gesture_get_gesture"
    //% weight=60
    //% advanced=true
    export function gestureName(gesture: number): string {
        switch (gesture) {
            case Gesture.None: return "None";
            case Gesture.Right: return "Right";
            case Gesture.Left: return "Left";
            case Gesture.Up: return "Up";
            case Gesture.Down: return "Down";
            case Gesture.Forward: return "Forward";
            case Gesture.Backward: return "Backward";
            case Gesture.Clockwise: return "Clockwise";
            case Gesture.AntiClockwise: return "Anti-Clockwise";
            case Gesture.Wave: return "Wave";
            default: return "Unknown " + gesture;
        }
    }

    // Internal: handlers and watcher for gesture change events
    let _gestureChangeHandlers: ((gesture: Gesture) => void)[] = [];
    let _watcherStarted = false;

    function _startWatcher(): void {
        if (_watcherStarted) return;
        _watcherStarted = true;
        control.inBackground(() => {
            let last = Gesture.None;
            while (true) {
                if (isInitialized) {
                    const g = getGesture();
                    if (g != last) {
                        last = g;
                        for (const h of _gestureChangeHandlers) {
                            h(g);
                        }
                    }
                } else {
                    basic.pause(1000);
                }
            }
        });
    }

    /**
     * Run code when the gesture changes.
     * Handler receives the new gesture value.
     */
    //% blockId=m5gesture_on_gesture_changed
    //% block="on gesture changed"
    //% draggableParameters="reporter"
    //% weight=85
    export function onGestureChanged(handler: (gesture: Gesture) => void): void {
        _gestureChangeHandlers.push(handler);
        _startWatcher();
    }
}