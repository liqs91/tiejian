<div align="center">
<h1> admin-pro</h1>
</div>

# 🔈 在线文档
https://vue-admin-beautiful.com/vab-vip-newbooks2022/


# 🔈 框架使用
## 2.项目运行
### 1)安装依赖，如果在IDE里直接安装报错，就执行命令行安装依赖
- `npm install --force --registry=https://registry.npm.taobao.org&&cnpm i image-webpack-loader -D`
- <font color="red">ps:plus版本安装依赖，在安装cavas时会报错，可以手工安装</font>
- `npm i canvas@2.8.0`
- <font color="red">ps:安装成功之后重新安装依赖</font>
- `cnpm i image-webpack-loader -D`
- <font color="red">ps:（可能会报错，多尝试安装几次）</font>
### 2)项目运行
#### ①命令：`npm run serve`
#### ②配置运行
  <font color="red">ps:如果提示缺少依赖根据提示手工安装，安装完成之后重新运行</font>

## 3.打包

- `npm run build`
- <font color="red">ps:如果打包提示失败，运行指令：</font>
  `cnpm i image-webpack-loader -D`

## 4.代码生成

- 💻 命令：<code>npm run template</code>
 <font color="red">ps:如果报错，升级node到14.13.1或16以上版本，windows下载对应的版本重新安装或绿色版覆盖即可</font>
- 📝 根据提示选择所要创建的内容(view、curd、component、mok&api、vuex)
- 🗃 运行代码修复 `npm run lint`
- 📌 配置路由启动

## 🌱 后台对接
1. 设置后台地址
2. 路由模式调整
### 基础功能调整完成情况（页面待完善）
1. 区域管理
2. 用户管理
3. 菜单管理
4. 角色管理
5. 数据字典
6. 系统配置

