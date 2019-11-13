Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

class WebrtcCamera {

    constructor() {
        this.video = null
    }

    startCapture(callback, backCamera=true) {
        if (document.readyState !== 'loading') {
            this._initCamera(callback, backCamera)
        } else {
            document.addEventListener("DOMContentLoaded", () => {
                this._initCamera(callback, backCamera)
            })
        }
    }

    _blobToFile(theBlob, fileName) {
        theBlob.lastModifiedDate = new Date();
        theBlob.name = fileName;
        return theBlob;
    }

    stopCapture() {
        if (this.video.srcObject) {
            (this.video.srcObject).getTracks().forEach(track => track.stop())
        }
        document.getElementById('webrtc-camera-div').remove()
    }

    _initCamera(callback, backCamera) {
        const html = "<div style=\"flex-direction: column; background-color: black; align-items: center; width: 100%; height: 100%;\"><link rel=\"stylesheet\" type=\"text/css\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.css\" /><div style=\"height: 100%; width: 100%; background-color: black; display: flex; align-items: center; justify-content: center;\"><video id=\"cam-video\" style=\"width: 100%;height: auto;\" playsinline autoplay></video><div style=\"width: 100%; height: 100%; position: absolute; display: flex; flex-direction: column; z-index: 99999999999999999999999;\"><div style=\"flex: 1; display: flex; flex-direction: 'row';\"><div style=\"flex: 1; background-color: rgba(0,0,0,0.5);\"></div><div style=\"flex: 7; background-color: rgba(0,0,0,0.5);\"></div><div style=\"flex: 1; background-color: rgba(0,0,0,0.5);\"></div></div><div style=\"flex: 7; display: flex; flex-direction: 'row';\"><div style=\"flex: 1; background-color: rgba(0,0,0,0.5);\"></div><div style=\"flex: 7; background-color: transparent;\"></div><div style=\"flex: 1; background-color: rgba(0,0,0,0.5);\"></div></div><div style=\"flex: 1; display: flex; flex-direction: 'row';\"><div style=\"flex: 1; background-color: rgba(0,0,0,0.5);\"></div><div style=\"flex: 7; background-color: rgba(0,0,0,0.5);\"></div><div style=\"flex: 1; background-color: rgba(0,0,0,0.5);\"></div></div></div><div style=\"flex: 1; position: absolute; bottom: 0px; z-index: 9999999999999999;; padding-top: 2%; padding-bottom: 2%; display: flex; align-items: center; justify-content: center; text-align: center;\"><button id=\"cam-button\" style=\"outline: none; background-color: white; border-radius: 40px; display: flex; align-items: center; justify-content: center; width: 80px; height: 80px; font-size: 40px; border-style: none; border-width: 0;\"><i class=\"fas fa-camera\"></i></button></div></div></div>"

        var e = document.createElement('div');
        e.innerHTML = html;
        e.id = "webrtc-camera-div"
        e.style.position = "absolute"
        e.style.width = "100%"
        e.style.height = "100%"
        e.style.top = 0
        e.style.left = 0
        e.style.zIndex = 99999999999999
        document.body.appendChild(e)

        this.video = document.getElementById('cam-video')
        const button = document.getElementById('cam-button');
        button.onclick = () => {
            var tempCanvas = document.createElement("canvas");
            tempCanvas.width = this.video.videoWidth;
            tempCanvas.height = this.video.videoHeight;
            tempCanvas.getContext('2d').drawImage(this.video, 0, 0);
            tempCanvas.toBlob((blob) => {
                var picture = this._blobToFile(blob, 'picture.jpg')
                callback(picture)
            }, 'image/png');
        };

        const constraints = {
            audio: false,
            video: {
                optional: [
                    { minWidth: 320 },
                    { minWidth: 640 },
                    { minWidth: 1024 },
                    { minWidth: 1280 },
                    { minWidth: 1920 },
                    { minWidth: 2560 },
                ],
                
            }
        };

        if (backCamera) {
            constraints.video.facingMode = 'environment'
        }

        navigator.mediaDevices.getUserMedia(constraints).then((stream) => this.video.srcObject = stream).catch((error) =>
            console.error('navigator.MediaDevices.getUserMedia error: ', error.message, error.name));
        scroll(0, 0)
    }

}

