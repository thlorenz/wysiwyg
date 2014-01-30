'use strict';

var go = module.exports = function (editor, ee) {
  
  editor.commands.addCommand({
      name: 'bold',
      bindKey: { win: 'Ctrl-B',  mac: 'Cmd-B'},
      exec: function(editor, arg) {
        ee.emit('bold', arg);
      },
      readOnly: false
  });
};

