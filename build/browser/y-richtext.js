(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var AbstractEditor, QuillJs, TestEditor, misc,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

misc = require("./misc.coffee");

AbstractEditor = (function() {
  function AbstractEditor(editor) {
    this.editor = editor;
    this.locker = new misc.Locker();
  }

  AbstractEditor.prototype.getContents = function() {
    throw new Error("Implement me");
  };

  AbstractEditor.prototype.getCursor = function() {
    throw new Error("Implement me");
  };

  AbstractEditor.prototype.setCursor = function(param) {
    throw new Error("Implement me");
  };

  AbstractEditor.prototype.removeCursor = function() {
    throw new Error("Implement me");
  };

  AbstractEditor.prototype.removeCursor = function(id) {
    throw new Error("Implement me");
  };

  AbstractEditor.prototype.observeLocalText = function(backend) {
    throw new Error("Implement me");
  };

  AbstractEditor.prototype.observeLocalCursor = function(backend) {
    throw new Error("Implement me");
  };

  AbstractEditor.prototype.updateContents = function(delta) {
    throw new Error("Implement me");
  };

  AbstractEditor.prototype.setContents = function(delta) {
    throw new Error("Implement me");
  };

  AbstractEditor.prototype.getEditor = function() {
    throw new Error("Implement me");
  };

  AbstractEditor.prototype.checkUpdate = function() {
    throw new Error("Implement me");
  };

  return AbstractEditor;

})();

QuillJs = (function(_super) {
  __extends(QuillJs, _super);

  function QuillJs(editor) {
    this.editor = editor;
    QuillJs.__super__.constructor.call(this, this.editor);
    this._cursors = this.editor.getModule("multi-cursor");
  }

  QuillJs.prototype.getLength = function() {
    return this.editor.getLength();
  };

  QuillJs.prototype.getCursorPosition = function() {
    var selection;
    selection = this.editor.getSelection();
    if (selection) {
      return selection.start;
    } else {
      return 0;
    }
  };

  QuillJs.prototype.getContents = function() {
    return this.editor.getContents().ops;
  };

  QuillJs.prototype.setCursor = function(param) {
    return this.locker["try"]((function(_this) {
      return function() {
        var cursor, fun, len;
        cursor = _this._cursors.cursors[param.id];
        if ((cursor != null) && cursor.color === param.color) {
          fun = function(index) {
            return _this._cursors.moveCursor(param.id, index);
          };
        } else {
          if ((cursor != null) && (cursor.color != null) && cursor.color !== param.color) {
            _this.removeCursor(param.id);
          }
          fun = function(index) {
            return _this._cursors.setCursor(param.id, index, param.text, param.color);
          };
        }
        len = _this.editor.getLength();
        if (param.index > len) {
          param.index = len;
        }
        if (param.index != null) {
          return fun(param.index);
        }
      };
    })(this));
  };

  QuillJs.prototype.removeCursor = function(id) {
    return this._cursors.removeCursor(id);
  };

  QuillJs.prototype.removeCursor = function(id) {
    return this._cursors.removeCursor(id);
  };

  QuillJs.prototype.observeLocalText = function(backend) {
    return this.editor.on("text-change", function(deltas, source) {
      var position;
      position = backend(deltas);
      return this.editor.selection.emitter.emit(this.editor.selection.emitter.constructor.events.SELECTION_CHANGE, this.editor.quill.getSelection(), "user");
    });
  };

  QuillJs.prototype.observeLocalCursor = function(backend) {
    return this.editor.on("selection-change", function(range, source) {
      if (range && range.start === range.end) {
        return backend(range.start);
      }
    });
  };

  QuillJs.prototype.updateContents = function(delta) {
    return this.editor.updateContents(delta);
  };

  QuillJs.prototype.setContents = function(delta) {
    return this.editor.setContents(delta);
  };

  QuillJs.prototype.getEditor = function() {
    return this.editor;
  };

  QuillJs.prototype.checkUpdate = function() {
    return this.editor.editor.checkUpdate();
  };

  return QuillJs;

})(AbstractEditor);

TestEditor = (function(_super) {
  __extends(TestEditor, _super);

  function TestEditor(editor) {
    this.editor = editor;
    TestEditor.__super__.constructor.apply(this, arguments);
  }

  TestEditor.prototype.getLength = function() {
    return 0;
  };

  TestEditor.prototype.getCursorPosition = function() {
    return 0;
  };

  TestEditor.prototype.getContents = function() {
    return {
      ops: [
        {
          insert: "Well, this is a test!"
        }, {
          insert: "And I'm bold…",
          attributes: {
            bold: true
          }
        }
      ]
    };
  };

  TestEditor.prototype.setCursor = function() {
    return "";
  };

  TestEditor.prototype.observeLocalText = function(backend) {
    return "";
  };

  TestEditor.prototype.observeLocalCursor = function(backend) {
    return "";
  };

  TestEditor.prototype.updateContents = function(delta) {
    return "";
  };

  TestEditor.prototype.setContents = function(delta) {
    return "";
  };

  TestEditor.prototype.getEditor = function() {
    return this.editor;
  };

  return TestEditor;

})(AbstractEditor);

exports.QuillJs = QuillJs;

exports.TestEditor = TestEditor;

exports.AbstractEditor = AbstractEditor;


},{"./misc.coffee":2}],2:[function(require,module,exports){
var BaseClass, Locker;

Locker = (function() {
  function Locker() {
    this.is_locked = false;
  }

  Locker.prototype["try"] = function(fun) {
    var ret;
    if (this.is_locked) {
      return;
    }
    this.is_locked = true;
    ret = fun();
    this.is_locked = false;
    return ret;
  };

  return Locker;

})();

BaseClass = (function() {
  function BaseClass() {
    this._tmp_model = {};
  }

  BaseClass.prototype._get = function(prop) {
    if (this._model == null) {
      return this._tmp_model[prop];
    } else {
      return this._model.val(prop);
    }
  };

  BaseClass.prototype._set = function(prop, val) {
    if (this._model == null) {
      return this._tmp_model[prop] = val;
    } else {
      return this._model.val(prop, val);
    }
  };

  BaseClass.prototype._getModel = function(Y, Operation) {
    var key, value, _ref;
    if (this._model == null) {
      this._model = new Operation.MapManager(this).execute();
      _ref = this._tmp_model;
      for (key in _ref) {
        value = _ref[key];
        this._model.val(key, value);
      }
    }
    return this._model;
  };

  BaseClass.prototype._setModel = function(_model) {
    this._model = _model;
    return delete this._tmp_model;
  };

  return BaseClass;

})();

if (typeof module !== "undefined" && module !== null) {
  exports.BaseClass = BaseClass;
  exports.Locker = Locker;
}


},{}],3:[function(require,module,exports){
var BaseClass, Delta, Editors, Locker, YRichText, misc,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

misc = require("./misc.coffee");

BaseClass = misc.BaseClass;

Locker = misc.Locker;

Editors = require("./editors.coffee");

Delta = require('rich-text/lib/delta');

YRichText = (function(_super) {
  var deleteHelper, deltaHelper, insertHelper;

  __extends(YRichText, _super);

  function YRichText(editor_name, editor_instance) {
    this.updateCursorPosition = __bind(this.updateCursorPosition, this);
    this.passDeltas = __bind(this.passDeltas, this);
    this.locker = new Locker();
    if ((editor_name != null) && (editor_instance != null)) {
      this._bind_later = {
        name: editor_name,
        instance: editor_instance
      };
    }
    this.pendingDelta = new Delta();
    window.setInterval(this.applyUpdateContents.bind(this), 200);
  }

  YRichText.prototype.applyUpdateContents = function() {
    if ((this.editor != null) && this.pendingDelta.length() > 0) {
      return this.locker["try"]((function(_this) {
        return function() {
          _this.editor.updateContents(_this.pendingDelta);
          return _this.pendingDelta = new Delta();
        };
      })(this));
    }
  };

  YRichText.prototype.bind = function() {
    var Editor, editor_instance, editor_name;
    if (arguments[0] instanceof Editors.AbstractEditor) {
      this.editor = arguments[0];
    } else {
      editor_name = arguments[0], editor_instance = arguments[1];
      if ((this.editor != null) && this.editor.getEditor() === editor_instance) {
        return;
      }
      Editor = Editors[editor_name];
      if (Editor != null) {
        this.editor = new Editor(editor_instance);
      } else {
        throw new Error("This type of editor is not supported! (" + editor_name + ")");
      }
    }
    this.editor.setContents({
      ops: this.getDelta()
    });
    this.editor.observeLocalText(((function(_this) {
      return function(delta) {
        var transformedDelta;
        transformedDelta = _this.pendingDelta.transform(delta);
        _this.applyUpdateContents();
        return _this.passDeltas.call(_this.editor, transformedDelta);
      };
    })(this)).bind(this));
    this.bindEventsToEditor(this.editor);
    this.editor.observeLocalCursor(this.updateCursorPosition);
    return this._model.connector.receive_handlers.unshift((function(_this) {
      return function() {
        return _this.editor.checkUpdate();
      };
    })(this));
  };

  YRichText.prototype.observe = function(fun) {
    if (this._model != null) {
      return this._model.observe(fun);
    } else {
      return this._observeWhenModel = (this._observeWhenModel || []).push(fun);
    }
  };

  YRichText.prototype.attachProvider = function(kind, fun) {
    this._providers = this._providers || {};
    return this._providers[kind] = fun;
  };

  YRichText.prototype.getDelta = function() {
    var deltas, expected_pos, sel, selection_length, selections, text_content, unselected_insert_content, _i, _len, _ref;
    text_content = this._model.getContent('characters').val();
    expected_pos = 0;
    deltas = new Delta();
    selections = this._model.getContent("selections");
    _ref = selections.getSelections(this._model.getContent("characters"));
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      sel = _ref[_i];
      selection_length = sel.to - sel.from + 1;
      if (expected_pos !== sel.from) {
        unselected_insert_content = text_content.splice(0, sel.from - expected_pos).join('');
        deltas.insert(unselected_insert_content);
        expected_pos += unselected_insert_content.length;
      }
      if (expected_pos !== sel.from) {
        throw new Error("This portion of code must not be reached in getDelta!");
      }
      deltas.insert(text_content.splice(0, selection_length).join(''), sel.attrs);
      expected_pos += selection_length;
    }
    if (text_content.length > 0) {
      deltas.insert(text_content.join(''));
    }
    return deltas;
  };

  YRichText.prototype._getModel = function(Y, Operation) {
    var Editor, content_operations, editor;
    if (this._model == null) {
      content_operations = {
        selections: new Y.Selections(),
        characters: new Y.List(),
        cursors: new Y.Object()
      };
      this._model = new Operation.MapManager(this, null, {}, content_operations).execute();
      this._setModel(this._model);
      if (this._bind_later != null) {
        Editor = Editors[this._bind_later.name];
        if (Editor != null) {
          editor = new Editor(this._bind_later.instance);
        } else {
          throw new Error("This type of editor is not supported! (" + editor_name + ") -- fatal error!");
        }
        this.passDeltas({
          ops: editor.getContents()
        });
        this.bind(editor);
        delete this._bind_later;
      }
      this._model.observe(this.propagateToEditor);
      (this._observeWhenModel || []).forEach(function(observer) {
        return this._model.observe(observer);
      });
    }
    return this._model;
  };

  YRichText.prototype._setModel = function(model) {
    YRichText.__super__._setModel.apply(this, arguments);
    return (this._observeWhenModel || []).forEach(function(observer) {
      return this._model.observe(observer);
    });
  };

  YRichText.prototype._name = "RichText";

  YRichText.prototype.getText = function() {
    return this._model.getContent('characters').val().join('');
  };

  YRichText.prototype.setCursor = function(position) {
    this.selfCursor = this._model.getContent("characters").ref(position);
    return this._model.getContent("cursors").val(this._model.HB.getUserId(), this.selfCursor);
  };

  YRichText.prototype.passDeltas = function(deltas) {
    return this.locker["try"]((function(_this) {
      return function() {
        var delta, position, _i, _len, _ref, _results;
        position = 0;
        _ref = deltas.ops || [];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          delta = _ref[_i];
          _results.push(position = deltaHelper(_this, delta, position));
        }
        return _results;
      };
    })(this));
  };

  YRichText.prototype.updateCursorPosition = function(obj) {
    return this.locker["try"]((function(_this) {
      return function() {
        if (typeof obj === "number") {
          _this.selfCursor = _this._model.getContent("characters").ref(obj);
        } else {
          _this.selfCursor = obj;
        }
        return _this._model.getContent("cursors").val(_this._model.HB.getUserId(), _this.selfCursor);
      };
    })(this));
  };

  YRichText.prototype.bindEventsToEditor = function(editor) {
    this._model.getContent("characters").observe((function(_this) {
      return function(events) {
        return _this.locker["try"](function() {
          var cursor_name, cursor_ref, delta, event, _i, _j, _len, _len1, _ref;
          for (_i = 0, _len = events.length; _i < _len; _i++) {
            event = events[_i];
            delta = new Delta();
            if (event.position > 0) {
              delta.retain(event.position);
            }
            if (event.type === "insert") {
              delta.insert(event.value);
            } else if (event.type === "delete") {
              delta["delete"](1);
              _ref = _this._model.getContent("cursors").val();
              for (cursor_ref = _j = 0, _len1 = _ref.length; _j < _len1; cursor_ref = ++_j) {
                cursor_name = _ref[cursor_ref];
                if (cursor_ref === event.reference) {
                  window.setTimeout(function() {
                    return this._model.getContent("cursors")["delete"](cursor_name);
                  }, 0);
                }
              }
            } else {
              return;
            }
            _this.pendingDelta = _this.pendingDelta.compose(delta);
            _this.applyUpdateContents();
          }
        });
      };
    })(this));
    this._model.getContent("selections").observe((function(_this) {
      return function(event) {
        return _this.locker["try"](function() {
          var attr, attrs, retain, selection_length, val, _i, _len, _ref, _ref1;
          attrs = {};
          if (event.type === "select") {
            _ref = event.attrs;
            for (attr in _ref) {
              val = _ref[attr];
              attrs[attr] = val;
            }
          } else {
            _ref1 = event.attrs;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              attr = _ref1[_i];
              attrs[attr] = null;
            }
          }
          retain = event.from.getPosition();
          selection_length = event.to.getPosition() - event.from.getPosition() + 1;
          return _this.editor.updateContents(new Delta({
            ops: [
              {
                retain: retain
              }, {
                retain: selection_length,
                attributes: attrs
              }
            ]
          }));
        });
      };
    })(this));
    this._model.getContent("cursors").observe((function(_this) {
      return function(events) {
        return _this.locker["try"](function() {
          var author, event, params, position, ref_to_char, _i, _len, _ref, _ref1;
          for (_i = 0, _len = events.length; _i < _len; _i++) {
            event = events[_i];
            if (event.type === "update" || event.type === "add") {
              author = event.changedBy;
              ref_to_char = event.object.val(author);
              if (ref_to_char === null) {
                position = _this.editor.getLength();
              } else if (ref_to_char != null) {
                if (ref_to_char.isDeleted()) {
                  return;
                } else {
                  position = ref_to_char.getPosition();
                }
              } else {
                console.warn("ref_to_char is undefined");
                return;
              }
              params = {
                id: author,
                index: position,
                text: ((_ref = _this._providers) != null ? typeof _ref.nameProvider === "function" ? _ref.nameProvider(author) : void 0 : void 0) || "Default user",
                color: ((_ref1 = _this._providers) != null ? typeof _ref1.colorProvider === "function" ? _ref1.colorProvider(author) : void 0 : void 0) || "grey"
              };
              _this.editor.setCursor(params);
            } else {
              _this.editor.removeCursor(event.name);
            }
          }
        });
      };
    })(this));
    return this._model.connector.onUserEvent((function(_this) {
      return function(event) {
        if (event.action === "userLeft") {
          return _this._model.getContent("cursors")["delete"](event.user);
        }
      };
    })(this));
  };

  deltaHelper = function(thisObj, delta, position) {
    var content_array, delta_selections, delta_unselections, from, fromPosition, insert_content, n, retain, selections, to, toPosition, v, _ref;
    if (position == null) {
      position = 0;
    }
    if (delta != null) {
      selections = thisObj._model.getContent("selections");
      delta_unselections = [];
      delta_selections = {};
      _ref = delta.attributes;
      for (n in _ref) {
        v = _ref[n];
        if (v != null) {
          delta_selections[n] = v;
        } else {
          delta_unselections.push(n);
        }
      }
      if (delta.insert != null) {
        insert_content = delta.insert;
        content_array = (function() {
          if (typeof insert_content === "string") {
            return insert_content.split("");
          } else if (typeof insert_content === "number") {
            return [insert_content];
          } else {
            throw new Error("Got an unexpected value in delta.insert! (" + (typeof content) + ")");
          }
        })();
        insertHelper(thisObj, position, content_array);
        fromPosition = from;
        toPosition = position + content_array.length - 1;
        from = thisObj._model.getContent("characters").ref(position);
        to = thisObj._model.getContent("characters").ref(position + content_array.length - 1);
        thisObj._model.getContent("selections").unselect(from, to, delta_unselections);
        thisObj._model.getContent("selections").select(from, to, delta_selections, true);
        return position + content_array.length;
      } else if (delta["delete"] != null) {
        deleteHelper(thisObj, position, delta["delete"]);
        return position;
      } else if (delta.retain != null) {
        retain = parseInt(delta.retain);
        from = thisObj._model.getContent("characters").ref(position);
        to = thisObj._model.getContent("characters").ref(position + retain - 1);
        thisObj._model.getContent("selections").unselect(from, to, delta_unselections);
        thisObj._model.getContent("selections").select(from, to, delta_selections);
        return position + retain;
      }
      throw new Error("This part of code must not be reached!");
    }
  };

  insertHelper = function(thisObj, position, content_array) {
    return thisObj._model.getContent("characters").insertContents(position, content_array);
  };

  deleteHelper = function(thisObj, position, length) {
    if (length == null) {
      length = 1;
    }
    return thisObj._model.getContent("characters")["delete"](position, length);
  };

  return YRichText;

})(BaseClass);

if (typeof window !== "undefined" && window !== null) {
  if (window.Y != null) {
    window.Y.RichText = YRichText;
  } else {
    throw new Error("You must first import Y!");
  }
}

