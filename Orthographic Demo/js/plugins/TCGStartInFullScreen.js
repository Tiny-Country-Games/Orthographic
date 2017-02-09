/*:
 *
 * @plugindesc Starts game in fullscreen
 *
 * @author José Rodriguez-Rivas
 *
 * @help
 * Turn this plugin on to start your game in fullscreen mode.
 *
 */
(function() {
  var _Scene_Boot_prototype_start = Scene_Boot.prototype.start;

  Scene_Boot.prototype.start = function() {
    _Scene_Boot_prototype_start.call(this);
    Graphics._switchFullScreen();
  }

})();
