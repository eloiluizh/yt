flowplayer(function (api) {
    api.on("load", function (e, api, video) {
      $("#vinfo").text(api.engine.engineName + " engine playing " + video.type);
    }); });