export const INT32_MAX = (1 << 30) * 2 - 1 // '* 2'  is a little hack to counter js' floatting points
export const INT32_MIN = 1 << 31

export const UINT32_MAX = (1 << 30) * 4 - 1 // Same as above, '* 4' is here to fool fp

export function numberToByteArray(value : number, maxBytes : number = UINT32_MAX, padToMax : boolean = false) : number[] {
    let bytes = new Array<number>()
    const sign = Math.sign(value)

    let stringValue = (value >>> 0).toString(16)

    if(stringValue.length % 2 != 0) {
        stringValue = '0' + stringValue
    }

    for(let i = 0; i < stringValue.length; i+= 2) {
        const byte = Number('0x' + stringValue.slice(i, i + 2))
        bytes.push(byte)
    }
    bytes = bytes.reverse()

    const padding = (sign >= 0) ? 0 : 0xff
    while(padToMax && bytes.length < maxBytes) {
        bytes.push(padding)
    }

    return bytes
}

export function isByte(value : number) : boolean {
    return value >= -128 && value <= 255
}

export function byteArrayToNumber(bytes : number[]) : number {
    let result = 0

    bytes.reverse().forEach((byte) => {
        if(isByte(byte)) {
            result *= 256
            result += byte
        } else {
            throw new Error('Byte out of range, received ' + byte)
        }
    })

    return result
}

export function stringToNumber(strValue : string) : number {
    if(strValue.match("[0-9]+")) {
        return parseInt(strValue)
    } else if(strValue.match("0x[0-9a-fA-F]+")) {
        return parseInt(strValue, 16)
    } else if(strValue.match("0b[0-1]+")) {
        return parseInt(strValue, 2)
    } else {
        throw new Error("The format of the number '" + strValue + "' is not supported")
    }
}

export function changeEndianess(value : number) {
    let newValue = 0
    const bytes = numberToByteArray(value)

    bytes.forEach((byte) => {
        newValue <<= 8
        newValue |= byte
    })

    return newValue
}

export function padStringNumber(value : string, digits : number, pad : string = '0') {
    if(pad.length === 0) {
        throw new Error("Can not pad with an empty character")
    }

    let newValue = ""
    
    while(newValue.length + value.length < digits) {
        newValue += pad
    }

    return newValue + value
}

export function toInt32(value : number) {
    const maxValue = Math.pow(2, 31)

    value >>>= 0 // Makes value considered as 32-bit unsigned integer...
    return value >= maxValue ? value - Math.pow(2, 32) : value
}

export function isNumber(value : any) {
    return !Number.isNaN(Number(value))
}