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

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _nuclideServiceHubPlus = require('../../../nuclide-service-hub-plus');

var _nuclideServiceHubPlus2 = _interopRequireDefault(_nuclideServiceHubPlus);

var _ReactNativeDebuggerInstance = require('./ReactNativeDebuggerInstance');

var _ReactNativeProcessInfo = require('./ReactNativeProcessInfo');

var _atom = require('atom');

var _rxjs = require('rxjs');

var _rxjs2 = _interopRequireDefault(_rxjs);

/**
 * Connects the executor to the debugger.
 */

var DebuggingActivation = (function () {
  function DebuggingActivation() {
    var _this = this;

    _classCallCheck(this, DebuggingActivation);

    this._disposables = new _atom.CompositeDisposable(atom.commands.add('atom-workspace', {
      'nuclide-react-native:start-debugging': function nuclideReactNativeStartDebugging() {
        return _this._startDebugging();
      }
    }), new _atom.Disposable(function () {
      if (_this._startDebuggingSubscription != null) {
        _this._startDebuggingSubscription.unsubscribe();
      }
    }));
  }

  _createClass(DebuggingActivation, [{
    key: 'dispose',
    value: function dispose() {
      this._disposables.dispose();
    }
  }, {
    key: '_startDebugging',
    value: function _startDebugging() {
      if (this._startDebuggingSubscription != null) {
        this._startDebuggingSubscription.unsubscribe();
      }

      // Stop any current debugger and show the debugger view.
      var workspace = atom.views.getView(atom.workspace);
      atom.commands.dispatch(workspace, 'nuclide-debugger:stop-debugging');
      atom.commands.dispatch(workspace, 'nuclide-debugger:show');

      var debuggerServiceStream = _rxjs2['default'].Observable.fromPromise(_nuclideServiceHubPlus2['default'].consumeFirstProvider('nuclide-debugger.remote'));
      var processInfoLists = _rxjs2['default'].Observable.fromPromise(getProcessInfoList());
      this._startDebuggingSubscription = debuggerServiceStream.combineLatest(processInfoLists).subscribe(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2);

        var debuggerService = _ref2[0];
        var processInfoList = _ref2[1];

        var processInfo = processInfoList[0];
        if (processInfo != null) {
          debuggerService.startDebugging(processInfo);
        }
      });
    }
  }, {
    key: 'provideNuclideDebugger',
    value: function provideNuclideDebugger() {
      return {
        name: 'React Native',
        getProcessInfoList: getProcessInfoList,
        ReactNativeDebuggerInstance: _ReactNativeDebuggerInstance.ReactNativeDebuggerInstance
      };
    }
  }]);

  return DebuggingActivation;
})();

exports.DebuggingActivation = DebuggingActivation;

function getProcessInfoList() {
  // TODO(matthewwithanm): Use project root instead of first directory.
  var currentProjectDir = atom.project.getDirectories()[0];

  // TODO: Check if it's an RN app?
  // TODO: Query packager for running RN app?

  if (currentProjectDir == null) {
    return Promise.resolve([]);
  }

  var targetUri = currentProjectDir.getPath();
  return Promise.resolve([new _ReactNativeProcessInfo.ReactNativeProcessInfo(targetUri)]);
}