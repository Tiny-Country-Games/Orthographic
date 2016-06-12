/*:
 *
 * @plugindesc Implements a day/night cycle based on system time
 *
 * @author José Rodriguez-Rivas
 *
 * @help
 * Implements a day/night cycle based on system time
 *
 */
(function() {
  var _TINTS = [
    [0, 0, 0, 0],
    [68, -34, -34, 0],
    [-68, -68, 0, 68]
  ];

  var _NORMAL = 0;
  var _SUNSET = 1;
  var _NIGHT = 2;

  var _duration = 60;

  var _Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function() {
    _Game_System_initialize.call(this);
    this._daynight = false;
    this._timeString = '';
  };

  Game_System.prototype.setTimeString = function(date) {
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    var ampm = '';
    if(h === 0) {
      ampm = 'AM';
      h = 12;
    } else if(h < 12) {
      ampm = 'AM';
    } else {
      ampm = 'PM';
      if(h != 12) h -= 12;
    }
    if(m < 10) {
      m = '0' + m;
    }
    if(s < 10) {
      s = '0' + s;
    }
    this._timeString = h + ':' + m + ':' + s + ' ' + ampm;
  }

  Game_System.prototype.getTimeString = function() {
    return this._timeString;
  }

  Game_System.prototype.setDayNight = function(daynight) {
    this._daynight = daynight;
  }

  Game_System.prototype.isDayNight = function() {
    return this._daynight;
  }

  var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this);
    if(command.trim().toLowerCase() === 'startdaynight') $gameSystem.setDayNight(true);
    if(command.trim().toLowerCase() === 'stopdaynight') {
      var setToNormal = false;
      if(args[0]) {
        setToNormal = args[0].trim().toLowerCase() === 'true';
      }
      $gameSystem.setDayNight(false);
      if(setToNormal) $gameScreen.startTint(_TINTS[_NORMAL], _duration);
    }
	};

  var _Scene_Base_initialize = Scene_Base.prototype.initialize;
  Scene_Base.prototype.initialize = function() {
    _Scene_Base_initialize.call(this);
    this._currentTimeTint = _NORMAL;
    this._previousTimeTint = _NORMAL;
  };

  var _Scene_Base_update = Scene_Base.prototype.update;
  Scene_Base.prototype.update = function() {
    _Scene_Base_update.call(this);
    this._date = new Date();
    $gameSystem.setTimeString(this._date);
    if($gameSystem.isDayNight()) {
      this.updateDayNight();
    } else {
      this._currentTimeTint = _NORMAL;
      this._previousTimeTint = _NORMAL;
    }
  };

  Scene_Base.prototype.updateDayNight = function() {
    this._hour = this._date.getHours();
    if(this._hour >= 20 || this._hour < 6) {
      this._currentTimeTint = _NIGHT;
    } else if(this._hour === 19) {
      this._currentTimeTint = _SUNSET;
    } else {
      this._currentTimeTint = _NORMAL;
    }
    this._changeTint = this._previousTimeTint != this._currentTimeTint;
    if(this._changeTint) {
      $gameScreen.startTint(_TINTS[this._currentTimeTint], _duration);
    }
    this._previousTimeTint = this._currentTimeTint;
  }

  var _Scene_Menu_create = Scene_Menu.prototype.create;
  Scene_Menu.prototype.create = function() {
    _Scene_Menu_create.call(this);
    this.createTimeWindow();
  };

  Scene_Menu.prototype.createTimeWindow = function() {
    this._timeWindow = new Window_Time(0, 0);
    this._timeWindow.y = Graphics.boxHeight - this._goldWindow.height - this._timeWindow.height;
    this.addWindow(this._timeWindow);
  }

  Scene_Menu.prototype.update = function() {
    this._timeWindow.refresh();
    Scene_Base.prototype.update.call(this);
  }

  function Window_Time() {
      this.initialize.apply(this, arguments);
  }

  Window_Time.prototype = Object.create(Window_Base.prototype);
  Window_Time.prototype.constructor = Window_Time;

  Window_Time.prototype.initialize = function(x, y) {
      var width = this.windowWidth();
      var height = this.windowHeight();
      Window_Base.prototype.initialize.call(this, x, y, width, height);
      this.refresh();
  };

  Window_Time.prototype.windowWidth = function() {
      return 240;
  };

  Window_Time.prototype.windowHeight = function() {
      return this.fittingHeight(1);
  };

  Window_Time.prototype.refresh = function() {
    var width = this.contents.width - this.textPadding() * 2;
    var x = this.windowWidth() - width - this.textPadding();
    this.contents.clear();
    this.drawText($gameSystem.getTimeString(), x, 0);
  };

  Window_Time.prototype.value = function() {
      return $gameParty.gold();
  };

  Window_Time.prototype.open = function() {
      this.refresh();
      Window_Base.prototype.open.call(this);
  };

})();
