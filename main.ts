namespace rosbot {


    export enum Servos {
        D4 = "4", 
        D7 = "7",
        D8 = "8",
        D11 = "11", 
        D12 = "12",
        D13 = "13", 
        A0 = "A0",
        A1 = "A1",
        A2 = "A2",
        A3 = "A3"
    }

    export enum Motors {
        M1A = 0,
        M1B = 1,
        M2A = 2,
        M2B = 3
    }

    let initialized = false

    /**
     * Internal funciton to handle sending serial data
     * @param data 
     * @param waitTime 
     */
    function writeToSerial(data: string, waitTime: number): void {
        serial.writeString(data + "\n")
        if (waitTime > 0) {
            basic.pause(waitTime)
        }
    }

    /**
    * Set the serial input and output pins for the communication with the Rosbot baseboard
    * @param tx the transmission pin
    * @param rx the reception pin
    */
    //% weight=10
    //% blockId=rosbot_initialize block="Rosbot initialize|TX %tx|RX %rx"
    //% tx.fieldEditor="gridpicker" tx.fieldOptions.columns=3
    //% tx.fieldOptions.tooltips="false"
    //% tx.defl=SerialPin.P1
    //% rx.fieldEditor="gridpicker" rx.fieldOptions.columns=3
    //% rx.fieldOptions.tooltips="false"
    //% rx.defl=SerialPin.P2
    //% blockGap=8 inlineInputMode=inline
    //% group="Configuration"
    export function initialize(tx: SerialPin, rx: SerialPin) {
        serial.redirect(tx, rx, BaudRate.BaudRate115200)
        initialized = true
        basic.pause(100)
        Reset()
    }

    //% blockId=rosbot_servo block="Servo|%index|degree %degree|speed %speed"
    //% weight=50
    //% blockGap=50
    //% degree.min=-45 degree.max=225
    //% speed.min=0 speed.max=255
    //% group="Actuator" name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Servo(name: Servos, degree: number, speed: number): void {
        if (!initialized) {
            return
        }

        writeToSerial("M213 " + name + " " + degree + " " + speed, 0)
    }

    //% blockId=rosbot_motor_run block="Motor|%index|speed %speed"
    //% weight=44
    //% speed.min=-255 speed.max=255
    //% group="Actuator" name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function MotorRun(index: Motors, speed: number): void {
        if (!initialized) {
            return
        }

        writeToSerial("M200 " + index + " " + speed, 0)
    }


    //% blockId=rosbot_motor_dual block="Motor|speed %speed1|speed %speed2"
    //% weight=43
    //% speed1.min=-255 speed1.max=255
    //% speed2.min=-255 speed2.max=255
    //% group="Actuator" name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function MotorRunDual(speed1: number, speed2: number): void {
        if (!initialized) {
            return
        }

        writeToSerial("M204 " + speed1 + " " + speed2 + " 0", 0)
    }

    //% blockId=rosbot_motor_quad block="Motor|speed %speed1|speed %speed2|speed %speed3|speed %speed4"
    //% weight=42
    //% speed1.min=-255 speed1.max=255
    //% speed2.min=-255 speed2.max=255
    //% speed3.min=-255 speed3.max=255
    //% speed4.min=-255 speed4.max=255
    //% group="Actuator" name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function MotorRunQuad(speed1: number, speed2: number, speed3: number, speed4: number): void {
        if (!initialized) {
            return
        }

        writeToSerial("M205 " + speed1 + " " + speed2 + " " + speed3 + " " + speed4, 0)
    }

    //% blockId=rosbot_stop block="Motor Stop|%index|"
    //% group="Actuator" weight=40
    export function MotorStop(index: Motors): void {
        if (!initialized) {
            return
        }

        MotorRun(index, 0);
    }

    //% blockId=rosbot_stop_all block="Motor Stop All"
    //% weight=39
    //% group="Actuator" blockGap=50
    export function MotorStopAll(): void {
        if (!initialized) {
            return
        }
        writeToSerial("M203", 0)
    }

    //% blockId=rosbot_reset block="Reset"
    //% weight=38
    //% group="Other" blockGap=50
    export function Reset(): void {
        if (!initialized) {
            return
        }
        writeToSerial("M999", 2000)
    }

}