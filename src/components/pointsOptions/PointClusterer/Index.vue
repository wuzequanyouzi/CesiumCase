<template>
  <div class="main">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
import * as Cesium from 'cesium';
import ponitIcon from '../../../assets/tollgate_selected.png';
import LabelIconBuilder from './util/labelIconBuilder.js';
import purple from '../../../assets/map/m4.png';
import pink from '../../../assets/map/m3.png';
import red from '../../../assets/map/m2.png';
import yellow from '../../../assets/map/m1.png';
import blue from '../../../assets/map/m0.png';
export default {
  name: 'PointClusterer',
  data() {
    return {
    }
  },
  mounted() {
    window.map = this;
    this.initCesium();
    this.initPonitClusterer();
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
    },

    // 初始化点聚合
    initPonitClusterer() {
      const dataSource = new Cesium.CustomDataSource('点聚合');
      for (let index = 0; index < 500; index++) {
        // 生成随机坐标
        const pointPosition = {
          lat: 114.46919 + Math.random() / 300,
          lon: 22.98830 + Math.random() / 300
        }

        // 创建广告牌（如果无法理解，想象成百度地图的marker）
        dataSource.entities.add({
          position: Cesium.Cartesian3.fromDegrees(pointPosition.lat, pointPosition.lon),
          name: 'pointClusterer',
          billboard: {
            image: ponitIcon,
            width: 48,
            height: 48,
            description: '123'
          }
        });
      }
      const dataSourcePromise = this.viewer.dataSources.add(dataSource);

      let removeListener = undefined;

      // 设置点聚合的模式（图标、 聚合逻辑）
      dataSourcePromise.then(async (dataSource) => {
        // 设置像素范围以扩展屏幕空间边界框。
        const pixelRange = 15;
        dataSource.clustering.pixelRange = pixelRange;

        // 设置最小聚合的点的个数
        const minimumClusterSize = 3;
        dataSource.clustering.minimumClusterSize = minimumClusterSize;

        // 是否启用聚合
        const enabled = true;
        dataSource.clustering.enabled = enabled;

        const pointBuilder = new LabelIconBuilder();
        const purpleIcon = await pointBuilder.getIcon(purple, 60);
        const pinkIcon = await pointBuilder.getIcon(pink, 60);
        const redIcon = await pointBuilder.getIcon(red, 60);
        const yellowIcon = await pointBuilder.getIcon(yellow, 60);
        const blueIcon = await pointBuilder.getIcon(blue, 60);
        
        if (Cesium.defined(removeListener)) {
          removeListener();
          removeListener = undefined;
        } else {
          removeListener = dataSource.clustering.clusterEvent.addEventListener(
            function (clusteredEntities, cluster) {
              console.log(cluster);
              cluster.label.show = true;
              cluster.label.font = '30px'
              cluster.billboard.show = true;
              cluster.billboard.name = 'pointClusterer';
              cluster.billboard.id = cluster.label.id;
              cluster.billboard.verticalOrigin =
                Cesium.VerticalOrigin.BOTTOM;

              // 由于fromText方法每次都是生成新的图片，所以会耗性能， 考虑将图片缓存，根据数量获取缓存中不同的图片
              if (clusteredEntities.length >= 150) {
                // cluster.billboard.image = pointBuilder.fromText(clusteredEntities.length, purpleIcon, 60);
                cluster.billboard.image = purpleIcon;
              } else if (clusteredEntities.length >= 100) {
                // cluster.billboard.image = pointBuilder.fromText(clusteredEntities.length, pinkIcon, 60);
                cluster.billboard.image = pinkIcon;
              } else if (clusteredEntities.length >= 50) {
                // cluster.billboard.image = pointBuilder.fromText(clusteredEntities.length, redIcon, 60);
                cluster.billboard.image = redIcon;
              } else if (clusteredEntities.length >= 10) {
                // cluster.billboard.image = pointBuilder.fromText(clusteredEntities.length, yellowIcon, 60);
                cluster.billboard.image = yellowIcon;
              } else {
                // cluster.billboard.image = pointBuilder.fromText(clusteredEntities.length, blueIcon, 60);
                cluster.billboard.image = blueIcon;
              }
            }
          );
        }

        // 强制重置组合样式
        dataSource.clustering.pixelRange = 0;
        dataSource.clustering.pixelRange = pixelRange;
        this.addPointClustererEvent();
      })
    },

    addPointClustererEvent() {
      const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
      handler.setInputAction((movement) => {
        const pickedLabel = this.viewer.scene.pick(movement.position);
        if (Cesium.defined(pickedLabel) && pickedLabel.primitive.name === 'pointClusterer') {
          var ids = pickedLabel.id;
          console.log('pickedLabel', pickedLabel);
          console.log(ids);
          // if (Array.isArray(ids)) {
          //   for (var i = 0; i < ids.length; ++i) {
          //     ids[i].billboard.color = Cesium.Color.YELLOW;
          //   }
          // }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
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
