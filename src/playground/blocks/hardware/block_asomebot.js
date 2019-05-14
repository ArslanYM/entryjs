'use strict';

String.format = function() {
	var s = arguments[0];
	for (var i = 0; i < arguments.length - 1; i++) {
		var reg = new RegExp("\\{" + i + "\\}", "gm");
		s = s.replace(reg, arguments[i + 1]);
	}
	return s;
}

function random_str(count)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(var i=0; i <count; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

Entry.AsomeBot = {
    id: ['F0.F0', '1A.1'],
    name: 'AsomeBot',
    url: 'http://www.asomeit.com/',
    imageName: 'AsomeBot.png',
    title: {
        ko: 'AsomeBot',
        en: 'AsomeBot',
    },
    setZero: function() {
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
            };
        } else {
            var keySet = Object.keys(Entry.hw.sendQueue.SET);
            keySet.forEach(function(key) {
                Entry.hw.sendQueue.SET[key].data = 0;
                Entry.hw.sendQueue.SET[key].time = new Date().getTime();
            });
        }
        Entry.hw.update();
    },
    getHashKey: function() {
        let key = new Date().getSeconds().toString(16);
        if (key.length === 1) {
            key += ((Math.random() * 16) | 0).toString(16);
        }
        return Entry.generateHash() + key;
    },
    asyncFlowControl: function({ script, data }, scope) {
        if (!this.isExecBlock && !scope.isStart) {
            const blockId = this.getHashKey();
            this.isExecBlock = true;
            scope.isStart = true;
            scope.timeFlag = 1;
            this.nowBlockId = blockId;
            this.blockIds[blockId] = false;
            _merge(Entry.hw.sendQueue, {
                [blockId]: data,
            });
            Entry.hw.update();
            setTimeout(() => {
                scope.timeFlag = 0;
            });
            return false;
        } else if (this.blockIds[this.nowBlockId] && scope.timeFlag === 0) {
            delete this.blockIds[this.nowBlockId];
            delete scope.isStart;
            this.execTimeFlag = 0;
            this.execTimeFlag = undefined;
            this.isExecBlock = false;
            Entry.engine.isContinue = false;
            return true;
        }
        return false;
    },
    postCallReturn: function(args) {
        const { script } = args;
        if (!this.asyncFlowControl(args, script)) {
            return Entry.STATIC.BREAK;
        }
    },
};

Entry.AsomeBot.setLanguage = function() {
    return {
        ko: {
            template: {
                asomebot_toggle_led: '파란 LED %1 %2',
                asomebot_get_ultrasonic_value: '초음파 센서 거리 센서값',

                asomebot_buzzer_open: '부저 켜기 %1',
                asomebot_buzzer_note: '부저를 %1음으로 %2초 연주하기 %3',
                asomebot_buzzer_tone: '부저를 %1주파수로 %2초 연주하기 %3',
                asomebot_buzzer_close: '부저 끄기 %1',

                asomebot_home: '차렷 %1',
                asomebot_angle: '%1번 모터를 %2도로 %3초 동안 회전 %4',
                asomebot_forward: '앞으로 전진 %1',
                asomebot_backward: '뒤로 후진 %1',
                asomebot_turn_left: '왼쪽으로 회전 %1',
                asomebot_turn_right: '오른쪽으로 회전 %1',

                asomebot_mouse: '발인사하기 %1 %2', // 왼쪽, 오른쪽
                asomebot_flap: '깡총 뒤기 %1',
                asomebot_warigari: '트위스트 춤추기 %1',
                asomebot_tock: '발바닥 까닥하기 %1 %2', // 왼쪽, 오른쪽
                asomebot_tick_tock: '발목 비틀어서 까닥하기 %1',
                asomebot_wiggle: '좌우로 흔들 #1 %1',
                asomebot_swing2: '좌우로 흔들 #2 %1',
                asomebot_ballet: '발바닥 모으기 %1',
                asomebot_swing: '발목 비틀어서 발바닥 들기 %1 %2', // 왼쪽(left_swing), 오른쪽(right_swing)
                asomebot_yaho: '야호 %1',
                asomebot_moonwalk: '문워크 춤추기 %1',

                asomebot_connect: '인터넷 연결하기 %1 %2 %3',
                asomebot_open_ap: '공유기 모드로 변경하기 %1 %2',
                asomebot_open_udp: '%1번 포트로 UDP 소켓 열기 %2',
                asomebot_udp_msg: 'UDP 수신값',                
            },
        },
        en: {
            template: {
                asomebot_toggle_led: 'Blue LED %1 %2',
                asomebot_get_ultrasonic_value: '초음파 센서 거리 센서값',

                asomebot_buzzer_open: '부저 켜기 %1',
                asomebot_buzzer_note: '부저를 %1음으로 %2초 연주하기 %3',
                asomebot_buzzer_tone: '부저를 %1주파수로 %2초 연주하기 %3',
                asomebot_buzzer_close: '부저 끄기 %1',

                asomebot_home: 'attention %1',
                asomebot_angle: '%1번 모터를 %2도로 %3초 동안 회전 %4',
                asomebot_forward: 'Moving forward %1',
                asomebot_backward: 'Moving backward %1',
                asomebot_turn_left: 'Turn left %1',
                asomebot_turn_right: 'Turn right %1',

                asomebot_mouse: 'right %1 %2',
                asomebot_flap: 'right %1',
                asomebot_warigari: 'right %1',
                asomebot_tock: 'right %1 %2',
                asomebot_tick_tock: 'right %1',
                asomebot_wiggle: 'right %1',
                asomebot_swing2: 'right %1',
                asomebot_ballet: 'right %1',
                asomebot_swing: 'right %1 %2',
                asomebot_yaho: 'right %1',
                asomebot_moonwalk: 'right %1',

                asomebot_connect: '인터넷 연결하기 %1 %2 %3',
                asomebot_open_ap: '공유기 모드로 변경하기 %1 %2',
                asomebot_open_udp: '%1번 포트로 UDP 소켓 열기 %2',
                asomebot_udp_msg: 'UDP 수신값',                
            },
        },
    };
};

