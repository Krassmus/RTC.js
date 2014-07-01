RTC.js
======

A webRTC library that should make an webRTC as easy as jQuery.ajax. For a proper API-documentation see the github-page: http://krassmus.github.io/RTC.js/

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

This is how you send an offer to someone. And once you receive the answer (that will sadly not be in the result of the ajax-call, but most likely to be the result of another ajax-call that requests news from the server periodically, but it could also be an event of a websocket or whatever you chose as your signaling way), you will need to insert this answer into the same connection object:

    connection.insertAnswer(answer);

After that the connection should be established. This is a two-step-way of establishing a webRTC-connection: first send an offer and then receive the answer.

But of course there is also another part of establishing the connection and that is the other user, who is not sending the offer, but receiving it.

    var getNewsFromServer = function () {
        jQuery.ajax({
             'url': "https://myserver/get_news",
             'dataType': "json",
             'success': function (result) {
                 if (result.offer && window.confirm("Incoming user call. Do you want to answer the call?")) {
                     var connection = new RTC.Connection({
                         'myvideo': document.getElementById("#me_smiling_in_the_cam"),
                         'video': document.getElementById("#remoteuser_smiling_in_the_cam"),
                         'offer': result.offer,
                         'sendAnswer': function (answer) {
                             //and here we send the offer right sto our signalling server
                             jQuery.ajax({
                                 'url': "https://myserver/signaling/answer",
                                 'data': {
                                     'answer_sdp': offer
                                 }
                             });
                         }
                     });
                 }
             }
        });
    };
    window.setInterval(getNewsFromServer, 1000);

This part is a bit more complex, because we've also written a part of the signaling process to demonstrate how the answer is coming to the connection.

## Sending data like chat messages

You can send messages with the send-method. You can insert any JSON-objects into the send-method.

    var connection = new RTC.Connection({
        'sendOffer': function (offer) {
            //and here we send the offer right sto our signalling server
            jQuery.ajax({
                'url': "https://myserver/signaling/start",
                'data': {
                    'offer_sdp': offer
                }
            });
        },
        'receive': function (message) {
            if (message.type === "chat") {
                jQuery("<div>").text(message.message).appendTo("#chatwindow");
            }
        }
    });

    connection.send({
        'type': "chat",
        'message': "hello :)"
    });

So you see, you need to define the `receive` option with a function that handles incoming messages. And you can send with ... ´send()´.

## Signaling

The whole process of sending and receiving is called the signaling in webRTC. It is up to you to deliver the offers and answers from one user to another. This is at first a problem of webRTC but in second sight a huge benefit. Because you are independend of any architecture or technology that might be required. For example, if webRTC would demand you to use websockets, this would cause almost all kind of PHP-softwares to be unusable with webRTC, because PHP is not quite good in providing websockets to its users.

This RTC.js library unlike other libraries still leaves the signaling to you so you still have the full flexibility that webRTC wanted to give you.

## License

MIT license. Enjoy!
