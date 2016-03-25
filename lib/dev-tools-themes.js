var fs = require('fs');
var path = require('path');
var bw = require('remote').require('browser-window');
var rootPath = '';

module.exports = {

  config: {
    "theme":  {
      "title":    "Theme",
      "type":     "string",
      "default":  "Default",
      "enum":     ["zerodarkmatrix", "Default"]
    },
    "display-help": {
      "title":        "Show Help Message on Theme Change",
      "description":  "[Untick me when you have manually enabled 'Allow custom UI themes'](https://github.com/travs/dev-tools-themes/blob/master/ui-instructions.md)",
      "type":         "boolean",
      "default":      "true"
    }
  },

  currentTheme: "",

  changeTheme: function (theme) {
    if(theme.toLowerCase() === 'default'){
      bw.removeDevToolsExtension(this.currentTheme);
      this.currentTheme = 'Default';
      var window = bw.getAllWindows()[0];
      if(window.isDevToolsOpened()){  // must reopen to enable default theme
        window.closeDevTools();
        window.openDevTools();
      }
    }
    else{
      var themePath = path.join(rootPath, 'themes', theme);
      bw.addDevToolsExtension(themePath);
      var manifest = fs.readFileSync(path.join(themePath, 'manifest.json'));
      this.currentTheme = JSON.parse(manifest).name;
    }

    if(atom.config.get('dev-tools-themes.display-help')){
      atom.notifications
        .addWarning('dev-tools-themes: Be sure you have [enabled custom UI.](https://github.com/travs/dev-tools-themes/blob/master/ui-instructions.md)',
          {
            detail: 'When custom UI is enabled, you can disable this message in \nthis package\'s settings.',
            dismissable:  true,
            icon: 'gear'
          }
        );
    }
  },

  activate: function() {
    rootPath = atom.packages.getLoadedPackage('dev-tools-themes').path;
    var theme = atom.config.get('dev-tools-themes.theme');
    this.changeTheme(theme);
    atom.config.observe('dev-tools-themes.theme', this.changeTheme);
    atom.commands.add('atom-workspace', 'dev-tools-themes:settings', this.settingsView);
  },

  settingsView: function() {
    atom.workspace.open('atom://config/packages/dev-tools-themes');
  }

}
