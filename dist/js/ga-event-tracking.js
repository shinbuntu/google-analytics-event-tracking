/**!
 * Jquery Google Analytics Event Tracking
 * By Monnot Stéphane (Shinbuntu)
 */

/**
 * Sends an event to Google Analytics
 *
 * @param {string}  eventCategory Typically the object that was interacted with (e.g. 'Video')
 * @param {string}  eventAction The type of interaction (e.g. 'play')
 * @param {string=} eventLabel Useful for categorizing events (e.g. 'Fall Campaign')
 * @param {number=} eventValue A numeric value associated with the event (e.g. 42)
 * @param {object=} fieldsObject
 */
function sendEventTracking(eventCategory, eventAction, eventLabel, eventValue, fieldsObject) {
  var gaParams = {
    hitType: 'event',
    eventCategory: eventCategory,
    eventAction: eventAction,
    eventLabel: eventLabel,
    eventValue: eventValue,
  }

  gaParams = $.extend({}, gaParams, fieldsObject);

  console.info('sendEventTracking', gaParams);

  ga('send', gaParams);
}

$(function () {
  /* Trackers on event except click event bind below with on  */
  $('*[data-ga-event]:not([data-ga-event=onclick])').each(function () {
    var gaEvent = $(this).data('ga-event');

    switch (gaEvent) {
      case 'onload':
        /* Trackers on load */
        var gaParams = $(this).data('ga').split('::');
        sendEventTracking(gaParams[0], gaParams[1], gaParams[2] || null, gaParams[3] || null);
        break;
    }
  });

  $(document).on('click', '*[data-ga]:not([data-ga-event]), *[data-ga][data-ga-event=onclick]', function (e) {
    var target   = $(this).attr('target'),
        gaParams = $(this).data('ga').split('::');

    if (!$(this).data('ga-prevent-default')
        && $(this).attr('href') !== undefined
        && $(this).attr('href') !== "#"
        && target != '_blank'
    ) {
      e.preventDefault()
      var url = $(this).attr('href');

      sendEventTracking(gaParams[0], gaParams[1], gaParams[2] || null, gaParams[3] || null, {
        'hitCallback': function () {
          if (url.substr(0, 7) == 'http://'
              || url.substr(0, 8) == 'https://') {
            document.location = url;
          } else {
            document.location = $('base').attr('href') + url;
          }
        }
      });
    }
    else {
      if ($(this).data('ga-prevent-default')) {
        e.preventDefault()
      }
      sendEventTracking(gaParams[0], gaParams[1], gaParams[2] || null, gaParams[3] || null);
    }
  })
});