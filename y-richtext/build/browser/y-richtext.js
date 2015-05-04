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
    console.log("Received deltas:");
    console.dir(deltas);
    return this.locker["try"]((function(_this) {
      return function() {
        var delta, position, _i, _len, _results;
        console.log("Applied deltas:");
        console.dir(deltas);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Rtb25hZC9naXQveS1yaWNodGV4dC9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9kbW9uYWQvZ2l0L3ktcmljaHRleHQvbGliL2VkaXRvcnMuY29mZmVlIiwiL2hvbWUvZG1vbmFkL2dpdC95LXJpY2h0ZXh0L2xpYi9taXNjLmNvZmZlZSIsIi9ob21lL2Rtb25hZC9naXQveS1yaWNodGV4dC9saWIveS1yaWNodGV4dC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBLHlDQUFBO0VBQUE7aVNBQUE7O0FBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSLENBQVAsQ0FBQTs7QUFBQTtBQU1lLEVBQUEsd0JBQUUsTUFBRixHQUFBO0FBQ1gsSUFEWSxJQUFDLENBQUEsU0FBQSxNQUNiLENBQUE7QUFBQSxJQUFBLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxJQUFJLENBQUMsTUFBTCxDQUFBLENBQWQsQ0FEVztFQUFBLENBQWI7O0FBQUEsMkJBSUEsV0FBQSxHQUFhLFNBQUEsR0FBQTtBQUFLLFVBQVUsSUFBQSxLQUFBLENBQU0sY0FBTixDQUFWLENBQUw7RUFBQSxDQUpiLENBQUE7O0FBQUEsMkJBT0EsU0FBQSxHQUFXLFNBQUEsR0FBQTtBQUFNLFVBQVUsSUFBQSxLQUFBLENBQU0sY0FBTixDQUFWLENBQU47RUFBQSxDQVBYLENBQUE7O0FBQUEsMkJBY0EsU0FBQSxHQUFXLFNBQUMsS0FBRCxHQUFBO0FBQVcsVUFBVSxJQUFBLEtBQUEsQ0FBTSxjQUFOLENBQVYsQ0FBWDtFQUFBLENBZFgsQ0FBQTs7QUFBQSwyQkFlQSxZQUFBLEdBQWMsU0FBQSxHQUFBO0FBQUssVUFBVSxJQUFBLEtBQUEsQ0FBTSxjQUFOLENBQVYsQ0FBTDtFQUFBLENBZmQsQ0FBQTs7QUFBQSwyQkFvQkEsWUFB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QW9CLE1BQXBCLEdBQUE7O01BQW9CLFNBQVM7S0FDMUM7V0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQWYsQ0FBMEIsWUFBMUIsQ0FBdUMsQ0FBQyxRQUFELENBQXZDLENBQStDLFFBQS9DLEVBQXlELE1BQXpELEVBRGE7RUFBQSxDQXZVZixDQUFBOzttQkFBQTs7R0FKc0IsVUFYeEIsQ0FBQTs7QUF5VkEsSUFBRyxnREFBSDtBQUNFLEVBQUEsSUFBRyxnQkFBSDtBQUNFLElBQUEsTUFBTSxDQUFDLENBQUMsQ0FBQyxRQUFULEdBQW9CLFNBQXBCLENBREY7R0FBQSxNQUFBO0FBR0UsVUFBVSxJQUFBLEtBQUEsQ0FBTSwwQkFBTixDQUFWLENBSEY7R0FERjtDQXpWQTs7QUErVkEsSUFBRyxnREFBSDtBQUNFLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBakIsQ0FERjtDQS9WQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtaXNjID0gcmVxdWlyZShcIi4vbWlzYy5jb2ZmZWVcIilcblxuIyBhIGdlbmVyaWMgZWRpdG9yIGNsYXNzXG5jbGFzcyBBYnN0cmFjdEVkaXRvclxuICAjIGNyZWF0ZSBhbiBlZGl0b3IgaW5zdGFuY2VcbiAgIyBAcGFyYW0gaW5zdGFuY2UgW0VkaXRvcl0gdGhlIGVkaXRvciBvYmplY3RcbiAgY29uc3RydWN0b3I6IChAZWRpdG9yKSAtPlxuICAgIEBsb2NrZXIgPSBuZXcgbWlzYy5Mb2NrZXIoKVxuXG4gICMgZ2V0IHRoZSBjdXJyZW50IGNvbnRlbnQgYXMgYSBvdC1kZWx0YVxuICBnZXRDb250ZW50czogKCktPiB0aHJvdyBuZXcgRXJyb3IgXCJJbXBsZW1lbnQgbWVcIlxuXG4gICMgZ2V0IHRoZSBjdXJyZW50IGN1cnNvciBwb3NpdGlvblxuICBnZXRDdXJzb3I6ICgpIC0+IHRocm93IG5ldyBFcnJvciBcIkltcGxlbWVudCBtZVwiXG4gICMgc2V0IHRoZSBjdXJyZW50IGN1cnNvciBwb3NpdGlvblxuICAjIEBwYXJhbSBwYXJhbSBbT3B0aW9uXSB0aGUgb3B0aW9uc1xuICAjIEBvcHRpb24gcGFyYW0gW0ludGVnZXJdIGlkIHRoZSBpZCBvZiB0aGUgYXV0aG9yXG4gICMgQG9wdGlvbiBwYXJhbSBbSW50ZWdlcl0gaW5kZXggdGhlIGluZGV4IG9mIHRoZSBjdXJzb3JcbiAgIyBAb3B0aW9uIHBhcmFtIFtTdHJpbmddIHRleHQgdGhlIHRleHQgb2YgdGhlIGN1cnNvclxuICAjIEBvcHRpb24gcGFyYW0gW1N0cmluZ10gY29sb3IgdGhlIGNvbG9yIG9mIHRoZSBjdXJzb3JcbiAgc2V0Q3Vyc29yOiAocGFyYW0pIC0+IHRocm93IG5ldyBFcnJvciBcIkltcGxlbWVudCBtZVwiXG4gIHJlbW92ZUN1cnNvcjogKCktPiB0aHJvdyBuZXcgRXJyb3IgXCJJbXBsZW1lbnQgbWVcIlxuXG5cbiAgIyByZW1vdmUgYSBjdXJzb3JcbiAgIyBAcGFyYW0gaWQgW1N0cmluZ10gdGhlIGlkIG9mIHRoZSBjdXJzb3IgdG8gcmVtb3ZlXG4gIHJlbW92ZUN1cnNvcjogKGlkKSAtPiB0aHJvdyBuZXcgRXJyb3IgXCJJbXBsZW1lbnQgbWVcIlxuXG4gICMgZGVzY3JpYmUgaG93IHRvIHBhc3MgbG9jYWwgbW9kaWZpY2F0aW9ucyBvZiB0aGUgdGV4dCB0byB0aGUgYmFja2VuZC5cbiAgIyBAcGFyYW0gYmFja2VuZCBbRnVuY3Rpb25dIHRoZSBmdW5jdGlvbiB0byBwYXNzIHRoZSBkZWx0YSB0b1xuICAjIEBub3RlIFRoZSBiYWNrZW5kIGZ1bmN0aW9uIHRha2VzIGEgbGlzdCBvZiBkZWx0YXMgYXMgYXJndW1lbnRcbiAgb2JzZXJ2ZUxvY2FsVGV4dDogKGJhY2tlbmQpIC0+IHRocm93IG5ldyBFcnJvciBcIkltcGxlbWVudCBtZVwiXG5cbiAgIyBkZXNjcmliZSBob3cgdG8gcGFzcyBsb2NhbCBtb2RpZmljYXRpb25zIG9mIHRoZSBjdXJzb3IgdG8gdGhlIGJhY2tlbmRcbiAgIyBAcGFyYW0gYmFja2VuZCBbRnVuY3Rpb25dIHRoZSBmdW5jdGlvbiB0byBwYXNzIHRoZSBuZXcgcG9zaXRpb24gdG9cbiAgIyBAbm90ZSB0aGUgYmFja2VuZCBmdW5jdGlvbiB0YWtlcyBhIHBvc2l0aW9uIGFzIGFyZ3VtZW50XG4gIG9ic2VydmVMb2NhbEN1cnNvcjogKGJhY2tlbmQpIC0+IHRocm93IG5ldyBFcnJvciBcIkltcGxlbWVudCBtZVwiXG5cbiAgIyBBcHBseSBkZWx0YSBvbiB0aGUgZWRpdG9yXG4gICMgQHBhcmFtIGRlbHRhIFtEZWx0YV0gdGhlIGRlbHRhIHRvIHByb3BhZ2F0ZSB0byB0aGUgZWRpdG9yXG4gICMgQHNlZSBodHRwczovL2dpdGh1Yi5jb20vb3R0eXBlcy9yaWNoLXRleHRcbiAgdXBkYXRlQ29udGVudHM6IChkZWx0YSkgLT4gdGhyb3cgbmV3IEVycm9yIFwiSW1wbGVtZW50IG1lXCJcblxuICAjIFJlbW92ZSBvbGQgY29udGVudCBhbmQgYXBwbHkgZGVsdGEgb24gdGhlIGVkaXRvclxuICAjIEBwYXJhbSBkZWx0YSBbRGVsdGFdIHRoZSBkZWx0YSB0byBwcm9wYWdhdGUgdG8gdGhlIGVkaXRvclxuICAjIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL290dHlwZXMvcmljaC10ZXh0XG4gIHNldENvbnRlbnRzOiAoZGVsdGEpIC0+IHRocm93IG5ldyBFcnJvciBcIkltcGxlbWVudCBtZVwiXG5cbiAgIyBSZXR1cm4gdGhlIGVkaXRvciBpbnN0YW5jZVxuICBnZXRFZGl0b3I6ICgpLT4gdGhyb3cgbmV3IEVycm9yIFwiSW1wbGVtZW50IG1lXCJcblxuICAjIENoZWNrIGlmIHRoZSBlZGl0b3IgdHJpZXMgdG8gYWNjdW11bGF0ZSBtZXNzYWdlcy4gVGhpcyBpcyBleGVjdXRlZCBldmVyeSB0aW1lIGJlZm9yZSBZanMgZXhlY3V0ZXMgYSBtZXNzYWdlc1xuICBjaGVja1VwZGF0ZTogKCktPiB0aHJvdyBuZXcgRXJyb3IgXCJJbXBsZW1lbnQgbWVcIlxuXG5jbGFzcyBRdWlsbEpzIGV4dGVuZHMgQWJzdHJhY3RFZGl0b3JcblxuICBjb25zdHJ1Y3RvcjogKEBlZGl0b3IpIC0+XG4gICAgc3VwZXIgQGVkaXRvclxuICAgIEBfY3Vyc29ycyA9IEBlZGl0b3IuZ2V0TW9kdWxlKFwibXVsdGktY3Vyc29yXCIpXG5cbiAgIyBSZXR1cm4gdGhlIGxlbmd0aCBvZiB0aGUgdGV4dFxuICBnZXRMZW5ndGg6ICgpLT5cbiAgICBAZWRpdG9yLmdldExlbmd0aCgpXG5cbiAgZ2V0Q3Vyc29yUG9zaXRpb246IC0+XG4gICAgc2VsZWN0aW9uID0gQGVkaXRvci5nZXRTZWxlY3Rpb24oKVxuICAgIGlmIHNlbGVjdGlvblxuICAgICAgc2VsZWN0aW9uLnN0YXJ0XG4gICAgZWxzZVxuICAgICAgMFxuXG4gIGdldENvbnRlbnRzOiAoKS0+XG4gICAgQGVkaXRvci5nZXRDb250ZW50cygpLm9wc1xuXG4gIHNldEN1cnNvcjogKHBhcmFtKSAtPiBAbG9ja2VyLnRyeSAoKT0+XG4gICAgY3Vyc29yID0gQF9jdXJzb3JzLmN1cnNvcnNbcGFyYW0uaWRdXG4gICAgaWYgY3Vyc29yPyBhbmQgY3Vyc29yLmNvbG9yID09IHBhcmFtLmNvbG9yXG4gICAgICBmdW4gPSAoaW5kZXgpID0+XG4gICAgICAgIEBfY3Vyc29ycy5tb3ZlQ3Vyc29yIHBhcmFtLmlkLCBpbmRleFxuICAgIGVsc2VcbiAgICAgIGlmIGN1cnNvcj8gYW5kIGN1cnNvci5jb2xvcj8gYW5kIGN1cnNvci5jb2xvciAhPSBwYXJhbS5jb2xvclxuICAgICAgICBAcmVtb3ZlQ3Vyc29yIHBhcmFtLmlkXG5cbiAgICAgIGZ1biA9IChpbmRleCkgPT5cbiAgICAgICAgQF9jdXJzb3JzLnNldEN1cnNvcihwYXJhbS5pZCwgaW5kZXgsXG4gICAgICAgICAgcGFyYW0ubmFtZSwgcGFyYW0uY29sb3IpXG5cbiAgICBpZiBwYXJhbS5pbmRleD9cbiAgICAgIGZ1biBwYXJhbS5pbmRleFxuXG4gIHJlbW92ZUN1cnNvcjogKGlkKSAtPlxuICAgIEBfY3Vyc29ycy5yZW1vdmVDdXJzb3IoaWQpXG5cbiAgcmVtb3ZlQ3Vyc29yOiAoaWQpLT5cbiAgICAgIEBfY3Vyc29ycy5yZW1vdmVDdXJzb3IgaWRcblxuICBvYnNlcnZlTG9jYWxUZXh0OiAoYmFja2VuZCktPlxuICAgIEBlZGl0b3Iub24gXCJ0ZXh0LWNoYW5nZVwiLCAoZGVsdGFzLCBzb3VyY2UpIC0+XG4gICAgICAjIGNhbGwgdGhlIGJhY2tlbmQgd2l0aCBkZWx0YXNcbiAgICAgIHBvc2l0aW9uID0gYmFja2VuZCBkZWx0YXMub3BzXG4gICAgICAjIHRyaWdnZXIgYW4gZXh0cmEgZXZlbnQgdG8gbW92ZSBjdXJzb3IgdG8gcG9zaXRpb24gb2YgaW5zZXJ0ZWQgdGV4dFxuICAgICAgQGVkaXRvci5zZWxlY3Rpb24uZW1pdHRlci5lbWl0KFxuICAgICAgICBAZWRpdG9yLnNlbGVjdGlvbi5lbWl0dGVyLmNvbnN0cnVjdG9yLmV2ZW50cy5TRUxFQ1RJT05fQ0hBTkdFLFxuICAgICAgICBAZWRpdG9yLnF1aWxsLmdldFNlbGVjdGlvbigpLFxuICAgICAgICBcInVzZXJcIilcblxuICBvYnNlcnZlTG9jYWxDdXJzb3I6IChiYWNrZW5kKSAtPlxuICAgIEBlZGl0b3Iub24gXCJzZWxlY3Rpb24tY2hhbmdlXCIsIChyYW5nZSwgc291cmNlKS0+XG4gICAgICBpZiByYW5nZSBhbmQgcmFuZ2Uuc3RhcnQgPT0gcmFuZ2UuZW5kXG4gICAgICAgIGJhY2tlbmQgcmFuZ2Uuc3RhcnRcblxuICB1cGRhdGVDb250ZW50czogKGRlbHRhKS0+XG4gICAgQGVkaXRvci51cGRhdGVDb250ZW50cyBkZWx0YVxuXG4gIHNldENvbnRlbnRzOiAoZGVsdGEpLT5cbiAgICBAZWRpdG9yLnNldENvbnRlbnRzKGRlbHRhKVxuXG4gIGdldEVkaXRvcjogKCktPlxuICAgIEBlZGl0b3JcblxuICBjaGVja1VwZGF0ZTogKCktPlxuICAgIEBlZGl0b3IuZWRpdG9yLmNoZWNrVXBkYXRlKClcblxuY2xhc3MgVGVzdEVkaXRvciBleHRlbmRzIEFic3RyYWN0RWRpdG9yXG5cbiAgY29uc3RydWN0b3I6IChAZWRpdG9yKSAtPlxuICAgIHN1cGVyXG5cbiAgZ2V0TGVuZ3RoOigpIC0+XG4gICAgMFxuXG4gIGdldEN1cnNvclBvc2l0aW9uOiAtPlxuICAgIDBcblxuICBnZXRDb250ZW50czogKCkgLT5cbiAgICBvcHM6IFt7aW5zZXJ0OiBcIldlbGwsIHRoaXMgaXMgYSB0ZXN0IVwifVxuICAgICAge2luc2VydDogXCJBbmQgSSdtIGJvbGTigKZcIiwgYXR0cmlidXRlczoge2JvbGQ6dHJ1ZX19XVxuXG4gIHNldEN1cnNvcjogKCkgLT5cbiAgICBcIlwiXG5cbiAgb2JzZXJ2ZUxvY2FsVGV4dDooYmFja2VuZCkgLT5cbiAgICBcIlwiXG5cbiAgb2JzZXJ2ZUxvY2FsQ3Vyc29yOiAoYmFja2VuZCkgLT5cbiAgICBcIlwiXG5cbiAgdXBkYXRlQ29udGVudHM6IChkZWx0YSkgLT5cbiAgICBcIlwiXG5cbiAgc2V0Q29udGVudHM6IChkZWx0YSktPlxuICAgIFwiXCJcblxuICBnZXRFZGl0b3I6ICgpLT5cbiAgICBAZWRpdG9yXG5cbmV4cG9ydHMuUXVpbGxKcyA9IFF1aWxsSnNcbmV4cG9ydHMuVGVzdEVkaXRvciA9IFRlc3RFZGl0b3JcbmV4cG9ydHMuQWJzdHJhY3RFZGl0b3IgPSBBYnN0cmFjdEVkaXRvclxuIiwiY2xhc3MgTG9ja2VyXG4gIGNvbnN0cnVjdG9yOiAoKSAtPlxuICAgIEBpc19sb2NrZWQgPSBmYWxzZVxuXG4gIHRyeTogKGZ1bikgLT5cbiAgICBpZiBAaXNfbG9ja2VkXG4gICAgICByZXR1cm5cblxuICAgIEBpc19sb2NrZWQgPSB0cnVlXG4gICAgcmV0ID0gZG8gZnVuXG4gICAgQGlzX2xvY2tlZCA9IGZhbHNlXG4gICAgcmV0dXJuIHJldFxuXG4jIGEgYmFzaWMgY2xhc3Mgd2l0aCBnZW5lcmljIGdldHRlciAvIHNldHRlciBmdW5jdGlvblxuY2xhc3MgQmFzZUNsYXNzXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgICMgb3duUHJvcGVydHkgaXMgdW5zYWZlLiBSYXRoZXIgcHV0IGl0IG9uIGEgZGVkaWNhdGVkIHByb3BlcnR5IGxpa2UuLlxuICAgIEBfdG1wX21vZGVsID0ge31cblxuICAjIFRyeSB0byBmaW5kIHRoZSBwcm9wZXJ0eSBpbiBAX21vZGVsLCBlbHNlIHJldHVybiB0aGVcbiAgIyB0bXBfbW9kZWxcbiAgX2dldDogKHByb3ApIC0+XG4gICAgaWYgbm90IEBfbW9kZWw/XG4gICAgICBAX3RtcF9tb2RlbFtwcm9wXVxuICAgIGVsc2VcbiAgICAgIEBfbW9kZWwudmFsKHByb3ApXG4gICMgVHJ5IHRvIHNldCB0aGUgcHJvcGVydHkgaW4gQF9tb2RlbCwgZWxzZSBzZXQgdGhlXG4gICMgdG1wX21vZGVsXG4gIF9zZXQ6IChwcm9wLCB2YWwpIC0+XG4gICAgaWYgbm90IEBfbW9kZWw/XG4gICAgICBAX3RtcF9tb2RlbFtwcm9wXSA9IHZhbFxuICAgIGVsc2VcbiAgICAgIEBfbW9kZWwudmFsKHByb3AsIHZhbClcblxuICAjIHNpbmNlIHdlIGFscmVhZHkgYXNzdW1lIHRoYXQgYW55IGluc3RhbmNlIG9mIEJhc2VDbGFzcyB1c2VzIGEgTWFwTWFuYWdlclxuICAjIFdlIGNhbiBjcmVhdGUgaXQgaGVyZSwgdG8gc2F2ZSBsaW5lcyBvZiBjb2RlXG4gIF9nZXRNb2RlbDogKFksIE9wZXJhdGlvbiktPlxuICAgIGlmIG5vdCBAX21vZGVsP1xuICAgICAgQF9tb2RlbCA9IG5ldyBPcGVyYXRpb24uTWFwTWFuYWdlcihAKS5leGVjdXRlKClcbiAgICAgIGZvciBrZXksIHZhbHVlIG9mIEBfdG1wX21vZGVsXG4gICAgICAgIEBfbW9kZWwudmFsKGtleSwgdmFsdWUpXG4gICAgQF9tb2RlbFxuXG4gIF9zZXRNb2RlbDogKEBfbW9kZWwpLT5cbiAgICBkZWxldGUgQF90bXBfbW9kZWxcblxuaWYgbW9kdWxlP1xuICBleHBvcnRzLkJhc2VDbGFzcyA9IEJhc2VDbGFzc1xuICBleHBvcnRzLkxvY2tlciA9IExvY2tlclxuIiwibWlzYyA9IChyZXF1aXJlIFwiLi9taXNjLmNvZmZlZVwiKVxuQmFzZUNsYXNzID0gbWlzYy5CYXNlQ2xhc3NcbkxvY2tlciA9IG1pc2MuTG9ja2VyXG5FZGl0b3JzID0gKHJlcXVpcmUgXCIuL2VkaXRvcnMuY29mZmVlXCIpXG4jIEFsbCBkZXBlbmRlbmNpZXMgKGxpa2UgWS5TZWxlY3Rpb25zKSB0byBvdGhlciB0eXBlcyAodGhhdCBoYXZlIGl0cyBvd25cbiMgcmVwb3NpdG9yeSkgc2hvdWxkICBiZSBpbmNsdWRlZCBieSB0aGUgdXNlciAoaW4gb3JkZXIgdG8gcmVkdWNlIHRoZSBhbW91bnQgb2ZcbiMgZG93bmxvYWRlZCBjb250ZW50KS5cbiMgV2l0aCBodG1sNSBpbXBvcnRzLCB3ZSBjYW4gaW5jbHVkZSBpdCBhdXRvbWF0aWNhbGx5IHRvby4gQnV0IHdpdGggdGhlIG9sZFxuIyBzY3JpcHQgdGFncyB0aGlzIGlzIHRoZSBiZXN0IHNvbHV0aW9uIHRoYXQgY2FtZSB0byBteSBtaW5kLlxuXG4jIEEgY2xhc3MgaG9sZGluZyB0aGUgaW5mb3JtYXRpb24gYWJvdXQgcmljaCB0ZXh0XG5jbGFzcyBZUmljaFRleHQgZXh0ZW5kcyBCYXNlQ2xhc3NcbiAgIyBAcGFyYW0gY29udGVudCBbU3RyaW5nXSBhbiBpbml0aWFsIHN0cmluZ1xuICAjIEBwYXJhbSBlZGl0b3IgW0VkaXRvcl0gYW4gZWRpdG9yIGluc3RhbmNlXG4gICMgQHBhcmFtIGF1dGhvciBbU3RyaW5nXSB0aGUgbmFtZSBvZiB0aGUgbG9jYWwgYXV0aG9yXG4gIGNvbnN0cnVjdG9yOiAoZWRpdG9yX25hbWUsIGVkaXRvcl9pbnN0YW5jZSkgLT5cbiAgICBAbG9ja2VyID0gbmV3IExvY2tlcigpXG4gICAgQF9ncmFwaGljc1BhbGV0dGUgPSBbJyM4MzdERkEnLCAnI0ZBN0Q3RCcsJyMzNERBNDMnLCAnI0QxQkMzMCddXG5cbiAgICBpZiBlZGl0b3JfbmFtZT8gYW5kIGVkaXRvcl9pbnN0YW5jZT9cbiAgICAgIEBfYmluZF9sYXRlciA9XG4gICAgICAgIG5hbWU6IGVkaXRvcl9uYW1lXG4gICAgICAgIGluc3RhbmNlOiBlZGl0b3JfaW5zdGFuY2VcblxuICAgICMgVE9ETzogZ2VuZXJhdGUgYSBVSUQgKHlvdSBjYW4gZ2V0IGEgdW5pcXVlIGlkIGJ5IGNhbGxpbmdcbiAgICAjIGBAX21vZGVsLmdldFVpZCgpYCAtIGlzIHRoaXMgd2hhdCB5b3UgbWVhbj8pXG4gICAgIyBAYXV0aG9yID0gYXV0aG9yXG4gICAgIyBUT0RPOiBhc3NpZ24gYW4gaWQgLyBhdXRob3IgbmFtZSB0byB0aGUgcmljaCB0ZXh0IGluc3RhbmNlIGZvciBhdXRob3JzaGlwXG5cbiAgI1xuICAjIEJpbmQgdGhlIFJpY2hUZXh0IHR5cGUgdG8gYSByaWNoIHRleHQgZWRpdG9yIChlLmcuIHF1aWxsanMpXG4gICNcbiAgYmluZDogKCktPlxuICAgICMgVE9ETzogYmluZCB0byBtdWx0aXBsZSBlZGl0b3JzXG4gICAgaWYgYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgRWRpdG9ycy5BYnN0cmFjdEVkaXRvclxuICAgICAgIyBpcyBhbHJlYWR5IGFuIGVkaXRvciFcbiAgICAgIEBlZGl0b3IgPSBhcmd1bWVudHNbMF1cbiAgICBlbHNlXG4gICAgICBbZWRpdG9yX25hbWUsIGVkaXRvcl9pbnN0YW5jZV0gPSBhcmd1bWVudHNcbiAgICAgIGlmIEBlZGl0b3I/IGFuZCBAZWRpdG9yLmdldEVkaXRvcigpIGlzIGVkaXRvcl9pbnN0YW5jZVxuICAgICAgICAjIHJldHVybiwgaWYgQGVkaXRvciBpcyBhbHJlYWR5IGJvdW5kISAobmV2ZXIgYmluZCB0d2ljZSEpXG4gICAgICAgIHJldHVyblxuICAgICAgRWRpdG9yID0gRWRpdG9yc1tlZGl0b3JfbmFtZV1cbiAgICAgIGlmIEVkaXRvcj9cbiAgICAgICAgQGVkaXRvciA9IG5ldyBFZGl0b3IgZWRpdG9yX2luc3RhbmNlXG4gICAgICBlbHNlXG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIlRoaXMgdHlwZSBvZiBlZGl0b3IgaXMgbm90IHN1cHBvcnRlZCEgKFwiICtcbiAgICAgICAgICBlZGl0b3JfbmFtZSArIFwiKVwiXG5cbiAgICAjIFRPRE86IHBhcnNlIHRoZSBmb2xsb3dpbmcgZGlyZWN0bHkgZnJvbSAkY2hhcmFjdGVycyskc2VsZWN0aW9ucyAoaW4gTyhuKSlcbiAgICBAZWRpdG9yLnNldENvbnRlbnRzXG4gICAgICBvcHM6IEBnZXREZWx0YSgpXG5cbiAgICAjIGJpbmQgdGhlIHJlc3QuLlxuICAgICMgVE9ETzogcmVtb3ZlIG9ic2VydmVycywgd2hlbiBlZGl0b3IgaXMgb3ZlcndyaXR0ZW5cbiAgICBAZWRpdG9yLm9ic2VydmVMb2NhbFRleHQgQHBhc3NEZWx0YXNcbiAgICBAYmluZEV2ZW50c1RvRWRpdG9yIEBlZGl0b3JcbiAgICBAZWRpdG9yLm9ic2VydmVMb2NhbEN1cnNvciBAdXBkYXRlQ3Vyc29yUG9zaXRpb25cblxuICAgICMgcHVsbCBjaGFuZ2VzIGZyb20gcXVpbGwsIGJlZm9yZSBtZXNzYWdlIGlzIHJlY2VpdmVkXG4gICAgIyBhcyBzdWdnZXN0ZWQgaHR0cHM6Ly9kaXNjdXNzLnF1aWxsanMuY29tL3QvcHJvYmxlbXMtaW4tY29sbGFib3JhdGl2ZS1pbXBsZW1lbnRhdGlvbi8yNThcbiAgICAjIFRPRE86IG1vdmUgdGhpcyB0byBFZGl0b3JzLmNvZmZlZVxuICAgIEBfbW9kZWwuY29ubmVjdG9yLnJlY2VpdmVfaGFuZGxlcnMudW5zaGlmdCAoKT0+XG4gICAgICBAZWRpdG9yLmNoZWNrVXBkYXRlKClcblxuXG4gIGdldERlbHRhOiAoKS0+XG4gICAgdGV4dF9jb250ZW50ID0gQF9tb2RlbC5nZXRDb250ZW50KCdjaGFyYWN0ZXJzJykudmFsKClcbiAgICAjIHRyYW5zZm9ybSBZLlNlbGVjdGlvbnMuZ2V0U2VsZWN0aW9ucygpIHRvIGEgZGVsdGFcbiAgICBleHBlY3RlZF9wb3MgPSAwXG4gICAgZGVsdGFzID0gW11cbiAgICBzZWxlY3Rpb25zID0gQF9tb2RlbC5nZXRDb250ZW50KFwic2VsZWN0aW9uc1wiKVxuICAgIGZvciBzZWwgaW4gc2VsZWN0aW9ucy5nZXRTZWxlY3Rpb25zKEBfbW9kZWwuZ2V0Q29udGVudChcImNoYXJhY3RlcnNcIikpXG4gICAgICAjICgrMSksIGJlY2F1c2UgaWYgd2Ugc2VsZWN0IGZyb20gMSB0byAxICh3aXRoIHktc2VsZWN0aW9ucyksIHRoZW4gdGhlXG4gICAgICAjIGxlbmd0aCBpcyAxXG4gICAgICBzZWxlY3Rpb25fbGVuZ3RoID0gc2VsLnRvIC0gc2VsLmZyb20gKyAxXG4gICAgICBpZiBleHBlY3RlZF9wb3MgaXNudCBzZWwuZnJvbVxuICAgICAgICAjIFRoZXJlIGlzIHVuc2VsZWN0ZWQgdGV4dC4gJHJldGFpbiB0byB0aGUgbmV4dCBzZWxlY3Rpb25cbiAgICAgICAgdW5zZWxlY3RlZF9pbnNlcnRfY29udGVudCA9IHRleHRfY29udGVudC5zcGxpY2UoXG4gICAgICAgICAgMCwgc2VsLmZyb20tZXhwZWN0ZWRfcG9zIClcbiAgICAgICAgICAuam9pbignJylcbiAgICAgICAgZGVsdGFzLnB1c2hcbiAgICAgICAgICBpbnNlcnQ6IHVuc2VsZWN0ZWRfaW5zZXJ0X2NvbnRlbnRcbiAgICAgICAgZXhwZWN0ZWRfcG9zICs9IHVuc2VsZWN0ZWRfaW5zZXJ0X2NvbnRlbnQubGVuZ3RoXG4gICAgICBpZiBleHBlY3RlZF9wb3MgaXNudCBzZWwuZnJvbVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJUaGlzIHBvcnRpb24gb2YgY29kZSBtdXN0IG5vdCBiZSByZWFjaGVkIGluIGdldERlbHRhIVwiXG4gICAgICBkZWx0YXMucHVzaFxuICAgICAgICBpbnNlcnQ6IHRleHRfY29udGVudC5zcGxpY2UoMCwgc2VsZWN0aW9uX2xlbmd0aCkuam9pbignJylcbiAgICAgICAgYXR0cmlidXRlczogc2VsLmF0dHJzXG4gICAgICBleHBlY3RlZF9wb3MgKz0gc2VsZWN0aW9uX2xlbmd0aFxuICAgIGlmIHRleHRfY29udGVudC5sZW5ndGggPiAwXG4gICAgICBkZWx0YXMucHVzaFxuICAgICAgICBpbnNlcnQ6IHRleHRfY29udGVudC5qb2luKCcnKVxuICAgIGRlbHRhc1xuXG4gIF9nZXRNb2RlbDogKFksIE9wZXJhdGlvbikgLT5cbiAgICBpZiBub3QgQF9tb2RlbD9cbiAgICAgICMgd2Ugc2F2ZSB0aGlzIHN0dWZmIGFzIF9zdGF0aWNfIGNvbnRlbnQgbm93LlxuICAgICAgIyBUaGVyZWZvcmUsIHlvdSBjYW4ndCBvdmVyd3JpdGUgaXQsIGFmdGVyIHlvdSBvbmNlIHNhdmVkIGl0LlxuICAgICAgIyBCdXQgb24gdGhlIHVwc2lkZSwgd2UgY2FuIGFsd2F5cyBtYWtlIHN1cmUsIHRoYXQgdGhleSBhcmUgZGVmaW5lZCFcbiAgICAgIGNvbnRlbnRfb3BlcmF0aW9ucyA9XG4gICAgICAgIHNlbGVjdGlvbnM6IG5ldyBZLlNlbGVjdGlvbnMoKVxuICAgICAgICBjaGFyYWN0ZXJzOiBuZXcgWS5MaXN0KClcbiAgICAgICAgY3Vyc29yczogbmV3IFkuT2JqZWN0KClcbiAgICAgICAgYXV0aG9yczogbmV3IFkuT2JqZWN0KClcbiAgICAgIEBfbW9kZWwgPSBuZXcgT3BlcmF0aW9uLk1hcE1hbmFnZXIoQCwgbnVsbCwge30sIGNvbnRlbnRfb3BlcmF0aW9ucyApXG4gICAgICAgIC5leGVjdXRlKClcblxuICAgICAgQF9zZXRNb2RlbCBAX21vZGVsXG5cbiAgICAgIGlmIEBfYmluZF9sYXRlcj9cbiAgICAgICAgRWRpdG9yID0gRWRpdG9yc1tAX2JpbmRfbGF0ZXIubmFtZV1cbiAgICAgICAgaWYgRWRpdG9yP1xuICAgICAgICAgIGVkaXRvciA9IG5ldyBFZGl0b3IgQF9iaW5kX2xhdGVyLmluc3RhbmNlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJUaGlzIHR5cGUgb2YgZWRpdG9yIGlzIG5vdCBzdXBwb3J0ZWQhIChcIiArXG4gICAgICAgICAgZWRpdG9yX25hbWUgKyBcIikgLS0gZmF0YWwgZXJyb3IhXCJcbiAgICAgICAgQHBhc3NEZWx0YXMgZWRpdG9yLmdldENvbnRlbnRzKClcbiAgICAgICAgQGJpbmQgZWRpdG9yXG4gICAgICAgIGRlbGV0ZSBAX2JpbmRfbGF0ZXJcblxuICAgICAgIyBsaXN0ZW4gdG8gZXZlbnRzIG9uIHRoZSBtb2RlbCB1c2luZyB0aGUgZnVuY3Rpb24gcHJvcGFnYXRlVG9FZGl0b3JcbiAgICAgIEBfbW9kZWwub2JzZXJ2ZSBAcHJvcGFnYXRlVG9FZGl0b3JcbiAgICByZXR1cm4gQF9tb2RlbFxuXG4gIF9zZXRNb2RlbDogKG1vZGVsKSAtPlxuICAgIHN1cGVyXG5cbiAgX25hbWU6IFwiUmljaFRleHRcIlxuXG4gIGdldFRleHQ6ICgpLT5cbiAgICBAX21vZGVsLmdldENvbnRlbnQoJ2NoYXJhY3RlcnMnKS52YWwoKS5qb2luKCcnKVxuXG4gICMgaW5zZXJ0IG91ciBvd24gY3Vyc29yIGluIHRoZSBjdXJzb3JzIG9iamVjdFxuICAjIEBwYXJhbSBwb3NpdGlvbiBbSW50ZWdlcl0gdGhlIHBvc2l0aW9uIHdoZXJlIHRvIGluc2VydCBpdFxuICBzZXRDdXJzb3IgOiAocG9zaXRpb24pIC0+XG4gICAgQHNlbGZDdXJzb3IgPSBAX21vZGVsLmdldENvbnRlbnQoXCJjaGFyYWN0ZXJzXCIpLnJlZihwb3NpdGlvbilcblxuICAgIEBfbW9kZWwuZ2V0Q29udGVudChcImN1cnNvcnNcIikudmFsKEBfbW9kZWwuSEIuZ2V0VXNlcklkKCksIEBzZWxmQ3Vyc29yKVxuXG4gIHNldEF1dGhvciA6IChvcHRpb24pIC0+XG4gICAgaWYgb3B0aW9uPyBhbmQgb3B0aW9uLm5hbWU/XG4gICAgICBuYW1lID0gb3B0aW9uLm5hbWVcbiAgICBlbHNlXG4gICAgICBuYW1lID0gaWYgQGF1dGhvcj8gYW5kIEBhdXRob3IubmFtZSB0aGVuIEBhdXRob3IubmFtZSBlbHNlICdEZWZhdWx0IHVzZXInXG5cbiAgICBpZiBvcHRpb24/IGFuZCBvcHRpb24uY29sb3I/XG4gICAgICBjb2xvciA9IG9wdGlvbi5jb2xvclxuICAgIGVsc2VcbiAgICAgICMgaWYgYWxyZWFkeSBhIGNvbG9yIHNldFxuICAgICAgaWYgQGF1dGhvcj8gYW5kIEBhdXRob3IuY29sb3JcbiAgICAgICAgY29sb3IgPSBAYXV0aG9yLmNvbG9yXG4gICAgICBlbHNlICMgaWYgbm8gY29sb3IsIHBpY2sgdGhlIG5leHQgb25lIGZyb20gdGhlIHBhbGV0dGVcbiAgICAgICAgbl9hdXRob3JzID0gMFxuICAgICAgICBmb3IgYXV0aCBvZiBAX21vZGVsLmdldENvbnRlbnQoJ2F1dGhvcnMnKS52YWwoKVxuICAgICAgICAgIG5fYXV0aG9ycysrXG4gICAgICAgIGNvbG9yID0gQF9ncmFwaGljc1BhbGV0dGVbbl9hdXRob3JzICUgQF9ncmFwaGljc1BhbGV0dGUubGVuZ3RoXVxuXG5cbiAgICBAYXV0aG9yID1cbiAgICAgICBuYW1lOiBuYW1lXG4gICAgICAgY29sb3I6IGNvbG9yXG5cbiAgICBjb25zb2xlLmxvZyBvcHRpb24sIEBhdXRob3JcbiAgICBAX21vZGVsLmdldENvbnRlbnQoJ2F1dGhvcnMnKS52YWwoQF9tb2RlbC5IQi5nZXRVc2VySWQoKSwgQGF1dGhvcilcblxuICAjIHBhc3MgZGVsdGFzIHRvIHRoZSBjaGFyYWN0ZXIgaW5zdGFuY2VcbiAgIyBAcGFyYW0gZGVsdGFzIFtBcnJheTxPYmplY3Q+XSBhbiBhcnJheSBvZiBkZWx0YXNcbiAgIyBAc2VlIG90LXR5cGVzIGZvciBtb3JlIGluZm9cbiAgcGFzc0RlbHRhcyA6IChkZWx0YXMpID0+XG4gICAgY29uc29sZS5sb2cgXCJSZWNlaXZlZCBkZWx0YXM6XCJcbiAgICBjb25zb2xlLmRpciBkZWx0YXNcbiAgICBAbG9ja2VyLnRyeSAoKT0+XG4gICAgICBjb25zb2xlLmxvZyBcIkFwcGxpZWQgZGVsdGFzOlwiXG4gICAgICBjb25zb2xlLmRpciBkZWx0YXNcbiAgICAgIHBvc2l0aW9uID0gMFxuICAgICAgZm9yIGRlbHRhIGluIGRlbHRhc1xuICAgICAgICBwb3NpdGlvbiA9IGRlbHRhSGVscGVyIEAsIGRlbHRhLCBwb3NpdGlvblxuXG4gICMgQG92ZXJyaWRlIHVwZGF0ZUN1cnNvclBvc2l0aW9uKGluZGV4KVxuICAjICAgdXBkYXRlIHRoZSBwb3NpdGlvbiBvZiBvdXIgY3Vyc29yIHRvIHRoZSBuZXcgb25lIHVzaW5nIGFuIGluZGV4XG4gICMgICBAcGFyYW0gaW5kZXggW0ludGVnZXJdIHRoZSBuZXcgaW5kZXhcbiAgIyBAb3ZlcnJpZGUgdXBkYXRlQ3Vyc29yUG9zaXRpb24oY2hhcmFjdGVyKVxuICAjICAgdXBkYXRlIHRoZSBwb3NpdGlvbiBvZiBvdXIgY3Vyc29yIHRvIHRoZSBuZXcgb25lIHVzaW5nIGEgY2hhcmFjdGVyXG4gICMgICBAcGFyYW0gY2hhcmFjdGVyIFtDaGFyYWN0ZXJdIHRoZSBuZXcgY2hhcmFjdGVyXG4gIHVwZGF0ZUN1cnNvclBvc2l0aW9uIDogKG9iaikgPT4gQGxvY2tlci50cnkgKCk9PlxuICAgIGlmIHR5cGVvZiBvYmogaXMgXCJudW1iZXJcIlxuICAgICAgQHNlbGZDdXJzb3IgPSBAX21vZGVsLmdldENvbnRlbnQoXCJjaGFyYWN0ZXJzXCIpLnJlZihvYmopXG4gICAgZWxzZVxuICAgICAgQHNlbGZDdXJzb3IgPSBvYmpcblxuICAgIEBfbW9kZWwuZ2V0Q29udGVudChcImN1cnNvcnNcIikudmFsKEBfbW9kZWwuSEIuZ2V0VXNlcklkKCksIEBzZWxmQ3Vyc29yKVxuXG5cbiAgIyBkZXNjcmliZSBob3cgdG8gcHJvcGFnYXRlIHlqcyBldmVudHMgdG8gdGhlIGVkaXRvclxuICAjIFRPRE86IHNob3VsZCBiZSBwcml2YXRlIVxuICBiaW5kRXZlbnRzVG9FZGl0b3IgOiAoZWRpdG9yKSAtPlxuICAgICMgdXBkYXRlIHRoZSBlZGl0b3Igd2hlbiBzb21ldGhpbmcgb24gdGhlICRjaGFyYWN0ZXJzIGhhcHBlbnNcbiAgICBAX21vZGVsLmdldENvbnRlbnQoXCJjaGFyYWN0ZXJzXCIpLm9ic2VydmUgKGV2ZW50cykgPT4gQGxvY2tlci50cnkgKCk9PlxuICAgICAgZm9yIGV2ZW50IGluIGV2ZW50c1xuICAgICAgICBkZWx0YSA9XG4gICAgICAgICAgb3BzOiBbe3JldGFpbjogZXZlbnQucG9zaXRpb259XVxuXG4gICAgICAgIGlmIGV2ZW50LnR5cGUgaXMgXCJpbnNlcnRcIlxuICAgICAgICAgIGRlbHRhLm9wcy5wdXNoIHtpbnNlcnQ6IGV2ZW50LnZhbHVlfVxuXG4gICAgICAgIGVsc2UgaWYgZXZlbnQudHlwZSBpcyBcImRlbGV0ZVwiXG4gICAgICAgICAgZGVsdGEub3BzLnB1c2gge2RlbGV0ZTogMX1cbiAgICAgICAgICAjIGRlbGV0ZSBjdXJzb3IsIGlmIGl0IHJlZmVyZW5jZXMgdG8gdGhpcyBwb3NpdGlvblxuICAgICAgICAgIGZvciBjdXJzb3JfbmFtZSwgY3Vyc29yX3JlZiBpbiBAX21vZGVsLmdldENvbnRlbnQoXCJjdXJzb3JzXCIpLnZhbCgpXG4gICAgICAgICAgICBpZiBjdXJzb3JfcmVmIGlzIGV2ZW50LnJlZmVyZW5jZVxuICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKS0+XG4gICAgICAgICAgICAgICAgICBAX21vZGVsLmdldENvbnRlbnQoXCJjdXJzb3JzXCIpLmRlbGV0ZShjdXJzb3JfbmFtZSlcbiAgICAgICAgICAgICAgICAsIDApXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm5cblxuICAgICAgICBAZWRpdG9yLnVwZGF0ZUNvbnRlbnRzIGRlbHRhXG5cbiAgICAjIHVwZGF0ZSB0aGUgZWRpdG9yIHdoZW4gc29tZXRoaW5nIG9uIHRoZSAkc2VsZWN0aW9ucyBoYXBwZW5zXG4gICAgQF9tb2RlbC5nZXRDb250ZW50KFwic2VsZWN0aW9uc1wiKS5vYnNlcnZlIChldmVudCkgPT4gQGxvY2tlci50cnkgKCk9PlxuICAgICAgYXR0cnMgPSB7fVxuICAgICAgaWYgZXZlbnQudHlwZSBpcyBcInNlbGVjdFwiXG4gICAgICAgIGZvciBhdHRyLHZhbCBvZiBldmVudC5hdHRyc1xuICAgICAgICAgIGF0dHJzW2F0dHJdID0gdmFsXG4gICAgICBlbHNlICMgaXMgXCJ1bnNlbGVjdFwiIVxuICAgICAgICBmb3IgYXR0ciBpbiBldmVudC5hdHRyc1xuICAgICAgICAgIGF0dHJzW2F0dHJdID0gbnVsbFxuICAgICAgcmV0YWluID0gZXZlbnQuZnJvbS5nZXRQb3NpdGlvbigpXG4gICAgICBzZWxlY3Rpb25fbGVuZ3RoID0gZXZlbnQudG8uZ2V0UG9zaXRpb24oKS1ldmVudC5mcm9tLmdldFBvc2l0aW9uKCkrMVxuICAgICAgQGVkaXRvci51cGRhdGVDb250ZW50c1xuICAgICAgICBvcHM6IFtcbiAgICAgICAgICB7cmV0YWluOiByZXRhaW59LFxuICAgICAgICAgIHtyZXRhaW46IHNlbGVjdGlvbl9sZW5ndGgsIGF0dHJpYnV0ZXM6IGF0dHJzfVxuICAgICAgICBdXG5cbiAgICAjIHVwZGF0ZSB0aGUgZWRpdG9yIHdoZW4gdGhlIGN1cnNvciBpcyBtb3ZlZFxuICAgIEBfbW9kZWwuZ2V0Q29udGVudChcImN1cnNvcnNcIikub2JzZXJ2ZSAoZXZlbnRzKSA9PiBAbG9ja2VyLnRyeSAoKT0+XG4gICAgICBmb3IgZXZlbnQgaW4gZXZlbnRzXG4gICAgICAgIGlmIGV2ZW50LnR5cGUgaXMgXCJ1cGRhdGVcIiBvciBldmVudC50eXBlIGlzIFwiYWRkXCJcbiAgICAgICAgICBhdXRob3JJZCA9IGV2ZW50LmNoYW5nZWRCeVxuICAgICAgICAgIHJlZl90b19jaGFyID0gZXZlbnQub2JqZWN0LnZhbChhdXRob3JJZClcblxuICAgICAgICAgIGlmIHJlZl90b19jaGFyIGlzIG51bGxcbiAgICAgICAgICAgIHBvc2l0aW9uID0gQGVkaXRvci5nZXRMZW5ndGgoKVxuICAgICAgICAgIGVsc2UgaWYgcmVmX3RvX2NoYXI/XG4gICAgICAgICAgICBpZiByZWZfdG9fY2hhci5pc0RlbGV0ZWQoKVxuICAgICAgICAgICAgICAjXG4gICAgICAgICAgICAgICMgd2UgaGF2ZSB0byBkZWxldGUgdGhlIGN1cnNvciBpZiB0aGUgcmVmZXJlbmNlIGRvZXMgbm90IGV4aXN0IGFueW1vcmVcbiAgICAgICAgICAgICAgIyB0aGUgZG93bnNpZGUgb2YgdGhpcyBhcHByb2FjaCBpcyB0aGF0IGV2ZXJ5b25lIHdpbGwgc2VuZCB0aGlzIGRlbGV0ZSBldmVudCFcbiAgICAgICAgICAgICAgIyBpbiB0aGUgZnV0dXJlLCB3ZSBjb3VsZCByZXBsYWNlIHRoZSBjdXJzb3JzLCB3aXRoIGEgeS1zZWxlY3Rpb25zXG4gICAgICAgICAgICAgICNcbiAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCktPlxuICAgICAgICAgICAgICAgICAgZXZlbnQub2JqZWN0LmRlbGV0ZShhdXRob3JJZClcbiAgICAgICAgICAgICAgICAsIDApXG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBwb3NpdGlvbiA9IHJlZl90b19jaGFyLmdldFBvc2l0aW9uKClcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBjb25zb2xlLndhcm4gXCJyZWZfdG9fY2hhciBpcyB1bmRlZmluZWRcIlxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgYXV0aG9yX2luZm8gPSBAX21vZGVsLmdldENvbnRlbnQoJ2F1dGhvcnMnKS52YWwoYXV0aG9ySWQpXG4gICAgICAgICAgcGFyYW1zID1cbiAgICAgICAgICAgIGlkOiBhdXRob3JJZFxuICAgICAgICAgICAgaW5kZXg6IHBvc2l0aW9uXG4gICAgICAgICAgICBuYW1lOiBhdXRob3JfaW5mbz8ubmFtZSBvciBcIkRlZmF1bHQgdXNlclwiXG4gICAgICAgICAgICBjb2xvcjogYXV0aG9yX2luZm8/LmNvbG9yIG9yIFwiZ3JleVwiXG4gICAgICAgICAgQGVkaXRvci5zZXRDdXJzb3IgcGFyYW1zXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAZWRpdG9yLnJlbW92ZUN1cnNvciBldmVudC5uYW1lXG5cbiAgICBAX21vZGVsLmNvbm5lY3Rvci5vblVzZXJFdmVudCAoZXZlbnQpPT5cbiAgICAgIGlmIGV2ZW50LmFjdGlvbiBpcyBcInVzZXJMZWZ0XCJcbiAgICAgICAgQF9tb2RlbC5nZXRDb250ZW50KFwiY3Vyc29yc1wiKS5kZWxldGUoZXZlbnQudXNlcilcblxuICAgIEBfbW9kZWwuZ2V0Q29udGVudCgnYXV0aG9ycycpLm9ic2VydmUgKGV2ZW50cykgPT4gQGxvY2tlci50cnkgKCk9PlxuICAgICAgZm9yIGV2ZW50IGluIGV2ZW50c1xuICAgICAgICBAZWRpdG9yLnJlbW92ZUN1cnNvciBldmVudC5jaGFuZ2VkQnlcblxuXG5cblxuICAjIEFwcGx5IGEgZGVsdGEgYW5kIHJldHVybiB0aGUgbmV3IHBvc2l0aW9uXG4gICMgQHBhcmFtIGRlbHRhIFtPYmplY3RdIGEgKnNpbmdsZSogZGVsdGEgKHNlZSBvdC10eXBlcyBmb3IgbW9yZSBpbmZvKVxuICAjIEBwYXJhbSBwb3NpdGlvbiBbSW50ZWdlcl0gc3RhcnQgcG9zaXRpb24gZm9yIHRoZSBkZWx0YSwgZGVmYXVsdDogMFxuICAjXG4gICMgQHJldHVybiBbSW50ZWdlcl0gdGhlIHBvc2l0aW9uIG9mIHRoZSBjdXJzb3IgYWZ0ZXIgcGFyc2luZyB0aGUgZGVsdGFcbiAgZGVsdGFIZWxwZXIgPSAodGhpc09iaiwgZGVsdGEsIHBvc2l0aW9uID0gMCkgLT5cbiAgICBpZiBkZWx0YT9cbiAgICAgIHNlbGVjdGlvbnMgPSB0aGlzT2JqLl9tb2RlbC5nZXRDb250ZW50KFwic2VsZWN0aW9uc1wiKVxuICAgICAgZGVsdGFfdW5zZWxlY3Rpb25zID0gW11cbiAgICAgIGRlbHRhX3NlbGVjdGlvbnMgPSB7fVxuICAgICAgZm9yIG4sdiBvZiBkZWx0YS5hdHRyaWJ1dGVzXG4gICAgICAgIGlmIHY/XG4gICAgICAgICAgZGVsdGFfc2VsZWN0aW9uc1tuXSA9IHZcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGRlbHRhX3Vuc2VsZWN0aW9ucy5wdXNoIG5cblxuICAgICAgaWYgZGVsdGEuaW5zZXJ0P1xuICAgICAgICBpbnNlcnRfY29udGVudCA9IGRlbHRhLmluc2VydFxuICAgICAgICBjb250ZW50X2FycmF5ID1cbiAgICAgICAgICBpZiB0eXBlb2YgaW5zZXJ0X2NvbnRlbnQgaXMgXCJzdHJpbmdcIlxuICAgICAgICAgICAgaW5zZXJ0X2NvbnRlbnQuc3BsaXQoXCJcIilcbiAgICAgICAgICBlbHNlIGlmIHR5cGVvZiBpbnNlcnRfY29udGVudCBpcyBcIm51bWJlclwiXG4gICAgICAgICAgICBbaW5zZXJ0X2NvbnRlbnRdXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwiR290IGFuIHVuZXhwZWN0ZWQgdmFsdWUgaW4gZGVsdGEuaW5zZXJ0ISAoXCIgK1xuICAgICAgICAgICAgKHR5cGVvZiBjb250ZW50KSArIFwiKVwiXG4gICAgICAgIGluc2VydEhlbHBlciB0aGlzT2JqLCBwb3NpdGlvbiwgY29udGVudF9hcnJheVxuICAgICAgICBmcm9tID0gdGhpc09iai5fbW9kZWwuZ2V0Q29udGVudChcImNoYXJhY3RlcnNcIikucmVmIHBvc2l0aW9uXG4gICAgICAgIHRvID0gdGhpc09iai5fbW9kZWwuZ2V0Q29udGVudChcImNoYXJhY3RlcnNcIikucmVmKFxuICAgICAgICAgIHBvc2l0aW9uK2NvbnRlbnRfYXJyYXkubGVuZ3RoLTEpXG4gICAgICAgIHRoaXNPYmouX21vZGVsLmdldENvbnRlbnQoXCJzZWxlY3Rpb25zXCIpLnNlbGVjdChcbiAgICAgICAgICBmcm9tLCB0bywgZGVsdGFfc2VsZWN0aW9ucywgdHJ1ZSlcbiAgICAgICAgdGhpc09iai5fbW9kZWwuZ2V0Q29udGVudChcInNlbGVjdGlvbnNcIikudW5zZWxlY3QoXG4gICAgICAgICAgZnJvbSwgdG8sIGRlbHRhX3Vuc2VsZWN0aW9ucylcblxuICAgICAgICByZXR1cm4gcG9zaXRpb24gKyBjb250ZW50X2FycmF5Lmxlbmd0aFxuXG4gICAgICBlbHNlIGlmIGRlbHRhLmRlbGV0ZT9cbiAgICAgICAgZGVsZXRlSGVscGVyIHRoaXNPYmosIHBvc2l0aW9uLCBkZWx0YS5kZWxldGVcbiAgICAgICAgcmV0dXJuIHBvc2l0aW9uXG5cbiAgICAgIGVsc2UgaWYgZGVsdGEucmV0YWluP1xuICAgICAgICByZXRhaW4gPSBwYXJzZUludCBkZWx0YS5yZXRhaW5cbiAgICAgICAgZnJvbSA9IHRoaXNPYmouX21vZGVsLmdldENvbnRlbnQoXCJjaGFyYWN0ZXJzXCIpLnJlZihwb3NpdGlvbilcbiAgICAgICAgIyB3ZSBzZXQgYHBvc2l0aW9uK3JldGFpbi0xYCwgLTEgYmVjYXVzZSB3aGVuIHNlbGVjdGluZyBvbmUgY2hhcixcbiAgICAgICAgIyBZLXNlbGVjdGlvbnMgd2lsbCBvbmx5IG1hcmsgdGhpcyBvbmUgY2hhciAoYXMgYmVnaW5uaW5nIGFuZCBlbmQpXG4gICAgICAgIHRvID0gdGhpc09iai5fbW9kZWwuZ2V0Q29udGVudChcImNoYXJhY3RlcnNcIikucmVmKHBvc2l0aW9uICsgcmV0YWluIC0gMSlcblxuICAgICAgICB0aGlzT2JqLl9tb2RlbC5nZXRDb250ZW50KFwic2VsZWN0aW9uc1wiKS5zZWxlY3QoXG4gICAgICAgICAgZnJvbSwgdG8sIGRlbHRhX3NlbGVjdGlvbnMpXG4gICAgICAgIHRoaXNPYmouX21vZGVsLmdldENvbnRlbnQoXCJzZWxlY3Rpb25zXCIpLnVuc2VsZWN0KFxuICAgICAgICAgIGZyb20sIHRvLCBkZWx0YV91bnNlbGVjdGlvbnMpXG5cbiAgICAgICAgcmV0dXJuIHBvc2l0aW9uICsgcmV0YWluXG4gICAgICB0aHJvdyBuZXcgRXJyb3IgXCJUaGlzIHBhcnQgb2YgY29kZSBtdXN0IG5vdCBiZSByZWFjaGVkIVwiXG5cbiAgaW5zZXJ0SGVscGVyID0gKHRoaXNPYmosIHBvc2l0aW9uLCBjb250ZW50X2FycmF5KSAtPlxuICAgIHRoaXNPYmouX21vZGVsLmdldENvbnRlbnQoXCJjaGFyYWN0ZXJzXCIpLmluc2VydENvbnRlbnRzKFxuICAgICAgcG9zaXRpb24sIGNvbnRlbnRfYXJyYXkpXG5cbiAgZGVsZXRlSGVscGVyID0gKHRoaXNPYmosIHBvc2l0aW9uLCBsZW5ndGggPSAxKSAtPlxuICAgIHRoaXNPYmouX21vZGVsLmdldENvbnRlbnQoXCJjaGFyYWN0ZXJzXCIpLmRlbGV0ZSBwb3NpdGlvbiwgbGVuZ3RoXG5cbmlmIHdpbmRvdz9cbiAgaWYgd2luZG93Llk/XG4gICAgd2luZG93LlkuUmljaFRleHQgPSBZUmljaFRleHRcbiAgZWxzZVxuICAgIHRocm93IG5ldyBFcnJvciBcIllvdSBtdXN0IGZpcnN0IGltcG9ydCBZIVwiXG5cbmlmIG1vZHVsZT9cbiAgbW9kdWxlLmV4cG9ydHMgPSBZUmljaFRleHRcbiJdfQ==
