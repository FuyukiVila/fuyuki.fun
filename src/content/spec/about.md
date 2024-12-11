> **Yuki snowed the night.**

### **关于 Blog**

本站从 [**2024.12.9**](https://time.is/zh/) 至今已经运行<span id="htmer_time" style="color: #90CAF9; font-weight: bold;"></span>

本站使用开源静态网页生成工具 [Astro](https://astro.build/)，主题使用 saicaca 提供的 [fuwari](https://github.com/saicaca/fuwari)

托管于 [Vercel](https://vercel.com/)

### **版权声明**

博客内的所有原创内容（包括但不限于文章、图像等）除特别声明外均使用[知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议](https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.zh-hans)进行授权，转载请声明来自 [Fuyuki_Vila](https://yuki.fuyuki.fun/)

### **另一个小站**

[**イルミネーション**](https://hikari.fuyuki.fun/)

<script>
function secondToDate(second) {
     if (!second) {
         return 0;
     }
     var time = new Array(0, 0, 0, 0, 0);
     if (second >= 365 * 24 * 3600) {
        time[0] = parseInt(second / (365 * 24 * 3600));
        second %= 365 * 24 * 3600;
    }
    if (second >= 24 * 3600) {
        time[1] = parseInt(second / (24 * 3600));
        second %= 24 * 3600;
    }
    if (second >= 3600) {
        time[2] = parseInt(second / 3600);
        second %= 3600;
    }
    if (second >= 60) {
        time[3] = parseInt(second / 60);
        second %= 60;
    }
    if (second > 0) {
        time[4] = second;
    }
    return time;
};
function setTime() {
         // 博客创建时间秒数，时间格式中，月比较特殊，是从0开始的，所以想要显示5月，得写4才行，如下
         var create_time = Math.round(new Date(Date.UTC(2024, 11, 9, 0, 0, 0)).getTime() / 1000);// 当前时间秒数,增加时区的差异
         var timestamp = Math.round((new Date().getTime() + 8 * 60 * 60 * 1000) / 1000);
         currentTime = secondToDate((timestamp - create_time));
         if (currentTime[0]==0){
          currentTimeHtml = currentTime[1] + '天'+ currentTime[2] + '时' + currentTime[3] + '分' + currentTime[4] + '秒';
         }else{
          currentTimeHtml = currentTime[0] + '年' + currentTime[1] + '天' + currentTime[2] + '时' + currentTime[3] + '分' + currentTime[4] + '秒';
         }
   // 兼容pjax，当htmer_time存在时输出，否则清空计时器
   if (document.getElementById("htmer_time")){
    document.getElementById("htmer_time").innerHTML = currentTimeHtml;
   }else{
     clearInterval(timer);
   }
}
var timer = setInterval(setTime, 1000);
</script>
