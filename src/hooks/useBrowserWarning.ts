import { useEffect, useState } from 'react';
import isChrome from '../util/isChrome';

const ENABLE_BROWSER_WARNING = false;

const useBrowserWarning = () => {
  const [shouldDisplay, setShouldDisplay] = useState(false);
  useEffect(() => {
    if (!isChrome()) {
      setShouldDisplay(true);
    }
  }, []);
  return [ENABLE_BROWSER_WARNING && shouldDisplay, () => setShouldDisplay(false)] as [boolean, () => void];
};

export default useBrowserWarning;
