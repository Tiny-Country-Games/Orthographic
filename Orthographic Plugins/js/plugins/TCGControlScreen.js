/*:
 *
 * @plugindesc Creates a screen where all the controls of the game are displayed.
 *
 * @author José Rodriguez-Rivas
 *
 * @help
 * Creates a screen where all the controls of the game are displayed.
 * The screen can be accessed from the Title Screen or the Menu Screen
 *
 */
 (function() {

   function Window_TCG_Controls() {
     this.initialize.apply(this, arguments);
   }

   Window_TCG_Controls.prototype = Object.create(Window_Base.prototype);
   Window_TCG_Controls.prototype.constructor = Window_TCG_Controls;

   Window_TCG_Controls.prototype.initialize = function(x, y) {
     var width = this.windowWidth();
     var height = this.windowHeight();
     Window_Base.prototype.initialize.call(this, x, y, width, height);
     this.refresh();
   };

   Window_TCG_Controls.prototype.windowWidth = function() {
     return Graphics.width;
   };

   Window_TCG_Controls.prototype.windowHeight = function() {
     return Graphics.height;
   };

   Window_TCG_Controls.prototype.refresh = function() {
     var x = this.textPadding();
     var width = this.contents.width - this.textPadding() * 2;
     this.contents.clear();
     var col1 = '\x1bC[10]Controls\x1bC[0]\n\nMovement\n\n\nAction\n\n\nCancel\n\n\nMenu\n\n\nDash';
     var col2 = 'Game Pad\n\nD-pad\n\n\nA\n\n\nB\n\n\nY\n\n\nX';
     var col3 = 'Keyboard\n\nArrow keys,\nNum Pad\n\nZ, Enter\nSpace\n\nX, Escape,\nNum pad 0\n\nX, Escape,\nNum pad 0\n\nShift';
     var col4 = 'Mouse/Touch\n\nClick/Tap\nDesitination\n\nClick/Tap Target\n\n\nRight Click,\nTap with two fingers\n\nRight Click,\nTap with two fingers';
     this.drawTextEx(col1, 10, 10);
     this.drawTextEx(col2, 175, 10);
     this.drawTextEx(col3, 350, 10);
     this.drawTextEx(col4, 520, 10);
   };

   Window_TCG_Controls.prototype.open = function() {
     this.refresh();
     Window_Base.prototype.open.call(this);
   };

   function Scene_TCG_Controls() {
     this.initialize.apply(this, arguments);
   }

   Scene_TCG_Controls.prototype = Object.create(Scene_MenuBase.prototype);
   Scene_TCG_Controls.prototype.constructor = Scene_TCG_Controls;

   Scene_TCG_Controls.prototype.initialize = function() {
     Scene_MenuBase.prototype.initialize.call(this);
   };

   Scene_TCG_Controls.prototype.create = function() {
     Scene_MenuBase.prototype.create.call(this);
     this.createControlsWindow();
   };

   Scene_TCG_Controls.prototype.start = function() {
     Scene_MenuBase.prototype.start.call(this);
   };

   Scene_TCG_Controls.prototype.update = function() {
     Scene_MenuBase.prototype.update.call(this);
     if(TouchInput.isCancelled() || Input.isTriggered('cancel')) {
       SoundManager.playCancel();
       this.popScene();
       this._controlsWindow.hide();
     }
   };

   Scene_TCG_Controls.prototype.terminate = function() {
     Scene_MenuBase.prototype.terminate.call(this);
     SceneManager.snapForBackground();
   };

   Scene_TCG_Controls.prototype.createControlsWindow = function() {
     this._controlsWindow = new Window_TCG_Controls(0, 0);
     this.addWindow(this._controlsWindow);
   }

   //-----------------------------------------------------------------
   // Overridden code
   //-----------------------------------------------------------------

   var _Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
   var _Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
   var _Window_MenuCommand_makeCommandList = Window_MenuCommand.prototype.makeCommandList;
   var _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;

   Window_TitleCommand.prototype.makeCommandList = function() {
     _Window_TitleCommand_makeCommandList.call(this);
     this.addCommand('Controls', 'controls');
   };

   Scene_Title.prototype.createCommandWindow = function() {
     _Scene_Title_createCommandWindow.call(this);
     this._commandWindow.setHandler('controls', this.commandControls.bind(this));
   };

   Scene_Title.prototype.commandControls = function() {
     this._commandWindow.close();
     SceneManager.push(Scene_TCG_Controls);
   }

   Window_MenuCommand.prototype.makeCommandList = function() {
     _Window_MenuCommand_makeCommandList.call(this);
     this.addCommand('Controls', 'controls');
   };

   Scene_Menu.prototype.createCommandWindow = function() {
     _Scene_Menu_createCommandWindow.call(this);
     this._commandWindow.setHandler('controls', this.commandControls.bind(this));
   };

   Scene_Menu.prototype.commandControls = function() {
     this._commandWindow.close();
     SceneManager.push(Scene_TCG_Controls);
   }

 })();
