<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import {
  WebMapTileServiceImageryProvider,
  Credit,
  Viewer,
  TileMapServiceImageryProvider,
  ScreenSpaceEventType,
  Cesium3DTileset,
  Cartographic,
  Cartesian3,
  Matrix4,
  Color,
  LabelStyle,
  DistanceDisplayCondition,
  NearFarScalar,
  Cartesian2,
  VerticalOrigin,
  ScreenSpaceEventHandler,
  HeadingPitchRange,
  defined,
  Math as CesiumMath,
  // GeoJsonDataSource,
  // BillboardGraphics,
  // LabelGraphics,
} from 'cesium/Build/Cesium/Cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import HtmlOverlayInCesiumViewer from './util/loadHtmlToCesiumViewer.js';
import PolygonPrimitive from './util/PolygonPrimitive.js';
import p1 from '../../assets/images/p1.png';
import p2 from '../../assets/images/p2.png';
import p3 from '../../assets/images/p3.png';
import p4 from '../../assets/images/p4.png';
import highLight from '../../assets/images/highLight.png';
import videoActiveImage from '../../assets/images/qz.png';
import videoNotActiveImage from '../../assets/images/qz_black.png';
import { mapBaseUrl } from '../../lib/api';
import { debounce } from '../../utils/index.js';
import { insidePolygon } from '../../utils/judgePointInArea1';
export default {
  name: 'Map3D',
  data() {
    return {
      checkedBuildings: []
    };
  },
  computed: {
    buildingInfoList() {
      return this.$store.getters.getBuildingInfoList;
    }
  },
  created() {
    this.lastPickBuild = null;
    this.lastBckImage = null;
    this.positions = [];
  },
  mounted() {
    this.initMap();
    window.map = this;
  },
  methods: {
    initMap() {
      
      const TDMapLayer = new WebMapTileServiceImageryProvider({
        url: 'http://{s}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={TileMatrix}&TILEROW={TileRow}&TILECOL={TileCol}&format=tiles&tk=ce8c90d7c720b0405c0121c6cd8edd99',
        layer: 'img',
        style: 'default',
        format: 'tiles',
        tileMatrixSetID: 'w',
        credit: new Credit('天地图全球影像服务'),
        subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
        maximumLevel: 18,
        show: false
      });

      this.viewer = new Viewer('cesiumContainer', {
        animation: false, // 隐藏动画控件
        baseLayerPicker: false, // 隐藏图层选择控件
        fullscreenButton: false, // 隐藏全屏按钮
        vrButton: false, // 隐藏VR按钮，默认false
        geocoder: false, // 隐藏地名查找控件
        homeButton: true, // 隐藏Home按钮
        navigationHelpButton: false, // 隐藏帮助按钮
        scene3DOnly: true, // 每个几何实例将只在3D中呈现，以节省GPU内存
        sceneModePicker: false,
        timeline: false,
        requestRenderMode: false,
        selectionIndicator: false, // 关闭焦框
        
        // 添加地图底图
        // imageryProvider: TDMapLayer,
        imageryProvider: new TileMapServiceImageryProvider({
          url: `${mapBaseUrl}/tiles/`, // http://192.168.130.13:15300
          credit: 'googleTitle'
        })
      });
      
      // this.viewer.scene.debugShowFramesPerSecond = true;
			
      this.viewer.scene.globe.depthTestAgainstTerrain = false;
      this.viewer.scene.postProcessStages.fxaa.enabled = false;
      // 关闭logo信息
      this.viewer.cesiumWidget.creditContainer.style.display = 'none';
      this.viewer.scene.screenSpaceCameraController.minimumZoomDistance = 20;

      // 取消默认的双击事件
      this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

      this.flyToHome();
      
      // 加载3Dtiles
      this.loadind3DTiles();
    },
    loadind3DTiles() {
      const tileset1 = this.viewer.scene.primitives.add(
        new Cesium3DTileset({
          url: `${mapBaseUrl}/tileSet4/tileset.json`
        })
      );
      // primitives图元 添加3D的图层
      const tileset2 = this.viewer.scene.primitives.add(
        new Cesium3DTileset({
          url: `${mapBaseUrl}/tileSet5/tileset.json`
        })
      );
      // primitives图元 添加3D的图层
      const tileset3 = this.viewer.scene.primitives.add(
        new Cesium3DTileset({
          url: `${mapBaseUrl}/tileSet6/tileset.json`
        })
      );

      // 设置tiles 位置偏移
      const tile1Promise = tileset1.readyPromise
        .then(function(tileset1) {
          let cartographic = Cartographic.fromCartesian(tileset1.boundingSphere.center);
          let surface = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic
            .height);
								
          let offset = Cartesian3.fromRadians(cartographic.longitude + 0.0000840, cartographic.latitude - 0.0000450, 6);

          let translation = Cartesian3.subtract(offset, surface, new Cartesian3());
          tileset1.modelMatrix = Matrix4.fromTranslation(translation);
        })
        .otherwise(function(error) {
          console.error(error);
          return 'OK';
        });

      const tile2Promise = tileset2.readyPromise
        .then(function(tileset2) {

          let cartographic = Cartographic.fromCartesian(tileset2.boundingSphere.center);
          let surface = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic
            .height);
          let offset = Cartesian3.fromRadians(cartographic.longitude + 0.0000840, cartographic.latitude - 0.0000456, 50 + 8.2);

          let translation = Cartesian3.subtract(offset, surface, new Cartesian3());
          tileset2.modelMatrix = Matrix4.fromTranslation(translation);
        })
        .otherwise(function(error) {
          console.error(error);
          return 'OK';
        });


      const tile3Promise = tileset3.readyPromise
        .then(function(tileset3) {

          let cartographic = Cartographic.fromCartesian(tileset3.boundingSphere.center);
          let surface = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic
            .height);
          let offset = Cartesian3.fromRadians(cartographic.longitude + 0.0000839, cartographic.latitude - 0.000045877, 18 + 5.5);

          let translation = Cartesian3.subtract(offset, surface, new Cartesian3());
          tileset3.modelMatrix = Matrix4.fromTranslation(translation);
        })
        .otherwise(function(error) {
          console.error(error);
          return 'OK';
        });
        
      Promise.all([tile1Promise, tile2Promise, tile3Promise])
        .then(() => {
          this.$emit('loadedTiles', this.viewer);
          let buildingInfoTimeout = null;
          let buildingInfoCount = 0;
          let buildingInfoTimer = () => {
            if (this.buildingInfoList.length) {
              this.buildingInfoList.forEach(buildingInfo => {
                buildingInfo.buildingType === '5'
                  ? this.addVideoBillboard(buildingInfo)
                  : this.addBillboard(buildingInfo);
              });
              buildingInfoTimeout && clearTimeout(buildingInfoTimeout);
            } else if (buildingInfoCount > 20) {
              console.error('获取建筑标签信息失败');
              buildingInfoTimeout && clearTimeout(buildingInfoTimeout);
            } else {
              buildingInfoTimeout = setTimeout(() => {
                buildingInfoTimer();
                buildingInfoCount++;
              }, 100);
            }
          };
          buildingInfoTimer();

          // ===================================以下代码，用来解决加载实体缓慢的问题，但是本人对Cesium无法吃透，无法解决报错问题，望接收的孩子能吃透它=====================================
          // const _dataSource = GeoJsonDataSource.load('http://localhost:3000/positions.geojson',{
          //   clampToGround : true
          // });
          // _dataSource.then(__dataSource => {
          //   console.log(__dataSource.entities.values);
          //   const style = 2;
          //   __dataSource.entities.values.forEach((entity) => {
          //     const buildingType = entity.properties.buildingType._value;
          //     const name = entity.properties.name._value;
          //     const status = entity.properties.status._value;
          //     entity._id = entity.properties.bsm._value;
          //     if (buildingType !== '5') {
          //       let backColor;
          //       let buildingTypeImage;
          //       if (buildingType == '1') {
          //         backColor = new Color(88 / 255, 99 / 255, 246 / 255, 1.0);
          //         buildingTypeImage = p1;
          //       } else if (buildingType == '2') {
          //         backColor = new Color(60 / 255, 164 / 255, 65 / 255, 1.0);
          //         buildingTypeImage = p2;
          //       } else if (buildingType == '3') {
          //         backColor = new Color(26 / 255, 196 / 255, 228 / 255, 1.0);
          //         buildingTypeImage = p3;
          //       } else if (buildingType == '4') {
          //         backColor = new Color(190 / 255, 120 / 255, 10 / 255, 1.0);
          //         buildingTypeImage = p4;
          //       }
          //       entity.label = new LabelGraphics({
          //         text: name,
          //         font: style == 1 ? '500 40px Microsoft YaHei' : '500 30px Helvetica', // 15pt monospace
          //         outlineColor: Color.WHITE,     // 边框颜色
          //         outlineWidth: 1,    // 边框宽度
          //         scale: 0.5,
          //         style: style == 1 ? LabelStyle.FILL_AND_OUTLINE : LabelStyle.FILL,
          //         fillColor: style == 1 ? Color.BLACK : Color.WHITE,
          //         pixelOffset: new Cartesian2(110, -50),   // 偏移量
          //         showBackground: true,
          //         backgroundColor: backColor,
          //         distanceDisplayCondition: new DistanceDisplayCondition(10.0, 8000.0),
          //         disableDepthTestDistance: 100.0,
          //         scaleByDistance: new NearFarScalar(500, 1, 1400, 0.0),
          //         translucencyByDistance: new NearFarScalar(500, 1, 1400, 0.0)
          //       });
          //       entity.billboard = new BillboardGraphics({
          //         image: buildingTypeImage,
          //         width: 300,
          //         height: 140,
          //         pixelOffset: new Cartesian2(90, -25),   // 偏移量
          //         distanceDisplayCondition: new DistanceDisplayCondition(10.0, 2000.0),
          //         disableDepthTestDistance: 100.0,
          //         scaleByDistance: new NearFarScalar(500, 1, 1400, 0.0),
          //         translucencyByDistance: new NearFarScalar(500, 1, 1400, 0.0)
          //       });
          //     } else {
          //       if (status == 1) {
          //         entity.billboard = new BillboardGraphics({
          //           image: videoActiveImage,
          //           verticalOrigin: VerticalOrigin.BOTTOM
          //         })
          //       } else {
          //         entity.billboard = new BillboardGraphics({
          //           image: videoNotActiveImage,
          //           verticalOrigin: VerticalOrigin.BOTTOM
          //         })
          //       }
          //     }
          //     this.viewer.entities.add(entity);
          //   })
            
          //   // this.viewer.entities.add(__dataSource);
          // });
          // this.viewer.dataSource.add(dataSource);
          // GeoJsonDataSource.load('http://localhost:3000/positions.geojson').then((dataSource) => {
          //   viewer.dataSource.add(dataSource);
          //   console.log(dataSource);
          //   console.log(dataSource.entities.values);
          //   dataSource.entities.values.forEach((entity) => {
          //     entity.billboard = new BillboardGraphics({
          //       image: videoActiveImage,
          //       verticalOrigin: VerticalOrigin.BOTTOM
          //     })
          //   })
          // })
        });
      this.addClickEvent();
      this.screenSpaceClickPosition();
      this.screenSpaceViewAngleEvent();
    },
    addHtmlOverlay(element, position) {
      new HtmlOverlayInCesiumViewer({ element, containerId: 'cesiumContainer', position }, this.viewer);
    },

    // 添加广告牌
    addBillboard(billboardInfo) {
      let { position, name, buildingType, bsm, id } = billboardInfo;
      const style = 2;
      let backColor;
      let buildingTypeImage;
      if (!position) return;
      if (buildingType == '1') {
        backColor = new Color(88 / 255, 99 / 255, 246 / 255, 1.0);
        buildingTypeImage = p1;
      } else if (buildingType == '2') {
        backColor = new Color(60 / 255, 164 / 255, 65 / 255, 1.0);
        buildingTypeImage = p2;
      } else if (buildingType == '3') {
        backColor = new Color(26 / 255, 196 / 255, 228 / 255, 1.0);
        buildingTypeImage = p3;
      } else if (buildingType == '4') {
        backColor = new Color(190 / 255, 120 / 255, 10 / 255, 1.0);
        buildingTypeImage = p4;
      }
      this.viewer.entities.add({
        id: bsm,
        position: Cartesian3.fromDegrees(position[0], position[1], position[2]),
        label: {
          id: bsm,
          text: name,
          font: style == 1 ? '500 40px Microsoft YaHei' : '500 30px Helvetica', // 15pt monospace
          outlineColor: Color.WHITE,     // 边框颜色
          outlineWidth: 1,    // 边框宽度
          scale: 0.5,
          style: style == 1 ? LabelStyle.FILL_AND_OUTLINE : LabelStyle.FILL,
          fillColor: style == 1 ? Color.BLACK : Color.WHITE,
          pixelOffset: new Cartesian2(110, -50),   // 偏移量
          showBackground: true,
          backgroundColor: backColor,
          distanceDisplayCondition: new DistanceDisplayCondition(10.0, 8000.0),
          disableDepthTestDistance: 100.0,
          scaleByDistance: new NearFarScalar(500, 1, 1400, 0.0),
          translucencyByDistance: new NearFarScalar(500, 1, 1400, 0.0)
        },
        billboard: {
          image: buildingTypeImage,
          width: 300,
          height: 140,
          pixelOffset: new Cartesian2(90, -25),   // 偏移量
          distanceDisplayCondition: new DistanceDisplayCondition(10.0, 2000.0),
          disableDepthTestDistance: 100.0,
          scaleByDistance: new NearFarScalar(500, 1, 1400, 0.0),
          translucencyByDistance: new NearFarScalar(500, 1, 1400, 0.0)
        },
        properties: {
          poiType: 'buildingPOI',
          name,
          buildingType,
          bsm,
          position
        }
      });
    },

    // 添加摄像头
    addVideoBillboard(videoInfo) {
      let { bsm, id, name, position, status } = videoInfo;
      if (!position) return;
      if (status == 1) {
        this.viewer.entities.add({
          id: bsm,
          name,
          position: Cartesian3.fromDegrees(position[0], position[1], position[2]),
          billboard: {
            image: videoActiveImage,
            verticalOrigin: VerticalOrigin.BOTTOM
          },
          properties: {
            poiType: 'videoPOI',
            bsm,
            position,
            status
          }
        });
      } else {
        this.viewer.entities.add({
          id: bsm,
          name,
          position: Cartesian3.fromDegrees(position[0], position[1], position[2]),
          billboard: {
            image: videoNotActiveImage,
            verticalOrigin: VerticalOrigin.BOTTOM
          },
          properties: {
            poiType: 'videoPOI',
            bsm,
            position,
            status
          }
        });
      }
    },

    addClickEvent() {
      const handlerVideo = new ScreenSpaceEventHandler(this.viewer.scene.canvas);
      // handlerVideo.setInputAction((click) => {
      //   const pick = this.viewer.scene.pick(click.position);
      //   console.log(pick.id.properties,pick.id._billboard);
      //   if (pick && pick.id && (pick.id.properties && pick.id.properties.poiType && pick.id.properties.poiType._value !== 'polygonArea')) {
      //     if (this.lastPickBuild) {
      //       this.lastPickBuild._image._value = this.lastBckImage;
      //     }
      //     this.lastPickBuild = pick.id._billboard;
      //     this.lastBckImage = pick.id._billboard._image._value;
      //     pick.id.properties.poiType._value === 'buildingPOI' && (pick.id._billboard._image._value = highLight);
      //     this.$emit('clickBuild', pick.id.properties);
      //   }
      //   if (!pick || !pick.id) {
      //     this.lastPickBuild && (this.lastPickBuild._image._value = this.lastBckImage);
      //     this.$emit('cancelClickBuild', this.lastPickBuild);
      //   }
      // }, ScreenSpaceEventType.LEFT_CLICK);
      handlerVideo.setInputAction(debounce.call(
        this,
        function(click) {
          const pick = this.viewer.scene.pick(click.position);
          if (pick && pick.id && (pick.id.properties && pick.id.properties.poiType && pick.id.properties.poiType._value !== 'polygonArea')) {
            if (this.lastPickBuild) {
              this.lastPickBuild._image._value = this.lastBckImage;
            }
            this.lastPickBuild = pick.id._billboard;
            this.lastBckImage = pick.id._billboard._image._value;
            pick.id.properties.poiType._value === 'buildingPOI' && (pick.id._billboard._image._value = highLight);
            this.$emit('clickBuild', pick.id.properties);
          }
          if (!pick || !pick.id) {
            this.lastPickBuild && (this.lastPickBuild._image._value = this.lastBckImage);
            this.$emit('cancelClickBuild', this.lastPickBuild);
          }
        },
        300
      ), ScreenSpaceEventType.LEFT_CLICK);
    },

    flyToHome() {
      this.viewer.camera.setView({
        // fromDegrees()方法，将经纬度和高程转换为世界坐标
        destination: Cartesian3.fromDegrees(114.47992, 22.97861, 100.0),
        orientation: {
          // 指向
          heading: 2.93,
          // 视角
          pitch: -0.55,
          roll: 0
        }
      });
      this.viewer.homeButton.viewModel.command.beforeExecute.addEventListener((commandInfo) => {
        this.viewer.camera.flyTo({
          destination: new Cartesian3.fromDegrees(114.47992, 22.97861, 100.0),
          orientation: {
            heading: 2.93,
            pitch: -0.55,
            roll: 0.0
          },
          duration: 3
        });
        commandInfo.cancel = true;
      });
    },

    flyToDestination(locationInfo) {
      const { heading, pitch, range = 120 } = locationInfo;
      const entitie = this.viewer.entities.getById(locationInfo.bsm);
      if (!entitie) {
        this.$message({
          type: 'error',
          message: '当前建筑没有定位信息'
        });
      }
      if (heading != undefined && pitch != undefined) {
        this.viewer.flyTo(entitie, {
          offset: new HeadingPitchRange(parseFloat(heading), parseFloat(pitch), range)
        });
      } else {
        this.viewer.flyTo(this.viewer.entities.getById(locationInfo.bsm));
      }
    },

    // 画区域
    drawPolygon(id) {
      let handler = new ScreenSpaceEventHandler(this.viewer.scene.canvas);
      let positions = [];
      let poly;

      // 鼠标单击画点
      handler.setInputAction((movement) => {
        let cartesian = this.viewer.scene.camera.pickEllipsoid(movement.position, this.viewer.scene.globe.ellipsoid);
        if (positions.length == 0) {
          positions.push(cartesian.clone());
        }
        positions.push(cartesian);
      }, ScreenSpaceEventType.LEFT_CLICK);
      // 鼠标移动
      handler.setInputAction((movement) => {
        let cartesian = this.viewer.scene.camera.pickEllipsoid(movement.endPosition, this.viewer.scene.globe.ellipsoid);
        if (positions.length >= 2) {
          if (!defined(poly)) {
            poly = new PolygonPrimitive(this.viewer, positions, id);
          } else {
            if (cartesian != undefined) {
              positions.pop();
              cartesian.y += (1 + Math.random());
              positions.push(cartesian);
            }
          }
        }
      }, ScreenSpaceEventType.MOUSE_MOVE);
      // 鼠标右键单击结束绘制
      handler.setInputAction((movement) => {
        handler.destroy();
        positions.pop();
        let wgs84_positions = [];
        for (let i = 0; i < positions.length; i++) {
          let wgs84_point = this.Cartesian3_to_WGS84({
            x: positions[i].x,
            y: positions[i].y,
            z: positions[i].z
          });
          wgs84_positions.push(wgs84_point);
          this.positions = positions;
        }
        // params： 1. 区域, 2. 已圈标志
        this.$emit('drawComplete', wgs84_positions, this.getChoosedBuildings(wgs84_positions));
      }, ScreenSpaceEventType.RIGHT_CLICK);
    },

    // 笛卡尔坐标系转WGS84坐标系
    Cartesian3_to_WGS84(point) {
      let cartesian33 = new Cartesian3(point.x, point.y, point.z);
      let cartographic = Cartographic.fromCartesian(cartesian33);
      let lat = CesiumMath.toDegrees(cartographic.latitude);
      let lng = CesiumMath.toDegrees(cartographic.longitude);
      let alt = cartographic.height;
      return { lat, lng, alt };
    },

    // 获取鼠标点击位置的经纬度高程
    screenSpaceClickPosition() {
      const handler = new ScreenSpaceEventHandler(this.viewer.scene.canvas);
      handler.setInputAction((clickEvent) => {
        const position = this.viewer.scene.pickPosition(clickEvent.position);
        if (!position || (position && !(position.x && position.y))) return;
        const cartographic = Cartographic.fromCartesian(position);
        const longitude = CesiumMath.toDegrees(cartographic.longitude).toFixed(5);
        const latitude = CesiumMath.toDegrees(cartographic.latitude).toFixed(5);
        this.$emit('getBuildingPosition', {
          longitude,
          latitude,
          height: cartographic.height,
        });
      }, ScreenSpaceEventType.LEFT_CLICK);
    },

    // 获取摄像机视角
    screenSpaceViewAngleEvent() {
      const handler = () => {
        const position = Object.assign({}, this.viewer.camera.position);
        if (defined(position)) {
          
          // 将笛卡尔坐标转为经纬度和高程坐标（弧度制）
          const cartographic = Cartographic.fromCartesian(position);
          // 经纬度 弧度转角度
          const longitude = CesiumMath.toDegrees(cartographic.longitude).toFixed(5);
          const latitude = CesiumMath.toDegrees(cartographic.latitude).toFixed(5);
          this.$emit('getScreenSpaceViewAngleInfo', {
            cameraLongitude: longitude,
            cameraLatitude: latitude,
            cameraHeight: cartographic.height,
            heading: this.viewer.scene.camera.heading,
            pitch: this.viewer.scene.camera.pitch,
            roll: this.viewer.scene.camera.roll,
            position
          });
        }
      };
      this.viewer.camera.moveEnd.addEventListener(handler);
    },
    removeEntitie(id) {
      if (this.viewer.entities.getById(id)) {
        this.viewer.entities.remove({ id });
      } else {
        console.error(`标注不存在${id}`);
      }
    },

    // 标记已圈选的标识
    getChoosedBuildings(areaPoints) {
      // 获取圈选内但未被选中的点
      const newCheckedBuilding = [];
      
      this.buildingInfoList.forEach((buildingInfo) => {
        const { position } = buildingInfo;

        // 是否在当前圈选的区域中
        const isInArea = insidePolygon(areaPoints, position);
        if (isInArea) {
          
          // 是否已被圈选过
          if (
            !this.checkedBuildings.some(buildingItem => {
              return buildingInfo.bsm === buildingItem.bsm;
            })
          ) {
            newCheckedBuilding.push(buildingInfo);
          }
        }
      });
      this.checkedBuildings.push(...newCheckedBuilding);
      return newCheckedBuilding;
    },

    // 删除区域，并且取消该区域的选中标识点
    deleteArea(areaInfo, id) {
      const { buildingInfoList } = areaInfo;

      // 取消区域选中标识点
      buildingInfoList.forEach((buildingInfo) => {
        const index = this.checkedBuildings.findIndex(checkedBuilding => {
          return checkedBuilding.bsm === buildingInfo.bsm;
        });
        if (index > -1) {
          this.checkedBuildings[index] && (this.checkedBuildings[index].out = true);
        }
      });
      this.checkedBuildings = this.checkedBuildings.filter(checked => !checked.out);
      this.removeEntitie(id);
    }


  }

};
</script>

