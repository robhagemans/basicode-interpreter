/* BASICODE in the Browser demonstration
 * (c) 2017 Rob Hagemans
 * Released under the Expat MIT licence
 */

// settings

function retrieveSettings() {
    settings = JSON.parse(localStorage.getItem("BASICODE:basicode-script:settings"));
    if (settings) {
        var keys = Object.keys(settings);
        for (var k in keys) {
            var e = document.getElementById(keys[k]);
            if (e) e.value = settings[keys[k]];
        }
    }
    updateSettings();
}

function updateSettings() {
    settings = document.getElementById('basicode-script').dataset;
    settings['columns'] = document.getElementById('columns').value;
    settings['rows'] = document.getElementById('rows').value;
    settings['speed'] = document.getElementById('speed').value;
    settings['font'] = document.getElementById('font').value;
    for (var i=0; i <=7; ++i) {
        settings['color-' + i] = document.getElementById('color-' + i).value;
    }
    localStorage.setItem("BASICODE:basicode-script:settings", JSON.stringify(settings))
    document.getElementById('showspeed').value = document.getElementById('speed').value;
    apps['basicode-script'].reset();
    display = new Display(
        document.getElementById('showfont'), 16, 6,
        document.getElementById('font').value, apps['basicode-script'].display.colours);
    for (var i=32; i < 128; ++i) {
        display.write(String.fromCharCode(i));
    }
    display.write('.');
}

presets = {
    'cga': { 'columns': 40, 'rows': 25, 'font': 'cga',
             'color-0': '#000000', 'color-7': '#ffffff',
        },
    'bbc': { 'columns': 40, 'rows': 32, 'font': 'bbc',
             'color-0': '#000000', 'color-7': '#ffffff',
        },
    'c64': { 'columns': 40, 'rows': 25, 'font': 'c64',
             'color-0': '#40318d', 'color-7': '#7869c4',
        },
    'spectrum': { 'columns': 32, 'rows': 24, 'font': 'spectrum',
             'color-0': '#aaaaaa', 'color-7': '#000000',
        },
    'msx': { 'columns': 40, 'rows': 25, 'font': 'msx',
             'color-0': '#5955e0', 'color-7': '#ffffff',
        },
    'cpc': { 'columns': 40, 'rows': 25, 'font': 'cpc',
             'color-0': '#0000ff', 'color-7': '#ffff00',
        },
    'pcw': { 'columns': 90, 'rows': 32, 'font': 'pcw',
             'color-0': '#000000', 'color-7': '#ffffff',
        },
    'coco': { 'columns': 32, 'rows': 16, 'font': 'coco',
             'color-0': '#1bcb01', 'color-7': '#000000',
        },

}

function loadPreset(preset) {
    var keys = Object.keys(presets[preset]);
    for (var k in keys) {
        document.getElementById(keys[k]).value = presets[preset][keys[k]];
    }
    updateSettings();
}

// listing

function setupListing() {
    var listing = document.getElementById('listing0');

    // reload code if listing changes
    listing.onblur = function() {
        if (apps['basicode-script'].program && listing.value === apps['basicode-script'].program.code) {
            return;
        }
        apps['basicode-script'].load(listing.value);
    }
}

function onProgramLoad(program) {
    var listing = document.getElementById('listing0');
    var info = document.getElementById('info0');
    if (program === null) {
        listing.value = "";
        info.innerHTML = "";
    }
    else {
        listing.value = program.code;
        info.innerHTML = "<h2>" + program.title + "</h2>\n\n" +program.description;
    }
    window.location.assign("#screen")
}

// storage

// this is where we keep our blobs
var blobbery = {};
var mime_type = "text/plain";
var prefix = "BASICODE";

function buildList(parent, drives)
{
    for (var flop=0; flop < drives.length; ++flop) {
        var floppy_id = drives[flop];
        var topli = document.createElement("li");
        topli.innerHTML = "&nbsp;&#128428; " + floppy_id; // &#128190;
        topli.dataset.drive = floppy_id;
        // drop files to put in storage
        function drop(e) {
            // this === e.currentTarget
            var id = this.dataset.drive;
            e.stopPropagation();
            e.preventDefault();
            var files = e.dataTransfer.files;
            var reader = new FileReader();
            reader.onload = function() {
                apps['basicode-script'].store(id, files[0].name, reader.result);
            };
            reader.readAsText(files[0]);
        }
        topli.addEventListener("drop", drop, false);
        var list = document.createElement("ol");
        parent.appendChild( document.createElement("ul")).appendChild(topli).appendChild(list);
        for (var i=0; i < localStorage.length; ++i) {
            var key = localStorage.key(i)
            var key_list = key.split(":");
            if (key_list[0] !== prefix) continue;
            if (key_list[1] !== "" + floppy_id) continue;
            // create content blob from local storage, if necessary
            if (!(key in blobbery)) {
                blobbery[key] = new Blob([localStorage.getItem(key)], {type: mime_type});
            }
            // create download link to file
            var a = document.createElement("a");
            a.innerHTML = "&#9662;";
            a.className = "hidden download";
            a.href = window.URL.createObjectURL(blobbery[key]);
            a.download = key_list[2];

            var play = document.createElement("a");
            play.className = "run";
            play.href = "run("+key_list[2]+")";
            play.innerHTML = '<span class="hidden">&#9656;</span> '+key_list[2];
            play.dataset.key = key;
            play.onclick = function(e) {
                e.stopPropagation();
                e.preventDefault();
                code = localStorage.getItem(e.currentTarget.dataset.key);
                apps['basicode-script'].load(code);
            };

            var x = document.createElement("a");
            x.innerHTML = "&#10060;"
            x.className = "hidden delete";
            x.href = "delete("+key_list[2]+")";
            x.dataset.delete_target = key_list[2];
            x.dataset.drive = floppy_id;
            x.onclick = function(e) {
                e.stopPropagation();
                e.preventDefault();
                apps['basicode-script'].delete(e.target.dataset.drive, e.target.dataset.delete_target);
            };
            var li = list.appendChild(document.createElement("li"))
            li.appendChild(x);
            li.appendChild(a);
            li.appendChild(play);
        }
    }
}


