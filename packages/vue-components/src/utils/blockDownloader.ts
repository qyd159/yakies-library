export class Downloader {
    isActive = true;
    realtime = false;
    chunkStart = 0;
    chunkSize = 10000000;
    totalLength = 0;
    chunkTimeout = 0;
    url = null;
    callback = null;
    eof = false;
    setDownloadTimeoutCallback = null;
    timeoutID: ReturnType<typeof setTimeout>;
    constructor(url) {
        this.url = url
    }

    setDownloadTimeoutCallbackFunc(callback) {
        this.setDownloadTimeoutCallback = callback;
        return this;
    }

    reset() {
        this.chunkStart = 0;
        this.totalLength = 0;
        this.eof = false;
        return this;
    }

    setRealTime(_realtime) {
        this.realtime = _realtime;
        return this;
    }

    setChunkSize(_size) {
        this.chunkSize = _size;
        return this;
    }

    setChunkStart(_start) {
        this.chunkStart = _start;
        this.eof = false;
        return this;
    }

    setInterval(_timeout) {
        this.chunkTimeout = _timeout;
        return this;
    }

    setUrl(_url) {
        this.url = _url;
        return this;
    }

    setCallback(_callback) {
        this.callback = _callback;
        return this;
    }

    isStopped() {
        return !this.isActive;
    }

    getFileLength() {
        return this.totalLength;
    }

    getFile() {
        var dl = this;
        if (dl.totalLength && this.chunkStart >= dl.totalLength) {
            dl.eof = true;
        }
        if (dl.eof === true) {
            console.info("Downloader", "File download done.");
            this.callback(null, true);
            return;
        }
        var xhr = new XMLHttpRequest();
        xhr.open("GET", this.url, true);
        xhr.responseType = "arraybuffer";
        var range = null;
        // @ts-ignore
        xhr.start = this.chunkStart;
        var maxRange;
        if (this.chunkStart + this.chunkSize < Infinity) {
            range = 'bytes=' + this.chunkStart + '-';
            maxRange = this.chunkStart + this.chunkSize - 1;
            /* if the file length is known we limit the max range to that length */
            /*if (dl.totalLength !== 0) {
                maxRange = Math.min(maxRange, dl.totalLength);
            }*/
            range += maxRange;
            xhr.setRequestHeader('Range', range);
        }
        xhr.onerror = function (e) {
            dl.callback(null, false, true);
        }
        xhr.onreadystatechange = function (e) {
            if (xhr.status == 404) {
                dl.callback(null, false, true);
            }
            if ((xhr.status == 200 || xhr.status == 206 || xhr.status == 304 || xhr.status == 416) && xhr.readyState == this.DONE) {
                var rangeReceived = xhr.getResponseHeader("Content-Range");
                console.info("Downloader", "Received data range: " + rangeReceived);
                /* if the length of the file is not known, we get it from the response header */
                if (!dl.totalLength && rangeReceived) {
                    var sizeIndex;
                    sizeIndex = rangeReceived.indexOf("/");
                    if (sizeIndex > -1) {
                        dl.totalLength = +rangeReceived.slice(sizeIndex + 1);
                    }
                }
                dl.eof = (xhr.response.byteLength !== dl.chunkSize) || (xhr.response.byteLength === dl.totalLength);
                if (!dl.eof) {
                    dl.setChunkStart(dl.chunkStart + xhr.response.byteLength);
                }
                var buffer = xhr.response;
                // @ts-ignore
                buffer.fileStart = xhr.start;
                if (!buffer.fileStart) {
                    // IE does not support adding properties to an ArrayBuffer generated by XHR
                    buffer = buffer.slice(0);
                    // @ts-ignore
                    buffer.fileStart = xhr.start;
                }
                dl.callback(buffer, dl.eof);
                if (dl.isActive === true && dl.eof === false) {
                    var timeoutDuration = dl.chunkTimeout;
                    if (dl.setDownloadTimeoutCallback) dl.setDownloadTimeoutCallback(timeoutDuration);
                    console.info("Downloader", "Next download scheduled in " + Math.floor(timeoutDuration) + ' ms.');
                    dl.timeoutID = setTimeout(dl.getFile.bind(dl), timeoutDuration);
                } else {
                    /* end of file */
                    dl.isActive = false;
                }
            }
        };
        if (dl.isActive) {
            console.info("Downloader", "Fetching " + this.url + (range ? (" with range: " + range) : ""));
            xhr.send();
        }
    }

    start() {
        console.info("Downloader", "Starting file download");
        this.chunkStart = 0;
        this.resume();
        return this;
    }

    resume() {
        console.info("Downloader", "Resuming file download");
        this.isActive = true;
        if (this.chunkSize === 0) {
            this.chunkSize = Infinity;
        }
        this.getFile();
        return this;
    }

    stop() {
        console.info("Downloader", "Stopping file download");
        this.isActive = false;
        if (this.timeoutID) {
            window.clearTimeout(this.timeoutID);
            delete this.timeoutID;
        }
        return this;
    }

}

