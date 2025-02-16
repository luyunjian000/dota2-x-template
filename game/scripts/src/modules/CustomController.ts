import { reloadable } from '../utils/tstl-utils';

@reloadable
export class CustomController {

    constructor() {
        // 个性化的控制 用wasd控制移动
        // ListenToGameEvent(`player_chat`, keys => this.OnPlayerChat(keys), this);

    }

    OnPlayerChat(keys: GameEventProvidedProperties & PlayerChatEvent): void {
        const strs = keys.text.split(' ');
        const cmd = strs[0];
        const args = strs.slice(1);
        const steamid = PlayerResource.GetSteamAccountID(keys.playerid);

    }
}
