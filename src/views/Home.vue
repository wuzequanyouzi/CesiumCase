<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: zequan.wu
 * @Date: 2020-12-24 14:37:20
 * @LastEditors: Do not edit
 * @LastEditTime: 2020-12-30 12:08:26
-->
<template>
  <div class="home">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
// @ is an alias to /src
import '../utils/index.js';
// import { default as PolylineTrailMaterialProperty, Cesium } from '../utils/liuxiangwenli';
import { Viewer, CatmullRomSpline, Material, Ellipsoid, PointPrimitiveCollection, PolylineCollection, Cesium3DTileStyle, Cartographic, Math as CesiumMath, Cartesian3, Matrix4, cartographic, LabelStyle, NearFarScalar, DistanceDisplayCondition, VerticalOrigin, BillboardCollection, Cesium3DTileset, Entity, Color, ScreenSpaceEventType , PostProcessStageLibrary, defined, ScreenSpaceEventHandler } from 'cesium/Build/CesiumUnminified/Cesium';
import 'cesium/Build/CesiumUnminified/Widgets/widgets.css'
import { PolylineTrailLinkMaterialProperty } from '../utils/test';
export default {
  name: 'Home',
  data() {
    return {
    }
  },
  mounted() {
		this.initCesium();
		window.$$$ = this;
  },
  methods: {
    initCesium() {
      const that = this;
      this.viewer = new Viewer('cesiumContainer', {
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
        new Cesium3DTileset({
          url: 'http://localhost:3000/tileSet1/tileset.json'
          // url: 'http://10.10.10.14/tileSet/tileSet3/Tile_+011_+005/tileset.json'
        })
			);
			// primitives图元 添加3D的图层
      const tileset2 = this.viewer.scene.primitives.add(
        new Cesium3DTileset({
          url: 'http://localhost:3000/tileSet2/tileset.json'
          // url: 'http://10.10.10.14/tileSet/tileSet3/Tile_+011_+005/tileset.json'
        })
			);
			// primitives图元 添加3D的图层
      const tileset3 = this.viewer.scene.primitives.add(
        new Cesium3DTileset({
          url: 'http://localhost:3000/tileSet3/tileset.json'
          // url: 'http://10.10.10.14/tileSet/tileSet3/Tile_+011_+005/tileset.json'
        })
      );

      tileset1.readyPromise
        .then(function (tileset1) {
            var cartographic = Cartographic.fromCartesian(tileset1.boundingSphere.center);
            var surface = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic
								.height);
								
            var offset = Cartesian3.fromRadians(cartographic.longitude - 0.0000004, cartographic.latitude + 0.00000044, 2.2);

						var translation = Cartesian3.subtract(offset, surface, new Cartesian3());
						console.log(translation);
						tileset1.modelMatrix = Matrix4.fromTranslation(translation);
						console.log(Matrix4.fromTranslation(translation));

            loadingIndicator.style.display = 'none';

        })
        .otherwise(function (error) {
            loadingIndicator.style.display = 'none';
            console.log(error)
				});

			tileset2.readyPromise
				.then(function (tileset2) {

            var cartographic = Cartographic.fromCartesian(tileset2.boundingSphere.center);
            var surface = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic
                .height);
            var offset = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 46);

						var translation = Cartesian3.subtract(offset, surface, new Cartesian3());
						console.log(translation);
						tileset2.modelMatrix = Matrix4.fromTranslation(translation);
						console.log(Matrix4.fromTranslation(translation));
            loadingIndicator.style.display = 'none';

				})
				.otherwise(function (error) {
						loadingIndicator.style.display = 'none';
						console.log(error)
				})


			tileset3.readyPromise
				.then(function (tileset3) {

            var cartographic = Cartographic.fromCartesian(tileset3.boundingSphere.center);
            var surface = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic
                .height);
            var offset = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 18);

						var translation = Cartesian3.subtract(offset, surface, new Cartesian3());
						console.log(translation);
						tileset3.modelMatrix = Matrix4.fromTranslation(translation);
						console.log(Matrix4.fromTranslation(translation));
            loadingIndicator.style.display = 'none';

				})
				.otherwise(function (error) {
						loadingIndicator.style.display = 'none';
						console.log(error)
				})

			this.viewer.camera.setView({
					destination : Cartesian3.fromDegrees(114.46919, 22.98830 , 100),
					orientation: {
						heading:6.100187245229667,
						pitch:-0.264129955179611,
						roll:6.282393102791108
					}
			});

			this.viewer.camera.zoomIn(100);

			setTimeout(() => {
				// this.viewer.camera.flyTo({
				// 	destination: Cartesian3.fromDegrees(114.4, 23.09, 15000.0)
				// })
			}, 5000)

				//获取相机视角
			var handler1 = new ScreenSpaceEventHandler(this.viewer.scene.canvas);
			handler1.setInputAction(function (clickEvent) {
      	// that.viewer.scene.globe.depthTestAgainstTerrain = true;
				const position = that.viewer.scene.pickPosition(clickEvent.position);
				if (defined(position)) {
					console.log('笛卡尔坐标', position);

					// 将笛卡尔坐标转为 经纬度和高程定义的坐标(单位是弧度)
					const cartographic = Cartographic.fromCartesian(position);
					console.log('经纬度和高程', cartographic);

					// 经纬度 弧度 转 角度
					const longitude = CesiumMath.toDegrees(
						cartographic.longitude
					).toFixed(5);
					const latitude = CesiumMath.toDegrees(
						cartographic.latitude
					).toFixed(5);
					console.log('经度:', longitude);
					console.log('纬度:', latitude);
				}
					console.log(that.viewer.scene.camera.position.x + "," + that.viewer.scene.camera.position.y + "," + that.viewer.scene.camera.position.z, that.viewer.scene.camera);//相机XYZ
					console.log("换行输出："+"\n"+
						"heading:" + that.viewer.scene.camera.heading + ","+"\n"+
						"pitch:" + that.viewer.scene.camera.pitch + ","+"\n"+
						"roll:" + that.viewer.scene.camera.roll
					);
			}, ScreenSpaceEventType.LEFT_CLICK);

			/*
			let lastPickedEntity = undefined;
			handler1.setInputAction(function (movement) {
				// 鼠标获取到的图元
				let pickedPrimitive = that.viewer.scene.pick(movement.endPosition);
				console.log('pickedPrimitive ', pickedPrimitive )

				// 判断图元是否存在
				let pickedEntity = (defined(pickedPrimitive)) ? pickedPrimitive.id : undefined;

				console.log('defined(pickedPrimitive)', defined(pickedPrimitive))

				// 取消上一个高亮图元的高亮效果
				if(defined(lastPickedEntity)) {
					console.log('lastPickedEntity', lastPickedEntity);
				}

				// 高亮当前鼠标选中的图元
				if(defined(pickedEntity)) {
					console.log('pickedEntity', pickedEntity);
				}

			}, ScreenSpaceEventType.MOUSE_MOVE);
			*/

			const addPrimitive = () => {
				// 摄像头图标
				let billboards = this.viewer.scene.primitives.add(new BillboardCollection());
				billboards.add({
					position: new Cartesian3(-2434425.5185659397,5346606.589801337,2475753.731501333 ),
					//sizeInMeters : true, //图像的尺寸被指定成图像实际的尺寸
					image: 'http://192.168.205.101:3000/images/tollgate_selected.png',
					id: {
						OKK: '123'
					}
				});
			}

			const addEntityOfBillboard = () => {
				this.viewer.entities.add({
						position: new Cartesian3(-2434562.365979587,5346541.671377207,2475626.8833395904),
						billboard: {
							image: 'http://192.168.205.101:3000/images/tollgate_selected.png',
							verticalOrigin: VerticalOrigin.BOTTOM,
							scale: 0.5
						},
						properties: {
							poiType: "videoPOI",
							videoId: '摄像头1'
						},
				});
			}

			const addEntityOfLabel = () => {
				this.viewer.entities.add({
						position: new Cartesian3(-2434526.955257509,5346498.232318416,2475504.6519197384),
						// billboard: {
						// 	image: 'http://192.168.205.101:3000/images/tollgate_selected.png',
						// 	verticalOrigin: VerticalOrigin.BOTTOM
						// },
						label: {
							text: '天地一号',
							outlineColor: Color.WHITE,	//边框颜色
							outlineWidth:1 , //边框宽度
							style: LabelStyle.FILL_AND_OUTLINE,
							showBackground: true,
							backgroundColor: new Color(1, 0, 0),
							scale: 0.5,

							// 获取或设置与相机的距离，以在该距离处禁用深度测试，例如，防止剪切地形  [不理解]
							disableDepthTestDistance: 100.0,

							// 在该距离内显示
							distanceDisplayCondition: new DistanceDisplayCondition(10.0, 8000.0),

							// 摄像机与标签的距离: 500m内 scale = 1, 1400m 外 scale = 0
							scaleByDistance: new NearFarScalar(500, 1, 1400, 0.0),
						},
						billboard: {
							image: 'http://192.168.205.101:3000/images/tollgate_selected.png',
							verticalOrigin: VerticalOrigin.BOTTOM,
							scale: 0.5,

							// 获取或设置与相机的距离，以在该距离处禁用深度测试，例如，防止剪切地形  [不理解]
							disableDepthTestDistance: 100.0,

							// 在该距离内显示
							distanceDisplayCondition: new DistanceDisplayCondition(10.0, 8000.0),

							// 摄像机与标签的距离: 500m内 scale = 1, 1400m 外 scale = 0
							scaleByDistance: new NearFarScalar(500, 1, 1400, 0.0),
						},
						properties: {
							poiType: "labelPOI",
							videoId: '你搞笑的吧label'
						}
				});
			}

			addPrimitive();
			addEntityOfBillboard();
			addEntityOfLabel();


			let lastPickedEntity = undefined;
			var handler = new ScreenSpaceEventHandler(this.viewer.scene.canvas);
			handler.setInputAction((event) => {
				// 获取鼠标点击拾取到的三维对象
				const pickedObject = this.viewer.scene.pick(event.position);

				// 取消上一个高亮图元的高亮效果
				if(defined(lastPickedEntity)) {
					if (lastPickedEntity.properties.poiType.getValue() === 'labelPOI') {
						lastPickedEntity.label.scale = 0.5;
					} else {
						lastPickedEntity.billboard.scale = 0.5;
					}
				}

				// 判断对象存在与否
				console.log('点击到的东西', pickedObject);
				if (defined(pickedObject) && pickedObject.id && pickedObject.id.properties) {
					const properties = pickedObject.id.properties;
					console.log('自定义属性', properties);
					if (properties.poiType.getValue() === 'labelPOI') {
						pickedObject.id.label.scale = 1;
					} else {
						pickedObject.id.billboard.scale = 1;
					}
					lastPickedEntity = pickedObject.id;
				}
			}, ScreenSpaceEventType.LEFT_CLICK)

			

				
			// this.viewer.scene.debugShowCommands = true;

      // tileset.style = new Cesium3DTileStyle({
      //   defines: {
      //     alpha: "${id} % 2 === 0 ? 0.5 : 1.0",
      //   },
      //   color: "rgba(255, 255, 255, 1)",
      // });
      // this.viewer.zoomTo(tileset1);

      /*
      const nameOverlay = document.createElement('div');
      this.viewer.container.appendChild(nameOverlay);
			nameOverlay.className = 'backdrop';
			nameOverlay.style.display = 'none';
			nameOverlay.style.position = 'absolute';
			nameOverlay.style.bottom = '0';
			nameOverlay.style.left = '0';
			nameOverlay.style['pointer-events'] = 'none';
			nameOverlay.style.padding = '4px';
      nameOverlay.style.backgroundColor = 'black';
      const selected = {
				feature: undefined,
				originalColor: new Color()
      };
      const selectedEntity = new Entity();
      const clickHandler = this.viewer.screenSpaceEventHandler.getInputAction(ScreenSpaceEventType.LEFT_CLICK);
      // 如果不支持轮廓，请在鼠标悬停时将特征颜色更改为黄色，单击鼠标时将其更改为绿色
			if(PostProcessStageLibrary.isSilhouetteSupported(this.viewer.scene)) {
				// Silhouettes are supported
				var silhouetteBlue = PostProcessStageLibrary.createEdgeDetectionStage();
				silhouetteBlue.uniforms.color = Color.BLUE;
				silhouetteBlue.uniforms.length = 0.01;
				silhouetteBlue.selected = [];

				var silhouetteGreen = PostProcessStageLibrary.createEdgeDetectionStage();
				silhouetteGreen.uniforms.color = Color.LIME;
				silhouetteGreen.uniforms.length = 0.01;
				silhouetteGreen.selected = [];

				this.viewer.scene.postProcessStages.add(PostProcessStageLibrary.createSilhouetteStage([silhouetteBlue, silhouetteGreen]));

				// Silhouette a feature blue on hover.
				this.viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(movement) {
					// If a feature was previously highlighted, undo the highlight
					silhouetteBlue.selected = [];

					// Pick a new feature
					var pickedFeature = that.viewer.scene.pick(movement.endPosition);
					if(!defined(pickedFeature)) {
						nameOverlay.style.display = 'none';
						return;
					}

					// Highlight the feature if it's not already selected.
					if(pickedFeature !== selected.feature) {
						silhouetteBlue.selected = [pickedFeature];
					}
				}, ScreenSpaceEventType.MOUSE_MOVE);

				// Silhouette a feature on selection and show metadata in the InfoBox.
				this.viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
					// If a feature was previously selected, undo the highlight
          silhouetteGreen.selected = [];
					// Pick a new feature
					var pickedFeature = that.viewer.scene.pick(movement.position);
					if(!defined(pickedFeature)) {
						clickHandler(movement);
						return;
					}

					// Select the feature if it's not already selected
					if(silhouetteGreen.selected[0] === pickedFeature) {
						return;
					}

					// Save the selected feature's original color
					var highlightedFeature = silhouetteBlue.selected[0];
					if(pickedFeature === highlightedFeature) {
						silhouetteBlue.selected = [];
					}

					// Highlight newly selected feature
          silhouetteGreen.selected = [pickedFeature];
          
          alert('你点击了, 可以做更多的操作')
          console.log(pickedFeature);

					
				}, ScreenSpaceEventType.LEFT_CLICK);
			} else {
				// Silhouettes are not supported. Instead, change the feature color.

				// Information about the currently highlighted feature
				var highlighted = {
					feature: undefined,
					originalColor: new Color()
				};

				// Color a feature yellow on hover.
				this.viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(movement) {
					// If a feature was previously highlighted, undo the highlight
					if(defined(highlighted.feature)) {
						highlighted.feature.color = highlighted.originalColor;
						highlighted.feature = undefined;
					}
					// Pick a new feature
					var pickedFeature = that.viewer.scene.pick(movement.endPosition);
					if(!defined(pickedFeature)) {
						nameOverlay.style.display = 'none';
						return;
					}
					// A feature was picked, so show it's overlay content
					nameOverlay.style.display = 'block';
					nameOverlay.style.bottom = that.viewer.canvas.clientHeight - movement.endPosition.y + 'px';
					nameOverlay.style.left = movement.endPosition.x + 'px';
					var name = pickedFeature.getProperty('name');
					if(!defined(name)) {
						name = pickedFeature.getProperty('id');
					}
					nameOverlay.textContent = name;
					// Highlight the feature if it's not already selected.
					if(pickedFeature !== selected.feature) {
						highlighted.feature = pickedFeature;
						Color.clone(pickedFeature.color, highlighted.originalColor);
						pickedFeature.color = Color.YELLOW;
					}
				}, ScreenSpaceEventType.MOUSE_MOVE);
      }
      */
		},
		drawLines(point1, point2) {
			// this.viewer.entities.add({
			// 	name: 'polyline',
			// 	polyline: {
			// 		positions: Cartesian3.fromDegreesArrayHeights([
			// 			114.46867, 22.99040, 200,
			// 			114.46840, 22.99318, 200,
			// 			114.46912, 22.98989, 200,
			// 			114.47156, 22.99020, 200,
			// 		]),
			// 		width: 1,
			// 		material: Color.RED
			// 	}
			// });

			// 中心点
			const centerPoint = Cartesian3.fromDegrees(
       	114.46883,
        22.99063,
        40
			);
			const endPoint = Cartesian3.fromDegrees(
				114.46901,
				22.98876,
				20
			);
			const endPoint1 = Cartesian3.fromDegrees(
				114.46975,
				22.98915,
				74
			)
			const collection = this.viewer.scene.primitives.add(new PointPrimitiveCollection());
			collection.add({
				position: centerPoint,
        point: {
          pixelSize: 15,
          color: Color.WHITE
        }
			});
			collection.add({
				position: endPoint1,
        point: {
          pixelSize: 15,
          color: Color.WHITE
        }
			});

			// 纹理材质
			let material = new PolylineTrailLinkMaterialProperty(Color.ORANGE, 3000)
			// let material = PolylineTrailMaterialProperty;
			console.log(material);
			// const polylineCollection = this.viewer.scene.primitives.add(new PolylineCollection());
			// polylineCollection.add({
			// 	positions: this.generateCurve(centerPoint, endPoint),
			// 	width: 2,
			// 	// color: Color.RED
			// 	material: new Material({
			// 		fabric: {
			// 			type: 'Color',
			// 			uniforms: {
			// 				color: new Color(1.0, 0.0, 0.0, 0.5)，
							
			// 			}
			// 		}
			// 	})
			// });

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
			
			// 添加中心点到地图上
			// this.viewer.scene.primitives.add(collection);

			// this.viewer.entities.add({
			// 	name: 'PolylineTrail',
			// 	polygon: {
			// 		hierarchy: Cartesian3.fromDegreesArrayHeights([
			// 			114.46867, 22.99040, 200,
			// 			114.46840, 22.99318, 200
			// 		]),
			// 		width: 15,
			// 		// material: new PolylineTrailLinkMaterialProperty(Color.WHITE, 3000,1)
			// 	}
			// });
			
		},
		
		generateCurve(startPoint, endPoint) {
			let addPointCartesian = new Cartesian3();

			// 分量求和 ，addPointCartesian是存储求和结果
      Cartesian3.add(startPoint, endPoint, addPointCartesian);
			let midPointCartesian = new Cartesian3();
			
			// midPointCartesian  = 分量/标量 的 结果
			Cartesian3.divideByScalar(addPointCartesian, 2, midPointCartesian);
			
			// fromCartesian 从笛卡尔位置创建一个新的制图实例
      let midPointCartographic = Cartographic.fromCartesian(
        midPointCartesian
			);
			
			// 取两点间的距离的1/5 作 高度
      midPointCartographic.height =
        Cartesian3.distance(startPoint, endPoint) / 5;
			let midPoint = new Cartesian3();
			
			// 制图位置转笛卡尔坐标， midPoint存储结果
      Ellipsoid.WGS84.cartographicToCartesian(
        midPointCartographic,
        midPoint
      );
      let spline = new CatmullRomSpline({
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
#cesiumContainer {
  width: 800px;
  height: 600px;
}
.cesium-viewer-bottom {
  display: none;
}
</style>
