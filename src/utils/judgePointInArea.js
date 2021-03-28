export const judgePointInArea = (point, areaPositions) => {
  const sideLengths = [];
  const areaSideLengths = [];
  const angles = [];
  areaPositions.forEach((position, index) => {
    const Ox = position.x - point.x;
    const Oy = position.y - point.y;

    // 边长
    sideLengths.push(Math.sqrt(Ox * Ox + Oy * Oy));

    // 计算区域边长
    if (index > 0 && index < areaPositions.length) {
      const pointx = position.x - areaPositions[index - 1].x;
      const pointy = position.y - areaPositions[index - 1].y;
      
      areaSideLengths.push(Math.sqrt(pointx * pointx + pointy * pointy));
    }
    if (index === areaPositions.length - 1) {
      const pointx = position.x - areaPositions[0].x;
      const pointy = position.y - areaPositions[0].y;
      
      areaSideLengths.push(Math.sqrt(pointx * pointx + pointy * pointy));
    }
  });
  sideLengths.forEach((sideLength, index) => {
    if (index < sideLengths.length - 1) {
      const COSAngle = (sideLength * sideLength + sideLengths[index + 1] * sideLengths[index + 1] - areaSideLengths[index] * areaSideLengths[index]) / (2 * sideLength * sideLengths[index + 1]);
      angles.push(Math.acos(COSAngle) * 180 / Math.PI);
    } else if (index === sideLengths.length - 1) {
      const COSAngle = (sideLength * sideLength + sideLengths[0] * sideLengths[0] - areaSideLengths[areaSideLengths.length - 1] * areaSideLengths[areaSideLengths.length - 1]) / (2 * sideLength * sideLengths[0]);
      angles.push(Math.acos(COSAngle) * 180 / Math.PI);
    }
  });
  let sum = 0;
  angles.forEach((angle) => {
    sum += angle;
  });
  return {
    sideLengths,
    areaSideLengths,
    angles
  };
};