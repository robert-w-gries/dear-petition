import { useEffect, useState } from 'react';
import isChrome from '../util/isChrome';

const useBrowserWarning = () => {
  const [shouldDisplay, setShouldDisplay] = useState(false);
  useEffect(() => {
    if (!isChrome) {
      setShouldDisplay(true);
    }
  }, []);
  return [shouldDisplay, () => setShouldDisplay(false)];
};

export default useBrowserWarning;
