class Resolution {
    constructor(timestamp, message, link) {
        this.timestamp = timestamp;
        this.message = message;
        // this.link = link;
    }
}

Resolution.prototype.toString = function() {
    return `Resolution @ ${this.timestamp}: ${this.message}`;
}


export default Resolution;