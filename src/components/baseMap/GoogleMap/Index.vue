<template>
  <div class="main">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
import * as Cesium from 'cesium';
export default {
  name: 'GoogleMap',
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
      
      // 加载谷歌地图底图
      const googleMapLayer = new Cesium.UrlTemplateImageryProvider({
        url: 'http://mt0.google.cn/maps/vt?lyrs=r@189&gl=cn&x={x}&y={y}&z={z}',

        // 平铺方案指定椭圆形表面碎成瓷砖。如果未提供此参数，则使用 WebMercatorTilingScheme .
        tilingScheme: new Cesium.WebMercatorTilingScheme(),

        // 层级范围
        minimumLevel: 1,
        maximumLevel: 20
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
        imageryProvider: googleMapLayer
			});
			
      this.viewer.scene.globe.depthTestAgainstTerrain = false;
      this.viewer.scene.postProcessStages.fxaa.enabled = false;
      // 关闭logo信息
			this.viewer.cesiumWidget.creditContainer.style.display = "none";
			
			// this.viewer.scene.screenSpaceCameraController.minimumZoomDistance = 20;
			// this.viewer.scene.screenSpaceCameraController.maximumZoomDistance = 3000;
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
