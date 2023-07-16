# meetingManage_Backend
## 資料庫設定
1. 打開phpmyadmin，導入`meeting_manage.sql`
2. 打開`config.yml`，把資料庫的帳號密碼換成自己的
## 啟動程式
1. 利用`npm i`安裝dependencies
2. 利用`npm run debug`啟動程式
## postman collection
打開postman，導入`會議管理系統.postman_collection.json`collection，裡面有api的範例，關於登入也可以參考`login_example.py`，預先開了兩支帳號，一隻帳號管理員，一隻帳號一般使用者，帳號密碼在`測試帳號.csv`，不過權限還沒完全弄完
## reference
- https://typeorm.bootcss.com/
- https://github.com/nestjs/nest-cli/issues/323
- https://ithelp.ithome.com.tw/users/20119338/ironman/3880
- https://ithelp.ithome.com.tw/users/20117701/ironman/2634
- https://ithelp.ithome.com.tw/users/20120107/ironman/4699
- https://ithelp.ithome.com.tw/users/20119338/ironman/3880
- https://newideas.coderbridge.io/series/5da7be55424249a291ce0c564616ece0
- https://stackoverflow.com/questions/63678216/nestjs-setup-typeorm-connection-with-env-and-nestjs-config
- https://www.youtube.com/watch?v=QL3KXE1hOgA
- https://israynotarray.com/vscode/20210709/4359299/