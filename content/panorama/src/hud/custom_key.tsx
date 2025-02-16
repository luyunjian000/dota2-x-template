import 'panorama-polyfill-x/lib/console';
import 'panorama-polyfill-x/lib/timers';

import { useMemo, useState, useEffect, type FC } from 'react';
import { render } from 'react-panorama-x';
import { useXNetTableKey } from '../hooks/useXNetTable';

// 自定义按键监控组件
export const CustomController: FC = () => {

  const IsAltDown: FC = () => {
  //const altDown = GameUI.IsAltDown();
  const [altDown, setAltDown] = useState(false)
	const hotKey = "R";
	const cmd = 'CustomKey_' + hotKey + '_' + Date.now().toString(32);
	$.Msg("==>Ronkeydown==>" + cmd)
	Game.CreateCustomKeyBind(hotKey, cmd);
	Game.AddCommand(cmd, (keys)=>{
		$.Msg("==>Ronkeydown==>" + keys)
	}, '', 1 << 32);

  const [altDown, setAltDown] = useState(false)
  const [altDown, setAltDown] = useState(false)
  const [altDown, setAltDown] = useState(false)
  const [altDown, setAltDown] = useState(false)

  useEffect(() => {
        if (GameUI.IsAltDown()) {
            $.Msg("altDown==" + altDown)
            setAltDown(true);
        }
    }, [altDown]);

    return (
      <Panel>
        <Label text={`W: `} />
        <Label text={`A: `} />
        <Label text={`S: `} />
        <Label text={`D: `} />
      </Panel>
    );
  };