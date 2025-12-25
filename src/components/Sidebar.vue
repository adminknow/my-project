<!-- src/components/Sidebar.vue -->
<template>
  <div class="sidebar">
    <el-menu :default-active="onRoutes" router :collapse="sidebarCollapsed" unique-opened background-color="#324157"
      text-color="#bfcbd9" active-text-color="#20a0ff" class="sidebar-el-menu">
      <div v-for="(item, index) in menuList" :key="item.RightName">
        <el-sub-menu :index="item.RightID.toString()" v-if="item.ParentRightID == 0">
          <template #title>
            <el-icon>
              <Menu />
            </el-icon>
            <span v-if="!sidebarCollapsed">{{ item.RightName }}</span>
          </template>
          <el-menu-item v-for="value in item.Children" :key="value.RightID" :index="value.UrlPath"> <el-icon>
              <Menu />
            </el-icon>
            <span >{{ value.RightName }}</span>
          </el-menu-item>
        </el-sub-menu>
      </div>
    </el-menu>
  </div>

</template>

<script setup>
import { ref, reactive } from "vue";
import { Menu } from '@element-plus/icons-vue'
import { useLayoutStore } from '@/stores/layout'
import { useMenuStore } from '@/stores/menu'
import { computed } from 'vue'
import { GetMyMenuList } from "@/api/common.js";
import { useRoute } from "vue-router";
const menuList = ref([])
const route = useRoute();
const GetMyMenuListApi = async () => {
  let res = await GetMyMenuList({ CascadeMenu: false })
  if (res && res.Code === 200) {
    let menu = [];
    for (let i = 0; i < res.DataMap.length; i++) {
      const element = res.DataMap[i];
      let menuObject = {
        RightID: element.RightID,
        RightName: element.RightName,
        ParentRightID: element.ParentRightID,
        UrlPath: element.UrlPath,
        Children: []
      }
      if (element.ParentRightID === 0) {
        // 一级菜单
        menu.push(menuObject);
      } else {
        // 二级菜单
        for (let j = 0; j < menu.length; j++) {
          const parentElement = menu[j];
          if (parentElement.RightID === element.ParentRightID) {
            parentElement.Children.push(menuObject);
            break;
          }
        }
      }
      // menuList.value = res.DataMap;
      // console.log('菜单列表', menuList.value);
    }
    menuList.value = menu;
  }

}
GetMyMenuListApi();

const onRoutes = computed(() => {
  return route.path.replace("/", "");
});
const layoutStore = useLayoutStore()
const sidebarCollapsed = computed(() => layoutStore.sidebarCollapsed)
</script>

<style scoped>
/* 侧边栏 */
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}

.sidebar>ul {
  height: 100%;
}
</style>