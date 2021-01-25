<template>
  <div id="app">
    <div id="nav">
      <!-- <router-link to="/">Home</router-link> |
      <router-link to="/PolylineTrailLink">PolylineTrailLink</router-link> |
      <router-link to="/ScalePrimitive">ScalePrimitive</router-link> -->
      <span v-for="(menuItem, index) in menuList" :key="menuItem.name">
        <router-link :to="menuItem.path">{{menuItem.name}}</router-link>
        <span v-if="index !== menuList.length - 1"> | </span>
      </span>
    </div>
    <router-view/>
  </div>
</template>

<script>

export default {
  data() {
    return {
      menuList: [
        {
          name: 'Home',
          path: '/'
        },
        {
          name: 'PolylineTrailLink',
          path: '/PolylineTrailLink'
        },
        {
          name: 'ScalePrimitive',
          path: '/ScalePrimitive'
        },
        {
          name: 'GoogleMap',
          path: '/GoogleMap'
        },
        {
          name: 'GaodeMap',
          path: '/GaodeMap'
        },
        {
          name: 'BaiduMap',
          path: '/BaiduMap'
        },
        {
          name: 'Tianditu',
          path: '/Tianditu'
        },
        {
          name: 'PointClusterer',
          path: '/PointClusterer'
        },
        {
          name: 'PointRotation',
          path: '/PointRotation'
        }
      ]
    }
  },
  methods: {

  }
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
