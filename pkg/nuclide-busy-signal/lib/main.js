Object.defineProperty(exports, '__esModule', {
  value: true
});

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.activate = activate;
exports.consumeStatusBar = consumeStatusBar;
exports.consumeBusySignalProvider = consumeBusySignalProvider;
exports.deactivate = deactivate;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _MessageStore = require('./MessageStore');

var _BusySignalProviderBase = require('./BusySignalProviderBase');

var _DedupedBusySignalProviderBase = require('./DedupedBusySignalProviderBase');

exports.BusySignalProviderBase = _BusySignalProviderBase.BusySignalProviderBase;
exports.DedupedBusySignalProviderBase = _DedupedBusySignalProviderBase.DedupedBusySignalProviderBase;

var _types = require('./types');

Object.defineProperty(exports, 'BusySignalMessage', {
  enumerable: true,
  get: function get() {
    return _types.BusySignalMessage;
  }
});
Object.defineProperty(exports, 'BusySignalMessageBusy', {
  enumerable: true,
  get: function get() {
    return _types.BusySignalMessageBusy;
  }
});
Object.defineProperty(exports, 'BusySignalMessageDone', {
  enumerable: true,
  get: function get() {
    return _types.BusySignalMessageDone;
  }
});
Object.defineProperty(exports, 'BusySignalProvider', {
  enumerable: true,
  get: function get() {
    return _types.BusySignalProvider;
  }
});

var Activation = (function () {
  function Activation() {
    _classCallCheck(this, Activation);

    this._disposables = new _atom.CompositeDisposable();
    this._messageStore = new _MessageStore.MessageStore();
  }

  _createClass(Activation, [{
    key: 'dispose',
    value: function dispose() {
      this._disposables.dispose();
    }
  }, {
    key: 'consumeStatusBar',
    value: function consumeStatusBar(statusBar) {
      var _this = this;

      var _require = require('./StatusBarTile');

      var StatusBarTile = _require.StatusBarTile;

      var statusBarTile = this._statusBarTile = new StatusBarTile();
      statusBarTile.consumeMessageStream(this._messageStore.getMessageStream());
      var disposable = new _atom.Disposable(function () {
        if (_this._statusBarTile) {
          _this._statusBarTile.dispose();
          _this._statusBarTile = null;
        }
      });
      statusBarTile.consumeStatusBar(statusBar);
      this._disposables.add(disposable);
      return disposable;
    }
  }, {
    key: 'consumeBusySignalProvider',
    value: function consumeBusySignalProvider(provider) {
      var disposable = this._messageStore.consumeProvider(provider);
      this._disposables.add(disposable);
      return disposable;
    }
  }]);

  return Activation;
})();

var activation = null;

function activate(state) {
  deactivate();
  activation = new Activation();
}

function consumeStatusBar(statusBar) {
  (0, _assert2['default'])(activation);
  return activation.consumeStatusBar(statusBar);
}

function consumeBusySignalProvider(provider) {
  (0, _assert2['default'])(activation);
  return activation.consumeBusySignalProvider(provider);
}

function deactivate() {
  if (activation) {
    activation.dispose();
    activation = null;
  }
}