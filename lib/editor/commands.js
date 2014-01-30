'use strict';

var go = module.exports = function (editor, callbacks) {
  
  editor.commands.addCommand({
      name: 'bold',
      bindKey: { win: 'Ctrl-B',  mac: 'Cmd-B'},
      exec: function(editor) {
        console.log('bold');
        callbacks.bold(editor);
      },
      readOnly: false
  });
  
};

