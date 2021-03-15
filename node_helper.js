/* Magic Mirror
 * Module: MMM-Confucius
 *
 * By Mykle1
 *
 * MIT Licensed
 */
const NodeHelper = require('node_helper');
const request = require('request');

module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for: " + this.name);
    },

    getConfucius: function(url) {
        request({
          url: url, 
          // url: 'https://www.stands4.com/services/v2/quotes.php?uid='+this.config.uid+'&tokenid='+this.config.tokenid+'&searchtype='+this.config.searchtype+'&query='+this.config.query+'&format=json',
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body);
                	// console.log(body); // for checking
                this.sendSocketNotification('CONFUCIUS_RESULT', result);
            }
        });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_CONFUCIUS') {
            this.getConfucius(payload);
        }
        if (notification === 'CONFIG') {
            this.config = payload;
        }
    }
});
