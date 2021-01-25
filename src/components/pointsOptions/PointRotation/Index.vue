<template>
  <div class="main">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
import * as Cesium from 'cesium';
import ponitIcon from '../../../assets/tollgate_selected.png';
import HtmlOverlayInCesiumViewer from './util/loadHtmlToCesiumViewer.js';
export default {
  name: 'PointClusterer',
  data() {
    return {
    }
  },
  mounted() {
    window.map = this;
    this.initCesium();
    this.addBillboard();
    this.addHtmlOverlay();
  },
  methods: {
    initCesium() {
      const that = this;
      this.viewer = new Cesium.Viewer('cesiumContainer', {
        animation: false, // 隐藏动画控件
        baseLayerPicker: false, // 隐藏图层选择控件
        fullscreenButton: false, // 隐藏全屏按钮
        vrButton: false, // 隐藏VR按钮，默认false
        geocoder: false, // 隐藏地名查找控件
        homeButton: false, // 隐藏Home按钮
        navigationHelpButton: false, // 隐藏帮助按钮
        scene3DOnly: true, // 每个几何实例将只在3D中呈现，以节省GPU内存
        sceneModePicker: false,
        timeline: false,
        animation: false,
        requestRenderMode: false
			});
			
      this.viewer.scene.globe.depthTestAgainstTerrain = false;
      this.viewer.scene.postProcessStages.fxaa.enabled = false;
      // 关闭logo信息
			this.viewer.cesiumWidget.creditContainer.style.display = "none";
			
			this.viewer.scene.screenSpaceCameraController.minimumZoomDistance = 100;
      this.viewer.scene.screenSpaceCameraController.maximumZoomDistance = 10000000;
      this.viewer.camera.setView({
					destination : Cesium.Cartesian3.fromDegrees(114.46919, 22.98830 , 100000)
      });
      
      // 加载天地图注记
      
      this.viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
        url: "http://t0.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=ce8c90d7c720b0405c0121c6cd8edd99",
        layer: "tdtAnnoLayer",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "w",
        show: false
      }));
    },

    addBillboard() {
      const imageEntity = this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(114.46919, 22.98830),
        billboard: {
          image: ponitIcon,
          scale: 1,
          rotation: 0,

          // 获取或设置与相机的距离，以在该距离处禁用深度测试，例如，防止剪切地形  [不理解]CallbackProperty 
          disableDepthTestDistance: 100.0,

          // 在该距离内显示
          // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(10.0, 8000.0),

          // 摄像机与标签的距离: 500m内 scale = 1, 1400m 外 scale = 0
          scaleByDistance: new Cesium.NearFarScalar(500, 1, 1400, 0.3),
        }
      });
      imageEntity.addProperty('imageClock');
      let second = 0;
      imageEntity.imageClock=setInterval(function () {
        if(imageEntity!=null){
            second+=0.1;
            imageEntity.billboard.rotation=second;
            if(second>360){
                second=0;
            }
          }
      }, 20);
    },

    addHtmlOverlay() {
      const element = document.createElement('div');
      element.id = 'overLay-1';
      element.style.backgroundColor = 'red';
      element.style.width = '100px';
      element.style.height = '100px';
      const position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, Cesium.Cartesian3.fromDegrees(114.45053, 22.98814));
      new HtmlOverlayInCesiumViewer({ element, containerId: 'cesiumContainer', position }, this.viewer);
      // console.log(this.viewer._selectedEntityChanged);
      this.viewer._selectedEntityChanged.addEventListener(function(entity){
        // overlay.setPosition(entity._position._value);
        console.log(entity, entity._position)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  margin: auto;
}
#cesiumContainer {
  width: 800px;
  height: 600px;
  margin: auto;
  position: relative;
  overflow: hidden;
}
.cesium-viewer-bottom {
  display: none;
}
</style>
