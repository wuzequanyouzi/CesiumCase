# cesium-demo-for-vue

本来这个CesiumCase项目是想将Cesium的多种案例给写下来的
## 目前已实现的案例：
### 地图底图
1.  谷歌地图 components/GoogleMap
2.  高德地图 components/GaodeMap
3.  天地图   components/TiandituMap
4.  百度地图 components/BaiduMap

### 坐标点实体的
1.  聚合点    components/pointsOptions/PointClusterer
2.  实体旋转  components/pointsOptions/PointRotation

### 特效动效类的
1.  线图元的自定义材质（流动特效）  components/specialEffects/PolylineTrailLink
2.  billboard实体的放大缩小       components/specialEffects/ScalePrimitive

### 生产项目中实现的3D地图主组件
components/map/Map3D.vue  主要实现了区域绘制

### Want to say
本来是想慢慢的实现Cesium的多个案例，因为国内Cesium的资料案例太少了。但是近期发现自己可能点错技能树了（不想走WebGis），所以近期没去学Cesium了，新的案例也没实现。