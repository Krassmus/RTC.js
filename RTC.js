/*
 The MIT License (MIT)

 Copyright (c) 2014 Rasmus Fuhse <fuhse@data-quest.de>

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

/**
 * Usage:
 * var connection = new RTC.Connection({
 *     'myvideo': "css selector",
 *     'myaudio': "css selector",
 *     'video': "css selector",
 *     'audio': "css selector",
 *     'sendOffer': function (offer) {},
 *     'sendAnswer': function (answer) {},
 *     'success': function (event) {},
 *     'complete': function () {},
 *     'error': function (error) {}
 * });
 *
 */
RTC = {
    Connection: function (options) {
        this.options = options || {};
        var connection = this;

        if (!this.options.STUN) {
            this.options.STUN = {
                url: !!navigator.webkitGetUserMedia
                    ? 'stun:stun.l.google.com:19302'
                    : 'stun:23.21.150.121'
            };
        }
        if (!this.options.TURN) {
            this.options.STUN = {
                url: 'turn:turn.bistri.com:80',
                username: 'homeo',
                credential: 'homeo'
            }
        }

        var peer = RTC.Peer({
            'iceServers': [this.options.STUN, this.options.TURN]
        });

        peer.onaddstream = function (event) {
            console.log(event);
            connection.options.video.src = window.URL.createObjectURL(event.stream);
            if (connection.options.success) {
                connection.options.success.call(connection, event);
            }
        }

        if (this.options.myvideo) {
            peer.addStream(this.options.myvideo);
        }
        if (this.options.myaudio) {
            peer.addStream(this.options.myaudio);
        }

        peer.createOffer(function(offer) {
            peer.setLocalDescription(RTC.SessionDescription(offer), function() {
                // send the offer to a server to be forwarded the friend you're calling.
                connection.options.sendOffer.call(connection, offer);
            }, function () {});
        }, function (error) {
            connection.options.error.call(connection, error);
        });
    },
    Peer: function (parameter) {
        var genericRTCPeerConnection;
        if (typeof RTCPeerConnection !== "undefined") {
            genericRTCPeerConnection = RTCPeerConnection;
        }
        if (typeof mozRTCPeerConnection !== "undefined") {
            genericRTCPeerConnection = mozRTCPeerConnection;
        }
        if (typeof webkitRTCPeerConnection !== "undefined") {
            genericRTCPeerConnection = webkitRTCPeerConnection;
        }
        if (typeof msRTCPeerConnection !== "undefined") {
            genericRTCPeerConnection = msRTCPeerConnection;
        }
        if (typeof genericRTCPeerConnection === "undefined") {
            return false;
        }
        return new genericRTCPeerConnection(parameter);
    },
    SessionDescription: function (parameter) {
        var genericRTCSessionDescription;
        if (typeof RTCSessionDescription !== "undefined") {
            genericRTCSessionDescription = RTCSessionDescription;
        }
        if (typeof mozRTCSessionDescription !== "undefined") {
            genericRTCSessionDescription = mozRTCSessionDescription;
        }
        if (typeof webkitRTCSessionDescription !== "undefined") {
            genericRTCSessionDescription = webkitRTCSessionDescription;
        }
        if (typeof msRTCSessionDescription !== "undefined") {
            genericRTCSessionDescription = msRTCSessionDescription;
        }
        return new genericRTCSessionDescription(parameter);
    }
};

RTC.Connection.prototype.insertAnswer = function (answer) {
    if ((typeof this.peer !== "undefined")
            && (this.peer.signalingState === "have-local-offer")) {
        var dict = RTC.SessionDescription({
            'type': "answer",
            'sdp': answer
        });
        var connection = this;
        this.peer.setRemoteDescription(
            dict,
            function() {
                connection.options.complete.call(connection);
            },
            function (error) {
                connection.options.error.call(connection, error);
            }
        );
    }
}