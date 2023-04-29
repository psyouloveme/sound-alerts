const audioEnabled = nodecg.Replicant("audio_alerts_enabled", {
    defaultValue: false,
  });

  const onChatReceived = ({ user = "", message = "" }) => {
    if (!user || !message || !message.startsWith("!")) {
      return;
    }

    const splitAlert = message.split(" ")[0];
    if (splitAlert && nodecg.findCue(splitAlert)) {
      nodecg.playSound(splitAlert);
      nodecg.sendMessage("played-cue", splitAlert);
    }
  };

  NodeCG.waitForReplicants(audioEnabled).then(() => {
    audioEnabled.on("change", (nextVal, prevVal) => {
      if (!prevVal && nextVal) {
        nodecg.listenFor("ChatReceived", "twitch-listener", onChatReceived);
      } else if (prevVal && !nextVal) {
        nodecg.unlisten("ChatReceived", "twitch-listener", onChatReceived);
      }
    });
  });