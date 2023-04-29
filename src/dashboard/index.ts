
const audioAlertsEnabled = nodecg.Replicant("audio_alerts_enabled");
    NodeCG.waitForReplicants(audioAlertsEnabled).then(() => {
    // bind a replicant change handler
    audioAlertsEnabled.on("change", (nextVal) => {
        let target;
        if (nextVal === true) {
            target = "audio-enabled-yes";
        } else {
            target = "audio-enabled-no";
        }
        const elem = document.getElementById(target) as HTMLInputElement;
        if (elem) {
            elem.checked = true;
        }
    });

    // bind a change handler for the dropdown
    const radios = document.querySelectorAll(
        "input[type=radio][name='audio-enabled']"
    );
    radios.forEach((radio) =>
        radio.addEventListener("change", (event : Event) => {
            const target = event.target as HTMLInputElement;
            if (target && target.value) {
                if (target.value === 'Yes') {
                    audioAlertsEnabled.value = true;
                } else {
                    audioAlertsEnabled.value = false;
                }
            }
        })
    );
});