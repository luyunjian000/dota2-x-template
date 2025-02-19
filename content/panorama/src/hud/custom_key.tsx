import 'panorama-polyfill-x/lib/console';
import 'panorama-polyfill-x/lib/timers';

import { useMemo, useState, useEffect, type FC } from 'react';
import { render } from 'react-panorama-x';

// 自定义按键监控组件
export const CustomKey: FC = () => {
	// 状态管理每个按键的按下状态
	const [wState, setWState] = useState(false);
	const [aState, setAState] = useState(false);
	const [sState, setSState] = useState(false);
	const [dState, setDState] = useState(false);

	useEffect(() => {
		// 假设 RegisterKeyBind 是已实现的按键注册函数
		RegisterKeyBind(KeyCode.key_W, ()=>{
			// todo 发送监听事件
			// GameEvents.SendCustomGameEventToServer<{ key: string }>("custom_key", { key: KeyCode.key_W });
			setWState(true);
		});
	
		RegisterKeyBind(KeyCode.key_A, ()=>{
			setWState(true);
		});
	
		RegisterKeyBind(KeyCode.key_S, ()=>{
			setWState(true);
		});
	
		RegisterKeyBind(KeyCode.key_D, ()=>{
			setWState(true);
		});
	
		// 返回清理函数 暂时没有吧
		return () => {
		//   unregisterW();
		//   unregisterA();
		//   unregisterS();
		//   unregisterD();
		};
	}, []);

	return (
		<Panel>
			<Label text={`W: ${wState}`} />
			<Label text={`A: ${aState}`} />
			<Label text={`S: ${sState}`} />
			<Label text={`D: ${dState}`} />
		</Panel>
	);
}

export function RegisterKeyBind(key: string, callBack?: () => void) {
	const cmd = 'CustomKey_' + key + '_' + Date.now().toString(32);
	Game.CreateCustomKeyBind(key, cmd);
	Game.AddCommand(cmd, ()=>{
		if (callBack) {
			callBack();
		}
	}, '', 1 << 32)
}

export const KeyCode = {
	key_Q: "Q",
	key_W: "W",
	key_E: "E",
	key_R: "R",
	key_T: "T",
	key_Y: "Y",
	key_U: "U",
	key_I: "I",
	key_O: "O",
	key_P: "P",
	key_A: "A",
	key_S: "S",
	key_D: "D",
	key_F: "F",
	key_G: "G",
	key_H: "H",
	key_J: "J",
	key_K: "K",
	key_L: "L",
	key_Z: "Z",
	key_X: "X",
	key_C: "C",
	key_V: "V",
	key_B: "B",
	key_N: "N",
	key_M: "M",

	key_Backquote: "`",
	key_Tab: "TAB",
	key_Capslock: "CAPSLOCK",
	key_Shift: "SHIFT",
	// key_Ctrl: "CTRL",
	//无效 Alt: "ALT",
	key_Space: "SPACE",
	key_Minus: "-",
	key_Equal: "=",
	key_Backspace: "BACKSPACE",
	key_BracketLeft: "[",
	key_BracketRight: "]",
	key_Backslash: "\\",
	//无效 Semicolon: ";",
	key_Quote: "'",
	key_Comma: ",",
	key_Period: ".",
	key_Slash: "/",
	//无效 Enter: "RETURN",
	key_Printscreen: "PRINTSCREEN",
	key_ScrollLock: "SCROLLLOCK",
	key_Pause: "PAUSE",
	//无效 Insert: "INSERT",
	key_Home: "HOME",
	//无效 Delete: "DELETE",
	key_End: "END",
	//无效 PageUp: "PAGEUP",
	//无效 PageDown: "PAGEDOWN",
	//无效 Up: "UP",
	//无效 Down: "DOWN",
	//无效 Left: "LEFT",
	//无效 Right: "RIGHT",

	key_Digit1: "1",
	key_Digit2: "2",
	key_Digit3: "3",
	key_Digit4: "4",
	key_Digit5: "5",
	key_Digit6: "6",
	key_Digit7: "7",
	key_Digit8: "8",
	key_Digit9: "9",
	key_Digit0: "0",

	// S1_UP: "S1_UP",
	// S1_DOWN: "S1_DOWN",
	// S1_LEFT: "S1_LEFT",
	// S1_RIGHT: "S1_RIGHT",
	// A_BUTTON: "A_BUTTON",
	// B_BUTTON: "B_BUTTON",
	// X_BUTTON: "X_BUTTON",
	// Y_BUTTON: "Y_BUTTON",
	// L_SHOULDER: "L_SHOULDER",
	// R_SHOULDER: "R_SHOULDER",
	// L_TRIGGER: "L_TRIGGER",
	// R_TRIGGER: "R_TRIGGER",
	// X_AXIS: "X_AXIS",

	// Keypad1: "KEYPAD1",
	// Keypad2: "KEYPAD2",
	// Keypad3: "KEYPAD3",
	// Keypad4: "KEYPAD4",
	// Keypad5: "KEYPAD5",
	// Keypad6: "KEYPAD6",
	// Keypad7: "KEYPAD7",
	// Keypad8: "KEYPAD8",
	// Keypad9: "KEYPAD9",
	// Keypad0: "KEYPAD0",
	// KeypadPeriod: "KEYPAD.",
	// NumLock: "NUMLOCK",
	//无效 KeypadDivide: "KEYPAD/",
	//无效 KeypadMultiply: "KEYPAD*",
	//无效 KeypadSubtract: "KEYPAD-",
	//无效 KeypadAdd: "KEYPAD+",
	//无效 KeypadEnter: "KEYPAD ENTER",

	key_Esc: "ESCAPE",
	key_F1: "F1",
	key_F2: "F2",
	key_F3: "F3",
	key_F4: "F4",
	key_F5: "F5",
	key_F6: "F6",
	key_F7: "F7",
	key_F8: "F8",
	key_F9: "F9",
	key_F10: "F10",
	key_F11: "F11",
	key_F12: "F12",
};