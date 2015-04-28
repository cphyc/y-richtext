(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var YList;

YList = (function() {
  function YList(list) {
    if (list == null) {
      this._list = [];
    } else if (list.constructor === Array) {
      this._list = list;
    } else {
      throw new Error("Y.List expects an Array as a parameter");
    }
  }

  YList.prototype._name = "List";

  YList.prototype._getModel = function(types, ops) {
    if (this._model == null) {
      this._model = new ops.ListManager(this).execute();
      this._model.insert(0, this._list);
    }
    delete this._list;
    return this._model;
  };

  YList.prototype._setModel = function(_model) {
    this._model = _model;
    return delete this._list;
  };

  YList.prototype.val = function() {
    return this._model.val.apply(this._model, arguments);
  };

  YList.prototype.ref = function() {
    return this._model.ref.apply(this._model, arguments);
  };

  YList.prototype.observe = function() {
    this._model.observe.apply(this._model, arguments);
    return this;
  };

  YList.prototype.unobserve = function() {
    this._model.unobserve.apply(this._model, arguments);
    return this;
  };

  YList.prototype.insert = function(position, content) {
    if (typeof position !== "number") {
      throw new Error("Y.List.insert expects a Number as the first parameter!");
    }
    this._model.insert(position, [content]);
    return this;
  };

  YList.prototype.insertContents = function(position, contents) {
    if (typeof position !== "number") {
      throw new Error("Y.List.insert expects a Number as the first parameter!");
    }
    this._model.insert(position, contents);
    return this;
  };

  YList.prototype["delete"] = function(position, length) {
    this._model["delete"](position, length);
    return this;
  };

  YList.prototype.push = function(content) {
    this._model.push(content);
    return this;
  };

  return YList;

})();

if (typeof window !== "undefined" && window !== null) {
  if (window.Y != null) {
    window.Y.List = YList;
  } else {
    throw new Error("You must first import Y!");
  }
}

if (typeof module !== "undefined" && module !== null) {
  module.exports = YList;
}


},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Rtb25hZC9naXQveS1saXN0L25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL2Rtb25hZC9naXQveS1saXN0L2xpYi95LWxpc3QuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQSxLQUFBOztBQUFBO0FBTWUsRUFBQSxlQUFDLElBQUQsR0FBQTtBQUNYLElBQUEsSUFBTyxZQUFQO0FBQ0UsTUFBQSxJQUFDLENBQUEsS0FBRCxHQUFTLEVBQVQsQ0FERjtLQUFBLE1BRUssSUFBRyxJQUFJLENBQUMsV0FBTCxLQUFvQixLQUF2QjtBQUNILE1BQUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFULENBREc7S0FBQSxNQUFBO0FBR0gsWUFBVSxJQUFBLEtBQUEsQ0FBTSx3Q0FBTixDQUFWLENBSEc7S0FITTtFQUFBLENBQWI7O0FBQUEsa0JBUUEsS0FBQSxHQUFPLE1BUlAsQ0FBQTs7QUFBQSxrQkFVQSxTQUFBLEdBQVcsU0FBQyxLQUFELEVBQVEsR0FBUixHQUFBO0FBQ1QsSUFBQSxJQUFPLG1CQUFQO0FBQ0UsTUFBQSxJQUFDLENBQUEsTUFBRCxHQUFjLElBQUEsR0FBRyxDQUFDLFdBQUosQ0FBZ0IsSUFBaEIsQ0FBa0IsQ0FBQyxPQUFuQixDQUFBLENBQWQsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLENBQWUsQ0FBZixFQUFrQixJQUFDLENBQUEsS0FBbkIsQ0FEQSxDQURGO0tBQUE7QUFBQSxJQUdBLE1BQUEsQ0FBQSxJQUFRLENBQUEsS0FIUixDQUFBO1dBSUEsSUFBQyxDQUFBLE9BTFE7RUFBQSxDQVZYLENBQUE7O0FBQUEsa0JBaUJBLFNBQUEsR0FBVyxTQUFFLE1BQUYsR0FBQTtBQUNULElBRFUsSUFBQyxDQUFBLFNBQUEsTUFDWCxDQUFBO1dBQUEsTUFBQSxDQUFBLElBQVEsQ0FBQSxNQURDO0VBQUEsQ0FqQlgsQ0FBQTs7QUFBQSxrQkFvQkEsR0FBQSxHQUFLLFNBQUEsR0FBQTtXQUNILElBQUMsQ0FBQSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQVosQ0FBa0IsSUFBQyxDQUFBLE1BQW5CLEVBQTJCLFNBQTNCLEVBREc7RUFBQSxDQXBCTCxDQUFBOztBQUFBLGtCQXVCQSxHQUFBLEdBQUssU0FBQSxHQUFBO1dBQ0gsSUFBQyxDQUFBLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBWixDQUFrQixJQUFDLENBQUEsTUFBbkIsRUFBMkIsU0FBM0IsRUFERztFQUFBLENBdkJMLENBQUE7O0FBQUEsa0JBMkJBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxJQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQWhCLENBQXNCLElBQUMsQ0FBQSxNQUF2QixFQUErQixTQUEvQixDQUFBLENBQUE7V0FDQSxLQUZPO0VBQUEsQ0EzQlQsQ0FBQTs7QUFBQSxrQkErQkEsU0FBQSxHQUFXLFNBQUEsR0FBQTtBQUNULElBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBbEIsQ0FBd0IsSUFBQyxDQUFBLE1BQXpCLEVBQWlDLFNBQWpDLENBQUEsQ0FBQTtXQUNBLEtBRlM7RUFBQSxDQS9CWCxDQUFBOztBQUFBLGtCQXdDQSxNQUFBLEdBQVEsU0FBQyxRQUFELEVBQVcsT0FBWCxHQUFBO0FBQ04sSUFBQSxJQUFHLE1BQUEsQ0FBQSxRQUFBLEtBQXFCLFFBQXhCO0FBQ0UsWUFBVSxJQUFBLEtBQUEsQ0FBTSx3REFBTixDQUFWLENBREY7S0FBQTtBQUFBLElBRUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLENBQWUsUUFBZixFQUF5QixDQUFDLE9BQUQsQ0FBekIsQ0FGQSxDQUFBO1dBR0EsS0FKTTtFQUFBLENBeENSLENBQUE7O0FBQUEsa0JBOENBLGNBQUEsR0FBZ0IsU0FBQyxRQUFELEVBQVcsUUFBWCxHQUFBO0FBQ2QsSUFBQSxJQUFHLE1BQUEsQ0FBQSxRQUFBLEtBQXFCLFFBQXhCO0FBQ0UsWUFBVSxJQUFBLEtBQUEsQ0FBTSx3REFBTixDQUFWLENBREY7S0FBQTtBQUFBLElBRUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLENBQWUsUUFBZixFQUF5QixRQUF6QixDQUZBLENBQUE7V0FHQSxLQUpjO0VBQUEsQ0E5Q2hCLENBQUE7O0FBQUEsa0JBb0RBLFNBQUEsR0FBUSxTQUFDLFFBQUQsRUFBVyxNQUFYLEdBQUE7QUFDTixJQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBRCxDQUFQLENBQWUsUUFBZixFQUF5QixNQUF6QixDQUFBLENBQUE7V0FDQSxLQUZNO0VBQUEsQ0FwRFIsQ0FBQTs7QUFBQSxrQkF3REEsSUFBQSxHQUFNLFNBQUMsT0FBRCxHQUFBO0FBQ0osSUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsQ0FBYSxPQUFiLENBQUEsQ0FBQTtXQUNBLEtBRkk7RUFBQSxDQXhETixDQUFBOztlQUFBOztJQU5GLENBQUE7O0FBa0VBLElBQUcsZ0RBQUg7QUFDRSxFQUFBLElBQUcsZ0JBQUg7QUFDRSxJQUFBLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBVCxHQUFnQixLQUFoQixDQURGO0dBQUEsTUFBQTtBQUdFLFVBQVUsSUFBQSxLQUFBLENBQU0sMEJBQU4sQ0FBVixDQUhGO0dBREY7Q0FsRUE7O0FBd0VBLElBQUcsZ0RBQUg7QUFDRSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLEtBQWpCLENBREY7Q0F4RUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2xhc3MgWUxpc3RcblxuICAjXG4gICMgQHByaXZhdGVcbiAgIyBAcGFyYW0ge09iamVjdH0gdWlkIEEgdW5pcXVlIGlkZW50aWZpZXIuIElmIHVpZCBpcyB1bmRlZmluZWQsIGEgbmV3IHVpZCB3aWxsIGJlIGNyZWF0ZWQuXG4gICNcbiAgY29uc3RydWN0b3I6IChsaXN0KS0+XG4gICAgaWYgbm90IGxpc3Q/XG4gICAgICBAX2xpc3QgPSBbXVxuICAgIGVsc2UgaWYgbGlzdC5jb25zdHJ1Y3RvciBpcyBBcnJheVxuICAgICAgQF9saXN0ID0gbGlzdFxuICAgIGVsc2VcbiAgICAgIHRocm93IG5ldyBFcnJvciBcIlkuTGlzdCBleHBlY3RzIGFuIEFycmF5IGFzIGEgcGFyYW1ldGVyXCJcblxuICBfbmFtZTogXCJMaXN0XCJcblxuICBfZ2V0TW9kZWw6ICh0eXBlcywgb3BzKS0+XG4gICAgaWYgbm90IEBfbW9kZWw/XG4gICAgICBAX21vZGVsID0gbmV3IG9wcy5MaXN0TWFuYWdlcihAKS5leGVjdXRlKClcbiAgICAgIEBfbW9kZWwuaW5zZXJ0IDAsIEBfbGlzdFxuICAgIGRlbGV0ZSBAX2xpc3RcbiAgICBAX21vZGVsXG5cbiAgX3NldE1vZGVsOiAoQF9tb2RlbCktPlxuICAgIGRlbGV0ZSBAX2xpc3RcblxuICB2YWw6ICgpLT5cbiAgICBAX21vZGVsLnZhbC5hcHBseSBAX21vZGVsLCBhcmd1bWVudHNcblxuICByZWY6ICgpLT5cbiAgICBAX21vZGVsLnJlZi5hcHBseSBAX21vZGVsLCBhcmd1bWVudHNcblxuXG4gIG9ic2VydmU6ICgpLT5cbiAgICBAX21vZGVsLm9ic2VydmUuYXBwbHkgQF9tb2RlbCwgYXJndW1lbnRzXG4gICAgQFxuXG4gIHVub2JzZXJ2ZTogKCktPlxuICAgIEBfbW9kZWwudW5vYnNlcnZlLmFwcGx5IEBfbW9kZWwsIGFyZ3VtZW50c1xuICAgIEBcblxuICAjXG4gICMgSW5zZXJ0cyBhbiBPYmplY3QgaW50byB0aGUgbGlzdC5cbiAgI1xuICAjIEByZXR1cm4ge0xpc3RNYW5hZ2VyIFR5cGV9IFRoaXMgU3RyaW5nIG9iamVjdC5cbiAgI1xuICBpbnNlcnQ6IChwb3NpdGlvbiwgY29udGVudCktPlxuICAgIGlmIHR5cGVvZiBwb3NpdGlvbiBpc250IFwibnVtYmVyXCJcbiAgICAgIHRocm93IG5ldyBFcnJvciBcIlkuTGlzdC5pbnNlcnQgZXhwZWN0cyBhIE51bWJlciBhcyB0aGUgZmlyc3QgcGFyYW1ldGVyIVwiXG4gICAgQF9tb2RlbC5pbnNlcnQgcG9zaXRpb24sIFtjb250ZW50XVxuICAgIEBcblxuICBpbnNlcnRDb250ZW50czogKHBvc2l0aW9uLCBjb250ZW50cyktPlxuICAgIGlmIHR5cGVvZiBwb3NpdGlvbiBpc250IFwibnVtYmVyXCJcbiAgICAgIHRocm93IG5ldyBFcnJvciBcIlkuTGlzdC5pbnNlcnQgZXhwZWN0cyBhIE51bWJlciBhcyB0aGUgZmlyc3QgcGFyYW1ldGVyIVwiXG4gICAgQF9tb2RlbC5pbnNlcnQgcG9zaXRpb24sIGNvbnRlbnRzXG4gICAgQFxuXG4gIGRlbGV0ZTogKHBvc2l0aW9uLCBsZW5ndGgpLT5cbiAgICBAX21vZGVsLmRlbGV0ZSBwb3NpdGlvbiwgbGVuZ3RoXG4gICAgQFxuXG4gIHB1c2g6IChjb250ZW50KS0+XG4gICAgQF9tb2RlbC5wdXNoIGNvbnRlbnRcbiAgICBAXG5cbmlmIHdpbmRvdz9cbiAgaWYgd2luZG93Llk/XG4gICAgd2luZG93LlkuTGlzdCA9IFlMaXN0XG4gIGVsc2VcbiAgICB0aHJvdyBuZXcgRXJyb3IgXCJZb3UgbXVzdCBmaXJzdCBpbXBvcnQgWSFcIlxuXG5pZiBtb2R1bGU/XG4gIG1vZHVsZS5leHBvcnRzID0gWUxpc3RcblxuXG5cblxuXG5cblxuXG5cblxuIl19
