<template>
  <div>
    <!--头部开始-->
    <div class="header">
      <section class="row">
        <label class="label">影片名称</label>
        <input class="search" type="text" v-model="state.input" :placeholder="state.placeholder" @keyup.enter="search">
      </section>
      <section class="row" v-for="(tag,id) in state.tags" :key="id">
        <label class="label space">{{tag.name}}</label>
        <div class="right-btns">
          <span v-for="(value,index) in tag.values"
                :key="index"
                class="item"
                :class="{active: tag.flag === index }"
                @click="searchByTag(tag.type, id, value, index)">
            {{value}}
          </span>
        </div>
      </section>
    </div>
    <!--头部结束-->
    <!--内容开始-->
    <div class="container">
      <div class="box" v-for="(movie,id) in state.movies" :key="id">
        <a class="box-a" :href="movie.doubanUrl" target="_blank">
          <div class="poster">
            <img :src="movie.poster" alt="">
          </div>
          <p class="text">
            <span class="year">{{movie.year}}</span>
            <span class="category">{{transformGenres(movie.genres)}}</span>
          </p>
          <div class="mask">
            <div class="top">
              <div class="movie-name">{{movie.name}}</div>
            </div>
            <div class="bottom">
              <div class="movie-icon"></div>
            </div>
          </div>
        </a>
      </div>
    </div>
    <!--内容结束-->
    <!--分页开始-->
    <div class="pagination-container">
      <div class="flex1"></div>
      <el-pagination
          background
          :hide-on-single-page="true"
          layout="total, prev, pager, next, jumper"
          :page-size="state.pageSize"
          @current-change="handleCurrentChange"
          :total="state.total">
      </el-pagination>
    </div>
    <!--分页结束-->
  </div>
</template>

<script>
  import {reactive, onMounted, watchEffect} from 'vue'
  import lodash from 'lodash'
  import {tags} from '../constant'

  export default {
    name: 'App',
    setup() {
      const state = reactive({
        placeholder: '复仇者联盟',
        input: '',
        total: 0,
        pageSize: 12,
        query: {skip: 0, limit: 12},
        movies: [],
        tags
      })

      // 类别 数组变字符串
      function transformGenres(value) {
        if (!value) return ''
        return value.slice(0, 3).join(' / ')
      }

      // 搜索
      function search() {
        state.query.q = state.input
        if (state.query.q) {
          lodash.debounce(fetchData(state.query), 2000)
        }
      }

      // 标签搜索
      function searchByTag(tag, id, value, index) {
        state.tags[id].flag = index
        state.query[tag] = value
        if (value === '其他') state.query[tag] = ''
        if (value === '全部') delete state.query[tag]
        fetchData(state.query)
      }

      // 分页
      function handleCurrentChange(page) {
        state.query.skip = (page - 1) * state.query.limit
        fetchData(state.query)
      }

      // 图片防盗链问题解决
      // 也可以在meta加 no-referrer 比较简单
      function attachImageUrl(srcUrl) {
        if (srcUrl !== undefined) {
          return srcUrl.replace(/http\w{0,1}:\/\/s/g, 'https://images.weserv.nl/?url=s')
        }
      }

      // 数据请求
      const fetchData = async (query) => {
        let keys = Object.keys(query)
        const queryString = keys.map(key => `${key}=${query[key]}`).join('&')
        const page = await fetch(`http://39.106.81.114:3001/movies?${queryString}`)
          .then(res => res.json())
        state.movies = page.data
        state.total = page.total
      }
      onMounted(() => {
        fetchData(state.query)
        // watchEffect(() => {
        //   fetchData(state.query)
        // })
      })

      return {state, search, searchByTag, transformGenres, handleCurrentChange}
    }
  }
</script>

<style>
  .header {
    width: 100%;
    height: 200px;
    margin: 10px;
    background: #ffffff;
    font-size: 12px;
  }

  .header .search {
    width: 200px;
    outline: 0;
    border-radius: 4px;
    border: 1px solid #c8cccf;
    padding: 0 1em;
  }


  .label {
    outline: 0;
    border-radius: 15px;
    background-image: linear-gradient(to right, #E54257, #F1AA97);
    border: none;
    height: 30px;
    color: rgb(255, 255, 255);
    line-height: 30px;
    padding: 0 10px;
    margin: 0 10px;
  }

  .label.space {
    word-spacing: 1.8em;
  }

  .row {
    padding: 10px 0;
    display: flex;
  }

  .right-btns {
    display: flex;
  }

  .item {
    display: block;
    border: 1px solid #ccc;
    border-right: none;
    text-align: center;
    height: 28px;
    padding: 0 8px;
    line-height: 28px;
    cursor: pointer;
  }

  .item.active {
    background: #e58e7f;
    border-color: #e58e7f;
  }

  .item:first-child {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  .item:last-child {
    border-right: 1px solid #ccc;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  .container {
    margin-top: 20px;
    width: 100%;
    height: 800px;
    padding: 10px;
    display: grid;
    grid-template-columns: repeat(auto-fill, 210px);
    grid-template-rows: repeat(auto-fill, 300px);
    grid-gap: 20px;
  }

  .box {
    background: #ffffff;
    padding: 20px;
    box-shadow: 0 2px 5px #333;
    cursor: pointer;
    position: relative;
  }

  .box .box-a {
    display: block;
  }

  .box .mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: none;
  }

  .box .mask .top {
    position: absolute;
    top: 0;
    width: 100%;
    height: 180px;
    background: rgba(0, 0, 0, 0.2);
  }

  .box .mask .top .movie-name {
    color: #ffffff;
    text-align: center;
    margin-top: 15px;
    font-weight: bold;
  }

  .box .mask .bottom {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 120px;
    background: rgba(129, 216, 145, 0.4);
  }

  .box .mask .bottom .movie-icon {
    width: 40px;
    height: 40px;
    background: #ffffff;
    border-radius: 15px;
    margin: 20px auto auto;
  }

  .box .mask .bottom .movie-icon:after {
    display: block;
    content: '';
    width: 32px;
    height: 32px;
    background: url("/movie32.png") 2px 2px no-repeat;
  }

  .box:hover .mask {
    display: block;
  }

  .box .poster img {
    width: 170px;
    height: 230px;
  }

  .box .text {
    height: 30px;
    line-height: 30px;
    font-size: 12px;
  }

  .box .text .year {
    color: #A1BC8A;
    background: #F2F8EA;
    border: 1px solid #F2F3EC;
    padding: 0 2px;
    border-radius: 2px;
    margin-right: 10px;
  }

  .box .text .category {
    color: #82B2F8;
    background: #EBF5FB;
    border: 1px solid #E8ECF6;
    padding: 0 5px;
    border-radius: 2px;
  }

  .flex1 {
    flex: 1;
  }

  .pagination-container {
    display: flex;
    margin: 20px;
  }
</style>
