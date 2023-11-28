# db

嘗試用docker起mysql跟phpmyadmin服務，擺脫mamp一直煩你要登雲端

## 使用方法(相關設定值以docker-compose.yml為準)
1. 確保電腦上面有裝docker與docker compose
2. terminal進到db資料夾，利用`docker-compose up -d`啟動服務
3. 瀏覽器打開連上`localhost:8081`即可連上phpmyadmin
   - 伺服器名稱填`db`！！！
   - 帳號密碼看設定填(docker-compose.yml有寫)