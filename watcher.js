var Watcher = (function(self) { return self; }(Watcher || {}));

Watcher = function(self) {
  self.config = {
    showLogs: false,
    onInsert: function(){},
    onRemove: function(){},
    onAlter: function(){},
    intervalWatcher: function(){},
    intervalPeriod: 3000,
    observerConfig: {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true,
    },
  };

  self.using = "";
  self.interval = null;
  self.observer = null;

  self.init = function(config) {
    self.mergeConfig(config);

    if (typeof MutationObserver === 'function' || typeof MutationObserver === 'object') {
      self.setMutationObserver();
    } else {
      self.setMutationEventListener(self.config.onInsert, self.config.onRemove);
      var chatElements = document.querySelectorAll('.enable-chat');
      if (chatElements) {
        for (var i = 0; i < chatElements.length; i++) {
          var element = chatElements[i];
          element.classList.add('chat-enabled');
          element.classList.remove('enable-chat');
        }
      }
    } /*else {
      self.using = "Interval";
      self.setIntervalWatcher(self.config.intervalWatcher, self.config.intervalPeriod);
    }*/
  }

  self.setMutationObserver = function() {
    self.using = "MutationObserver";
    self.observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        self.log(mutation.type, mutation);

        switch(mutation.type) {
          case "childList":
            if (mutation.addedNodes.length > 0) {
              self.log('running onInsert function (observer)');
              self.config.onInsert(mutation);
            }
            if (mutation.removedNodes.length > 0) {
              self.log('running onRemove function (observer)');
              self.config.onRemove(mutation);
            }
            break;
          case "attributes":
          case "characterData":
            self.log('running onAlter function (observer)');
            self.config.onAlter(mutation);
            break;
          default:
            self.log('uncaught mutation event (observer):', mutation);
        };
      });
    });
    self.observer.observe(document, self.config.observerConfig);
  };
  
  self.disconnectMutationObserver = function() {
    observer.disconnect();
  };

  self.setMutationEventListener = function(insertFn, removeFn) {
    self.using = "MutationEvent";
    document.addEventListener("DOMNodeInserted", function(ev) {
      insertFn(ev);
    }, false);
    document.addEventListener("DOMNodeRemoved", function(ev) {
      removeFn(ev);
    }, false);
  };

  self.setIntervalWatcher = function(intervalFn, intervalPeriod) {
    self.interval = setInterval(intervalFn, intervalPeriod);
  };

  self.clearIntervalWatcher = function() {
    clearInterval(self.interval);
    self.interval = false;
  };

  self.log = function(message, object) {
    if (self.config.showLogs) {
      console.log(message, object);
    }
  };

  self.talk = function() {
    console.log('config:', self.config);
    console.log('using:', self.using);
    console.log('observer:', self.observer);
    console.log('interval:', self.interval);
  };

  self.mergeConfig = function(a) {
    var c = {};
    
    iterateAndAssign(self.config, c);
    iterateAndAssign(a, c);

    function iterateAndAssign(x, y) {
      Object.keys(x).forEach(function(z) {
        y[z] = x[z];
      });
    }

    self.config = c;
  };

  return self;
}(Watcher || {});
