var fs = require('fs');
var path = require('path');
var bw = require('remote').require('browser-window');
var rootPath = atom.packages.getLoadedPackage('dev-tools-themes').path;

module.exports = {

  config: {
    "theme":  {
      "title":    "Theme",
      "type":     "string",
      "default":  "Default",
      "enum":     ["zerodarkmatrix", "Default"]
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
  },

  activate: function() {
    var theme = atom.config.get('dev-tools-themes.theme');
    this.changeTheme(theme);
    atom.config.observe('dev-tools-themes.theme', this.changeTheme);
  },

  zerodarkmatrix: function() {
    //set config to this theme
    //set theme to this theme
  }

}
