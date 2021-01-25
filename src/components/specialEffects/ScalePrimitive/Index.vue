<template>
  <div class="main">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
import * as Cesium from 'cesium/Build/CesiumUnminified/Cesium';
import tollgate_selected from '../../../assets/tollgate_selected.png';
export default {
  name: 'ScalePrimitive',
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
			
			this.viewer.scene.screenSpaceCameraController.minimumZoomDistance = 20;
			this.viewer.scene.screenSpaceCameraController.maximumZoomDistance = 3000;

			
      // primitives图元 添加3D的图层
      const tileset1 = this.viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: 'http://localhost:3000/tileSet1/tileset.json'
        })
			);
			// primitives图元 添加3D的图层
      const tileset2 = this.viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: 'http://localhost:3000/tileSet2/tileset.json'
        })
			);
			// primitives图元 添加3D的图层
      const tileset3 = this.viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: 'http://localhost:3000/tileSet3/tileset.json'
        })
      );

      tileset1.readyPromise
        .then(function (tileset1) {
            var cartographic = Cesium.Cartographic.fromCartesian(tileset1.boundingSphere.center);
            var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic
								.height);
								
            var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude - 0.0000004, cartographic.latitude + 0.00000044, 2.2);

						var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
						console.log(translation);
						tileset1.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
						console.log(Cesium.Matrix4.fromTranslation(translation));

            loadingIndicator.style.display = 'none';

        })
        .otherwise(function (error) {
            loadingIndicator.style.display = 'none';
            console.log(error)
				});

			tileset2.readyPromise
				.then(function (tileset2) {

            var cartographic = Cesium.Cartographic.fromCartesian(tileset2.boundingSphere.center);
            var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic
                .height);
            var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 46);

						var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
						console.log(translation);
						tileset2.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
						console.log(Cesium.Matrix4.fromTranslation(translation));
            loadingIndicator.style.display = 'none';

				})
				.otherwise(function (error) {
						loadingIndicator.style.display = 'none';
						console.log(error)
				})


			tileset3.readyPromise
				.then(function (tileset3) {

            var cartographic = Cesium.Cartographic.fromCartesian(tileset3.boundingSphere.center);
            var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic
                .height);
            var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 18);

						var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
						console.log(translation);
						tileset3.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
						console.log(Cesium.Matrix4.fromTranslation(translation));
            loadingIndicator.style.display = 'none';

				})
				.otherwise(function (error) {
						loadingIndicator.style.display = 'none';
						console.log(error)
				})

      // 设置相机位置
			this.viewer.camera.setView({
					destination : Cesium.Cartesian3.fromDegrees(114.46923, 22.98889, 100),
					orientation: {
            heading:6.10015873330856,
            pitch:-0.4587331271493662,
            roll:6.282695690127138
					}
			});

      this.viewer.camera.zoomIn(-200);

      this.addPrimitive();
      this.addEntityOfBillboard();
      this.addEntityOfLabel();
      this.addEvent();
    },
    addPrimitive() {
      // 摄像头图标
      let billboards = this.viewer.scene.primitives.add(new Cesium.BillboardCollection());
      billboards.add({
        position: new Cesium.Cartesian3(-2433432.8413234204,5347079.163575586,2475637.2268013787),
        //sizeInMeters : true, //图像的尺寸被指定成图像实际的尺寸
        image: tollgate_selected,
        id: {
          OKK: '123'
        }
      });
    },

    addEntityOfBillboard() {
      this.viewer.entities.add({
          position: new Cesium.Cartesian3(-2433359.9626179086,5347099.2098993175,2475470.3966018925),
          billboard: {
            image: tollgate_selected,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            scale: 0.5
          },
          properties: {
            poiType: "videoPOI",
            videoId: '摄像头1'
          },
      });
    },

    addEntityOfLabel() {
      this.viewer.entities.add({
        position: new Cesium.Cartesian3(-2433353.4836470233,5346970.135050778,2475537.613712583),
        label: {
          text: '天地一号',
          outlineColor: Cesium.Color.WHITE,	//边框颜色
          outlineWidth:1 , //边框宽度
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          showBackground: true,
          backgroundColor: new Cesium.Color(1, 0, 0),
          scale: 0.5,

          // 获取或设置与相机的距离，以在该距离处禁用深度测试，例如，防止剪切地形  [不理解]
          disableDepthTestDistance: 100.0,

          // 在该距离内显示
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(10.0, 8000.0),

          // 摄像机与标签的距离: 500m内 scale = 1, 1400m 外 scale = 0
          scaleByDistance: new Cesium.NearFarScalar(500, 1, 1400, 0.0),
        },
        billboard: {
          image: 'http://192.168.205.101:3000/images/tollgate_selected.png',
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          scale: 0.5,

          // 获取或设置与相机的距离，以在该距离处禁用深度测试，例如，防止剪切地形  [不理解]
          disableDepthTestDistance: 100.0,

          // 在该距离内显示
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(10.0, 8000.0),

          // 摄像机与标签的距离: 500m内 scale = 1, 1400m 外 scale = 0
          scaleByDistance: new Cesium.NearFarScalar(500, 1, 1400, 0.0),
        },
        properties: {
          poiType: "labelPOI",
          videoId: '你搞笑的吧label'
        }
      });
    },

    addEvent() {
      let lastPickedEntity = undefined;
			var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
			handler.setInputAction((event) => {
				// 获取鼠标点击拾取到的三维对象
				const pickedObject = this.viewer.scene.pick(event.position);

				// 取消上一个高亮图元的高亮效果
				if(Cesium.defined(lastPickedEntity)) {
					if (lastPickedEntity.properties.poiType.getValue() === 'labelPOI') {
						lastPickedEntity.label.scale = 0.5;
					} else {
						lastPickedEntity.billboard.scale = 0.5;
					}
				}

				// 判断对象存在与否
				console.log('点击到的东西', pickedObject);
				if (Cesium.defined(pickedObject) && pickedObject.id && pickedObject.id.properties) {
					const properties = pickedObject.id.properties;
					console.log('自定义属性', properties);
					if (properties.poiType.getValue() === 'labelPOI') {
						pickedObject.id.label.scale = 1;
					} else {
						pickedObject.id.billboard.scale = 1;
					}
					lastPickedEntity = pickedObject.id;
				}
			}, Cesium.ScreenSpaceEventType.LEFT_CLICK)
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
