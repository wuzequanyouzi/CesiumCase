import * as Cesium from 'cesium/Build/CesiumUnminified/Cesium.js';

/**
 *Creates an instance of HtmlOverlayInCesiumViewer.
  * @param {*} { element, containerId }
  * @param {*} viewer
  * @memberof HtmlOverlayInCesiumViewer
  */
class HtmlOverlayInCesiumViewer {
  constructor({ element, containerId, position }, viewer) {

    // Cesium的viewer
    this._viewer = null;

    // 覆盖物唯一标识
    this.id = element.id || `overlay-${new Date().getTime()}`;

    this.containerId = containerId;

    // 覆盖物对象 type:Domcument
    this.element = element;

    // 覆盖物位置（初始）
    this.position = position;

    // 覆盖物位置
    this.worldPosition = null;

    // 覆盖物相对原点偏移量
    this.offset = null;

    // 直角坐标系的坐标
    this.scratch = new Cesium.Cartesian2();

    // 初始化覆盖物
    this._init(element, position, viewer);
  }

  _init(element, position, viewer) {

    // 覆盖物添加到视图上
    element.style.position = 'absolute';
    const container = document.getElementById(this.containerId);
    container.appendChild(element);

    // 保存Cesium viewer
    this._viewer = viewer;

    // 设置覆盖物初始位置
    this.setPosition(position);

    // 监听viewer场景渲染前事件, 更新覆盖物位置
    this._viewer.scene.preRender.addEventListener(() => {
      console.log('重置');
      if (this.element.style.display !== 'none') {
        this.update();
      }
    });
  }

  // 获取Cesium Viewer
  getViewer() {
    return this._viewer;
  }

  // 更新覆盖物位置
  update() {
    this.setPosition(this.worldPosition);
  }

  // 设置覆盖物位置
  setPosition(position) {
    console.log(position)
    if (!position) {
      this.hide();
      return ;
    }

    // 判断viewer存在
    if (!this.getViewer()) return;

    if (position instanceof Array) {

      // 经度
      position[0] = position[0] | 0;

      // 纬度
      position[1] = position[1] | 0;

      // 高程
      position[2] = position[2] | 0;

      // Cesium空间坐标
      position = Cesium.Cartesian3.fromDegrees(...position);
    }

    console.log(position)

    // 将Cesium空间坐标转换成Canvas上的平面坐标
    const canvasPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.getViewer().scene, position);
    console.log(canvasPosition)

    if (Cesium.defined(canvasPosition)) {
      this.element.style.top = `${canvasPosition.y}px`;
      this.element.style.left = `${canvasPosition.x}px`;
      this.show();
    }

    // 保存位置坐标
    this.worldPosition = position;
  }

  // 显示覆盖物
  show() {
    this.element.style.display = 'block';
  }

  // 隐藏覆盖物
  hide() {
    this.element.style.display = 'none';
  }
}

export default HtmlOverlayInCesiumViewer;