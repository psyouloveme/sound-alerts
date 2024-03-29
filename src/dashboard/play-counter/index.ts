
const audoAlertLog = nodecg.Replicant<AudioAlertLog>('audio-alert-log');

function sortAudioAlertEntries(a: AudoAlertLogEntry, b: AudoAlertLogEntry) {
    if (a[1] < b[1]) {
        return 1;
    } else if (a[1] === b[1]) {
        if (a[0] < b[0]){
            return 1;
        } else if (a[0] === b[0]) {
            return 0;
        } else {
            return -1;
        }
    } else {
        return -1;
    }
}

NodeCG.waitForReplicants(audoAlertLog).then(() => {
    // change handler for alert logs
    audoAlertLog.on("change", (nextVal) => {
        const tableAreaElem = document.getElementById("table-placeholder");
        if (!tableAreaElem) {
            return;
        }

        let entries = Object.entries(nextVal);
        entries.sort(sortAudioAlertEntries)

        let table = document.createElement("table") as HTMLTableElement;
        table.classList.add("audio-alert-log-table");
        let thead = table.createTHead();
        let row = thead.insertRow();
        let cell = row.insertCell();
        cell.innerText = "Name";
        cell = row.insertCell();
        cell.innerText = "Hits";

        let tbody = table.createTBody();
        for (let x = 0; x < entries.length; x++) {
            row = tbody.insertRow();
            cell = row.insertCell();
            cell.innerText = entries[x][0];
            cell = row.insertCell();
            cell.innerText = entries[x][1].toString();
        }

        if (tableAreaElem.firstChild) {
            tableAreaElem.removeChild(tableAreaElem.firstChild);
        }
        tableAreaElem.appendChild(table);
    })
});