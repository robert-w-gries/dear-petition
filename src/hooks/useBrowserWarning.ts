import { useEffect, useState } from 'react';
import isChrome from '/src/util/isChrome';

const useBrowserWarning = (): [boolean, () => void] => {
  const [shouldDisplay, setShouldDisplay] = useState(false);
  useEffect(() => {
    if (!isChrome) {
      setShouldDisplay(true);
    }
  }, [isChrome]);
  return [shouldDisplay, () => setShouldDisplay(false)];
};

export default useBrowserWarning;
