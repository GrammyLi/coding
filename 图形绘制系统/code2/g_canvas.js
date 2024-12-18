class GCanvas extends GObject {
  constructor(selector) {
    super();
    let canvas = _e(selector);
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    // 开启抗锯齿
    this.context.imageSmoothingEnabled = true;
    this.w = canvas.width;
    this.h = canvas.height;
    this.pixels = this.context.getImageData(0, 0, this.w, this.h);
    this.bytesPerPixel = 4;
    // this.pixelBuffer = this.pixels.data
    this.start = null;
    this.end = null;
    this.listenMouse();
    this.enableDraw = false;
    this.data = null;
    this.drawStyle = "line";
    this.penColor = GColor.black();
    this.elements = [];
  }
  render() {
    let { pixels, context } = this;
    context.putImageData(pixels, 0, 0);
  }
  clear(color = GColor.white()) {
    // 用 color 填充整个 canvas
    // 遍历每个像素点, 设置像素点的颜色
    let { w, h } = this;
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        this._setPixel(x, y, color);
      }
    }
    this.render();
  }
  _setPixel(x, y, color) {
    if (color === null) {
      // 可以选择抛出错误
      // throw new Error('Color cannot be null');
      // 或者使用默认颜色值，这里假设默认黑色
      color = GColor.black();
    }
    // color: GuaColor
    // 这个函数用来设置像素点, _ 开头表示这是一个内部函数, 这是我们的约定
    // 浮点转 int
    let int = Math.floor;
    x = int(x);
    y = int(y);
    // 用座标算像素下标
    let i = (y * this.w + x) * this.bytesPerPixel;
    // 设置像素
    let p = this.pixels.data;
    let { r, g, b, a } = color;
    // 一个像素 4 字节, 分别表示 r g b a
    p[i] = r;
    p[i + 1] = g;
    p[i + 2] = b;
    p[i + 3] = a;
  }
  drawPoint(point, color = GColor.black()) {
    // point: GPoint
    let { w, h } = this;
    let p = point;
    if (p.x >= 0 && p.x <= w) {
      if (p.y >= 0 && p.y <= h) {
        this._setPixel(p.x, p.y, color);
      }
    }
  }
  // 计算 dx 和 dy，即终点和起点在 x 和 y 方向上的差值。
  // 判断 dy 和 dx 的绝对值大小，以决定是沿 y 轴还是 x 轴进行迭代。
  // 根据较大的差值方向，逐步增加 x 或 y，并计算对应的 y 或 x 值。
  // 对于每个计算出的点，调用 this.drawPoint 方法绘制
  // Bresenham 算法：
  // 使用整数运算避免浮点计算，提高效率。
  // 通过判断误差累积来决定下一个像素点的位置。
  drawLine(p1, p2, color = GColor.black()) {
    // p1 p2 分别是起点和终点, GPoint 类型
    // color GColor
    // 使用 drawPoint 函数来画线
    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;
    if (Math.abs(dy) > Math.abs(dx)) {
      let y = p1.y;
      while (y !== p2.y) {
        let x = (dx / dy) * (y - p1.y) + p1.x;
        let point = GPoint.new(x, y);
        this.drawPoint(point, color);
        let i = dy > 0 ? 1 : -1;
        y += i;
      }
    } else {
      let x = p1.x;
      while (x !== p2.x) {
        let y = dx == 0 ? p1.y : (dy / dx) * (x - p1.x) + p1.y;
        let point = GPoint.new(x, y);
        this.drawPoint(point, color);
        let i = dx > 0 ? 1 : -1;
        x += i;
      }
    }
  }
  drawLineDDA(p1, p2, color = GColor.black()) {
    // DDA 算法实现
    // 1. 计算 dx 和 dy，即终点和起点在 x 和 y 方向上的差值。
    // 2. 确定需要绘制的步数 steps，它是 dx 和 dy 中的较大值。
    // 3. 计算每一步 x 和 y 的增量 xIncrement 和 yIncrement。
    // 4. 初始化起始点 (x, y) 为 p1。
    // 5. 在每一步中，绘制当前点，并将 x 和 y 分别增加 xIncrement 和 yIncrement。
    // 6. 使用 Math.round 确保坐标为整数，以匹配像素网格。
    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;
    let steps = Math.max(Math.abs(dx), Math.abs(dy));
    let xIncrement = dx / steps;
    let yIncrement = dy / steps;
    let x = p1.x;
    let y = p1.y;
    for (let i = 0; i <= steps; i++) {
      this.drawPoint(GPoint.new(Math.round(x), Math.round(y)), color);
      x += xIncrement;
      y += yIncrement;
    }
  }
  drawLineMidpoint(p1, p2, color = GColor.black()) {
    // 中点算法实现
    // 1. 初始化：计算 dx 和 dy。
    // 2. 初始化决策参数 d 为 dy - dx / 2。
    // 3. 设置起始点 (x, y) 为 p1。
    // 4. 在 x 方向上逐步增加。
    // 5. 根据决策参数 d 判断下一个像素点的位置：
    //    - 如果 d < 0，说明下一个点在当前行，更新 d 为 d + dy。
    //    - 否则，下一个点在下一行，更新 d 为 d + (dy - dx) 并增加 y。
    // 6. 对每个计算出的点调用 drawPoint 方法进行绘制。
    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;
    let d = dy - dx / 2;
    let x = p1.x;
    let y = p1.y;
    this.drawPoint(GPoint.new(x, y), color);
    while (x < p2.x) {
      x++;
      if (d < 0) {
        d = d + dy;
      } else {
        d = d + (dy - dx);
        y++;
      }
      this.drawPoint(GPoint.new(x, y), color);
    }
  }
  drawRect(upperLeft, size, fillColor = null, borderColor = GColor.black()) {
    // upperLeft: GPoint, 矩形左上角座标
    // size: GSize, 矩形尺寸
    // fillColor: GColor, 矩形的填充颜色, 默认为空, 表示不填充
    // borderColor: GColor, 矩形的的边框颜色, 默认为黑色
    let x = upperLeft.x;
    let y = upperLeft.y;
    let p1 = GPoint.new(x, y);
    let p2 = GPoint.new(x + size.w, y);
    let p3 = GPoint.new(x + size.w, y + size.h);
    let p4 = GPoint.new(x, y + size.h);
    this.drawLine(p1, p2, borderColor);
    this.drawLine(p2, p3, borderColor);
    this.drawLine(p3, p4, borderColor);
    this.drawLine(p4, p1, borderColor);
    for (let j = y + 1; j < p3.y; j++) {
      this.drawLine(GPoint.new(x + 1, j), GPoint.new(p2.x, j), fillColor);
    }
  }

  listenMouse() {
    let self = this;
    self.canvas.addEventListener("mousedown", function (event) {
      self.enableDraw = true;
      let x = event.offsetX;
      let y = event.offsetY;
      self.start = GPoint.new(x, y);
      self.data = new Uint8ClampedArray(self.pixels.data);
      if (self.drawStyle == "button") {
        for (let e of self.elements) {
          if (e.hasMouseIn(self.start)) {
            e.action();
            self.data = new Uint8ClampedArray(self.pixels.data);
            console.log("e", e);
            self.drawButton(e.position, e.size, e.highlightcolor);
          }
        }
      }
    });
    this.canvas.addEventListener("mousemove", function (event) {
      if (self.enableDraw == true) {
        let x = event.offsetX;
        let y = event.offsetY;
        self.end = GPoint.new(x, y);
        if (self.drawStyle == "line") {
          self.pixels.data.set(self.data);
          self.drawLine(self.start, self.end, self.penColor);
        } else if (self.drawStyle == "rect") {
          self.pixels.data.set(self.data);
          let size = GSize.new(
            self.end.x - self.start.x,
            self.end.y - self.start.y
          );
          self.drawRect(self.start, size, null, self.penColor);
        }
        self.render();
      }
    });
    this.canvas.addEventListener("mouseup", function (event) {
      self.enableDraw = false;
      let x = event.offsetX;
      let y = event.offsetY;
      self.end = GPoint.new(x, y);
      if (self.drawStyle == "button") {
        self.pixels.data.set(self.data);
        self.render();
      }
    });
  }
  drawButton(upperLeft, size, fillColor = null, borderColor = GColor.black()) {
    let self = this;
    self.drawRect(upperLeft, size, fillColor, borderColor);
    self.render();
  }
  addElement(element) {
    let self = this;
    self.drawButton(element.position, element.size);
    self.elements.push(element);
  }
  __debug_draw_demo() {
    // 这是一个 demo 函数, 用来给你看看如何设置像素
    // ES6 新语法, 取出想要的属性并赋值给变量, 不懂自己搜「ES6 新语法」
    let { context, pixels } = this;
    // 获取像素数据, data 是一个数组
    let data = pixels.data;
    // 一个像素 4 字节, 分别表示 r g b a
    for (let i = 0; i < data.length; i += 4) {
      let [r, g, b, a] = data.slice(i, i + 4);
      r = 255;
      a = 255;
      data[i] = r;
      data[i + 3] = a;
    }
    context.putImageData(pixels, 0, 0);
  }
}
