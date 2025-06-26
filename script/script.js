const input = document.getElementById('cli-input');
const output = document.getElementById('output');
const hint = document.querySelector(".cli-hint");
let presentDir = "home/benjamin";
let hintHidden = false;

// overlay
const overlays = {
  about: document.getElementById('about-overlay'),
  contact: document.getElementById('contact-overlay'),
  projects: document.getElementById('projects-overlay')
};

let jsonData = {}

// json 
fetch('../assets/text/data.json')
  .then(res => {
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
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
      alert("Session terminated, hope you enjoyed :3")
        setTimeout(() => {
          window.close();
        }, 1000); 
    }
};

function processCommand(command) {
    // show prev command
    const line = document.createElement("pre");
    line.className = "terminal-text";
    line.textContent = "[portfolio@benjamin ~]$ " + command;
    output.appendChild(line);
    scrollToBottom();

    // parse command
    const splitCommand = command.split(" ");
    const commandPrefix = splitCommand[0];
    const args = splitCommand.slice(1);

    let responseText = "";
    if (commands[commandPrefix]) {
        responseText = commands[commandPrefix](args);
        scrollToBottom();
    } else {
        responseText = "-bash: " + commandPrefix + ": command not found";
        scrollToBottom();
    }

    // show response
    if (responseText) {
        const response = document.createElement("pre");
        response.className = "terminal-text";
        response.innerHTML = responseText;
        output.appendChild(response);
        scrollToBottom();
    }

    scrollToBottom();
}

// scroll to bottom after each command
function scrollToBottom() {
    setTimeout(() => {
        output.scrollTop = output.scrollHeight;
    }, 10);
}

// welcome message when page loads
document.addEventListener('DOMContentLoaded', function() {
  const welcomeMessage = document.createElement("pre");
  welcomeMessage.className = "terminal-text";
  welcomeMessage.innerHTML = `Welcome to Portfolio OS [Version 2025.03.08]
(c) 2025 Benjamin Choon. All rights reserved.
SUI-CHAN WAAAAAA KYOU MOU KAWAIIIIIIII

Type 'help' to see available commands.
`;
  output.appendChild(welcomeMessage);
  scrollToBottom();
});

// click handler in cli
output.addEventListener('click', function(event) {
  // check if a link was clicked
  if (event.target.tagName === 'A') {
    const href = event.target.getAttribute('href');
    
    // check if this is an overlay trigger
    if (href === '#about') {
      event.preventDefault();
      showOverlay('about');
    } else if (href === '#contact') {
      event.preventDefault();
      showOverlay('contact');
    } else if (href === '#projects') {
      event.preventDefault();
      showOverlay('projects');
    }
  }
});

// show a specific overlay
function showOverlay(type) {
  // hide overlays 
  Object.values(overlays).forEach(overlay => {
    if (overlay) overlay.style.display = 'none';
  });
  // show the requested overlay
  if (overlays[type]) {
    overlays[type].style.display = 'block';
  }
  
  scrollToBottom();
}

// setup overlays
document.addEventListener('DOMContentLoaded', function() {
  // update overlays references once DOM is loaded
  Object.keys(overlays).forEach(key => {
    overlays[key] = document.getElementById(`${key}-overlay`);
  });
  
  const icons = {
    about: document.querySelector('.icon.about'),
    contact: document.querySelector('.icon.contact'),
    projects: document.querySelector('.icon.projects')
  };
  
  Object.keys(icons).forEach(type => {
    if (icons[type] && overlays[type]) {
      // icon click opens overlay
      icons[type].addEventListener('click', function(e) {
        e.preventDefault();
        showOverlay(type);
      });
      
      // close button closes overlay
      const closeBtn = overlays[type].querySelector('.control.close');
      if (closeBtn) {
        closeBtn.addEventListener('click', function() {
          overlays[type].style.display = 'none';
        });
      }
      
      // click outside overlay closes it
      overlays[type].addEventListener('click', function(event) {
        if (event.target === overlays[type]) {
          overlays[type].style.display = 'none';
        }
      });
    }
  });

  // ESC key closes any open overlay
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      Object.values(overlays).forEach(overlay => {
        if (overlay && overlay.style.display === 'block') {
          overlay.style.display = 'none';
        }
      });
    }
  });
});

// scrolling after window resize
window.addEventListener('resize', scrollToBottom);