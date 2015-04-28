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
        if (param.index != null) {
          return _this._cursors.setCursor(param.id, param.index, param.text, param.color);
        }
      };
    })(this));
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
    return this.editor.observeLocalCursor(this.updateCursorPosition);
  };

  YRichText.prototype.getDelta = function() {
    var deltas, expected_pos, sel, selection_length, text_content, unselected_insert_content, _i, _len, _ref;
    text_content = this._model.getContent('characters').val();
    expected_pos = 0;
    deltas = [];
    _ref = this._model.getContent("selections").getSelections(this._model.getContent("characters"));
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
        console.log(deltas);
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
        thisObj._model.getContent("selections").select(from, to, delta_selections, true);
        thisObj._model.getContent("selections").unselect(from, to, delta_unselections);
        return position + content_array.length;
      } else if (delta["delete"] != null) {
        deleteHelper(thisObj, position, delta["delete"]);
        return position;
      } else if (delta.retain != null) {
        retain = parseInt(delta.retain);
        from = thisObj._model.getContent("characters").ref(position);
        to = thisObj._model.getContent("characters").ref(position + retain - 1);
        thisObj._model.getContent("selections").select(from, to, delta_selections);
        thisObj._model.getContent("selections").unselect(from, to, delta_unselections);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Rtb25hZC9naXQveS1yaWNodGV4dC9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9kbW9uYWQvZ2l0L3ktcmljaHRleHQvbGliL2VkaXRvcnMuY29mZmVlIiwiL2hvbWUvZG1vbmFkL2dpdC95LXJpY2h0ZXh0L2xpYi9taXNjLmNvZmZlZSIsIi9ob21lL2Rtb25hZC9naXQveS1yaWNodGV4dC9saWIveS1yaWNodGV4dC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBLHlDQUFBO0VBQUE7aVNBQUE7O0FBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSLENBQVAsQ0FBQTs7QUFBQTtBQU1lLEVBQUEsd0JBQUUsTUFBRixHQUFBO0FBQ1gsSUFEWSxJQUFDLENBQUEsU0FBQSxNQUNiLENBQUE7QUFBQSxJQUFBLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxJQUFJLENBQUMsTUFBTCxDQUFBLENBQWQsQ0FEVztFQUFBLENBQWI7O0FBQUEsMkJBSUEsV0FBQSxHQUFhLFNBQUEsR0FBQTtBQUFLLFVBQVUsSUFBQSxLQUFBLENBQU0sY0FBTixDQUFWLENBQUw7RUFBQSxDQUpiLENBQUE7O0FBQUEsMkJBT0EsU0FBQSxHQUFXLFNBQUEsR0FBQTtBQUFNLFVBQVUsSUFBQSxLQUFBLENBQU0sY0FBTixDQUFWLENBQU47RUFBQSxDQVBYLENBQUE7O0FBQUEsMkJBY0EsU0FBQSxHQUFXLFNBQUMsS0FBRCxHQUFBO0FBQVcsVUFBVSxJQUFBLEtBQUEsQ0FBTSxjQUFOLENBQVYsQ0FBWDtFQUFBLENBZFgsQ0FBQTs7QUFBQSwyQkFlQSxZQUFBLEdBQWMsU0FBQSxHQUFBO0FBQUssVUFBVSxJQUFBLEtBQUEsQ0FBTSxjQUFOLENBQVYsQ0FBTDtFQUFBLENBZmQsQ0FBQTs7QUFBQSwyQkFxQkEsZ0JB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QUFHLGdEQUFIO0FBQ0UsRUFBQSxJQUFHLGdCQUFIO0FBQ0UsSUFBQSxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVQsR0FBb0IsU0FBcEIsQ0FERjtHQUFBLE1BQUE7QUFHRSxVQUFVLElBQUEsS0FBQSxDQUFNLDBCQUFOLENBQVYsQ0FIRjtHQURGO0NBelJBOztBQStSQSxJQUFHLGdEQUFIO0FBQ0UsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFqQixDQURGO0NBL1JBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1pc2MgPSByZXF1aXJlKFwiLi9taXNjLmNvZmZlZVwiKVxuXG4jIGEgZ2VuZXJpYyBlZGl0b3IgY2xhc3NcbmNsYXNzIEFic3RyYWN0RWRpdG9yXG4gICMgY3JlYXRlIGFuIGVkaXRvciBpbnN0YW5jZVxuICAjIEBwYXJhbSBpbnN0YW5jZSBbRWRpdG9yXSB0aGUgZWRpdG9yIG9iamVjdFxuICBjb25zdHJ1Y3RvcjogKEBlZGl0b3IpIC0+XG4gICAgQGxvY2tlciA9IG5ldyBtaXNjLkxvY2tlcigpXG5cbiAgIyBnZXQgdGhlIGN1cnJlbnQgY29udGVudCBhcyBhIG90LWRlbHRhXG4gIGdldENvbnRlbnRzOiAoKS0+IHRocm93IG5ldyBFcnJvciBcIkltcGxlbWVudCBtZVwiXG5cbiAgIyBnZXQgdGhlIGN1cnJlbnQgY3Vyc29yIHBvc2l0aW9uXG4gIGdldEN1cnNvcjogKCkgLT4gdGhyb3cgbmV3IEVycm9yIFwiSW1wbGVtZW50IG1lXCJcbiAgIyBzZXQgdGhlIGN1cnJlbnQgY3Vyc29yIHBvc2l0aW9uXG4gICMgQHBhcmFtIHBhcmFtIFtPcHRpb25dIHRoZSBvcHRpb25zXG4gICMgQG9wdGlvbiBwYXJhbSBbSW50ZWdlcl0gaWQgdGhlIGlkIG9mIHRoZSBhdXRob3JcbiAgIyBAb3B0aW9uIHBhcmFtIFtJbnRlZ2VyXSBpbmRleCB0aGUgaW5kZXggb2YgdGhlIGN1cnNvclxuICAjIEBvcHRpb24gcGFyYW0gW1N0cmluZ10gdGV4dCB0aGUgdGV4dCBvZiB0aGUgY3Vyc29yXG4gICMgQG9wdGlvbiBwYXJhbSBbU3RyaW5nXSBjb2xvciB0aGUgY29sb3Igb2YgdGhlIGN1cnNvclxuICBzZXRDdXJzb3I6IChwYXJhbSkgLT4gdGhyb3cgbmV3IEVycm9yIFwiSW1wbGVtZW50IG1lXCJcbiAgcmVtb3ZlQ3Vyc29yOiAoKS0+IHRocm93IG5ldyBFcnJvciBcIkltcGxlbWVudCBtZVwiXG5cblxuICAjIGRlc2NyaWJlIGhvdyB0byBwYXNzIGxvY2FsIG1vZGlmaWNhdGlvbnMgb2YgdGhlIHRleHQgdG8gdGhlIGJhY2tlbmQuXG4gICMgQHBhcmFtIGJhY2tlbmQgW0Z1bmN0aW9uXSB0aGUgZnVuY3Rpb24gdG8gcGFzcyB0aGUgZGVsdGEgdG9cbiAgIyBAbm90ZSBUaGUgYmFja2VuZCBmdW5jdGlvbiB0YWtlcyBhIGxpc3Qgb2YgZGVsdGFzIGFzIGFyZ3VtZW50XG4gIG9ic2VydmVMb2NhbFRleHQ6IChiYWNrZW5kKSAtPiB0aHJvdyBuZXcgRXJyb3IgXCJJbXBsZW1lbnQgbWVcIlxuXG4gICMgZGVzY3JpYmUgaG93IHRvIHBhc3MgbG9jYWwgbW9kaWZpY2F0aW9ucyBvZiB0aGUgY3Vyc29yIHRvIHRoZSBiYWNrZW5kXG4gICMgQHBhcmFtIGJhY2tlbmQgW0Z1bmN0aW9uXSB0aGUgZnVuY3Rpb24gdG8gcGFzcyB0aGUgbmV3IHBvc2l0aW9uIHRvXG4gICMgQG5vdGUgdGhlIGJhY2tlbmQgZnVuY3Rpb24gdGFrZXMgYSBwb3NpdGlvbiBhcyBhcmd1bWVudFxuICBvYnNlcnZlTG9jYWxDdXJzb3I6IChiYWNrZW5kKSAtPiB0aHJvdyBuZXcgRXJyb3IgXCJJbXBsZW1lbnQgbWVcIlxuXG4gICMgQXBwbHkgZGVsdGEgb24gdGhlIGVkaXRvclxuICAjIEBwYXJhbSBkZWx0YSBbRGVsdGFdIHRoZSBkZWx0YSB0byBwcm9wYWdhdGUgdG8gdGhlIGVkaXRvclxuICAjIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL290dHlwZXMvcmljaC10ZXh0XG4gIHVwZGF0ZUNvbnRlbnRzOiAoZGVsdGEpIC0+IHRocm93IG5ldyBFcnJvciBcIkltcGxlbWVudCBtZVwiXG5cbiAgIyBSZW1vdmUgb2xkIGNvbnRlbnQgYW5kIGFwcGx5IGRlbHRhIG9uIHRoZSBlZGl0b3JcbiAgIyBAcGFyYW0gZGVsdGEgW0RlbHRhXSB0aGUgZGVsdGEgdG8gcHJvcGFnYXRlIHRvIHRoZSBlZGl0b3JcbiAgIyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9vdHR5cGVzL3JpY2gtdGV4dFxuICBzZXRDb250ZW50czogKGRlbHRhKSAtPiB0aHJvdyBuZXcgRXJyb3IgXCJJbXBsZW1lbnQgbWVcIlxuXG4gICMgUmV0dXJuIHRoZSBlZGl0b3IgaW5zdGFuY2VcbiAgZ2V0RWRpdG9yOiAoKS0+IHRocm93IG5ldyBFcnJvciBcIkltcGxlbWVudCBtZVwiXG5cbmNsYXNzIFF1aWxsSnMgZXh0ZW5kcyBBYnN0cmFjdEVkaXRvclxuXG4gIGNvbnN0cnVjdG9yOiAoQGVkaXRvcikgLT5cbiAgICBzdXBlciBAZWRpdG9yXG4gICAgQF9jdXJzb3JzID0gQGVkaXRvci5nZXRNb2R1bGUoXCJtdWx0aS1jdXJzb3JcIilcblxuICAjIFJldHVybiB0aGUgbGVuZ3RoIG9mIHRoZSB0ZXh0XG4gIGdldExlbmd0aDogKCktPlxuICAgIEBlZGl0b3IuZ2V0TGVuZ3RoKClcblxuICBnZXRDdXJzb3JQb3NpdGlvbjogLT5cbiAgICBzZWxlY3Rpb24gPSBAZWRpdG9yLmdldFNlbGVjdGlvbigpXG4gICAgaWYgc2VsZWN0aW9uXG4gICAgICBzZWxlY3Rpb24uc3RhcnRcbiAgICBlbHNlXG4gICAgICAwXG5cbiAgZ2V0Q29udGVudHM6ICgpLT5cbiAgICBAZWRpdG9yLmdldENvbnRlbnRzKCkub3BzXG5cbiAgc2V0Q3Vyc29yOiAocGFyYW0pIC0+IEBsb2NrZXIudHJ5ICgpPT5cbiAgICBpZiBwYXJhbS5pbmRleD9cbiAgICAgIEBfY3Vyc29ycy5zZXRDdXJzb3IgcGFyYW0uaWQsIHBhcmFtLmluZGV4LCBwYXJhbS50ZXh0LCBwYXJhbS5jb2xvclxuXG4gIHJlbW92ZUN1cnNvcjogKGlkKS0+XG4gICAgICBAX2N1cnNvcnMucmVtb3ZlQ3Vyc29yIGlkXG5cbiAgb2JzZXJ2ZUxvY2FsVGV4dDogKGJhY2tlbmQpLT5cbiAgICBAZWRpdG9yLm9uIFwidGV4dC1jaGFuZ2VcIiwgKGRlbHRhcywgc291cmNlKSAtPlxuICAgICAgIyBjYWxsIHRoZSBiYWNrZW5kIHdpdGggZGVsdGFzXG4gICAgICBwb3NpdGlvbiA9IGJhY2tlbmQgZGVsdGFzLm9wc1xuICAgICAgIyB0cmlnZ2VyIGFuIGV4dHJhIGV2ZW50IHRvIG1vdmUgY3Vyc29yIHRvIHBvc2l0aW9uIG9mIGluc2VydGVkIHRleHRcbiAgICAgIEBlZGl0b3Iuc2VsZWN0aW9uLmVtaXR0ZXIuZW1pdChcbiAgICAgICAgQGVkaXRvci5zZWxlY3Rpb24uZW1pdHRlci5jb25zdHJ1Y3Rvci5ldmVudHMuU0VMRUNUSU9OX0NIQU5HRSxcbiAgICAgICAgQGVkaXRvci5xdWlsbC5nZXRTZWxlY3Rpb24oKSxcbiAgICAgICAgXCJ1c2VyXCIpXG5cbiAgb2JzZXJ2ZUxvY2FsQ3Vyc29yOiAoYmFja2VuZCkgLT5cbiAgICBAZWRpdG9yLm9uIFwic2VsZWN0aW9uLWNoYW5nZVwiLCAocmFuZ2UsIHNvdXJjZSktPlxuICAgICAgaWYgcmFuZ2UgYW5kIHJhbmdlLnN0YXJ0ID09IHJhbmdlLmVuZFxuICAgICAgICBiYWNrZW5kIHJhbmdlLnN0YXJ0XG5cbiAgdXBkYXRlQ29udGVudHM6IChkZWx0YSktPlxuICAgIEBlZGl0b3IudXBkYXRlQ29udGVudHMgZGVsdGFcblxuICBzZXRDb250ZW50czogKGRlbHRhKS0+XG4gICAgQGVkaXRvci5zZXRDb250ZW50cyhkZWx0YSlcblxuICBnZXRFZGl0b3I6ICgpLT5cbiAgICBAZWRpdG9yXG5cbmNsYXNzIFRlc3RFZGl0b3IgZXh0ZW5kcyBBYnN0cmFjdEVkaXRvclxuXG4gIGNvbnN0cnVjdG9yOiAoQGVkaXRvcikgLT5cbiAgICBzdXBlclxuXG4gIGdldExlbmd0aDooKSAtPlxuICAgIDBcblxuICBnZXRDdXJzb3JQb3NpdGlvbjogLT5cbiAgICAwXG5cbiAgZ2V0Q29udGVudHM6ICgpIC0+XG4gICAgb3BzOiBbe2luc2VydDogXCJXZWxsLCB0aGlzIGlzIGEgdGVzdCFcIn1cbiAgICAgIHtpbnNlcnQ6IFwiQW5kIEknbSBib2xk4oCmXCIsIGF0dHJpYnV0ZXM6IHtib2xkOnRydWV9fV1cblxuICBzZXRDdXJzb3I6ICgpIC0+XG4gICAgXCJcIlxuXG4gIG9ic2VydmVMb2NhbFRleHQ6KGJhY2tlbmQpIC0+XG4gICAgXCJcIlxuXG4gIG9ic2VydmVMb2NhbEN1cnNvcjogKGJhY2tlbmQpIC0+XG4gICAgXCJcIlxuXG4gIHVwZGF0ZUNvbnRlbnRzOiAoZGVsdGEpIC0+XG4gICAgXCJcIlxuXG4gIHNldENvbnRlbnRzOiAoZGVsdGEpLT5cbiAgICBcIlwiXG5cbiAgZ2V0RWRpdG9yOiAoKS0+XG4gICAgQGVkaXRvclxuXG5leHBvcnRzLlF1aWxsSnMgPSBRdWlsbEpzXG5leHBvcnRzLlRlc3RFZGl0b3IgPSBUZXN0RWRpdG9yXG5leHBvcnRzLkFic3RyYWN0RWRpdG9yID0gQWJzdHJhY3RFZGl0b3JcbiIsImNsYXNzIExvY2tlclxuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICBAaXNfbG9ja2VkID0gZmFsc2VcblxuICB0cnk6IChmdW4pIC0+XG4gICAgaWYgQGlzX2xvY2tlZFxuICAgICAgcmV0dXJuXG5cbiAgICBAaXNfbG9ja2VkID0gdHJ1ZVxuICAgIHJldCA9IGRvIGZ1blxuICAgIEBpc19sb2NrZWQgPSBmYWxzZVxuICAgIHJldHVybiByZXRcblxuIyBhIGJhc2ljIGNsYXNzIHdpdGggZ2VuZXJpYyBnZXR0ZXIgLyBzZXR0ZXIgZnVuY3Rpb25cbmNsYXNzIEJhc2VDbGFzc1xuICBjb25zdHJ1Y3RvcjogLT5cbiAgICAjIG93blByb3BlcnR5IGlzIHVuc2FmZS4gUmF0aGVyIHB1dCBpdCBvbiBhIGRlZGljYXRlZCBwcm9wZXJ0eSBsaWtlLi5cbiAgICBAX3RtcF9tb2RlbCA9IHt9XG5cbiAgIyBUcnkgdG8gZmluZCB0aGUgcHJvcGVydHkgaW4gQF9tb2RlbCwgZWxzZSByZXR1cm4gdGhlXG4gICMgdG1wX21vZGVsXG4gIF9nZXQ6IChwcm9wKSAtPlxuICAgIGlmIG5vdCBAX21vZGVsP1xuICAgICAgQF90bXBfbW9kZWxbcHJvcF1cbiAgICBlbHNlXG4gICAgICBAX21vZGVsLnZhbChwcm9wKVxuICAjIFRyeSB0byBzZXQgdGhlIHByb3BlcnR5IGluIEBfbW9kZWwsIGVsc2Ugc2V0IHRoZVxuICAjIHRtcF9tb2RlbFxuICBfc2V0OiAocHJvcCwgdmFsKSAtPlxuICAgIGlmIG5vdCBAX21vZGVsP1xuICAgICAgQF90bXBfbW9kZWxbcHJvcF0gPSB2YWxcbiAgICBlbHNlXG4gICAgICBAX21vZGVsLnZhbChwcm9wLCB2YWwpXG5cbiAgIyBzaW5jZSB3ZSBhbHJlYWR5IGFzc3VtZSB0aGF0IGFueSBpbnN0YW5jZSBvZiBCYXNlQ2xhc3MgdXNlcyBhIE1hcE1hbmFnZXJcbiAgIyBXZSBjYW4gY3JlYXRlIGl0IGhlcmUsIHRvIHNhdmUgbGluZXMgb2YgY29kZVxuICBfZ2V0TW9kZWw6IChZLCBPcGVyYXRpb24pLT5cbiAgICBpZiBub3QgQF9tb2RlbD9cbiAgICAgIEBfbW9kZWwgPSBuZXcgT3BlcmF0aW9uLk1hcE1hbmFnZXIoQCkuZXhlY3V0ZSgpXG4gICAgICBmb3Iga2V5LCB2YWx1ZSBvZiBAX3RtcF9tb2RlbFxuICAgICAgICBAX21vZGVsLnZhbChrZXksIHZhbHVlKVxuICAgIEBfbW9kZWxcblxuICBfc2V0TW9kZWw6IChAX21vZGVsKS0+XG4gICAgZGVsZXRlIEBfdG1wX21vZGVsXG5cbmlmIG1vZHVsZT9cbiAgZXhwb3J0cy5CYXNlQ2xhc3MgPSBCYXNlQ2xhc3NcbiAgZXhwb3J0cy5Mb2NrZXIgPSBMb2NrZXJcbiIsIm1pc2MgPSAocmVxdWlyZSBcIi4vbWlzYy5jb2ZmZWVcIilcbkJhc2VDbGFzcyA9IG1pc2MuQmFzZUNsYXNzXG5Mb2NrZXIgPSBtaXNjLkxvY2tlclxuRWRpdG9ycyA9IChyZXF1aXJlIFwiLi9lZGl0b3JzLmNvZmZlZVwiKVxuXG4jIEFsbCBkZXBlbmRlbmNpZXMgKGxpa2UgWS5TZWxlY3Rpb25zKSB0byBvdGhlciB0eXBlcyAodGhhdCBoYXZlIGl0cyBvd25cbiMgcmVwb3NpdG9yeSkgc2hvdWxkICBiZSBpbmNsdWRlZCBieSB0aGUgdXNlciAoaW4gb3JkZXIgdG8gcmVkdWNlIHRoZSBhbW91bnQgb2ZcbiMgZG93bmxvYWRlZCBjb250ZW50KS5cbiMgV2l0aCBodG1sNSBpbXBvcnRzLCB3ZSBjYW4gaW5jbHVkZSBpdCBhdXRvbWF0aWNhbGx5IHRvby4gQnV0IHdpdGggdGhlIG9sZFxuIyBzY3JpcHQgdGFncyB0aGlzIGlzIHRoZSBiZXN0IHNvbHV0aW9uIHRoYXQgY2FtZSB0byBteSBtaW5kLlxuXG4jIEEgY2xhc3MgaG9sZGluZyB0aGUgaW5mb3JtYXRpb24gYWJvdXQgcmljaCB0ZXh0XG5jbGFzcyBZUmljaFRleHQgZXh0ZW5kcyBCYXNlQ2xhc3NcbiAgIyBAcGFyYW0gY29udGVudCBbU3RyaW5nXSBhbiBpbml0aWFsIHN0cmluZ1xuICAjIEBwYXJhbSBlZGl0b3IgW0VkaXRvcl0gYW4gZWRpdG9yIGluc3RhbmNlXG4gICMgQHBhcmFtIGF1dGhvciBbU3RyaW5nXSB0aGUgbmFtZSBvZiB0aGUgbG9jYWwgYXV0aG9yXG4gIGNvbnN0cnVjdG9yOiAoZWRpdG9yX25hbWUsIGVkaXRvcl9pbnN0YW5jZSkgLT5cbiAgICBAbG9ja2VyID0gbmV3IExvY2tlcigpXG5cbiAgICBpZiBlZGl0b3JfbmFtZT8gYW5kIGVkaXRvcl9pbnN0YW5jZT9cbiAgICAgIEBfYmluZF9sYXRlciA9XG4gICAgICAgIG5hbWU6IGVkaXRvcl9uYW1lXG4gICAgICAgIGluc3RhbmNlOiBlZGl0b3JfaW5zdGFuY2VcblxuICAgICMgVE9ETzogZ2VuZXJhdGUgYSBVSUQgKHlvdSBjYW4gZ2V0IGEgdW5pcXVlIGlkIGJ5IGNhbGxpbmdcbiAgICAjIGBAX21vZGVsLmdldFVpZCgpYCAtIGlzIHRoaXMgd2hhdCB5b3UgbWVhbj8pXG4gICAgIyBAYXV0aG9yID0gYXV0aG9yXG4gICAgIyBUT0RPOiBhc3NpZ24gYW4gaWQgLyBhdXRob3IgbmFtZSB0byB0aGUgcmljaCB0ZXh0IGluc3RhbmNlIGZvciBhdXRob3JzaGlwXG5cbiAgI1xuICAjIEJpbmQgdGhlIFJpY2hUZXh0IHR5cGUgdG8gYSByaWNoIHRleHQgZWRpdG9yIChlLmcuIHF1aWxsanMpXG4gICNcbiAgYmluZDogKCktPlxuICAgICMgVE9ETzogYmluZCB0byBtdWx0aXBsZSBlZGl0b3JzXG4gICAgaWYgYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgRWRpdG9ycy5BYnN0cmFjdEVkaXRvclxuICAgICAgIyBpcyBhbHJlYWR5IGFuIGVkaXRvciFcbiAgICAgIEBlZGl0b3IgPSBhcmd1bWVudHNbMF1cbiAgICBlbHNlXG4gICAgICBbZWRpdG9yX25hbWUsIGVkaXRvcl9pbnN0YW5jZV0gPSBhcmd1bWVudHNcbiAgICAgIGlmIEBlZGl0b3I/IGFuZCBAZWRpdG9yLmdldEVkaXRvcigpIGlzIGVkaXRvcl9pbnN0YW5jZVxuICAgICAgICAjIHJldHVybiwgaWYgQGVkaXRvciBpcyBhbHJlYWR5IGJvdW5kISAobmV2ZXIgYmluZCB0d2ljZSEpXG4gICAgICAgIHJldHVyblxuICAgICAgRWRpdG9yID0gRWRpdG9yc1tlZGl0b3JfbmFtZV1cbiAgICAgIGlmIEVkaXRvcj9cbiAgICAgICAgQGVkaXRvciA9IG5ldyBFZGl0b3IgZWRpdG9yX2luc3RhbmNlXG4gICAgICBlbHNlXG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIlRoaXMgdHlwZSBvZiBlZGl0b3IgaXMgbm90IHN1cHBvcnRlZCEgKFwiK2VkaXRvcl9uYW1lK1wiKVwiXG5cbiAgICAjIFRPRE86IHBhcnNlIHRoZSBmb2xsb3dpbmcgZGlyZWN0bHkgZnJvbSAkY2hhcmFjdGVycyskc2VsZWN0aW9ucyAoaW4gTyhuKSlcbiAgICBAZWRpdG9yLnNldENvbnRlbnRzIHtvcHM6IEBnZXREZWx0YSgpfVxuXG4gICAgIyBiaW5kIHRoZSByZXN0Li5cbiAgICBAZWRpdG9yLm9ic2VydmVMb2NhbFRleHQgQHBhc3NEZWx0YXNcbiAgICBAYmluZEV2ZW50c1RvRWRpdG9yIEBlZGl0b3JcbiAgICBAZWRpdG9yLm9ic2VydmVMb2NhbEN1cnNvciBAdXBkYXRlQ3Vyc29yUG9zaXRpb25cblxuICBnZXREZWx0YTogKCktPlxuICAgIHRleHRfY29udGVudCA9IEBfbW9kZWwuZ2V0Q29udGVudCgnY2hhcmFjdGVycycpLnZhbCgpXG4gICAgIyB0cmFuc2Zvcm0gWS5TZWxlY3Rpb25zLmdldFNlbGVjdGlvbnMoKSB0byBhIGRlbHRhXG4gICAgZXhwZWN0ZWRfcG9zID0gMFxuICAgIGRlbHRhcyA9IFtdXG4gICAgZm9yIHNlbCBpbiBAX21vZGVsLmdldENvbnRlbnQoXCJzZWxlY3Rpb25zXCIpLmdldFNlbGVjdGlvbnMoQF9tb2RlbC5nZXRDb250ZW50KFwiY2hhcmFjdGVyc1wiKSlcbiAgICAgIHNlbGVjdGlvbl9sZW5ndGggPSBzZWwudG8gLSBzZWwuZnJvbSArIDEgIyAoKzEpLCBiZWNhdXNlIGlmIHdlIHNlbGVjdCBmcm9tIDEgdG8gMSAod2l0aCB5LXNlbGVjdGlvbnMpLCB0aGVuIHRoZSBsZW5ndGggaXMgMVxuICAgICAgaWYgZXhwZWN0ZWRfcG9zIGlzbnQgc2VsLmZyb21cbiAgICAgICAgIyBUaGVyZSBpcyB1bnNlbGVjdGVkIHRleHQuICRyZXRhaW4gdG8gdGhlIG5leHQgc2VsZWN0aW9uXG4gICAgICAgIHVuc2VsZWN0ZWRfaW5zZXJ0X2NvbnRlbnQgPSB0ZXh0X2NvbnRlbnQuc3BsaWNlKDAsIHNlbC5mcm9tLWV4cGVjdGVkX3Bvcykuam9pbignJylcbiAgICAgICAgZGVsdGFzLnB1c2hcbiAgICAgICAgICBpbnNlcnQ6IHVuc2VsZWN0ZWRfaW5zZXJ0X2NvbnRlbnRcbiAgICAgICAgZXhwZWN0ZWRfcG9zICs9IHVuc2VsZWN0ZWRfaW5zZXJ0X2NvbnRlbnQubGVuZ3RoXG4gICAgICBpZiBleHBlY3RlZF9wb3MgaXNudCBzZWwuZnJvbVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJUaGlzIHBvcnRpb24gb2YgY29kZSBtdXN0IG5vdCBiZSByZWFjaGVkIGluIGdldERlbHRhIVwiXG4gICAgICBkZWx0YXMucHVzaFxuICAgICAgICBpbnNlcnQ6IHRleHRfY29udGVudC5zcGxpY2UoMCwgc2VsZWN0aW9uX2xlbmd0aCkuam9pbignJylcbiAgICAgICAgYXR0cmlidXRlczogc2VsLmF0dHJzXG4gICAgICBleHBlY3RlZF9wb3MgKz0gc2VsZWN0aW9uX2xlbmd0aFxuICAgIGlmIHRleHRfY29udGVudC5sZW5ndGggPiAwXG4gICAgICBkZWx0YXMucHVzaFxuICAgICAgICBpbnNlcnQ6IHRleHRfY29udGVudC5qb2luKCcnKVxuICAgIGRlbHRhc1xuXG4gIF9nZXRNb2RlbDogKFksIE9wZXJhdGlvbikgLT5cbiAgICBpZiBub3QgQF9tb2RlbD9cbiAgICAgICMgd2Ugc2F2ZSB0aGlzIHN0dWZmIGFzIF9zdGF0aWNfIGNvbnRlbnQgbm93LlxuICAgICAgIyBUaGVyZWZvcmUsIHlvdSBjYW4ndCBvdmVyd3JpdGUgaXQsIGFmdGVyIHlvdSBvbmNlIHNhdmVkIGl0LlxuICAgICAgIyBCdXQgb24gdGhlIHVwc2lkZSwgd2UgY2FuIGFsd2F5cyBtYWtlIHN1cmUsIHRoYXQgdGhleSBhcmUgZGVmaW5lZCFcbiAgICAgIGNvbnRlbnRfb3BlcmF0aW9ucyA9XG4gICAgICAgIHNlbGVjdGlvbnM6IG5ldyBZLlNlbGVjdGlvbnMoKVxuICAgICAgICBjaGFyYWN0ZXJzOiBuZXcgWS5MaXN0KClcbiAgICAgICAgY3Vyc29yczogbmV3IFkuT2JqZWN0KClcbiAgICAgIEBfbW9kZWwgPSBuZXcgT3BlcmF0aW9uLk1hcE1hbmFnZXIoQCwgbnVsbCwge30sIGNvbnRlbnRfb3BlcmF0aW9ucyApLmV4ZWN1dGUoKVxuXG4gICAgICBAX3NldE1vZGVsIEBfbW9kZWxcblxuICAgICAgaWYgQF9iaW5kX2xhdGVyP1xuICAgICAgICBFZGl0b3IgPSBFZGl0b3JzW0BfYmluZF9sYXRlci5uYW1lXVxuICAgICAgICBpZiBFZGl0b3I/XG4gICAgICAgICAgZWRpdG9yID0gbmV3IEVkaXRvciBAX2JpbmRfbGF0ZXIuaW5zdGFuY2VcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIlRoaXMgdHlwZSBvZiBlZGl0b3IgaXMgbm90IHN1cHBvcnRlZCEgKFwiK2VkaXRvcl9uYW1lK1wiKSAtLSBmYXRhbCBlcnJvciFcIlxuICAgICAgICBAcGFzc0RlbHRhcyBlZGl0b3IuZ2V0Q29udGVudHMoKVxuICAgICAgICBAYmluZCBlZGl0b3JcbiAgICAgICAgZGVsZXRlIEBfYmluZF9sYXRlclxuXG4gICAgICAjIGxpc3RlbiB0byBldmVudHMgb24gdGhlIG1vZGVsIHVzaW5nIHRoZSBmdW5jdGlvbiBwcm9wYWdhdGVUb0VkaXRvclxuICAgICAgQF9tb2RlbC5vYnNlcnZlIEBwcm9wYWdhdGVUb0VkaXRvclxuICAgIHJldHVybiBAX21vZGVsXG5cbiAgX3NldE1vZGVsOiAobW9kZWwpIC0+XG4gICAgc3VwZXJcblxuICBfbmFtZTogXCJSaWNoVGV4dFwiXG5cbiAgZ2V0VGV4dDogKCktPlxuICAgIEBfbW9kZWwuZ2V0Q29udGVudCgnY2hhcmFjdGVycycpLnZhbCgpLmpvaW4oJycpXG5cbiAgIyBpbnNlcnQgb3VyIG93biBjdXJzb3IgaW4gdGhlIGN1cnNvcnMgb2JqZWN0XG4gICMgQHBhcmFtIHBvc2l0aW9uIFtJbnRlZ2VyXSB0aGUgcG9zaXRpb24gd2hlcmUgdG8gaW5zZXJ0IGl0XG4gIHNldEN1cnNvciA6IChwb3NpdGlvbikgLT5cbiAgICBAc2VsZkN1cnNvciA9IEBfbW9kZWwuZ2V0Q29udGVudChcImNoYXJhY3RlcnNcIikucmVmKHBvc2l0aW9uKVxuICAgIEBfbW9kZWwuZ2V0Q29udGVudChcImN1cnNvcnNcIikudmFsKEBfbW9kZWwuSEIuZ2V0VXNlcklkKCksIEBzZWxmQ3Vyc29yKVxuXG5cbiAgIyBwYXNzIGRlbHRhcyB0byB0aGUgY2hhcmFjdGVyIGluc3RhbmNlXG4gICMgQHBhcmFtIGRlbHRhcyBbQXJyYXk8T2JqZWN0Pl0gYW4gYXJyYXkgb2YgZGVsdGFzIChzZWUgb3QtdHlwZXMgZm9yIG1vcmUgaW5mbylcbiAgcGFzc0RlbHRhcyA6IChkZWx0YXMpID0+IEBsb2NrZXIudHJ5ICgpPT5cbiAgICBwb3NpdGlvbiA9IDBcbiAgICBjb25zb2xlLmxvZyBkZWx0YXNcbiAgICBmb3IgZGVsdGEgaW4gZGVsdGFzXG4gICAgICBwb3NpdGlvbiA9IGRlbHRhSGVscGVyIEAsIGRlbHRhLCBwb3NpdGlvblxuXG4gICMgQG92ZXJyaWRlIHVwZGF0ZUN1cnNvclBvc2l0aW9uKGluZGV4KVxuICAjICAgdXBkYXRlIHRoZSBwb3NpdGlvbiBvZiBvdXIgY3Vyc29yIHRvIHRoZSBuZXcgb25lIHVzaW5nIGFuIGluZGV4XG4gICMgICBAcGFyYW0gaW5kZXggW0ludGVnZXJdIHRoZSBuZXcgaW5kZXhcbiAgdXBkYXRlQ3Vyc29yUG9zaXRpb24gOiAob2JqKSA9PiBAbG9ja2VyLnRyeSAoKT0+XG4gICAgaWYgdHlwZW9mIG9iaiBpcyBcIm51bWJlclwiXG4gICAgICBAc2VsZkN1cnNvciA9IEBfbW9kZWwuZ2V0Q29udGVudChcImNoYXJhY3RlcnNcIikucmVmKG9iailcbiAgICBlbHNlXG4gICAgICBAc2VsZkN1cnNvciA9IG9ialxuICAgIEBfbW9kZWwuZ2V0Q29udGVudChcImN1cnNvcnNcIikudmFsKEBfbW9kZWwuSEIuZ2V0VXNlcklkKCksIEBzZWxmQ3Vyc29yKVxuXG4gICMgZGVzY3JpYmUgaG93IHRvIHByb3BhZ2F0ZSB5anMgZXZlbnRzIHRvIHRoZSBlZGl0b3JcbiAgIyBUT0RPOiBzaG91bGQgYmUgcHJpdmF0ZSFcbiAgYmluZEV2ZW50c1RvRWRpdG9yIDogKGVkaXRvcikgLT5cbiAgICAjIHVwZGF0ZSB0aGUgZWRpdG9yIHdoZW4gc29tZXRoaW5nIG9uIHRoZSAkY2hhcmFjdGVycyBoYXBwZW5zXG4gICAgQF9tb2RlbC5nZXRDb250ZW50KFwiY2hhcmFjdGVyc1wiKS5vYnNlcnZlIChldmVudHMpID0+IEBsb2NrZXIudHJ5ICgpPT5cbiAgICAgIGZvciBldmVudCBpbiBldmVudHNcbiAgICAgICAgZGVsdGEgPVxuICAgICAgICAgIG9wczogW11cblxuICAgICAgICBpZiBldmVudC5wb3NpdGlvbiA+IDBcbiAgICAgICAgICBkZWx0YS5vcHMucHVzaCB7cmV0YWluOiBldmVudC5wb3NpdGlvbn1cblxuICAgICAgICBpZiBldmVudC50eXBlIGlzIFwiaW5zZXJ0XCJcbiAgICAgICAgICBkZWx0YS5vcHMucHVzaCB7aW5zZXJ0OiBldmVudC52YWx1ZX1cblxuICAgICAgICBlbHNlIGlmIGV2ZW50LnR5cGUgaXMgXCJkZWxldGVcIlxuICAgICAgICAgIGRlbHRhLm9wcy5wdXNoIHtkZWxldGU6IDF9XG4gICAgICAgICAgIyBkZWxldGUgY3Vyc29yLCBpZiBpdCByZWZlcmVuY2VzIHRvIHRoaXMgcG9zaXRpb25cbiAgICAgICAgICBmb3IgY3Vyc29yX25hbWUsIGN1cnNvcl9yZWYgaW4gQF9tb2RlbC5nZXRDb250ZW50KFwiY3Vyc29yc1wiKS52YWwoKVxuICAgICAgICAgICAgaWYgY3Vyc29yX3JlZiBpcyBldmVudC5yZWZlcmVuY2VcbiAgICAgICAgICAgICAgI1xuICAgICAgICAgICAgICAjIHdlIGhhdmUgdG8gZGVsZXRlIHRoZSBjdXJzb3IgaWYgdGhlIHJlZmVyZW5jZSBkb2VzIG5vdCBleGlzdCBhbnltb3JlXG4gICAgICAgICAgICAgICMgdGhlIGRvd25zaWRlIG9mIHRoaXMgYXBwcm9hY2ggaXMgdGhhdCBldmVyeW9uZSB3aWxsIHNlbmQgdGhpcyBkZWxldGUgZXZlbnQhXG4gICAgICAgICAgICAgICMgaW4gdGhlIGZ1dHVyZSwgd2UgY291bGQgcmVwbGFjZSB0aGUgY3Vyc29ycywgd2l0aCBhIHktc2VsZWN0aW9uc1xuICAgICAgICAgICAgICAjXG4gICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpLT5cbiAgICAgICAgICAgICAgICAgIEBfbW9kZWwuZ2V0Q29udGVudChcImN1cnNvcnNcIikuZGVsZXRlKGN1cnNvcl9uYW1lKVxuICAgICAgICAgICAgICAgICwgMClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIEBlZGl0b3IudXBkYXRlQ29udGVudHMgZGVsdGFcblxuICAgICMgdXBkYXRlIHRoZSBlZGl0b3Igd2hlbiBzb21ldGhpbmcgb24gdGhlICRzZWxlY3Rpb25zIGhhcHBlbnNcbiAgICBAX21vZGVsLmdldENvbnRlbnQoXCJzZWxlY3Rpb25zXCIpLm9ic2VydmUgKGV2ZW50KT0+IEBsb2NrZXIudHJ5ICgpPT5cbiAgICAgIGF0dHJzID0ge31cbiAgICAgIGlmIGV2ZW50LnR5cGUgaXMgXCJzZWxlY3RcIlxuICAgICAgICBmb3IgYXR0cix2YWwgb2YgZXZlbnQuYXR0cnNcbiAgICAgICAgICBhdHRyc1thdHRyXSA9IHZhbFxuICAgICAgZWxzZSAjIGlzIFwidW5zZWxlY3RcIiFcbiAgICAgICAgZm9yIGF0dHIgaW4gZXZlbnQuYXR0cnNcbiAgICAgICAgICBhdHRyc1thdHRyXSA9IG51bGxcbiAgICAgIHJldGFpbiA9IGV2ZW50LmZyb20uZ2V0UG9zaXRpb24oKVxuICAgICAgc2VsZWN0aW9uX2xlbmd0aCA9IGV2ZW50LnRvLmdldFBvc2l0aW9uKCktZXZlbnQuZnJvbS5nZXRQb3NpdGlvbigpKzFcbiAgICAgIEBlZGl0b3IudXBkYXRlQ29udGVudHNcbiAgICAgICAgb3BzOiBbXG4gICAgICAgICAge3JldGFpbjogcmV0YWlufSxcbiAgICAgICAgICB7cmV0YWluOiBzZWxlY3Rpb25fbGVuZ3RoLCBhdHRyaWJ1dGVzOiBhdHRyc31cbiAgICAgICAgXVxuXG4gICAgIyB1cGRhdGUgdGhlIGVkaXRvciB3aGVuIHRoZSBjdXJzb3IgaXMgbW92ZWRcbiAgICBAX21vZGVsLmdldENvbnRlbnQoXCJjdXJzb3JzXCIpLm9ic2VydmUgKGV2ZW50cyk9PiBAbG9ja2VyLnRyeSAoKT0+XG4gICAgICBmb3IgZXZlbnQgaW4gZXZlbnRzXG4gICAgICAgIGlmIGV2ZW50LnR5cGUgaXMgXCJ1cGRhdGVcIiBvciBldmVudC50eXBlIGlzIFwiYWRkXCJcbiAgICAgICAgICBhdXRob3IgPSBldmVudC5jaGFuZ2VkQnlcbiAgICAgICAgICByZWZfdG9fY2hhciA9IGV2ZW50Lm9iamVjdC52YWwoYXV0aG9yKVxuICAgICAgICAgIGlmIHJlZl90b19jaGFyIGlzIG51bGxcbiAgICAgICAgICAgIHBvc2l0aW9uID0gQGVkaXRvci5nZXRMZW5ndGgoKVxuICAgICAgICAgIGVsc2UgaWYgcmVmX3RvX2NoYXI/XG4gICAgICAgICAgICBpZiByZWZfdG9fY2hhci5pc0RlbGV0ZWQoKVxuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgcG9zaXRpb24gPSByZWZfdG9fY2hhci5nZXRQb3NpdGlvbigpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgY29uc29sZS53YXJuIFwicmVmX3RvX2NoYXIgaXMgdW5kZWZpbmVkXCJcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgcGFyYW1zID1cbiAgICAgICAgICAgIGlkOiBhdXRob3JcbiAgICAgICAgICAgIGluZGV4OiBwb3NpdGlvblxuICAgICAgICAgICAgdGV4dDogYXV0aG9yXG4gICAgICAgICAgICBjb2xvcjogXCJncmV5XCJcbiAgICAgICAgICBAZWRpdG9yLnNldEN1cnNvciBwYXJhbXNcbiAgICAgICAgZWxzZVxuICAgICAgICAgIEBlZGl0b3IucmVtb3ZlQ3Vyc29yIGV2ZW50Lm5hbWVcblxuICAgIEBfbW9kZWwuY29ubmVjdG9yLm9uVXNlckV2ZW50IChldmVudCk9PlxuICAgICAgaWYgZXZlbnQuYWN0aW9uIGlzIFwidXNlckxlZnRcIlxuICAgICAgICBAX21vZGVsLmdldENvbnRlbnQoXCJjdXJzb3JzXCIpLmRlbGV0ZShldmVudC51c2VyKVxuXG4gICMgQXBwbHkgYSBkZWx0YSBhbmQgcmV0dXJuIHRoZSBuZXcgcG9zaXRpb25cbiAgIyBAcGFyYW0gZGVsdGEgW09iamVjdF0gYSAqc2luZ2xlKiBkZWx0YSAoc2VlIG90LXR5cGVzIGZvciBtb3JlIGluZm8pXG4gICMgQHBhcmFtIHBvc2l0aW9uIFtJbnRlZ2VyXSBzdGFydCBwb3NpdGlvbiBmb3IgdGhlIGRlbHRhLCBkZWZhdWx0OiAwXG4gICNcbiAgIyBAcmV0dXJuIFtJbnRlZ2VyXSB0aGUgcG9zaXRpb24gb2YgdGhlIGN1cnNvciBhZnRlciBwYXJzaW5nIHRoZSBkZWx0YVxuICBkZWx0YUhlbHBlciA9ICh0aGlzT2JqLCBkZWx0YSwgcG9zaXRpb24gPSAwKSAtPlxuICAgIGlmIGRlbHRhP1xuICAgICAgc2VsZWN0aW9ucyA9IHRoaXNPYmouX21vZGVsLmdldENvbnRlbnQoXCJzZWxlY3Rpb25zXCIpXG4gICAgICBkZWx0YV91bnNlbGVjdGlvbnMgPSBbXVxuICAgICAgZGVsdGFfc2VsZWN0aW9ucyA9IHt9XG4gICAgICBmb3Igbix2IG9mIGRlbHRhLmF0dHJpYnV0ZXNcbiAgICAgICAgaWYgdj9cbiAgICAgICAgICBkZWx0YV9zZWxlY3Rpb25zW25dID0gdlxuICAgICAgICBlbHNlXG4gICAgICAgICAgZGVsdGFfdW5zZWxlY3Rpb25zLnB1c2ggblxuXG4gICAgICBpZiBkZWx0YS5pbnNlcnQ/XG4gICAgICAgIGluc2VydF9jb250ZW50ID0gZGVsdGEuaW5zZXJ0XG4gICAgICAgIGNvbnRlbnRfYXJyYXkgPVxuICAgICAgICAgIGlmIHR5cGVvZiBpbnNlcnRfY29udGVudCBpcyBcInN0cmluZ1wiXG4gICAgICAgICAgICBpbnNlcnRfY29udGVudC5zcGxpdChcIlwiKVxuICAgICAgICAgIGVsc2UgaWYgdHlwZW9mIGluc2VydF9jb250ZW50IGlzIFwibnVtYmVyXCJcbiAgICAgICAgICAgIFtpbnNlcnRfY29udGVudF1cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJHb3QgYW4gdW5leHBlY3RlZCB2YWx1ZSBpbiBkZWx0YS5pbnNlcnQhIChcIisodHlwZW9mIGNvbnRlbnQpK1wiKVwiXG4gICAgICAgIGluc2VydEhlbHBlciB0aGlzT2JqLCBwb3NpdGlvbiwgY29udGVudF9hcnJheVxuICAgICAgICBmcm9tID0gdGhpc09iai5fbW9kZWwuZ2V0Q29udGVudChcImNoYXJhY3RlcnNcIikucmVmIHBvc2l0aW9uXG4gICAgICAgIHRvID0gdGhpc09iai5fbW9kZWwuZ2V0Q29udGVudChcImNoYXJhY3RlcnNcIikucmVmKFxuICAgICAgICAgIHBvc2l0aW9uK2NvbnRlbnRfYXJyYXkubGVuZ3RoLTEpXG4gICAgICAgIHRoaXNPYmouX21vZGVsLmdldENvbnRlbnQoXCJzZWxlY3Rpb25zXCIpLnNlbGVjdChcbiAgICAgICAgICBmcm9tLCB0bywgZGVsdGFfc2VsZWN0aW9ucywgdHJ1ZSlcbiAgICAgICAgdGhpc09iai5fbW9kZWwuZ2V0Q29udGVudChcInNlbGVjdGlvbnNcIikudW5zZWxlY3QoXG4gICAgICAgICAgZnJvbSwgdG8sIGRlbHRhX3Vuc2VsZWN0aW9ucylcblxuICAgICAgICByZXR1cm4gcG9zaXRpb24gKyBjb250ZW50X2FycmF5Lmxlbmd0aFxuXG4gICAgICBlbHNlIGlmIGRlbHRhLmRlbGV0ZT9cbiAgICAgICAgZGVsZXRlSGVscGVyIHRoaXNPYmosIHBvc2l0aW9uLCBkZWx0YS5kZWxldGVcbiAgICAgICAgcmV0dXJuIHBvc2l0aW9uXG5cbiAgICAgIGVsc2UgaWYgZGVsdGEucmV0YWluP1xuICAgICAgICByZXRhaW4gPSBwYXJzZUludCBkZWx0YS5yZXRhaW5cbiAgICAgICAgZnJvbSA9IHRoaXNPYmouX21vZGVsLmdldENvbnRlbnQoXCJjaGFyYWN0ZXJzXCIpLnJlZihwb3NpdGlvbilcbiAgICAgICAgIyB3ZSBzZXQgYHBvc2l0aW9uK3JldGFpbi0xYCwgLTEgYmVjYXVzZSB3aGVuIHNlbGVjdGluZyBvbmUgY2hhcixcbiAgICAgICAgIyBZLXNlbGVjdGlvbnMgd2lsbCBvbmx5IG1hcmsgdGhpcyBvbmUgY2hhciAoYXMgYmVnaW5uaW5nIGFuZCBlbmQpXG4gICAgICAgIHRvID0gdGhpc09iai5fbW9kZWwuZ2V0Q29udGVudChcImNoYXJhY3RlcnNcIikucmVmKHBvc2l0aW9uICsgcmV0YWluIC0gMSlcblxuICAgICAgICB0aGlzT2JqLl9tb2RlbC5nZXRDb250ZW50KFwic2VsZWN0aW9uc1wiKS5zZWxlY3QoXG4gICAgICAgICAgZnJvbSwgdG8sIGRlbHRhX3NlbGVjdGlvbnMpXG4gICAgICAgIHRoaXNPYmouX21vZGVsLmdldENvbnRlbnQoXCJzZWxlY3Rpb25zXCIpLnVuc2VsZWN0KFxuICAgICAgICAgIGZyb20sIHRvLCBkZWx0YV91bnNlbGVjdGlvbnMpXG5cbiAgICAgICAgcmV0dXJuIHBvc2l0aW9uICsgcmV0YWluXG4gICAgICB0aHJvdyBuZXcgRXJyb3IgXCJUaGlzIHBhcnQgb2YgY29kZSBtdXN0IG5vdCBiZSByZWFjaGVkIVwiXG5cbiAgaW5zZXJ0SGVscGVyID0gKHRoaXNPYmosIHBvc2l0aW9uLCBjb250ZW50X2FycmF5KSAtPlxuICAgIHRoaXNPYmouX21vZGVsLmdldENvbnRlbnQoXCJjaGFyYWN0ZXJzXCIpLmluc2VydENvbnRlbnRzIHBvc2l0aW9uLCBjb250ZW50X2FycmF5XG5cbiAgZGVsZXRlSGVscGVyID0gKHRoaXNPYmosIHBvc2l0aW9uLCBsZW5ndGggPSAxKSAtPlxuICAgIHRoaXNPYmouX21vZGVsLmdldENvbnRlbnQoXCJjaGFyYWN0ZXJzXCIpLmRlbGV0ZSBwb3NpdGlvbiwgbGVuZ3RoXG5cbmlmIHdpbmRvdz9cbiAgaWYgd2luZG93Llk/XG4gICAgd2luZG93LlkuUmljaFRleHQgPSBZUmljaFRleHRcbiAgZWxzZVxuICAgIHRocm93IG5ldyBFcnJvciBcIllvdSBtdXN0IGZpcnN0IGltcG9ydCBZIVwiXG5cbmlmIG1vZHVsZT9cbiAgbW9kdWxlLmV4cG9ydHMgPSBZUmljaFRleHRcbiJdfQ==