if (typeof module !== "undefined" && module !== null) {
  module.exports = YRichText;
}


},{"./editors.coffee":1,"./misc.coffee":2,"rich-text/lib/delta":4}],4:[function(require,module,exports){
var diff = require('fast-diff');
var is = require('./is');
var op = require('./op');


var NULL_CHARACTER = String.fromCharCode(0);  // Placeholder char for embed in diff()


var Delta = function (ops) {
  // Assume we are given a well formed ops
  if (is.array(ops)) {
    this.ops = ops;
  } else if (is.object(ops) && is.array(ops.ops)) {
    this.ops = ops.ops;
  } else {
    this.ops = [];
  }
};


Delta.prototype.insert = function (text, attributes) {
  var newOp = {};
  if (text.length === 0) return this;
  newOp.insert = text;
  if (is.object(attributes) && Object.keys(attributes).length > 0) newOp.attributes = attributes;
  return this.push(newOp);
};

Delta.prototype['delete'] = function (length) {
  if (length <= 0) return this;
  return this.push({ 'delete': length });
};

Delta.prototype.retain = function (length, attributes) {
  if (length <= 0) return this;
  var newOp = { retain: length };
  if (is.object(attributes) && Object.keys(attributes).length > 0) newOp.attributes = attributes;
  return this.push(newOp);
};

Delta.prototype.push = function (newOp) {
  var index = this.ops.length;
  var lastOp = this.ops[index - 1];
  newOp = op.clone(newOp);
  if (is.object(lastOp)) {
    if (is.number(newOp['delete']) && is.number(lastOp['delete'])) {
      this.ops[index - 1] = { 'delete': lastOp['delete'] + newOp['delete'] };
      return this;
    }
    // Since it does not matter if we insert before or after deleting at the same index,
    // always prefer to insert first
    if (is.number(lastOp['delete']) && newOp.insert != null) {
      index -= 1;
      lastOp = this.ops[index - 1];
      if (!is.object(lastOp)) {
        this.ops.unshift(newOp);
        return this;
      }
    }
    if (is.equal(newOp.attributes, lastOp.attributes)) {
      if (is.string(newOp.insert) && is.string(lastOp.insert)) {
        this.ops[index - 1] = { insert: lastOp.insert + newOp.insert };
        if (is.object(newOp.attributes)) this.ops[index - 1].attributes = newOp.attributes
        return this;
      } else if (is.number(newOp.retain) && is.number(lastOp.retain)) {
        this.ops[index - 1] = { retain: lastOp.retain + newOp.retain };
        if (is.object(newOp.attributes)) this.ops[index - 1].attributes = newOp.attributes
        return this;
      }
    }
  }
  if (index === this.ops.length) {
    this.ops.push(newOp);
  } else {
    this.ops.splice(index, 0, newOp);
  }
  return this;
};

Delta.prototype.chop = function () {
  var lastOp = this.ops[this.ops.length - 1];
  if (lastOp && lastOp.retain && !lastOp.attributes) {
    this.ops.pop();
  }
  return this;
};

Delta.prototype.length = function () {
  return this.ops.reduce(function (length, elem) {
    return length + op.length(elem);
  }, 0);
};

Delta.prototype.slice = function (start, end) {
  start = start || 0;
  if (!is.number(end)) end = Infinity;
  var delta = new Delta();
  var iter = op.iterator(this.ops);
  var index = 0;
  while (index < end && iter.hasNext()) {
    var nextOp;
    if (index < start) {
      nextOp = iter.next(start - index);
    } else {
      nextOp = iter.next(end - index);
      delta.push(nextOp);
    }
    index += op.length(nextOp);
  }
  return delta;
};


Delta.prototype.compose = function (other) {
  var thisIter = op.iterator(this.ops);
  var otherIter = op.iterator(other.ops);
  var delta = new Delta();
  while (thisIter.hasNext() || otherIter.hasNext()) {
    if (otherIter.peekType() === 'insert') {
      delta.push(otherIter.next());
    } else if (thisIter.peekType() === 'delete') {
      delta.push(thisIter.next());
    } else {
      var length = Math.min(thisIter.peekLength(), otherIter.peekLength());
      var thisOp = thisIter.next(length);
      var otherOp = otherIter.next(length);
      if (is.number(otherOp.retain)) {
        var newOp = {};
        if (is.number(thisOp.retain)) {
          newOp.retain = length;
        } else {
          newOp.insert = thisOp.insert;
        }
        // Preserve null when composing with a retain, otherwise remove it for inserts
        var attributes = op.attributes.compose(thisOp.attributes, otherOp.attributes, is.number(thisOp.retain));
        if (attributes) newOp.attributes = attributes;
        delta.push(newOp);
      // Other op should be delete, we could be an insert or retain
      // Insert + delete cancels out
      } else if (is.number(otherOp['delete']) && is.number(thisOp.retain)) {
        delta.push(otherOp);
      }
    }
  }
  return delta.chop();
};

Delta.prototype.diff = function (other) {
  var delta = new Delta();
  if (this.ops === other.ops) {
    return delta;
  }
  var strings = [this.ops, other.ops].map(function (ops) {
    return ops.map(function (op) {
      if (op.insert != null) {
        return is.string(op.insert) ? op.insert : NULL_CHARACTER;
      }
      var prep = (ops === other.ops) ? 'on' : 'with';
      throw new Error('diff() called ' + prep + ' non-document');
    }).join('');
  });
  var diffResult = diff(strings[0], strings[1]);
  var thisIter = op.iterator(this.ops);
  var otherIter = op.iterator(other.ops);
  diffResult.forEach(function (component) {
    var length = component[1].length;
    while (length > 0) {
      var opLength = 0;
      switch (component[0]) {
        case diff.INSERT:
          opLength = Math.min(otherIter.peekLength(), length);
          delta.push(otherIter.next(opLength));
          break;
        case diff.DELETE:
          opLength = Math.min(length, thisIter.peekLength());
          thisIter.next(opLength);
          delta['delete'](opLength);
          break;
        case diff.EQUAL:
          opLength = Math.min(thisIter.peekLength(), otherIter.peekLength(), length);
          var thisOp = thisIter.next(opLength);
          var otherOp = otherIter.next(opLength);
          if (is.equal(thisOp.insert, otherOp.insert)) {
            delta.retain(opLength, op.attributes.diff(thisOp.attributes, otherOp.attributes));
          } else {
            delta.push(otherOp)['delete'](opLength);
          }
          break;
      }
      length -= opLength;
    }
  });
  return delta.chop();
};

Delta.prototype.transform = function (other, priority) {
  priority = !!priority;
  if (is.number(other)) {
    return this.transformPosition(other, priority);
  }
  var thisIter = op.iterator(this.ops);
  var otherIter = op.iterator(other.ops);
  var delta = new Delta();
  while (thisIter.hasNext() || otherIter.hasNext()) {
    if (thisIter.peekType() === 'insert' && (priority || otherIter.peekType() !== 'insert')) {
      delta.retain(op.length(thisIter.next()));
    } else if (otherIter.peekType() === 'insert') {
      delta.push(otherIter.next());
    } else {
      var length = Math.min(thisIter.peekLength(), otherIter.peekLength());
      var thisOp = thisIter.next(length);
      var otherOp = otherIter.next(length);
      if (thisOp['delete']) {
        // Our delete either makes their delete redundant or removes their retain
        continue;
      } else if (otherOp['delete']) {
        delta.push(otherOp);
      } else {
        // We retain either their retain or insert
        delta.retain(length, op.attributes.transform(thisOp.attributes, otherOp.attributes, priority));
      }
    }
  }
  return delta.chop();
};

Delta.prototype.transformPosition = function (index, priority) {
  priority = !!priority;
  var thisIter = op.iterator(this.ops);
  var offset = 0;
  while (thisIter.hasNext() && offset <= index) {
    var length = thisIter.peekLength();
    var nextType = thisIter.peekType();
    thisIter.next();
    if (nextType === 'delete') {
      index -= Math.min(length, index - offset);
      continue;
    } else if (nextType === 'insert' && (offset < index || !priority)) {
      index += length;
    }
    offset += length;
  }
  return index;
};


module.exports = Delta;

},{"./is":5,"./op":6,"fast-diff":7}],5:[function(require,module,exports){
module.exports = {
  equal: function (a, b) {
    if (a === b) return true;
    if (a == null && b == null) return true;
    if (a == null || b == null) return false;
    if (!this.object(a) || !this.object(b)) return false;
    if (Object.keys(a).length != Object.keys(b).length) return false;
    for(var key in a) {
      // Only compare one level deep
      if (a[key] !== b[key]) return false;
    }
    return true;
  },

  array: function (value) {
    return Array.isArray(value);
  },

  number: function (value) {
    if (typeof value === 'number') return true;
    if (typeof value === 'object' && Object.prototype.toString.call(value) === '[object Number]') return true;
    return false;
  },

  object: function (value) {
    if (!value) return false;
    return (typeof value === 'function' || typeof value === 'object');
  },

  string: function (value) {
    if (typeof value === 'string') return true;
    if (typeof value === 'object' && Object.prototype.toString.call(value) === '[object String]') return true;
    return false;
  }
};

},{}],6:[function(require,module,exports){
var is = require('./is');


var lib = {
  attributes: {
    clone: function (attributes, keepNull) {
      if (!is.object(attributes)) return {};
      return Object.keys(attributes).reduce(function (memo, key) {
        if (attributes[key] !== undefined && (attributes[key] !== null || keepNull)) {
          memo[key] = attributes[key];
        }
        return memo;
      }, {});
    },

    compose: function (a, b, keepNull) {
      if (!is.object(a)) a = {};
      if (!is.object(b)) b = {};
      var attributes = this.clone(b, keepNull);
      for (var key in a) {
        if (a[key] !== undefined && b[key] === undefined) {
          attributes[key] = a[key];
        }
      }
      return Object.keys(attributes).length > 0 ? attributes : undefined;
    },

    diff: function(a, b) {
      if (!is.object(a)) a = {};
      if (!is.object(b)) b = {};
      var attributes = Object.keys(a).concat(Object.keys(b)).reduce(function (attributes, key) {
        if (a[key] !== b[key]) {
          attributes[key] = b[key] === undefined ? null : b[key];
        }
        return attributes;
      }, {});
      return Object.keys(attributes).length > 0 ? attributes : undefined;
    },

    transform: function (a, b, priority) {
      if (!is.object(a)) return b;
      if (!is.object(b)) return undefined;
      if (!priority) return b;  // b simply overwrites us without priority
      var attributes = Object.keys(b).reduce(function (attributes, key) {
        if (a[key] === undefined) attributes[key] = b[key];  // null is a valid value
        return attributes;
      }, {});
      return Object.keys(attributes).length > 0 ? attributes : undefined;
    }
  },

  clone: function (op) {
    var newOp = this.attributes.clone(op);
    if (is.object(newOp.attributes)) {
      newOp.attributes = this.attributes.clone(newOp.attributes, true);
    }
    return newOp;
  },

  iterator: function (ops) {
    return new Iterator(ops);
  },

  length: function (op) {
    if (is.number(op['delete'])) {
      return op['delete'];
    } else if (is.number(op.retain)) {
      return op.retain;
    } else {
      return is.string(op.insert) ? op.insert.length : 1;
    }
  }
};


function Iterator(ops) {
  this.ops = ops;
  this.index = 0;
  this.offset = 0;
};

Iterator.prototype.hasNext = function () {
  return this.peekLength() < Infinity;
};

Iterator.prototype.next = function (length) {
  if (!length) length = Infinity;
  var nextOp = this.ops[this.index];
  if (nextOp) {
    var offset = this.offset;
    var opLength = lib.length(nextOp)
    if (length >= opLength - offset) {
      length = opLength - offset;
      this.index += 1;
      this.offset = 0;
    } else {
      this.offset += length;
    }
    if (is.number(nextOp['delete'])) {
      return { 'delete': length };
    } else {
      var retOp = {};
      if (nextOp.attributes) {
        retOp.attributes = nextOp.attributes;
      }
      if (is.number(nextOp.retain)) {
        retOp.retain = length;
      } else if (is.string(nextOp.insert)) {
        retOp.insert = nextOp.insert.substr(offset, length);
      } else {
        // offset should === 0, length should === 1
        retOp.insert = nextOp.insert;
      }
      return retOp;
    }
  } else {
    return { retain: Infinity };
  }
};

Iterator.prototype.peekLength = function () {
  if (this.ops[this.index]) {
    // Should never return 0 if our index is being managed correctly
    return lib.length(this.ops[this.index]) - this.offset;
  } else {
    return Infinity;
  }
};

Iterator.prototype.peekType = function () {
  if (this.ops[this.index]) {
    if (is.number(this.ops[this.index]['delete'])) {
      return 'delete';
    } else if (is.number(this.ops[this.index].retain)) {
      return 'retain';
    } else {
      return 'insert';
    }
  }
  return 'retain';
};


module.exports = lib;

},{"./is":5}],7:[function(require,module,exports){
/**
 * This library modifies the diff-patch-match library by Neil Fraser
 * by removing the patch and match functionality and certain advanced
 * options in the diff function. The original license is as follows:
 *
 * ===
 *
 * Diff Match and Patch
 *
 * Copyright 2006 Google Inc.
 * http://code.google.com/p/google-diff-match-patch/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * The data structure representing a diff is an array of tuples:
 * [[DIFF_DELETE, 'Hello'], [DIFF_INSERT, 'Goodbye'], [DIFF_EQUAL, ' world.']]
 * which means: delete 'Hello', add 'Goodbye' and keep ' world.'
 */
var DIFF_DELETE = -1;
var DIFF_INSERT = 1;
var DIFF_EQUAL = 0;


/**
 * Find the differences between two texts.  Simplifies the problem by stripping
 * any common prefix or suffix off the texts before diffing.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @return {Array} Array of diff tuples.
 */
function diff_main(text1, text2) {
  // Check for equality (speedup).
  if (text1 == text2) {
    if (text1) {
      return [[DIFF_EQUAL, text1]];
    }
    return [];
  }

  // Trim off common prefix (speedup).
  var commonlength = diff_commonPrefix(text1, text2);
  var commonprefix = text1.substring(0, commonlength);
  text1 = text1.substring(commonlength);
  text2 = text2.substring(commonlength);

  // Trim off common suffix (speedup).
  commonlength = diff_commonSuffix(text1, text2);
  var commonsuffix = text1.substring(text1.length - commonlength);
  text1 = text1.substring(0, text1.length - commonlength);
  text2 = text2.substring(0, text2.length - commonlength);

  // Compute the diff on the middle block.
  var diffs = diff_compute_(text1, text2);

  // Restore the prefix and suffix.
  if (commonprefix) {
    diffs.unshift([DIFF_EQUAL, commonprefix]);
  }
  if (commonsuffix) {
    diffs.push([DIFF_EQUAL, commonsuffix]);
  }
  diff_cleanupMerge(diffs);
  return diffs;
};


/**
 * Find the differences between two texts.  Assumes that the texts do not
 * have any common prefix or suffix.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @return {Array} Array of diff tuples.
 */
function diff_compute_(text1, text2) {
  var diffs;

  if (!text1) {
    // Just add some text (speedup).
    return [[DIFF_INSERT, text2]];
  }

  if (!text2) {
    // Just delete some text (speedup).
    return [[DIFF_DELETE, text1]];
  }

  var longtext = text1.length > text2.length ? text1 : text2;
  var shorttext = text1.length > text2.length ? text2 : text1;
  var i = longtext.indexOf(shorttext);
  if (i != -1) {
    // Shorter text is inside the longer text (speedup).
    diffs = [[DIFF_INSERT, longtext.substring(0, i)],
             [DIFF_EQUAL, shorttext],
             [DIFF_INSERT, longtext.substring(i + shorttext.length)]];
    // Swap insertions for deletions if diff is reversed.
    if (text1.length > text2.length) {
      diffs[0][0] = diffs[2][0] = DIFF_DELETE;
    }
    return diffs;
  }

  if (shorttext.length == 1) {
    // Single character string.
    // After the previous speedup, the character can't be an equality.
    return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
  }

  // Check to see if the problem can be split in two.
  var hm = diff_halfMatch_(text1, text2);
  if (hm) {
    // A half-match was found, sort out the return data.
    var text1_a = hm[0];
    var text1_b = hm[1];
    var text2_a = hm[2];
    var text2_b = hm[3];
    var mid_common = hm[4];
    // Send both pairs off for separate processing.
    var diffs_a = diff_main(text1_a, text2_a);
    var diffs_b = diff_main(text1_b, text2_b);
    // Merge the results.
    return diffs_a.concat([[DIFF_EQUAL, mid_common]], diffs_b);
  }

  return diff_bisect_(text1, text2);
};


/**
 * Find the 'middle snake' of a diff, split the problem in two
 * and return the recursively constructed diff.
 * See Myers 1986 paper: An O(ND) Difference Algorithm and Its Variations.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @return {Array} Array of diff tuples.
 * @private
 */
function diff_bisect_(text1, text2) {
  // Cache the text lengths to prevent multiple calls.
  var text1_length = text1.length;
  var text2_length = text2.length;
  var max_d = Math.ceil((text1_length + text2_length) / 2);
  var v_offset = max_d;
  var v_length = 2 * max_d;
  var v1 = new Array(v_length);
  var v2 = new Array(v_length);
  // Setting all elements to -1 is faster in Chrome & Firefox than mixing
  // integers and undefined.
  for (var x = 0; x < v_length; x++) {
    v1[x] = -1;
    v2[x] = -1;
  }
  v1[v_offset + 1] = 0;
  v2[v_offset + 1] = 0;
  var delta = text1_length - text2_length;
  // If the total number of characters is odd, then the front path will collide
  // with the reverse path.
  var front = (delta % 2 != 0);
  // Offsets for start and end of k loop.
  // Prevents mapping of space beyond the grid.
  var k1start = 0;
  var k1end = 0;
  var k2start = 0;
  var k2end = 0;
  for (var d = 0; d < max_d; d++) {
    // Walk the front path one step.
    for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
      var k1_offset = v_offset + k1;
      var x1;
      if (k1 == -d || (k1 != d && v1[k1_offset - 1] < v1[k1_offset + 1])) {
        x1 = v1[k1_offset + 1];
      } else {
        x1 = v1[k1_offset - 1] + 1;
      }
      var y1 = x1 - k1;
      while (x1 < text1_length && y1 < text2_length &&
             text1.charAt(x1) == text2.charAt(y1)) {
        x1++;
        y1++;
      }
      v1[k1_offset] = x1;
      if (x1 > text1_length) {
        // Ran off the right of the graph.
        k1end += 2;
      } else if (y1 > text2_length) {
        // Ran off the bottom of the graph.
        k1start += 2;
      } else if (front) {
        var k2_offset = v_offset + delta - k1;
        if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] != -1) {
          // Mirror x2 onto top-left coordinate system.
          var x2 = text1_length - v2[k2_offset];
          if (x1 >= x2) {
            // Overlap detected.
            return diff_bisectSplit_(text1, text2, x1, y1);
          }
        }
      }
    }

    // Walk the reverse path one step.
    for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
      var k2_offset = v_offset + k2;
      var x2;
      if (k2 == -d || (k2 != d && v2[k2_offset - 1] < v2[k2_offset + 1])) {
        x2 = v2[k2_offset + 1];
      } else {
        x2 = v2[k2_offset - 1] + 1;
      }
      var y2 = x2 - k2;
      while (x2 < text1_length && y2 < text2_length &&
             text1.charAt(text1_length - x2 - 1) ==
             text2.charAt(text2_length - y2 - 1)) {
        x2++;
        y2++;
      }
      v2[k2_offset] = x2;
      if (x2 > text1_length) {
        // Ran off the left of the graph.
        k2end += 2;
      } else if (y2 > text2_length) {
        // Ran off the top of the graph.
        k2start += 2;
      } else if (!front) {
        var k1_offset = v_offset + delta - k2;
        if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] != -1) {
          var x1 = v1[k1_offset];
          var y1 = v_offset + x1 - k1_offset;
          // Mirror x2 onto top-left coordinate system.
          x2 = text1_length - x2;
          if (x1 >= x2) {
            // Overlap detected.
            return diff_bisectSplit_(text1, text2, x1, y1);
          }
        }
      }
    }
  }
  // Diff took too long and hit the deadline or
  // number of diffs equals number of characters, no commonality at all.
  return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
};


/**
 * Given the location of the 'middle snake', split the diff in two parts
 * and recurse.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {number} x Index of split point in text1.
 * @param {number} y Index of split point in text2.
 * @return {Array} Array of diff tuples.
 */
function diff_bisectSplit_(text1, text2, x, y) {
  var text1a = text1.substring(0, x);
  var text2a = text2.substring(0, y);
  var text1b = text1.substring(x);
  var text2b = text2.substring(y);

  // Compute both diffs serially.
  var diffs = diff_main(text1a, text2a);
  var diffsb = diff_main(text1b, text2b);

  return diffs.concat(diffsb);
};


/**
 * Determine the common prefix of two strings.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the start of each
 *     string.
 */
function diff_commonPrefix(text1, text2) {
  // Quick check for common null cases.
  if (!text1 || !text2 || text1.charAt(0) != text2.charAt(0)) {
    return 0;
  }
  // Binary search.
  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
  var pointermin = 0;
  var pointermax = Math.min(text1.length, text2.length);
  var pointermid = pointermax;
  var pointerstart = 0;
  while (pointermin < pointermid) {
    if (text1.substring(pointerstart, pointermid) ==
        text2.substring(pointerstart, pointermid)) {
      pointermin = pointermid;
      pointerstart = pointermin;
    } else {
      pointermax = pointermid;
    }
    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
  }
  return pointermid;
};


/**
 * Determine the common suffix of two strings.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the end of each string.
 */
function diff_commonSuffix(text1, text2) {
  // Quick check for common null cases.
  if (!text1 || !text2 ||
      text1.charAt(text1.length - 1) != text2.charAt(text2.length - 1)) {
    return 0;
  }
  // Binary search.
  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
  var pointermin = 0;
  var pointermax = Math.min(text1.length, text2.length);
  var pointermid = pointermax;
  var pointerend = 0;
  while (pointermin < pointermid) {
    if (text1.substring(text1.length - pointermid, text1.length - pointerend) ==
        text2.substring(text2.length - pointermid, text2.length - pointerend)) {
      pointermin = pointermid;
      pointerend = pointermin;
    } else {
      pointermax = pointermid;
    }
    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
  }
  return pointermid;
};


/**
 * Do the two texts share a substring which is at least half the length of the
 * longer text?
 * This speedup can produce non-minimal diffs.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {Array.<string>} Five element Array, containing the prefix of
 *     text1, the suffix of text1, the prefix of text2, the suffix of
 *     text2 and the common middle.  Or null if there was no match.
 */
function diff_halfMatch_(text1, text2) {
  var longtext = text1.length > text2.length ? text1 : text2;
  var shorttext = text1.length > text2.length ? text2 : text1;
  if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
    return null;  // Pointless.
  }

  /**
   * Does a substring of shorttext exist within longtext such that the substring
   * is at least half the length of longtext?
   * Closure, but does not reference any external variables.
   * @param {string} longtext Longer string.
   * @param {string} shorttext Shorter string.
   * @param {number} i Start index of quarter length substring within longtext.
   * @return {Array.<string>} Five element Array, containing the prefix of
   *     longtext, the suffix of longtext, the prefix of shorttext, the suffix
   *     of shorttext and the common middle.  Or null if there was no match.
   * @private
   */
  function diff_halfMatchI_(longtext, shorttext, i) {
    // Start with a 1/4 length substring at position i as a seed.
    var seed = longtext.substring(i, i + Math.floor(longtext.length / 4));
    var j = -1;
    var best_common = '';
    var best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b;
    while ((j = shorttext.indexOf(seed, j + 1)) != -1) {
      var prefixLength = diff_commonPrefix(longtext.substring(i),
                                           shorttext.substring(j));
      var suffixLength = diff_commonSuffix(longtext.substring(0, i),
                                           shorttext.substring(0, j));
      if (best_common.length < suffixLength + prefixLength) {
        best_common = shorttext.substring(j - suffixLength, j) +
            shorttext.substring(j, j + prefixLength);
        best_longtext_a = longtext.substring(0, i - suffixLength);
        best_longtext_b = longtext.substring(i + prefixLength);
        best_shorttext_a = shorttext.substring(0, j - suffixLength);
        best_shorttext_b = shorttext.substring(j + prefixLength);
      }
    }
    if (best_common.length * 2 >= longtext.length) {
      return [best_longtext_a, best_longtext_b,
              best_shorttext_a, best_shorttext_b, best_common];
    } else {
      return null;
    }
  }

  // First check if the second quarter is the seed for a half-match.
  var hm1 = diff_halfMatchI_(longtext, shorttext,
                             Math.ceil(longtext.length / 4));
  // Check again based on the third quarter.
  var hm2 = diff_halfMatchI_(longtext, shorttext,
                             Math.ceil(longtext.length / 2));
  var hm;
  if (!hm1 && !hm2) {
    return null;
  } else if (!hm2) {
    hm = hm1;
  } else if (!hm1) {
    hm = hm2;
  } else {
    // Both matched.  Select the longest.
    hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
  }

  // A half-match was found, sort out the return data.
  var text1_a, text1_b, text2_a, text2_b;
  if (text1.length > text2.length) {
    text1_a = hm[0];
    text1_b = hm[1];
    text2_a = hm[2];
    text2_b = hm[3];
  } else {
    text2_a = hm[0];
    text2_b = hm[1];
    text1_a = hm[2];
    text1_b = hm[3];
  }
  var mid_common = hm[4];
  return [text1_a, text1_b, text2_a, text2_b, mid_common];
};


/**
 * Reorder and merge like edit sections.  Merge equalities.
 * Any edit section can move as long as it doesn't cross an equality.
 * @param {Array} diffs Array of diff tuples.
 */
function diff_cleanupMerge(diffs) {
  diffs.push([DIFF_EQUAL, '']);  // Add a dummy entry at the end.
  var pointer = 0;
  var count_delete = 0;
  var count_insert = 0;
  var text_delete = '';
  var text_insert = '';
  var commonlength;
  while (pointer < diffs.length) {
    switch (diffs[pointer][0]) {
      case DIFF_INSERT:
        count_insert++;
        text_insert += diffs[pointer][1];
        pointer++;
        break;
      case DIFF_DELETE:
        count_delete++;
        text_delete += diffs[pointer][1];
        pointer++;
        break;
      case DIFF_EQUAL:
        // Upon reaching an equality, check for prior redundancies.
        if (count_delete + count_insert > 1) {
          if (count_delete !== 0 && count_insert !== 0) {
            // Factor out any common prefixies.
            commonlength = diff_commonPrefix(text_insert, text_delete);
            if (commonlength !== 0) {
              if ((pointer - count_delete - count_insert) > 0 &&
                  diffs[pointer - count_delete - count_insert - 1][0] ==
                  DIFF_EQUAL) {
                diffs[pointer - count_delete - count_insert - 1][1] +=
                    text_insert.substring(0, commonlength);
              } else {
                diffs.splice(0, 0, [DIFF_EQUAL,
                                    text_insert.substring(0, commonlength)]);
                pointer++;
              }
              text_insert = text_insert.substring(commonlength);
              text_delete = text_delete.substring(commonlength);
            }
            // Factor out any common suffixies.
            commonlength = diff_commonSuffix(text_insert, text_delete);
            if (commonlength !== 0) {
              diffs[pointer][1] = text_insert.substring(text_insert.length -
                  commonlength) + diffs[pointer][1];
              text_insert = text_insert.substring(0, text_insert.length -
                  commonlength);
              text_delete = text_delete.substring(0, text_delete.length -
                  commonlength);
            }
          }
          // Delete the offending records and add the merged ones.
          if (count_delete === 0) {
            diffs.splice(pointer - count_insert,
                count_delete + count_insert, [DIFF_INSERT, text_insert]);
          } else if (count_insert === 0) {
            diffs.splice(pointer - count_delete,
                count_delete + count_insert, [DIFF_DELETE, text_delete]);
          } else {
            diffs.splice(pointer - count_delete - count_insert,
                count_delete + count_insert, [DIFF_DELETE, text_delete],
                [DIFF_INSERT, text_insert]);
          }
          pointer = pointer - count_delete - count_insert +
                    (count_delete ? 1 : 0) + (count_insert ? 1 : 0) + 1;
        } else if (pointer !== 0 && diffs[pointer - 1][0] == DIFF_EQUAL) {
          // Merge this equality with the previous one.
          diffs[pointer - 1][1] += diffs[pointer][1];
          diffs.splice(pointer, 1);
        } else {
          pointer++;
        }
        count_insert = 0;
        count_delete = 0;
        text_delete = '';
        text_insert = '';
        break;
    }
  }
  if (diffs[diffs.length - 1][1] === '') {
    diffs.pop();  // Remove the dummy entry at the end.
  }

  // Second pass: look for single edits surrounded on both sides by equalities
  // which can be shifted sideways to eliminate an equality.
  // e.g: A<ins>BA</ins>C -> <ins>AB</ins>AC
  var changes = false;
  pointer = 1;
  // Intentionally ignore the first and last element (don't need checking).
  while (pointer < diffs.length - 1) {
    if (diffs[pointer - 1][0] == DIFF_EQUAL &&
        diffs[pointer + 1][0] == DIFF_EQUAL) {
      // This is a single edit surrounded by equalities.
      if (diffs[pointer][1].substring(diffs[pointer][1].length -
          diffs[pointer - 1][1].length) == diffs[pointer - 1][1]) {
        // Shift the edit over the previous equality.
        diffs[pointer][1] = diffs[pointer - 1][1] +
            diffs[pointer][1].substring(0, diffs[pointer][1].length -
                                        diffs[pointer - 1][1].length);
        diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
        diffs.splice(pointer - 1, 1);
        changes = true;
      } else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) ==
          diffs[pointer + 1][1]) {
        // Shift the edit over the next equality.
        diffs[pointer - 1][1] += diffs[pointer + 1][1];
        diffs[pointer][1] =
            diffs[pointer][1].substring(diffs[pointer + 1][1].length) +
            diffs[pointer + 1][1];
        diffs.splice(pointer + 1, 1);
        changes = true;
      }
    }
    pointer++;
  }
  // If shifts were made, the diff needs reordering and another shift sweep.
  if (changes) {
    diff_cleanupMerge(diffs);
  }
};


