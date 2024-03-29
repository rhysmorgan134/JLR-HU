export const fBlocks = {
  0x01: 'NetBlock',
  0x02: 'NetworkMaster',
  0x03: 'ConnectionMaster',
  0x05: 'Vehicle',
  0x06: 'Diagnosis',
  0x07: 'DebugMessages',
  0x0e: 'Tool',
  0x0f: 'EnhancedTestibility',
  0x10: 'Sources',
  0x21: '33',
  0x22: 'Amplifier',
  0x23: '35',
  0x24: 'AuxIn',
  0x26: 'MicrophoneInput',
  0x30: 'AudioTapePlayer',
  0x31: 'AudioDiskPlayer',
  0x34: 'DVDVideoPlayer',
  0x40: 'AmFmTuner',
  0x41: 'TMCTuner',
  0x42: 'TVTuner',
  0x43: 'DABTuner',
  0x44: 'SDARS',
  0x50: 'Telephone',
  0x51: 'GeneralPhoneBook',
  0x60: 'GraphicDisplay',
  0xf5: 'CanGateway',
  0xf0: 'u240',
  0x71: 'Climate'
}

export const faultCodes = {
  0x01: 'FBlockID not available',
  0x02: 'InstID not available\n',
  0x03: 'FktID not available',
  0x04: 'OPType not available',
  0x05: 'Invalid length',
  0x06:
    'Parameter wrong / out of range\n' +
    'One or more of the parameters were wrong, i.e. not within the boundaries specified for the function',
  0x07:
    'Parameter not available\n' +
    'One or more of the parameters were within the boundaries specified for the function, but are not available at that time.',
  0x0a: 'Secondary Node',
  0x0b: 'Device Malfunction',
  0x0c: 'Segmentation Error',
  0x20: 'Function Specific',
  0x40: 'Busy',
  0x41:
    'Not available -- Function is implemented in principle, but is not available\n' +
    'at the moment',
  0x42: 'Processing Error',
  0x43: 'Method Aborted'
}

export const opTypes = {
  properties: {
    0x00: 'Set',
    0x01: 'Get',
    0x02: 'SetGet',
    0x03: 'Increment',
    0x04: 'Decrement',
    0x05: 'GetInterface',
    0x06: 'StartResultAck',
    0x09: 'ErrorAck',
    0x0c: 'Status',
    0x0e: 'Interface',
    0x0f: 'Error'
  },
  methods: {
    0x00: 'Start',
    0x01: 'Abort',
    0x02: 'StartResult',
    0x05: 'GetInterface',
    0x06: 'StartResultAck',
    0x07: 'AbortAck',
    0x08: 'StartAck',
    0x09: 'ErrorAck',
    0x0a: 'ProcessingAck',
    0x0b: 'Processing',
    0x0c: 'Result',
    0x0d: 'ResultAck',
    0x0e: 'Interface',
    0x0f: 'Error'
  }
}

export const fktList = {
  general: {
    0x000: 'FktIDs',
    0x001: 'Notification',
    0x002: 'NotificationCheck',
    0x010: 'Version',
    0x011: 'FBlockInfo',
    0x080: 'DynArrayIns',
    0x081: 'DynArrayDel',
    0x082: 'MapIns',
    0x083: 'MapDel',
    0x090: 'CreateArrayWindow',
    0x091: 'DestroyArrayWindow',
    0x092: 'MoveArrayWindow',
    0x093: 'SearchArrayWindow',
    0x094: 'LongArrayInfo',
    0x09a: 'ArrayWindowIns',
    0x09b: 'ArrayWindowDel',
    0x0a0: 'PowerDownDelay',
    0x0c0: 'HDCP_ReceiverConnectedIndication',
    0x0c1: 'HDCP_ReceiverDisconnectedIndication',
    0x0c2: 'HDCP_Control',
    0x0c4: 'HDCP_DecipherStatus',
    0x0c5: 'HDCP_Assign',
    0x100: 'SourceInfo',
    0x101: 'Allocate',
    0x102: 'DeAllocate',
    0x103: 'SourceActivity',
    0x104: 'SourceName',
    0x108: 'AllocateExt',
    0x110: 'SinkInfo',
    0x111: 'Connect',
    0x112: 'DisConnect',
    0x113: 'Mute',
    0x114: 'SinkName',
    0x115: 'ConnectT o',
    0x116: 'StreamDataInfo',
    0x117: 'SinkRouting',
    0x118: 'ConnectExt',
    0x120: 'DTCP_StartProcess',
    0x121: 'DTCP_Control',
    0x122: 'DTCP_Status',
    0x123: 'DTCP_CipherStatus',
    0x124: 'DTCP_Info',
    0x125: 'DTCP_ContentKeyProcess',
    0x126: 'DTCP_InfoExt',
    0x130: 'ScreenFormat',
    0x131: 'VideoFrequency',
    0x132: 'VideoNorm',
    0x133: 'VideoSignalFormat',
    0x135: 'VideoFormat',
    0x200: 'DeckStatus',
    0x201: 'TimePosition',
    0x202: 'TrackPosition',
    0x203: 'FramePosition',
    0x205: 'TitlePosition',
    0x206: 'ChapterPosition',
    0x207: 'DeckStatusExt',
    0x251: 'VideoInteraction',
    0x270: 'PlayerRegion',
    0x430: 'DeckEvent',
    0x431: 'MediaEvent',
    0x450: 'Random',
    0x451: 'Scan',
    0x452: 'Repeat',
    0x453: 'NextTrackToPlay',
    0x454: 'Deemphasis',
    0x455: 'SlowFwSpeed',
    0x456: 'SlowBwSpeed',
    0x457: 'FastFwSpeed',
    0x458: 'FastBwSpeed'
  },
  amplifier: {
    0x000: 'FktIDs',
    0x001: 'Notification',
    0x002: 'NotificationCheck',
    0x010: 'Version',
    0x110: 'SinkInfo',
    0x111: 'Connect',
    0x112: 'DisConnect',
    0x113: 'Mute',
    0x114: 'SinkName',
    0x115: 'ConnectTo',
    0x116: 'SyncDataInfo',
    0x117: 'SinkRouting',
    0x200: 'Balance',
    0x201: 'Loudness',
    0x202: 'Bass',
    0x203: 'Treble',
    0x204: 'Fader',
    0x400: 'Volume',
    0x401: 'FadeInOut',
    0x402: 'Subwoofer',
    0x404: 'BassBoost',
    0x421: 'CompThreshold',
    0x422: 'LimThreshold',
    0x423: 'CompGain',
    0x424: 'AttackTime',
    0x425: 'ReleaseTime',
    0x426: 'CompressorSettings',
    0x427: 'LimiterSettings',
    0x430: 'Crossover',
    0x431: 'CrossoverSlope',
    0x440: 'DelayLine',
    0x441: 'SpeakerDelay',
    0x450: 'InputGainOffset',
    0x451: 'OutputGainOffset',
    0x452: 'OutputPhase',
    0x460: 'EqualizerOnOff',
    0x461: 'EqualizerSettings',
    0x462: 'GraphEqualizerOnOff',
    0x463: 'GraphEqualizer',
    0x464: 'GraphEqualizerLinear',
    0x465: 'MidTones',
    0x466: 'MuteParameters',
    0x467: 'MixerLevel',
    0x468: 'SoundSettingList',
    0x469: 'RecallSoundSetting',
    0x46a: 'SaveSoundSetting',
    0x46b: 'DynSoundControl',
    0x46c: 'CurrentSoundSetting',
    0x46d: 'SpeakerLevel'
  }
}
