// 1. 已知点point(x,y)和多边形Polygon（x1,y1;x2,y2;….xn,yn;）；
// 2. 以point为起点，以无穷远为终点作平行于X轴的直线line(x,y; -∞,y)；
// 3. 循环取得(for(i=0;i<n;i++))多边形的每一条边side(xi,yi;xi+1,yi+1)，且判断是否平行于X轴，如果平行continue，否则，i++；
// 4. 同时判断point(x,y)是否在side上，如果是，则返回true(点在多边形上)，否则继续下面的判断；
// 5. 判断线side与line是否有交点，如果有则count++，否则，i++。
// 6. 判断交点的总数，如果为奇数则返回true（点在多边形内），偶数则返回false（点在多边形外）。
// 打工人：柚子

export const judgePointInArea = (point, areaPositions) => {
  const INFINITY = 1e10;
  const ESP = 1e-5;
  const Max_N = 999999999;
  // 计算叉乘 |P0P1| × |P0P2|
  const Multiply = (p1, p2, p0) => {
    return ((p1.x - p0.x) * (p2.y - p0.y) - (p2.x - p0.x) * (p1.y - p0.y));
  };

  // 判断线段是否包含点point
  const IsOnline = (point, line) => {
    return ((Math.abs(Multiply(line.pt1, line.pt2, point)) < ESP)
      && ((point.x - line.pt1.x) * (point.x - line.pt2.x) <= 0)
      && ((point.y - line.pt1.y) * (point.y - line.pt2.y) <= 0));
  };

  // 判断线段相交
  const Intersect = (line1, line2) => {
    // 先判断线段某端点是否在另一条线段 x或y轴 的区间内
    // 然后根据两线段相交的充要条件：
    // 如果线段CD的两个端点C和D，
    // 与另一条线段的一个端点（A或B，只能是其中一个）连成的向量，
    // 与向量AB做叉乘，若结果异号，表示C和D分别在直线AB的两边，
    // 若结果同号，则表示CD两点都在AB的一边，则肯定不相交。
    return ((Math.max(line1.pt1.x, line1.pt2.x) >= Math.min(line2.pt1.x, line2.pt2.x))
      && (Math.max(line2.pt1.x, line2.pt2.x) >= Math.min(line1.pt1.x, line1.pt2.x))
      && (Math.max(line1.pt1.y, line1.pt2.y) >= Math.min(line2.pt1.y, line2.pt2.y))
      && (Math.max(line2.pt1.y, line2.pt2.y) >= Math.min(line1.pt1.y, line1.pt2.y))

      // 向量叉乘 异号为两点 线段两端分别在另一条线段两侧
      && (Multiply(line2.pt1, line1.pt2, line1.pt1) * Multiply(line1.pt2, line2.pt2, line1.pt1) >= 0)

      // 同理， 同时满足 向量叉乘 异号 才是线段相交的充要条件
      && (Multiply(line1.pt1, line2.pt2, line2.pt1) * Multiply(line2.pt2, line1.pt2, line2.pt1) >= 0));
  };

  // 判断点在多边形内
  const InPolygon = (point, areaPositions) => {

    // 顶点数
    const n = areaPositions.length;

    // 交点
    let count = 0;

    // 线
    let line = {
      pt1: point,
      pt2: {
        x: -INFINITY,
        y: point.y
      }
    };

    for (let index = 0; index < n; index++) {
      let side = {
        pt1: areaPositions[index],
        pt2: areaPositions[(index + 1) % n]
      };

      if (IsOnline(point, side)) {
        return true;
      }

      // 如果side平行x轴则不作考虑
      if (Math.abs(side.pt1.y - side.pt2.y) < ESP) {
        continue;
      }

      if (IsOnline(side.pt1, line)) {
        if (side.pt1.y > side.pt2.y) { count++; }
      } else if (IsOnline(side.pt2, line)) {
        if (side.pt2.y > side.pt1.y) { count++; }
      } else if (Intersect(line, side)) {
        count++;
      }
    }

    if (count % 2 == 1) {
      return true;
    } 
    return false;
    
  };

  return InPolygon(point, areaPositions);
};

export const insidePolygon = (points, testPoint) => {
  let inside = false;
  if (!testPoint) return inside;
  let x = testPoint[0]; let y = testPoint[1];
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    let xi = points[i].lng; let yi = points[i].lat;
    let xj = points[j].lng; let yj = points[j].lat;

    // (yi > y) != (yj > y) 点在上下范围内
      
    let intersect = ((yi > y) != (yj > y))
              && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) { inside = !inside; }
  }
  return inside;
};