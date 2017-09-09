/**
 * few methods to do dom operation
 */
;(function(factory){
    window.dom = factory();
})(function(){
    
    if(typeof Array.prototype.indexOf !== "function") {
        Array.prototype.indexOf = function(item) {
            for(var i = 0; i < this.length; i++) {
                if (this[i] === item) {
                    return i;
                }
            }
            return -1;
        };
    }

    function Dome(els) {
        for(var i = 0; i < els.length; i++ ) {
            this[i] = els[i];
        }
        this.length = els.length;
    }

    window.dom = dom;
    
    var dom = { 
        get:function(selector) {
            var els;

            if (typeof selector === "string") {
                els = document.querySelectorAll(selector);
            } else if (selector.length) {
                els = selector;
            } else {
                els = [selector];
            }
            return new Dome(els);
        },

        create: function(tagName, attrs) {
            var el = new Dome([document.createElement(tagName)]);
                if (attrs) {
                    if (attrs.className) {
                        el.addClass(attrs.className);
                        delete attrs.className;
                    }
                if (attrs.text) {
                    el.text(attrs.text);
                    delete attrs.text;
                }
                for (var key in attrs) {
                    if (attrs.hasOwnProperty(key)) {
                        el.attr(key, attrs[key]);
                    }
                }
            }
            return el;
        }
    };

    Dome.prototype.map = function(callback) {
        var results = [], i = 0;
        for ( ; i < this.length; i++) {
            results.push(callback.call(this, this[i], i));
        }
        return results;
    };

    Dome.prototype.mapOne = function (callback) {
        var m = this.map(callback);
        return m.length > 1 ? m : m[0];
    };

    Dome.prototype.forEach = function(callback) {
        this.map(callback);
        return this;
    };

    Dome.prototype.text = function(text) {
        if (typeof text !== "undefined") {
            return this.forEach(function(el) {
                el.innerText = text;
            });
        } else {
            return this.mapOne(function(el) {
                return el.innerText;
            });
        }
    };

    Dome.prototype.value = function(value) {
    	if (typeof value !== "undefined") {
            return this.forEach(function(el) {
                el.value = value;
            });
        } else {
            return this.mapOne(function(el) {
                return el.value;
            });
        }
    };

    Dome.prototype.html = function(html) {
        if (typeof html !== "undefined") {
            this.forEach(function(el) {
                el.innerHTML = html;
            });
            return this;
        } else {
            return this.mapOne(function(el) {
                return el.innerHTML;
            });
        }
    };

    Dome.prototype.addClass = function(classes) {
        var className = "";
        if (typeof classes !== "string") {
            for (var i = 0; i < classes.length; i++) {
                className += " " + classes[i];
            }
        } else {
            className = " " + classes;
        }
        return this.forEach(function(el) {
            el.className += className;
        });
    };

    Dome.prototype.hasClass = function(cls) {
        var i,
        classes = this[0].className.split(" ");
        cls = cls.trim();
        for(i = 0; i < classes.length; i++) {
            if(classes[i] == cls) {
                return true;
            }
        }
        return false;
        
    };

    Dome.prototype.removeClass = function(clazz) {
        return this.forEach(function(el) {
            var cs = el.className.split(" "), i;
    
            while ( (i = cs.indexOf(clazz)) > -1) { 
                cs = cs.slice(0, i).concat(cs.slice(++i));
            }
            el.className = cs.join(" ");
        }); 
    };

    Dome.prototype.attr = function(attr, val) {
        if (typeof val !== "undefined") {
            if(typeof attr === "object") {
                this.forEach(function(val, attr){
                    el.setAttribute(attr, val);    
                });
            } else {
                return this.forEach(function(el) {
                    el.setAttribute(attr, val);
                });
            }
        } else {
            return this.mapOne(function(el) {
                return el.getAttribute(attr);
            });
        }
    };

    Dome.prototype.append = function(els) {
        return this.forEach(function(parEl, i) {
            var _refParent;
            els.forEach(function(childEl) {
                if (i > 0) {
                    childEl = childEl.cloneNode(true); 
                }
                
                parEl.appendChild(childEl);
            }); 
        }); 
    };

    Dome.prototype.on = (function() {
        if (document.addEventListener) {
            return function(evt, fn) {
                return this.forEach(function(el) {
                    el.addEventListener(evt, fn, false);
                });
            };
        } else if (document.attachEvent)  {
            return function(evt, fn) {
                return this.forEach(function(el) {
                    el.attachEvent("on" + evt, fn);
                });
            };
        } else {
            return function(evt, fn) {
                return this.forEach(function(el) {
                    el["on" + evt] = fn;
                });
            };
        }
    }());

    Dome.prototype.off = (function() {
        if (document.removeEventListener) {
            return function(evt, fn) {
                return this.forEach(function(el) {
                    el.removeEventListener(evt, fn, false);
                });
            };
        } else if (document.detachEvent)  {
            return function(evt, fn) {
                return this.forEach(function(el) {
                    el.detachEvent("on" + evt, fn);
                });
            };
        } else {
            return function(evt, fn) {
                return this.forEach(function(el) {
                    el["on" + evt] = null;
                });
            };
        }
    }());   

    return dom;
});

