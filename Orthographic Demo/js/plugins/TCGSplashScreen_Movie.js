/*:
 *
 * @plugindesc Displays a Splash Screen before the title screen
 *
 * @author José Rodriguez-Rivas
 *
 * @param Splash Movie
 * @desc Filename of the movie, exluding extension (must be in '/movies/')
 * @default splash
 *
 * @param Skip if File Exists
 * @desc Determines whether to skip if a file exists
 * @default false
 *
 * @help
 * Plays the movie specified in the plugin parameter before going to the title screen.
 * Uses, but does not alias Scene_Boot.prototype.start
 */
(function() {

  var parameters = PluginManager.parameters('TCGSplashScreen_Movie');
  var splashMovie = String(parameters['Splash Movie']);
  var fileSkip = String(parameters['Skip if File Exists']).toLowerCase() === 'true';

  function Scene_TCG_Splash_Movie() {
    this.initialize.apply(this, arguments);
  }

  Scene_TCG_Splash_Movie.prototype = Object.create(Scene_Base.prototype);
  Scene_TCG_Splash_Movie.prototype.constructor = Scene_TCG_Splash_Movie;

  Scene_TCG_Splash_Movie.prototype.initialize = function() {
      Scene_Base.prototype.initialize.call(this);
  };

  Scene_TCG_Splash_Movie.prototype.create = function() {
      Scene_Base.prototype.create.call(this);
      this._interpreter = new Game_Interpreter();
      this._numFrames = 0;
      this._done = false;
      this._vidStarted = false;
      this.createForeground();
  };

  Scene_TCG_Splash_Movie.prototype.start = function() {
      Scene_Base.prototype.start.call(this);
      SceneManager.clearStack();
      this.startFadeIn(this.fadeSpeed(), false);
  };

  Scene_TCG_Splash_Movie.prototype.update = function() {
      Scene_Base.prototype.update.call(this);
      if(!this._vidStarted) {
        if(Graphics.isVideoPlaying()) this._vidStarted = true;
      }
      if(!Graphics.isVideoPlaying() && this._vidStarted) {
        this.gotoTitle();
      }
  };

  Scene_TCG_Splash_Movie.prototype.gotoTitle = function() {
    this._done = true;
    SceneManager.goto(Scene_Title);
  }

  Scene_TCG_Splash_Movie.prototype.terminate = function() {
      Scene_Base.prototype.terminate.call(this);
      SceneManager.snapForBackground();
  };

  Scene_TCG_Splash_Movie.prototype.createForeground = function() {
    this._splashSprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
    this.addChild(this._splashSprite);
    this.playSplashMovie();
  }

  Scene_TCG_Splash_Movie.prototype.playSplashMovie = function() {
      Graphics.playVideo('movies/' + splashMovie + this._interpreter.videoFileExt());
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
          SceneManager.goto(Scene_TCG_Splash_Movie);
        }
        Window_TitleCommand.initCommandPosition();
      }
      this.updateDocumentTitle();
  };

})();
