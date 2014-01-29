'use strict';

var go = module.exports = function (editor) {
  editor.commands.addCommand({
      name: 'refresh',
      bindKey: { win: 'Ctrl-M',  mac: 'Option-M'},
      exec: function(editor) {
        console.log('executing');
        editor.setValue('Line1\nLine2\nLine3\n\nhello why');
      },
      readOnly: true // false if this command should not apply in readOnly mode
  });
};

