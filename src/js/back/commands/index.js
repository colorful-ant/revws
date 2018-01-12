// @flow

import { merge, prop } from 'ramda';
import type { SettingsType } from 'back/types';
import type { Command } from 'common/types';
import type { Action } from 'back/actions';
import { fixUrl } from 'common/utils/url';
//import Types from 'back/actions/types';

const commands = {
};

export default (settings: SettingsType) => {
  const api = (cmd: string, payload: any) => {
    return new Promise((resolve, reject) => {
      const success = (data) => {
        if (data.success) {
          resolve({ type: 'success', data: data.result });
        } else {
          resolve({ type: 'failed', error: data.error });
        }
      };
      const error = (xhr, error) => resolve({ type: 'failed', error });
      window.$.ajax({
        url: fixUrl(settings.api),
        type: 'POST',
        dataType: 'json',
        data: merge(payload, {
          action: 'command',
          cmd: cmd,
        }),
        success,
        error
      });
    });
  };

  return (store: any) => (next: any) => (action: Action) => {
    const res = next(action);
    const command: Command = prop(action.type, commands);
    if (command) {
      command(action, store, api);
    }
    return res;
  };
};