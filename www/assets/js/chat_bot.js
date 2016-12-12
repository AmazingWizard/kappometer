// Do NOT include this line if you are using the built js version!
var start_date = new Date();
var start_time = start_date.getTime();
console.log(start_time);
var options = {
    options: {
        debug: false
    },
    connection: {
        random: "chat",
        reconnect: true
    },
    identity: {
        username: "Aw_kpmbot",
        password: "oauth:ljs4xxjzsxqop50kwq258t15khhbvz"
    },
    channels: ["#aw_kpmbot"]
};

var client = new tmi.client(options);

// Connect the client to the server..
client.connect();

var message_total = 0;
var kappa_total = 0;
var Pog_total = 0
var kappa_ratio;
var kpm = 0;
var mpm = 0;
var ppm = 0;


var dataPointsKappa = [];
dataPointsKappa.push({y: kpm, x: 0})
var dataPointsMsgs = [];
dataPointsKappa.push({y: mpm, x: 0})
var dataPointsPog = [];
dataPointsKappa.push({y: ppm, x: 0})

window.onload = function(){
    chart = new CanvasJS.Chart("Chart",{
    title:{text:"Live Kappa Per Min"},
    axisY:[
      {title:"Kappa Per Min"},
      {title:"Messages Per Min"},
      {title:"PogChamps Per Min"}
    ],
    data:[{
      type: "line",
      axisYindex: 0,
      dataPoints: dataPointsKappa
    },{
      type: "line",
      axisYindex: 1,
      dataPoints: dataPointsMsgs
    },{
      type: "line",
      axisYindex: 2,
      dataPoints: dataPointsPog
    }]
  })
  chart.render();
}

var lastTime = start_time

client.on("chat", function (channel, user, message, self) {

    if (user.username == "aw_kpmbot") {

    } else {

      cur_date = new Date();
      cur_time = cur_date.getTime();
      kpm = Math.floor((kappa_total / ((cur_time - start_time) / 1000 / 60 )));
      ppm = Math.floor((Pog_total / ((cur_time - start_time) / 1000 / 60 )));
      mpm = Math.floor((message_total / ((cur_time - start_time) / 1000 / 60 )));
      runningTime = Math.floor((cur_time / 1000) - (start_time / 1000))
      // Push Data to Chart
      dataPointsKappa.push({
        y:kpm,
        x:runningTime
      })
      dataPointsMsgs.push({
        y:mpm,
        x:runningTime
      })
      dataPointsPog.push({
        y:ppm,
        x:runningTime
      })
      timeBetweenRenders = (cur_time / 1000) - (lastTime / 1000)
      if(timeBetweenRenders > 2){
        lastTime = cur_time
        chart.render()
      }

      $("#kpm_display").text(kpm + " KPM");
      message_total += 1;

      KappaRegex = /\b(Kappa|KappaPride|KappaHD|KappaRoss|KappaClaus|KappaWealth)\b/g;
      PogRegex = /\b(PogChamp)\b/g;
      kpmRegex = /(!kpm)/;
      joinRegex = /(!join)/;

      if (message.match(KappaRegex)) {
        kappaMSG_count = message.match(KappaRegex);
        for (var i = 0; i < kappaMSG_count.length; i++) {
          kappa_total += 1;
        }
          $("#kappa_msg").text(message);
      }

      if (message.match(PogRegex)) {
        PogMSG_count = message.match(PogRegex);
        for (var i = 0; i < PogMSG_count.length; i++) {
          Pog_total += 1;
          console.log(message);
          console.log(Pog_total)
          console.log(ppm)
        }
      }

      $("#message_count").text(message_total);
      $("#kappa_count").text(kappa_total);
      $("#mpm_display").text(mpm);


      if (kappa_total === 0 || message_count === 0) {
        $("#kappa_percent").text("0%");
      } else {
        kappa_ratio = kappa_total / message_total * 100;
        $("#kappa_percent").text(Math.floor(kappa_ratio) + "%");
      }

      if (message.match(kpmRegex)) {
        client.say(channel,"Current KPM: " + kpm + " Kappa Per Min");
    }

      if (message.match(joinRegex)) {
        message_total = 0;
        kappa_total = 0;
        kappa_ratio = 0;
        kpm = 0;
        cur_message = message.replace(joinRegex,'');
        cur_message = cur_message.replace(' ','');
        console.log("#"+cur_message);
        client.join("#"+cur_message);
        client.part(channel);
      }
  }
});
client.on("join", function (channel, username) {
    if (channel == "#aw_kpmbot") {
      client.clear(channel);
    }
    client.say(channel,"Type !kpm to get the Kappa Per Minute!");
});
