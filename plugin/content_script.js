function onImageLoaded(canvas, screenshotImg) {
    const ctx = canvas.getContext("2d");

    ctx.drawImage(screenshotImg, 0, 0)

    let dragging = false
    let down_trigger = false
    let originX, originY
    let left, right, top, bottom
    let width, height

    function updateBox(e) {
        right = Math.max(e.pageX, originX)
        left = Math.min(e.pageX, originX)
        top = Math.min(e.pageY, originY)
        bottom = Math.max(e.pageY, originY)
        width = Math.abs(right - left)
        height = Math.abs(bottom - top)
    }
    canvas.addEventListener("mousedown", (e) => {
        if (e.buttons == 1) {
            dragging = true
            down_trigger = true
        }
    })
    canvas.addEventListener("mouseup", (e) => {
        if (!dragging) {
            return
        }
        dragging = false
        down_trigger = false

        canvas.width = width
        canvas.height = height
        ctx.reset()
        ctx.drawImage(screenshotImg, left, top, width, height, 0, 0, width, height)
        canvas.toBlob(async (blob) => {
            const blob_buffer = await blob.arrayBuffer();
            const encoded_blob = Array.from(new Uint8Array(blob_buffer));
            const response = await chrome.runtime.sendMessage(
                { "type": "blob", "blob": encoded_blob })
            window.location.href = response.target_url
        })
    })
    canvas.addEventListener("mousemove", (e) => {
        if (!dragging) {
            return
        }
        if (down_trigger) {
            originX = e.pageX;
            originY = e.pageY;
            down_trigger = false;
        }
        updateBox(e)
        ctx.reset()
        ctx.drawImage(screenshotImg, 0, 0)
        ctx.beginPath()
        ctx.rect(left, top, width, height)
        ctx.stroke()
    })
}


chrome.runtime.onMessage.addListener((message, sender, senderResponse) => {
    if (message.name === 'stream') {
        const newDiv = document.createElement("div");
        document.body.appendChild(newDiv)
        const screenshotImg = document.createElement("img")
        screenshotImg.src = message.data
        const canvas = document.createElement("canvas")
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight


        screenshotImg.addEventListener("load", (e) => {
            onImageLoaded(canvas, screenshotImg)
        });
        newDiv.appendChild(canvas)

        senderResponse()
    }
})
