
WebrtcCamera
---

Use your desktop / mobile camera through your browser.

### Usage

## Browser

Import the script, instantiate a `WebrtcCamera` object and use `startCapture(callback, backCamera, borderColor)` with a callback function as first argument and whether or not it should use your back camera. If false, your front camera or webcam is used. The third argument is the overlay border color.
Use `stopCapture()` to stop it.

```javascript
    <script src="webrtc-camera.js"></script>
    ...
    <script>
        var camera = new WebrtcCamera()

        function onCapture(blob) {
            // Do something with it
            var reader = new FileReader();
            reader.readAsDataURL(blob); 
            reader.onloadend = function() {
                var base64data = reader.result;                
                console.log(base64data);
                camera.stopCapture()
            }
        }
      
        camera.startCapture(onOn, false, 'red')
    <script>

```

## Angular

Add `webrtc-camera.js` to your `scripts` in `angular.json`.

```javascript
   {
    "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
    "version": 1,
    "newProjectRoot": "projects",
    "projects": {
        "myproject": {
        ...
        "architect": {
            "build": {
            ...
            "options": {
                "scripts": [..., "src/assets/js/webrtc-camera.js"]
            },
        ....
```

Declare a `WebrtcCamera` var and create an instance. Then use it.

```javascript
declare var WebrtcCamera: any;

ngOnInit() {
    this.camera = new WebrtcCamera()
}

onTakPicture(blob) {
    // Do something with the blob
}

this.camera.startCapture(this.onTakePicture, true, 'red')
this.camera.stopCapture()
```

### Licence
Apache 2.0




