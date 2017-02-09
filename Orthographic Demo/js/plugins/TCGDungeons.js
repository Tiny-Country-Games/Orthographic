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
   var iconWidth = 32;
   Scene_Map.prototype.start = function() {
       _Scene_Map_start.call(this);
       this._dSprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
       this._keyIcon = ImageManager.loadSystem('IconSet');
       this.addChild(this._dSprite);
   };

   Scene_Map.prototype.update = function() {
       _Scene_Map_update.call(this);
       this._dSprite.bitmap.clear();
       if($dataMap.meta && $dataMap.meta.dTitle) {
           this._dSprite.bitmap.drawText($dataMap.meta.dTitle, 10, 10, Graphics.width, 30, "left");
       }
       if($dataMap.meta && $dataMap.meta.keys) {
         var keyNum = Number($dataMap.meta.keys);
         var keys = $gameVariables.value(keyNum);
         var sx = 195 % 16 * iconWidth;
         var sy = Math.floor(195 / 16) * iconWidth;
         this._dSprite.bitmap.blt(this._keyIcon, sx, sy, iconWidth, iconWidth, 10, 40);
         this._dSprite.bitmap.drawText(keys, 20 + iconWidth, 40, Graphics.width, 30, "left");
       }
   };

 })();
