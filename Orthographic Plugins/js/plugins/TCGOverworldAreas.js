/*:
 *
 * @plugindesc Allows For Areas with different names and music in a map
 *
 * @author José Rodriguez-Rivas
 *
 * @help
 * Allows For Areas with different names and music in a map
 *
 * ========================================================
 *                     How To Use
 * ========================================================
 * Areas in the overworld are defined in the notes section
 * of the map's properties. Each area has a top ordered pair,
 * a bottom ordered pair, a name, and music.
 *
 * Each area is declared in the <Area> notetag. The syntax
 * for the notetag is as folows:
 *
 *    <Area:topX,topY,bottomX,bottomY,areaname,areabgm>
 *
 * An overworld can as many areas as needed.
 *
 * This plugin overrides, but does not alias, Window_MapName.prototype.refresh.
 *
 */
 (function() {

  var _Window_MapName_initialize = Window_MapName.prototype.initialize;
  Window_MapName.prototype.initialize = function() {
     _Window_MapName_initialize.call(this);
     this._custom_name = false;
  };

  var _Window_MapName_close = Window_MapName.prototype.close;
  Window_MapName.prototype.close = function() {
     _Window_MapName_close.call(this);
     this._custom_name = false;
  };

  Window_MapName.prototype.setCustomName = function(name) {
    this._custom_name = name;
  }

  Window_MapName.prototype.resetMapNameWindow = function() {
    this.opacity = 0;
    this.contentsOpacity = 0;
  }

  Window_MapName.prototype.refresh = function() {
      this.contents.clear();
      if ($gameMap.displayName() || this._custom_name) {
          var width = this.contentsWidth();
          this.drawBackground(0, 0, width, this.lineHeight());
          if(this._custom_name) {
            this.drawText(this._custom_name, 0, 0, width, 'center');
          } else {
            this.drawText($gameMap.displayName(), 0, 0, width, 'center');
          }
      }
  };

  var _Scene_Map_initialize = Scene_Map.prototype.initialize;
  Scene_Map.prototype.initialize = function() {
    _Scene_Map_initialize.call(this);
    this._areas = [];
  };

  function TCGArea(topX, topY, bottomX, bottomY, areaname, bgm) {
    this.topX = Number(topX);
    this.topY = Number(topY);
    this.bottomX = Number(bottomX);
    this.bottomY = Number(bottomY);
    this.areaname = String(areaname);
    this.bgm = String(bgm);
  }

  var _Scene_Map_start = Scene_Map.prototype.start;
  Scene_Map.prototype.start = function() {
      _Scene_Map_start.call(this);
      this._p_player_x = SceneManager.isPreviousScene(Scene_Menu) || SceneManager.isPreviousScene(Scene_Battle) ? $gamePlayer.x : -1;
      this._p_player_y = SceneManager.isPreviousScene(Scene_Menu) || SceneManager.isPreviousScene(Scene_Battle) ? $gamePlayer.y : -1;
      console.log(this._p_player_x + ", " + this._p_player_y);
      if($dataMap.note) {
        var arearegex = /(<Area:.*>)/ig;
        var areaMatch = $dataMap.note.match(arearegex);
        if(areaMatch) {
          for(var i = 0; i < areaMatch.length; i++) {
            var regex = /<Area:(\d+),(\d+),(\d+),(\d+),(.+),(.+)>/i;
            var match = areaMatch[i].match(regex);
            this._areas.push(new TCGArea(match[1], match[2], match[3], match[4], match[5], match[6]));
          }
        }
      }
  };

  Scene_Map.prototype.openCustomMapName = function(customName) {
    this._mapNameWindow.setCustomName(customName);
    this._mapNameWindow.resetMapNameWindow();
    this._mapNameWindow.open();
  }

  function numBetween(num, min, max) {
    return num >= min && num <= max;
  }

  var _Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function() {
    _Scene_Map_update.call(this);
    for(var i = 0; i < this._areas.length; i++) {
      if((numBetween($gamePlayer.x, this._areas[i].topX, this._areas[i].bottomX) && numBetween($gamePlayer.y, this._areas[i].topY, this._areas[i].bottomY))
      &&(!numBetween(this._p_player_x, this._areas[i].topX, this._areas[i].bottomX) || !numBetween(this._p_player_y, this._areas[i].topY, this._areas[i].bottomY))) {
        this.openCustomMapName(this._areas[i].areaname);
        AudioManager.playBgm({ name: this._areas[i].bgm, pan: 0, pitch: 100, volume: 100 });
      } else {
        if((!numBetween($gamePlayer.x, this._areas[i].topX, this._areas[i].bottomX) || !numBetween($gamePlayer.y, this._areas[i].topY, this._areas[i].bottomY))
        &&(numBetween(this._p_player_x, this._areas[i].topX, this._areas[i].bottomX) && numBetween(this._p_player_y, this._areas[i].topY, this._areas[i].bottomY))) {
          AudioManager.playBgm($dataMap.bgm);
        }
      }
    }
    this._p_player_x = $gamePlayer.x;
    this._p_player_y = $gamePlayer.y;
  };

})();
