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

    startCapture(callback, backCamera = true, borderColor='blue') {
        if (document.readyState !== 'loading') {
            this._initCamera(callback, backCamera, borderColor)
        } else {
            document.addEventListener("DOMContentLoaded", () => {
                this._initCamera(callback, backCamera, borderColor)
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

    _gotStream(stream) {
        this.video.srcObject = stream;
        this.video.onresize = () => {
            if (this.video.videoHeight > this.video.videoWidth) {
                document.getElementById('overlay').style['height'] = this.video.clientHeight + 'px'
                document.getElementById('overlay').style['width'] = this.video.clientWidth + 'px'
                var smallCols = document.getElementsByClassName('overlay-small-col')
                for (var i = 0; i < smallCols.length; i++) {
                    smallCols[i].style['width'] = '10%'
                }
                var bigCols = document.getElementsByClassName('overlay-big-col')
                for (var i = 0; i < bigCols.length; i++) {
                    bigCols[i].style['width'] = '80%'
                }
                var smallRows = document.getElementsByClassName('overlay-small-row')
                for (var i = 0; i < smallRows.length; i++) {
                    smallRows[i].style['height'] = smallCols[0].clientWidth + 'px'
                }
                document.getElementById('overlay-big-row').style['height'] = (this.video.clientHeight - smallCols[0].clientWidth * 2) + 'px'
            } else {
                document.getElementById('overlay').style['height'] = this.video.clientHeight + 'px'
                document.getElementById('overlay').style['width'] = this.video.clientWidth + 'px'
                var smallRows = document.getElementsByClassName('overlay-small-row')
                for (var i = 0; i < smallRows.length; i++) {
                    smallRows[i].style['height'] = '10%'
                }
                document.getElementById('overlay-big-row').style['height'] = '80%'

                var smallCols = document.getElementsByClassName('overlay-small-col')
                for (var i = 0; i < smallCols.length; i++) {
                    smallCols[i].style['width'] = smallRows[0].clientHeight + 'px'
                }
                var bigCols = document.getElementsByClassName('overlay-big-col')
                for (var i = 0; i < bigCols.length; i++) {
                    bigCols[i].style['width'] = (this.video.clientWidth - smallRows[0].clientHeight * 2) + 'px'
                }
            }
        }
    }

    _initCamera(callback, backCamera, borderColor) {
        const html = "<div style=\"flex-direction: column; background-color: black; align-items: center; width: 100%; height: 100%;\"><script src=\"https://webrtc.github.io/adapter/adapter-latest.js\" type=\"text/javascript\"></script><link rel=\"stylesheet\" type=\"text/css\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.css\" /><div style=\"height: 100%; width: 100%; background-color: black; display: flex; align-items: center; justify-content: center;\"><video id=\"cam-video\" style=\"max-width: 100%; max-height: 100%; background-color: black; width: auto; height: auto;\" playsinline autoplay></video><div id=\"overlay\" style=\"background-color: transparent;position: absolute; display: flex; flex-direction: column; z-index: 99999999999999999999999;\"><div class=\"overlay-small-row\" style=\" display: flex; flex-direction: 'row';\"><div class=\"overlay-small-col\" style=\"background-color: rgba(0,0,0,0.65);\"></div><div class=\"overlay-big-col\" style=\"background-color: rgba(0,0,0,0.65);\"></div><div class=\"overlay-small-col\" style=\"background-color: rgba(0,0,0,0.65);\"></div></div><div id=\"overlay-big-row\" style=\" display: flex; flex-direction: 'row';\"><div class=\"overlay-small-col\" style=\"background-color: rgba(0,0,0,0.65);\"></div><div  id=\"center-col\" class=\"overlay-big-col\" style=\"border-color: blue; border-width: 3px; border-style: solid; background-color: transparent;\"></div><div class=\"overlay-small-col\" style=\"background-color: rgba(0,0,0,0.65);\"></div></div><div class=\"overlay-small-row\" style=\" display: flex; flex-direction: 'row';\"><div class=\"overlay-small-col\" style=\"background-color: rgba(0,0,0,0.65);\"></div><div class=\"overlay-big-col\" style=\"background-color: rgba(0,0,0,0.65);\"></div><div class=\"overlay-small-col\" style=\"background-color: rgba(0,0,0,0.65);\"></div></div><button id=\"close-button\" style=\"position:absolute; top: 0px; right: 0px; outline: none; background-color: transparent; color: white; display: flex; align-items: center; justify-content: center; z-index: 999999999999999999999999999999999999999;width: 80px; height: 80px; font-size: 40px; border-style: none; border-width: 0;\" ><div style=\"position: absolute;background-color: black;width: 20px;height: 20px\" ></div><i style=\"z-index: 99999999999999\" class=\"fas fa-times-circle\" ></i></button></div><div style=\"flex: 1; position: absolute; bottom: 0px; z-index: 9999999999999999;; padding-top: 2%; padding-bottom: 2%; display: flex; align-items: center; justify-content: center; text-align: center;\"><button id=\"cam-button\" style=\"outline: none; background-color: white; border-radius: 40px; display: flex; align-items: center; justify-content: center; width: 80px; height: 80px; font-size: 40px; border-style: none; border-width: 0;\"><i class=\"fas fa-camera\"></i></button></div></div></div>"
        var e = document.createElement('div');
        e.innerHTML = html;
        e.id = "webrtc-camera-div"
        e.style.position = "fixed"
        e.style.width = "100%"
        e.style.height = "100%"
        e.style.top = 0
        e.style.left = 0
        e.style.zIndex = 99999999999999
        document.body.appendChild(e)

        this.video = document.getElementById('cam-video')
        const camButton = document.getElementById('cam-button');
        camButton.onclick = (e) => {
            e.preventDefault()
            var tempCanvas = document.createElement("canvas");
            tempCanvas.width = this.video.videoWidth;
            tempCanvas.height = this.video.videoHeight;
            tempCanvas.getContext('2d').drawImage(this.video, 0, 0);
            tempCanvas.toBlob((blob) => {
                var picture = this._blobToFile(blob, 'picture.jpg')
                callback(picture)
                this.stopCapture()
            }, 'image/jpeg');
        };
        const closeButton = document.getElementById('close-button');
        closeButton.onclick = (e) => {
            e.preventDefault()
            this.stopCapture()
        };

        if (borderColor) {
            document.getElementById('center-col').style['border-color'] = borderColor
        }

        const constraints = {
            audio: false,
            video: { aspectRatio: 4 / 3, width: 1920, facingMode: backCamera ? 'environment' : 'user' }
        };

        navigator.mediaDevices.getUserMedia(constraints).then((stream) => { this._gotStream(stream) }).catch((error) => { console.error('navigator.MediaDevices.getUserMedia error: ', error.message, error.name) });

    }

}

