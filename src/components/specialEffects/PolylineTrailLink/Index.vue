<template>
  <div class="main">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
import * as Cesium from 'cesium/Build/CesiumUnminified/Cesium';
import { PolylineTrailLinkMaterialProperty } from './util';
export default {
  name: 'PolylineTrailLink',
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
          // url: 'http://10.10.10.14/tileSet/tileSet3/Tile_+011_+005/tileset.json'
        })
			);
			// primitives图元 添加3D的图层
      const tileset2 = this.viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: 'http://localhost:3000/tileSet2/tileset.json'
          // url: 'http://10.10.10.14/tileSet/tileSet3/Tile_+011_+005/tileset.json'
        })
			);
			// primitives图元 添加3D的图层
      const tileset3 = this.viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: 'http://localhost:3000/tileSet3/tileset.json'
          // url: 'http://10.10.10.14/tileSet/tileSet3/Tile_+011_+005/tileset.json'
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
      this.drawLines();
    },
    
    // 绘制线条
		drawLines() {
			// 中心点
			const centerPoint = Cesium.Cartesian3.fromDegrees(
       	114.46883,
        22.99063,
        40
			);
			const endPoint = Cesium.Cartesian3.fromDegrees(
				114.46901,
				22.98876,
				20
			);
			const endPoint1 = Cesium.Cartesian3.fromDegrees(
				114.46975,
				22.98915,
				74
      )
      
      // 绘制点
			const collection = this.viewer.scene.primitives.add(new Cesium.PointPrimitiveCollection());
			collection.add({
				position: centerPoint,
        point: {
          pixelSize: 15,
          color: Cesium.Color.WHITE
        }
			});
			collection.add({
				position: endPoint1,
        point: {
          pixelSize: 15,
          color: Cesium.Color.WHITE
        }
			});

			// 纹理材质
			let material = new PolylineTrailLinkMaterialProperty(Cesium.Color.ORANGE, 3000)
			console.log(material);

      // 流动性线条必须添加到entities里面，若添加到primitives中会报search属性不存在
			this.viewer.entities.add({
				polyline: {
					positions: this.generateCurve(centerPoint, endPoint),
					width: 2,
					material: material
				}
			});
			this.viewer.entities.add({
				polyline: {
					positions: this.generateCurve(endPoint, endPoint1),
					width: 2,
					material: material
				}
			});
		},
		
		generateCurve(startPoint, endPoint) {
			let addPointCartesian = new Cesium.Cartesian3();

			// 分量求和 ，addPointCartesian是存储求和结果
      Cesium.Cartesian3.add(startPoint, endPoint, addPointCartesian);
			let midPointCartesian = new Cesium.Cartesian3();
			
			// midPointCartesian  = 分量/标量 的 结果
			Cesium.Cartesian3.divideByScalar(addPointCartesian, 2, midPointCartesian);
			
			// fromCartesian 从笛卡尔位置创建一个新的制图实例
      let midPointCartographic = Cesium.Cartographic.fromCartesian(
        midPointCartesian
			);
			
			// 取两点间的距离的1/5 作 高度
      midPointCartographic.height =
        Cesium.Cartesian3.distance(startPoint, endPoint) / 2;
			let midPoint = new Cesium.Cartesian3();
			
			// 制图位置转笛卡尔坐标， midPoint存储结果
      Cesium.Ellipsoid.WGS84.cartographicToCartesian(
        midPointCartographic,
        midPoint
      );
      let spline = new Cesium.CatmullRomSpline({
        times: [0.0, 0.5, 1.0],
        points: [startPoint, midPoint, endPoint]
			});
			console.log('spline', spline);
			let curvePoints = [];
			
			// 按个人理解就是把线分成 200 段
      for (let i = 0, len = 200; i < len; i++) {
        curvePoints.push(spline.evaluate(i / len));
			}
			console.log('curvePoints', curvePoints);
      return curvePoints;
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
