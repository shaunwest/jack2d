/**
 * Created by Shaun on 7/2/14.
 */

jack2d('ActionObject', ['obj', 'input', 'helper', 'PropChecker'], function(Obj, Input, Helper, PropChecker) {
  'use strict';

  function onInputUpdate(context, keyActions) {
    var i, numKeyActions, inputs, keyAction,
      keys = false;

    inputs = Input.getInputs();

    for(i = 0, numKeyActions = keyActions.length; i < numKeyActions; i++) {
      keyAction = keyActions[i];
      if(keyAction.key) {
        if(inputs[keyAction.key]) {
          if(keyAction.callback) {
            keyAction.callback(inputs[keyAction.key]);
          }
          context[keyAction.id] = true;
          keys = true;
        } else {
          context[keyAction.id] = false;
        }
      } else if(keyAction.callback) {
        keyAction.callback(inputs);
      }

      if(inputs.interact &&
        inputs.interact.target === keyAction.element &&
        keyAction.callback) {
        keyAction.callback(inputs.interact);
      }
    }

    context.idle = !keys;
  }

  return Obj.mixin(['chronoObject', {
    startActions: function() {
      this.keyActions = [];
      this.allowActions = true;
      this.onFrame(function() {
        if(!this.allowActions) {
          return;
        }
        this.inputs = Input.getInputs();
        this.inputsEnded = Input.getInputsEnded();
        this.inputSequence = Input.getSequence();
        onInputUpdate(this, this.keyActions);
      }, 'ActionObject');

      return this;
    },
    action: function(actionId, actionConfigOrCallback, callback) {
      if(Helper.isFunction(actionConfigOrCallback)) {
        callback = actionConfigOrCallback;
        actionConfigOrCallback = {};
      }
      this.keyActions.push({
        id: actionId,
        key: actionConfigOrCallback.key,
        element: actionConfigOrCallback.element,
        callback: (callback) ? callback.bind(this) : null
      });
      return this;
    }
  }]);
});