<style lang="scss" scoped>
#cesiumContainer {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  /deep/ .cesium-viewer-infoBoxContainer {
    display: none!important;
  }

  /deep/ .cesium-viewer-toolbar {
    top: 45px;
    right: 45px;
  }
  /deep/ .active {
    display: block!important;
    background-color: unset!important;
  }
  /deep/ .hide {
    display: none!important;
    background-color: unset!important;
  }

  // 摄像头信息框
  /deep/ #video {
    display: flex;
    user-select: none;
    transform: translateY(-100%);
    pointer-events: none;
    .video-info {
      width: 300px;
      height: 349px;
      display: flex;
      flex-direction: column;
      position: relative;
      background: url('../../assets/images/video_frame.png');
      background-size: 100% 100%;
    }
    .video-info-close {
      position: absolute;
      width: 15px;
      height: 15px;
      top: 20px;
      right: 10px;
      background-size: 100% 100%;
    }
    .video-img {
      margin: 40px 20px 0;
      height: calc(60% - 40px);
      background-image: url('../../assets/images/videoImage.png');
      background-size: 100% 100%;
    }
    
    .info-box {
      height: 40%;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #FFF;
    }
        
    .camera-name {
      padding: 5px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }
    .camera-location {
      padding: 5px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .camera-btn {
      padding: 5px;
      width: 40px;
      height: 20px;
      margin-top: 5px;
      background-image: url('../../assets/images/playbtn.svg');
      background-size: 100% 100%;
      cursor: pointer;
      pointer-events: all;
    }
  }

  // 建筑信息框
  /deep/ #build-info {
    position: relative;
    transform: translate(-15%, -135%);
    pointer-events: none;
    .info-box {
      width: 300px;
      height: 250px;
      background: url('../../assets/images/community_bg.png');
      background-size: 100% 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      position: relative;
    }
    .box-item {
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin: 0px 20px;
      border: #02B7FF 1px solid;
      width: 200px;
      height: 40px;
      color: #FFF;
      cursor: pointer;
      pointer-events: all;
    }
    .box-item>span {
      width: 100px;
      text-align: center;
    }
  }
  /deep/ .box-close-icon {
    position: absolute;
    top: 14px;
    right: 16px;
    width: 13px;
    height: 13px;
    cursor: pointer;
    background: url('../../assets/images/close.png');
    pointer-events: all;
  }
}
</style>