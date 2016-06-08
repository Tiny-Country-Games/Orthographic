/*:
 *
 * @plugindesc Allows for custom title screen
 *
 * @author José Rodriguez-Rivas
 *
 * @param Credit at Bottom
 * @desc Set to "true" to draw the credit at the bottom of the title screen
 * @default true
 *
 *
 * @param Prefix Credit
 * @desc Text drawn before name in credit.
 * @default Created By
 *
 *
 * @param Developer Name
 * @desc Will write "[Prefix] [name]" at bottom of Title Screen
 * @default Foo Bar
 *
 * @help
 * Allows for the user to able to customize the title screen of their game.
 *
 */
(function() {

  var _Scene_Title_createForeground = Scene_Title.prototype.createForeground;
  var parameters = PluginManager.parameters("TCGCustomTitleScreen");
  var devName = String(parameters["Developer Name"]);
  var credPre = String(parameters["Prefix Credit"]);
  var drawCredit = String(parameters["Credit at Bottom"]) == "true";

  Scene_Title.prototype.createForeground = function() {
      _Scene_Title_createForeground.call(this);
      this._devNameSprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
      this.addChild(this._devNameSprite);
      if(drawCredit) {
        this.drawDeveloperName();
      }
  };

  Scene_Title.prototype.drawDeveloperName = function() {
    var x = 6;
    var y = Graphics.height - 28;
    var maxWidth = Graphics.width - x * 2;
    var text = credPre + " " + devName;
    this._devNameSprite.bitmap.fontSize = 30;
    this._devNameSprite.bitmap.drawText(text, x, y, maxWidth, 12, 'left');
  };
})();
