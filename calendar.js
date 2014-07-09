function getCalendar(type){
  // get selected year and month
  var ms = document.getElementById("monthSelect");
  var month = ms.selectedIndex;
  var ys = document.getElementById("yearSelect");
  var year = ys.selectedIndex+2010;
  var today = new Date();
  switch(type){
  case 1:
    month = today.getMonth();
    year = today.getFullYear();
    ys.selectedIndex = year-2010;
    ms.selectedIndex = month;
    break;
  case 2:
    if(ys.selectedIndex==0)break;
    year = year-1;
    ys.selectedIndex = year-2010;
    break;
  case 3:
    if(ys.selectedIndex==5)break; //needs to count total number of years...
    year = year+1;
    ys.selectedIndex = year-2010;
    break;
  case 4:
    if(ms.selectedIndex==0)break;
    month = month-1;
    ms.selectedIndex = month;
    break;
  case 5:
    if(ms.selectedIndex==11)break;
    month = month+1;
    ms.selectedIndex = month;
    break;
  }
  var thisMonth = (month==today.getMonth())&&(year==today.getFullYear());
    
  //get the day number of the first day of the selected month
  var firstDay = new Date(year,month,1).getDay();
    
  //get number of days of the selected month
  var numDays = new Date(year,month+1,0).getDate();
    
  //draw table
  var indColumn=0;
  var i=0; var d=1;
  var html = "";
  html += "<tr class='nameRow'><th class='weekend dayId chinese'>星期日</th><th class='weekday dayId chinese'>星期一</th><th class='weekday dayId chinese'>星期二</th><th class='weekday dayId chinese'>星期三</th><th class='weekday dayId chinese'>星期四</th><th class='weekday dayId chinese'>星期五</th><th class='weekend dayId chinese'>星期六</th></tr>";
  html += "<tr class='monthRow'>";
  for (;i<firstDay;i++){
    html+="<td></td>";
    indColumn++;
  }
  /*for(;d<=numDays;d++){
    if(thisMonth&&(d == today.getDate())){
      html+='<td style = "background-color:#7fa7cb"><div>';
      html+=d;
    }
    else{
      html+="<td><div>";
      html+=d;
    }
    html+="</div><div class='chinese'>";
    html+=lunarInfo(year,month+1,d);
    html+="</div></td>";
    indColumn++;
    if(indColumn==7){
      indColumn=0;
      html+="</tr><tr>";
    }
  }*/
  for(;d<=numDays;d++){
    html+='<td class="';
    if(thisMonth&&(d == today.getDate())){
      html+='today ';
    }
    else if(indColumn==0||indColumn==6){
      html+='weekend ';
    }
    else{
      html+='weekday ';
    }
    html+='"><div class="number">';
    html+=d;
    html+='</div><div class="chinese">';
    html+=lunarInfo(year,month+1,d);
    html+="</div></td>";
    indColumn++;
    if(indColumn==7){
      indColumn=0;
      html+="</tr><tr class='monthRow'>";
    }
  }
  while(indColumn > 0 && indColumn<7){
    html+="<td></td>";
    indColumn++;
  }
  html+="</tr>";

  document.getElementById("fillMonth").innerHTML = html;
}

