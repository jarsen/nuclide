'use babel';
/* @flow */

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import child_process from 'child_process';
import nuclideUri from '../../nuclide-remote-uri';
import {EventEmitter} from 'events';

export type InvokeRemoteMethodParams = {
  file: string,
  method: ?string,
  args: ?Array<any>,
};

/**
 * Task creates and manages communication with another Node process. In addition
 * to executing ordinary .js files, the other Node process can also run .js files
 * under the Babel transpiler, so long as they have the `'use babel'` pragma
 * used in Atom.
 */
class _Task {
  _id: number;
  _emitter: EventEmitter;
  _child: child_process$ChildProcess;

  constructor() {
    this._id = 0;
    this._emitter = new EventEmitter();
    const options = {silent: true}; // Needed so stdout/stderr are available.
    const child = this._child = child_process
        .fork(nuclideUri.join(__dirname, '/bootstrap.js'), options);
    /*eslint-disable no-console*/
    const log = buffer => console.log(`TASK(${child.pid}): ${buffer}`);
    /*eslint-enable no-console*/
    child.stdout.on('data', log);
    child.stderr.on('data', log);
    // The Flow error on the following line is due to a bug in Flow:
    // https://github.com/facebook/flow/issues/428.
    child.on('message', response => {
      const id = response.id;
      this._emitter.emit(id, response);
    });
    child.on('error', buffer => {
      log(buffer);
      child.kill();
      this._emitter.emit('error', buffer.toString());
    });
    child.send({
      action: 'bootstrap',
      transpiler: require.resolve('../../nuclide-node-transpiler'),
    });

    const onExitCallback = () => child.kill();
    process.on('exit', onExitCallback);
    child.on('exit', () => {
      process.removeListener('exit', onExitCallback);
    });
  }

  /**
   * Invokes a remote method that is specified as an export of a .js file.
   *
   * The absolute path to the .js file must be specified via the `file`
   * property. In practice, `require.resolve()` is helpful in producing this
   * path.
   *
   * If the .js file exports an object with multiple properties (rather than a
   * single function), the name of the property (that should correspond to a
   * function to invoke) must be specified via the `method` property.
   *
   * Any arguments to pass to the function must be specified via the `args`
   * property as an Array. (This property can be omitted if there are no args.)
   *
   * Note that both the args for the remote method, as well as the return type
   * of the remote method, must be JSON-serializable. (The return type of the
   * remote method can also be a Promise that resolves to a JSON-serializable
   * object.)
   *
   * @return Promise that resolves with the result of invoking the remote
   *     method. If an error is thrown, a rejected Promise will be returned
   *     instead.
   */
  invokeRemoteMethod(params: InvokeRemoteMethodParams): Promise<any> {
    const requestId = (++this._id).toString(16);
    const request = {
      id: requestId,
      action: 'request',
      file: params.file,
      method: params.method,
      args: params.args,
    };

    return new Promise((resolve, reject) => {
      const errListener = error => {
        reject(error);
      };
      // Ensure the response listener is set up before the request is sent.
      this._emitter.once(requestId, response => {
        this._emitter.removeListener('error', errListener);
        const err = response.error;
        if (!err) {
          resolve(response.result);
        } else {
          // Need to synthesize an Error object from its JSON representation.
          const error = new Error();
          error.message = err.message;
          error.stack = err.stack;
          reject(error);
        }
      });
      this._emitter.once('error', errListener);
      this._child.send(request);
    });
  }

  onError(callback: (buffer: Buffer) => any): void {
    this._child.on('error', callback);
  }

  dispose() {
    if (this._child.connected) {
      this._child.kill();
    }
    this._emitter.removeAllListeners();
  }
}

export type Task = _Task;

export function createTask(): Task {
  return new _Task();
}