/*===========*/

(function(factory){
    window.AutoComplete = factory();
})(function(){

	function Auto(container, data) {
		this.userdata = data;
		this.container = container;
		this.dataFilter = data.dataSource.property || null;
		this.resultList = _creatList(dom.get(data.suggetionArea));
		this.init();
		this.bind("keyup");
		this.bind("focus");
		this.bind("focusout");
	}

	window.AutoComplete = _auto;

	var _auto = {
		init : function(obj) {
				return  new Auto(_ele, obj);
		}
	};

	var proto = Auto.prototype;
	

	proto.init = function(){
		var _ele,
			_i,
			that = this;

		that.container.addClass("auto");
		_i = dom.create("i");
		_i.addClass("dropdown");
		_i.on("click", function(){
			//dom.get(that.resultList).addClass("show");
			//_search.call(that);
		});

		dom.get(this.container[0].parentNode).append(_i);
	};

	proto.bind = function(eveType) {
		this.container.on(eveType, this[eveType].bind(this));
	};

	// Events
	proto.focus = function(eve){
		dom.get(this.resultList).addClass("show");
		_search.call(this, eve.target.value);
	};

	proto.focusout = function() {
		var that = this;
		this.blurTimeoutId = setTimeout(function () {
            dom.get(that.resultList).removeClass("show");
        }, 200);	
	};

	proto.keyup = function(eve) {
		//console.log(eve.target.value);
		var value = eve.target.value,
			data;
	
		data = _search.call(this, eve.target.value);
	};


	/*========*/
	//private methods
	
	//TODO - optimize searching techninque
	var _search = function(word) {
		word = word || "";
		var reg = new RegExp('^'+word +'|'+ word +'|'+word+'$', 'ig'),
			key,
			data,
			collections = [],
			dataSource = this.getDataSource();

		for(var k=0; k<dataSource.length; k++) {
			key = dataSource[k];
			
			if(this.dataFilter)
				data = key[this.dataFilter].match(reg);
			else		
				data = key.match(reg);

			if(data && typeof data !== "undefined" && collections.indexOf(key) === -1) {
				collections.push(key);
			}
		}
		this.populateResult(collections);
		return collections;
	};

	var _creatList = function(area) {
		var ul = dom.create("ul");
		ul.addClass("suggestion-list");
		area.append(ul);
		return ul;
	};

	var _selectResult = function(eve) {
		clearTimeout(this.blurTimeoutId);
		var value = eve.target && eve.target.innerText;
		this.container.attr("value", value).value(value);
		dom.get(this.resultList).removeClass("show");

		var dataSource = this.getDataSource(),
			_data;
		if(this.dataFilter){
			for(var i=0; i<dataSource.length; i++) {
				_data = dataSource[i];
				if( _data[this.dataFilter] == value) {
					break;
				}
			}
		} else {
			_data = value;
		}
		
		this.userdata.events.onselect.apply(this, [_data, this.dataFilter]);	
	};

	proto.populateResult = function(data) {
		var li;
		//clear all results
		this.resultList.html("");
		if(data && data.length > 0) {
			for(var i=0; i<data.length; i++) {
				li = dom.create("li");
				if(this.dataFilter)
					li.html(data[i][this.dataFilter]);
				else	
					li.html(data[i]);

				li.addClass("auto auto-li");
				this.resultList.append(li);
				li.on("click", _selectResult.bind(this));
			}

		} else {
			li = dom.create("li")
					.html("No match found");
			this.resultList.append(li);
		}
	};

	proto.getDataSource = function() {
		var dataSource = this.userdata.dataSource;
		if(dataSource.length && dataSource.length > 0 ){
			return this.userdata.dataSource;
		} else {
			return dataSource.data;
		}
		
	};
	proto.setDataSource = function(newData) {
		this.userdata.dataSource = newData;
	};



	return _auto;
});
