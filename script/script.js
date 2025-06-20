const input = document.getElementById('cli-input');
const output = document.getElementById('output');
let presentDir = "home/benjamin";


let jsonData = {}
fetch('./assets/text/data.json')
  .then(res => res.json())
  .then(data => {
    jsonData = data;
})
  .catch(err => {
    console.error("Error loading help data:", err);
});

input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const command = input.value.trim();
    processCommand(command);
    input.value = "";
  }
});

// command handler
const commands = {
    help: function(args) {
        if(!args.length) {
            return jsonData.help.default;
        }

        const subCommand = args[0];
        if(jsonData.help[subCommand] ) {
            return jsonData.help[subCommand];
        }
    },
    pwd: function() {
        return presentDir;
    },
    ls: function() {
        return jsonData.ls;
    },
    cd: function(args) {
        if (!args.length) {
            return "Usage: cd [directory]";
        }

        const dir = args[0];
        if (jsonData.cd && jsonData.cd[dir]) {
            presentDir = "home/benjamin/"+dir;
            return jsonData.cd[dir];
        }

        return `-bash: cd: ${dir}: No such file or directory`;
    },
    clear: function() {
        output.innerHTML = "";
        return "";
    },
    exit: function() {
        return jsonData.exit;
    }
};

function processCommand(command) {

    // display original command
    const line = document.createElement("pre");
    line.textContent = "[portfolio@benjamin ~]$ " + command ;
    output.appendChild(line);

    // parse input
    const splitCommand = command.split(" ");
    const commandPrefix = splitCommand[0];
    const args = splitCommand.slice(1);

    // command execution
    let responseText = "";
    if (commands[commandPrefix]) {
        responseText = commands[commandPrefix](args);
    } else {
        responseText = "-bash: " + commandPrefix + ": command not found";
    }

    // display response
    if (responseText) {
        const response = document.createElement("pre");
        response.textContent = responseText;
        output.appendChild(response);
    }
}


