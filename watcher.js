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

  self.setMutationEventListener = function(insertFn, removeFn) {
    self.using = "MutationEvent";
    var mutation = {
      type: "",
      addedNode: null,
      target: null,
      previousSibling: null,
      nextSibling: null,
      attributeName: null,
      attributeNamespace: null,
      oldValue: null,
    };

    document.addEventListener('DOMNodeInserted', function(ev) {
      mutation.type = 'childList';
      mutation.addedNode = ev.target;
      mutation.target = ev.relatedNode;
      self.log('Event listener for DOMNodeInserted - mutation:', mutation);
      self.log('Event listener for DOMNodeInserted - event:', ev);
      self.config.onInsert(mutation);
    }, false);

    document.addEventListener('DOMNodeRemoved', function(ev) {
      mutation.type = 'childList';
      mutation.removedNodes = ev.target;
      mutation.target = ev.relatedNode;
      self.log('Event listener for DOMNodeRemoved - mutation:', mutation);
      self.log('Event listener for DOMNodeRemoved - event:', ev);
      self.config.onRemove(mutation);
    }, false);

    document.addEventListener('DOMAttrModified', function(ev) {
      mutation.type = 'attribute';
      mutation.target = ev.target;
      mutation.attributeName = ev.attrName;
      mutation.attributeNamespace = ev.relatedNode;
      mutation.oldValue = ev.prevValue;
      self.log('Event listener for DOMAttrModified - mutation:', mutation);
      self.log('Event listener for DOMAttrModified - event:', ev);
      self.config.onAlter(mutation);
    }, false);

    document.addEventListener('DOMAttributeNameChanged', function(ev) {
      mutation.type = 'attribute';
      mutation.target = ev.target;
      mutation.attributeName = ev.attrName;
      mutation.attributeNamespace = ev.relatedNode;
      mutation.oldValue = ev.prevValue;
      self.log('Event listener for DOMAttributeNameChanged - mutation:', mutation);
      self.log('Event listener for DOMAttributeNameChanged - event:', ev);
      self.config.onAlter(mutation);
    }, false);

    document.addEventListener('DOMCharacterDataModified', function(ev) {
      mutation.type = 'characterData';
      mutation.target = ev.target;
      mutation.oldValue = ev.prevValue;
      self.log('Event listener for DOMCharacterDataModified - mutation:', mutation);
      self.log('Event listener for DOMCharacterDataModified - event:', ev);
      self.config.onAlter(mutation);
    }, false);

    document.addEventListener('DOMNodeInsertedIntoDocument', function(ev) {
      mutation.type = 'childList';
      mutation.target = ev.relatedNode;
      mutation.addedNodes = ev.target;
      self.log('Event listener for DOMNodeInsertedIntoDocument - mutation:', mutation);
      self.log('Event listener for DOMNodeInsertedIntoDocument - event:', ev);
      self.config.onInsert(mutation);
    }, false);

    document.addEventListener('DOMNodeRemovedFromDocument', function(ev) {
      mutation.type = 'childList';
      mutation.target = ev.relatedNode;
      mutation.removedNodes = ev.target;
      self.log('Event listener for DOMNodeRemovedFromDocument - mutation:', mutation);
      self.log('Event listener for DOMNodeRemovedFromDocument - event:', ev);
      self.config.onRemove(mutation);
    }, false);

    document.addEventListener('DOMSubtreeModified', function(ev) {
      mutation.type = 'childList';
      mutation.target = ev.target;
      self.log('Event listener for DOMSubtreeModified - mutation:', mutation);
      self.log('Event listener for DOMSubtreeModified - event:', ev);
      self.config.onAlter(mutation);
    }, false);
  };

  self.setIntervalWatcher = function(intervalFn, intervalPeriod) {
    self.interval = setInterval(intervalFn, intervalPeriod);
  };

  self.clearIntervalWatcher = function() {
    clearInterval(self.interval);
    self.interval = false;
  };
  
  self.disconnect= function() {
    switch(self.watching) {
      case "MutationObserver":
        self.log('disconnecting MutationObserver.');
        observer.disconnect();
        break;
    }
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
