'use babel';
/* @flow */

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import type {Task} from '../../../nuclide-build/lib/types';

export const SwiftPMBuildSystemBuildTask: Task = {
  type: 'build',
  label: 'Build',
  description: 'Build a Swift package',
  enabled: true,
  icon: 'tools',
};

export const SwiftPMBuildSystemTestTask: Task = {
  type: 'test',
  label: 'Test',
  description: 'Run a Swift package\'s tests',
  enabled: true,
  icon: 'checklist',
};

export const SwiftPMBuildSystemTasks: Array<Task> = [
  SwiftPMBuildSystemBuildTask,
  SwiftPMBuildSystemTestTask,
];
