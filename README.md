RTC.js
======

A webRTC library that should make an webRTC as easy as jQuery.ajax.

## Usage

You establish a webRTC connection just like you do a call of jQuery.ajax:

    var connection = new RTC.Connection({
        'myvideo': document.getElementById("#me_smiling_in_the_cam"),
        'video': document.getElementById("#remoteuser_smiling_in_the_cam"),
        'sendOffer': function (offer) {
            //and here we send the offer right sto our signalling server
            jQuery.ajax({
                'url': "https://myserver/signaling/start",
                'data': {
                    'offer_sdp': offer
                }
            });
        }
    });

This is how you send an offer to someone. And once you receive the answer (that can will sadly not be in the result of the ajax-call, but most likely to be the result of another ajax-call, but it could also be an event of a websocket or whatever you chose as your signaling way), you will need to insert this answer into the same connection object:

    connection.insertAnswer(answer);

After that the connection should be established. This is a two-step-way of establishing a webRTC-connection: first send an offer and then receive the answer.

## Signaling

The whole process of sending and receiving is called the signaling in webRTC. It is up to you to deliver the offers and answers from one user to another. This is at first a problem of webRTC but in second sight a huge benefit. Because you are independend of any architecture or technology that might be required. For example, if webRTC would demand you to use websockets, this would cause almost all kind of PHP-softwares to be unusable with webRTC, because PHP is not quite good in providing websockets to its users.

This RTC.js library unlike other libraries still leaves the signaling to you so you still have the full flexibility that webRTC wanted to give you.
