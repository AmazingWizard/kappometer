// Do NOT include this line if you are using the built js version!
var start_date = new Date()
var start_time = start_date.getTime()
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
        username: "Sorc_bot",
        password: "oauth:r2c5ey1fv9dql80yihkglebwqwa98x"
    },
    channels: ["#Sorc_bot"]
};

var client = new irc.client(options);

// Connect the client to the server..
client.connect();

var message_total = 0
var kappa_total = 0
var kappa_ratio
var kpm = 0

client.on("chat", function (channel, user, message, self) {

    if (user.username == "sorc_bot") {

    } else {

      cur_date = new Date()
      cur_time = cur_date.getTime()
      kpm = Math.floor((kappa_total / ((cur_time - start_time) / 1000 / 60 )))

      $("#kpm_display").text(kpm + " KPM")
      message_total += 1

      KappaRegex = /\b(Kappa|KappaPride)\b/g
      kpmRegex = /(!kpm)/
      joinRegex = /(!join)/

      if (message.match(KappaRegex)) {
        kappaMSG_count = message.match(KappaRegex)
        for (var i = 0; i < kappaMSG_count.length; i++) {
          kappa_total += 1
        }
          $("#kappa_msg").text(message)
      }

      $("#message_count").text(message_total)
      $("#kappa_count").text(kappa_total)

      if (kappa_total == 0 || message_count == 0) {
        $("#kappa_percent").text("0%")
      } else {
        kappa_ratio = kappa_total / message_total * 100
        $("#kappa_percent").text(Math.floor(kappa_ratio) + "%")
      }

      if (message.match(kpmRegex)) {
        client.say(channel,"Current KPM: " + kpm + " Kappa Per Min")
      }

      if (message.match(joinRegex)) {
        message_total = 0
        kappa_total = 0
        kappa_ratio = 0
        kpm = 0
        cur_message = message.replace(joinRegex,'')
        cur_message = cur_message.replace(' ','')
        console.log("#"+cur_message);
        client.join("#"+cur_message);
        client.part(channel)
      }
  }
});
client.on("join", function (channel, username) {
    if (channel == "#sorc_bot") {
      client.clear(channel)
    }
    client.say(channel,"Type !kpm to get the Kappa Per Minute!")
});
