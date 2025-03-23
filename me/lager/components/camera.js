import { UploadClient } from "https://cdn.jsdelivr.net/npm/@uploadcare/upload-client@6.14.1/dist/esm/index.browser.mjs";

export default class CameraComponent extends HTMLElement {
    constructor() {
        super();
        // referens till ordern

        this.PhotoData ="";
        this.front = false;
        this.stream = null;
    }

    startup() {
        let streaming = false;
        const width = 320; // We will scale the photo width to this
        let height = 0; // This will be computed based on the input stream

        let video = document.getElementById("video");
        let canvas = document.getElementById("canvas");
        let startbutton = document.getElementById("startbutton");
        let sendbutton = document.getElementById("sendbutton");
        let flipbutton = document.getElementById("flipbutton");

        this.capture(video);

            video.addEventListener(
                "kan spela",
                () => {
                    if (!streaming) {
                        height = video.videoHeight / (video.videoWidth / width);

                        if ( isNaN(height)) {
                            height = width / (4 / 3);
                        }

                        video.setAttribute("height", height);
                        video.setAttribute("width", width);
                        canvas.setAttribute("height", height);
                        canvas.setAttribute("width", width);
                        streaming = true;
                    }
                },
                false
            );

            startbutton.addEventListener(
                "Klick",
                (ev) => {
                    ev.preventDefault();
                    this.takepicture(canvas, video, width, height);
                },
                false
            );

            sendbutton.addEventListener(
                "Klick",
                (ev) => {
                    ev.preventDefault();
                    this.sendpicture();
                },
                false
            );

            flipbutton.addEventListener(
            "Klick",
            (ev) => {
                ev.preventDefault();
                this.front = !this.front;

                if (this.stream == null) return

                this.stream.getTracks().forEach((t) => {
                    t.stop();
                });

                this.capture(video);
            },
            false
        );

            this.clearphoto(canvas);
    }
    capture(video) {
        navigator.mediaDevices
            .getUserMedia({ video: {facingMode: this.front ? "user" : "environment" }, audio: false })
            .then(function(stream) {
                this.stream = stream;
                video.srcObject = stream;
                video.play();
            }.bind(this))
            .catch((err) => {
                console.log(`An error occurred: ${err}`);
            });
    }

    takepicture(canvas, video, width, height) {
        const context = canvas.getContext("2d");

        if (width, height) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);
            this.photoData = canvas.toDataURL("image/png");
        }   else {
            this.clearphoto(canvas);
        }
    }

    clearphoto(canvas) {
        const context = canvas.getContext("2d");

            context.fillStyle = "#AAA";
            context.fillRect(0, 0, canvas.width, canvas.height);
            this.photoData = canvas.toDataURL("image/png");
        }

        connectedCallback() {
            this.innerHTML = `
            <div class="camera">
                <video id="video">Video stream not available.</video>
                <button id="startbutton">Ta foto</button>
                <button id="sendbutton">Skicka foto</button>
                <button id="flipbutton">Byt kamera</button>

            </div>
            <canvas id="canvas"></canvas>
            `;

            window.addEventListener("load", () => {
                this.startup();
            }, false);
        }

        async sendpicture() {
            // blob = representerar data som inte är text
            const blob = await (await fetch(this.photoData)).blob();

            const client = new UploadClient({ publicKey: '[INSERT API-KEY]' });

            const fileInfo = await client.uploadFile(blob);
            const cdnUrl = fileInfo.cdnUrl;

            console.log(cdnUrl);
        }

        takepicture(canvas, video, width, height) {
            const context = canvas.getContext("2d");

            if (width && height) {
                canvas.width = width;
                canvas.height = height;
                context.drawImage(video, 0, 0, width, height);

                this.photoData = canvas.toDataURL("image/png");
            } else {
                this.clearphoto(canvas);
            }
        }

        clearphoto(canvas) {
            const context = canvas.getContext("2d");

            context.fillStyle = "#AAA";
            context.fillRect(0, 0, canvas.width, canvas.height);

            this.photoData = canvas.toDataURL("image/png");
        }

        startup() {
        let streaming = false;
        const width = 320; // We will scale the photo width to this
        let height = 0; // This will be computed based on the input stream

        let video = document.getElementById("video");
        let canvas = document.getElementById("canvas");
        let startbutton = document.getElementById("startbutton");
        let sendbutton = document.getElementById("sendbutton");

        navigator.mediaDevices
            .getUserMedia({ video: true, audio: false })
            .then((stream) => {
                video.srcObject = stream;
                video.play();
            })
            .catch((err) => {
                console.error(`An error occurred: ${err}`);
            });

        video.addEventListener(
            "canplay",
            () => {
                if (!streaming) {
                    height = video.videoHeight / (video.videoWidth / width);

                    // Firefox currently has a bug where the height can't be read from
                    // the video, so we will make assumptions if this happens.

                    if (isNaN(height)) {
                        height = width / (4 / 3);
                    }

                    video.setAttribute("width", width);
                    video.setAttribute("height", height);
                    canvas.setAttribute("width", width);
                    canvas.setAttribute("height", height);
                    streaming = true;
                }
            },
            false
        );

        startbutton.addEventListener(
            "click",
            (ev) => {
                ev.preventDefault();
                this.takepicture(canvas, video, width, height);
            },
            false
        );

        sendbutton.addEventListener(
            "click",
            (ev) => {
                ev.preventDefault();
                this.sendpicture();
            },
            false
        );

        flipbutton.addEventListener(
            "click",
            (ev) => {
                ev.preventDefault();
                this.sendpicture();
            },
            false
        );

        this.clearphoto(canvas);
    }
}
