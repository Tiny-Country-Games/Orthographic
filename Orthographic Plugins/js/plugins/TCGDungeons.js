/*:
 *
 * @plugindesc Displays Dungeon information in a dungeon
 *
 * @author José Rodriguez-Rivas
 *
 * @help
 * Displays Dungeon information in a dungeon
 *
 */
 (function() {
   var _Scene_Map_start = Scene_Map.prototype.start;
   var _Scene_Map_update = Scene_Map.prototype.update;
   Scene_Map.prototype.start = function() {
       _Scene_Map_start.call(this);
       this._dSprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
       this.addChild(this._dSprite);
   };

   Scene_Map.prototype.update = function() {
       _Scene_Map_update.call(this);
       this._dSprite.bitmap.clear();
       if($dataMap.meta.dTitle) {
           this._dSprite.bitmap.drawText($dataMap.meta.dTitle, 10, 10, Graphics.width, 30, "left");
       }
       if($dataMap.meta.keys) {
         var keyNum = Number($dataMap.meta.keys);
         var keys = $gameVariables.value(keyNum);
         this._dSprite.bitmap.drawText("Keys: " + keys, 10, 40, Graphics.width, 30, "left");
       }
   };

 })();
