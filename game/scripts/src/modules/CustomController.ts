import { reloadable } from '../utils/tstl-utils';

@reloadable
export class CustomController {

    constructor() {
        // 个性化的控制 用wasd控制移动
        CustomGameEventManager.RegisterListener<{ key: string }>("custom_key", (_, event)=>{
            const PlayerID = event.PlayerID;
            event.key;
        })
    }
}
