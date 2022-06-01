var term = new Terminal();
term.open(document.getElementById('terminal'));

window.terminal.incomingData("incomingData", function (data) {
    term.write(data);
});

term.onData(e => {
    window.terminal.keystroke(e);
});