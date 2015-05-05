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
        var cursor, fun;
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
            return _this._cursors.setCursor(param.id, index, param.name, param.color);
          };
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
      position = backend(deltas.ops);
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
var BaseClass, Editors, Locker, YRichText, misc,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

misc = require("./misc.coffee");

BaseClass = misc.BaseClass;

Locker = misc.Locker;

Editors = require("./editors.coffee");

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
  }

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
    this.editor.observeLocalText(this.passDeltas);
    this.bindEventsToEditor(this.editor);
    this.editor.observeLocalCursor(this.updateCursorPosition);
    return this._model.connector.receive_handlers.unshift((function(_this) {
      return function() {
        return _this.editor.checkUpdate();
      };
    })(this));
  };

  YRichText.prototype.getDelta = function() {
    var deltas, expected_pos, sel, selection_length, selections, text_content, unselected_insert_content, _i, _len, _ref;
    text_content = this._model.getContent('characters').val();
    expected_pos = 0;
    deltas = [];
    selections = this._model.getContent("selections");
    _ref = selections.getSelections(this._model.getContent("characters"));
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      sel = _ref[_i];
      selection_length = sel.to - sel.from + 1;
      if (expected_pos !== sel.from) {
        unselected_insert_content = text_content.splice(0, sel.from - expected_pos).join('');
        deltas.push({
          insert: unselected_insert_content
        });
        expected_pos += unselected_insert_content.length;
      }
      if (expected_pos !== sel.from) {
        throw new Error("This portion of code must not be reached in getDelta!");
      }
      deltas.push({
        insert: text_content.splice(0, selection_length).join(''),
        attributes: sel.attrs
      });
      expected_pos += selection_length;
    }
    if (text_content.length > 0) {
      deltas.push({
        insert: text_content.join('')
      });
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
        this.passDeltas(editor.getContents());
        this.bind(editor);
        delete this._bind_later;
      }
      this._model.observe(this.propagateToEditor);
    }
    return this._model;
  };

  YRichText.prototype._setModel = function(model) {
    return YRichText.__super__._setModel.apply(this, arguments);
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
        var delta, position, _i, _len, _results;
        position = 0;
        _results = [];
        for (_i = 0, _len = deltas.length; _i < _len; _i++) {
          delta = deltas[_i];
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
            delta = {
              ops: []
            };
            if (event.position > 0) {
              delta.ops.push({
                retain: event.position
              });
            }
            if (event.type === "insert") {
              delta.ops.push({
                insert: event.value
              });
            } else if (event.type === "delete") {
              delta.ops.push({
                "delete": 1
              });
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
            _this.editor.updateContents(delta);
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
          return _this.editor.updateContents({
            ops: [
              {
                retain: retain
              }, {
                retain: selection_length,
                attributes: attrs
              }
            ]
          });
        });
      };
    })(this));
    this._model.getContent("cursors").observe((function(_this) {
      return function(events) {
        return _this.locker["try"](function() {
          var author, event, params, position, ref_to_char, _i, _len;
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
                text: author,
                color: "grey"
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
    var content_array, delta_selections, delta_unselections, from, insert_content, n, retain, selections, to, v, _ref;
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


},{"./editors.coffee":1,"./misc.coffee":2}]},{},[3])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Rtb25hZC9naXQveS1yaWNodGV4dC9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9kbW9uYWQvZ2l0L3ktcmljaHRleHQvbGliL2VkaXRvcnMuY29mZmVlIiwiL2hvbWUvZG1vbmFkL2dpdC95LXJpY2h0ZXh0L2xpYi9taXNjLmNvZmZlZSIsIi9ob21lL2Rtb25hZC9naXQveS1yaWNodGV4dC9saWIveS1yaWNodGV4dC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBLHlDQUFBO0VBQUE7aVNBQUE7O0FBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSLENBQVAsQ0FBQTs7QUFBQTtBQU1lLEVBQUEsd0JBQUUsTUFBRixHQUFBO0FBQ1gsSUFEWSxJQUFDLENBQUEsU0FBQSxNQUNiLENBQUE7QUFBQSxJQUFBLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxJQUFJLENBQUMsTUFBTCxDQUFBLENBQWQsQ0FEVztFQUFBLENBQWI7O0FBQUEsMkJBSUEsV0FBQSxHQUFhLFNBQUEsR0FBQTtBQUFLLFVBQVUsSUFBQSxLQUFBLENBQU0sY0FBTixDQUFWLENBQUw7RUFBQSxDQUpiLENBQUE7O0FBQUEsMkJBT0EsU0FBQSxHQUFXLFNBQUEsR0FBQTtBQUFNLFVBQVUsSUFBQSxLQUFBLENBQU0sY0FBTixDQUFWLENBQU47RUFBQSxDQVBYLENBQUE7O0FBQUEsMkJBY0EsU0FBQSxHQUFXLFNBQUMsS0FBRCxHQUFBO0FBQVcsVUFBVSxJQUFBLEtBQUEsQ0FBTSxjQUFOLENBQVYsQ0FBWDtFQUFBLENBZFgsQ0FBQTs7QUFBQSwyQkFlQSxZQUFBLEdBQWMsU0FBQSxHQUFBO0FBQUssVUFBVSxJQUFBLEtBQUEsQ0FBTSxjQUFOLENBQVYsQ0FBTDtFQUFBLENBZmQsQ0FBQTs7QUFBQSwyQkFvQkEsWUFB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T0FBRCxFQUFVLFFBQVYsRUFBb0IsTUFBcEIsR0FBQTs7TUFBb0IsU0FBUztLQUMxQztXQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBZixDQUEwQixZQUExQixDQUF1QyxDQUFDLFFBQUQsQ0FBdkMsQ0FBK0MsUUFBL0MsRUFBeUQsTUFBekQsRUFEYTtFQUFBLENBM1JmLENBQUE7O21CQUFBOztHQUpzQixVQVp4QixDQUFBOztBQThTQSxJQUFHLGdEQUFIO0FBQ0UsRUFBQSxJQUFHLGdCQUFIO0FBQ0UsSUFBQSxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVQsR0FBb0IsU0FBcEIsQ0FERjtHQUFBLE1BQUE7QUFHRSxVQUFVLElBQUEsS0FBQSxDQUFNLDBCQUFOLENBQVYsQ0FIRjtHQURGO0NBOVNBOztBQW9UQSxJQUFHLGdEQUFIO0FBQ0UsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFqQixDQURGO0NBcFRBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1pc2MgPSByZXF1aXJlKFwiLi9taXNjLmNvZmZlZVwiKVxuXG4jIGEgZ2VuZXJpYyBlZGl0b3IgY2xhc3NcbmNsYXNzIEFic3RyYWN0RWRpdG9yXG4gICMgY3JlYXRlIGFuIGVkaXRvciBpbnN0YW5jZVxuICAjIEBwYXJhbSBpbnN0YW5jZSBbRWRpdG9yXSB0aGUgZWRpdG9yIG9iamVjdFxuICBjb25zdHJ1Y3RvcjogKEBlZGl0b3IpIC0+XG4gICAgQGxvY2tlciA9IG5ldyBtaXNjLkxvY2tlcigpXG5cbiAgIyBnZXQgdGhlIGN1cnJlbnQgY29udGVudCBhcyBhIG90LWRlbHRhXG4gIGdldENvbnRlbnRzOiAoKS0+IHRocm93IG5ldyBFcnJvciBcIkltcGxlbWVudCBtZVwiXG5cbiAgIyBnZXQgdGhlIGN1cnJlbnQgY3Vyc29yIHBvc2l0aW9uXG4gIGdldEN1cnNvcjogKCkgLT4gdGhyb3cgbmV3IEVycm9yIFwiSW1wbGVtZW50IG1lXCJcbiAgIyBzZXQgdGhlIGN1cnJlbnQgY3Vyc29yIHBvc2l0aW9uXG4gICMgQHBhcmFtIHBhcmFtIFtPcHRpb25dIHRoZSBvcHRpb25zXG4gICMgQG9wdGlvbiBwYXJhbSBbSW50ZWdlcl0gaWQgdGhlIGlkIG9mIHRoZSBhdXRob3JcbiAgIyBAb3B0aW9uIHBhcmFtIFtJbnRlZ2VyXSBpbmRleCB0aGUgaW5kZXggb2YgdGhlIGN1cnNvclxuICAjIEBvcHRpb24gcGFyYW0gW1N0cmluZ10gdGV4dCB0aGUgdGV4dCBvZiB0aGUgY3Vyc29yXG4gICMgQG9wdGlvbiBwYXJhbSBbU3RyaW5nXSBjb2xvciB0aGUgY29sb3Igb2YgdGhlIGN1cnNvclxuICBzZXRDdXJzb3I6IChwYXJhbSkgLT4gdGhyb3cgbmV3IEVycm9yIFwiSW1wbGVtZW50IG1lXCJcbiAgcmVtb3ZlQ3Vyc29yOiAoKS0+IHRocm93IG5ldyBFcnJvciBcIkltcGxlbWVudCBtZVwiXG5cblxuICAjIHJlbW92ZSBhIGN1cnNvclxuICAjIEBwYXJhbSBpZCBbU3RyaW5nXSB0aGUgaWQgb2YgdGhlIGN1cnNvciB0byByZW1vdmVcbiAgcmVtb3ZlQ3Vyc29yOiAoaWQpIC0+IHRocm93IG5ldyBFcnJvciBcIkltcGxlbWVudCBtZVwiXG5cbiAgIyBkZXNjcmliZSBob3cgdG8gcGFzcyBsb2NhbCBtb2RpZmljYXRpb25zIG9mIHRoZSB0ZXh0IHRvIHRoZSBiYWNrZW5kLlxuICAjIEBwYXJhbSBiYWNrZW5kIFtGdW5jdGlvbl0gdGhlIGZ1bmN0aW9uIHRvIHBhc3MgdGhlIGRlbHRhIHRvXG4gICMgQG5vdGUgVGhlIGJhY2tlbmQgZnVuY3Rpb24gdGFrZXMgYSBsaXN0IG9mIGRlbHRhcyBhcyBhcmd1bWVudFxuICBvYnNlcnZlTG9jYWxUZXh0OiAoYmFja2VuZCkgLT4gdGhyb3cgbmV3IEVycm9yIFwiSW1wbGVtZW50IG1lXCJcblxuICAjIGRlc2NyaWJlIGhvdyB0byBwYXNzIGxvY2FsIG1vZGlmaWNhdGlvbnMgb2YgdGhlIGN1cnNvciB0byB0aGUgYmFja2VuZFxuICAjIEBwYXJhbSBiYWNrZW5kIFtGdW5jdGlvbl0gdGhlIGZ1bmN0aW9uIHRvIHBhc3MgdGhlIG5ldyBwb3NpdGlvbiB0b1xuICAjIEBub3RlIHRoZSBiYWNrZW5kIGZ1bmN0aW9uIHRha2VzIGEgcG9zaXRpb24gYXMgYXJndW1lbnRcbiAgb2JzZXJ2ZUxvY2FsQ3Vyc29yOiAoYmFja2VuZCkgLT4gdGhyb3cgbmV3IEVycm9yIFwiSW1wbGVtZW50IG1lXCJcblxuICAjIEFwcGx5IGRlbHRhIG9uIHRoZSBlZGl0b3JcbiAgIyBAcGFyYW0gZGVsdGEgW0RlbHRhXSB0aGUgZGVsdGEgdG8gcHJvcGFnYXRlIHRvIHRoZSBlZGl0b3JcbiAgIyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9vdHR5cGVzL3JpY2gtdGV4dFxuICB1cGRhdGVDb250ZW50czogKGRlbHRhKSAtPiB0aHJvdyBuZXcgRXJyb3IgXCJJbXBsZW1lbnQgbWVcIlxuXG4gICMgUmVtb3ZlIG9sZCBjb250ZW50IGFuZCBhcHBseSBkZWx0YSBvbiB0aGUgZWRpdG9yXG4gICMgQHBhcmFtIGRlbHRhIFtEZWx0YV0gdGhlIGRlbHRhIHRvIHByb3BhZ2F0ZSB0byB0aGUgZWRpdG9yXG4gICMgQHNlZSBodHRwczovL2dpdGh1Yi5jb20vb3R0eXBlcy9yaWNoLXRleHRcbiAgc2V0Q29udGVudHM6IChkZWx0YSkgLT4gdGhyb3cgbmV3IEVycm9yIFwiSW1wbGVtZW50IG1lXCJcblxuICAjIFJldHVybiB0aGUgZWRpdG9yIGluc3RhbmNlXG4gIGdldEVkaXRvcjogKCktPiB0aHJvdyBuZXcgRXJyb3IgXCJJbXBsZW1lbnQgbWVcIlxuXG4gICMgQ2hlY2sgaWYgdGhlIGVkaXRvciB0cmllcyB0byBhY2N1bXVsYXRlIG1lc3NhZ2VzLiBUaGlzIGlzIGV4ZWN1dGVkIGV2ZXJ5IHRpbWUgYmVmb3JlIFlqcyBleGVjdXRlcyBhIG1lc3NhZ2VzXG4gIGNoZWNrVXBkYXRlOiAoKS0+IHRocm93IG5ldyBFcnJvciBcIkltcGxlbWVudCBtZVwiXG5cbmNsYXNzIFF1aWxsSnMgZXh0ZW5kcyBBYnN0cmFjdEVkaXRvclxuXG4gIGNvbnN0cnVjdG9yOiAoQGVkaXRvcikgLT5cbiAgICBzdXBlciBAZWRpdG9yXG4gICAgQF9jdXJzb3JzID0gQGVkaXRvci5nZXRNb2R1bGUoXCJtdWx0aS1jdXJzb3JcIilcblxuICAjIFJldHVybiB0aGUgbGVuZ3RoIG9mIHRoZSB0ZXh0XG4gIGdldExlbmd0aDogKCktPlxuICAgIEBlZGl0b3IuZ2V0TGVuZ3RoKClcblxuICBnZXRDdXJzb3JQb3NpdGlvbjogLT5cbiAgICBzZWxlY3Rpb24gPSBAZWRpdG9yLmdldFNlbGVjdGlvbigpXG4gICAgaWYgc2VsZWN0aW9uXG4gICAgICBzZWxlY3Rpb24uc3RhcnRcbiAgICBlbHNlXG4gICAgICAwXG5cbiAgZ2V0Q29udGVudHM6ICgpLT5cbiAgICBAZWRpdG9yLmdldENvbnRlbnRzKCkub3BzXG5cbiAgc2V0Q3Vyc29yOiAocGFyYW0pIC0+IEBsb2NrZXIudHJ5ICgpPT5cbiAgICBjdXJzb3IgPSBAX2N1cnNvcnMuY3Vyc29yc1twYXJhbS5pZF1cbiAgICBpZiBjdXJzb3I/IGFuZCBjdXJzb3IuY29sb3IgPT0gcGFyYW0uY29sb3JcbiAgICAgIGZ1biA9IChpbmRleCkgPT5cbiAgICAgICAgQF9jdXJzb3JzLm1vdmVDdXJzb3IgcGFyYW0uaWQsIGluZGV4XG4gICAgZWxzZVxuICAgICAgaWYgY3Vyc29yPyBhbmQgY3Vyc29yLmNvbG9yPyBhbmQgY3Vyc29yLmNvbG9yICE9IHBhcmFtLmNvbG9yXG4gICAgICAgIEByZW1vdmVDdXJzb3IgcGFyYW0uaWRcblxuICAgICAgZnVuID0gKGluZGV4KSA9PlxuICAgICAgICBAX2N1cnNvcnMuc2V0Q3Vyc29yKHBhcmFtLmlkLCBpbmRleCxcbiAgICAgICAgICBwYXJhbS5uYW1lLCBwYXJhbS5jb2xvcilcblxuICAgIGlmIHBhcmFtLmluZGV4P1xuICAgICAgZnVuIHBhcmFtLmluZGV4XG5cbiAgcmVtb3ZlQ3Vyc29yOiAoaWQpIC0+XG4gICAgQF9jdXJzb3JzLnJlbW92ZUN1cnNvcihpZClcblxuICByZW1vdmVDdXJzb3I6IChpZCktPlxuICAgICAgQF9jdXJzb3JzLnJlbW92ZUN1cnNvciBpZFxuXG4gIG9ic2VydmVMb2NhbFRleHQ6IChiYWNrZW5kKS0+XG4gICAgQGVkaXRvci5vbiBcInRleHQtY2hhbmdlXCIsIChkZWx0YXMsIHNvdXJjZSkgLT5cbiAgICAgICMgY2FsbCB0aGUgYmFja2VuZCB3aXRoIGRlbHRhc1xuICAgICAgcG9zaXRpb24gPSBiYWNrZW5kIGRlbHRhcy5vcHNcbiAgICAgICMgdHJpZ2dlciBhbiBleHRyYSBldmVudCB0byBtb3ZlIGN1cnNvciB0byBwb3NpdGlvbiBvZiBpbnNlcnRlZCB0ZXh0XG4gICAgICBAZWRpdG9yLnNlbGVjdGlvbi5lbWl0dGVyLmVtaXQoXG4gICAgICAgIEBlZGl0b3Iuc2VsZWN0aW9uLmVtaXR0ZXIuY29uc3RydWN0b3IuZXZlbnRzLlNFTEVDVElPTl9DSEFOR0UsXG4gICAgICAgIEBlZGl0b3IucXVpbGwuZ2V0U2VsZWN0aW9uKCksXG4gICAgICAgIFwidXNlclwiKVxuXG4gIG9ic2VydmVMb2NhbEN1cnNvcjogKGJhY2tlbmQpIC0+XG4gICAgQGVkaXRvci5vbiBcInNlbGVjdGlvbi1jaGFuZ2VcIiwgKHJhbmdlLCBzb3VyY2UpLT5cbiAgICAgIGlmIHJhbmdlIGFuZCByYW5nZS5zdGFydCA9PSByYW5nZS5lbmRcbiAgICAgICAgYmFja2VuZCByYW5nZS5zdGFydFxuXG4gIHVwZGF0ZUNvbnRlbnRzOiAoZGVsdGEpLT5cbiAgICBAZWRpdG9yLnVwZGF0ZUNvbnRlbnRzIGRlbHRhXG5cbiAgc2V0Q29udGVudHM6IChkZWx0YSktPlxuICAgIEBlZGl0b3Iuc2V0Q29udGVudHMoZGVsdGEpXG5cbiAgZ2V0RWRpdG9yOiAoKS0+XG4gICAgQGVkaXRvclxuXG4gIGNoZWNrVXBkYXRlOiAoKS0+XG4gICAgQGVkaXRvci5lZGl0b3IuY2hlY2tVcGRhdGUoKVxuXG5jbGFzcyBUZXN0RWRpdG9yIGV4dGVuZHMgQWJzdHJhY3RFZGl0b3JcblxuICBjb25zdHJ1Y3RvcjogKEBlZGl0b3IpIC0+XG4gICAgc3VwZXJcblxuICBnZXRMZW5ndGg6KCkgLT5cbiAgICAwXG5cbiAgZ2V0Q3Vyc29yUG9zaXRpb246IC0+XG4gICAgMFxuXG4gIGdldENvbnRlbnRzOiAoKSAtPlxuICAgIG9wczogW3tpbnNlcnQ6IFwiV2VsbCwgdGhpcyBpcyBhIHRlc3QhXCJ9XG4gICAgICB7aW5zZXJ0OiBcIkFuZCBJJ20gYm9sZOKAplwiLCBhdHRyaWJ1dGVzOiB7Ym9sZDp0cnVlfX1dXG5cbiAgc2V0Q3Vyc29yOiAoKSAtPlxuICAgIFwiXCJcblxuICBvYnNlcnZlTG9jYWxUZXh0OihiYWNrZW5kKSAtPlxuICAgIFwiXCJcblxuICBvYnNlcnZlTG9jYWxDdXJzb3I6IChiYWNrZW5kKSAtPlxuICAgIFwiXCJcblxuICB1cGRhdGVDb250ZW50czogKGRlbHRhKSAtPlxuICAgIFwiXCJcblxuICBzZXRDb250ZW50czogKGRlbHRhKS0+XG4gICAgXCJcIlxuXG4gIGdldEVkaXRvcjogKCktPlxuICAgIEBlZGl0b3JcblxuZXhwb3J0cy5RdWlsbEpzID0gUXVpbGxKc1xuZXhwb3J0cy5UZXN0RWRpdG9yID0gVGVzdEVkaXRvclxuZXhwb3J0cy5BYnN0cmFjdEVkaXRvciA9IEFic3RyYWN0RWRpdG9yXG4iLCJjbGFzcyBMb2NrZXJcbiAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgQGlzX2xvY2tlZCA9IGZhbHNlXG5cbiAgdHJ5OiAoZnVuKSAtPlxuICAgIGlmIEBpc19sb2NrZWRcbiAgICAgIHJldHVyblxuXG4gICAgQGlzX2xvY2tlZCA9IHRydWVcbiAgICByZXQgPSBkbyBmdW5cbiAgICBAaXNfbG9ja2VkID0gZmFsc2VcbiAgICByZXR1cm4gcmV0XG5cbiMgYSBiYXNpYyBjbGFzcyB3aXRoIGdlbmVyaWMgZ2V0dGVyIC8gc2V0dGVyIGZ1bmN0aW9uXG5jbGFzcyBCYXNlQ2xhc3NcbiAgY29uc3RydWN0b3I6IC0+XG4gICAgIyBvd25Qcm9wZXJ0eSBpcyB1bnNhZmUuIFJhdGhlciBwdXQgaXQgb24gYSBkZWRpY2F0ZWQgcHJvcGVydHkgbGlrZS4uXG4gICAgQF90bXBfbW9kZWwgPSB7fVxuXG4gICMgVHJ5IHRvIGZpbmQgdGhlIHByb3BlcnR5IGluIEBfbW9kZWwsIGVsc2UgcmV0dXJuIHRoZVxuICAjIHRtcF9tb2RlbFxuICBfZ2V0OiAocHJvcCkgLT5cbiAgICBpZiBub3QgQF9tb2RlbD9cbiAgICAgIEBfdG1wX21vZGVsW3Byb3BdXG4gICAgZWxzZVxuICAgICAgQF9tb2RlbC52YWwocHJvcClcbiAgIyBUcnkgdG8gc2V0IHRoZSBwcm9wZXJ0eSBpbiBAX21vZGVsLCBlbHNlIHNldCB0aGVcbiAgIyB0bXBfbW9kZWxcbiAgX3NldDogKHByb3AsIHZhbCkgLT5cbiAgICBpZiBub3QgQF9tb2RlbD9cbiAgICAgIEBfdG1wX21vZGVsW3Byb3BdID0gdmFsXG4gICAgZWxzZVxuICAgICAgQF9tb2RlbC52YWwocHJvcCwgdmFsKVxuXG4gICMgc2luY2Ugd2UgYWxyZWFkeSBhc3N1bWUgdGhhdCBhbnkgaW5zdGFuY2Ugb2YgQmFzZUNsYXNzIHVzZXMgYSBNYXBNYW5hZ2VyXG4gICMgV2UgY2FuIGNyZWF0ZSBpdCBoZXJlLCB0byBzYXZlIGxpbmVzIG9mIGNvZGVcbiAgX2dldE1vZGVsOiAoWSwgT3BlcmF0aW9uKS0+XG4gICAgaWYgbm90IEBfbW9kZWw/XG4gICAgICBAX21vZGVsID0gbmV3IE9wZXJhdGlvbi5NYXBNYW5hZ2VyKEApLmV4ZWN1dGUoKVxuICAgICAgZm9yIGtleSwgdmFsdWUgb2YgQF90bXBfbW9kZWxcbiAgICAgICAgQF9tb2RlbC52YWwoa2V5LCB2YWx1ZSlcbiAgICBAX21vZGVsXG5cbiAgX3NldE1vZGVsOiAoQF9tb2RlbCktPlxuICAgIGRlbGV0ZSBAX3RtcF9tb2RlbFxuXG5pZiBtb2R1bGU/XG4gIGV4cG9ydHMuQmFzZUNsYXNzID0gQmFzZUNsYXNzXG4gIGV4cG9ydHMuTG9ja2VyID0gTG9ja2VyXG4iLCJtaXNjID0gKHJlcXVpcmUgXCIuL21pc2MuY29mZmVlXCIpXG5CYXNlQ2xhc3MgPSBtaXNjLkJhc2VDbGFzc1xuTG9ja2VyID0gbWlzYy5Mb2NrZXJcbkVkaXRvcnMgPSAocmVxdWlyZSBcIi4vZWRpdG9ycy5jb2ZmZWVcIilcblxuIyBBbGwgZGVwZW5kZW5jaWVzIChsaWtlIFkuU2VsZWN0aW9ucykgdG8gb3RoZXIgdHlwZXMgKHRoYXQgaGF2ZSBpdHMgb3duXG4jIHJlcG9zaXRvcnkpIHNob3VsZCAgYmUgaW5jbHVkZWQgYnkgdGhlIHVzZXIgKGluIG9yZGVyIHRvIHJlZHVjZSB0aGUgYW1vdW50IG9mXG4jIGRvd25sb2FkZWQgY29udGVudCkuXG4jIFdpdGggaHRtbDUgaW1wb3J0cywgd2UgY2FuIGluY2x1ZGUgaXQgYXV0b21hdGljYWxseSB0b28uIEJ1dCB3aXRoIHRoZSBvbGRcbiMgc2NyaXB0IHRhZ3MgdGhpcyBpcyB0aGUgYmVzdCBzb2x1dGlvbiB0aGF0IGNhbWUgdG8gbXkgbWluZC5cblxuIyBBIGNsYXNzIGhvbGRpbmcgdGhlIGluZm9ybWF0aW9uIGFib3V0IHJpY2ggdGV4dFxuY2xhc3MgWVJpY2hUZXh0IGV4dGVuZHMgQmFzZUNsYXNzXG4gICMgQHBhcmFtIGNvbnRlbnQgW1N0cmluZ10gYW4gaW5pdGlhbCBzdHJpbmdcbiAgIyBAcGFyYW0gZWRpdG9yIFtFZGl0b3JdIGFuIGVkaXRvciBpbnN0YW5jZVxuICAjIEBwYXJhbSBhdXRob3IgW1N0cmluZ10gdGhlIG5hbWUgb2YgdGhlIGxvY2FsIGF1dGhvclxuICBjb25zdHJ1Y3RvcjogKGVkaXRvcl9uYW1lLCBlZGl0b3JfaW5zdGFuY2UpIC0+XG4gICAgQGxvY2tlciA9IG5ldyBMb2NrZXIoKVxuXG4gICAgaWYgZWRpdG9yX25hbWU/IGFuZCBlZGl0b3JfaW5zdGFuY2U/XG4gICAgICBAX2JpbmRfbGF0ZXIgPVxuICAgICAgICBuYW1lOiBlZGl0b3JfbmFtZVxuICAgICAgICBpbnN0YW5jZTogZWRpdG9yX2luc3RhbmNlXG5cbiAgICAjIFRPRE86IGdlbmVyYXRlIGEgVUlEICh5b3UgY2FuIGdldCBhIHVuaXF1ZSBpZCBieSBjYWxsaW5nXG4gICAgIyBgQF9tb2RlbC5nZXRVaWQoKWAgLSBpcyB0aGlzIHdoYXQgeW91IG1lYW4/KVxuICAgICMgQGF1dGhvciA9IGF1dGhvclxuICAgICMgVE9ETzogYXNzaWduIGFuIGlkIC8gYXV0aG9yIG5hbWUgdG8gdGhlIHJpY2ggdGV4dCBpbnN0YW5jZSBmb3IgYXV0aG9yc2hpcFxuXG4gICNcbiAgIyBCaW5kIHRoZSBSaWNoVGV4dCB0eXBlIHRvIGEgcmljaCB0ZXh0IGVkaXRvciAoZS5nLiBxdWlsbGpzKVxuICAjXG4gIGJpbmQ6ICgpLT5cbiAgICAjIFRPRE86IGJpbmQgdG8gbXVsdGlwbGUgZWRpdG9yc1xuICAgIGlmIGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIEVkaXRvcnMuQWJzdHJhY3RFZGl0b3JcbiAgICAgICMgaXMgYWxyZWFkeSBhbiBlZGl0b3IhXG4gICAgICBAZWRpdG9yID0gYXJndW1lbnRzWzBdXG4gICAgZWxzZVxuICAgICAgW2VkaXRvcl9uYW1lLCBlZGl0b3JfaW5zdGFuY2VdID0gYXJndW1lbnRzXG4gICAgICBpZiBAZWRpdG9yPyBhbmQgQGVkaXRvci5nZXRFZGl0b3IoKSBpcyBlZGl0b3JfaW5zdGFuY2VcbiAgICAgICAgIyByZXR1cm4sIGlmIEBlZGl0b3IgaXMgYWxyZWFkeSBib3VuZCEgKG5ldmVyIGJpbmQgdHdpY2UhKVxuICAgICAgICByZXR1cm5cbiAgICAgIEVkaXRvciA9IEVkaXRvcnNbZWRpdG9yX25hbWVdXG4gICAgICBpZiBFZGl0b3I/XG4gICAgICAgIEBlZGl0b3IgPSBuZXcgRWRpdG9yIGVkaXRvcl9pbnN0YW5jZVxuICAgICAgZWxzZVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJUaGlzIHR5cGUgb2YgZWRpdG9yIGlzIG5vdCBzdXBwb3J0ZWQhIChcIiArXG4gICAgICAgICAgZWRpdG9yX25hbWUgKyBcIilcIlxuXG4gICAgIyBUT0RPOiBwYXJzZSB0aGUgZm9sbG93aW5nIGRpcmVjdGx5IGZyb20gJGNoYXJhY3RlcnMrJHNlbGVjdGlvbnMgKGluIE8obikpXG4gICAgQGVkaXRvci5zZXRDb250ZW50c1xuICAgICAgb3BzOiBAZ2V0RGVsdGEoKVxuXG4gICAgIyBiaW5kIHRoZSByZXN0Li5cbiAgICAjIFRPRE86IHJlbW92ZSBvYnNlcnZlcnMsIHdoZW4gZWRpdG9yIGlzIG92ZXJ3cml0dGVuXG4gICAgQGVkaXRvci5vYnNlcnZlTG9jYWxUZXh0IEBwYXNzRGVsdGFzXG4gICAgQGJpbmRFdmVudHNUb0VkaXRvciBAZWRpdG9yXG4gICAgQGVkaXRvci5vYnNlcnZlTG9jYWxDdXJzb3IgQHVwZGF0ZUN1cnNvclBvc2l0aW9uXG5cbiAgICAjIHB1bGwgY2hhbmdlcyBmcm9tIHF1aWxsLCBiZWZvcmUgbWVzc2FnZSBpcyByZWNlaXZlZFxuICAgICMgYXMgc3VnZ2VzdGVkIGh0dHBzOi8vZGlzY3Vzcy5xdWlsbGpzLmNvbS90L3Byb2JsZW1zLWluLWNvbGxhYm9yYXRpdmUtaW1wbGVtZW50YXRpb24vMjU4XG4gICAgIyBUT0RPOiBtb3ZlIHRoaXMgdG8gRWRpdG9ycy5jb2ZmZWVcbiAgICBAX21vZGVsLmNvbm5lY3Rvci5yZWNlaXZlX2hhbmRsZXJzLnVuc2hpZnQgKCk9PlxuICAgICAgQGVkaXRvci5jaGVja1VwZGF0ZSgpXG5cblxuICBnZXREZWx0YTogKCktPlxuICAgIHRleHRfY29udGVudCA9IEBfbW9kZWwuZ2V0Q29udGVudCgnY2hhcmFjdGVycycpLnZhbCgpXG4gICAgIyB0cmFuc2Zvcm0gWS5TZWxlY3Rpb25zLmdldFNlbGVjdGlvbnMoKSB0byBhIGRlbHRhXG4gICAgZXhwZWN0ZWRfcG9zID0gMFxuICAgIGRlbHRhcyA9IFtdXG4gICAgc2VsZWN0aW9ucyA9IEBfbW9kZWwuZ2V0Q29udGVudChcInNlbGVjdGlvbnNcIilcbiAgICBmb3Igc2VsIGluIHNlbGVjdGlvbnMuZ2V0U2VsZWN0aW9ucyhAX21vZGVsLmdldENvbnRlbnQoXCJjaGFyYWN0ZXJzXCIpKVxuICAgICAgIyAoKzEpLCBiZWNhdXNlIGlmIHdlIHNlbGVjdCBmcm9tIDEgdG8gMSAod2l0aCB5LXNlbGVjdGlvbnMpLCB0aGVuIHRoZVxuICAgICAgIyBsZW5ndGggaXMgMVxuICAgICAgc2VsZWN0aW9uX2xlbmd0aCA9IHNlbC50byAtIHNlbC5mcm9tICsgMVxuICAgICAgaWYgZXhwZWN0ZWRfcG9zIGlzbnQgc2VsLmZyb21cbiAgICAgICAgIyBUaGVyZSBpcyB1bnNlbGVjdGVkIHRleHQuICRyZXRhaW4gdG8gdGhlIG5leHQgc2VsZWN0aW9uXG4gICAgICAgIHVuc2VsZWN0ZWRfaW5zZXJ0X2NvbnRlbnQgPSB0ZXh0X2NvbnRlbnQuc3BsaWNlKFxuICAgICAgICAgIDAsIHNlbC5mcm9tLWV4cGVjdGVkX3BvcyApXG4gICAgICAgICAgLmpvaW4oJycpXG4gICAgICAgIGRlbHRhcy5wdXNoXG4gICAgICAgICAgaW5zZXJ0OiB1bnNlbGVjdGVkX2luc2VydF9jb250ZW50XG4gICAgICAgIGV4cGVjdGVkX3BvcyArPSB1bnNlbGVjdGVkX2luc2VydF9jb250ZW50Lmxlbmd0aFxuICAgICAgaWYgZXhwZWN0ZWRfcG9zIGlzbnQgc2VsLmZyb21cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwiVGhpcyBwb3J0aW9uIG9mIGNvZGUgbXVzdCBub3QgYmUgcmVhY2hlZCBpbiBnZXREZWx0YSFcIlxuICAgICAgZGVsdGFzLnB1c2hcbiAgICAgICAgaW5zZXJ0OiB0ZXh0X2NvbnRlbnQuc3BsaWNlKDAsIHNlbGVjdGlvbl9sZW5ndGgpLmpvaW4oJycpXG4gICAgICAgIGF0dHJpYnV0ZXM6IHNlbC5hdHRyc1xuICAgICAgZXhwZWN0ZWRfcG9zICs9IHNlbGVjdGlvbl9sZW5ndGhcbiAgICBpZiB0ZXh0X2NvbnRlbnQubGVuZ3RoID4gMFxuICAgICAgZGVsdGFzLnB1c2hcbiAgICAgICAgaW5zZXJ0OiB0ZXh0X2NvbnRlbnQuam9pbignJylcbiAgICBkZWx0YXNcblxuICBfZ2V0TW9kZWw6IChZLCBPcGVyYXRpb24pIC0+XG4gICAgaWYgbm90IEBfbW9kZWw/XG4gICAgICAjIHdlIHNhdmUgdGhpcyBzdHVmZiBhcyBfc3RhdGljXyBjb250ZW50IG5vdy5cbiAgICAgICMgVGhlcmVmb3JlLCB5b3UgY2FuJ3Qgb3ZlcndyaXRlIGl0LCBhZnRlciB5b3Ugb25jZSBzYXZlZCBpdC5cbiAgICAgICMgQnV0IG9uIHRoZSB1cHNpZGUsIHdlIGNhbiBhbHdheXMgbWFrZSBzdXJlLCB0aGF0IHRoZXkgYXJlIGRlZmluZWQhXG4gICAgICBjb250ZW50X29wZXJhdGlvbnMgPVxuICAgICAgICBzZWxlY3Rpb25zOiBuZXcgWS5TZWxlY3Rpb25zKClcbiAgICAgICAgY2hhcmFjdGVyczogbmV3IFkuTGlzdCgpXG4gICAgICAgIGN1cnNvcnM6IG5ldyBZLk9iamVjdCgpXG4gICAgICBAX21vZGVsID0gbmV3IE9wZXJhdGlvbi5NYXBNYW5hZ2VyKEAsIG51bGwsIHt9LCBjb250ZW50X29wZXJhdGlvbnMgKS5leGVjdXRlKClcblxuICAgICAgQF9zZXRNb2RlbCBAX21vZGVsXG5cbiAgICAgIGlmIEBfYmluZF9sYXRlcj9cbiAgICAgICAgRWRpdG9yID0gRWRpdG9yc1tAX2JpbmRfbGF0ZXIubmFtZV1cbiAgICAgICAgaWYgRWRpdG9yP1xuICAgICAgICAgIGVkaXRvciA9IG5ldyBFZGl0b3IgQF9iaW5kX2xhdGVyLmluc3RhbmNlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJUaGlzIHR5cGUgb2YgZWRpdG9yIGlzIG5vdCBzdXBwb3J0ZWQhIChcIitlZGl0b3JfbmFtZStcIikgLS0gZmF0YWwgZXJyb3IhXCJcbiAgICAgICAgQHBhc3NEZWx0YXMgZWRpdG9yLmdldENvbnRlbnRzKClcbiAgICAgICAgQGJpbmQgZWRpdG9yXG4gICAgICAgIGRlbGV0ZSBAX2JpbmRfbGF0ZXJcblxuICAgICAgIyBsaXN0ZW4gdG8gZXZlbnRzIG9uIHRoZSBtb2RlbCB1c2luZyB0aGUgZnVuY3Rpb24gcHJvcGFnYXRlVG9FZGl0b3JcbiAgICAgIEBfbW9kZWwub2JzZXJ2ZSBAcHJvcGFnYXRlVG9FZGl0b3JcbiAgICByZXR1cm4gQF9tb2RlbFxuXG4gIF9zZXRNb2RlbDogKG1vZGVsKSAtPlxuICAgIHN1cGVyXG5cbiAgX25hbWU6IFwiUmljaFRleHRcIlxuXG4gIGdldFRleHQ6ICgpLT5cbiAgICBAX21vZGVsLmdldENvbnRlbnQoJ2NoYXJhY3RlcnMnKS52YWwoKS5qb2luKCcnKVxuXG4gICMgaW5zZXJ0IG91ciBvd24gY3Vyc29yIGluIHRoZSBjdXJzb3JzIG9iamVjdFxuICAjIEBwYXJhbSBwb3NpdGlvbiBbSW50ZWdlcl0gdGhlIHBvc2l0aW9uIHdoZXJlIHRvIGluc2VydCBpdFxuICBzZXRDdXJzb3IgOiAocG9zaXRpb24pIC0+XG4gICAgQHNlbGZDdXJzb3IgPSBAX21vZGVsLmdldENvbnRlbnQoXCJjaGFyYWN0ZXJzXCIpLnJlZihwb3NpdGlvbilcbiAgICBAX21vZGVsLmdldENvbnRlbnQoXCJjdXJzb3JzXCIpLnZhbChAX21vZGVsLkhCLmdldFVzZXJJZCgpLCBAc2VsZkN1cnNvcilcblxuXG4gICMgcGFzcyBkZWx0YXMgdG8gdGhlIGNoYXJhY3RlciBpbnN0YW5jZVxuICAjIEBwYXJhbSBkZWx0YXMgW0FycmF5PE9iamVjdD5dIGFuIGFycmF5IG9mIGRlbHRhcyAoc2VlIG90LXR5cGVzIGZvciBtb3JlIGluZm8pXG4gIHBhc3NEZWx0YXMgOiAoZGVsdGFzKSA9PiBAbG9ja2VyLnRyeSAoKT0+XG4gICAgcG9zaXRpb24gPSAwXG4gICAgZm9yIGRlbHRhIGluIGRlbHRhc1xuICAgICAgcG9zaXRpb24gPSBkZWx0YUhlbHBlciBALCBkZWx0YSwgcG9zaXRpb25cblxuICAjIEBvdmVycmlkZSB1cGRhdGVDdXJzb3JQb3NpdGlvbihpbmRleClcbiAgIyAgIHVwZGF0ZSB0aGUgcG9zaXRpb24gb2Ygb3VyIGN1cnNvciB0byB0aGUgbmV3IG9uZSB1c2luZyBhbiBpbmRleFxuICAjICAgQHBhcmFtIGluZGV4IFtJbnRlZ2VyXSB0aGUgbmV3IGluZGV4XG4gICMgQG92ZXJyaWRlIHVwZGF0ZUN1cnNvclBvc2l0aW9uKGNoYXJhY3RlcilcbiAgIyAgIHVwZGF0ZSB0aGUgcG9zaXRpb24gb2Ygb3VyIGN1cnNvciB0byB0aGUgbmV3IG9uZSB1c2luZyBhIGNoYXJhY3RlclxuICAjICAgQHBhcmFtIGNoYXJhY3RlciBbQ2hhcmFjdGVyXSB0aGUgbmV3IGNoYXJhY3RlclxuICB1cGRhdGVDdXJzb3JQb3NpdGlvbiA6IChvYmopID0+IEBsb2NrZXIudHJ5ICgpPT5cbiAgICBpZiB0eXBlb2Ygb2JqIGlzIFwibnVtYmVyXCJcbiAgICAgIEBzZWxmQ3Vyc29yID0gQF9tb2RlbC5nZXRDb250ZW50KFwiY2hhcmFjdGVyc1wiKS5yZWYob2JqKVxuICAgIGVsc2VcbiAgICAgIEBzZWxmQ3Vyc29yID0gb2JqXG4gICAgQF9tb2RlbC5nZXRDb250ZW50KFwiY3Vyc29yc1wiKS52YWwoQF9tb2RlbC5IQi5nZXRVc2VySWQoKSwgQHNlbGZDdXJzb3IpXG5cbiAgIyBkZXNjcmliZSBob3cgdG8gcHJvcGFnYXRlIHlqcyBldmVudHMgdG8gdGhlIGVkaXRvclxuICAjIFRPRE86IHNob3VsZCBiZSBwcml2YXRlIVxuICBiaW5kRXZlbnRzVG9FZGl0b3IgOiAoZWRpdG9yKSAtPlxuICAgICMgdXBkYXRlIHRoZSBlZGl0b3Igd2hlbiBzb21ldGhpbmcgb24gdGhlICRjaGFyYWN0ZXJzIGhhcHBlbnNcbiAgICBAX21vZGVsLmdldENvbnRlbnQoXCJjaGFyYWN0ZXJzXCIpLm9ic2VydmUgKGV2ZW50cykgPT4gQGxvY2tlci50cnkgKCk9PlxuICAgICAgZm9yIGV2ZW50IGluIGV2ZW50c1xuICAgICAgICBkZWx0YSA9XG4gICAgICAgICAgb3BzOiBbXVxuXG4gICAgICAgIGlmIGV2ZW50LnBvc2l0aW9uID4gMFxuICAgICAgICAgIGRlbHRhLm9wcy5wdXNoIHtyZXRhaW46IGV2ZW50LnBvc2l0aW9ufVxuXG4gICAgICAgIGlmIGV2ZW50LnR5cGUgaXMgXCJpbnNlcnRcIlxuICAgICAgICAgIGRlbHRhLm9wcy5wdXNoIHtpbnNlcnQ6IGV2ZW50LnZhbHVlfVxuXG4gICAgICAgIGVsc2UgaWYgZXZlbnQudHlwZSBpcyBcImRlbGV0ZVwiXG4gICAgICAgICAgZGVsdGEub3BzLnB1c2gge2RlbGV0ZTogMX1cbiAgICAgICAgICAjIGRlbGV0ZSBjdXJzb3IsIGlmIGl0IHJlZmVyZW5jZXMgdG8gdGhpcyBwb3NpdGlvblxuICAgICAgICAgIGZvciBjdXJzb3JfbmFtZSwgY3Vyc29yX3JlZiBpbiBAX21vZGVsLmdldENvbnRlbnQoXCJjdXJzb3JzXCIpLnZhbCgpXG4gICAgICAgICAgICBpZiBjdXJzb3JfcmVmIGlzIGV2ZW50LnJlZmVyZW5jZVxuICAgICAgICAgICAgICAjXG4gICAgICAgICAgICAgICMgd2UgaGF2ZSB0byBkZWxldGUgdGhlIGN1cnNvciBpZiB0aGUgcmVmZXJlbmNlIGRvZXMgbm90IGV4aXN0IGFueW1vcmVcbiAgICAgICAgICAgICAgIyB0aGUgZG93bnNpZGUgb2YgdGhpcyBhcHByb2FjaCBpcyB0aGF0IGV2ZXJ5b25lIHdpbGwgc2VuZCB0aGlzIGRlbGV0ZSBldmVudCFcbiAgICAgICAgICAgICAgIyBpbiB0aGUgZnV0dXJlLCB3ZSBjb3VsZCByZXBsYWNlIHRoZSBjdXJzb3JzLCB3aXRoIGEgeS1zZWxlY3Rpb25zXG4gICAgICAgICAgICAgICNcbiAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCktPlxuICAgICAgICAgICAgICAgICAgQF9tb2RlbC5nZXRDb250ZW50KFwiY3Vyc29yc1wiKS5kZWxldGUoY3Vyc29yX25hbWUpXG4gICAgICAgICAgICAgICAgLCAwKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgQGVkaXRvci51cGRhdGVDb250ZW50cyBkZWx0YVxuXG4gICAgIyB1cGRhdGUgdGhlIGVkaXRvciB3aGVuIHNvbWV0aGluZyBvbiB0aGUgJHNlbGVjdGlvbnMgaGFwcGVuc1xuICAgIEBfbW9kZWwuZ2V0Q29udGVudChcInNlbGVjdGlvbnNcIikub2JzZXJ2ZSAoZXZlbnQpPT4gQGxvY2tlci50cnkgKCk9PlxuICAgICAgYXR0cnMgPSB7fVxuICAgICAgaWYgZXZlbnQudHlwZSBpcyBcInNlbGVjdFwiXG4gICAgICAgIGZvciBhdHRyLHZhbCBvZiBldmVudC5hdHRyc1xuICAgICAgICAgIGF0dHJzW2F0dHJdID0gdmFsXG4gICAgICBlbHNlICMgaXMgXCJ1bnNlbGVjdFwiIVxuICAgICAgICBmb3IgYXR0ciBpbiBldmVudC5hdHRyc1xuICAgICAgICAgIGF0dHJzW2F0dHJdID0gbnVsbFxuICAgICAgcmV0YWluID0gZXZlbnQuZnJvbS5nZXRQb3NpdGlvbigpXG4gICAgICBzZWxlY3Rpb25fbGVuZ3RoID0gZXZlbnQudG8uZ2V0UG9zaXRpb24oKS1ldmVudC5mcm9tLmdldFBvc2l0aW9uKCkrMVxuICAgICAgQGVkaXRvci51cGRhdGVDb250ZW50c1xuICAgICAgICBvcHM6IFtcbiAgICAgICAgICB7cmV0YWluOiByZXRhaW59LFxuICAgICAgICAgIHtyZXRhaW46IHNlbGVjdGlvbl9sZW5ndGgsIGF0dHJpYnV0ZXM6IGF0dHJzfVxuICAgICAgICBdXG5cbiAgICAjIHVwZGF0ZSB0aGUgZWRpdG9yIHdoZW4gdGhlIGN1cnNvciBpcyBtb3ZlZFxuICAgIEBfbW9kZWwuZ2V0Q29udGVudChcImN1cnNvcnNcIikub2JzZXJ2ZSAoZXZlbnRzKT0+IEBsb2NrZXIudHJ5ICgpPT5cbiAgICAgIGZvciBldmVudCBpbiBldmVudHNcbiAgICAgICAgaWYgZXZlbnQudHlwZSBpcyBcInVwZGF0ZVwiIG9yIGV2ZW50LnR5cGUgaXMgXCJhZGRcIlxuICAgICAgICAgIGF1dGhvciA9IGV2ZW50LmNoYW5nZWRCeVxuICAgICAgICAgIHJlZl90b19jaGFyID0gZXZlbnQub2JqZWN0LnZhbChhdXRob3IpXG4gICAgICAgICAgaWYgcmVmX3RvX2NoYXIgaXMgbnVsbFxuICAgICAgICAgICAgcG9zaXRpb24gPSBAZWRpdG9yLmdldExlbmd0aCgpXG4gICAgICAgICAgZWxzZSBpZiByZWZfdG9fY2hhcj9cbiAgICAgICAgICAgIGlmIHJlZl90b19jaGFyLmlzRGVsZXRlZCgpXG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBwb3NpdGlvbiA9IHJlZl90b19jaGFyLmdldFBvc2l0aW9uKClcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBjb25zb2xlLndhcm4gXCJyZWZfdG9fY2hhciBpcyB1bmRlZmluZWRcIlxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICBwYXJhbXMgPVxuICAgICAgICAgICAgaWQ6IGF1dGhvclxuICAgICAgICAgICAgaW5kZXg6IHBvc2l0aW9uXG4gICAgICAgICAgICB0ZXh0OiBhdXRob3JcbiAgICAgICAgICAgIGNvbG9yOiBcImdyZXlcIlxuICAgICAgICAgIEBlZGl0b3Iuc2V0Q3Vyc29yIHBhcmFtc1xuICAgICAgICBlbHNlXG4gICAgICAgICAgQGVkaXRvci5yZW1vdmVDdXJzb3IgZXZlbnQubmFtZVxuXG4gICAgQF9tb2RlbC5jb25uZWN0b3Iub25Vc2VyRXZlbnQgKGV2ZW50KT0+XG4gICAgICBpZiBldmVudC5hY3Rpb24gaXMgXCJ1c2VyTGVmdFwiXG4gICAgICAgIEBfbW9kZWwuZ2V0Q29udGVudChcImN1cnNvcnNcIikuZGVsZXRlKGV2ZW50LnVzZXIpXG5cbiAgIyBBcHBseSBhIGRlbHRhIGFuZCByZXR1cm4gdGhlIG5ldyBwb3NpdGlvblxuICAjIEBwYXJhbSBkZWx0YSBbT2JqZWN0XSBhICpzaW5nbGUqIGRlbHRhIChzZWUgb3QtdHlwZXMgZm9yIG1vcmUgaW5mbylcbiAgIyBAcGFyYW0gcG9zaXRpb24gW0ludGVnZXJdIHN0YXJ0IHBvc2l0aW9uIGZvciB0aGUgZGVsdGEsIGRlZmF1bHQ6IDBcbiAgI1xuICAjIEByZXR1cm4gW0ludGVnZXJdIHRoZSBwb3NpdGlvbiBvZiB0aGUgY3Vyc29yIGFmdGVyIHBhcnNpbmcgdGhlIGRlbHRhXG4gIGRlbHRhSGVscGVyID0gKHRoaXNPYmosIGRlbHRhLCBwb3NpdGlvbiA9IDApIC0+XG4gICAgaWYgZGVsdGE/XG4gICAgICBzZWxlY3Rpb25zID0gdGhpc09iai5fbW9kZWwuZ2V0Q29udGVudChcInNlbGVjdGlvbnNcIilcbiAgICAgIGRlbHRhX3Vuc2VsZWN0aW9ucyA9IFtdXG4gICAgICBkZWx0YV9zZWxlY3Rpb25zID0ge31cbiAgICAgIGZvciBuLHYgb2YgZGVsdGEuYXR0cmlidXRlc1xuICAgICAgICBpZiB2P1xuICAgICAgICAgIGRlbHRhX3NlbGVjdGlvbnNbbl0gPSB2XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBkZWx0YV91bnNlbGVjdGlvbnMucHVzaCBuXG5cbiAgICAgIGlmIGRlbHRhLmluc2VydD9cbiAgICAgICAgaW5zZXJ0X2NvbnRlbnQgPSBkZWx0YS5pbnNlcnRcbiAgICAgICAgY29udGVudF9hcnJheSA9XG4gICAgICAgICAgaWYgdHlwZW9mIGluc2VydF9jb250ZW50IGlzIFwic3RyaW5nXCJcbiAgICAgICAgICAgIGluc2VydF9jb250ZW50LnNwbGl0KFwiXCIpXG4gICAgICAgICAgZWxzZSBpZiB0eXBlb2YgaW5zZXJ0X2NvbnRlbnQgaXMgXCJudW1iZXJcIlxuICAgICAgICAgICAgW2luc2VydF9jb250ZW50XVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIkdvdCBhbiB1bmV4cGVjdGVkIHZhbHVlIGluIGRlbHRhLmluc2VydCEgKFwiICtcbiAgICAgICAgICAgICh0eXBlb2YgY29udGVudCkgKyBcIilcIlxuICAgICAgICBpbnNlcnRIZWxwZXIgdGhpc09iaiwgcG9zaXRpb24sIGNvbnRlbnRfYXJyYXlcbiAgICAgICAgZnJvbSA9IHRoaXNPYmouX21vZGVsLmdldENvbnRlbnQoXCJjaGFyYWN0ZXJzXCIpLnJlZiBwb3NpdGlvblxuICAgICAgICB0byA9IHRoaXNPYmouX21vZGVsLmdldENvbnRlbnQoXCJjaGFyYWN0ZXJzXCIpLnJlZihcbiAgICAgICAgICBwb3NpdGlvbitjb250ZW50X2FycmF5Lmxlbmd0aC0xKVxuICAgICAgICAjIGltcG9ydGFudCwgZmlyc3QgdW5zZWxlY3QsIHRoZW4gc2VsZWN0IVxuICAgICAgICB0aGlzT2JqLl9tb2RlbC5nZXRDb250ZW50KFwic2VsZWN0aW9uc1wiKS51bnNlbGVjdChcbiAgICAgICAgICBmcm9tLCB0bywgZGVsdGFfdW5zZWxlY3Rpb25zKVxuICAgICAgICB0aGlzT2JqLl9tb2RlbC5nZXRDb250ZW50KFwic2VsZWN0aW9uc1wiKS5zZWxlY3QoXG4gICAgICAgICAgZnJvbSwgdG8sIGRlbHRhX3NlbGVjdGlvbnMsIHRydWUpXG5cblxuICAgICAgICByZXR1cm4gcG9zaXRpb24gKyBjb250ZW50X2FycmF5Lmxlbmd0aFxuXG4gICAgICBlbHNlIGlmIGRlbHRhLmRlbGV0ZT9cbiAgICAgICAgZGVsZXRlSGVscGVyIHRoaXNPYmosIHBvc2l0aW9uLCBkZWx0YS5kZWxldGVcbiAgICAgICAgcmV0dXJuIHBvc2l0aW9uXG5cbiAgICAgIGVsc2UgaWYgZGVsdGEucmV0YWluP1xuICAgICAgICByZXRhaW4gPSBwYXJzZUludCBkZWx0YS5yZXRhaW5cbiAgICAgICAgZnJvbSA9IHRoaXNPYmouX21vZGVsLmdldENvbnRlbnQoXCJjaGFyYWN0ZXJzXCIpLnJlZihwb3NpdGlvbilcbiAgICAgICAgIyB3ZSBzZXQgYHBvc2l0aW9uK3JldGFpbi0xYCwgLTEgYmVjYXVzZSB3aGVuIHNlbGVjdGluZyBvbmUgY2hhcixcbiAgICAgICAgIyBZLXNlbGVjdGlvbnMgd2lsbCBvbmx5IG1hcmsgdGhpcyBvbmUgY2hhciAoYXMgYmVnaW5uaW5nIGFuZCBlbmQpXG4gICAgICAgIHRvID0gdGhpc09iai5fbW9kZWwuZ2V0Q29udGVudChcImNoYXJhY3RlcnNcIikucmVmKHBvc2l0aW9uICsgcmV0YWluIC0gMSlcbiAgICAgICAgIyBpbXBvcnRhbnQsIGZpcnN0IHVuc2VsZWN0LCB0aGVuIHNlbGVjdCFcbiAgICAgICAgdGhpc09iai5fbW9kZWwuZ2V0Q29udGVudChcInNlbGVjdGlvbnNcIikudW5zZWxlY3QoXG4gICAgICAgICAgZnJvbSwgdG8sIGRlbHRhX3Vuc2VsZWN0aW9ucylcbiAgICAgICAgdGhpc09iai5fbW9kZWwuZ2V0Q29udGVudChcInNlbGVjdGlvbnNcIikuc2VsZWN0KFxuICAgICAgICAgIGZyb20sIHRvLCBkZWx0YV9zZWxlY3Rpb25zKVxuXG5cbiAgICAgICAgcmV0dXJuIHBvc2l0aW9uICsgcmV0YWluXG4gICAgICB0aHJvdyBuZXcgRXJyb3IgXCJUaGlzIHBhcnQgb2YgY29kZSBtdXN0IG5vdCBiZSByZWFjaGVkIVwiXG5cbiAgaW5zZXJ0SGVscGVyID0gKHRoaXNPYmosIHBvc2l0aW9uLCBjb250ZW50X2FycmF5KSAtPlxuICAgIHRoaXNPYmouX21vZGVsLmdldENvbnRlbnQoXCJjaGFyYWN0ZXJzXCIpLmluc2VydENvbnRlbnRzIHBvc2l0aW9uLCBjb250ZW50X2FycmF5XG5cbiAgZGVsZXRlSGVscGVyID0gKHRoaXNPYmosIHBvc2l0aW9uLCBsZW5ndGggPSAxKSAtPlxuICAgIHRoaXNPYmouX21vZGVsLmdldENvbnRlbnQoXCJjaGFyYWN0ZXJzXCIpLmRlbGV0ZSBwb3NpdGlvbiwgbGVuZ3RoXG5cbmlmIHdpbmRvdz9cbiAgaWYgd2luZG93Llk/XG4gICAgd2luZG93LlkuUmljaFRleHQgPSBZUmljaFRleHRcbiAgZWxzZVxuICAgIHRocm93IG5ldyBFcnJvciBcIllvdSBtdXN0IGZpcnN0IGltcG9ydCBZIVwiXG5cbmlmIG1vZHVsZT9cbiAgbW9kdWxlLmV4cG9ydHMgPSBZUmljaFRleHRcbiJdfQ==
