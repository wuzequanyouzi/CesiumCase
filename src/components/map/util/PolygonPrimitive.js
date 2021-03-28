import {
  Color,
  CallbackProperty,
  PolygonHierarchy,
} from 'cesium/Build/Cesium/Cesium';
export default class PolygonPrimitive {
  constructor(viewer, positions, id) {
    // 原始点位
    this.positions = positions;

    // 多边形数据
    this.options = {
      id,
      name: '多边形',
      polyline: {
        positions: this.positions,
        width: 4,
        material: Color.YELLOW.withAlpha(0.5),
        clampToGround: true
      },
      polygon: {
        hierarchy: [],
        perPositionHeight: false,
        material: Color.RED.withAlpha(0.4),
        outlineColor: Color.YELLOW,
        outlineWidth: 2
      },
      properties: {
        poiType: 'polygonArea',
        position: positions
      }
    };

    // 点位信息 cesium的PolygonHierarchy类型
    this.hierarchy = positions;

    // 存储3D地图视图
    this.viewer = viewer;
    this._init();
  }

  // 初始化
  _init() {
    // 实时更新polygon.hierarchy
    this.options.polygon.hierarchy = new CallbackProperty(this._updatePolygonHierarchy.bind(this), false);
    this.options.polyline.positions = new CallbackProperty(this._updatePolylinePositions.bind(this), false);
    this.viewer.entities.add(this.options);
  }

  _updatePolygonHierarchy() {
    return new PolygonHierarchy(this.positions);
  }

  _updatePolylinePositions() {
    return [...this.positions, this.positions[0]];
  }
}