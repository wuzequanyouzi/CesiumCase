<template>
  <div class="main">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
import * as Cesium from 'cesium';
export default {
  name: 'TiandituMap',
  data() {
    return {
    }
  },
  mounted() {
		this.initCesium();
  },
  methods: {
    initCesium() {
      const that = this;
      
      // 加载天地图地图底图
      // OGC 的 WMTS 标准
      /**
       * Cesium WMTS GetTile操作的基本URL（用于KVP编码的请求）或tile-URL模板（用于RESTful请求）。 
       * tile-URL模板应包含以下变量:{style}，{TileMatrixSet}，{TileMatrix}，{TileRow}，{TileCol}。
       * 如果实际值是硬编码的，或者服务器不需要，则前两个是可选的。
       * {s}关键字可用于指定子域。
       */
      const GaodeMapLayer = new Cesium.WebMapTileServiceImageryProvider({
        url: 'http://{s}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={TileMatrix}&TILEROW={TileRow}&TILECOL={TileCol}&format=tiles&tk=ce8c90d7c720b0405c0121c6cd8edd99',
        layer: "img",
        style: "default",
        format: "tiles",
        tileMatrixSetID: "w",
        credit: new Cesium.Credit('天地图全球影像服务'),
        subdomains: ['t0', "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
        maximumLevel: 18,
        show: false
      });

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
        requestRenderMode: false,
        
        // 添加地图底图
        imageryProvider: GaodeMapLayer
			});
			
      this.viewer.scene.globe.depthTestAgainstTerrain = false;
      this.viewer.scene.postProcessStages.fxaa.enabled = false;
      // 关闭logo信息
			this.viewer.cesiumWidget.creditContainer.style.display = "none";
			
			this.viewer.scene.screenSpaceCameraController.minimumZoomDistance = 100;
      this.viewer.scene.screenSpaceCameraController.maximumZoomDistance = 10000000;
      this.viewer.camera.setView({
					destination : Cesium.Cartesian3.fromDegrees(114.46919, 22.98830 , 10000000)
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
}
.cesium-viewer-bottom {
  display: none;
}
</style>
