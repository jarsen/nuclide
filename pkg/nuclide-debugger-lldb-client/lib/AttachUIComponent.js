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

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _reactForAtom = require('react-for-atom');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _nuclideUiLibAtomInput = require('../../nuclide-ui/lib/AtomInput');

var _nuclideUiLibButton = require('../../nuclide-ui/lib/Button');

var AttachUIComponent = (function (_React$Component) {
  _inherits(AttachUIComponent, _React$Component);

  function AttachUIComponent(props) {
    _classCallCheck(this, AttachUIComponent);

    _get(Object.getPrototypeOf(AttachUIComponent.prototype), 'constructor', this).call(this, props);

    this._handleFilterTextChange = this._handleFilterTextChange.bind(this);
    this._handleCancelButtonClick = this._handleCancelButtonClick.bind(this);
    this._handleAttachClick = this._handleAttachClick.bind(this);
    this._updateAttachTargetList = this._updateAttachTargetList.bind(this);
    this._updateList = this._updateList.bind(this);
    this.state = {
      targetListChangeDisposable: this.props.store.onAttachTargetListChanged(this._updateList),
      attachTargetInfos: [],
      selectedAttachTarget: null,
      filterText: ''
    };
  }

  _createClass(AttachUIComponent, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.state.targetListChangeDisposable != null) {
        this.state.targetListChangeDisposable.dispose();
      }
    }
  }, {
    key: '_updateList',
    value: function _updateList() {
      this.setState({
        attachTargetInfos: this.props.store.getAttachTargetInfos()
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      var containerStyle = {
        maxHeight: '30em',
        overflow: 'auto'
      };
      var filterRegex = new RegExp(this.state.filterText, 'i');
      var children = this.state.attachTargetInfos.filter(function (item) {
        return filterRegex.test(item.name) || filterRegex.test(item.pid.toString());
      }).map(function (item, index) {
        return _reactForAtom.React.createElement(
          'tr',
          { key: index + 1,
            align: 'center',
            className: (0, _classnames2['default'])({ 'attach-selected-row': _this.state.selectedAttachTarget === item }),
            onClick: _this._handleClickTableRow.bind(_this, item),
            onDoubleClick: _this._handleDoubleClickTableRow.bind(_this, index) },
          _reactForAtom.React.createElement(
            'td',
            null,
            item.name
          ),
          _reactForAtom.React.createElement(
            'td',
            null,
            item.pid
          )
        );
      });
      // TODO: wrap into separate React components.
      return _reactForAtom.React.createElement(
        'div',
        { className: 'block' },
        _reactForAtom.React.createElement(_nuclideUiLibAtomInput.AtomInput, {
          placeholderText: 'Search...',
          initialValue: this.state.filterText,
          onDidChange: this._handleFilterTextChange,
          size: 'sm'
        }),
        _reactForAtom.React.createElement(
          'div',
          { style: containerStyle },
          _reactForAtom.React.createElement(
            'table',
            { width: '100%' },
            _reactForAtom.React.createElement(
              'thead',
              null,
              _reactForAtom.React.createElement(
                'tr',
                { key: '0', align: 'center' },
                _reactForAtom.React.createElement(
                  'td',
                  null,
                  'Name'
                ),
                _reactForAtom.React.createElement(
                  'td',
                  null,
                  'PID'
                )
              )
            ),
            _reactForAtom.React.createElement(
              'tbody',
              { align: 'center' },
              children
            )
          )
        ),
        _reactForAtom.React.createElement(
          'div',
          { className: 'padded text-right' },
          _reactForAtom.React.createElement(
            _nuclideUiLibButton.Button,
            { onClick: this._handleCancelButtonClick },
            'Cancel'
          ),
          _reactForAtom.React.createElement(
            _nuclideUiLibButton.Button,
            { onClick: this._updateAttachTargetList },
            'Refresh'
          ),
          _reactForAtom.React.createElement(
            _nuclideUiLibButton.Button,
            {
              buttonType: _nuclideUiLibButton.ButtonTypes.PRIMARY,
              onClick: this._handleAttachClick,
              disabled: this.state.selectedAttachTarget === null },
            'Attach'
          )
        )
      );
    }
  }, {
    key: '_handleFilterTextChange',
    value: function _handleFilterTextChange(text) {
      this.setState({
        filterText: text
      });
    }
  }, {
    key: '_handleClickTableRow',
    value: function _handleClickTableRow(item) {
      this.setState({
        selectedAttachTarget: item
      });
    }
  }, {
    key: '_handleDoubleClickTableRow',
    value: function _handleDoubleClickTableRow() {
      this._attachToProcess();
    }
  }, {
    key: '_handleAttachClick',
    value: function _handleAttachClick() {
      this._attachToProcess();
    }
  }, {
    key: '_handleCancelButtonClick',
    value: function _handleCancelButtonClick() {
      this.props.actions.toggleLaunchAttachDialog();
    }
  }, {
    key: '_updateAttachTargetList',
    value: function _updateAttachTargetList() {
      // Clear old list.
      this.setState({
        attachTargetInfos: [],
        selectedAttachTarget: null
      });
      // Fire and forget.
      this.props.actions.updateAttachTargetList();
    }
  }, {
    key: '_attachToProcess',
    value: function _attachToProcess() {
      var attachTarget = this.state.selectedAttachTarget;
      if (attachTarget) {
        // Fire and forget.
        this.props.actions.attachDebugger(attachTarget);
        this.props.actions.showDebuggerPanel();
        this.props.actions.toggleLaunchAttachDialog();
      }
    }
  }]);

  return AttachUIComponent;
})(_reactForAtom.React.Component);

exports.AttachUIComponent = AttachUIComponent;