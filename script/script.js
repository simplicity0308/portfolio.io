const input = document.getElementById('cli-input');
const output = document.getElementById('output');
let presentDir = "home/benjamin";
let hintHidden = false;
const hint = document.querySelector(".cli-hint");

let jsonData = {}

fetch('../assets/text/data.json')
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
  })
  .then(data => {
    console.log("Data loaded successfully");
    jsonData = data;
  })
  .catch(err => {
    console.error("Error loading data:", err);
    jsonData = {
      help: {
        default: "Help data failed to load. Please check console for errors."
      }
    };
  });

input.addEventListener("input", () => {
  if (!hintHidden) {
    hint.style.display = "none";
    hintHidden = true;
  }
});

document.addEventListener("click", () => input.focus());
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
        } else {
            return `-bash: help: no help topics match '${subCommand}'. Try 'help'`
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
        presentDir = 'home/benjamin'
        return "";
    },
    exit: function() {
        output.innerHTML = jsonData.exit;
        
        setTimeout(() => {
            const baseUrl = window.location.hostname.includes('github.io') ? 
                        '/portfolio' : '';
            window.location.href = `${baseUrl}/index.html`; 
        }, 2000); 
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
        response.innerHTML = responseText;
        output.appendChild(response);
    }

    setTimeout(() => {
        output.scrollTop = output.scrollHeight;
    }, 0);
}