Entry.AsomeBot.blockMenuBlocks = [
    'asomebot_toggle_led',
    'asomebot_get_ultrasonic_value',

    'asomebot_buzzer_open',
    'asomebot_buzzer_note',
    'asomebot_buzzer_tone',
    'asomebot_buzzer_close',

    'asomebot_angle',
    'asomebot_home',
    'asomebot_forward',
    'asomebot_backward',
    'asomebot_turn_left',
    'asomebot_turn_right',

    'asomebot_mouse',
    'asomebot_flap',
    'asomebot_warigari',
    'asomebot_tock',
    'asomebot_tick_tock',
    'asomebot_wiggle',
    'asomebot_swing2',
    'asomebot_ballet',
    'asomebot_swing',
    'asomebot_yaho',
    'asomebot_moonwalk',
 
    'asomebot_connect',
    'asomebot_open_ap',
    'asomebot_open_udp',
    'asomebot_udp_msg',
];

Entry.AsomeBot.getBlocks = function() {
    return {
        // Basic
        asomebot_toggle_led: {
            template: Lang.template.asomebot_toggle_led,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE: 0,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },
                    null
                ],
                type: 'asomebot_toggle_led',
            },
            class: 'Basic',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value = script.getValue('VALUE');

                sq.msg_id = random_str(16);
                sq.msg = String.format("OutputPin(4).{0}()", value);

                return script.callReturn();
            },
            syntax: undefined,
        },
        asomebot_get_ultrasonic_value: {
            template: Lang.template.asomebot_get_ultrasonic_value,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'asomebot_get_ultrasonic_value',
            },
            class: 'Basic',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                sq.msg_id = random_str(16);
                sq.msg = "print('#DT ' + str(hcsr04.get_distance()) + '  ###')";

                return pd.distance;
            },
            syntax: undefined,
        },
        
        // Buzzer
        asomebot_buzzer_open: {
            template: Lang.template.asomebot_buzzer_open,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'asomebot_buzzer_open',
            },
            class: 'Buzzer',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = "turnoff_pins(); import music; music.open(1)"
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_buzzer_note: {
            template: Lang.template.asomebot_buzzer_note,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['C4'],
                    },
                    {
                        type: 'text',
                        params: ['0.3'],
                    },
                    null
                ],
                type: 'asomebot_buzzer_note',
            },
            class: 'Buzzer',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value1 = script.getValue('VALUE1');
                var value2 = parseInt( parseFloat(script.getValue('VALUE2')) * 1000 );

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = String.format("music.note('{0}', {1})", value1, String(value2));
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_buzzer_tone: {
            template: Lang.template.asomebot_buzzer_tone,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['400'],
                    },
                    {
                        type: 'text',
                        params: ['0.3'],
                    },
                    null
                ],
                type: 'asomebot_buzzer_tone',
            },
            class: 'Buzzer',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value1 = script.getValue('VALUE1');
                var value2 = parseInt( parseFloat(script.getValue('VALUE2')) * 1000 );

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = String.format("music.tone({0}); delay({1}); music.mute()", value1, String(value2));
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_buzzer_close: {
            template: Lang.template.asomebot_buzzer_close,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'asomebot_buzzer_close',
            },
            class: 'Buzzer',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = "turnoff_pins(); import asomebot; asomebot.ready(5, 6, 7,8)"
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },

        // Moving
        asomebot_home: {
            template: Lang.template.asomebot_home,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'asomebot_home',
            },
            class: 'Moving',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = String.format("asomebot.home()");
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_angle: {
            template: Lang.template.asomebot_angle,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
                VALUE3: 2,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0.5'],
                    },
                    null
                ],
                type: 'asomebot_angle',
            },
            class: 'Moving',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value1 = script.getValue('VALUE1');
                var value2 = script.getValue('VALUE2');
                var value3 = parseInt( parseFloat(script.getValue('VALUE3')) * 1000 );

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = String.format("asomebot.angles( [{0}], [{1}], {2})", value1, value2, String(value3));
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_forward: {
            template: Lang.template.asomebot_forward,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'asomebot_forward',
            },
            class: 'Moving',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = String.format("asomebot.forward()");
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_backward: {
            template: Lang.template.asomebot_backward,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'asomebot_backward',
            },
            class: 'Moving',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = String.format("asomebot.backward()");
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_turn_left: {
            template: Lang.template.asomebot_turn_left,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'asomebot_turn_left',
            },
            class: 'Moving',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = String.format("asomebot.turn_left()");
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_turn_right: {
            template: Lang.template.asomebot_turn_right,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'asomebot_turn_right',
            },
            class: 'Moving',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = String.format("asomebot.turn_righ()");
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },

        // Dancing
        asomebot_mouse: {
            template: Lang.template.asomebot_mouse,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [ '왼쪽',    '1'],
                        [ '오른쪽', '-1'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE: 0,
            },
            events: {},
            def: {
                params: [null, null],
                type: 'asomebot_mouse',
            },
            class: 'Dancing',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value = script.getStringField('VALUE');

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = String.format("asomebot.mouse({0})", value);
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_flap: {
            template: Lang.template.asomebot_flap,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'asomebot_flap',
            },
            class: 'Dancing',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = String.format("asomebot.flap()");
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_warigari: {
            template: Lang.template.asomebot_warigari,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'asomebot_warigari',
            },
            class: 'Dancing',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = String.format("asomebot.warigari()");
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_tock: {
            template: Lang.template.asomebot_tock,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [ '왼쪽',    '1'],
                        [ '오른쪽', '-1'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE: 0,
            },
            events: {},
            def: {
                params: [null, null],
                type: 'asomebot_tock',
            },
            class: 'Dancing',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value = script.getStringField('VALUE');

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = String.format("asomebot.tock({0})", value);
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_tick_tock: {
            template: Lang.template.asomebot_tick_tock,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'asomebot_tick_tock',
            },
            class: 'Dancing',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = String.format("asomebot.tick_tock()");
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_wiggle: {
            template: Lang.template.asomebot_wiggle,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'asomebot_wiggle',
            },
            class: 'Dancing',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = String.format("asomebot.wiggle()");
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_swing2: {
            template: Lang.template.asomebot_swing2,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'asomebot_swing2',
            },
            class: 'Dancing',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = String.format("asomebot.swing()");
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_ballet: {
            template: Lang.template.asomebot_ballet,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'asomebot_ballet',
            },
            class: 'Dancing',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = String.format("asomebot.ballet()");
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_yaho: {
            template: Lang.template.asomebot_yaho,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'asomebot_yaho',
            },
            class: 'Dancing',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = String.format("asomebot.yaho()");
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_swing: {
            template: Lang.template.asomebot_swing,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [ '왼쪽',    '1'],
                        [ '오른쪽', '-1'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE: 0,
            },
            events: {},
            def: {
                params: [null],
                type: 'asomebot_swing',
            },
            class: 'Dancing',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value = script.getStringField('VALUE');

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    if (value == '1') {
                        sq.msg = String.format("asomebot.swing_left()");
                    } else {
                        sq.msg = String.format("asomebot.swing_right()");
                    }
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_moonwalk: {
            template: Lang.template.asomebot_moonwalk,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'asomebot_moonwalk',
            },
            class: 'Dancing',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = String.format("asomebot.moonwalk()");
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },

        // Internet
        asomebot_connect: {
            template: Lang.template.asomebot_connect,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['SSID'],
                    },
                    {
                        type: 'text',
                        params: ['Password'],
                    },
                    null
                ],
                type: 'asomebot_connect',
            },
            class: 'Internet',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value1 = script.getStringValue('VALUE1');
                var value2 = script.getStringValue('VALUE2');

                sq.msg_id = random_str(16);
                sq.msg = String.format("import internet; internet.connect('{0}', '{1}')", value1, value2);

                return script.callReturn();
            },
            syntax: undefined,
        },
        asomebot_open_ap: {
            template: Lang.template.asomebot_open_ap,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE: 0,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['SSID'],
                    },
                    null
                ],
                type: 'asomebot_open_ap',
            },
            class: 'Internet',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value = script.getStringValue('VALUE');

                sq.msg_id = random_str(16);
                sq.msg = String.format("import internet; internet.open_ap('{0}')", value);

                return script.callReturn();
            },
            syntax: undefined,
        },
        asomebot_open_udp: {
            template: Lang.template.asomebot_open_udp,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE: 0,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        defaultType: 'number',
                        params: ['1234'],
                    },
                    null
                ],
                type: 'asomebot_open_udp',
            },
            class: 'Internet',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value = script.getValue('VALUE');

                sq.msg_id = random_str(16);
                sq.msg = String.format("import udp_socket; udp_socket.open({0})", value);

                return script.callReturn();
            },
            syntax: undefined,
        },
        asomebot_udp_msg: {
            template: Lang.template.asomebot_udp_msg,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'asomebot_udp_msg',
            },
            class: 'Internet',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                sq.msg_id = random_str(16);
                sq.msg = "import udp_socket; udp_socket.read_text()";

                return pd.distance;
            },
            syntax: undefined,
        },
    };
};

module.exports = Entry.AsomeBot;