function onFileStore()
{
    var element = document.getElementById("flop1");
    var drives = ["tape", "floppy"];
    if (!element) return;
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    buildList(element, drives);
}

function loadFile(element) {
    var app = apps['basicode-script'];
    url = element.href;
    if (url !== undefined && url !== null && url) {
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.onreadystatechange = function() {
            if (request.readyState === 4 && request.status === 200) {
                code = request.responseText;
                app.stop()
                app.load(code);
            }
        }
        request.send()
    }
    return false;
}

function onProgramRun() {
    var button = document.getElementById('button0')
    button.onclick = stop;
    button.innerHTML = "&#9209;";
}

function onProgramEnd() {
    var button = document.getElementById('button0')
    button.onclick = run;
    button.innerHTML = "&#9654;";
}

function onPrint(text) {
    document.getElementById("printer0").innerText = text;
}

///////////////////////////////////////////////////////////////////////////
// event handlers

function setupHandlers()
{
    var app = apps['basicode-script'];

    // load files on drag & drop
    function nop(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    function drop(e) {
        e.stopPropagation();
        e.preventDefault();
        var files = e.dataTransfer.files;
        var reader = new FileReader();
        reader.onload = function() {
            app.load(reader.result);
        };
        reader.readAsText(files[0]);
    }

    var element = apps['basicode-script'].canvas;
    element.addEventListener("dragenter", nop);
    element.addEventListener("dragover", nop);
    element.addEventListener("drop", drop);

    var listing = document.getElementById('listing0');
    listing.addEventListener("dragenter", nop);
    listing.addEventListener("dragover", nop);
    listing.addEventListener("drop", drop);

    // run file on click
    element.addEventListener("click", function click(e) {
        if (!app.running) app.run();
    });

    var storage = document.getElementById('flop1');
    storage.addEventListener("dragenter", nop);
    storage.addEventListener("dragover", nop);
    storage.addEventListener("drop", nop);

    // application-defined events
    app.on_file_store = onFileStore;
    app.on_program_load = onProgramLoad;
    app.on_program_run = onProgramRun;
    app.on_program_end = onProgramEnd;
    app.on_print = onPrint;
}

function setup() {
    retrieveSettings();
    setupListing();
    setupHandlers();
    onFileStore();
    onProgramLoad(apps['basicode-script'].program);
    // load demo program only if nothing stored
    if (!apps['basicode-script'].program) {
        loadFile({"href": "demo.bc3"})
    }
    setupPrograms();
    run();
}

function run() {
    apps['basicode-script'].run();
}

function stop() {
    apps['basicode-script'].stop();
}

function buildCollection(parent, collection)
{
    drives = Object.keys(collection).sort();
    for (var flop=0; flop < drives.length; ++flop) {
        var floppy_id = drives[flop];
        files = Object.keys(collection[floppy_id]).sort();
        if (!files.length) continue;

        var topli = document.createElement("li");
        topli.innerHTML = "&nbsp;&#x2605; " + floppy_id.split("_").join(" ").split(".").join("");

        var list = document.createElement("ol");
        parent.appendChild( document.createElement("ul")).appendChild(topli).appendChild(list);

        for (var i=0; i < files.length; ++i) {

            var name = files[i].split("/").pop().split(".")[0].split("_").join(" ");
            var title =  collection[floppy_id][files[i]];

            // create download link to file
            var a = document.createElement("a");
            a.innerHTML = "&#9662;";
            a.className = "hidden download";
            a.href = files[i];

            var play = document.createElement("a");
            play.className = "run";
            play.href = files[i];
            play.innerHTML = '<span class="hidden">&#9656;</span> ' + name + ' <span class="title">' + title+ '</span> ';
            play.onclick = function(e) {
                e.stopPropagation();
                e.preventDefault();
                return loadFile(this);
            };
            var li = list.appendChild(document.createElement("li"))
            li.appendChild(a);
            li.appendChild(play);
        }
    }
}

function setupPrograms()
{
    var parent = document.getElementById("program-list");
    var url = "programs.json";
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            collection = JSON.parse(request.responseText);
            buildCollection(parent, collection);
        }
    }
    request.send()

}

// kludge to use he #targets while keeping a top margin
window.addEventListener("hashchange", function () {
    window.scrollTo(0, 0);
});