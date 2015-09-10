import { history as hashHistory } from 'react-router/lib/HashHistory';
import { history as browserHistory } from 'react-router/lib/BrowserHistory';


let platform = () => {
  let ua = navigator.userAgent.toLowerCase();

  let match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
    /(webkit)[ \/]([\w.]+)/.exec(ua) ||
    /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
    /(msie) ([\w.]+)/.exec(ua) ||
    ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];

  let matched = {
    browser: match[1] || "",
    version: match[2] || "0"
  };
  let browser = {};
  if (matched.browser) {
    browser[matched.browser] = true;
    browser.version = matched.version;
  }

  // Chrome is Webkit, but Webkit is also Safari.
  if (browser.chrome) {
    browser.webkit = true;
  } else if (browser.webkit) {
    browser.safari = true;
  }
  return browser;
};

let browser = platform();

let autoHistory = () => {
  let { msie, version } = browser;
  if (msie && parseInt(version) <= 9) {
    return hashHistory;
  }
  return browserHistory;
}
let history = autoHistory();

export { browser, history };