var diff = diff_main;
diff.INSERT = DIFF_INSERT;
diff.DELETE = DIFF_DELETE;
diff.EQUAL = DIFF_EQUAL;


module.exports = diff;

},{}]},{},[3])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2NjYy8yL3ktcmljaHRleHQvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUvY2NjLzIveS1yaWNodGV4dC9saWIvZWRpdG9ycy5jb2ZmZWUiLCIvaG9tZS9jY2MvMi95LXJpY2h0ZXh0L2xpYi9taXNjLmNvZmZlZSIsIi9ob21lL2NjYy8yL3ktcmljaHRleHQvbGliL3ktcmljaHRleHQuY29mZmVlIiwiL2hvbWUvY2NjLzIveS1yaWNodGV4dC9ub2RlX21vZHVsZXMvcmljaC10ZXh0L2xpYi9kZWx0YS5qcyIsIi9ob21lL2NjYy8yL3ktcmljaHRleHQvbm9kZV9tb2R1bGVzL3JpY2gtdGV4dC9saWIvaXMuanMiLCIvaG9tZS9jY2MvMi95LXJpY2h0ZXh0L25vZGVfbW9kdWxlcy9yaWNoLXRleHQvbGliL29wLmpzIiwiL2hvbWUvY2NjLzIveS1yaWNodGV4dC9ub2RlX21vZHVsZXMvcmljaC10ZXh0L25vZGVfbW9kdWxlcy9mYXN0LWRpZmYvZGlmZi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEseUNBQUE7RUFBQTtpU0FBQTs7QUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGVBQVIsQ0FBUCxDQUFBOztBQUFBO0FBTWUsRUFBQSx3QkFBRSxNQUFGLEdBQUE7QUFDWCxJQURZLElBQUMsQ0FBQSxTQUFBLE1BQ2IsQ0FBQTtBQUFBLElBQUEsSUFBQyxDQUFBLE1BQUQsR0FBYyxJQUFBLElBQUksQ0FBQyxNQUFMLENBQUEsQ0FBZCxDQURXO0VBQUEsQ0FBYjs7QUFBQSwyQkFJQSxXQUFBLEdBQWEsU0FBQSxHQUFBO0FBQUssVUFBVSxJQUFBLEtBQUEsQ0FBTSxjQUFOLENBQVYsQ0FBTDtFQUFBLENBSmIsQ0FBQTs7QUFBQSwyQkFPQSxTQUFBLEdBQVcsU0FBQSxHQUFBO0FBQU0sVUFBVSxJQUFB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtaXNjID0gcmVxdWlyZShcIi4vbWlzYy5jb2ZmZWVcIilcblxuIyBhIGdlbmVyaWMgZWRpdG9yIGNsYXNzXG5jbGFzcyBBYnN0cmFjdEVkaXRvclxuICAjIGNyZWF0ZSBhbiBlZGl0b3IgaW5zdGFuY2VcbiAgIyBAcGFyYW0gaW5zdGFuY2UgW0VkaXRvcl0gdGhlIGVkaXRvciBvYmplY3RcbiAgY29uc3RydWN0b3I6IChAZWRpdG9yKSAtPlxuICAgIEBsb2NrZXIgPSBuZXcgbWlzYy5Mb2NrZXIoKVxuXG4gICMgZ2V0IHRoZSBjdXJyZW50IGNvbnRlbnQgYXMgYSBvdC1kZWx0YVxuICBnZXRDb250ZW50czogKCktPiB0aHJvdyBuZXcgRXJyb3IgXCJJbXBsZW1lbnQgbWVcIlxuXG4gICMgZ2V0IHRoZSBjdXJyZW50IGN1cnNvciBwb3NpdGlvblxuICBnZXRDdXJzb3I6ICgpIC0+IHRocm93IG5ldyBFcnJvciBcIkltcGxlbWVudCBtZVwiXG4gICMgc2V0IHRoZSBjdXJyZW50IGN1cnNvciBwb3NpdGlvblxuICAjIEBwYXJhbSBwYXJhbSBbT3B0aW9uXSB0aGUgb3B0aW9uc1xuICAjIEBvcHRpb24gcGFyYW0gW0ludGVnZXJdIGlkIHRoZSBpZCBvZiB0aGUgYXV0aG9yXG4gICMgQG9wdGlvbiBwYXJhbSBbSW50ZWdlcl0gaW5kZXggdGhlIGluZGV4IG9mIHRoZSBjdXJzb3JcbiAgIyBAb3B0aW9uIHBhcmFtIFtTdHJpbmddIHRleHQgdGhlIHRleHQgb2YgdGhlIGN1cnNvclxuICAjIEBvcHRpb24gcGFyYW0gW1N0cmluZ10gY29sb3IgdGhlIGNvbG9yIG9mIHRoZSBjdXJzb3JcbiAgc2V0Q3Vyc29yOiAocGFyYW0pIC0+IHRocm93IG5ldyBFcnJvciBcIkltcGxlbWVudCBtZVwiXG4gIHJlbW92ZUN1cnNvcjogKCktPiB0aHJvdyBuZXcgRXJyb3IgXCJJbXBsZW1lbnQgbWVcIlxuXG5cbiAgIyByZW1vdmUgYSBjdXJzb3JcbiAgIyBAcGFyYW0gaWQgW1N0cmluZ10gdGhlIGlkIG9mIHRoZSBjdXJzb3IgdG8gcmVtb3ZlXG4gIHJlbW92ZUN1cnNvcjogKGlkKSAtPiB0aHJvdyBuZXcgRXJyb3IgXCJJbXBsZW1lbnQgbWVcIlxuXG4gICMgZGVzY3JpYmUgaG93IHRvIHBhc3MgbG9jYWwgbW9kaWZpY2F0aW9ucyBvZiB0aGUgdGV4dCB0byB0aGUgYmFja2VuZC5cbiAgIyBAcGFyYW0gYmFja2VuZCBbRnVuY3Rpb25dIHRoZSBmdW5jdGlvbiB0byBwYXNzIHRoZSBkZWx0YSB0b1xuICAjIEBub3RlIFRoZSBiYWNrZW5kIGZ1bmN0aW9uIHRha2VzIGEgbGlzdCBvZiBkZWx0YXMgYXMgYXJndW1lbnRcbiAgb2JzZXJ2ZUxvY2FsVGV4dDogKGJhY2tlbmQpIC0+IHRocm93IG5ldyBFcnJvciBcIkltcGxlbWVudCBtZVwiXG5cbiAgIyBkZXNjcmliZSBob3cgdG8gcGFzcyBsb2NhbCBtb2RpZmljYXRpb25zIG9mIHRoZSBjdXJzb3IgdG8gdGhlIGJhY2tlbmRcbiAgIyBAcGFyYW0gYmFja2VuZCBbRnVuY3Rpb25dIHRoZSBmdW5jdGlvbiB0byBwYXNzIHRoZSBuZXcgcG9zaXRpb24gdG9cbiAgIyBAbm90ZSB0aGUgYmFja2VuZCBmdW5jdGlvbiB0YWtlcyBhIHBvc2l0aW9uIGFzIGFyZ3VtZW50XG4gIG9ic2VydmVMb2NhbEN1cnNvcjogKGJhY2tlbmQpIC0+IHRocm93IG5ldyBFcnJvciBcIkltcGxlbWVudCBtZVwiXG5cbiAgIyBBcHBseSBkZWx0YSBvbiB0aGUgZWRpdG9yXG4gICMgQHBhcmFtIGRlbHRhIFtEZWx0YV0gdGhlIGRlbHRhIHRvIHByb3BhZ2F0ZSB0byB0aGUgZWRpdG9yXG4gICMgQHNlZSBodHRwczovL2dpdGh1Yi5jb20vb3R0eXBlcy9yaWNoLXRleHRcbiAgdXBkYXRlQ29udGVudHM6IChkZWx0YSkgLT4gdGhyb3cgbmV3IEVycm9yIFwiSW1wbGVtZW50IG1lXCJcblxuICAjIFJlbW92ZSBvbGQgY29udGVudCBhbmQgYXBwbHkgZGVsdGEgb24gdGhlIGVkaXRvclxuICAjIEBwYXJhbSBkZWx0YSBbRGVsdGFdIHRoZSBkZWx0YSB0byBwcm9wYWdhdGUgdG8gdGhlIGVkaXRvclxuICAjIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL290dHlwZXMvcmljaC10ZXh0XG4gIHNldENvbnRlbnRzOiAoZGVsdGEpIC0+IHRocm93IG5ldyBFcnJvciBcIkltcGxlbWVudCBtZVwiXG5cbiAgIyBSZXR1cm4gdGhlIGVkaXRvciBpbnN0YW5jZVxuICBnZXRFZGl0b3I6ICgpLT4gdGhyb3cgbmV3IEVycm9yIFwiSW1wbGVtZW50IG1lXCJcblxuICAjIENoZWNrIGlmIHRoZSBlZGl0b3IgdHJpZXMgdG8gYWNjdW11bGF0ZSBtZXNzYWdlcy4gVGhpcyBpcyBleGVjdXRlZCBldmVyeSB0aW1lIGJlZm9yZSBZanMgZXhlY3V0ZXMgYSBtZXNzYWdlc1xuICBjaGVja1VwZGF0ZTogKCktPiB0aHJvdyBuZXcgRXJyb3IgXCJJbXBsZW1lbnQgbWVcIlxuXG5jbGFzcyBRdWlsbEpzIGV4dGVuZHMgQWJzdHJhY3RFZGl0b3JcblxuICBjb25zdHJ1Y3RvcjogKEBlZGl0b3IpIC0+XG4gICAgc3VwZXIgQGVkaXRvclxuICAgIEBfY3Vyc29ycyA9IEBlZGl0b3IuZ2V0TW9kdWxlKFwibXVsdGktY3Vyc29yXCIpXG5cbiAgIyBSZXR1cm4gdGhlIGxlbmd0aCBvZiB0aGUgdGV4dFxuICBnZXRMZW5ndGg6ICgpLT5cbiAgICBAZWRpdG9yLmdldExlbmd0aCgpXG5cbiAgZ2V0Q3Vyc29yUG9zaXRpb246IC0+XG4gICAgc2VsZWN0aW9uID0gQGVkaXRvci5nZXRTZWxlY3Rpb24oKVxuICAgIGlmIHNlbGVjdGlvblxuICAgICAgc2VsZWN0aW9uLnN0YXJ0XG4gICAgZWxzZVxuICAgICAgMFxuXG4gIGdldENvbnRlbnRzOiAoKS0+XG4gICAgQGVkaXRvci5nZXRDb250ZW50cygpLm9wc1xuXG4gIHNldEN1cnNvcjogKHBhcmFtKSAtPiBAbG9ja2VyLnRyeSAoKT0+XG4gICAgY3Vyc29yID0gQF9jdXJzb3JzLmN1cnNvcnNbcGFyYW0uaWRdXG4gICAgaWYgY3Vyc29yPyBhbmQgY3Vyc29yLmNvbG9yID09IHBhcmFtLmNvbG9yXG4gICAgICBmdW4gPSAoaW5kZXgpID0+XG4gICAgICAgIEBfY3Vyc29ycy5tb3ZlQ3Vyc29yIHBhcmFtLmlkLCBpbmRleFxuICAgIGVsc2VcbiAgICAgIGlmIGN1cnNvcj8gYW5kIGN1cnNvci5jb2xvcj8gYW5kIGN1cnNvci5jb2xvciAhPSBwYXJhbS5jb2xvclxuICAgICAgICBAcmVtb3ZlQ3Vyc29yIHBhcmFtLmlkXG5cbiAgICAgIGZ1biA9IChpbmRleCkgPT5cbiAgICAgICAgQF9jdXJzb3JzLnNldEN1cnNvcihwYXJhbS5pZCwgaW5kZXgsXG4gICAgICAgICAgcGFyYW0udGV4dCwgcGFyYW0uY29sb3IpXG5cbiAgICBsZW4gPSBAZWRpdG9yLmdldExlbmd0aCgpXG4gICAgaWYgcGFyYW0uaW5kZXggPiBsZW5cbiAgICAgIHBhcmFtLmluZGV4ID0gbGVuXG4gICAgaWYgcGFyYW0uaW5kZXg/XG4gICAgICBmdW4gcGFyYW0uaW5kZXhcblxuICByZW1vdmVDdXJzb3I6IChpZCkgLT5cbiAgICBAX2N1cnNvcnMucmVtb3ZlQ3Vyc29yKGlkKVxuXG4gIHJlbW92ZUN1cnNvcjogKGlkKS0+XG4gICAgICBAX2N1cnNvcnMucmVtb3ZlQ3Vyc29yIGlkXG5cbiAgb2JzZXJ2ZUxvY2FsVGV4dDogKGJhY2tlbmQpLT5cbiAgICBAZWRpdG9yLm9uIFwidGV4dC1jaGFuZ2VcIiwgKGRlbHRhcywgc291cmNlKSAtPlxuICAgICAgIyBjYWxsIHRoZSBiYWNrZW5kIHdpdGggZGVsdGFzXG4gICAgICBwb3NpdGlvbiA9IGJhY2tlbmQgZGVsdGFzXG4gICAgICAjIHRyaWdnZXIgYW4gZXh0cmEgZXZlbnQgdG8gbW92ZSBjdXJzb3IgdG8gcG9zaXRpb24gb2YgaW5zZXJ0ZWQgdGV4dFxuICAgICAgQGVkaXRvci5zZWxlY3Rpb24uZW1pdHRlci5lbWl0KFxuICAgICAgICBAZWRpdG9yLnNlbGVjdGlvbi5lbWl0dGVyLmNvbnN0cnVjdG9yLmV2ZW50cy5TRUxFQ1RJT05fQ0hBTkdFLFxuICAgICAgICBAZWRpdG9yLnF1aWxsLmdldFNlbGVjdGlvbigpLFxuICAgICAgICBcInVzZXJcIilcblxuICBvYnNlcnZlTG9jYWxDdXJzb3I6IChiYWNrZW5kKSAtPlxuICAgIEBlZGl0b3Iub24gXCJzZWxlY3Rpb24tY2hhbmdlXCIsIChyYW5nZSwgc291cmNlKS0+XG4gICAgICBpZiByYW5nZSBhbmQgcmFuZ2Uuc3RhcnQgPT0gcmFuZ2UuZW5kXG4gICAgICAgIGJhY2tlbmQgcmFuZ2Uuc3RhcnRcblxuICB1cGRhdGVDb250ZW50czogKGRlbHRhKS0+XG4gICAgQGVkaXRvci51cGRhdGVDb250ZW50cyBkZWx0YVxuXG5cbiAgc2V0Q29udGVudHM6IChkZWx0YSktPlxuICAgIEBlZGl0b3Iuc2V0Q29udGVudHMoZGVsdGEpXG5cbiAgZ2V0RWRpdG9yOiAoKS0+XG4gICAgQGVkaXRvclxuXG4gIGNoZWNrVXBkYXRlOiAoKS0+XG4gICAgQGVkaXRvci5lZGl0b3IuY2hlY2tVcGRhdGUoKVxuXG5jbGFzcyBUZXN0RWRpdG9yIGV4dGVuZHMgQWJzdHJhY3RFZGl0b3JcblxuICBjb25zdHJ1Y3RvcjogKEBlZGl0b3IpIC0+XG4gICAgc3VwZXJcblxuICBnZXRMZW5ndGg6KCkgLT5cbiAgICAwXG5cbiAgZ2V0Q3Vyc29yUG9zaXRpb246IC0+XG4gICAgMFxuXG4gIGdldENvbnRlbnRzOiAoKSAtPlxuICAgIG9wczogW3tpbnNlcnQ6IFwiV2VsbCwgdGhpcyBpcyBhIHRlc3QhXCJ9XG4gICAgICB7aW5zZXJ0OiBcIkFuZCBJJ20gYm9sZOKAplwiLCBhdHRyaWJ1dGVzOiB7Ym9sZDp0cnVlfX1dXG5cbiAgc2V0Q3Vyc29yOiAoKSAtPlxuICAgIFwiXCJcblxuICBvYnNlcnZlTG9jYWxUZXh0OihiYWNrZW5kKSAtPlxuICAgIFwiXCJcblxuICBvYnNlcnZlTG9jYWxDdXJzb3I6IChiYWNrZW5kKSAtPlxuICAgIFwiXCJcblxuICB1cGRhdGVDb250ZW50czogKGRlbHRhKSAtPlxuICAgIFwiXCJcblxuICBzZXRDb250ZW50czogKGRlbHRhKS0+XG4gICAgXCJcIlxuXG4gIGdldEVkaXRvcjogKCktPlxuICAgIEBlZGl0b3JcblxuZXhwb3J0cy5RdWlsbEpzID0gUXVpbGxKc1xuZXhwb3J0cy5UZXN0RWRpdG9yID0gVGVzdEVkaXRvclxuZXhwb3J0cy5BYnN0cmFjdEVkaXRvciA9IEFic3RyYWN0RWRpdG9yXG4iLCJjbGFzcyBMb2NrZXJcbiAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgQGlzX2xvY2tlZCA9IGZhbHNlXG5cbiAgdHJ5OiAoZnVuKSAtPlxuICAgIGlmIEBpc19sb2NrZWRcbiAgICAgIHJldHVyblxuXG4gICAgQGlzX2xvY2tlZCA9IHRydWVcbiAgICByZXQgPSBkbyBmdW5cbiAgICBAaXNfbG9ja2VkID0gZmFsc2VcbiAgICByZXR1cm4gcmV0XG5cbiMgYSBiYXNpYyBjbGFzcyB3aXRoIGdlbmVyaWMgZ2V0dGVyIC8gc2V0dGVyIGZ1bmN0aW9uXG5jbGFzcyBCYXNlQ2xhc3NcbiAgY29uc3RydWN0b3I6IC0+XG4gICAgIyBvd25Qcm9wZXJ0eSBpcyB1bnNhZmUuIFJhdGhlciBwdXQgaXQgb24gYSBkZWRpY2F0ZWQgcHJvcGVydHkgbGlrZS4uXG4gICAgQF90bXBfbW9kZWwgPSB7fVxuXG4gICMgVHJ5IHRvIGZpbmQgdGhlIHByb3BlcnR5IGluIEBfbW9kZWwsIGVsc2UgcmV0dXJuIHRoZVxuICAjIHRtcF9tb2RlbFxuICBfZ2V0OiAocHJvcCkgLT5cbiAgICBpZiBub3QgQF9tb2RlbD9cbiAgICAgIEBfdG1wX21vZGVsW3Byb3BdXG4gICAgZWxzZVxuICAgICAgQF9tb2RlbC52YWwocHJvcClcbiAgIyBUcnkgdG8gc2V0IHRoZSBwcm9wZXJ0eSBpbiBAX21vZGVsLCBlbHNlIHNldCB0aGVcbiAgIyB0bXBfbW9kZWxcbiAgX3NldDogKHByb3AsIHZhbCkgLT5cbiAgICBpZiBub3QgQF9tb2RlbD9cbiAgICAgIEBfdG1wX21vZGVsW3Byb3BdID0gdmFsXG4gICAgZWxzZVxuICAgICAgQF9tb2RlbC52YWwocHJvcCwgdmFsKVxuXG4gICMgc2luY2Ugd2UgYWxyZWFkeSBhc3N1bWUgdGhhdCBhbnkgaW5zdGFuY2Ugb2YgQmFzZUNsYXNzIHVzZXMgYSBNYXBNYW5hZ2VyXG4gICMgV2UgY2FuIGNyZWF0ZSBpdCBoZXJlLCB0byBzYXZlIGxpbmVzIG9mIGNvZGVcbiAgX2dldE1vZGVsOiAoWSwgT3BlcmF0aW9uKS0+XG4gICAgaWYgbm90IEBfbW9kZWw/XG4gICAgICBAX21vZGVsID0gbmV3IE9wZXJhdGlvbi5NYXBNYW5hZ2VyKEApLmV4ZWN1dGUoKVxuICAgICAgZm9yIGtleSwgdmFsdWUgb2YgQF90bXBfbW9kZWxcbiAgICAgICAgQF9tb2RlbC52YWwoa2V5LCB2YWx1ZSlcbiAgICBAX21vZGVsXG5cbiAgX3NldE1vZGVsOiAoQF9tb2RlbCktPlxuICAgIGRlbGV0ZSBAX3RtcF9tb2RlbFxuXG5pZiBtb2R1bGU/XG4gIGV4cG9ydHMuQmFzZUNsYXNzID0gQmFzZUNsYXNzXG4gIGV4cG9ydHMuTG9ja2VyID0gTG9ja2VyXG4iLCJtaXNjID0gKHJlcXVpcmUgXCIuL21pc2MuY29mZmVlXCIpXG5CYXNlQ2xhc3MgPSBtaXNjLkJhc2VDbGFzc1xuTG9ja2VyID0gbWlzYy5Mb2NrZXJcbkVkaXRvcnMgPSAocmVxdWlyZSBcIi4vZWRpdG9ycy5jb2ZmZWVcIilcbkRlbHRhID0gcmVxdWlyZSgncmljaC10ZXh0L2xpYi9kZWx0YScpXG5cblxuIyBBbGwgZGVwZW5kZW5jaWVzIChsaWtlIFkuU2VsZWN0aW9ucykgdG8gb3RoZXIgdHlwZXMgKHRoYXQgaGF2ZSBpdHMgb3duXG4jIHJlcG9zaXRvcnkpIHNob3VsZCAgYmUgaW5jbHVkZWQgYnkgdGhlIHVzZXIgKGluIG9yZGVyIHRvIHJlZHVjZSB0aGUgYW1vdW50IG9mXG4jIGRvd25sb2FkZWQgY29udGVudCkuXG4jIFdpdGggaHRtbDUgaW1wb3J0cywgd2UgY2FuIGluY2x1ZGUgaXQgYXV0b21hdGljYWxseSB0b28uIEJ1dCB3aXRoIHRoZSBvbGRcbiMgc2NyaXB0IHRhZ3MgdGhpcyBpcyB0aGUgYmVzdCBzb2x1dGlvbiB0aGF0IGNhbWUgdG8gbXkgbWluZC5cblxuIyBBIGNsYXNzIGhvbGRpbmcgdGhlIGluZm9ybWF0aW9uIGFib3V0IHJpY2ggdGV4dFxuY2xhc3MgWVJpY2hUZXh0IGV4dGVuZHMgQmFzZUNsYXNzXG4gICMgQHBhcmFtIGNvbnRlbnQgW1N0cmluZ10gYW4gaW5pdGlhbCBzdHJpbmdcbiAgIyBAcGFyYW0gZWRpdG9yIFtFZGl0b3JdIGFuIGVkaXRvciBpbnN0YW5jZVxuICAjIEBwYXJhbSBhdXRob3IgW1N0cmluZ10gdGhlIG5hbWUgb2YgdGhlIGxvY2FsIGF1dGhvclxuICBjb25zdHJ1Y3RvcjogKGVkaXRvcl9uYW1lLCBlZGl0b3JfaW5zdGFuY2UpIC0+XG4gICAgQGxvY2tlciA9IG5ldyBMb2NrZXIoKVxuXG4gICAgaWYgZWRpdG9yX25hbWU/IGFuZCBlZGl0b3JfaW5zdGFuY2U/XG4gICAgICBAX2JpbmRfbGF0ZXIgPVxuICAgICAgICBuYW1lOiBlZGl0b3JfbmFtZVxuICAgICAgICBpbnN0YW5jZTogZWRpdG9yX2luc3RhbmNlXG5cbiAgICAjIFRPRE86IGdlbmVyYXRlIGEgVUlEICh5b3UgY2FuIGdldCBhIHVuaXF1ZSBpZCBieSBjYWxsaW5nXG4gICAgIyBgQF9tb2RlbC5nZXRVaWQoKWAgLSBpcyB0aGlzIHdoYXQgeW91IG1lYW4/KVxuICAgICMgQGF1dGhvciA9IGF1dGhvclxuICAgICMgVE9ETzogYXNzaWduIGFuIGlkIC8gYXV0aG9yIG5hbWUgdG8gdGhlIHJpY2ggdGV4dCBpbnN0YW5jZSBmb3IgYXV0aG9yc2hpcFxuXG4gICAgIyBhcHBsaWVzIHBlbmRpbmcgZGVsdGFzIGZyZXF1ZW50bHlcbiAgICBAcGVuZGluZ0RlbHRhID0gbmV3IERlbHRhKClcbiAgICB3aW5kb3cuc2V0SW50ZXJ2YWwgQGFwcGx5VXBkYXRlQ29udGVudHMuYmluZChAKSwgMjAwXG5cblxuICBhcHBseVVwZGF0ZUNvbnRlbnRzOiAoKSAtPlxuICAgIGlmIEBlZGl0b3I/IGFuZCBAcGVuZGluZ0RlbHRhLmxlbmd0aCgpID4gMFxuICAgICAgQGxvY2tlci50cnkgKCk9PlxuICAgICAgICBAZWRpdG9yLnVwZGF0ZUNvbnRlbnRzIEBwZW5kaW5nRGVsdGFcbiAgICAgICAgQHBlbmRpbmdEZWx0YSA9IG5ldyBEZWx0YSgpXG4gICNcbiAgIyBCaW5kIHRoZSBSaWNoVGV4dCB0eXBlIHRvIGEgcmljaCB0ZXh0IGVkaXRvciAoZS5nLiBxdWlsbGpzKVxuICAjXG4gIGJpbmQ6ICgpLT5cbiAgICAjIFRPRE86IGJpbmQgdG8gbXVsdGlwbGUgZWRpdG9yc1xuICAgIGlmIGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIEVkaXRvcnMuQWJzdHJhY3RFZGl0b3JcbiAgICAgICMgaXMgYWxyZWFkeSBhbiBlZGl0b3IhXG4gICAgICBAZWRpdG9yID0gYXJndW1lbnRzWzBdXG4gICAgZWxzZVxuICAgICAgW2VkaXRvcl9uYW1lLCBlZGl0b3JfaW5zdGFuY2VdID0gYXJndW1lbnRzXG4gICAgICBpZiBAZWRpdG9yPyBhbmQgQGVkaXRvci5nZXRFZGl0b3IoKSBpcyBlZGl0b3JfaW5zdGFuY2VcbiAgICAgICAgIyByZXR1cm4sIGlmIEBlZGl0b3IgaXMgYWxyZWFkeSBib3VuZCEgKG5ldmVyIGJpbmQgdHdpY2UhKVxuICAgICAgICByZXR1cm5cbiAgICAgIEVkaXRvciA9IEVkaXRvcnNbZWRpdG9yX25hbWVdXG4gICAgICBpZiBFZGl0b3I/XG4gICAgICAgIEBlZGl0b3IgPSBuZXcgRWRpdG9yIGVkaXRvcl9pbnN0YW5jZVxuICAgICAgZWxzZVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJUaGlzIHR5cGUgb2YgZWRpdG9yIGlzIG5vdCBzdXBwb3J0ZWQhIChcIiArXG4gICAgICAgICAgZWRpdG9yX25hbWUgKyBcIilcIlxuXG4gICAgIyBUT0RPOiBwYXJzZSB0aGUgZm9sbG93aW5nIGRpcmVjdGx5IGZyb20gJGNoYXJhY3RlcnMrJHNlbGVjdGlvbnMgKGluIE8obikpXG4gICAgQGVkaXRvci5zZXRDb250ZW50c1xuICAgICAgb3BzOiBAZ2V0RGVsdGEoKVxuXG4gICAgIyBiaW5kIHRoZSByZXN0Li5cbiAgICAjIFRPRE86IHJlbW92ZSBvYnNlcnZlcnMsIHdoZW4gZWRpdG9yIGlzIG92ZXJ3cml0dGVuXG4gICAgQGVkaXRvci5vYnNlcnZlTG9jYWxUZXh0ICgoZGVsdGEpID0+XG4gICAgICB0cmFuc2Zvcm1lZERlbHRhID0gQHBlbmRpbmdEZWx0YS50cmFuc2Zvcm0gZGVsdGFcbiAgICAgIEBhcHBseVVwZGF0ZUNvbnRlbnRzKClcbiAgICAgIEBwYXNzRGVsdGFzLmNhbGwoQGVkaXRvciwgdHJhbnNmb3JtZWREZWx0YSkpLmJpbmQgQFxuXG4gICAgQGJpbmRFdmVudHNUb0VkaXRvciBAZWRpdG9yXG4gICAgQGVkaXRvci5vYnNlcnZlTG9jYWxDdXJzb3IgQHVwZGF0ZUN1cnNvclBvc2l0aW9uXG5cbiAgICAjIHB1bGwgY2hhbmdlcyBmcm9tIHF1aWxsLCBiZWZvcmUgbWVzc2FnZSBpcyByZWNlaXZlZCBhbmQgZXZlbnR1YWxseSBhcHBseSBhbGwgbm9uLWFwcGxpZWQgbW9kaWZpY2F0aW9uc1xuICAgICMgYXMgc3VnZ2VzdGVkIGh0dHBzOi8vZGlzY3Vzcy5xdWlsbGpzLmNvbS90L3Byb2JsZW1zLWluLWNvbGxhYm9yYXRpdmUtaW1wbGVtZW50YXRpb24vMjU4XG4gICAgIyBUT0RPOiBtb3ZlIHRoaXMgdG8gRWRpdG9ycy5jb2ZmZWVcbiAgICBAX21vZGVsLmNvbm5lY3Rvci5yZWNlaXZlX2hhbmRsZXJzLnVuc2hpZnQgKCk9PlxuICAgICAgQGVkaXRvci5jaGVja1VwZGF0ZSgpXG5cbiAgb2JzZXJ2ZTogKGZ1bikgLT5cbiAgICBpZiBAX21vZGVsP1xuICAgICAgQF9tb2RlbC5vYnNlcnZlKGZ1bilcbiAgICBlbHNlXG4gICAgICBAX29ic2VydmVXaGVuTW9kZWwgPSAoQF9vYnNlcnZlV2hlbk1vZGVsIG9yIFtdKS5wdXNoKGZ1bilcblxuICBhdHRhY2hQcm92aWRlcjogKGtpbmQsIGZ1bikgLT5cbiAgICBAX3Byb3ZpZGVycyA9IEBfcHJvdmlkZXJzIG9yIHt9XG4gICAgQF9wcm92aWRlcnNba2luZF0gPSBmdW5cblxuICBnZXREZWx0YTogKCktPlxuICAgIHRleHRfY29udGVudCA9IEBfbW9kZWwuZ2V0Q29udGVudCgnY2hhcmFjdGVycycpLnZhbCgpXG4gICAgIyB0cmFuc2Zvcm0gWS5TZWxlY3Rpb25zLmdldFNlbGVjdGlvbnMoKSB0byBhIGRlbHRhXG4gICAgZXhwZWN0ZWRfcG9zID0gMFxuICAgIGRlbHRhcyA9IG5ldyBEZWx0YSgpXG4gICAgc2VsZWN0aW9ucyA9IEBfbW9kZWwuZ2V0Q29udGVudChcInNlbGVjdGlvbnNcIilcbiAgICBmb3Igc2VsIGluIHNlbGVjdGlvbnMuZ2V0U2VsZWN0aW9ucyhAX21vZGVsLmdldENvbnRlbnQoXCJjaGFyYWN0ZXJzXCIpKVxuICAgICAgIyAoKzEpLCBiZWNhdXNlIGlmIHdlIHNlbGVjdCBmcm9tIDEgdG8gMSAod2l0aCB5LXNlbGVjdGlvbnMpLCB0aGVuIHRoZVxuICAgICAgIyBsZW5ndGggaXMgMVxuICAgICAgc2VsZWN0aW9uX2xlbmd0aCA9IHNlbC50byAtIHNlbC5mcm9tICsgMVxuICAgICAgaWYgZXhwZWN0ZWRfcG9zIGlzbnQgc2VsLmZyb21cbiAgICAgICAgIyBUaGVyZSBpcyB1bnNlbGVjdGVkIHRleHQuICRyZXRhaW4gdG8gdGhlIG5leHQgc2VsZWN0aW9uXG4gICAgICAgIHVuc2VsZWN0ZWRfaW5zZXJ0X2NvbnRlbnQgPSB0ZXh0X2NvbnRlbnQuc3BsaWNlKFxuICAgICAgICAgIDAsIHNlbC5mcm9tLWV4cGVjdGVkX3BvcyApXG4gICAgICAgICAgLmpvaW4oJycpXG4gICAgICAgIGRlbHRhcy5pbnNlcnQgdW5zZWxlY3RlZF9pbnNlcnRfY29udGVudFxuICAgICAgICBleHBlY3RlZF9wb3MgKz0gdW5zZWxlY3RlZF9pbnNlcnRfY29udGVudC5sZW5ndGhcbiAgICAgIGlmIGV4cGVjdGVkX3BvcyBpc250IHNlbC5mcm9tXG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIlRoaXMgcG9ydGlvbiBvZiBjb2RlIG11c3Qgbm90IGJlIHJlYWNoZWQgaW4gZ2V0RGVsdGEhXCJcbiAgICAgIGRlbHRhcy5pbnNlcnQgdGV4dF9jb250ZW50LnNwbGljZSgwLCBzZWxlY3Rpb25fbGVuZ3RoKS5qb2luKCcnKSwgc2VsLmF0dHJzXG4gICAgICBleHBlY3RlZF9wb3MgKz0gc2VsZWN0aW9uX2xlbmd0aFxuICAgIGlmIHRleHRfY29udGVudC5sZW5ndGggPiAwXG4gICAgICBkZWx0YXMuaW5zZXJ0IHRleHRfY29udGVudC5qb2luKCcnKVxuICAgIGRlbHRhc1xuXG4gIF9nZXRNb2RlbDogKFksIE9wZXJhdGlvbikgLT5cbiAgICBpZiBub3QgQF9tb2RlbD9cbiAgICAgICMgd2Ugc2F2ZSB0aGlzIHN0dWZmIGFzIF9zdGF0aWNfIGNvbnRlbnQgbm93LlxuICAgICAgIyBUaGVyZWZvcmUsIHlvdSBjYW4ndCBvdmVyd3JpdGUgaXQsIGFmdGVyIHlvdSBvbmNlIHNhdmVkIGl0LlxuICAgICAgIyBCdXQgb24gdGhlIHVwc2lkZSwgd2UgY2FuIGFsd2F5cyBtYWtlIHN1cmUsIHRoYXQgdGhleSBhcmUgZGVmaW5lZCFcbiAgICAgIGNvbnRlbnRfb3BlcmF0aW9ucyA9XG4gICAgICAgIHNlbGVjdGlvbnM6IG5ldyBZLlNlbGVjdGlvbnMoKVxuICAgICAgICBjaGFyYWN0ZXJzOiBuZXcgWS5MaXN0KClcbiAgICAgICAgY3Vyc29yczogbmV3IFkuT2JqZWN0KClcbiAgICAgIEBfbW9kZWwgPSBuZXcgT3BlcmF0aW9uLk1hcE1hbmFnZXIoQCwgbnVsbCwge30sIGNvbnRlbnRfb3BlcmF0aW9ucyApLmV4ZWN1dGUoKVxuXG4gICAgICBAX3NldE1vZGVsIEBfbW9kZWxcblxuICAgICAgaWYgQF9iaW5kX2xhdGVyP1xuICAgICAgICBFZGl0b3IgPSBFZGl0b3JzW0BfYmluZF9sYXRlci5uYW1lXVxuICAgICAgICBpZiBFZGl0b3I/XG4gICAgICAgICAgZWRpdG9yID0gbmV3IEVkaXRvciBAX2JpbmRfbGF0ZXIuaW5zdGFuY2VcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIlRoaXMgdHlwZSBvZiBlZGl0b3IgaXMgbm90IHN1cHBvcnRlZCEgKFwiK2VkaXRvcl9uYW1lK1wiKSAtLSBmYXRhbCBlcnJvciFcIlxuICAgICAgICBAcGFzc0RlbHRhcyBvcHM6IGVkaXRvci5nZXRDb250ZW50cygpXG4gICAgICAgIEBiaW5kIGVkaXRvclxuICAgICAgICBkZWxldGUgQF9iaW5kX2xhdGVyXG5cbiAgICAgICMgbGlzdGVuIHRvIGV2ZW50cyBvbiB0aGUgbW9kZWwgdXNpbmcgdGhlIGZ1bmN0aW9uIHByb3BhZ2F0ZVRvRWRpdG9yXG4gICAgICBAX21vZGVsLm9ic2VydmUgQHByb3BhZ2F0ZVRvRWRpdG9yXG4gICAgICAoQF9vYnNlcnZlV2hlbk1vZGVsIG9yIFtdKS5mb3JFYWNoIChvYnNlcnZlcikgLT5cbiAgICAgICAgQF9tb2RlbC5vYnNlcnZlIG9ic2VydmVyXG5cbiAgICBAX21vZGVsXG5cbiAgX3NldE1vZGVsOiAobW9kZWwpIC0+XG4gICAgc3VwZXJcbiAgICAoQF9vYnNlcnZlV2hlbk1vZGVsIG9yIFtdKS5mb3JFYWNoIChvYnNlcnZlcikgLT5cbiAgICAgIEBfbW9kZWwub2JzZXJ2ZSBvYnNlcnZlclxuXG4gIF9uYW1lOiBcIlJpY2hUZXh0XCJcblxuICBnZXRUZXh0OiAoKS0+XG4gICAgQF9tb2RlbC5nZXRDb250ZW50KCdjaGFyYWN0ZXJzJykudmFsKCkuam9pbignJylcblxuICAjIGluc2VydCBvdXIgb3duIGN1cnNvciBpbiB0aGUgY3Vyc29ycyBvYmplY3RcbiAgIyBAcGFyYW0gcG9zaXRpb24gW0ludGVnZXJdIHRoZSBwb3NpdGlvbiB3aGVyZSB0byBpbnNlcnQgaXRcbiAgc2V0Q3Vyc29yIDogKHBvc2l0aW9uKSAtPlxuICAgIEBzZWxmQ3Vyc29yID0gQF9tb2RlbC5nZXRDb250ZW50KFwiY2hhcmFjdGVyc1wiKS5yZWYocG9zaXRpb24pXG4gICAgQF9tb2RlbC5nZXRDb250ZW50KFwiY3Vyc29yc1wiKS52YWwoQF9tb2RlbC5IQi5nZXRVc2VySWQoKSwgQHNlbGZDdXJzb3IpXG5cblxuICAjIHBhc3MgZGVsdGFzIHRvIHRoZSBjaGFyYWN0ZXIgaW5zdGFuY2VcbiAgIyBAcGFyYW0gZGVsdGFzIFtBcnJheTxPYmplY3Q+XSBhbiBhcnJheSBvZiBkZWx0YXMgKHNlZSBvdC10eXBlcyBmb3IgbW9yZSBpbmZvKVxuICBwYXNzRGVsdGFzIDogKGRlbHRhcykgPT4gQGxvY2tlci50cnkgKCk9PlxuICAgIHBvc2l0aW9uID0gMFxuICAgIGZvciBkZWx0YSBpbiBkZWx0YXMub3BzIG9yIFtdXG4gICAgICBwb3NpdGlvbiA9IGRlbHRhSGVscGVyIEAsIGRlbHRhLCBwb3NpdGlvblxuXG4gICMgQG92ZXJyaWRlIHVwZGF0ZUN1cnNvclBvc2l0aW9uKGluZGV4KVxuICAjICAgdXBkYXRlIHRoZSBwb3NpdGlvbiBvZiBvdXIgY3Vyc29yIHRvIHRoZSBuZXcgb25lIHVzaW5nIGFuIGluZGV4XG4gICMgICBAcGFyYW0gaW5kZXggW0ludGVnZXJdIHRoZSBuZXcgaW5kZXhcbiAgIyBAb3ZlcnJpZGUgdXBkYXRlQ3Vyc29yUG9zaXRpb24oY2hhcmFjdGVyKVxuICAjICAgdXBkYXRlIHRoZSBwb3NpdGlvbiBvZiBvdXIgY3Vyc29yIHRvIHRoZSBuZXcgb25lIHVzaW5nIGEgY2hhcmFjdGVyXG4gICMgICBAcGFyYW0gY2hhcmFjdGVyIFtDaGFyYWN0ZXJdIHRoZSBuZXcgY2hhcmFjdGVyXG4gIHVwZGF0ZUN1cnNvclBvc2l0aW9uIDogKG9iaikgPT4gQGxvY2tlci50cnkgKCk9PlxuICAgIGlmIHR5cGVvZiBvYmogaXMgXCJudW1iZXJcIlxuICAgICAgQHNlbGZDdXJzb3IgPSBAX21vZGVsLmdldENvbnRlbnQoXCJjaGFyYWN0ZXJzXCIpLnJlZihvYmopXG4gICAgZWxzZVxuICAgICAgQHNlbGZDdXJzb3IgPSBvYmpcbiAgICBAX21vZGVsLmdldENvbnRlbnQoXCJjdXJzb3JzXCIpLnZhbChAX21vZGVsLkhCLmdldFVzZXJJZCgpLCBAc2VsZkN1cnNvcilcblxuICAjIGRlc2NyaWJlIGhvdyB0byBwcm9wYWdhdGUgeWpzIGV2ZW50cyB0byB0aGUgZWRpdG9yXG4gICMgVE9ETzogc2hvdWxkIGJlIHByaXZhdGUhXG4gIGJpbmRFdmVudHNUb0VkaXRvciA6IChlZGl0b3IpIC0+XG4gICAgIyB1cGRhdGUgdGhlIGVkaXRvciB3aGVuIHNvbWV0aGluZyBvbiB0aGUgJGNoYXJhY3RlcnMgaGFwcGVuc1xuICAgIEBfbW9kZWwuZ2V0Q29udGVudChcImNoYXJhY3RlcnNcIikub2JzZXJ2ZSAoZXZlbnRzKSA9PiBAbG9ja2VyLnRyeSAoKT0+XG5cblxuICAgICAgIyBjcmVhdGUgYSBkZWx0YSBvdXQgb2YgdGhlIGV2ZW50XG4gICAgICBmb3IgZXZlbnQgaW4gZXZlbnRzXG4gICAgICAgIGRlbHRhID0gbmV3IERlbHRhKClcblxuICAgICAgICBpZiBldmVudC5wb3NpdGlvbiA+IDBcbiAgICAgICAgICBkZWx0YS5yZXRhaW4gZXZlbnQucG9zaXRpb25cblxuICAgICAgICBpZiBldmVudC50eXBlIGlzIFwiaW5zZXJ0XCJcbiAgICAgICAgICBkZWx0YS5pbnNlcnQgZXZlbnQudmFsdWVcblxuICAgICAgICBlbHNlIGlmIGV2ZW50LnR5cGUgaXMgXCJkZWxldGVcIlxuICAgICAgICAgIGRlbHRhLmRlbGV0ZSAxXG4gICAgICAgICAgIyBkZWxldGUgY3Vyc29yLCBpZiBpdCByZWZlcmVuY2VzIHRvIHRoaXMgcG9zaXRpb25cbiAgICAgICAgICBmb3IgY3Vyc29yX25hbWUsIGN1cnNvcl9yZWYgaW4gQF9tb2RlbC5nZXRDb250ZW50KFwiY3Vyc29yc1wiKS52YWwoKVxuICAgICAgICAgICAgaWYgY3Vyc29yX3JlZiBpcyBldmVudC5yZWZlcmVuY2VcbiAgICAgICAgICAgICAgI1xuICAgICAgICAgICAgICAjIHdlIGhhdmUgdG8gZGVsZXRlIHRoZSBjdXJzb3IgaWYgdGhlIHJlZmVyZW5jZSBkb2VzIG5vdCBleGlzdCBhbnltb3JlXG4gICAgICAgICAgICAgICMgdGhlIGRvd25zaWRlIG9mIHRoaXMgYXBwcm9hY2ggaXMgdGhhdCBldmVyeW9uZSB3aWxsIHNlbmQgdGhpcyBkZWxldGUgZXZlbnQhXG4gICAgICAgICAgICAgICMgaW4gdGhlIGZ1dHVyZSwgd2UgY291bGQgcmVwbGFjZSB0aGUgY3Vyc29ycywgd2l0aCBhIHktc2VsZWN0aW9uc1xuICAgICAgICAgICAgICAjXG4gICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpLT5cbiAgICAgICAgICAgICAgICAgIEBfbW9kZWwuZ2V0Q29udGVudChcImN1cnNvcnNcIikuZGVsZXRlKGN1cnNvcl9uYW1lKVxuICAgICAgICAgICAgICAgICwgMClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJldHVyblxuICAgICAgICAgIFxuICAgICAgICBAcGVuZGluZ0RlbHRhID0gQHBlbmRpbmdEZWx0YS5jb21wb3NlIGRlbHRhXG4gICAgICAgIEBhcHBseVVwZGF0ZUNvbnRlbnRzKClcblxuXG4gICAgIyB1cGRhdGUgdGhlIGVkaXRvciB3aGVuIHNvbWV0aGluZyBvbiB0aGUgJHNlbGVjdGlvbnMgaGFwcGVuc1xuICAgIEBfbW9kZWwuZ2V0Q29udGVudChcInNlbGVjdGlvbnNcIikub2JzZXJ2ZSAoZXZlbnQpPT4gQGxvY2tlci50cnkgKCk9PlxuICAgICAgYXR0cnMgPSB7fVxuICAgICAgaWYgZXZlbnQudHlwZSBpcyBcInNlbGVjdFwiXG4gICAgICAgIGZvciBhdHRyLHZhbCBvZiBldmVudC5hdHRyc1xuICAgICAgICAgIGF0dHJzW2F0dHJdID0gdmFsXG4gICAgICBlbHNlICMgaXMgXCJ1bnNlbGVjdFwiIVxuICAgICAgICBmb3IgYXR0ciBpbiBldmVudC5hdHRyc1xuICAgICAgICAgIGF0dHJzW2F0dHJdID0gbnVsbFxuICAgICAgcmV0YWluID0gZXZlbnQuZnJvbS5nZXRQb3NpdGlvbigpXG4gICAgICBzZWxlY3Rpb25fbGVuZ3RoID0gZXZlbnQudG8uZ2V0UG9zaXRpb24oKS1ldmVudC5mcm9tLmdldFBvc2l0aW9uKCkrMVxuICAgICAgQGVkaXRvci51cGRhdGVDb250ZW50cyAobmV3IERlbHRhKFxuICAgICAgICBvcHM6IFtcbiAgICAgICAgICB7cmV0YWluOiByZXRhaW59LFxuICAgICAgICAgIHtyZXRhaW46IHNlbGVjdGlvbl9sZW5ndGgsIGF0dHJpYnV0ZXM6IGF0dHJzfVxuICAgICAgICBdKSlcblxuICAgICMgdXBkYXRlIHRoZSBlZGl0b3Igd2hlbiB0aGUgY3Vyc29yIGlzIG1vdmVkXG4gICAgQF9tb2RlbC5nZXRDb250ZW50KFwiY3Vyc29yc1wiKS5vYnNlcnZlIChldmVudHMpPT4gQGxvY2tlci50cnkgKCk9PlxuICAgICAgZm9yIGV2ZW50IGluIGV2ZW50c1xuICAgICAgICBpZiBldmVudC50eXBlIGlzIFwidXBkYXRlXCIgb3IgZXZlbnQudHlwZSBpcyBcImFkZFwiXG4gICAgICAgICAgYXV0aG9yID0gZXZlbnQuY2hhbmdlZEJ5XG4gICAgICAgICAgcmVmX3RvX2NoYXIgPSBldmVudC5vYmplY3QudmFsKGF1dGhvcilcbiAgICAgICAgICBpZiByZWZfdG9fY2hhciBpcyBudWxsXG4gICAgICAgICAgICBwb3NpdGlvbiA9IEBlZGl0b3IuZ2V0TGVuZ3RoKClcbiAgICAgICAgICBlbHNlIGlmIHJlZl90b19jaGFyP1xuICAgICAgICAgICAgaWYgcmVmX3RvX2NoYXIuaXNEZWxldGVkKClcbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHBvc2l0aW9uID0gcmVmX3RvX2NoYXIuZ2V0UG9zaXRpb24oKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGNvbnNvbGUud2FybiBcInJlZl90b19jaGFyIGlzIHVuZGVmaW5lZFwiXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgIHBhcmFtcyA9XG4gICAgICAgICAgICBpZDogYXV0aG9yXG4gICAgICAgICAgICBpbmRleDogcG9zaXRpb25cbiAgICAgICAgICAgIHRleHQ6IEBfcHJvdmlkZXJzPy5uYW1lUHJvdmlkZXI/KGF1dGhvcikgb3IgXCJEZWZhdWx0IHVzZXJcIlxuICAgICAgICAgICAgY29sb3I6IEBfcHJvdmlkZXJzPy5jb2xvclByb3ZpZGVyPyhhdXRob3IpIG9yIFwiZ3JleVwiXG5cbiAgICAgICAgICBAZWRpdG9yLnNldEN1cnNvciBwYXJhbXNcblxuICAgICAgICBlbHNlXG4gICAgICAgICAgQGVkaXRvci5yZW1vdmVDdXJzb3IgZXZlbnQubmFtZVxuXG4gICAgQF9tb2RlbC5jb25uZWN0b3Iub25Vc2VyRXZlbnQgKGV2ZW50KT0+XG4gICAgICBpZiBldmVudC5hY3Rpb24gaXMgXCJ1c2VyTGVmdFwiXG4gICAgICAgIEBfbW9kZWwuZ2V0Q29udGVudChcImN1cnNvcnNcIikuZGVsZXRlKGV2ZW50LnVzZXIpXG5cbiAgIyBBcHBseSBhIGRlbHRhIGFuZCByZXR1cm4gdGhlIG5ldyBwb3NpdGlvblxuICAjIEBwYXJhbSBkZWx0YSBbT2JqZWN0XSBhICpzaW5nbGUqIGRlbHRhIChzZWUgb3QtdHlwZXMgZm9yIG1vcmUgaW5mbylcbiAgIyBAcGFyYW0gcG9zaXRpb24gW0ludGVnZXJdIHN0YXJ0IHBvc2l0aW9uIGZvciB0aGUgZGVsdGEsIGRlZmF1bHQ6IDBcbiAgI1xuICAjIEByZXR1cm4gW0ludGVnZXJdIHRoZSBwb3NpdGlvbiBvZiB0aGUgY3Vyc29yIGFmdGVyIHBhcnNpbmcgdGhlIGRlbHRhXG4gIGRlbHRhSGVscGVyID0gKHRoaXNPYmosIGRlbHRhLCBwb3NpdGlvbiA9IDApIC0+XG4gICAgaWYgZGVsdGE/XG4gICAgICBzZWxlY3Rpb25zID0gdGhpc09iai5fbW9kZWwuZ2V0Q29udGVudChcInNlbGVjdGlvbnNcIilcbiAgICAgIGRlbHRhX3Vuc2VsZWN0aW9ucyA9IFtdXG4gICAgICBkZWx0YV9zZWxlY3Rpb25zID0ge31cbiAgICAgIGZvciBuLHYgb2YgZGVsdGEuYXR0cmlidXRlc1xuICAgICAgICBpZiB2P1xuICAgICAgICAgIGRlbHRhX3NlbGVjdGlvbnNbbl0gPSB2XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBkZWx0YV91bnNlbGVjdGlvbnMucHVzaCBuXG5cbiAgICAgIGlmIGRlbHRhLmluc2VydD9cbiAgICAgICAgaW5zZXJ0X2NvbnRlbnQgPSBkZWx0YS5pbnNlcnRcbiAgICAgICAgY29udGVudF9hcnJheSA9XG4gICAgICAgICAgaWYgdHlwZW9mIGluc2VydF9jb250ZW50IGlzIFwic3RyaW5nXCJcbiAgICAgICAgICAgIGluc2VydF9jb250ZW50LnNwbGl0KFwiXCIpXG4gICAgICAgICAgZWxzZSBpZiB0eXBlb2YgaW5zZXJ0X2NvbnRlbnQgaXMgXCJudW1iZXJcIlxuICAgICAgICAgICAgW2luc2VydF9jb250ZW50XVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIkdvdCBhbiB1bmV4cGVjdGVkIHZhbHVlIGluIGRlbHRhLmluc2VydCEgKFwiICtcbiAgICAgICAgICAgICh0eXBlb2YgY29udGVudCkgKyBcIilcIlxuICAgICAgICBpbnNlcnRIZWxwZXIgdGhpc09iaiwgcG9zaXRpb24sIGNvbnRlbnRfYXJyYXlcbiAgICAgICAgZnJvbVBvc2l0aW9uID0gZnJvbVxuICAgICAgICB0b1Bvc2l0aW9uID0gcG9zaXRpb24rY29udGVudF9hcnJheS5sZW5ndGgtMVxuICAgICAgICBmcm9tID0gdGhpc09iai5fbW9kZWwuZ2V0Q29udGVudChcImNoYXJhY3RlcnNcIikucmVmIHBvc2l0aW9uXG4gICAgICAgIHRvID0gdGhpc09iai5fbW9kZWwuZ2V0Q29udGVudChcImNoYXJhY3RlcnNcIikucmVmKFxuICAgICAgICAgIHBvc2l0aW9uK2NvbnRlbnRfYXJyYXkubGVuZ3RoLTEpXG4gICAgICAgICMgaW1wb3J0YW50LCBmaXJzdCB1bnNlbGVjdCwgdGhlbiBzZWxlY3QhXG4gICAgICAgIHRoaXNPYmouX21vZGVsLmdldENvbnRlbnQoXCJzZWxlY3Rpb25zXCIpLnVuc2VsZWN0KFxuICAgICAgICAgIGZyb20sIHRvLCBkZWx0YV91bnNlbGVjdGlvbnMpXG4gICAgICAgIHRoaXNPYmouX21vZGVsLmdldENvbnRlbnQoXCJzZWxlY3Rpb25zXCIpLnNlbGVjdChcbiAgICAgICAgICBmcm9tLCB0bywgZGVsdGFfc2VsZWN0aW9ucywgdHJ1ZSlcblxuXG4gICAgICAgIHJldHVybiBwb3NpdGlvbiArIGNvbnRlbnRfYXJyYXkubGVuZ3RoXG5cbiAgICAgIGVsc2UgaWYgZGVsdGEuZGVsZXRlP1xuICAgICAgICBkZWxldGVIZWxwZXIgdGhpc09iaiwgcG9zaXRpb24sIGRlbHRhLmRlbGV0ZVxuICAgICAgICByZXR1cm4gcG9zaXRpb25cblxuICAgICAgZWxzZSBpZiBkZWx0YS5yZXRhaW4/XG4gICAgICAgIHJldGFpbiA9IHBhcnNlSW50IGRlbHRhLnJldGFpblxuICAgICAgICBmcm9tID0gdGhpc09iai5fbW9kZWwuZ2V0Q29udGVudChcImNoYXJhY3RlcnNcIikucmVmKHBvc2l0aW9uKVxuICAgICAgICAjIHdlIHNldCBgcG9zaXRpb24rcmV0YWluLTFgLCAtMSBiZWNhdXNlIHdoZW4gc2VsZWN0aW5nIG9uZSBjaGFyLFxuICAgICAgICAjIFktc2VsZWN0aW9ucyB3aWxsIG9ubHkgbWFyayB0aGlzIG9uZSBjaGFyIChhcyBiZWdpbm5pbmcgYW5kIGVuZClcbiAgICAgICAgdG8gPSB0aGlzT2JqLl9tb2RlbC5nZXRDb250ZW50KFwiY2hhcmFjdGVyc1wiKS5yZWYocG9zaXRpb24gKyByZXRhaW4gLSAxKVxuICAgICAgICAjIGltcG9ydGFudCwgZmlyc3QgdW5zZWxlY3QsIHRoZW4gc2VsZWN0IVxuICAgICAgICB0aGlzT2JqLl9tb2RlbC5nZXRDb250ZW50KFwic2VsZWN0aW9uc1wiKS51bnNlbGVjdChcbiAgICAgICAgICBmcm9tLCB0bywgZGVsdGFfdW5zZWxlY3Rpb25zKVxuICAgICAgICB0aGlzT2JqLl9tb2RlbC5nZXRDb250ZW50KFwic2VsZWN0aW9uc1wiKS5zZWxlY3QoXG4gICAgICAgICAgZnJvbSwgdG8sIGRlbHRhX3NlbGVjdGlvbnMpXG5cblxuICAgICAgICByZXR1cm4gcG9zaXRpb24gKyByZXRhaW5cbiAgICAgIHRocm93IG5ldyBFcnJvciBcIlRoaXMgcGFydCBvZiBjb2RlIG11c3Qgbm90IGJlIHJlYWNoZWQhXCJcblxuICBpbnNlcnRIZWxwZXIgPSAodGhpc09iaiwgcG9zaXRpb24sIGNvbnRlbnRfYXJyYXkpIC0+XG4gICAgdGhpc09iai5fbW9kZWwuZ2V0Q29udGVudChcImNoYXJhY3RlcnNcIikuaW5zZXJ0Q29udGVudHMgcG9zaXRpb24sIGNvbnRlbnRfYXJyYXlcblxuICBkZWxldGVIZWxwZXIgPSAodGhpc09iaiwgcG9zaXRpb24sIGxlbmd0aCA9IDEpIC0+XG4gICAgdGhpc09iai5fbW9kZWwuZ2V0Q29udGVudChcImNoYXJhY3RlcnNcIikuZGVsZXRlIHBvc2l0aW9uLCBsZW5ndGhcblxuaWYgd2luZG93P1xuICBpZiB3aW5kb3cuWT9cbiAgICB3aW5kb3cuWS5SaWNoVGV4dCA9IFlSaWNoVGV4dFxuICBlbHNlXG4gICAgdGhyb3cgbmV3IEVycm9yIFwiWW91IG11c3QgZmlyc3QgaW1wb3J0IFkhXCJcblxuaWYgbW9kdWxlP1xuICBtb2R1bGUuZXhwb3J0cyA9IFlSaWNoVGV4dFxuIiwidmFyIGRpZmYgPSByZXF1aXJlKCdmYXN0LWRpZmYnKTtcbnZhciBpcyA9IHJlcXVpcmUoJy4vaXMnKTtcbnZhciBvcCA9IHJlcXVpcmUoJy4vb3AnKTtcblxuXG52YXIgTlVMTF9DSEFSQUNURVIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDApOyAgLy8gUGxhY2Vob2xkZXIgY2hhciBmb3IgZW1iZWQgaW4gZGlmZigpXG5cblxudmFyIERlbHRhID0gZnVuY3Rpb24gKG9wcykge1xuICAvLyBBc3N1bWUgd2UgYXJlIGdpdmVuIGEgd2VsbCBmb3JtZWQgb3BzXG4gIGlmIChpcy5hcnJheShvcHMpKSB7XG4gICAgdGhpcy5vcHMgPSBvcHM7XG4gIH0gZWxzZSBpZiAoaXMub2JqZWN0KG9wcykgJiYgaXMuYXJyYXkob3BzLm9wcykpIHtcbiAgICB0aGlzLm9wcyA9IG9wcy5vcHM7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5vcHMgPSBbXTtcbiAgfVxufTtcblxuXG5EZWx0YS5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24gKHRleHQsIGF0dHJpYnV0ZXMpIHtcbiAgdmFyIG5ld09wID0ge307XG4gIGlmICh0ZXh0Lmxlbmd0aCA9PT0gMCkgcmV0dXJuIHRoaXM7XG4gIG5ld09wLmluc2VydCA9IHRleHQ7XG4gIGlmIChpcy5vYmplY3QoYXR0cmlidXRlcykgJiYgT2JqZWN0LmtleXMoYXR0cmlidXRlcykubGVuZ3RoID4gMCkgbmV3T3AuYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXM7XG4gIHJldHVybiB0aGlzLnB1c2gobmV3T3ApO1xufTtcblxuRGVsdGEucHJvdG90eXBlWydkZWxldGUnXSA9IGZ1bmN0aW9uIChsZW5ndGgpIHtcbiAgaWYgKGxlbmd0aCA8PSAwKSByZXR1cm4gdGhpcztcbiAgcmV0dXJuIHRoaXMucHVzaCh7ICdkZWxldGUnOiBsZW5ndGggfSk7XG59O1xuXG5EZWx0YS5wcm90b3R5cGUucmV0YWluID0gZnVuY3Rpb24gKGxlbmd0aCwgYXR0cmlidXRlcykge1xuICBpZiAobGVuZ3RoIDw9IDApIHJldHVybiB0aGlzO1xuICB2YXIgbmV3T3AgPSB7IHJldGFpbjogbGVuZ3RoIH07XG4gIGlmIChpcy5vYmplY3QoYXR0cmlidXRlcykgJiYgT2JqZWN0LmtleXMoYXR0cmlidXRlcykubGVuZ3RoID4gMCkgbmV3T3AuYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXM7XG4gIHJldHVybiB0aGlzLnB1c2gobmV3T3ApO1xufTtcblxuRGVsdGEucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiAobmV3T3ApIHtcbiAgdmFyIGluZGV4ID0gdGhpcy5vcHMubGVuZ3RoO1xuICB2YXIgbGFzdE9wID0gdGhpcy5vcHNbaW5kZXggLSAxXTtcbiAgbmV3T3AgPSBvcC5jbG9uZShuZXdPcCk7XG4gIGlmIChpcy5vYmplY3QobGFzdE9wKSkge1xuICAgIGlmIChpcy5udW1iZXIobmV3T3BbJ2RlbGV0ZSddKSAmJiBpcy5udW1iZXIobGFzdE9wWydkZWxldGUnXSkpIHtcbiAgICAgIHRoaXMub3BzW2luZGV4IC0gMV0gPSB7ICdkZWxldGUnOiBsYXN0T3BbJ2RlbGV0ZSddICsgbmV3T3BbJ2RlbGV0ZSddIH07XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLy8gU2luY2UgaXQgZG9lcyBub3QgbWF0dGVyIGlmIHdlIGluc2VydCBiZWZvcmUgb3IgYWZ0ZXIgZGVsZXRpbmcgYXQgdGhlIHNhbWUgaW5kZXgsXG4gICAgLy8gYWx3YXlzIHByZWZlciB0byBpbnNlcnQgZmlyc3RcbiAgICBpZiAoaXMubnVtYmVyKGxhc3RPcFsnZGVsZXRlJ10pICYmIG5ld09wLmluc2VydCAhPSBudWxsKSB7XG4gICAgICBpbmRleCAtPSAxO1xuICAgICAgbGFzdE9wID0gdGhpcy5vcHNbaW5kZXggLSAxXTtcbiAgICAgIGlmICghaXMub2JqZWN0KGxhc3RPcCkpIHtcbiAgICAgICAgdGhpcy5vcHMudW5zaGlmdChuZXdPcCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXMuZXF1YWwobmV3T3AuYXR0cmlidXRlcywgbGFzdE9wLmF0dHJpYnV0ZXMpKSB7XG4gICAgICBpZiAoaXMuc3RyaW5nKG5ld09wLmluc2VydCkgJiYgaXMuc3RyaW5nKGxhc3RPcC5pbnNlcnQpKSB7XG4gICAgICAgIHRoaXMub3BzW2luZGV4IC0gMV0gPSB7IGluc2VydDogbGFzdE9wLmluc2VydCArIG5ld09wLmluc2VydCB9O1xuICAgICAgICBpZiAoaXMub2JqZWN0KG5ld09wLmF0dHJpYnV0ZXMpKSB0aGlzLm9wc1tpbmRleCAtIDFdLmF0dHJpYnV0ZXMgPSBuZXdPcC5hdHRyaWJ1dGVzXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfSBlbHNlIGlmIChpcy5udW1iZXIobmV3T3AucmV0YWluKSAmJiBpcy5udW1iZXIobGFzdE9wLnJldGFpbikpIHtcbiAgICAgICAgdGhpcy5vcHNbaW5kZXggLSAxXSA9IHsgcmV0YWluOiBsYXN0T3AucmV0YWluICsgbmV3T3AucmV0YWluIH07XG4gICAgICAgIGlmIChpcy5vYmplY3QobmV3T3AuYXR0cmlidXRlcykpIHRoaXMub3BzW2luZGV4IC0gMV0uYXR0cmlidXRlcyA9IG5ld09wLmF0dHJpYnV0ZXNcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmIChpbmRleCA9PT0gdGhpcy5vcHMubGVuZ3RoKSB7XG4gICAgdGhpcy5vcHMucHVzaChuZXdPcCk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5vcHMuc3BsaWNlKGluZGV4LCAwLCBuZXdPcCk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5EZWx0YS5wcm90b3R5cGUuY2hvcCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGxhc3RPcCA9IHRoaXMub3BzW3RoaXMub3BzLmxlbmd0aCAtIDFdO1xuICBpZiAobGFzdE9wICYmIGxhc3RPcC5yZXRhaW4gJiYgIWxhc3RPcC5hdHRyaWJ1dGVzKSB7XG4gICAgdGhpcy5vcHMucG9wKCk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5EZWx0YS5wcm90b3R5cGUubGVuZ3RoID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5vcHMucmVkdWNlKGZ1bmN0aW9uIChsZW5ndGgsIGVsZW0pIHtcbiAgICByZXR1cm4gbGVuZ3RoICsgb3AubGVuZ3RoKGVsZW0pO1xuICB9LCAwKTtcbn07XG5cbkRlbHRhLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uIChzdGFydCwgZW5kKSB7XG4gIHN0YXJ0ID0gc3RhcnQgfHwgMDtcbiAgaWYgKCFpcy5udW1iZXIoZW5kKSkgZW5kID0gSW5maW5pdHk7XG4gIHZhciBkZWx0YSA9IG5ldyBEZWx0YSgpO1xuICB2YXIgaXRlciA9IG9wLml0ZXJhdG9yKHRoaXMub3BzKTtcbiAgdmFyIGluZGV4ID0gMDtcbiAgd2hpbGUgKGluZGV4IDwgZW5kICYmIGl0ZXIuaGFzTmV4dCgpKSB7XG4gICAgdmFyIG5leHRPcDtcbiAgICBpZiAoaW5kZXggPCBzdGFydCkge1xuICAgICAgbmV4dE9wID0gaXRlci5uZXh0KHN0YXJ0IC0gaW5kZXgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXh0T3AgPSBpdGVyLm5leHQoZW5kIC0gaW5kZXgpO1xuICAgICAgZGVsdGEucHVzaChuZXh0T3ApO1xuICAgIH1cbiAgICBpbmRleCArPSBvcC5sZW5ndGgobmV4dE9wKTtcbiAgfVxuICByZXR1cm4gZGVsdGE7XG59O1xuXG5cbkRlbHRhLnByb3RvdHlwZS5jb21wb3NlID0gZnVuY3Rpb24gKG90aGVyKSB7XG4gIHZhciB0aGlzSXRlciA9IG9wLml0ZXJhdG9yKHRoaXMub3BzKTtcbiAgdmFyIG90aGVySXRlciA9IG9wLml0ZXJhdG9yKG90aGVyLm9wcyk7XG4gIHZhciBkZWx0YSA9IG5ldyBEZWx0YSgpO1xuICB3aGlsZSAodGhpc0l0ZXIuaGFzTmV4dCgpIHx8IG90aGVySXRlci5oYXNOZXh0KCkpIHtcbiAgICBpZiAob3RoZXJJdGVyLnBlZWtUeXBlKCkgPT09ICdpbnNlcnQnKSB7XG4gICAgICBkZWx0YS5wdXNoKG90aGVySXRlci5uZXh0KCkpO1xuICAgIH0gZWxzZSBpZiAodGhpc0l0ZXIucGVla1R5cGUoKSA9PT0gJ2RlbGV0ZScpIHtcbiAgICAgIGRlbHRhLnB1c2godGhpc0l0ZXIubmV4dCgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGxlbmd0aCA9IE1hdGgubWluKHRoaXNJdGVyLnBlZWtMZW5ndGgoKSwgb3RoZXJJdGVyLnBlZWtMZW5ndGgoKSk7XG4gICAgICB2YXIgdGhpc09wID0gdGhpc0l0ZXIubmV4dChsZW5ndGgpO1xuICAgICAgdmFyIG90aGVyT3AgPSBvdGhlckl0ZXIubmV4dChsZW5ndGgpO1xuICAgICAgaWYgKGlzLm51bWJlcihvdGhlck9wLnJldGFpbikpIHtcbiAgICAgICAgdmFyIG5ld09wID0ge307XG4gICAgICAgIGlmIChpcy5udW1iZXIodGhpc09wLnJldGFpbikpIHtcbiAgICAgICAgICBuZXdPcC5yZXRhaW4gPSBsZW5ndGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3T3AuaW5zZXJ0ID0gdGhpc09wLmluc2VydDtcbiAgICAgICAgfVxuICAgICAgICAvLyBQcmVzZXJ2ZSBudWxsIHdoZW4gY29tcG9zaW5nIHdpdGggYSByZXRhaW4sIG90aGVyd2lzZSByZW1vdmUgaXQgZm9yIGluc2VydHNcbiAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBvcC5hdHRyaWJ1dGVzLmNvbXBvc2UodGhpc09wLmF0dHJpYnV0ZXMsIG90aGVyT3AuYXR0cmlidXRlcywgaXMubnVtYmVyKHRoaXNPcC5yZXRhaW4pKTtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMpIG5ld09wLmF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzO1xuICAgICAgICBkZWx0YS5wdXNoKG5ld09wKTtcbiAgICAgIC8vIE90aGVyIG9wIHNob3VsZCBiZSBkZWxldGUsIHdlIGNvdWxkIGJlIGFuIGluc2VydCBvciByZXRhaW5cbiAgICAgIC8vIEluc2VydCArIGRlbGV0ZSBjYW5jZWxzIG91dFxuICAgICAgfSBlbHNlIGlmIChpcy5udW1iZXIob3RoZXJPcFsnZGVsZXRlJ10pICYmIGlzLm51bWJlcih0aGlzT3AucmV0YWluKSkge1xuICAgICAgICBkZWx0YS5wdXNoKG90aGVyT3ApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZGVsdGEuY2hvcCgpO1xufTtcblxuRGVsdGEucHJvdG90eXBlLmRpZmYgPSBmdW5jdGlvbiAob3RoZXIpIHtcbiAgdmFyIGRlbHRhID0gbmV3IERlbHRhKCk7XG4gIGlmICh0aGlzLm9wcyA9PT0gb3RoZXIub3BzKSB7XG4gICAgcmV0dXJuIGRlbHRhO1xuICB9XG4gIHZhciBzdHJpbmdzID0gW3RoaXMub3BzLCBvdGhlci5vcHNdLm1hcChmdW5jdGlvbiAob3BzKSB7XG4gICAgcmV0dXJuIG9wcy5tYXAoZnVuY3Rpb24gKG9wKSB7XG4gICAgICBpZiAob3AuaW5zZXJ0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGlzLnN0cmluZyhvcC5pbnNlcnQpID8gb3AuaW5zZXJ0IDogTlVMTF9DSEFSQUNURVI7XG4gICAgICB9XG4gICAgICB2YXIgcHJlcCA9IChvcHMgPT09IG90aGVyLm9wcykgPyAnb24nIDogJ3dpdGgnO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdkaWZmKCkgY2FsbGVkICcgKyBwcmVwICsgJyBub24tZG9jdW1lbnQnKTtcbiAgICB9KS5qb2luKCcnKTtcbiAgfSk7XG4gIHZhciBkaWZmUmVzdWx0ID0gZGlmZihzdHJpbmdzWzBdLCBzdHJpbmdzWzFdKTtcbiAgdmFyIHRoaXNJdGVyID0gb3AuaXRlcmF0b3IodGhpcy5vcHMpO1xuICB2YXIgb3RoZXJJdGVyID0gb3AuaXRlcmF0b3Iob3RoZXIub3BzKTtcbiAgZGlmZlJlc3VsdC5mb3JFYWNoKGZ1bmN0aW9uIChjb21wb25lbnQpIHtcbiAgICB2YXIgbGVuZ3RoID0gY29tcG9uZW50WzFdLmxlbmd0aDtcbiAgICB3aGlsZSAobGVuZ3RoID4gMCkge1xuICAgICAgdmFyIG9wTGVuZ3RoID0gMDtcbiAgICAgIHN3aXRjaCAoY29tcG9uZW50WzBdKSB7XG4gICAgICAgIGNhc2UgZGlmZi5JTlNFUlQ6XG4gICAgICAgICAgb3BMZW5ndGggPSBNYXRoLm1pbihvdGhlckl0ZXIucGVla0xlbmd0aCgpLCBsZW5ndGgpO1xuICAgICAgICAgIGRlbHRhLnB1c2gob3RoZXJJdGVyLm5leHQob3BMZW5ndGgpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBkaWZmLkRFTEVURTpcbiAgICAgICAgICBvcExlbmd0aCA9IE1hdGgubWluKGxlbmd0aCwgdGhpc0l0ZXIucGVla0xlbmd0aCgpKTtcbiAgICAgICAgICB0aGlzSXRlci5uZXh0KG9wTGVuZ3RoKTtcbiAgICAgICAgICBkZWx0YVsnZGVsZXRlJ10ob3BMZW5ndGgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIGRpZmYuRVFVQUw6XG4gICAgICAgICAgb3BMZW5ndGggPSBNYXRoLm1pbih0aGlzSXRlci5wZWVrTGVuZ3RoKCksIG90aGVySXRlci5wZWVrTGVuZ3RoKCksIGxlbmd0aCk7XG4gICAgICAgICAgdmFyIHRoaXNPcCA9IHRoaXNJdGVyLm5leHQob3BMZW5ndGgpO1xuICAgICAgICAgIHZhciBvdGhlck9wID0gb3RoZXJJdGVyLm5leHQob3BMZW5ndGgpO1xuICAgICAgICAgIGlmIChpcy5lcXVhbCh0aGlzT3AuaW5zZXJ0LCBvdGhlck9wLmluc2VydCkpIHtcbiAgICAgICAgICAgIGRlbHRhLnJldGFpbihvcExlbmd0aCwgb3AuYXR0cmlidXRlcy5kaWZmKHRoaXNPcC5hdHRyaWJ1dGVzLCBvdGhlck9wLmF0dHJpYnV0ZXMpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVsdGEucHVzaChvdGhlck9wKVsnZGVsZXRlJ10ob3BMZW5ndGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGxlbmd0aCAtPSBvcExlbmd0aDtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZGVsdGEuY2hvcCgpO1xufTtcblxuRGVsdGEucHJvdG90eXBlLnRyYW5zZm9ybSA9IGZ1bmN0aW9uIChvdGhlciwgcHJpb3JpdHkpIHtcbiAgcHJpb3JpdHkgPSAhIXByaW9yaXR5O1xuICBpZiAoaXMubnVtYmVyKG90aGVyKSkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybVBvc2l0aW9uKG90aGVyLCBwcmlvcml0eSk7XG4gIH1cbiAgdmFyIHRoaXNJdGVyID0gb3AuaXRlcmF0b3IodGhpcy5vcHMpO1xuICB2YXIgb3RoZXJJdGVyID0gb3AuaXRlcmF0b3Iob3RoZXIub3BzKTtcbiAgdmFyIGRlbHRhID0gbmV3IERlbHRhKCk7XG4gIHdoaWxlICh0aGlzSXRlci5oYXNOZXh0KCkgfHwgb3RoZXJJdGVyLmhhc05leHQoKSkge1xuICAgIGlmICh0aGlzSXRlci5wZWVrVHlwZSgpID09PSAnaW5zZXJ0JyAmJiAocHJpb3JpdHkgfHwgb3RoZXJJdGVyLnBlZWtUeXBlKCkgIT09ICdpbnNlcnQnKSkge1xuICAgICAgZGVsdGEucmV0YWluKG9wLmxlbmd0aCh0aGlzSXRlci5uZXh0KCkpKTtcbiAgICB9IGVsc2UgaWYgKG90aGVySXRlci5wZWVrVHlwZSgpID09PSAnaW5zZXJ0Jykge1xuICAgICAgZGVsdGEucHVzaChvdGhlckl0ZXIubmV4dCgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGxlbmd0aCA9IE1hdGgubWluKHRoaXNJdGVyLnBlZWtMZW5ndGgoKSwgb3RoZXJJdGVyLnBlZWtMZW5ndGgoKSk7XG4gICAgICB2YXIgdGhpc09wID0gdGhpc0l0ZXIubmV4dChsZW5ndGgpO1xuICAgICAgdmFyIG90aGVyT3AgPSBvdGhlckl0ZXIubmV4dChsZW5ndGgpO1xuICAgICAgaWYgKHRoaXNPcFsnZGVsZXRlJ10pIHtcbiAgICAgICAgLy8gT3VyIGRlbGV0ZSBlaXRoZXIgbWFrZXMgdGhlaXIgZGVsZXRlIHJlZHVuZGFudCBvciByZW1vdmVzIHRoZWlyIHJldGFpblxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH0gZWxzZSBpZiAob3RoZXJPcFsnZGVsZXRlJ10pIHtcbiAgICAgICAgZGVsdGEucHVzaChvdGhlck9wKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFdlIHJldGFpbiBlaXRoZXIgdGhlaXIgcmV0YWluIG9yIGluc2VydFxuICAgICAgICBkZWx0YS5yZXRhaW4obGVuZ3RoLCBvcC5hdHRyaWJ1dGVzLnRyYW5zZm9ybSh0aGlzT3AuYXR0cmlidXRlcywgb3RoZXJPcC5hdHRyaWJ1dGVzLCBwcmlvcml0eSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZGVsdGEuY2hvcCgpO1xufTtcblxuRGVsdGEucHJvdG90eXBlLnRyYW5zZm9ybVBvc2l0aW9uID0gZnVuY3Rpb24gKGluZGV4LCBwcmlvcml0eSkge1xuICBwcmlvcml0eSA9ICEhcHJpb3JpdHk7XG4gIHZhciB0aGlzSXRlciA9IG9wLml0ZXJhdG9yKHRoaXMub3BzKTtcbiAgdmFyIG9mZnNldCA9IDA7XG4gIHdoaWxlICh0aGlzSXRlci5oYXNOZXh0KCkgJiYgb2Zmc2V0IDw9IGluZGV4KSB7XG4gICAgdmFyIGxlbmd0aCA9IHRoaXNJdGVyLnBlZWtMZW5ndGgoKTtcbiAgICB2YXIgbmV4dFR5cGUgPSB0aGlzSXRlci5wZWVrVHlwZSgpO1xuICAgIHRoaXNJdGVyLm5leHQoKTtcbiAgICBpZiAobmV4dFR5cGUgPT09ICdkZWxldGUnKSB7XG4gICAgICBpbmRleCAtPSBNYXRoLm1pbihsZW5ndGgsIGluZGV4IC0gb2Zmc2V0KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH0gZWxzZSBpZiAobmV4dFR5cGUgPT09ICdpbnNlcnQnICYmIChvZmZzZXQgPCBpbmRleCB8fCAhcHJpb3JpdHkpKSB7XG4gICAgICBpbmRleCArPSBsZW5ndGg7XG4gICAgfVxuICAgIG9mZnNldCArPSBsZW5ndGg7XG4gIH1cbiAgcmV0dXJuIGluZGV4O1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IERlbHRhO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGVxdWFsOiBmdW5jdGlvbiAoYSwgYikge1xuICAgIGlmIChhID09PSBiKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoYSA9PSBudWxsICYmIGIgPT0gbnVsbCkgcmV0dXJuIHRydWU7XG4gICAgaWYgKGEgPT0gbnVsbCB8fCBiID09IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoIXRoaXMub2JqZWN0KGEpIHx8ICF0aGlzLm9iamVjdChiKSkgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChPYmplY3Qua2V5cyhhKS5sZW5ndGggIT0gT2JqZWN0LmtleXMoYikubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgZm9yKHZhciBrZXkgaW4gYSkge1xuICAgICAgLy8gT25seSBjb21wYXJlIG9uZSBsZXZlbCBkZWVwXG4gICAgICBpZiAoYVtrZXldICE9PSBiW2tleV0pIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG5cbiAgYXJyYXk6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKTtcbiAgfSxcblxuICBudW1iZXI6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBOdW1iZXJdJykgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuXG4gIG9iamVjdDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgaWYgKCF2YWx1ZSkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpO1xuICB9LFxuXG4gIHN0cmluZzogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHJldHVybiB0cnVlO1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IFN0cmluZ10nKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG4iLCJ2YXIgaXMgPSByZXF1aXJlKCcuL2lzJyk7XG5cblxudmFyIGxpYiA9IHtcbiAgYXR0cmlidXRlczoge1xuICAgIGNsb25lOiBmdW5jdGlvbiAoYXR0cmlidXRlcywga2VlcE51bGwpIHtcbiAgICAgIGlmICghaXMub2JqZWN0KGF0dHJpYnV0ZXMpKSByZXR1cm4ge307XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXMoYXR0cmlidXRlcykucmVkdWNlKGZ1bmN0aW9uIChtZW1vLCBrZXkpIHtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXNba2V5XSAhPT0gdW5kZWZpbmVkICYmIChhdHRyaWJ1dGVzW2tleV0gIT09IG51bGwgfHwga2VlcE51bGwpKSB7XG4gICAgICAgICAgbWVtb1trZXldID0gYXR0cmlidXRlc1trZXldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtZW1vO1xuICAgICAgfSwge30pO1xuICAgIH0sXG5cbiAgICBjb21wb3NlOiBmdW5jdGlvbiAoYSwgYiwga2VlcE51bGwpIHtcbiAgICAgIGlmICghaXMub2JqZWN0KGEpKSBhID0ge307XG4gICAgICBpZiAoIWlzLm9iamVjdChiKSkgYiA9IHt9O1xuICAgICAgdmFyIGF0dHJpYnV0ZXMgPSB0aGlzLmNsb25lKGIsIGtlZXBOdWxsKTtcbiAgICAgIGZvciAodmFyIGtleSBpbiBhKSB7XG4gICAgICAgIGlmIChhW2tleV0gIT09IHVuZGVmaW5lZCAmJiBiW2tleV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGF0dHJpYnV0ZXNba2V5XSA9IGFba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLmxlbmd0aCA+IDAgPyBhdHRyaWJ1dGVzIDogdW5kZWZpbmVkO1xuICAgIH0sXG5cbiAgICBkaWZmOiBmdW5jdGlvbihhLCBiKSB7XG4gICAgICBpZiAoIWlzLm9iamVjdChhKSkgYSA9IHt9O1xuICAgICAgaWYgKCFpcy5vYmplY3QoYikpIGIgPSB7fTtcbiAgICAgIHZhciBhdHRyaWJ1dGVzID0gT2JqZWN0LmtleXMoYSkuY29uY2F0KE9iamVjdC5rZXlzKGIpKS5yZWR1Y2UoZnVuY3Rpb24gKGF0dHJpYnV0ZXMsIGtleSkge1xuICAgICAgICBpZiAoYVtrZXldICE9PSBiW2tleV0pIHtcbiAgICAgICAgICBhdHRyaWJ1dGVzW2tleV0gPSBiW2tleV0gPT09IHVuZGVmaW5lZCA/IG51bGwgOiBiW2tleV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZXM7XG4gICAgICB9LCB7fSk7XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXMoYXR0cmlidXRlcykubGVuZ3RoID4gMCA/IGF0dHJpYnV0ZXMgOiB1bmRlZmluZWQ7XG4gICAgfSxcblxuICAgIHRyYW5zZm9ybTogZnVuY3Rpb24gKGEsIGIsIHByaW9yaXR5KSB7XG4gICAgICBpZiAoIWlzLm9iamVjdChhKSkgcmV0dXJuIGI7XG4gICAgICBpZiAoIWlzLm9iamVjdChiKSkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIGlmICghcHJpb3JpdHkpIHJldHVybiBiOyAgLy8gYiBzaW1wbHkgb3ZlcndyaXRlcyB1cyB3aXRob3V0IHByaW9yaXR5XG4gICAgICB2YXIgYXR0cmlidXRlcyA9IE9iamVjdC5rZXlzKGIpLnJlZHVjZShmdW5jdGlvbiAoYXR0cmlidXRlcywga2V5KSB7XG4gICAgICAgIGlmIChhW2tleV0gPT09IHVuZGVmaW5lZCkgYXR0cmlidXRlc1trZXldID0gYltrZXldOyAgLy8gbnVsbCBpcyBhIHZhbGlkIHZhbHVlXG4gICAgICAgIHJldHVybiBhdHRyaWJ1dGVzO1xuICAgICAgfSwge30pO1xuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLmxlbmd0aCA+IDAgPyBhdHRyaWJ1dGVzIDogdW5kZWZpbmVkO1xuICAgIH1cbiAgfSxcblxuICBjbG9uZTogZnVuY3Rpb24gKG9wKSB7XG4gICAgdmFyIG5ld09wID0gdGhpcy5hdHRyaWJ1dGVzLmNsb25lKG9wKTtcbiAgICBpZiAoaXMub2JqZWN0KG5ld09wLmF0dHJpYnV0ZXMpKSB7XG4gICAgICBuZXdPcC5hdHRyaWJ1dGVzID0gdGhpcy5hdHRyaWJ1dGVzLmNsb25lKG5ld09wLmF0dHJpYnV0ZXMsIHRydWUpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3T3A7XG4gIH0sXG5cbiAgaXRlcmF0b3I6IGZ1bmN0aW9uIChvcHMpIHtcbiAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKG9wcyk7XG4gIH0sXG5cbiAgbGVuZ3RoOiBmdW5jdGlvbiAob3ApIHtcbiAgICBpZiAoaXMubnVtYmVyKG9wWydkZWxldGUnXSkpIHtcbiAgICAgIHJldHVybiBvcFsnZGVsZXRlJ107XG4gICAgfSBlbHNlIGlmIChpcy5udW1iZXIob3AucmV0YWluKSkge1xuICAgICAgcmV0dXJuIG9wLnJldGFpbjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGlzLnN0cmluZyhvcC5pbnNlcnQpID8gb3AuaW5zZXJ0Lmxlbmd0aCA6IDE7XG4gICAgfVxuICB9XG59O1xuXG5cbmZ1bmN0aW9uIEl0ZXJhdG9yKG9wcykge1xuICB0aGlzLm9wcyA9IG9wcztcbiAgdGhpcy5pbmRleCA9IDA7XG4gIHRoaXMub2Zmc2V0ID0gMDtcbn07XG5cbkl0ZXJhdG9yLnByb3RvdHlwZS5oYXNOZXh0ID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5wZWVrTGVuZ3RoKCkgPCBJbmZpbml0eTtcbn07XG5cbkl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKGxlbmd0aCkge1xuICBpZiAoIWxlbmd0aCkgbGVuZ3RoID0gSW5maW5pdHk7XG4gIHZhciBuZXh0T3AgPSB0aGlzLm9wc1t0aGlzLmluZGV4XTtcbiAgaWYgKG5leHRPcCkge1xuICAgIHZhciBvZmZzZXQgPSB0aGlzLm9mZnNldDtcbiAgICB2YXIgb3BMZW5ndGggPSBsaWIubGVuZ3RoKG5leHRPcClcbiAgICBpZiAobGVuZ3RoID49IG9wTGVuZ3RoIC0gb2Zmc2V0KSB7XG4gICAgICBsZW5ndGggPSBvcExlbmd0aCAtIG9mZnNldDtcbiAgICAgIHRoaXMuaW5kZXggKz0gMTtcbiAgICAgIHRoaXMub2Zmc2V0ID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vZmZzZXQgKz0gbGVuZ3RoO1xuICAgIH1cbiAgICBpZiAoaXMubnVtYmVyKG5leHRPcFsnZGVsZXRlJ10pKSB7XG4gICAgICByZXR1cm4geyAnZGVsZXRlJzogbGVuZ3RoIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciByZXRPcCA9IHt9O1xuICAgICAgaWYgKG5leHRPcC5hdHRyaWJ1dGVzKSB7XG4gICAgICAgIHJldE9wLmF0dHJpYnV0ZXMgPSBuZXh0T3AuYXR0cmlidXRlcztcbiAgICAgIH1cbiAgICAgIGlmIChpcy5udW1iZXIobmV4dE9wLnJldGFpbikpIHtcbiAgICAgICAgcmV0T3AucmV0YWluID0gbGVuZ3RoO1xuICAgICAgfSBlbHNlIGlmIChpcy5zdHJpbmcobmV4dE9wLmluc2VydCkpIHtcbiAgICAgICAgcmV0T3AuaW5zZXJ0ID0gbmV4dE9wLmluc2VydC5zdWJzdHIob2Zmc2V0LCBsZW5ndGgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gb2Zmc2V0IHNob3VsZCA9PT0gMCwgbGVuZ3RoIHNob3VsZCA9PT0gMVxuICAgICAgICByZXRPcC5pbnNlcnQgPSBuZXh0T3AuaW5zZXJ0O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJldE9wO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4geyByZXRhaW46IEluZmluaXR5IH07XG4gIH1cbn07XG5cbkl0ZXJhdG9yLnByb3RvdHlwZS5wZWVrTGVuZ3RoID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5vcHNbdGhpcy5pbmRleF0pIHtcbiAgICAvLyBTaG91bGQgbmV2ZXIgcmV0dXJuIDAgaWYgb3VyIGluZGV4IGlzIGJlaW5nIG1hbmFnZWQgY29ycmVjdGx5XG4gICAgcmV0dXJuIGxpYi5sZW5ndGgodGhpcy5vcHNbdGhpcy5pbmRleF0pIC0gdGhpcy5vZmZzZXQ7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIEluZmluaXR5O1xuICB9XG59O1xuXG5JdGVyYXRvci5wcm90b3R5cGUucGVla1R5cGUgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLm9wc1t0aGlzLmluZGV4XSkge1xuICAgIGlmIChpcy5udW1iZXIodGhpcy5vcHNbdGhpcy5pbmRleF1bJ2RlbGV0ZSddKSkge1xuICAgICAgcmV0dXJuICdkZWxldGUnO1xuICAgIH0gZWxzZSBpZiAoaXMubnVtYmVyKHRoaXMub3BzW3RoaXMuaW5kZXhdLnJldGFpbikpIHtcbiAgICAgIHJldHVybiAncmV0YWluJztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICdpbnNlcnQnO1xuICAgIH1cbiAgfVxuICByZXR1cm4gJ3JldGFpbic7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gbGliO1xuIiwiLyoqXG4gKiBUaGlzIGxpYnJhcnkgbW9kaWZpZXMgdGhlIGRpZmYtcGF0Y2gtbWF0Y2ggbGlicmFyeSBieSBOZWlsIEZyYXNlclxuICogYnkgcmVtb3ZpbmcgdGhlIHBhdGNoIGFuZCBtYXRjaCBmdW5jdGlvbmFsaXR5IGFuZCBjZXJ0YWluIGFkdmFuY2VkXG4gKiBvcHRpb25zIGluIHRoZSBkaWZmIGZ1bmN0aW9uLiBUaGUgb3JpZ2luYWwgbGljZW5zZSBpcyBhcyBmb2xsb3dzOlxuICpcbiAqID09PVxuICpcbiAqIERpZmYgTWF0Y2ggYW5kIFBhdGNoXG4gKlxuICogQ29weXJpZ2h0IDIwMDYgR29vZ2xlIEluYy5cbiAqIGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC9nb29nbGUtZGlmZi1tYXRjaC1wYXRjaC9cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cblxuLyoqXG4gKiBUaGUgZGF0YSBzdHJ1Y3R1cmUgcmVwcmVzZW50aW5nIGEgZGlmZiBpcyBhbiBhcnJheSBvZiB0dXBsZXM6XG4gKiBbW0RJRkZfREVMRVRFLCAnSGVsbG8nXSwgW0RJRkZfSU5TRVJULCAnR29vZGJ5ZSddLCBbRElGRl9FUVVBTCwgJyB3b3JsZC4nXV1cbiAqIHdoaWNoIG1lYW5zOiBkZWxldGUgJ0hlbGxvJywgYWRkICdHb29kYnllJyBhbmQga2VlcCAnIHdvcmxkLidcbiAqL1xudmFyIERJRkZfREVMRVRFID0gLTE7XG52YXIgRElGRl9JTlNFUlQgPSAxO1xudmFyIERJRkZfRVFVQUwgPSAwO1xuXG5cbi8qKlxuICogRmluZCB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiB0d28gdGV4dHMuICBTaW1wbGlmaWVzIHRoZSBwcm9ibGVtIGJ5IHN0cmlwcGluZ1xuICogYW55IGNvbW1vbiBwcmVmaXggb3Igc3VmZml4IG9mZiB0aGUgdGV4dHMgYmVmb3JlIGRpZmZpbmcuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dDEgT2xkIHN0cmluZyB0byBiZSBkaWZmZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dDIgTmV3IHN0cmluZyB0byBiZSBkaWZmZWQuXG4gKiBAcmV0dXJuIHtBcnJheX0gQXJyYXkgb2YgZGlmZiB0dXBsZXMuXG4gKi9cbmZ1bmN0aW9uIGRpZmZfbWFpbih0ZXh0MSwgdGV4dDIpIHtcbiAgLy8gQ2hlY2sgZm9yIGVxdWFsaXR5IChzcGVlZHVwKS5cbiAgaWYgKHRleHQxID09IHRleHQyKSB7XG4gICAgaWYgKHRleHQxKSB7XG4gICAgICByZXR1cm4gW1tESUZGX0VRVUFMLCB0ZXh0MV1dO1xuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cblxuICAvLyBUcmltIG9mZiBjb21tb24gcHJlZml4IChzcGVlZHVwKS5cbiAgdmFyIGNvbW1vbmxlbmd0aCA9IGRpZmZfY29tbW9uUHJlZml4KHRleHQxLCB0ZXh0Mik7XG4gIHZhciBjb21tb25wcmVmaXggPSB0ZXh0MS5zdWJzdHJpbmcoMCwgY29tbW9ubGVuZ3RoKTtcbiAgdGV4dDEgPSB0ZXh0MS5zdWJzdHJpbmcoY29tbW9ubGVuZ3RoKTtcbiAgdGV4dDIgPSB0ZXh0Mi5zdWJzdHJpbmcoY29tbW9ubGVuZ3RoKTtcblxuICAvLyBUcmltIG9mZiBjb21tb24gc3VmZml4IChzcGVlZHVwKS5cbiAgY29tbW9ubGVuZ3RoID0gZGlmZl9jb21tb25TdWZmaXgodGV4dDEsIHRleHQyKTtcbiAgdmFyIGNvbW1vbnN1ZmZpeCA9IHRleHQxLnN1YnN0cmluZyh0ZXh0MS5sZW5ndGggLSBjb21tb25sZW5ndGgpO1xuICB0ZXh0MSA9IHRleHQxLnN1YnN0cmluZygwLCB0ZXh0MS5sZW5ndGggLSBjb21tb25sZW5ndGgpO1xuICB0ZXh0MiA9IHRleHQyLnN1YnN0cmluZygwLCB0ZXh0Mi5sZW5ndGggLSBjb21tb25sZW5ndGgpO1xuXG4gIC8vIENvbXB1dGUgdGhlIGRpZmYgb24gdGhlIG1pZGRsZSBibG9jay5cbiAgdmFyIGRpZmZzID0gZGlmZl9jb21wdXRlXyh0ZXh0MSwgdGV4dDIpO1xuXG4gIC8vIFJlc3RvcmUgdGhlIHByZWZpeCBhbmQgc3VmZml4LlxuICBpZiAoY29tbW9ucHJlZml4KSB7XG4gICAgZGlmZnMudW5zaGlmdChbRElGRl9FUVVBTCwgY29tbW9ucHJlZml4XSk7XG4gIH1cbiAgaWYgKGNvbW1vbnN1ZmZpeCkge1xuICAgIGRpZmZzLnB1c2goW0RJRkZfRVFVQUwsIGNvbW1vbnN1ZmZpeF0pO1xuICB9XG4gIGRpZmZfY2xlYW51cE1lcmdlKGRpZmZzKTtcbiAgcmV0dXJuIGRpZmZzO1xufTtcblxuXG4vKipcbiAqIEZpbmQgdGhlIGRpZmZlcmVuY2VzIGJldHdlZW4gdHdvIHRleHRzLiAgQXNzdW1lcyB0aGF0IHRoZSB0ZXh0cyBkbyBub3RcbiAqIGhhdmUgYW55IGNvbW1vbiBwcmVmaXggb3Igc3VmZml4LlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQxIE9sZCBzdHJpbmcgdG8gYmUgZGlmZmVkLlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQyIE5ldyBzdHJpbmcgdG8gYmUgZGlmZmVkLlxuICogQHJldHVybiB7QXJyYXl9IEFycmF5IG9mIGRpZmYgdHVwbGVzLlxuICovXG5mdW5jdGlvbiBkaWZmX2NvbXB1dGVfKHRleHQxLCB0ZXh0Mikge1xuICB2YXIgZGlmZnM7XG5cbiAgaWYgKCF0ZXh0MSkge1xuICAgIC8vIEp1c3QgYWRkIHNvbWUgdGV4dCAoc3BlZWR1cCkuXG4gICAgcmV0dXJuIFtbRElGRl9JTlNFUlQsIHRleHQyXV07XG4gIH1cblxuICBpZiAoIXRleHQyKSB7XG4gICAgLy8gSnVzdCBkZWxldGUgc29tZSB0ZXh0IChzcGVlZHVwKS5cbiAgICByZXR1cm4gW1tESUZGX0RFTEVURSwgdGV4dDFdXTtcbiAgfVxuXG4gIHZhciBsb25ndGV4dCA9IHRleHQxLmxlbmd0aCA+IHRleHQyLmxlbmd0aCA/IHRleHQxIDogdGV4dDI7XG4gIHZhciBzaG9ydHRleHQgPSB0ZXh0MS5sZW5ndGggPiB0ZXh0Mi5sZW5ndGggPyB0ZXh0MiA6IHRleHQxO1xuICB2YXIgaSA9IGxvbmd0ZXh0LmluZGV4T2Yoc2hvcnR0ZXh0KTtcbiAgaWYgKGkgIT0gLTEpIHtcbiAgICAvLyBTaG9ydGVyIHRleHQgaXMgaW5zaWRlIHRoZSBsb25nZXIgdGV4dCAoc3BlZWR1cCkuXG4gICAgZGlmZnMgPSBbW0RJRkZfSU5TRVJULCBsb25ndGV4dC5zdWJzdHJpbmcoMCwgaSldLFxuICAgICAgICAgICAgIFtESUZGX0VRVUFMLCBzaG9ydHRleHRdLFxuICAgICAgICAgICAgIFtESUZGX0lOU0VSVCwgbG9uZ3RleHQuc3Vic3RyaW5nKGkgKyBzaG9ydHRleHQubGVuZ3RoKV1dO1xuICAgIC8vIFN3YXAgaW5zZXJ0aW9ucyBmb3IgZGVsZXRpb25zIGlmIGRpZmYgaXMgcmV2ZXJzZWQuXG4gICAgaWYgKHRleHQxLmxlbmd0aCA+IHRleHQyLmxlbmd0aCkge1xuICAgICAgZGlmZnNbMF1bMF0gPSBkaWZmc1syXVswXSA9IERJRkZfREVMRVRFO1xuICAgIH1cbiAgICByZXR1cm4gZGlmZnM7XG4gIH1cblxuICBpZiAoc2hvcnR0ZXh0Lmxlbmd0aCA9PSAxKSB7XG4gICAgLy8gU2luZ2xlIGNoYXJhY3RlciBzdHJpbmcuXG4gICAgLy8gQWZ0ZXIgdGhlIHByZXZpb3VzIHNwZWVkdXAsIHRoZSBjaGFyYWN0ZXIgY2FuJ3QgYmUgYW4gZXF1YWxpdHkuXG4gICAgcmV0dXJuIFtbRElGRl9ERUxFVEUsIHRleHQxXSwgW0RJRkZfSU5TRVJULCB0ZXh0Ml1dO1xuICB9XG5cbiAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBwcm9ibGVtIGNhbiBiZSBzcGxpdCBpbiB0d28uXG4gIHZhciBobSA9IGRpZmZfaGFsZk1hdGNoXyh0ZXh0MSwgdGV4dDIpO1xuICBpZiAoaG0pIHtcbiAgICAvLyBBIGhhbGYtbWF0Y2ggd2FzIGZvdW5kLCBzb3J0IG91dCB0aGUgcmV0dXJuIGRhdGEuXG4gICAgdmFyIHRleHQxX2EgPSBobVswXTtcbiAgICB2YXIgdGV4dDFfYiA9IGhtWzFdO1xuICAgIHZhciB0ZXh0Ml9hID0gaG1bMl07XG4gICAgdmFyIHRleHQyX2IgPSBobVszXTtcbiAgICB2YXIgbWlkX2NvbW1vbiA9IGhtWzRdO1xuICAgIC8vIFNlbmQgYm90aCBwYWlycyBvZmYgZm9yIHNlcGFyYXRlIHByb2Nlc3NpbmcuXG4gICAgdmFyIGRpZmZzX2EgPSBkaWZmX21haW4odGV4dDFfYSwgdGV4dDJfYSk7XG4gICAgdmFyIGRpZmZzX2IgPSBkaWZmX21haW4odGV4dDFfYiwgdGV4dDJfYik7XG4gICAgLy8gTWVyZ2UgdGhlIHJlc3VsdHMuXG4gICAgcmV0dXJuIGRpZmZzX2EuY29uY2F0KFtbRElGRl9FUVVBTCwgbWlkX2NvbW1vbl1dLCBkaWZmc19iKTtcbiAgfVxuXG4gIHJldHVybiBkaWZmX2Jpc2VjdF8odGV4dDEsIHRleHQyKTtcbn07XG5cblxuLyoqXG4gKiBGaW5kIHRoZSAnbWlkZGxlIHNuYWtlJyBvZiBhIGRpZmYsIHNwbGl0IHRoZSBwcm9ibGVtIGluIHR3b1xuICogYW5kIHJldHVybiB0aGUgcmVjdXJzaXZlbHkgY29uc3RydWN0ZWQgZGlmZi5cbiAqIFNlZSBNeWVycyAxOTg2IHBhcGVyOiBBbiBPKE5EKSBEaWZmZXJlbmNlIEFsZ29yaXRobSBhbmQgSXRzIFZhcmlhdGlvbnMuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dDEgT2xkIHN0cmluZyB0byBiZSBkaWZmZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dDIgTmV3IHN0cmluZyB0byBiZSBkaWZmZWQuXG4gKiBAcmV0dXJuIHtBcnJheX0gQXJyYXkgb2YgZGlmZiB0dXBsZXMuXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBkaWZmX2Jpc2VjdF8odGV4dDEsIHRleHQyKSB7XG4gIC8vIENhY2hlIHRoZSB0ZXh0IGxlbmd0aHMgdG8gcHJldmVudCBtdWx0aXBsZSBjYWxscy5cbiAgdmFyIHRleHQxX2xlbmd0aCA9IHRleHQxLmxlbmd0aDtcbiAgdmFyIHRleHQyX2xlbmd0aCA9IHRleHQyLmxlbmd0aDtcbiAgdmFyIG1heF9kID0gTWF0aC5jZWlsKCh0ZXh0MV9sZW5ndGggKyB0ZXh0Ml9sZW5ndGgpIC8gMik7XG4gIHZhciB2X29mZnNldCA9IG1heF9kO1xuICB2YXIgdl9sZW5ndGggPSAyICogbWF4X2Q7XG4gIHZhciB2MSA9IG5ldyBBcnJheSh2X2xlbmd0aCk7XG4gIHZhciB2MiA9IG5ldyBBcnJheSh2X2xlbmd0aCk7XG4gIC8vIFNldHRpbmcgYWxsIGVsZW1lbnRzIHRvIC0xIGlzIGZhc3RlciBpbiBDaHJvbWUgJiBGaXJlZm94IHRoYW4gbWl4aW5nXG4gIC8vIGludGVnZXJzIGFuZCB1bmRlZmluZWQuXG4gIGZvciAodmFyIHggPSAwOyB4IDwgdl9sZW5ndGg7IHgrKykge1xuICAgIHYxW3hdID0gLTE7XG4gICAgdjJbeF0gPSAtMTtcbiAgfVxuICB2MVt2X29mZnNldCArIDFdID0gMDtcbiAgdjJbdl9vZmZzZXQgKyAxXSA9IDA7XG4gIHZhciBkZWx0YSA9IHRleHQxX2xlbmd0aCAtIHRleHQyX2xlbmd0aDtcbiAgLy8gSWYgdGhlIHRvdGFsIG51bWJlciBvZiBjaGFyYWN0ZXJzIGlzIG9kZCwgdGhlbiB0aGUgZnJvbnQgcGF0aCB3aWxsIGNvbGxpZGVcbiAgLy8gd2l0aCB0aGUgcmV2ZXJzZSBwYXRoLlxuICB2YXIgZnJvbnQgPSAoZGVsdGEgJSAyICE9IDApO1xuICAvLyBPZmZzZXRzIGZvciBzdGFydCBhbmQgZW5kIG9mIGsgbG9vcC5cbiAgLy8gUHJldmVudHMgbWFwcGluZyBvZiBzcGFjZSBiZXlvbmQgdGhlIGdyaWQuXG4gIHZhciBrMXN0YXJ0ID0gMDtcbiAgdmFyIGsxZW5kID0gMDtcbiAgdmFyIGsyc3RhcnQgPSAwO1xuICB2YXIgazJlbmQgPSAwO1xuICBmb3IgKHZhciBkID0gMDsgZCA8IG1heF9kOyBkKyspIHtcbiAgICAvLyBXYWxrIHRoZSBmcm9udCBwYXRoIG9uZSBzdGVwLlxuICAgIGZvciAodmFyIGsxID0gLWQgKyBrMXN0YXJ0OyBrMSA8PSBkIC0gazFlbmQ7IGsxICs9IDIpIHtcbiAgICAgIHZhciBrMV9vZmZzZXQgPSB2X29mZnNldCArIGsxO1xuICAgICAgdmFyIHgxO1xuICAgICAgaWYgKGsxID09IC1kIHx8IChrMSAhPSBkICYmIHYxW2sxX29mZnNldCAtIDFdIDwgdjFbazFfb2Zmc2V0ICsgMV0pKSB7XG4gICAgICAgIHgxID0gdjFbazFfb2Zmc2V0ICsgMV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB4MSA9IHYxW2sxX29mZnNldCAtIDFdICsgMTtcbiAgICAgIH1cbiAgICAgIHZhciB5MSA9IHgxIC0gazE7XG4gICAgICB3aGlsZSAoeDEgPCB0ZXh0MV9sZW5ndGggJiYgeTEgPCB0ZXh0Ml9sZW5ndGggJiZcbiAgICAgICAgICAgICB0ZXh0MS5jaGFyQXQoeDEpID09IHRleHQyLmNoYXJBdCh5MSkpIHtcbiAgICAgICAgeDErKztcbiAgICAgICAgeTErKztcbiAgICAgIH1cbiAgICAgIHYxW2sxX29mZnNldF0gPSB4MTtcbiAgICAgIGlmICh4MSA+IHRleHQxX2xlbmd0aCkge1xuICAgICAgICAvLyBSYW4gb2ZmIHRoZSByaWdodCBvZiB0aGUgZ3JhcGguXG4gICAgICAgIGsxZW5kICs9IDI7XG4gICAgICB9IGVsc2UgaWYgKHkxID4gdGV4dDJfbGVuZ3RoKSB7XG4gICAgICAgIC8vIFJhbiBvZmYgdGhlIGJvdHRvbSBvZiB0aGUgZ3JhcGguXG4gICAgICAgIGsxc3RhcnQgKz0gMjtcbiAgICAgIH0gZWxzZSBpZiAoZnJvbnQpIHtcbiAgICAgICAgdmFyIGsyX29mZnNldCA9IHZfb2Zmc2V0ICsgZGVsdGEgLSBrMTtcbiAgICAgICAgaWYgKGsyX29mZnNldCA+PSAwICYmIGsyX29mZnNldCA8IHZfbGVuZ3RoICYmIHYyW2syX29mZnNldF0gIT0gLTEpIHtcbiAgICAgICAgICAvLyBNaXJyb3IgeDIgb250byB0b3AtbGVmdCBjb29yZGluYXRlIHN5c3RlbS5cbiAgICAgICAgICB2YXIgeDIgPSB0ZXh0MV9sZW5ndGggLSB2MltrMl9vZmZzZXRdO1xuICAgICAgICAgIGlmICh4MSA+PSB4Mikge1xuICAgICAgICAgICAgLy8gT3ZlcmxhcCBkZXRlY3RlZC5cbiAgICAgICAgICAgIHJldHVybiBkaWZmX2Jpc2VjdFNwbGl0Xyh0ZXh0MSwgdGV4dDIsIHgxLCB5MSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gV2FsayB0aGUgcmV2ZXJzZSBwYXRoIG9uZSBzdGVwLlxuICAgIGZvciAodmFyIGsyID0gLWQgKyBrMnN0YXJ0OyBrMiA8PSBkIC0gazJlbmQ7IGsyICs9IDIpIHtcbiAgICAgIHZhciBrMl9vZmZzZXQgPSB2X29mZnNldCArIGsyO1xuICAgICAgdmFyIHgyO1xuICAgICAgaWYgKGsyID09IC1kIHx8IChrMiAhPSBkICYmIHYyW2syX29mZnNldCAtIDFdIDwgdjJbazJfb2Zmc2V0ICsgMV0pKSB7XG4gICAgICAgIHgyID0gdjJbazJfb2Zmc2V0ICsgMV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB4MiA9IHYyW2syX29mZnNldCAtIDFdICsgMTtcbiAgICAgIH1cbiAgICAgIHZhciB5MiA9IHgyIC0gazI7XG4gICAgICB3aGlsZSAoeDIgPCB0ZXh0MV9sZW5ndGggJiYgeTIgPCB0ZXh0Ml9sZW5ndGggJiZcbiAgICAgICAgICAgICB0ZXh0MS5jaGFyQXQodGV4dDFfbGVuZ3RoIC0geDIgLSAxKSA9PVxuICAgICAgICAgICAgIHRleHQyLmNoYXJBdCh0ZXh0Ml9sZW5ndGggLSB5MiAtIDEpKSB7XG4gICAgICAgIHgyKys7XG4gICAgICAgIHkyKys7XG4gICAgICB9XG4gICAgICB2MltrMl9vZmZzZXRdID0geDI7XG4gICAgICBpZiAoeDIgPiB0ZXh0MV9sZW5ndGgpIHtcbiAgICAgICAgLy8gUmFuIG9mZiB0aGUgbGVmdCBvZiB0aGUgZ3JhcGguXG4gICAgICAgIGsyZW5kICs9IDI7XG4gICAgICB9IGVsc2UgaWYgKHkyID4gdGV4dDJfbGVuZ3RoKSB7XG4gICAgICAgIC8vIFJhbiBvZmYgdGhlIHRvcCBvZiB0aGUgZ3JhcGguXG4gICAgICAgIGsyc3RhcnQgKz0gMjtcbiAgICAgIH0gZWxzZSBpZiAoIWZyb250KSB7XG4gICAgICAgIHZhciBrMV9vZmZzZXQgPSB2X29mZnNldCArIGRlbHRhIC0gazI7XG4gICAgICAgIGlmIChrMV9vZmZzZXQgPj0gMCAmJiBrMV9vZmZzZXQgPCB2X2xlbmd0aCAmJiB2MVtrMV9vZmZzZXRdICE9IC0xKSB7XG4gICAgICAgICAgdmFyIHgxID0gdjFbazFfb2Zmc2V0XTtcbiAgICAgICAgICB2YXIgeTEgPSB2X29mZnNldCArIHgxIC0gazFfb2Zmc2V0O1xuICAgICAgICAgIC8vIE1pcnJvciB4MiBvbnRvIHRvcC1sZWZ0IGNvb3JkaW5hdGUgc3lzdGVtLlxuICAgICAgICAgIHgyID0gdGV4dDFfbGVuZ3RoIC0geDI7XG4gICAgICAgICAgaWYgKHgxID49IHgyKSB7XG4gICAgICAgICAgICAvLyBPdmVybGFwIGRldGVjdGVkLlxuICAgICAgICAgICAgcmV0dXJuIGRpZmZfYmlzZWN0U3BsaXRfKHRleHQxLCB0ZXh0MiwgeDEsIHkxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gRGlmZiB0b29rIHRvbyBsb25nIGFuZCBoaXQgdGhlIGRlYWRsaW5lIG9yXG4gIC8vIG51bWJlciBvZiBkaWZmcyBlcXVhbHMgbnVtYmVyIG9mIGNoYXJhY3RlcnMsIG5vIGNvbW1vbmFsaXR5IGF0IGFsbC5cbiAgcmV0dXJuIFtbRElGRl9ERUxFVEUsIHRleHQxXSwgW0RJRkZfSU5TRVJULCB0ZXh0Ml1dO1xufTtcblxuXG4vKipcbiAqIEdpdmVuIHRoZSBsb2NhdGlvbiBvZiB0aGUgJ21pZGRsZSBzbmFrZScsIHNwbGl0IHRoZSBkaWZmIGluIHR3byBwYXJ0c1xuICogYW5kIHJlY3Vyc2UuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dDEgT2xkIHN0cmluZyB0byBiZSBkaWZmZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dDIgTmV3IHN0cmluZyB0byBiZSBkaWZmZWQuXG4gKiBAcGFyYW0ge251bWJlcn0geCBJbmRleCBvZiBzcGxpdCBwb2ludCBpbiB0ZXh0MS5cbiAqIEBwYXJhbSB7bnVtYmVyfSB5IEluZGV4IG9mIHNwbGl0IHBvaW50IGluIHRleHQyLlxuICogQHJldHVybiB7QXJyYXl9IEFycmF5IG9mIGRpZmYgdHVwbGVzLlxuICovXG5mdW5jdGlvbiBkaWZmX2Jpc2VjdFNwbGl0Xyh0ZXh0MSwgdGV4dDIsIHgsIHkpIHtcbiAgdmFyIHRleHQxYSA9IHRleHQxLnN1YnN0cmluZygwLCB4KTtcbiAgdmFyIHRleHQyYSA9IHRleHQyLnN1YnN0cmluZygwLCB5KTtcbiAgdmFyIHRleHQxYiA9IHRleHQxLnN1YnN0cmluZyh4KTtcbiAgdmFyIHRleHQyYiA9IHRleHQyLnN1YnN0cmluZyh5KTtcblxuICAvLyBDb21wdXRlIGJvdGggZGlmZnMgc2VyaWFsbHkuXG4gIHZhciBkaWZmcyA9IGRpZmZfbWFpbih0ZXh0MWEsIHRleHQyYSk7XG4gIHZhciBkaWZmc2IgPSBkaWZmX21haW4odGV4dDFiLCB0ZXh0MmIpO1xuXG4gIHJldHVybiBkaWZmcy5jb25jYXQoZGlmZnNiKTtcbn07XG5cblxuLyoqXG4gKiBEZXRlcm1pbmUgdGhlIGNvbW1vbiBwcmVmaXggb2YgdHdvIHN0cmluZ3MuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dDEgRmlyc3Qgc3RyaW5nLlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQyIFNlY29uZCBzdHJpbmcuXG4gKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBudW1iZXIgb2YgY2hhcmFjdGVycyBjb21tb24gdG8gdGhlIHN0YXJ0IG9mIGVhY2hcbiAqICAgICBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIGRpZmZfY29tbW9uUHJlZml4KHRleHQxLCB0ZXh0Mikge1xuICAvLyBRdWljayBjaGVjayBmb3IgY29tbW9uIG51bGwgY2FzZXMuXG4gIGlmICghdGV4dDEgfHwgIXRleHQyIHx8IHRleHQxLmNoYXJBdCgwKSAhPSB0ZXh0Mi5jaGFyQXQoMCkpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuICAvLyBCaW5hcnkgc2VhcmNoLlxuICAvLyBQZXJmb3JtYW5jZSBhbmFseXNpczogaHR0cDovL25laWwuZnJhc2VyLm5hbWUvbmV3cy8yMDA3LzEwLzA5L1xuICB2YXIgcG9pbnRlcm1pbiA9IDA7XG4gIHZhciBwb2ludGVybWF4ID0gTWF0aC5taW4odGV4dDEubGVuZ3RoLCB0ZXh0Mi5sZW5ndGgpO1xuICB2YXIgcG9pbnRlcm1pZCA9IHBvaW50ZXJtYXg7XG4gIHZhciBwb2ludGVyc3RhcnQgPSAwO1xuICB3aGlsZSAocG9pbnRlcm1pbiA8IHBvaW50ZXJtaWQpIHtcbiAgICBpZiAodGV4dDEuc3Vic3RyaW5nKHBvaW50ZXJzdGFydCwgcG9pbnRlcm1pZCkgPT1cbiAgICAgICAgdGV4dDIuc3Vic3RyaW5nKHBvaW50ZXJzdGFydCwgcG9pbnRlcm1pZCkpIHtcbiAgICAgIHBvaW50ZXJtaW4gPSBwb2ludGVybWlkO1xuICAgICAgcG9pbnRlcnN0YXJ0ID0gcG9pbnRlcm1pbjtcbiAgICB9IGVsc2Uge1xuICAgICAgcG9pbnRlcm1heCA9IHBvaW50ZXJtaWQ7XG4gICAgfVxuICAgIHBvaW50ZXJtaWQgPSBNYXRoLmZsb29yKChwb2ludGVybWF4IC0gcG9pbnRlcm1pbikgLyAyICsgcG9pbnRlcm1pbik7XG4gIH1cbiAgcmV0dXJuIHBvaW50ZXJtaWQ7XG59O1xuXG5cbi8qKlxuICogRGV0ZXJtaW5lIHRoZSBjb21tb24gc3VmZml4IG9mIHR3byBzdHJpbmdzLlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQxIEZpcnN0IHN0cmluZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0MiBTZWNvbmQgc3RyaW5nLlxuICogQHJldHVybiB7bnVtYmVyfSBUaGUgbnVtYmVyIG9mIGNoYXJhY3RlcnMgY29tbW9uIHRvIHRoZSBlbmQgb2YgZWFjaCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIGRpZmZfY29tbW9uU3VmZml4KHRleHQxLCB0ZXh0Mikge1xuICAvLyBRdWljayBjaGVjayBmb3IgY29tbW9uIG51bGwgY2FzZXMuXG4gIGlmICghdGV4dDEgfHwgIXRleHQyIHx8XG4gICAgICB0ZXh0MS5jaGFyQXQodGV4dDEubGVuZ3RoIC0gMSkgIT0gdGV4dDIuY2hhckF0KHRleHQyLmxlbmd0aCAtIDEpKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgLy8gQmluYXJ5IHNlYXJjaC5cbiAgLy8gUGVyZm9ybWFuY2UgYW5hbHlzaXM6IGh0dHA6Ly9uZWlsLmZyYXNlci5uYW1lL25ld3MvMjAwNy8xMC8wOS9cbiAgdmFyIHBvaW50ZXJtaW4gPSAwO1xuICB2YXIgcG9pbnRlcm1heCA9IE1hdGgubWluKHRleHQxLmxlbmd0aCwgdGV4dDIubGVuZ3RoKTtcbiAgdmFyIHBvaW50ZXJtaWQgPSBwb2ludGVybWF4O1xuICB2YXIgcG9pbnRlcmVuZCA9IDA7XG4gIHdoaWxlIChwb2ludGVybWluIDwgcG9pbnRlcm1pZCkge1xuICAgIGlmICh0ZXh0MS5zdWJzdHJpbmcodGV4dDEubGVuZ3RoIC0gcG9pbnRlcm1pZCwgdGV4dDEubGVuZ3RoIC0gcG9pbnRlcmVuZCkgPT1cbiAgICAgICAgdGV4dDIuc3Vic3RyaW5nKHRleHQyLmxlbmd0aCAtIHBvaW50ZXJtaWQsIHRleHQyLmxlbmd0aCAtIHBvaW50ZXJlbmQpKSB7XG4gICAgICBwb2ludGVybWluID0gcG9pbnRlcm1pZDtcbiAgICAgIHBvaW50ZXJlbmQgPSBwb2ludGVybWluO1xuICAgIH0gZWxzZSB7XG4gICAgICBwb2ludGVybWF4ID0gcG9pbnRlcm1pZDtcbiAgICB9XG4gICAgcG9pbnRlcm1pZCA9IE1hdGguZmxvb3IoKHBvaW50ZXJtYXggLSBwb2ludGVybWluKSAvIDIgKyBwb2ludGVybWluKTtcbiAgfVxuICByZXR1cm4gcG9pbnRlcm1pZDtcbn07XG5cblxuLyoqXG4gKiBEbyB0aGUgdHdvIHRleHRzIHNoYXJlIGEgc3Vic3RyaW5nIHdoaWNoIGlzIGF0IGxlYXN0IGhhbGYgdGhlIGxlbmd0aCBvZiB0aGVcbiAqIGxvbmdlciB0ZXh0P1xuICogVGhpcyBzcGVlZHVwIGNhbiBwcm9kdWNlIG5vbi1taW5pbWFsIGRpZmZzLlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQxIEZpcnN0IHN0cmluZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0MiBTZWNvbmQgc3RyaW5nLlxuICogQHJldHVybiB7QXJyYXkuPHN0cmluZz59IEZpdmUgZWxlbWVudCBBcnJheSwgY29udGFpbmluZyB0aGUgcHJlZml4IG9mXG4gKiAgICAgdGV4dDEsIHRoZSBzdWZmaXggb2YgdGV4dDEsIHRoZSBwcmVmaXggb2YgdGV4dDIsIHRoZSBzdWZmaXggb2ZcbiAqICAgICB0ZXh0MiBhbmQgdGhlIGNvbW1vbiBtaWRkbGUuICBPciBudWxsIGlmIHRoZXJlIHdhcyBubyBtYXRjaC5cbiAqL1xuZnVuY3Rpb24gZGlmZl9oYWxmTWF0Y2hfKHRleHQxLCB0ZXh0Mikge1xuICB2YXIgbG9uZ3RleHQgPSB0ZXh0MS5sZW5ndGggPiB0ZXh0Mi5sZW5ndGggPyB0ZXh0MSA6IHRleHQyO1xuICB2YXIgc2hvcnR0ZXh0ID0gdGV4dDEubGVuZ3RoID4gdGV4dDIubGVuZ3RoID8gdGV4dDIgOiB0ZXh0MTtcbiAgaWYgKGxvbmd0ZXh0Lmxlbmd0aCA8IDQgfHwgc2hvcnR0ZXh0Lmxlbmd0aCAqIDIgPCBsb25ndGV4dC5sZW5ndGgpIHtcbiAgICByZXR1cm4gbnVsbDsgIC8vIFBvaW50bGVzcy5cbiAgfVxuXG4gIC8qKlxuICAgKiBEb2VzIGEgc3Vic3RyaW5nIG9mIHNob3J0dGV4dCBleGlzdCB3aXRoaW4gbG9uZ3RleHQgc3VjaCB0aGF0IHRoZSBzdWJzdHJpbmdcbiAgICogaXMgYXQgbGVhc3QgaGFsZiB0aGUgbGVuZ3RoIG9mIGxvbmd0ZXh0P1xuICAgKiBDbG9zdXJlLCBidXQgZG9lcyBub3QgcmVmZXJlbmNlIGFueSBleHRlcm5hbCB2YXJpYWJsZXMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsb25ndGV4dCBMb25nZXIgc3RyaW5nLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2hvcnR0ZXh0IFNob3J0ZXIgc3RyaW5nLlxuICAgKiBAcGFyYW0ge251bWJlcn0gaSBTdGFydCBpbmRleCBvZiBxdWFydGVyIGxlbmd0aCBzdWJzdHJpbmcgd2l0aGluIGxvbmd0ZXh0LlxuICAgKiBAcmV0dXJuIHtBcnJheS48c3RyaW5nPn0gRml2ZSBlbGVtZW50IEFycmF5LCBjb250YWluaW5nIHRoZSBwcmVmaXggb2ZcbiAgICogICAgIGxvbmd0ZXh0LCB0aGUgc3VmZml4IG9mIGxvbmd0ZXh0LCB0aGUgcHJlZml4IG9mIHNob3J0dGV4dCwgdGhlIHN1ZmZpeFxuICAgKiAgICAgb2Ygc2hvcnR0ZXh0IGFuZCB0aGUgY29tbW9uIG1pZGRsZS4gIE9yIG51bGwgaWYgdGhlcmUgd2FzIG5vIG1hdGNoLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZnVuY3Rpb24gZGlmZl9oYWxmTWF0Y2hJXyhsb25ndGV4dCwgc2hvcnR0ZXh0LCBpKSB7XG4gICAgLy8gU3RhcnQgd2l0aCBhIDEvNCBsZW5ndGggc3Vic3RyaW5nIGF0IHBvc2l0aW9uIGkgYXMgYSBzZWVkLlxuICAgIHZhciBzZWVkID0gbG9uZ3RleHQuc3Vic3RyaW5nKGksIGkgKyBNYXRoLmZsb29yKGxvbmd0ZXh0Lmxlbmd0aCAvIDQpKTtcbiAgICB2YXIgaiA9IC0xO1xuICAgIHZhciBiZXN0X2NvbW1vbiA9ICcnO1xuICAgIHZhciBiZXN0X2xvbmd0ZXh0X2EsIGJlc3RfbG9uZ3RleHRfYiwgYmVzdF9zaG9ydHRleHRfYSwgYmVzdF9zaG9ydHRleHRfYjtcbiAgICB3aGlsZSAoKGogPSBzaG9ydHRleHQuaW5kZXhPZihzZWVkLCBqICsgMSkpICE9IC0xKSB7XG4gICAgICB2YXIgcHJlZml4TGVuZ3RoID0gZGlmZl9jb21tb25QcmVmaXgobG9uZ3RleHQuc3Vic3RyaW5nKGkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3J0dGV4dC5zdWJzdHJpbmcoaikpO1xuICAgICAgdmFyIHN1ZmZpeExlbmd0aCA9IGRpZmZfY29tbW9uU3VmZml4KGxvbmd0ZXh0LnN1YnN0cmluZygwLCBpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG9ydHRleHQuc3Vic3RyaW5nKDAsIGopKTtcbiAgICAgIGlmIChiZXN0X2NvbW1vbi5sZW5ndGggPCBzdWZmaXhMZW5ndGggKyBwcmVmaXhMZW5ndGgpIHtcbiAgICAgICAgYmVzdF9jb21tb24gPSBzaG9ydHRleHQuc3Vic3RyaW5nKGogLSBzdWZmaXhMZW5ndGgsIGopICtcbiAgICAgICAgICAgIHNob3J0dGV4dC5zdWJzdHJpbmcoaiwgaiArIHByZWZpeExlbmd0aCk7XG4gICAgICAgIGJlc3RfbG9uZ3RleHRfYSA9IGxvbmd0ZXh0LnN1YnN0cmluZygwLCBpIC0gc3VmZml4TGVuZ3RoKTtcbiAgICAgICAgYmVzdF9sb25ndGV4dF9iID0gbG9uZ3RleHQuc3Vic3RyaW5nKGkgKyBwcmVmaXhMZW5ndGgpO1xuICAgICAgICBiZXN0X3Nob3J0dGV4dF9hID0gc2hvcnR0ZXh0LnN1YnN0cmluZygwLCBqIC0gc3VmZml4TGVuZ3RoKTtcbiAgICAgICAgYmVzdF9zaG9ydHRleHRfYiA9IHNob3J0dGV4dC5zdWJzdHJpbmcoaiArIHByZWZpeExlbmd0aCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChiZXN0X2NvbW1vbi5sZW5ndGggKiAyID49IGxvbmd0ZXh0Lmxlbmd0aCkge1xuICAgICAgcmV0dXJuIFtiZXN0X2xvbmd0ZXh0X2EsIGJlc3RfbG9uZ3RleHRfYixcbiAgICAgICAgICAgICAgYmVzdF9zaG9ydHRleHRfYSwgYmVzdF9zaG9ydHRleHRfYiwgYmVzdF9jb21tb25dO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvLyBGaXJzdCBjaGVjayBpZiB0aGUgc2Vjb25kIHF1YXJ0ZXIgaXMgdGhlIHNlZWQgZm9yIGEgaGFsZi1tYXRjaC5cbiAgdmFyIGhtMSA9IGRpZmZfaGFsZk1hdGNoSV8obG9uZ3RleHQsIHNob3J0dGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5jZWlsKGxvbmd0ZXh0Lmxlbmd0aCAvIDQpKTtcbiAgLy8gQ2hlY2sgYWdhaW4gYmFzZWQgb24gdGhlIHRoaXJkIHF1YXJ0ZXIuXG4gIHZhciBobTIgPSBkaWZmX2hhbGZNYXRjaElfKGxvbmd0ZXh0LCBzaG9ydHRleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguY2VpbChsb25ndGV4dC5sZW5ndGggLyAyKSk7XG4gIHZhciBobTtcbiAgaWYgKCFobTEgJiYgIWhtMikge1xuICAgIHJldHVybiBudWxsO1xuICB9IGVsc2UgaWYgKCFobTIpIHtcbiAgICBobSA9IGhtMTtcbiAgfSBlbHNlIGlmICghaG0xKSB7XG4gICAgaG0gPSBobTI7XG4gIH0gZWxzZSB7XG4gICAgLy8gQm90aCBtYXRjaGVkLiAgU2VsZWN0IHRoZSBsb25nZXN0LlxuICAgIGhtID0gaG0xWzRdLmxlbmd0aCA+IGhtMls0XS5sZW5ndGggPyBobTEgOiBobTI7XG4gIH1cblxuICAvLyBBIGhhbGYtbWF0Y2ggd2FzIGZvdW5kLCBzb3J0IG91dCB0aGUgcmV0dXJuIGRhdGEuXG4gIHZhciB0ZXh0MV9hLCB0ZXh0MV9iLCB0ZXh0Ml9hLCB0ZXh0Ml9iO1xuICBpZiAodGV4dDEubGVuZ3RoID4gdGV4dDIubGVuZ3RoKSB7XG4gICAgdGV4dDFfYSA9IGhtWzBdO1xuICAgIHRleHQxX2IgPSBobVsxXTtcbiAgICB0ZXh0Ml9hID0gaG1bMl07XG4gICAgdGV4dDJfYiA9IGhtWzNdO1xuICB9IGVsc2Uge1xuICAgIHRleHQyX2EgPSBobVswXTtcbiAgICB0ZXh0Ml9iID0gaG1bMV07XG4gICAgdGV4dDFfYSA9IGhtWzJdO1xuICAgIHRleHQxX2IgPSBobVszXTtcbiAgfVxuICB2YXIgbWlkX2NvbW1vbiA9IGhtWzRdO1xuICByZXR1cm4gW3RleHQxX2EsIHRleHQxX2IsIHRleHQyX2EsIHRleHQyX2IsIG1pZF9jb21tb25dO1xufTtcblxuXG4vKipcbiAqIFJlb3JkZXIgYW5kIG1lcmdlIGxpa2UgZWRpdCBzZWN0aW9ucy4gIE1lcmdlIGVxdWFsaXRpZXMuXG4gKiBBbnkgZWRpdCBzZWN0aW9uIGNhbiBtb3ZlIGFzIGxvbmcgYXMgaXQgZG9lc24ndCBjcm9zcyBhbiBlcXVhbGl0eS5cbiAqIEBwYXJhbSB7QXJyYXl9IGRpZmZzIEFycmF5IG9mIGRpZmYgdHVwbGVzLlxuICovXG5mdW5jdGlvbiBkaWZmX2NsZWFudXBNZXJnZShkaWZmcykge1xuICBkaWZmcy5wdXNoKFtESUZGX0VRVUFMLCAnJ10pOyAgLy8gQWRkIGEgZHVtbXkgZW50cnkgYXQgdGhlIGVuZC5cbiAgdmFyIHBvaW50ZXIgPSAwO1xuICB2YXIgY291bnRfZGVsZXRlID0gMDtcbiAgdmFyIGNvdW50X2luc2VydCA9IDA7XG4gIHZhciB0ZXh0X2RlbGV0ZSA9ICcnO1xuICB2YXIgdGV4dF9pbnNlcnQgPSAnJztcbiAgdmFyIGNvbW1vbmxlbmd0aDtcbiAgd2hpbGUgKHBvaW50ZXIgPCBkaWZmcy5sZW5ndGgpIHtcbiAgICBzd2l0Y2ggKGRpZmZzW3BvaW50ZXJdWzBdKSB7XG4gICAgICBjYXNlIERJRkZfSU5TRVJUOlxuICAgICAgICBjb3VudF9pbnNlcnQrKztcbiAgICAgICAgdGV4dF9pbnNlcnQgKz0gZGlmZnNbcG9pbnRlcl1bMV07XG4gICAgICAgIHBvaW50ZXIrKztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIERJRkZfREVMRVRFOlxuICAgICAgICBjb3VudF9kZWxldGUrKztcbiAgICAgICAgdGV4dF9kZWxldGUgKz0gZGlmZnNbcG9pbnRlcl1bMV07XG4gICAgICAgIHBvaW50ZXIrKztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIERJRkZfRVFVQUw6XG4gICAgICAgIC8vIFVwb24gcmVhY2hpbmcgYW4gZXF1YWxpdHksIGNoZWNrIGZvciBwcmlvciByZWR1bmRhbmNpZXMuXG4gICAgICAgIGlmIChjb3VudF9kZWxldGUgKyBjb3VudF9pbnNlcnQgPiAxKSB7XG4gICAgICAgICAgaWYgKGNvdW50X2RlbGV0ZSAhPT0gMCAmJiBjb3VudF9pbnNlcnQgIT09IDApIHtcbiAgICAgICAgICAgIC8vIEZhY3RvciBvdXQgYW55IGNvbW1vbiBwcmVmaXhpZXMuXG4gICAgICAgICAgICBjb21tb25sZW5ndGggPSBkaWZmX2NvbW1vblByZWZpeCh0ZXh0X2luc2VydCwgdGV4dF9kZWxldGUpO1xuICAgICAgICAgICAgaWYgKGNvbW1vbmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgICBpZiAoKHBvaW50ZXIgLSBjb3VudF9kZWxldGUgLSBjb3VudF9pbnNlcnQpID4gMCAmJlxuICAgICAgICAgICAgICAgICAgZGlmZnNbcG9pbnRlciAtIGNvdW50X2RlbGV0ZSAtIGNvdW50X2luc2VydCAtIDFdWzBdID09XG4gICAgICAgICAgICAgICAgICBESUZGX0VRVUFMKSB7XG4gICAgICAgICAgICAgICAgZGlmZnNbcG9pbnRlciAtIGNvdW50X2RlbGV0ZSAtIGNvdW50X2luc2VydCAtIDFdWzFdICs9XG4gICAgICAgICAgICAgICAgICAgIHRleHRfaW5zZXJ0LnN1YnN0cmluZygwLCBjb21tb25sZW5ndGgpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRpZmZzLnNwbGljZSgwLCAwLCBbRElGRl9FUVVBTCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRfaW5zZXJ0LnN1YnN0cmluZygwLCBjb21tb25sZW5ndGgpXSk7XG4gICAgICAgICAgICAgICAgcG9pbnRlcisrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRleHRfaW5zZXJ0ID0gdGV4dF9pbnNlcnQuc3Vic3RyaW5nKGNvbW1vbmxlbmd0aCk7XG4gICAgICAgICAgICAgIHRleHRfZGVsZXRlID0gdGV4dF9kZWxldGUuc3Vic3RyaW5nKGNvbW1vbmxlbmd0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBGYWN0b3Igb3V0IGFueSBjb21tb24gc3VmZml4aWVzLlxuICAgICAgICAgICAgY29tbW9ubGVuZ3RoID0gZGlmZl9jb21tb25TdWZmaXgodGV4dF9pbnNlcnQsIHRleHRfZGVsZXRlKTtcbiAgICAgICAgICAgIGlmIChjb21tb25sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgICAgZGlmZnNbcG9pbnRlcl1bMV0gPSB0ZXh0X2luc2VydC5zdWJzdHJpbmcodGV4dF9pbnNlcnQubGVuZ3RoIC1cbiAgICAgICAgICAgICAgICAgIGNvbW1vbmxlbmd0aCkgKyBkaWZmc1twb2ludGVyXVsxXTtcbiAgICAgICAgICAgICAgdGV4dF9pbnNlcnQgPSB0ZXh0X2luc2VydC5zdWJzdHJpbmcoMCwgdGV4dF9pbnNlcnQubGVuZ3RoIC1cbiAgICAgICAgICAgICAgICAgIGNvbW1vbmxlbmd0aCk7XG4gICAgICAgICAgICAgIHRleHRfZGVsZXRlID0gdGV4dF9kZWxldGUuc3Vic3RyaW5nKDAsIHRleHRfZGVsZXRlLmxlbmd0aCAtXG4gICAgICAgICAgICAgICAgICBjb21tb25sZW5ndGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBEZWxldGUgdGhlIG9mZmVuZGluZyByZWNvcmRzIGFuZCBhZGQgdGhlIG1lcmdlZCBvbmVzLlxuICAgICAgICAgIGlmIChjb3VudF9kZWxldGUgPT09IDApIHtcbiAgICAgICAgICAgIGRpZmZzLnNwbGljZShwb2ludGVyIC0gY291bnRfaW5zZXJ0LFxuICAgICAgICAgICAgICAgIGNvdW50X2RlbGV0ZSArIGNvdW50X2luc2VydCwgW0RJRkZfSU5TRVJULCB0ZXh0X2luc2VydF0pO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY291bnRfaW5zZXJ0ID09PSAwKSB7XG4gICAgICAgICAgICBkaWZmcy5zcGxpY2UocG9pbnRlciAtIGNvdW50X2RlbGV0ZSxcbiAgICAgICAgICAgICAgICBjb3VudF9kZWxldGUgKyBjb3VudF9pbnNlcnQsIFtESUZGX0RFTEVURSwgdGV4dF9kZWxldGVdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGlmZnMuc3BsaWNlKHBvaW50ZXIgLSBjb3VudF9kZWxldGUgLSBjb3VudF9pbnNlcnQsXG4gICAgICAgICAgICAgICAgY291bnRfZGVsZXRlICsgY291bnRfaW5zZXJ0LCBbRElGRl9ERUxFVEUsIHRleHRfZGVsZXRlXSxcbiAgICAgICAgICAgICAgICBbRElGRl9JTlNFUlQsIHRleHRfaW5zZXJ0XSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHBvaW50ZXIgPSBwb2ludGVyIC0gY291bnRfZGVsZXRlIC0gY291bnRfaW5zZXJ0ICtcbiAgICAgICAgICAgICAgICAgICAgKGNvdW50X2RlbGV0ZSA/IDEgOiAwKSArIChjb3VudF9pbnNlcnQgPyAxIDogMCkgKyAxO1xuICAgICAgICB9IGVsc2UgaWYgKHBvaW50ZXIgIT09IDAgJiYgZGlmZnNbcG9pbnRlciAtIDFdWzBdID09IERJRkZfRVFVQUwpIHtcbiAgICAgICAgICAvLyBNZXJnZSB0aGlzIGVxdWFsaXR5IHdpdGggdGhlIHByZXZpb3VzIG9uZS5cbiAgICAgICAgICBkaWZmc1twb2ludGVyIC0gMV1bMV0gKz0gZGlmZnNbcG9pbnRlcl1bMV07XG4gICAgICAgICAgZGlmZnMuc3BsaWNlKHBvaW50ZXIsIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBvaW50ZXIrKztcbiAgICAgICAgfVxuICAgICAgICBjb3VudF9pbnNlcnQgPSAwO1xuICAgICAgICBjb3VudF9kZWxldGUgPSAwO1xuICAgICAgICB0ZXh0X2RlbGV0ZSA9ICcnO1xuICAgICAgICB0ZXh0X2luc2VydCA9ICcnO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgaWYgKGRpZmZzW2RpZmZzLmxlbmd0aCAtIDFdWzFdID09PSAnJykge1xuICAgIGRpZmZzLnBvcCgpOyAgLy8gUmVtb3ZlIHRoZSBkdW1teSBlbnRyeSBhdCB0aGUgZW5kLlxuICB9XG5cbiAgLy8gU2Vjb25kIHBhc3M6IGxvb2sgZm9yIHNpbmdsZSBlZGl0cyBzdXJyb3VuZGVkIG9uIGJvdGggc2lkZXMgYnkgZXF1YWxpdGllc1xuICAvLyB3aGljaCBjYW4gYmUgc2hpZnRlZCBzaWRld2F5cyB0byBlbGltaW5hdGUgYW4gZXF1YWxpdHkuXG4gIC8vIGUuZzogQTxpbnM+QkE8L2lucz5DIC0+IDxpbnM+QUI8L2lucz5BQ1xuICB2YXIgY2hhbmdlcyA9IGZhbHNlO1xuICBwb2ludGVyID0gMTtcbiAgLy8gSW50ZW50aW9uYWxseSBpZ25vcmUgdGhlIGZpcnN0IGFuZCBsYXN0IGVsZW1lbnQgKGRvbid0IG5lZWQgY2hlY2tpbmcpLlxuICB3aGlsZSAocG9pbnRlciA8IGRpZmZzLmxlbmd0aCAtIDEpIHtcbiAgICBpZiAoZGlmZnNbcG9pbnRlciAtIDFdWzBdID09IERJRkZfRVFVQUwgJiZcbiAgICAgICAgZGlmZnNbcG9pbnRlciArIDFdWzBdID09IERJRkZfRVFVQUwpIHtcbiAgICAgIC8vIFRoaXMgaXMgYSBzaW5nbGUgZWRpdCBzdXJyb3VuZGVkIGJ5IGVxdWFsaXRpZXMuXG4gICAgICBpZiAoZGlmZnNbcG9pbnRlcl1bMV0uc3Vic3RyaW5nKGRpZmZzW3BvaW50ZXJdWzFdLmxlbmd0aCAtXG4gICAgICAgICAgZGlmZnNbcG9pbnRlciAtIDFdWzFdLmxlbmd0aCkgPT0gZGlmZnNbcG9pbnRlciAtIDFdWzFdKSB7XG4gICAgICAgIC8vIFNoaWZ0IHRoZSBlZGl0IG92ZXIgdGhlIHByZXZpb3VzIGVxdWFsaXR5LlxuICAgICAgICBkaWZmc1twb2ludGVyXVsxXSA9IGRpZmZzW3BvaW50ZXIgLSAxXVsxXSArXG4gICAgICAgICAgICBkaWZmc1twb2ludGVyXVsxXS5zdWJzdHJpbmcoMCwgZGlmZnNbcG9pbnRlcl1bMV0ubGVuZ3RoIC1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWZmc1twb2ludGVyIC0gMV1bMV0ubGVuZ3RoKTtcbiAgICAgICAgZGlmZnNbcG9pbnRlciArIDFdWzFdID0gZGlmZnNbcG9pbnRlciAtIDFdWzFdICsgZGlmZnNbcG9pbnRlciArIDFdWzFdO1xuICAgICAgICBkaWZmcy5zcGxpY2UocG9pbnRlciAtIDEsIDEpO1xuICAgICAgICBjaGFuZ2VzID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoZGlmZnNbcG9pbnRlcl1bMV0uc3Vic3RyaW5nKDAsIGRpZmZzW3BvaW50ZXIgKyAxXVsxXS5sZW5ndGgpID09XG4gICAgICAgICAgZGlmZnNbcG9pbnRlciArIDFdWzFdKSB7XG4gICAgICAgIC8vIFNoaWZ0IHRoZSBlZGl0IG92ZXIgdGhlIG5leHQgZXF1YWxpdHkuXG4gICAgICAgIGRpZmZzW3BvaW50ZXIgLSAxXVsxXSArPSBkaWZmc1twb2ludGVyICsgMV1bMV07XG4gICAgICAgIGRpZmZzW3BvaW50ZXJdWzFdID1cbiAgICAgICAgICAgIGRpZmZzW3BvaW50ZXJdWzFdLnN1YnN0cmluZyhkaWZmc1twb2ludGVyICsgMV1bMV0ubGVuZ3RoKSArXG4gICAgICAgICAgICBkaWZmc1twb2ludGVyICsgMV1bMV07XG4gICAgICAgIGRpZmZzLnNwbGljZShwb2ludGVyICsgMSwgMSk7XG4gICAgICAgIGNoYW5nZXMgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBwb2ludGVyKys7XG4gIH1cbiAgLy8gSWYgc2hpZnRzIHdlcmUgbWFkZSwgdGhlIGRpZmYgbmVlZHMgcmVvcmRlcmluZyBhbmQgYW5vdGhlciBzaGlmdCBzd2VlcC5cbiAgaWYgKGNoYW5nZXMpIHtcbiAgICBkaWZmX2NsZWFudXBNZXJnZShkaWZmcyk7XG4gIH1cbn07XG5cblxudmFyIGRpZmYgPSBkaWZmX21haW47XG5kaWZmLklOU0VSVCA9IERJRkZfSU5TRVJUO1xuZGlmZi5ERUxFVEUgPSBESUZGX0RFTEVURTtcbmRpZmYuRVFVQUwgPSBESUZGX0VRVUFMO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZGlmZjtcbiJdfQ==
