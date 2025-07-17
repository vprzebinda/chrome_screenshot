export function readSettings() {
    return chrome.storage.sync.get({
        "server_name": 'abc.przebinda.com:8080',
        "passcode": 'none'
      });
}