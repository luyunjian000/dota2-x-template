import 'panorama-polyfill-x/lib/console';
import 'panorama-polyfill-x/lib/timers';

import { useMemo, useState, useEffect, type FC } from 'react';
import { render } from 'react-panorama-x';
import { useXNetTableKey } from '../hooks/useXNetTable';
import { CustomKey } from './custom-key';

const Test: FC = () => {
    const data = useXNetTableKey(`test_table`, `test_key`, { data_1: `unknown` });
    const string_data = data.data_1;
    return useMemo(() => <Label text={`${string_data}`} />, [string_data]);
};

render(<>
<CustomKey/>
</>, $.GetContextPanel());
