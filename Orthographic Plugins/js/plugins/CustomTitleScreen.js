/*:
 *
 * @plugindesc Allows for custom title screen
 *
 * @author José Rodriguez-Rivas
 *
 * @param Developer Name
 * @desc Will write "Created by [name] at bottom of Title Screen"
 * @default Foo Bar
 *
 * @help
 * Allows for the user to able to cusomize the title screen of their game.
 *
 */
(function() {

  var _Scene_Title_createForeground = Scene_Title.prototype.createForeground;
  var nameSprite;
  Scene_Title.prototype.createForeground = function() {
      _Scene_Title_createForeground.call(this);
  };

  Scene_Title.prototype.drawGameTitle = function() {
      var x = 20;
      var y = Graphics.height / 4;
      var maxWidth = Graphics.width - x * 2;
      var text = $dataSystem.gameTitle;
      this._gameTitleSprite.bitmap.outlineColor = 'black';
      this._gameTitleSprite.bitmap.outlineWidth = 8;
      this._gameTitleSprite.bitmap.fontSize = 72;
      this._gameTitleSprite.bitmap.drawText(text, x, y, maxWidth, 48, 'center');
  };
})();
