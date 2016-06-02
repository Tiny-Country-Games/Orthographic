/*:
 *
 * @plugindesc Displays a Splash Screen before the title screen
 *
 * @author José Rodriguez-Rivas
 *
 * @param Splash Text
 * @desc Text to be drawn in the splash screen.
 * @default Lorem Ipsum Presents
 *
 * @param Splash length
 * @desc Amount of time, in seconds, that the splash screen will last
 * @default 5
 *
 * @param Skip if File Exists
 * @desc Determines whether to skip if a file exists
 * @default false
 *
 * @help
 * Displays the text provided in the plugin parameter before going to the title screen.
 * Uses, but does not alias Scene_Boot.prototype.start
 */
(function() {

  var parameters = PluginManager.parameters('TCGSplashScreen');
  var splashText = String(parameters['Splash Text']);
  var numSeconds = Number(parameters['Splash length']);
  var fileSkip = String(parameters['Skip if File Exists']).toLowerCase() === 'true';

  function Scene_TCG_Splash() {
    this.initialize.apply(this, arguments);
  }

  Scene_TCG_Splash.prototype = Object.create(Scene_Base.prototype);
  Scene_TCG_Splash.prototype.constructor = Scene_TCG_Splash;

  Scene_TCG_Splash.prototype.initialize = function() {
      Scene_Base.prototype.initialize.call(this);
  };

  Scene_TCG_Splash.prototype.create = function() {
      Scene_Base.prototype.create.call(this);
      this.createForeground();
      this._numFrames = 0;
      this._done = false;
  };

  Scene_TCG_Splash.prototype.start = function() {
      Scene_Base.prototype.start.call(this);
      SceneManager.clearStack();
      this.startFadeIn(this.fadeSpeed(), false);
  };

  Scene_TCG_Splash.prototype.update = function() {
      Scene_Base.prototype.update.call(this);
      if(!this._done) {
        if(TouchInput.isTriggered() || Input.isTriggered('ok') || Input.isTriggered('escape')) {
          this.gotoTitle();
        }
      }
      if(!this._done) {
        this._numFrames++;
        if(this._numFrames % 60 == 0 && (this._numFrames / 60 == numSeconds)) {
          this.gotoTitle();
        }
      }
  };

  Scene_TCG_Splash.prototype.gotoTitle = function() {
    this.fadeOutAll();
    this._done = true;
    SceneManager.goto(Scene_Title);
  }

  Scene_TCG_Splash.prototype.terminate = function() {
      Scene_Base.prototype.terminate.call(this);
      SceneManager.snapForBackground();
  };

  Scene_TCG_Splash.prototype.createForeground = function() {
    this._splashSprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
    this.addChild(this._splashSprite);
    this.drawSplashText();
  }

  Scene_TCG_Splash.prototype.drawSplashText = function() {
      var x = 20;
      var y = Graphics.height / 2.45;
      var maxWidth = Graphics.width - x * 2;
      var text = splashText;
      this._splashSprite.bitmap.outlineColor = 'black';
      this._splashSprite.bitmap.outlineWidth = 8;
      this._splashSprite.bitmap.fontSize = 72;
      this._splashSprite.bitmap.drawText(text, x, y, maxWidth, 48, 'center');
  }

  Scene_Boot.prototype.start = function() {
      Scene_Base.prototype.start.call(this);
      SoundManager.preloadImportantSounds();
      if (DataManager.isBattleTest()) {
          DataManager.setupBattleTest();
          SceneManager.goto(Scene_Battle);
      } else if (DataManager.isEventTest()) {
          DataManager.setupEventTest();
          SceneManager.goto(Scene_Map);
      } else {
        this.checkPlayerLocation();
        DataManager.setupNewGame();
        if(fileSkip && DataManager.isAnySavefileExists()) {
          SceneManager.goto(Scene_Title);
        } else {
          SceneManager.goto(Scene_TCG_Splash);
        }
        Window_TitleCommand.initCommandPosition();
      }
      this.updateDocumentTitle();
  };

})();
