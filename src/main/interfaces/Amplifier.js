const FktIDs = require('../PiMostFunctions/Common/FktIDs')
const Notification = require('../PiMostFunctions/Common/Notification')
const GetNotifications = require('../PiMostFunctions/Common/GetNotifications')
const Disconnect = require('./functions/Disconnect')
const Connect = require('./functions/Connect')
const MixerLevel = require('../PiMostFunctions/AudioDiskPlayer/MixerLevel')
const Volume = require('./functions/Volume')
const Balance = require('./functions/Balance')
const Fader = require('./functions/Fader')
const Bass = require('./functions/Bass')
const Treble = require('./functions/Treble')
const Subwoofer = require('./functions/Subwoofer')
const Loudness = require('./functions/Loudness')
const CustAudio = require('./functions/CustAudio')
const CustSpeakers = require('./functions/CustSpeakers')
const CustSurround = require('./functions/CustSurround')
const Fblock = require('../PiMostFunctions/Common/FBlock')

const {fktList} = require('../enums')

class Amplifier extends Fblock{
    constructor(instID, writeMessage, sourceAddrHigh, sourceAddrLow, addressHigh, addressLow) {
        super(instID, writeMessage, sourceAddrHigh, sourceAddrLow, addressHigh, addressLow)
        this.fBlockID = 0x22
        this.writeMessage = writeMessage
        this.instID = instID
        this.sourceAddrHigh = sourceAddrHigh
        this.sourceAddrLow = sourceAddrLow
        this.status = {}
        this.fktList = {...fktList.general, ...fktList.amplifier}
        this.functions = {...this.functions, ...{
                0x467: new MixerLevel(0x467, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0x400: new Volume(0x400, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0x112: new Disconnect(0x112, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0x111: new Connect(0x111, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0x200: new Balance(0x200, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0x201: new Loudness(0x201, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0x202: new Bass(0x202, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0x203: new Treble(0x203, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0x204: new Fader(0x204, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0x402: new Subwoofer(0x402, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0xE22: new CustAudio(0xE22, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0xE21: new CustSurround(0xE21, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0xE20: new CustSpeakers(0xE20, this.sendMessage.bind(this), this.updateStatus.bind(this))
            }
        }
       //console.log(this.sourceAddrHigh, this.sourceAddrLow)
        this.availableFunctions = {...this.availableFunctions, ...{
            getMixerLevels: this.getMixerLevels.bind(this),
            getVolume: this.getVolume.bind(this),
                createArrayWindow: this.createArrayWindow.bind(this),
                deleteArrayWindow: this.deleteArrayWindow.bind(this),
                disconnect: this.disconnect.bind(this),
                connect: this.connect.bind(this),
                setBass: this.setBass.bind(this),
                getBass: this.getBass.bind(this),
                getFader: this.getFader.bind(this),
                setFader: this.setFader.bind(this),
                getBalance: this.getBalance.bind(this),
                setBalance: this.setBalance.bind(this),
                getTreble: this.getTreble.bind(this),
                setTreble: this.setTreble.bind(this),
                getLoudness: this.setLoudness.bind(this),
                setLoudness: this.setLoudness.bind(this),
                getSubwoofer: this.getSubwoofer.bind(this),
                setSubwoofer: this.setSubwoofer.bind(this),
                incrementBass: this.incBass.bind(this),
                setAudioMode: this.setAudioMode.bind(this),
                setCentre: this.setCentre.bind(this),
                setSurround: this.setSurround.bind(this)
            }
        }
    }

    async getMixerLevels() {
        await this.functions[0x467].get([0x01, 0x01])
    }

    async createArrayWindow() {
        this.sendMessage({fktID: 0x90, opType: 0x06, data: [0x00, 0x31, 0x0c, 0x20, 0xff, 0xff, 0x05]})
    }

    async disconnect() {
        await this.functions[0x112].startResult([1])
    }

    async connect(data) {
        let connectData = [0x01, 0x03]
        connectData.push(...data)
        await this.functions[0x111].startResult(connectData)
    }

    async deleteArrayWindow() {
        this.sendMessage({fktID: 0x91, opType: 0x06, data: [0x00, 0x31, 0x0c, 0x20]})
    }

    async getVolume() {
        await this.functions[0x400].get()
    }

    async getBass() {
        await this.functions[0x202].get()
    }

    async setBass(data) {
        await this.functions[0x202].set(data)
    }

    async getSubwoofer() {
        await this.functions[0x402].get()
    }

    async setSubwoofer(data) {
        await this.functions[0x402].set(data)
    }

    async incBass() {
        await this.functions[0x202].increment([0x01])
    }

    async decBass() {
        await this.functions[0x202].decrement([0x01])
    }

    async getTreble() {
        await this.functions[0x203].get()
    }

    async setTreble(data) {
        await this.functions[0x203].set(data)
    }

    async getFader() {
        await this.functions[0x204].get()
    }

    async setFader(data) {
        await this.functions[0x204].set(data)
    }

    async getBalance() {
        await this.functions[0x200].get()
    }

    async setBalance(data) {
        await this.functions[0x200].set(data)
    }

    async getLoudness() {
        await this.functions[0x201].get()
    }

    async setLoudness(data) {
        await this.functions[0x201].set(data)
    }

    async setAudioMode(data) {
        let outData
        switch (data) {
            case 'stereo':
                outData = 0x00
                break
            case '3Channel':
                outData = 0x01
                break
            case 'dolbyProLogic':
                outData = 0x02
                break
            default:
                outData = 0x00
        }
        await this.functions[0xE22].set([outData])
    }

    async setSurround(data) {
        await this.functions[0xE21].set(data)
    }

    async setCentre(data) {
        let audioMode
        switch(this.status.audio.mode) {
            case 'stereo':
                audioMode = 0x00
                break
            case '3Channel':
                audioMode = 0x01
                break
            case 'dolbyProLogic':
                audioMode = 0x02
                break
            default:
                audioMode = 0x00
        }
        await this.functions[0xE20].set([audioMode, ...data])
    }

    // sendMessage({fktID, opType, data}) {
    //     this.writeMessage({fBlockID: this.fBlockID, instanceID: this.instID, fktID, opType, data}, {sourceAddrHigh: this.sourceAddrHigh, sourceAddrLow: this.sourceAddrLow})
    // }
}

module.exports = Amplifier
