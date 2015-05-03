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
    this.blocked_events = 0;
  }

  Locker.prototype["try"] = function(fun, output) {
    var ret;
    if (this.is_locked) {
      if ((output != null) && output) {
        this.blocked_events++;
        console.log("blocked events = " + this.blocked_events);
      }
      return;
    }
    this.blocked_events = 0;
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
    this._graphicsPalette = ['#837DFA', '#FA7D7D', '#34DA43', '#D1BC30'];
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
        cursors: new Y.Object(),
        authors: new Y.Object()
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

  YRichText.prototype.setAuthor = function(option) {
    var auth, color, n_authors, name;
    if ((option != null) && (option.name != null)) {
      name = option.name;
    } else {
      name = (this.author != null) && this.author.name ? this.author.name : 'Default user';
    }
    if ((option != null) && (option.color != null)) {
      color = option.color;
    } else {
      if ((this.author != null) && this.author.color) {
        color = this.author.color;
      } else {
        n_authors = 0;
        for (auth in this._model.getContent('authors').val()) {
          n_authors++;
        }
        color = this._graphicsPalette[n_authors % this._graphicsPalette.length];
      }
    }
    this.author = {
      name: name,
      color: color
    };
    console.log(option, this.author);
    return this._model.getContent('authors').val(this._model.HB.getUserId(), this.author);
  };

  YRichText.prototype.passDeltas = function(deltas) {
    console.log("Received delta from quill: ");
    console.dir(deltas);
    return this.locker["try"]((function(_this) {
      return function() {
        var delta, position, _i, _len, _results;
        console.log("Received delta from quill, also applied on it: ");
        console.dir(deltas);
        position = 0;
        _results = [];
        for (_i = 0, _len = deltas.length; _i < _len; _i++) {
          delta = deltas[_i];
          _results.push(position = deltaHelper(_this, delta, position));
        }
        return _results;
      };
    })(this), true);
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
              ops: [
                {
                  retain: event.position
                }
              ]
            };
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
          var authorId, author_info, event, params, position, ref_to_char, _i, _len;
          for (_i = 0, _len = events.length; _i < _len; _i++) {
            event = events[_i];
            if (event.type === "update" || event.type === "add") {
              authorId = event.changedBy;
              ref_to_char = event.object.val(authorId);
              if (ref_to_char === null) {
                position = _this.editor.getLength();
              } else if (ref_to_char != null) {
                if (ref_to_char.isDeleted()) {
                  window.setTimeout(function() {
                    return event.object["delete"](authorId);
                  }, 0);
                  return;
                } else {
                  position = ref_to_char.getPosition();
                }
              } else {
                console.warn("ref_to_char is undefined");
                return;
              }
              author_info = _this._model.getContent('authors').val(authorId);
              params = {
                id: authorId,
                index: position,
                name: (author_info != null ? author_info.name : void 0) || "Default user",
                color: (author_info != null ? author_info.color : void 0) || "grey"
              };
              _this.editor.setCursor(params);
            } else {
              _this.editor.removeCursor(event.name);
            }
          }
        });
      };
    })(this));
    this._model.connector.onUserEvent((function(_this) {
      return function(event) {
        if (event.action === "userLeft") {
          return _this._model.getContent("cursors")["delete"](event.user);
        }
      };
    })(this));
    return this._model.getContent('authors').observe((function(_this) {
      return function(events) {
        return _this.locker["try"](function() {
          var event, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = events.length; _i < _len; _i++) {
            event = events[_i];
            _results.push(_this.editor.removeCursor(event.changedBy));
          }
          return _results;
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Rtb25hZC9naXQveS1yaWNodGV4dC9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9kbW9uYWQvZ2l0L3ktcmljaHRleHQvbGliL2VkaXRvcnMuY29mZmVlIiwiL2hvbWUvZG1vbmFkL2dpdC95LXJpY2h0ZXh0L2xpYi9taXNjLmNvZmZlZSIsIi9ob21lL2Rtb25hZC9naXQveS1yaWNodGV4dC9saWIveS1yaWNodGV4dC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBLHlDQUFBO0VBQUE7aVNBQUE7O0FBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSLENBQVAsQ0FBQTs7QUFBQTtBQU1lLEVBQUEsd0JBQUUsTUFBRixHQUFBO0FBQ1gsSUFEWSxJQUFDLENBQUEsU0FBQSxNQUNiLENBQUE7QUFBQSxJQUFBLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxJQUFJLENBQUMsTUFBTCxDQUFBLENBQWQsQ0FEVztFQUFBLENBQWI7O0FBQUEsMkJBSUEsV0FBQSxHQUFhLFNBQUEsR0FBQTtBQUFLLFVBQVUsSUFBQSxLQUFBLENBQU0sY0FBTixDQUFWLENBQUw7RUFBQSxDQUpiLENBQUE7O0FBQUEsMkJBT0EsU0FBQSxHQUFXLFNBQUEsR0FBQTtBQUFNLFVBQVUsSUFBQSxLQUFBLENBQU0sY0FBTixDQUFWLENBQU47RUFBQSxDQVBYLENBQUE7O0FBQUEsMkJBY0EsU0FBQSxHQUFXLFNBQUMsS0FBRCxHQUFBO0FBQVcsVUFBVSxJQUFBLEtBQUEsQ0FBTSxjQUFOLENBQVYsQ0FBWDtFQUFBLENBZFgsQ0FBQTs7QUFBQSwyQkFlQSxZQUFBLEdBQWMsU0FBQSxHQUFBO0FBQUssVUFBVSxJQUFBLEtBQUEsQ0FBTSxjQUFOLENBQVYsQ0FBTDtFQUFBLENBZmQsQ0FBQTs7QUFBQSwyQkFtQkEsWUFB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Q0FBQTs7bUJBQUE7O0dBSnNCLFVBWHhCLENBQUE7O0FBbVZBLElBQUcsZ0RBQUg7QUFDRSxFQUFBLElBQUcsZ0JBQUg7QUFDRSxJQUFBLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBVCxHQUFvQixTQUFwQixDQURGO0dBQUEsTUFBQTtBQUdFLFVBQVUsSUFBQSxLQUFBLENBQU0sMEJBQU4sQ0FBVixDQUhGO0dBREY7Q0FuVkE7O0FBeVZBLElBQUcsZ0RBQUg7QUFDRSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQWpCLENBREY7Q0F6VkEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibWlzYyA9IHJlcXVpcmUoXCIuL21pc2MuY29mZmVlXCIpXG5cbiMgYSBnZW5lcmljIGVkaXRvciBjbGFzc1xuY2xhc3MgQWJzdHJhY3RFZGl0b3JcbiAgIyBjcmVhdGUgYW4gZWRpdG9yIGluc3RhbmNlXG4gICMgQHBhcmFtIGluc3RhbmNlIFtFZGl0b3JdIHRoZSBlZGl0b3Igb2JqZWN0XG4gIGNvbnN0cnVjdG9yOiAoQGVkaXRvcikgLT5cbiAgICBAbG9ja2VyID0gbmV3IG1pc2MuTG9ja2VyKClcblxuICAjIGdldCB0aGUgY3VycmVudCBjb250ZW50IGFzIGEgb3QtZGVsdGFcbiAgZ2V0Q29udGVudHM6ICgpLT4gdGhyb3cgbmV3IEVycm9yIFwiSW1wbGVtZW50IG1lXCJcblxuICAjIGdldCB0aGUgY3VycmVudCBjdXJzb3IgcG9zaXRpb25cbiAgZ2V0Q3Vyc29yOiAoKSAtPiB0aHJvdyBuZXcgRXJyb3IgXCJJbXBsZW1lbnQgbWVcIlxuICAjIHNldCB0aGUgY3VycmVudCBjdXJzb3IgcG9zaXRpb25cbiAgIyBAcGFyYW0gcGFyYW0gW09wdGlvbl0gdGhlIG9wdGlvbnNcbiAgIyBAb3B0aW9uIHBhcmFtIFtJbnRlZ2VyXSBpZCB0aGUgaWQgb2YgdGhlIGF1dGhvclxuICAjIEBvcHRpb24gcGFyYW0gW0ludGVnZXJdIGluZGV4IHRoZSBpbmRleCBvZiB0aGUgY3Vyc29yXG4gICMgQG9wdGlvbiBwYXJhbSBbU3RyaW5nXSB0ZXh0IHRoZSB0ZXh0IG9mIHRoZSBjdXJzb3JcbiAgIyBAb3B0aW9uIHBhcmFtIFtTdHJpbmddIGNvbG9yIHRoZSBjb2xvciBvZiB0aGUgY3Vyc29yXG4gIHNldEN1cnNvcjogKHBhcmFtKSAtPiB0aHJvdyBuZXcgRXJyb3IgXCJJbXBsZW1lbnQgbWVcIlxuICByZW1vdmVDdXJzb3I6ICgpLT4gdGhyb3cgbmV3IEVycm9yIFwiSW1wbGVtZW50IG1lXCJcblxuICAjIHJlbW92ZSBhIGN1cnNvclxuICAjIEBwYXJhbSBpZCBbU3RyaW5nXSB0aGUgaWQgb2YgdGhlIGN1cnNvciB0byByZW1vdmVcbiAgcmVtb3ZlQ3Vyc29yOiAoaWQpIC0+IHRocm93IG5ldyBFcnJvciBcIkltcGxlbWVudCBtZVwiXG5cbiAgIyBkZXNjcmliZSBob3cgdG8gcGFzcyBsb2NhbCBtb2RpZmljYXRpb25zIG9mIHRoZSB0ZXh0IHRvIHRoZSBiYWNrZW5kLlxuICAjIEBwYXJhbSBiYWNrZW5kIFtGdW5jdGlvbl0gdGhlIGZ1bmN0aW9uIHRvIHBhc3MgdGhlIGRlbHRhIHRvXG4gICMgQG5vdGUgVGhlIGJhY2tlbmQgZnVuY3Rpb24gdGFrZXMgYSBsaXN0IG9mIGRlbHRhcyBhcyBhcmd1bWVudFxuICBvYnNlcnZlTG9jYWxUZXh0OiAoYmFja2VuZCkgLT4gdGhyb3cgbmV3IEVycm9yIFwiSW1wbGVtZW50IG1lXCJcblxuICAjIGRlc2NyaWJlIGhvdyB0byBwYXNzIGxvY2FsIG1vZGlmaWNhdGlvbnMgb2YgdGhlIGN1cnNvciB0byB0aGUgYmFja2VuZFxuICAjIEBwYXJhbSBiYWNrZW5kIFtGdW5jdGlvbl0gdGhlIGZ1bmN0aW9uIHRvIHBhc3MgdGhlIG5ldyBwb3NpdGlvbiB0b1xuICAjIEBub3RlIHRoZSBiYWNrZW5kIGZ1bmN0aW9uIHRha2VzIGEgcG9zaXRpb24gYXMgYXJndW1lbnRcbiAgb2JzZXJ2ZUxvY2FsQ3Vyc29yOiAoYmFja2VuZCkgLT4gdGhyb3cgbmV3IEVycm9yIFwiSW1wbGVtZW50IG1lXCJcblxuICAjIEFwcGx5IGRlbHRhIG9uIHRoZSBlZGl0b3JcbiAgIyBAcGFyYW0gZGVsdGEgW0RlbHRhXSB0aGUgZGVsdGEgdG8gcHJvcGFnYXRlIHRvIHRoZSBlZGl0b3JcbiAgIyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9vdHR5cGVzL3JpY2gtdGV4dFxuICB1cGRhdGVDb250ZW50czogKGRlbHRhKSAtPiB0aHJvdyBuZXcgRXJyb3IgXCJJbXBsZW1lbnQgbWVcIlxuXG4gICMgUmVtb3ZlIG9sZCBjb250ZW50IGFuZCBhcHBseSBkZWx0YSBvbiB0aGUgZWRpdG9yXG4gICMgQHBhcmFtIGRlbHRhIFtEZWx0YV0gdGhlIGRlbHRhIHRvIHByb3BhZ2F0ZSB0byB0aGUgZWRpdG9yXG4gICMgQHNlZSBodHRwczovL2dpdGh1Yi5jb20vb3R0eXBlcy9yaWNoLXRleHRcbiAgc2V0Q29udGVudHM6IChkZWx0YSkgLT4gdGhyb3cgbmV3IEVycm9yIFwiSW1wbGVtZW50IG1lXCJcblxuICAjIFJldHVybiB0aGUgZWRpdG9yIGluc3RhbmNlXG4gIGdldEVkaXRvcjogKCktPiB0aHJvdyBuZXcgRXJyb3IgXCJJbXBsZW1lbnQgbWVcIlxuXG5jbGFzcyBRdWlsbEpzIGV4dGVuZHMgQWJzdHJhY3RFZGl0b3JcblxuICBjb25zdHJ1Y3RvcjogKEBlZGl0b3IpIC0+XG4gICAgc3VwZXIgQGVkaXRvclxuICAgIEBfY3Vyc29ycyA9IEBlZGl0b3IuZ2V0TW9kdWxlKFwibXVsdGktY3Vyc29yXCIpXG5cbiAgIyBSZXR1cm4gdGhlIGxlbmd0aCBvZiB0aGUgdGV4dFxuICBnZXRMZW5ndGg6ICgpLT5cbiAgICBAZWRpdG9yLmdldExlbmd0aCgpXG5cbiAgZ2V0Q3Vyc29yUG9zaXRpb246IC0+XG4gICAgc2VsZWN0aW9uID0gQGVkaXRvci5nZXRTZWxlY3Rpb24oKVxuICAgIGlmIHNlbGVjdGlvblxuICAgICAgc2VsZWN0aW9uLnN0YXJ0XG4gICAgZWxzZVxuICAgICAgMFxuXG4gIGdldENvbnRlbnRzOiAoKS0+XG4gICAgQGVkaXRvci5nZXRDb250ZW50cygpLm9wc1xuXG4gIHNldEN1cnNvcjogKHBhcmFtKSAtPiBAbG9ja2VyLnRyeSAoKT0+XG4gICAgY3Vyc29yID0gQF9jdXJzb3JzLmN1cnNvcnNbcGFyYW0uaWRdXG4gICAgaWYgY3Vyc29yPyBhbmQgY3Vyc29yLmNvbG9yID09IHBhcmFtLmNvbG9yXG4gICAgICBmdW4gPSAoaW5kZXgpID0+XG4gICAgICAgIEBfY3Vyc29ycy5tb3ZlQ3Vyc29yIHBhcmFtLmlkLCBpbmRleFxuICAgIGVsc2VcbiAgICAgIGlmIGN1cnNvcj8gYW5kIGN1cnNvci5jb2xvcj8gYW5kIGN1cnNvci5jb2xvciAhPSBwYXJhbS5jb2xvclxuICAgICAgICBAcmVtb3ZlQ3Vyc29yIHBhcmFtLmlkXG5cbiAgICAgIGZ1biA9IChpbmRleCkgPT5cbiAgICAgICAgQF9jdXJzb3JzLnNldEN1cnNvcihwYXJhbS5pZCwgaW5kZXgsXG4gICAgICAgICAgcGFyYW0ubmFtZSwgcGFyYW0uY29sb3IpXG5cbiAgICBpZiBwYXJhbS5pbmRleD9cbiAgICAgIGZ1biBwYXJhbS5pbmRleFxuXG4gIHJlbW92ZUN1cnNvcjogKGlkKSAtPlxuICAgIEBfY3Vyc29ycy5yZW1vdmVDdXJzb3IoaWQpXG5cbiAgcmVtb3ZlQ3Vyc29yOiAoaWQpLT5cbiAgICAgIEBfY3Vyc29ycy5yZW1vdmVDdXJzb3IgaWRcblxuICBvYnNlcnZlTG9jYWxUZXh0OiAoYmFja2VuZCktPlxuICAgIEBlZGl0b3Iub24gXCJ0ZXh0LWNoYW5nZVwiLCAoZGVsdGFzLCBzb3VyY2UpIC0+XG4gICAgICAjIGNhbGwgdGhlIGJhY2tlbmQgd2l0aCBkZWx0YXNcbiAgICAgIHBvc2l0aW9uID0gYmFja2VuZCBkZWx0YXMub3BzXG4gICAgICAjIHRyaWdnZXIgYW4gZXh0cmEgZXZlbnQgdG8gbW92ZSBjdXJzb3IgdG8gcG9zaXRpb24gb2YgaW5zZXJ0ZWQgdGV4dFxuICAgICAgQGVkaXRvci5zZWxlY3Rpb24uZW1pdHRlci5lbWl0KFxuICAgICAgICBAZWRpdG9yLnNlbGVjdGlvbi5lbWl0dGVyLmNvbnN0cnVjdG9yLmV2ZW50cy5TRUxFQ1RJT05fQ0hBTkdFLFxuICAgICAgICBAZWRpdG9yLnF1aWxsLmdldFNlbGVjdGlvbigpLFxuICAgICAgICBcInVzZXJcIilcblxuICBvYnNlcnZlTG9jYWxDdXJzb3I6IChiYWNrZW5kKSAtPlxuICAgIEBlZGl0b3Iub24gXCJzZWxlY3Rpb24tY2hhbmdlXCIsIChyYW5nZSwgc291cmNlKS0+XG4gICAgICBpZiByYW5nZSBhbmQgcmFuZ2Uuc3RhcnQgPT0gcmFuZ2UuZW5kXG4gICAgICAgIGJhY2tlbmQgcmFuZ2Uuc3RhcnRcblxuICB1cGRhdGVDb250ZW50czogKGRlbHRhKS0+XG4gICAgQGVkaXRvci51cGRhdGVDb250ZW50cyBkZWx0YVxuXG4gIHNldENvbnRlbnRzOiAoZGVsdGEpLT5cbiAgICBAZWRpdG9yLnNldENvbnRlbnRzKGRlbHRhKVxuXG4gIGdldEVkaXRvcjogKCktPlxuICAgIEBlZGl0b3JcblxuY2xhc3MgVGVzdEVkaXRvciBleHRlbmRzIEFic3RyYWN0RWRpdG9yXG5cbiAgY29uc3RydWN0b3I6IChAZWRpdG9yKSAtPlxuICAgIHN1cGVyXG5cbiAgZ2V0TGVuZ3RoOigpIC0+XG4gICAgMFxuXG4gIGdldEN1cnNvclBvc2l0aW9uOiAtPlxuICAgIDBcblxuICBnZXRDb250ZW50czogKCkgLT5cbiAgICBvcHM6IFt7aW5zZXJ0OiBcIldlbGwsIHRoaXMgaXMgYSB0ZXN0IVwifVxuICAgICAge2luc2VydDogXCJBbmQgSSdtIGJvbGTigKZcIiwgYXR0cmlidXRlczoge2JvbGQ6dHJ1ZX19XVxuXG4gIHNldEN1cnNvcjogKCkgLT5cbiAgICBcIlwiXG5cbiAgb2JzZXJ2ZUxvY2FsVGV4dDooYmFja2VuZCkgLT5cbiAgICBcIlwiXG5cbiAgb2JzZXJ2ZUxvY2FsQ3Vyc29yOiAoYmFja2VuZCkgLT5cbiAgICBcIlwiXG5cbiAgdXBkYXRlQ29udGVudHM6IChkZWx0YSkgLT5cbiAgICBcIlwiXG5cbiAgc2V0Q29udGVudHM6IChkZWx0YSktPlxuICAgIFwiXCJcblxuICBnZXRFZGl0b3I6ICgpLT5cbiAgICBAZWRpdG9yXG5cbmV4cG9ydHMuUXVpbGxKcyA9IFF1aWxsSnNcbmV4cG9ydHMuVGVzdEVkaXRvciA9IFRlc3RFZGl0b3JcbmV4cG9ydHMuQWJzdHJhY3RFZGl0b3IgPSBBYnN0cmFjdEVkaXRvclxuIiwiY2xhc3MgTG9ja2VyXG4gIGNvbnN0cnVjdG9yOiAoKSAtPlxuICAgIEBpc19sb2NrZWQgPSBmYWxzZVxuICAgIEBibG9ja2VkX2V2ZW50cyA9IDBcblxuICB0cnk6IChmdW4sIG91dHB1dCkgLT5cbiAgICBpZiBAaXNfbG9ja2VkXG4gICAgICBpZiBvdXRwdXQ/IGFuZCBvdXRwdXRcbiAgICAgICAgQGJsb2NrZWRfZXZlbnRzKytcbiAgICAgICAgY29uc29sZS5sb2cgXCJibG9ja2VkIGV2ZW50cyA9IFwiK0BibG9ja2VkX2V2ZW50c1xuICAgICAgcmV0dXJuXG5cbiAgICBAYmxvY2tlZF9ldmVudHMgPSAwXG4gICAgQGlzX2xvY2tlZCA9IHRydWVcbiAgICByZXQgPSBkbyBmdW5cbiAgICBAaXNfbG9ja2VkID0gZmFsc2VcbiAgICByZXR1cm4gcmV0XG5cbiMgYSBiYXNpYyBjbGFzcyB3aXRoIGdlbmVyaWMgZ2V0dGVyIC8gc2V0dGVyIGZ1bmN0aW9uXG5jbGFzcyBCYXNlQ2xhc3NcbiAgY29uc3RydWN0b3I6IC0+XG4gICAgIyBvd25Qcm9wZXJ0eSBpcyB1bnNhZmUuIFJhdGhlciBwdXQgaXQgb24gYSBkZWRpY2F0ZWQgcHJvcGVydHkgbGlrZS4uXG4gICAgQF90bXBfbW9kZWwgPSB7fVxuXG4gICMgVHJ5IHRvIGZpbmQgdGhlIHByb3BlcnR5IGluIEBfbW9kZWwsIGVsc2UgcmV0dXJuIHRoZVxuICAjIHRtcF9tb2RlbFxuICBfZ2V0OiAocHJvcCkgLT5cbiAgICBpZiBub3QgQF9tb2RlbD9cbiAgICAgIEBfdG1wX21vZGVsW3Byb3BdXG4gICAgZWxzZVxuICAgICAgQF9tb2RlbC52YWwocHJvcClcbiAgIyBUcnkgdG8gc2V0IHRoZSBwcm9wZXJ0eSBpbiBAX21vZGVsLCBlbHNlIHNldCB0aGVcbiAgIyB0bXBfbW9kZWxcbiAgX3NldDogKHByb3AsIHZhbCkgLT5cbiAgICBpZiBub3QgQF9tb2RlbD9cbiAgICAgIEBfdG1wX21vZGVsW3Byb3BdID0gdmFsXG4gICAgZWxzZVxuICAgICAgQF9tb2RlbC52YWwocHJvcCwgdmFsKVxuXG4gICMgc2luY2Ugd2UgYWxyZWFkeSBhc3N1bWUgdGhhdCBhbnkgaW5zdGFuY2Ugb2YgQmFzZUNsYXNzIHVzZXMgYSBNYXBNYW5hZ2VyXG4gICMgV2UgY2FuIGNyZWF0ZSBpdCBoZXJlLCB0byBzYXZlIGxpbmVzIG9mIGNvZGVcbiAgX2dldE1vZGVsOiAoWSwgT3BlcmF0aW9uKS0+XG4gICAgaWYgbm90IEBfbW9kZWw/XG4gICAgICBAX21vZGVsID0gbmV3IE9wZXJhdGlvbi5NYXBNYW5hZ2VyKEApLmV4ZWN1dGUoKVxuICAgICAgZm9yIGtleSwgdmFsdWUgb2YgQF90bXBfbW9kZWxcbiAgICAgICAgQF9tb2RlbC52YWwoa2V5LCB2YWx1ZSlcbiAgICBAX21vZGVsXG5cbiAgX3NldE1vZGVsOiAoQF9tb2RlbCktPlxuICAgIGRlbGV0ZSBAX3RtcF9tb2RlbFxuXG5pZiBtb2R1bGU/XG4gIGV4cG9ydHMuQmFzZUNsYXNzID0gQmFzZUNsYXNzXG4gIGV4cG9ydHMuTG9ja2VyID0gTG9ja2VyXG4iLCJtaXNjID0gKHJlcXVpcmUgXCIuL21pc2MuY29mZmVlXCIpXG5CYXNlQ2xhc3MgPSBtaXNjLkJhc2VDbGFzc1xuTG9ja2VyID0gbWlzYy5Mb2NrZXJcbkVkaXRvcnMgPSAocmVxdWlyZSBcIi4vZWRpdG9ycy5jb2ZmZWVcIilcbiMgQWxsIGRlcGVuZGVuY2llcyAobGlrZSBZLlNlbGVjdGlvbnMpIHRvIG90aGVyIHR5cGVzICh0aGF0IGhhdmUgaXRzIG93blxuIyByZXBvc2l0b3J5KSBzaG91bGQgIGJlIGluY2x1ZGVkIGJ5IHRoZSB1c2VyIChpbiBvcmRlciB0byByZWR1Y2UgdGhlIGFtb3VudCBvZlxuIyBkb3dubG9hZGVkIGNvbnRlbnQpLlxuIyBXaXRoIGh0bWw1IGltcG9ydHMsIHdlIGNhbiBpbmNsdWRlIGl0IGF1dG9tYXRpY2FsbHkgdG9vLiBCdXQgd2l0aCB0aGUgb2xkXG4jIHNjcmlwdCB0YWdzIHRoaXMgaXMgdGhlIGJlc3Qgc29sdXRpb24gdGhhdCBjYW1lIHRvIG15IG1pbmQuXG5cbiMgQSBjbGFzcyBob2xkaW5nIHRoZSBpbmZvcm1hdGlvbiBhYm91dCByaWNoIHRleHRcbmNsYXNzIFlSaWNoVGV4dCBleHRlbmRzIEJhc2VDbGFzc1xuICAjIEBwYXJhbSBjb250ZW50IFtTdHJpbmddIGFuIGluaXRpYWwgc3RyaW5nXG4gICMgQHBhcmFtIGVkaXRvciBbRWRpdG9yXSBhbiBlZGl0b3IgaW5zdGFuY2VcbiAgIyBAcGFyYW0gYXV0aG9yIFtTdHJpbmddIHRoZSBuYW1lIG9mIHRoZSBsb2NhbCBhdXRob3JcbiAgY29uc3RydWN0b3I6IChlZGl0b3JfbmFtZSwgZWRpdG9yX2luc3RhbmNlKSAtPlxuICAgIEBsb2NrZXIgPSBuZXcgTG9ja2VyKClcbiAgICBAX2dyYXBoaWNzUGFsZXR0ZSA9IFsnIzgzN0RGQScsICcjRkE3RDdEJywnIzM0REE0MycsICcjRDFCQzMwJ11cblxuICAgIGlmIGVkaXRvcl9uYW1lPyBhbmQgZWRpdG9yX2luc3RhbmNlP1xuICAgICAgQF9iaW5kX2xhdGVyID1cbiAgICAgICAgbmFtZTogZWRpdG9yX25hbWVcbiAgICAgICAgaW5zdGFuY2U6IGVkaXRvcl9pbnN0YW5jZVxuXG4gICAgIyBUT0RPOiBnZW5lcmF0ZSBhIFVJRCAoeW91IGNhbiBnZXQgYSB1bmlxdWUgaWQgYnkgY2FsbGluZ1xuICAgICMgYEBfbW9kZWwuZ2V0VWlkKClgIC0gaXMgdGhpcyB3aGF0IHlvdSBtZWFuPylcbiAgICAjIEBhdXRob3IgPSBhdXRob3JcbiAgICAjIFRPRE86IGFzc2lnbiBhbiBpZCAvIGF1dGhvciBuYW1lIHRvIHRoZSByaWNoIHRleHQgaW5zdGFuY2UgZm9yIGF1dGhvcnNoaXBcblxuICAjXG4gICMgQmluZCB0aGUgUmljaFRleHQgdHlwZSB0byBhIHJpY2ggdGV4dCBlZGl0b3IgKGUuZy4gcXVpbGxqcylcbiAgI1xuICBiaW5kOiAoKS0+XG4gICAgIyBUT0RPOiBiaW5kIHRvIG11bHRpcGxlIGVkaXRvcnNcbiAgICBpZiBhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBFZGl0b3JzLkFic3RyYWN0RWRpdG9yXG4gICAgICAjIGlzIGFscmVhZHkgYW4gZWRpdG9yIVxuICAgICAgQGVkaXRvciA9IGFyZ3VtZW50c1swXVxuICAgIGVsc2VcbiAgICAgIFtlZGl0b3JfbmFtZSwgZWRpdG9yX2luc3RhbmNlXSA9IGFyZ3VtZW50c1xuICAgICAgaWYgQGVkaXRvcj8gYW5kIEBlZGl0b3IuZ2V0RWRpdG9yKCkgaXMgZWRpdG9yX2luc3RhbmNlXG4gICAgICAgICMgcmV0dXJuLCBpZiBAZWRpdG9yIGlzIGFscmVhZHkgYm91bmQhIChuZXZlciBiaW5kIHR3aWNlISlcbiAgICAgICAgcmV0dXJuXG4gICAgICBFZGl0b3IgPSBFZGl0b3JzW2VkaXRvcl9uYW1lXVxuICAgICAgaWYgRWRpdG9yP1xuICAgICAgICBAZWRpdG9yID0gbmV3IEVkaXRvciBlZGl0b3JfaW5zdGFuY2VcbiAgICAgIGVsc2VcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwiVGhpcyB0eXBlIG9mIGVkaXRvciBpcyBub3Qgc3VwcG9ydGVkISAoXCIgK1xuICAgICAgICAgIGVkaXRvcl9uYW1lICsgXCIpXCJcblxuICAgICMgVE9ETzogcGFyc2UgdGhlIGZvbGxvd2luZyBkaXJlY3RseSBmcm9tICRjaGFyYWN0ZXJzKyRzZWxlY3Rpb25zIChpbiBPKG4pKVxuICAgICMgQGVkaXRvci5lZGl0b3IuZGVsZXRlVGV4dCgwLCBAZWRpdG9yLmVkaXRvci5nZXRUZXh0KCkubGVuZ3RoKVxuICAgIEBlZGl0b3Iuc2V0Q29udGVudHNcbiAgICAgIG9wczogQGdldERlbHRhKClcblxuICAgICMgYmluZCB0aGUgcmVzdC4uXG4gICAgQGVkaXRvci5vYnNlcnZlTG9jYWxUZXh0IEBwYXNzRGVsdGFzXG4gICAgQGJpbmRFdmVudHNUb0VkaXRvciBAZWRpdG9yXG4gICAgQGVkaXRvci5vYnNlcnZlTG9jYWxDdXJzb3IgQHVwZGF0ZUN1cnNvclBvc2l0aW9uXG5cbiAgZ2V0RGVsdGE6ICgpLT5cbiAgICB0ZXh0X2NvbnRlbnQgPSBAX21vZGVsLmdldENvbnRlbnQoJ2NoYXJhY3RlcnMnKS52YWwoKVxuICAgICMgdHJhbnNmb3JtIFkuU2VsZWN0aW9ucy5nZXRTZWxlY3Rpb25zKCkgdG8gYSBkZWx0YVxuICAgIGV4cGVjdGVkX3BvcyA9IDBcbiAgICBkZWx0YXMgPSBbXVxuICAgIHNlbGVjdGlvbnMgPSBAX21vZGVsLmdldENvbnRlbnQoXCJzZWxlY3Rpb25zXCIpXG4gICAgZm9yIHNlbCBpbiBzZWxlY3Rpb25zLmdldFNlbGVjdGlvbnMoQF9tb2RlbC5nZXRDb250ZW50KFwiY2hhcmFjdGVyc1wiKSlcbiAgICAgICMgKCsxKSwgYmVjYXVzZSBpZiB3ZSBzZWxlY3QgZnJvbSAxIHRvIDEgKHdpdGggeS1zZWxlY3Rpb25zKSwgdGhlbiB0aGVcbiAgICAgICMgbGVuZ3RoIGlzIDFcbiAgICAgIHNlbGVjdGlvbl9sZW5ndGggPSBzZWwudG8gLSBzZWwuZnJvbSArIDFcbiAgICAgIGlmIGV4cGVjdGVkX3BvcyBpc250IHNlbC5mcm9tXG4gICAgICAgICMgVGhlcmUgaXMgdW5zZWxlY3RlZCB0ZXh0LiAkcmV0YWluIHRvIHRoZSBuZXh0IHNlbGVjdGlvblxuICAgICAgICB1bnNlbGVjdGVkX2luc2VydF9jb250ZW50ID0gdGV4dF9jb250ZW50LnNwbGljZShcbiAgICAgICAgICAwLCBzZWwuZnJvbS1leHBlY3RlZF9wb3MgKVxuICAgICAgICAgIC5qb2luKCcnKVxuICAgICAgICBkZWx0YXMucHVzaFxuICAgICAgICAgIGluc2VydDogdW5zZWxlY3RlZF9pbnNlcnRfY29udGVudFxuICAgICAgICBleHBlY3RlZF9wb3MgKz0gdW5zZWxlY3RlZF9pbnNlcnRfY29udGVudC5sZW5ndGhcbiAgICAgIGlmIGV4cGVjdGVkX3BvcyBpc250IHNlbC5mcm9tXG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIlRoaXMgcG9ydGlvbiBvZiBjb2RlIG11c3Qgbm90IGJlIHJlYWNoZWQgaW4gZ2V0RGVsdGEhXCJcbiAgICAgIGRlbHRhcy5wdXNoXG4gICAgICAgIGluc2VydDogdGV4dF9jb250ZW50LnNwbGljZSgwLCBzZWxlY3Rpb25fbGVuZ3RoKS5qb2luKCcnKVxuICAgICAgICBhdHRyaWJ1dGVzOiBzZWwuYXR0cnNcbiAgICAgIGV4cGVjdGVkX3BvcyArPSBzZWxlY3Rpb25fbGVuZ3RoXG4gICAgaWYgdGV4dF9jb250ZW50Lmxlbmd0aCA+IDBcbiAgICAgIGRlbHRhcy5wdXNoXG4gICAgICAgIGluc2VydDogdGV4dF9jb250ZW50LmpvaW4oJycpXG4gICAgZGVsdGFzXG5cbiAgX2dldE1vZGVsOiAoWSwgT3BlcmF0aW9uKSAtPlxuICAgIGlmIG5vdCBAX21vZGVsP1xuICAgICAgIyB3ZSBzYXZlIHRoaXMgc3R1ZmYgYXMgX3N0YXRpY18gY29udGVudCBub3cuXG4gICAgICAjIFRoZXJlZm9yZSwgeW91IGNhbid0IG92ZXJ3cml0ZSBpdCwgYWZ0ZXIgeW91IG9uY2Ugc2F2ZWQgaXQuXG4gICAgICAjIEJ1dCBvbiB0aGUgdXBzaWRlLCB3ZSBjYW4gYWx3YXlzIG1ha2Ugc3VyZSwgdGhhdCB0aGV5IGFyZSBkZWZpbmVkIVxuICAgICAgY29udGVudF9vcGVyYXRpb25zID1cbiAgICAgICAgc2VsZWN0aW9uczogbmV3IFkuU2VsZWN0aW9ucygpXG4gICAgICAgIGNoYXJhY3RlcnM6IG5ldyBZLkxpc3QoKVxuICAgICAgICBjdXJzb3JzOiBuZXcgWS5PYmplY3QoKVxuICAgICAgICBhdXRob3JzOiBuZXcgWS5PYmplY3QoKVxuICAgICAgQF9tb2RlbCA9IG5ldyBPcGVyYXRpb24uTWFwTWFuYWdlcihALCBudWxsLCB7fSwgY29udGVudF9vcGVyYXRpb25zIClcbiAgICAgICAgLmV4ZWN1dGUoKVxuXG4gICAgICBAX3NldE1vZGVsIEBfbW9kZWxcblxuICAgICAgaWYgQF9iaW5kX2xhdGVyP1xuICAgICAgICBFZGl0b3IgPSBFZGl0b3JzW0BfYmluZF9sYXRlci5uYW1lXVxuICAgICAgICBpZiBFZGl0b3I/XG4gICAgICAgICAgZWRpdG9yID0gbmV3IEVkaXRvciBAX2JpbmRfbGF0ZXIuaW5zdGFuY2VcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIlRoaXMgdHlwZSBvZiBlZGl0b3IgaXMgbm90IHN1cHBvcnRlZCEgKFwiICtcbiAgICAgICAgICBlZGl0b3JfbmFtZSArIFwiKSAtLSBmYXRhbCBlcnJvciFcIlxuICAgICAgICBAcGFzc0RlbHRhcyBlZGl0b3IuZ2V0Q29udGVudHMoKVxuICAgICAgICBAYmluZCBlZGl0b3JcbiAgICAgICAgZGVsZXRlIEBfYmluZF9sYXRlclxuXG4gICAgICAjIGxpc3RlbiB0byBldmVudHMgb24gdGhlIG1vZGVsIHVzaW5nIHRoZSBmdW5jdGlvbiBwcm9wYWdhdGVUb0VkaXRvclxuICAgICAgQF9tb2RlbC5vYnNlcnZlIEBwcm9wYWdhdGVUb0VkaXRvclxuICAgIHJldHVybiBAX21vZGVsXG5cbiAgX3NldE1vZGVsOiAobW9kZWwpIC0+XG4gICAgc3VwZXJcblxuICBfbmFtZTogXCJSaWNoVGV4dFwiXG5cbiAgZ2V0VGV4dDogKCktPlxuICAgIEBfbW9kZWwuZ2V0Q29udGVudCgnY2hhcmFjdGVycycpLnZhbCgpLmpvaW4oJycpXG5cbiAgIyBpbnNlcnQgb3VyIG93biBjdXJzb3IgaW4gdGhlIGN1cnNvcnMgb2JqZWN0XG4gICMgQHBhcmFtIHBvc2l0aW9uIFtJbnRlZ2VyXSB0aGUgcG9zaXRpb24gd2hlcmUgdG8gaW5zZXJ0IGl0XG4gIHNldEN1cnNvciA6IChwb3NpdGlvbikgLT5cbiAgICBAc2VsZkN1cnNvciA9IEBfbW9kZWwuZ2V0Q29udGVudChcImNoYXJhY3RlcnNcIikucmVmKHBvc2l0aW9uKVxuXG4gICAgQF9tb2RlbC5nZXRDb250ZW50KFwiY3Vyc29yc1wiKS52YWwoQF9tb2RlbC5IQi5nZXRVc2VySWQoKSwgQHNlbGZDdXJzb3IpXG5cbiAgc2V0QXV0aG9yIDogKG9wdGlvbikgLT5cbiAgICBpZiBvcHRpb24/IGFuZCBvcHRpb24ubmFtZT9cbiAgICAgIG5hbWUgPSBvcHRpb24ubmFtZVxuICAgIGVsc2VcbiAgICAgIG5hbWUgPSBpZiBAYXV0aG9yPyBhbmQgQGF1dGhvci5uYW1lIHRoZW4gQGF1dGhvci5uYW1lIGVsc2UgJ0RlZmF1bHQgdXNlcidcblxuICAgIGlmIG9wdGlvbj8gYW5kIG9wdGlvbi5jb2xvcj9cbiAgICAgIGNvbG9yID0gb3B0aW9uLmNvbG9yXG4gICAgZWxzZVxuICAgICAgIyBpZiBhbHJlYWR5IGEgY29sb3Igc2V0XG4gICAgICBpZiBAYXV0aG9yPyBhbmQgQGF1dGhvci5jb2xvclxuICAgICAgICBjb2xvciA9IEBhdXRob3IuY29sb3JcbiAgICAgIGVsc2UgIyBpZiBubyBjb2xvciwgcGljayB0aGUgbmV4dCBvbmUgZnJvbSB0aGUgcGFsZXR0ZVxuICAgICAgICBuX2F1dGhvcnMgPSAwXG4gICAgICAgIGZvciBhdXRoIG9mIEBfbW9kZWwuZ2V0Q29udGVudCgnYXV0aG9ycycpLnZhbCgpXG4gICAgICAgICAgbl9hdXRob3JzKytcbiAgICAgICAgY29sb3IgPSBAX2dyYXBoaWNzUGFsZXR0ZVtuX2F1dGhvcnMgJSBAX2dyYXBoaWNzUGFsZXR0ZS5sZW5ndGhdXG5cblxuICAgIEBhdXRob3IgPVxuICAgICAgIG5hbWU6IG5hbWVcbiAgICAgICBjb2xvcjogY29sb3JcblxuICAgIGNvbnNvbGUubG9nIG9wdGlvbiwgQGF1dGhvclxuICAgIEBfbW9kZWwuZ2V0Q29udGVudCgnYXV0aG9ycycpLnZhbChAX21vZGVsLkhCLmdldFVzZXJJZCgpLCBAYXV0aG9yKVxuXG4gICMgcGFzcyBkZWx0YXMgdG8gdGhlIGNoYXJhY3RlciBpbnN0YW5jZVxuICAjIEBwYXJhbSBkZWx0YXMgW0FycmF5PE9iamVjdD5dIGFuIGFycmF5IG9mIGRlbHRhc1xuICAjIEBzZWUgb3QtdHlwZXMgZm9yIG1vcmUgaW5mb1xuICBwYXNzRGVsdGFzIDogKGRlbHRhcykgPT5cbiAgICBjb25zb2xlLmxvZyBcIlJlY2VpdmVkIGRlbHRhIGZyb20gcXVpbGw6IFwiXG4gICAgY29uc29sZS5kaXIgZGVsdGFzXG4gICAgQGxvY2tlci50cnkgKCk9PlxuICAgICAgICBjb25zb2xlLmxvZyBcIlJlY2VpdmVkIGRlbHRhIGZyb20gcXVpbGwsIGFsc28gYXBwbGllZCBvbiBpdDogXCJcbiAgICAgICAgY29uc29sZS5kaXIgZGVsdGFzXG4gICAgICAgIHBvc2l0aW9uID0gMFxuICAgICAgICBmb3IgZGVsdGEgaW4gZGVsdGFzXG4gICAgICAgICAgcG9zaXRpb24gPSBkZWx0YUhlbHBlciBALCBkZWx0YSwgcG9zaXRpb25cbiAgICAgICwgdHJ1ZVxuXG4gICMgQG92ZXJyaWRlIHVwZGF0ZUN1cnNvclBvc2l0aW9uKGluZGV4KVxuICAjICAgdXBkYXRlIHRoZSBwb3NpdGlvbiBvZiBvdXIgY3Vyc29yIHRvIHRoZSBuZXcgb25lIHVzaW5nIGFuIGluZGV4XG4gICMgICBAcGFyYW0gaW5kZXggW0ludGVnZXJdIHRoZSBuZXcgaW5kZXhcbiAgIyBAb3ZlcnJpZGUgdXBkYXRlQ3Vyc29yUG9zaXRpb24oY2hhcmFjdGVyKVxuICAjICAgdXBkYXRlIHRoZSBwb3NpdGlvbiBvZiBvdXIgY3Vyc29yIHRvIHRoZSBuZXcgb25lIHVzaW5nIGEgY2hhcmFjdGVyXG4gICMgICBAcGFyYW0gY2hhcmFjdGVyIFtDaGFyYWN0ZXJdIHRoZSBuZXcgY2hhcmFjdGVyXG4gIHVwZGF0ZUN1cnNvclBvc2l0aW9uIDogKG9iaikgPT4gQGxvY2tlci50cnkgKCk9PlxuICAgIGlmIHR5cGVvZiBvYmogaXMgXCJudW1iZXJcIlxuICAgICAgQHNlbGZDdXJzb3IgPSBAX21vZGVsLmdldENvbnRlbnQoXCJjaGFyYWN0ZXJzXCIpLnJlZihvYmopXG4gICAgZWxzZVxuICAgICAgQHNlbGZDdXJzb3IgPSBvYmpcblxuICAgIEBfbW9kZWwuZ2V0Q29udGVudChcImN1cnNvcnNcIikudmFsKEBfbW9kZWwuSEIuZ2V0VXNlcklkKCksIEBzZWxmQ3Vyc29yKVxuXG5cbiAgIyBkZXNjcmliZSBob3cgdG8gcHJvcGFnYXRlIHlqcyBldmVudHMgdG8gdGhlIGVkaXRvclxuICAjIFRPRE86IHNob3VsZCBiZSBwcml2YXRlIVxuICBiaW5kRXZlbnRzVG9FZGl0b3IgOiAoZWRpdG9yKSAtPlxuICAgICMgdXBkYXRlIHRoZSBlZGl0b3Igd2hlbiBzb21ldGhpbmcgb24gdGhlICRjaGFyYWN0ZXJzIGhhcHBlbnNcbiAgICBAX21vZGVsLmdldENvbnRlbnQoXCJjaGFyYWN0ZXJzXCIpLm9ic2VydmUgKGV2ZW50cykgPT4gQGxvY2tlci50cnkgKCk9PlxuICAgICAgZm9yIGV2ZW50IGluIGV2ZW50c1xuICAgICAgICBkZWx0YSA9XG4gICAgICAgICAgb3BzOiBbe3JldGFpbjogZXZlbnQucG9zaXRpb259XVxuXG4gICAgICAgIGlmIGV2ZW50LnR5cGUgaXMgXCJpbnNlcnRcIlxuICAgICAgICAgIGRlbHRhLm9wcy5wdXNoIHtpbnNlcnQ6IGV2ZW50LnZhbHVlfVxuXG4gICAgICAgIGVsc2UgaWYgZXZlbnQudHlwZSBpcyBcImRlbGV0ZVwiXG4gICAgICAgICAgZGVsdGEub3BzLnB1c2gge2RlbGV0ZTogMX1cbiAgICAgICAgICAjIGRlbGV0ZSBjdXJzb3IsIGlmIGl0IHJlZmVyZW5jZXMgdG8gdGhpcyBwb3NpdGlvblxuICAgICAgICAgIGZvciBjdXJzb3JfbmFtZSwgY3Vyc29yX3JlZiBpbiBAX21vZGVsLmdldENvbnRlbnQoXCJjdXJzb3JzXCIpLnZhbCgpXG4gICAgICAgICAgICBpZiBjdXJzb3JfcmVmIGlzIGV2ZW50LnJlZmVyZW5jZVxuICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKS0+XG4gICAgICAgICAgICAgICAgICBAX21vZGVsLmdldENvbnRlbnQoXCJjdXJzb3JzXCIpLmRlbGV0ZShjdXJzb3JfbmFtZSlcbiAgICAgICAgICAgICAgICAsIDApXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm5cblxuICAgICAgICBAZWRpdG9yLnVwZGF0ZUNvbnRlbnRzIGRlbHRhXG5cbiAgICAjIHVwZGF0ZSB0aGUgZWRpdG9yIHdoZW4gc29tZXRoaW5nIG9uIHRoZSAkc2VsZWN0aW9ucyBoYXBwZW5zXG4gICAgQF9tb2RlbC5nZXRDb250ZW50KFwic2VsZWN0aW9uc1wiKS5vYnNlcnZlIChldmVudCkgPT4gQGxvY2tlci50cnkgKCk9PlxuICAgICAgYXR0cnMgPSB7fVxuICAgICAgaWYgZXZlbnQudHlwZSBpcyBcInNlbGVjdFwiXG4gICAgICAgIGZvciBhdHRyLHZhbCBvZiBldmVudC5hdHRyc1xuICAgICAgICAgIGF0dHJzW2F0dHJdID0gdmFsXG4gICAgICBlbHNlICMgaXMgXCJ1bnNlbGVjdFwiIVxuICAgICAgICBmb3IgYXR0ciBpbiBldmVudC5hdHRyc1xuICAgICAgICAgIGF0dHJzW2F0dHJdID0gbnVsbFxuICAgICAgcmV0YWluID0gZXZlbnQuZnJvbS5nZXRQb3NpdGlvbigpXG4gICAgICBzZWxlY3Rpb25fbGVuZ3RoID0gZXZlbnQudG8uZ2V0UG9zaXRpb24oKS1ldmVudC5mcm9tLmdldFBvc2l0aW9uKCkrMVxuICAgICAgQGVkaXRvci51cGRhdGVDb250ZW50c1xuICAgICAgICBvcHM6IFtcbiAgICAgICAgICB7cmV0YWluOiByZXRhaW59LFxuICAgICAgICAgIHtyZXRhaW46IHNlbGVjdGlvbl9sZW5ndGgsIGF0dHJpYnV0ZXM6IGF0dHJzfVxuICAgICAgICBdXG5cbiAgICAjIHVwZGF0ZSB0aGUgZWRpdG9yIHdoZW4gdGhlIGN1cnNvciBpcyBtb3ZlZFxuICAgIEBfbW9kZWwuZ2V0Q29udGVudChcImN1cnNvcnNcIikub2JzZXJ2ZSAoZXZlbnRzKSA9PiBAbG9ja2VyLnRyeSAoKT0+XG4gICAgICBmb3IgZXZlbnQgaW4gZXZlbnRzXG4gICAgICAgIGlmIGV2ZW50LnR5cGUgaXMgXCJ1cGRhdGVcIiBvciBldmVudC50eXBlIGlzIFwiYWRkXCJcbiAgICAgICAgICBhdXRob3JJZCA9IGV2ZW50LmNoYW5nZWRCeVxuICAgICAgICAgIHJlZl90b19jaGFyID0gZXZlbnQub2JqZWN0LnZhbChhdXRob3JJZClcblxuICAgICAgICAgIGlmIHJlZl90b19jaGFyIGlzIG51bGxcbiAgICAgICAgICAgIHBvc2l0aW9uID0gQGVkaXRvci5nZXRMZW5ndGgoKVxuICAgICAgICAgIGVsc2UgaWYgcmVmX3RvX2NoYXI/XG4gICAgICAgICAgICBpZiByZWZfdG9fY2hhci5pc0RlbGV0ZWQoKVxuICAgICAgICAgICAgICAjXG4gICAgICAgICAgICAgICMgd2UgaGF2ZSB0byBkZWxldGUgdGhlIGN1cnNvciBpZiB0aGUgcmVmZXJlbmNlIGRvZXMgbm90IGV4aXN0IGFueW1vcmVcbiAgICAgICAgICAgICAgIyB0aGUgZG93bnNpZGUgb2YgdGhpcyBhcHByb2FjaCBpcyB0aGF0IGV2ZXJ5b25lIHdpbGwgc2VuZCB0aGlzIGRlbGV0ZSBldmVudCFcbiAgICAgICAgICAgICAgIyBpbiB0aGUgZnV0dXJlLCB3ZSBjb3VsZCByZXBsYWNlIHRoZSBjdXJzb3JzLCB3aXRoIGEgeS1zZWxlY3Rpb25zXG4gICAgICAgICAgICAgICNcbiAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCktPlxuICAgICAgICAgICAgICAgICAgZXZlbnQub2JqZWN0LmRlbGV0ZShhdXRob3JJZClcbiAgICAgICAgICAgICAgICAsIDApXG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBwb3NpdGlvbiA9IHJlZl90b19jaGFyLmdldFBvc2l0aW9uKClcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBjb25zb2xlLndhcm4gXCJyZWZfdG9fY2hhciBpcyB1bmRlZmluZWRcIlxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgYXV0aG9yX2luZm8gPSBAX21vZGVsLmdldENvbnRlbnQoJ2F1dGhvcnMnKS52YWwoYXV0aG9ySWQpXG4gICAgICAgICAgcGFyYW1zID1cbiAgICAgICAgICAgIGlkOiBhdXRob3JJZFxuICAgICAgICAgICAgaW5kZXg6IHBvc2l0aW9uXG4gICAgICAgICAgICBuYW1lOiBhdXRob3JfaW5mbz8ubmFtZSBvciBcIkRlZmF1bHQgdXNlclwiXG4gICAgICAgICAgICBjb2xvcjogYXV0aG9yX2luZm8/LmNvbG9yIG9yIFwiZ3JleVwiXG4gICAgICAgICAgQGVkaXRvci5zZXRDdXJzb3IgcGFyYW1zXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAZWRpdG9yLnJlbW92ZUN1cnNvciBldmVudC5uYW1lXG5cbiAgICBAX21vZGVsLmNvbm5lY3Rvci5vblVzZXJFdmVudCAoZXZlbnQpPT5cbiAgICAgIGlmIGV2ZW50LmFjdGlvbiBpcyBcInVzZXJMZWZ0XCJcbiAgICAgICAgQF9tb2RlbC5nZXRDb250ZW50KFwiY3Vyc29yc1wiKS5kZWxldGUoZXZlbnQudXNlcilcblxuICAgIEBfbW9kZWwuZ2V0Q29udGVudCgnYXV0aG9ycycpLm9ic2VydmUgKGV2ZW50cykgPT4gQGxvY2tlci50cnkgKCk9PlxuICAgICAgZm9yIGV2ZW50IGluIGV2ZW50c1xuICAgICAgICBAZWRpdG9yLnJlbW92ZUN1cnNvciBldmVudC5jaGFuZ2VkQnlcblxuXG5cblxuICAjIEFwcGx5IGEgZGVsdGEgYW5kIHJldHVybiB0aGUgbmV3IHBvc2l0aW9uXG4gICMgQHBhcmFtIGRlbHRhIFtPYmplY3RdIGEgKnNpbmdsZSogZGVsdGEgKHNlZSBvdC10eXBlcyBmb3IgbW9yZSBpbmZvKVxuICAjIEBwYXJhbSBwb3NpdGlvbiBbSW50ZWdlcl0gc3RhcnQgcG9zaXRpb24gZm9yIHRoZSBkZWx0YSwgZGVmYXVsdDogMFxuICAjXG4gICMgQHJldHVybiBbSW50ZWdlcl0gdGhlIHBvc2l0aW9uIG9mIHRoZSBjdXJzb3IgYWZ0ZXIgcGFyc2luZyB0aGUgZGVsdGFcbiAgZGVsdGFIZWxwZXIgPSAodGhpc09iaiwgZGVsdGEsIHBvc2l0aW9uID0gMCkgLT5cbiAgICBpZiBkZWx0YT9cbiAgICAgIHNlbGVjdGlvbnMgPSB0aGlzT2JqLl9tb2RlbC5nZXRDb250ZW50KFwic2VsZWN0aW9uc1wiKVxuICAgICAgZGVsdGFfdW5zZWxlY3Rpb25zID0gW11cbiAgICAgIGRlbHRhX3NlbGVjdGlvbnMgPSB7fVxuICAgICAgZm9yIG4sdiBvZiBkZWx0YS5hdHRyaWJ1dGVzXG4gICAgICAgIGlmIHY/XG4gICAgICAgICAgZGVsdGFfc2VsZWN0aW9uc1tuXSA9IHZcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGRlbHRhX3Vuc2VsZWN0aW9ucy5wdXNoIG5cblxuICAgICAgaWYgZGVsdGEuaW5zZXJ0P1xuICAgICAgICBpbnNlcnRfY29udGVudCA9IGRlbHRhLmluc2VydFxuICAgICAgICBjb250ZW50X2FycmF5ID1cbiAgICAgICAgICBpZiB0eXBlb2YgaW5zZXJ0X2NvbnRlbnQgaXMgXCJzdHJpbmdcIlxuICAgICAgICAgICAgaW5zZXJ0X2NvbnRlbnQuc3BsaXQoXCJcIilcbiAgICAgICAgICBlbHNlIGlmIHR5cGVvZiBpbnNlcnRfY29udGVudCBpcyBcIm51bWJlclwiXG4gICAgICAgICAgICBbaW5zZXJ0X2NvbnRlbnRdXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwiR290IGFuIHVuZXhwZWN0ZWQgdmFsdWUgaW4gZGVsdGEuaW5zZXJ0ISAoXCIgK1xuICAgICAgICAgICAgKHR5cGVvZiBjb250ZW50KSArIFwiKVwiXG4gICAgICAgIGluc2VydEhlbHBlciB0aGlzT2JqLCBwb3NpdGlvbiwgY29udGVudF9hcnJheVxuICAgICAgICBmcm9tID0gdGhpc09iai5fbW9kZWwuZ2V0Q29udGVudChcImNoYXJhY3RlcnNcIikucmVmIHBvc2l0aW9uXG4gICAgICAgIHRvID0gdGhpc09iai5fbW9kZWwuZ2V0Q29udGVudChcImNoYXJhY3RlcnNcIikucmVmKFxuICAgICAgICAgIHBvc2l0aW9uK2NvbnRlbnRfYXJyYXkubGVuZ3RoLTEpXG4gICAgICAgIHRoaXNPYmouX21vZGVsLmdldENvbnRlbnQoXCJzZWxlY3Rpb25zXCIpLnNlbGVjdChcbiAgICAgICAgICBmcm9tLCB0bywgZGVsdGFfc2VsZWN0aW9ucywgdHJ1ZSlcbiAgICAgICAgdGhpc09iai5fbW9kZWwuZ2V0Q29udGVudChcInNlbGVjdGlvbnNcIikudW5zZWxlY3QoXG4gICAgICAgICAgZnJvbSwgdG8sIGRlbHRhX3Vuc2VsZWN0aW9ucylcblxuICAgICAgICByZXR1cm4gcG9zaXRpb24gKyBjb250ZW50X2FycmF5Lmxlbmd0aFxuXG4gICAgICBlbHNlIGlmIGRlbHRhLmRlbGV0ZT9cbiAgICAgICAgZGVsZXRlSGVscGVyIHRoaXNPYmosIHBvc2l0aW9uLCBkZWx0YS5kZWxldGVcbiAgICAgICAgcmV0dXJuIHBvc2l0aW9uXG5cbiAgICAgIGVsc2UgaWYgZGVsdGEucmV0YWluP1xuICAgICAgICByZXRhaW4gPSBwYXJzZUludCBkZWx0YS5yZXRhaW5cbiAgICAgICAgZnJvbSA9IHRoaXNPYmouX21vZGVsLmdldENvbnRlbnQoXCJjaGFyYWN0ZXJzXCIpLnJlZihwb3NpdGlvbilcbiAgICAgICAgIyB3ZSBzZXQgYHBvc2l0aW9uK3JldGFpbi0xYCwgLTEgYmVjYXVzZSB3aGVuIHNlbGVjdGluZyBvbmUgY2hhcixcbiAgICAgICAgIyBZLXNlbGVjdGlvbnMgd2lsbCBvbmx5IG1hcmsgdGhpcyBvbmUgY2hhciAoYXMgYmVnaW5uaW5nIGFuZCBlbmQpXG4gICAgICAgIHRvID0gdGhpc09iai5fbW9kZWwuZ2V0Q29udGVudChcImNoYXJhY3RlcnNcIikucmVmKHBvc2l0aW9uICsgcmV0YWluIC0gMSlcblxuICAgICAgICB0aGlzT2JqLl9tb2RlbC5nZXRDb250ZW50KFwic2VsZWN0aW9uc1wiKS5zZWxlY3QoXG4gICAgICAgICAgZnJvbSwgdG8sIGRlbHRhX3NlbGVjdGlvbnMpXG4gICAgICAgIHRoaXNPYmouX21vZGVsLmdldENvbnRlbnQoXCJzZWxlY3Rpb25zXCIpLnVuc2VsZWN0KFxuICAgICAgICAgIGZyb20sIHRvLCBkZWx0YV91bnNlbGVjdGlvbnMpXG5cbiAgICAgICAgcmV0dXJuIHBvc2l0aW9uICsgcmV0YWluXG4gICAgICB0aHJvdyBuZXcgRXJyb3IgXCJUaGlzIHBhcnQgb2YgY29kZSBtdXN0IG5vdCBiZSByZWFjaGVkIVwiXG5cbiAgaW5zZXJ0SGVscGVyID0gKHRoaXNPYmosIHBvc2l0aW9uLCBjb250ZW50X2FycmF5KSAtPlxuICAgIHRoaXNPYmouX21vZGVsLmdldENvbnRlbnQoXCJjaGFyYWN0ZXJzXCIpLmluc2VydENvbnRlbnRzKFxuICAgICAgcG9zaXRpb24sIGNvbnRlbnRfYXJyYXkpXG5cbiAgZGVsZXRlSGVscGVyID0gKHRoaXNPYmosIHBvc2l0aW9uLCBsZW5ndGggPSAxKSAtPlxuICAgIHRoaXNPYmouX21vZGVsLmdldENvbnRlbnQoXCJjaGFyYWN0ZXJzXCIpLmRlbGV0ZSBwb3NpdGlvbiwgbGVuZ3RoXG5cbmlmIHdpbmRvdz9cbiAgaWYgd2luZG93Llk/XG4gICAgd2luZG93LlkuUmljaFRleHQgPSBZUmljaFRleHRcbiAgZWxzZVxuICAgIHRocm93IG5ldyBFcnJvciBcIllvdSBtdXN0IGZpcnN0IGltcG9ydCBZIVwiXG5cbmlmIG1vZHVsZT9cbiAgbW9kdWxlLmV4cG9ydHMgPSBZUmljaFRleHRcbiJdfQ==