//get lunar date from a solar date
var LunarDate = {
  madd: new Array(0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334),
  HsString: '甲乙丙丁戊己庚辛壬癸',
  EbString: '子丑寅卯辰巳午未申酉戌亥',
  NumString: "一二三四五六七八九十",
  MonString: "正二三四五六七八九十冬腊",
  CalendarData: new Array(0xA4B, 0x5164B, 0x6A5, 0x6D4, 0x415B5, 0x2B6, 0x957, 0x2092F, 0x497, 0x60C96, 0xD4A, 0xEA5, 0x50DA9, 0x5AD, 0x2B6, 0x3126E, 0x92E, 0x7192D, 0xC95, 0xD4A, 0x61B4A, 0xB55, 0x56A, 0x4155B, 0x25D, 0x92D, 0x2192B, 0xA95, 0x71695, 0x6CA, 0xB55, 0x50AB5, 0x4DA, 0xA5B, 0x30A57, 0x52B, 0x8152A, 0xE95, 0x6AA, 0x615AA, 0xAB5, 0x4B6, 0x414AE, 0xA57, 0x526, 0x31D26, 0xD95, 0x70B55, 0x56A, 0x96D, 0x5095D, 0x4AD, 0xA4D, 0x41A4D, 0xD25, 0x81AA5, 0xB54, 0xB6A, 0x612DA, 0x95B, 0x49B, 0x41497, 0xA4B, 0xA164B, 0x6A5, 0x6D4, 0x615B4, 0xAB6, 0x957, 0x5092F, 0x497, 0x64B, 0x30D4A, 0xEA5, 0x80D65, 0x5AC, 0xAB6, 0x5126D, 0x92E, 0xC96, 0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B, 0xA93, 0x40E95),
  Year: null,
  Month: null,
  Day: null,
  TheDate: null,
  GetBit: function(m, n){
    return (m >> n) & 1;
  },
  e2c: function(){
    this.TheDate = (arguments.length != 3) ? new Date(): new Date(arguments[0], arguments[1], arguments[2]);
    var total, m, n, k;
    var isEnd = false;
    var tmp = this.TheDate.getFullYear();
    total = (tmp - 1921) * 365 + Math.floor((tmp - 1921) / 4) + this.madd[this.TheDate.getMonth()] + this.TheDate.getDate() - 38;
    if (this.TheDate.getYear() % 4 == 0 && this.TheDate.getMonth() > 1) {
      total++;
    }
    for (m = 0; ; m++) {
      k = (this.CalendarData[m] < 0xfff) ? 11: 12;
      for (n = k; n >= 0; n--) {
        if (total <= 29 + this.GetBit(this.CalendarData[m], n)) {
          isEnd = true;
          break;
        }
        total = total - 29 - this.GetBit(this.CalendarData[m], n);
      }
      if (isEnd)
      break;
    }
    this.Year = 1921 + m;
    this.Month = k - n + 1;
    this.Day = total;
    if (k == 12) {
      if (this.Month == Math.floor(this.CalendarData[m] / 0x10000) + 1) {
        this.Month = 1 - this.Month;
      }
      if (this.Month > Math.floor(this.CalendarData[m] / 0x10000) + 1) {
        this.Month--;
      }
    }
  },
  GetcDateString: function(){
    var tmp = "";
    if(this.Day==1){
      if (this.Month < 1) {
        tmp += "闰";
        tmp += this.MonString.charAt(-this.Month - 1);
      }
      else {
        tmp += this.MonString.charAt(this.Month - 1);
      }
      tmp += "月";
    }
    else{
      tmp += (this.Day < 11) ? "初": ((this.Day < 20) ? "十": ((this.Day< 21) ?"二十":((this.Day < 30) ? "廿": "三十")));                        
      if (this.Day % 10 != 0 || this.Day == 10) {
        tmp += this.NumString.charAt((this.Day - 1) % 10);
      }
    }
    return tmp;
  },
  GetLunarDay: function(solarYear, solarMonth, solarDay) {
    if (solarYear < 1921 || solarYear > 2020) {
      return "";
    }
    else {
      solarMonth = (parseInt(solarMonth) > 0) ? (solarMonth - 1): 11;
      this.e2c(solarYear, solarMonth, solarDay);
      return this.GetcDateString();
    }
  },
  GetLDay: function(solarYear,solarMonth,solarDay) {
    solarMonth = (parseInt(solarMonth) > 0) ? (solarMonth - 1): 11;
    this.e2c(solarYear, solarMonth, solarDay);
    return this.Day;
  },
  GetLMonth: function (solarYear,solarMonth,solarDay) {
    solarMonth = (parseInt(solarMonth) > 0) ? (solarMonth - 1): 11;
    this.e2c(solarYear, solarMonth, solarDay);
    return this.Month;
  }
};

function getNowMonth()
{
  var htmlSideBox = "";
  var today = new Date();
  htmlSideBox += today.getFullYear();
  htmlSideBox += "-";
  if(today.getMonth()<10){
    htmlSideBox +="0";
  }
  htmlSideBox+=today.getMonth()+1;
  document.getElementById("sideBox-1").innerHTML = htmlSideBox;
}

function lunarInfo(sYear,sMonth,sDay) //sMonth = 1,2,3,...
{
  // lunar festivals
  var lDay = LunarDate.GetLDay(sYear,sMonth,sDay);
  var lMonth = LunarDate.GetLMonth(sYear,sMonth,sDay);
  for(i in lFtv){
    if((parseInt(lFtv[i].substr(0,2))==lMonth)&&(parseInt(lFtv[i].substr(2,4))==lDay)){
      return lFtv[i].substr(5);
    }
  }
	
  // solar festivals
  for(i in sFtv){
    if((parseInt(sFtv[i].substr(0,2))==sMonth)&&(parseInt(sFtv[i].substr(2,4))==sDay)){
      return sFtv[i].substr(5);
    }
  }
	
  // solar terms
  offDate = new Date((31556925974.7*(sYear-1900)+sTermInfo[sMonth*2-1]*60000)+Date.UTC(1900,0,6,2,5))
  if (offDate.getUTCDate()==sDay) return solarTerm[sMonth*2-1];
  offDate = new Date((31556925974.7*(sYear-1900)+sTermInfo[sMonth*2-2]*60000)+Date.UTC(1900,0,6,2,5))
  if (offDate.getUTCDate()==sDay) return solarTerm[sMonth*2-2];
  return LunarDate.GetLunarDay(sYear,sMonth,sDay);
}

// set solar and lunar festivals
var sFtv = new Array("0101 元旦","0214 情人节","0307 女生节","0308 妇女节","0401 愚人节","0501 劳动节","0504 青年节","0601 儿童节","0701 建党节","0801 建军节","0910 教师节","1001 国庆节","1112 男生节","1225 圣诞节");
var lFtv = new Array("0101 春节","0115 元宵节","0505 端午节","0707 七夕节","0815 中秋节","0909 重阳节","1208 腊八节");
var solarTerm = new Array("小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至");

var sTermInfo = new Array(0,21208,42467,63836,85337,107014,128867,150921,173149,195551,218072,240693,263343,285989,308563,331033,353350,375494,397447,419210,440795,462224,483532,504758);