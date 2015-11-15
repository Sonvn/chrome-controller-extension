var finger_size = 32;
var width = window.innerWidth;
var height = window.innerHeight;
var $indexFinger;
var currentElem;

add_finger();

window.onload = function () {
    document.getElementsByTagName("BODY")[0].style.zoom = "100%";
};

var $previousElem;

function highlightLinkElem(pos) {
    var setHighlight = function (elem) {
        $(elem).css({
            'border': '2px solid red'
        });
    };
    if ($previousElem) {
        $($previousElem).css({
            'border': 'none'
        });
    }
    var elem = document.elementFromPoint(pos.left, pos.top);
    if ($(elem).is("a") || $(elem).is("button")) {
        currentElem = elem;
        setHighlight(elem);
        $previousElem = elem;
    }
}

function add_finger() {
    $('body').append('<div class="finger" id="indexFinger"><\/div>');
    $indexFinger = $('#indexFinger').css({
        'background-color': '#9AC847',
        '-webkit-box-shadow': 'inset 0 0 5px #000',
        'box-shadow': 'inner 0 0 5px #000',
        'width': finger_size + 'px',
        'height': finger_size + 'px',
        'top': '0px',
        'left': '0px',
        'position': 'absolute',
        '-webkit-border-radius': Math.ceil(finger_size / 2) + 'px',
        'border-radius': Math.ceil(finger_size / 2) + 'px',
        'z-index': '10000',
        '-webkit-transition': 'opacity 0.15s ease',
        'transition': 'opacity 0.15s ease',
        '-webkit-box-sizing': 'border-box',
        'box-sizing': 'border-box',
        'transform': 'translate3d(0,0,0)',
        'display': 'none'
    });
}

function update_finger(scale, frame) {
    var pos = {};
    if (frame.hands[0] && frame.hands[0].indexFinger.extended) {
        var top = height - 4 * frame.hands[0].indexFinger.tipPosition[1] + 150;
        var left = width / 2 + 6 * frame.hands[0].indexFinger.tipPosition[0];

        pos.top = top;
        pos.left = left;

        $indexFinger.css({
            'display': 'block',
            'top': 0,
            'left': 0,
            'position': 'fixed',
            'transform': 'translate3d(' + left.toFixed(2) + 'px, ' + top.toFixed(2) + 'px, 0)',
            'opacity': '0.75'
        });
    } else {
        $indexFinger.css({
            'display': 'none'
        });
    }
    return pos;
}

var actionSwipe;

var controller = new Leap.Controller({enableGestures: true})
    .use('screenPosition', {
        scale: 1
    })
    .connect()
    .on('frame', function (frame) {
        var hand = frame.hands[0];

        actions.scroll(frame);
        if (hand && !hand.indexFinger.extended
            && !hand.pinky.extended) {
            actions.zoom(frame);
        }

        if (hand && hand.middleFinger.extended
            && !hand.thumb.extended
            && hand.indexFinger.extended
            && !hand.ringFinger.extended
            && !hand.pinky.extended) {
            if (frame.valid && frame.gestures.length > 0) {
                frame.gestures.forEach(function (gesture) {
                    if (gesture.state == "stop" && frame.hands && frame.hands.length == 1) switch (gesture.type) {
                        case "circle":
                            if (getNumExtendedFingers(frame) == 2) {
                                var clockwise = false;
                                var pointableID = gesture.pointableIds[0];
                                var direction = frame.pointable(pointableID).direction;
                                var dotProduct = Leap.vec3.dot(direction, gesture.normal);
                                if (dotProduct > 0) {
                                    actionSwipe = actions.historyForward;
                                } else {
                                    actionSwipe = actions.historyBack;
                                }
                            }
                            throttle(function () {
                                if(actionSwipe) actionSwipe();
                            }, 1000)();
                            break;
                    }
                });
            }
        }

        //TODO: enable this
        if (hand && !hand.middleFinger.extended
            && !hand.thumb.extended
            && hand.indexFinger.extended
            && !hand.ringFinger.extended
            && !hand.pinky.extended) {
            var scale = (frame.hands.length > 0 && frame.hands[0]._scaleFactor !== 'undefined') ? frame.hands[0]._scaleFactor : 1;
            var pos = update_finger(scale, frame);
            highlightLinkElem(pos);

            if (frame.valid && frame.gestures.length > 0) {
                frame.gestures.forEach(function (gesture) {
                    if (frame.hands && frame.hands.length == 1) switch (gesture.type) {
                        case "keyTap":
                            console.log("FUCK HUY ");
                            console.log(currentElem);
                            if (currentElem) $(currentElem)[0].click();
                            break;
                    }
                });
            }
        }


    });
