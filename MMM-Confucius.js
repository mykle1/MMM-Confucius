/* Magic Mirror
 * Module: MMM-Confucius
 * By Mykle1
 * MIT Licensed
 */
Module.register("MMM-Confucius", {

    // Module config defaults.
    defaults: {
        uid: "",
        tokenid: "",
        category: "",
        searchtype: "",
        query: "",
        useHeader: false, // true if you want a header
        header: "Your Header", // Any text you want. useHeader must be true
        maxWidth: "100%",
        animationSpeed: 3000,
        initialLoadDelay: 4250,
        retryDelay: 2500,
        rotateInterval: 1 * 60 * 1000,
        updateInterval: 60 * 60 * 1000,
    },

    // Gets correct css file from config.js
    getStyles: function() {
            return ["modules/MMM-Confucius/css/MMM-Confucius.css"];
        },

    getScripts: function() {
        return ["moment.js"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);
        this.sendSocketNotification('CONFIG', this.config);

        this.url = this.getCategoryUrl();

        this.con = {};
        this.activeItem = 0;
        this.rotateInterval = null;
        this.scheduleUpdate();

    },

    getDom: function() {

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = "Confucius says . . .";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("xsmall", "bright", "light");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }

        //	Rotating my data
        var keys = Object.keys(this.con);
        if (keys.length > 0) {
            if (this.activeItem >= keys.length) {
                this.activeItem = 0;
            }
            var cons = this.con[keys[this.activeItem]];


            var quote = document.createElement("div");
            quote.classList.add("small", "bright", "quote");
            quote.innerHTML = cons.quote;
            wrapper.appendChild(quote);

            var author = document.createElement("div");
            author.classList.add("small", "bright", "author");
            author.innerHTML = "~ " + cons.author + " ~";
            wrapper.appendChild(author);

          }

        return wrapper;
    },


    processConfucius: function(data) {
        this.con = data.result;
        // console.log(this.con);
        this.loaded = true;
    },

    scheduleCarousel: function() {
        console.log("Carousel of Confuxius firing");
        this.rotateInterval = setInterval(() => {
            this.activeItem++;
            this.updateDom(this.config.animationSpeed);
        }, this.config.rotateInterval);
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getConfucius();
        }, this.config.updateInterval);
        this.getConfucius(this.config.initialLoadDelay);
    },



    getCategoryUrl: function() {

      //var url = null;
      var cat = this.config.category;
      var id = this.config.uid;
      var tokid = this.config.tokenid;
      var type = this.config.searchtype;
      var quer = this.config.query;


        if (cat == "quotes") {
            url = 'https://www.stands4.com/services/v2/'+cat+'.php?uid='+id+'&tokenid='+tokid+'&searchtype='+type+'&query='+quer+'&format=json';
        }

        // else if (cat == "poetry") {
        //   url = 'https://www.stands4.com/services/v2/'+cat+'.php?uid='+id+'&tokenid='+tokid+'&term=love&format=json';
        //   console.log()
        // }  


        // url = 'https://www.stands4.com/services/v2/quotes.php?uid='+this.config.uid+'&tokenid='+this.config.tokenid+'&searchtype='+this.config.searchtype+'&query='+this.config.query+'&format=json'

        return url;
    },





    getConfucius: function() {
        this.sendSocketNotification('GET_CONFUCIUS', this.url); // this sends appropriate url back to the node_helper
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "CONFUCIUS_RESULT") {
            this.processConfucius(payload);
            if (this.rotateInterval == null) {
                this.scheduleCarousel();
            }
            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});
