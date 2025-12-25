import { defineStore } from "pinia";

export const useMenuStore = defineStore("menu", {
  state: () => ({
    menuList: [],
  }),
  actions: {
    setMenu(list) {
      this.menuList = list || [];
      // 同步到本地缓存
      localStorage.setItem("menuList", JSON.stringify(this.menuList));
    },
    loadFromCache() {
      const raw = localStorage.getItem("menuList");
      if (raw) {
        try {
          this.menuList = JSON.parse(raw);
        } catch {
          this.menuList = [];
        }
      }
    },
  },
});
