/*:
 *
 * @plugindesc Implements a day/night cycle based on system time
 *
 * @author José Rodriguez-Rivas
 *
 * @param Tint Duration
 * @desc Duration of the transition, in frames, between times of day
 * @default 60
 *
 * @param Day Time Tint
 * @desc Numbers representing the tint of day time, separated by commas
 * @default 0,0,0,0
 *
 * @param Sunset Time Tint
 * @desc Numbers representing the tint of sunset time, separated by commas
 * @default 68,-34,-34,0
 *
 * @param Night Time Tint
 * @desc Numbers representing the tint of night time, separated by commas
 * @default -68,-68,0,68
 *
 * @param Show Time in Menu
 * @desc Determines whether or not to show the current time in the menu
 * @default true
 *
 * @help
 * Implements a day/night cycle based on system time
 *
 * Parameters:
 *  Tint Duration:
 *    Duration of the transition, in frames, between times of day
 *    Works the same as the Tint Screen Event
 *  Day Time Tint:
 *    Numbers representing the tint of day time, separated by commas
 *    The first number represents the red value,
 *    The second number represents the green value,
 *    The third number represents the blue value,
 *    The fourth number represents the grey value
 *    These values work like the Tint Screen Event
 *    Any number after the fourth will be cut off and ignored
 *    Day time starts at 6 AM and lasts through 6 PM
 *  Sunset Time Tint:
 *    Numbers representing the tint of day time, separated by commas
 *    The first number represents the red value,
 *    The second number represents the green value,
 *    The third number represents the blue value,
 *    The fourth number represents the grey value
 *    These values work like the Tint Screen Event
 *    Any number after the fourth will be cut off and ignored
 *    Sunset time is at 7 PM
 *  Night Time Tint:
 *    Numbers representing the tint of day time, separated by commas
 *    The first number represents the red value,
 *    The second number represents the green value,
 *    The third number represents the blue value,
 *    The fourth number represents the grey value
 *    These values work like the Tint Screen Event
 *    Any number after the fourth will be cut off and ignored
 *    Night time starts at 8 PM and lasts through 5 AM
 *  Show Time in Menu:
 *    Determines whether or not to show the current time in the menu
 *    The time appears above the Gold window in the menu
 *
 * Plugin Commands:
 *  startdaynight:
 *    Begins tinting screen based on time, this is off by default
 *    so this command must be called for this plugin to begin working
 *    This command has no parameters
 *  stopdaynight:
 *    Stops tinting screen based on time
 *    Parameters:
 *      Boolean whether or not to reset back to normal
 *      Tint, will use the Day tint in parameters
 *      If false, or not present, the screen will retain current tint
 *
 * Additional Inforamtion
 *  Added several boolean functions to Game_System that can be used
 *  in a script call of a conditional branch
 *    $gameSystem.isDayNight() returns true if the game is tinting based on time
 *    $gameSystem.isDay() returns true if the hour is >= 6 and < 19
 *    $gameSystem.isSunset() returns true if the hour is equal to 19
 *    $gameSystem.isNight() returns true if the hour >= 20 or < 6
 *  The current time formatted as in the time in the menu (h:m:s AM/PM) can be
 *  obtained using $gameSystem.getTimeString()
 *
 */
(function() {

  var parameters = PluginManager.parameters('TCGDayNight');

  var stringToTint = function(str) {
    var arr = str.split(',');
    var res = [];
    for(var i = 0; i < 4; i++) {
      res[i] = Number(arr[i]);
    }
    return res;
  }

  var _TINTS = [
    stringToTint(parameters['Day Time Tint']),
    stringToTint(parameters['Sunset Time Tint']),
    stringToTint(parameters['Night Time Tint']),
  ];

  var _NORMAL = 0;
  var _SUNSET = 1;
  var _NIGHT = 2;

  var _duration = Number(parameters['Tint Duration']);

  var showTimeInMenu = String(parameters['Show Time in Menu']).trim().toLowerCase() === 'true';

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

  Game_System.prototype.isDay = function() {
    var date = new Date();
    var hour = date.getHours();
    return hour >= 6 && hour < 19;
  }

  Game_System.prototype.isSunset = function() {
    var date = new Date();
    var hour = date.getHours();
    return hour === 19;
  }

  Game_System.prototype.isNight = function() {
    var date = new Date();
    var hour = date.getHours();
    return hour >= 20 || hour < 6;
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
    this._startChecked = false;
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

  Game_Screen.prototype.compareTint = function(tint) {
    for(var i = 0; i < 4; i++) {
      if(this._tone[i] !== tint[i]) return false;
    }
    return true;
  }

  Scene_Base.prototype.updateDayNight = function() {
    this._hour = this._date.getHours();
    if(!this._startChecked) {
      if(!$gameScreen.compareTint(_TINTS[this._currentTimeTint])) {
        $gameScreen.startTint(_TINTS[this._currentTimeTint], _duration);
      }
      this._startChecked = true;
    }
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
    if(showTimeInMenu) this.createTimeWindow();
  };

  Scene_Menu.prototype.createTimeWindow = function() {
    this._timeWindow = new Window_Time(0, 0);
    this._timeWindow.y = Graphics.boxHeight - this._goldWindow.height - this._timeWindow.height;
    this.addWindow(this._timeWindow);
  }

  Scene_Menu.prototype.update = function() {
    if(showTimeInMenu) this._timeWindow.refresh();
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

  Window_Time.prototype.open = function() {
      this.refresh();
      Window_Base.prototype.open.call(this);
  };

})();
