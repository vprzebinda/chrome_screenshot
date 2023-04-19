import { readSettings } from './read_settings.js';

chrome.action.onClicked.addListener(function (tab) {
    let queryOptions = { active: true, lastFocusedWindow: true };
    chrome.tabs.query(queryOptions, ([tab]) => {
        console.log(tab.id)
    });

    chrome.tabs.captureVisibleTab(
        {
            'format': 'png',
            'quality': 100
        },
        async function (dataUrl) {
            const server_name = await readSettings()
            chrome.tabs.create({
                'active': true, "url": "https://" +
                    server_name.server_name + "/blank"
            }, function (new_tab) {
                setTimeout(() => chrome.tabs.sendMessage(new_tab.id, { name: "stream", data: dataUrl },
                    function (response) { console.log(response) }), 200)
            })
        }
    )
})

async function uploadscreenshot(blob) {
    const server_name = await readSettings()
    const upload_url = "https://" + server_name.server_name + "/upload"
    const response = await fetch(upload_url, {
        method: "POST",
        headers: {
            "Content-Type": "image/png"
        },
        body: blob
    })

    const responseText = await response.text()
    const final_url = "https://" + server_name.server_name + "/screenshots/" +
        responseText
    return final_url;
}

chrome.runtime.onMessage.addListener((message, sender, senderResponse) => {
    const array_buffer = new Uint8Array(message.blob).buffer;  
    uploadscreenshot(array_buffer).then((final_url) => {
        senderResponse({ "target_url": final_url })
    })
    return true;
})