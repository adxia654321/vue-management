<script setup>
import { Avatar, Document, Histogram, HomeFilled, InfoFilled, Menu, Promotion, Share, Tools } from '@element-plus/icons-vue';

</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <span class="title">嚕嚕課程輔助系統</span>
        <span class="right_tool">
          <a href="">
            <el-icon>
              <EditPen />
            </el-icon> 修改密碼 &nbsp;&nbsp;&nbsp;&nbsp;|
          </a>
          <a href="">
            <el-icon>
              <SwitchButton />
            </el-icon> 登出
          </a>
        </span>
      </el-header>

      <el-container>
        <el-aside width="200px" class="aside">

          <!--左側菜單-->
          <el-menu router>
            <!--首頁菜單-->

            <el-menu-item index="/index">
              <el-icon>
                <Promotion />
              </el-icon>首頁
            </el-menu-item>



            <!--班級管理菜單-->
            <el-sub-menu index="/manage">
              <template #title>
                <el-icon>
                  <Menu />
                </el-icon>班級學生管理
              </template>

              <el-menu-item index="/clazz"><el-icon>
                  <HomeFilled />
                </el-icon>班級管理</el-menu-item>
              <el-menu-item index="/stu"><el-icon>
                  <UserFilled />
                </el-icon>學生管理</el-menu-item>
            </el-sub-menu>

            <!--部門員工菜單-->
            <el-sub-menu index="system">
              <template #title>
                <el-icon>
                  <Tools />
                </el-icon>部門員工管理
              </template>
              <el-menu-item index="/dept"><el-icon>
                  <HelpFilled />
                </el-icon>部門管理</el-menu-item>
              <el-menu-item index="/emp"><el-icon>
                  <Avatar />
                </el-icon>員工管理</el-menu-item>

              <!--數據統計菜單-->
            </el-sub-menu>
            <el-sub-menu index="/report">
              <template #title>
                <el-icon>
                  <Histogram />
                </el-icon>數據統計管理
              </template>

              <el-menu-item index="/empReport"><el-icon>
                  <InfoFilled />
                </el-icon>員工數據統計</el-menu-item>
              <el-menu-item index="/stuReport"><el-icon>
                  <Share />
                </el-icon>學生數據統計</el-menu-item>
              <el-menu-item index="/log"><el-icon>
                  <Document />
                </el-icon>日誌訊息統計</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>

        <el-main>
          <router-view></router-view>
        </el-main>

      </el-container>
    </el-container>
  </div>
</template>


<style>
/* 全局样式，确保布局占满整个视口高度 */
html,
body,
#app,
/* 假设 #app 是您Vue应用的根元素 */
.common-layout {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}

/* 1. 第一层 el-container（包 header + 第二层）要撑满 100% */
.common-layout > .el-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 2. 第二层 el-container（包 aside + main），高度 = 100% - header(60px) */
.common-layout > .el-container > .el-container {
  display: flex;
  /* 如果 el-header 的实际高度不是 60px，请改成对应数值 */
  height: calc(100% - 60px);
}

/* 3. 让 el-aside（和你给它的 .aside）撑满父容器 */
.el-aside,
.aside {
  height: 100%;
  /* 如果需要分隔线，可以取消注释下面一行 */
  /* border-right: 1px solid #e0e0e0; */
}

/* 4. 让 el-menu 填满 el-aside，这样菜单整个高度都被撑开 */
.el-menu {
  height: 100%;
}

/* 5. el-menu 内部链接保持原有样式 */
.el-menu a {
  text-decoration: none;
  color: inherit;
  height: 100%;
}

/* 6. 头部样式保持不变 */
.header {
  background-color: #34495E;
  /* background-image: linear-gradient(
    to right,
    /* #00547d,
    #007fa4,
    #00aaa0,
    #00d072,
    #a8eb12 */

  /* ); */ 
  /* Element Plus el-header 默认高度是 60px，这与背景图匹配 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

/* 标题文字 */
.title {
  color: white;
  font-size: 40px;
  font-family: "楷体", KaiTi, serif;
  line-height: 60px;
  font-weight: bolder;
  font-family: "DFKai-SB", "KaiTi", cursive, serif;
}

/* 右侧工具区 */
.right_tool {
  display: flex;
  align-items: center;
}

.right_tool a {
  color: white;
  text-decoration: none;
  margin-left: 20px;
  display: inline-flex;
  align-items: center;
  font-size: 16px;
}

.right_tool a .el-icon {
  margin-right: 5px;
}

/* Main 区域（如果需要额外样式在此添加） */
.el-main {
  /* 例如：background-color 或 padding 等 */
}

</style>
