class GButton extends GObject {
  // 表示二维点的类
  constructor() {
    super();
    this.position = null;
    this.size = null;
    this.action = function () {};
    this.highlightcolor = GColor.red();
  }
  addAction(action) {
    this.action = action;
  }
  hasMouseIn(point) {
    var self = this;
    var x1 = self.position.x;
    var x2 = self.position.x + self.size.w;
    var y1 = self.position.y;
    var y2 = self.position.y + self.size.h;
    if (point.x > x1 && point.x < x2 && point.y > y1 && point.y < y2) {
      return true;
    }
    return false;
  }
}
