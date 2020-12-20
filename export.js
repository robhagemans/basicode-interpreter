"use strict";

// Builds a wav file for 8-bit uncompressed samples at the given rate.
class WavBuilder {
    constructor(sampleRate, numSamples) {
        this.sampleRate = sampleRate;
        this.numSamples = numSamples;
        this.dataCursor = 0;
        this.data = new Uint8Array(numSamples + 44);
        
        // Create the Header.

        this.addString("RIFF"); // Chunk ID
        this.addNumber(this.numSamples + 28, 4); // Chunk size
        this.addString("WAVE"); // Chunk format
        this.addString("fmt "); // Subchunk1 ID
        this.addNumber(16, 4); // Subchunk1 size
        this.addNumber(1, 2); // Audio format (PCM)
        this.addNumber(1, 2); // Number of channels (1)
        this.addNumber(this.sampleRate, 4); // Sample rate 
        this.addNumber(this.sampleRate, 4); // Byte rate
        this.addNumber(1, 2); // Block Align (number of  channels * bytes  per  sample)
        this.addNumber(8, 2); // Bits per sample
        this.addString("data"); // Subchunk2  ID
        this.addNumber(this.numSamples, 4); // Subchunk2 size
    }

    addSample(b) {
        console.assert((b >= 0) && (b <= 255), "sample is out of range");
        console.assert(this.dataCursor < this.data.length, "wrote over the end of the buffer");
        this.data[this.dataCursor++] = b;
    }

    getWavData() {
        // Pad the end with zeros.
        while (this.dataCursor < this.data.length) {
            this.addSample(127);
        }
        return this.data;
    }

    // Add the characters of a string to the data
    addString(s) {
        for (var i = 0; i < s.length; ++i)
        {
            this.addSample(s.charCodeAt(i));
        }
    }

    // Add a little-endian number n which should occupy l bytes.
    addNumber(n, l) {
        for (var i = 0; i < l; ++i) {
            const b = n & 255;
            this.addSample(b);
            n = n >> 8;
        }
    }
}

// Builds a Wav file containing waves.
class PulseWavBuilder {
    constructor(sampleRate, totalDuration) {
        // Add a few samples at the end to account for imprecision.
        this.wavBuilder = new WavBuilder(sampleRate, (totalDuration * sampleRate) + 5);
        this.samplePeriod = 1.0 / sampleRate;
        this.excessTime = 0.0;
    }

    // Add a square wave of the given duration where the positive pulse is first.
    addWave(waveDuration) {
        var d = this.excessTime;
        while (d < waveDuration)
        {
            //This commented code will write sin wave instead.
            //const angle = 2.0 * Math.PI * (d / duration);
            //this.addSample(Math.floor((1.0 + Math.sin(angle)) * 0.5 * 255.99));
            this.wavBuilder.addSample(((d / waveDuration) < 0.5) ? 255 : 0);
            d += this.samplePeriod;
        }
        this.excessTime = d - waveDuration;
    }

    // Add count copies of waves of the given duration.
    addRepeatedWaves(waveDuration, count) {
       for (var i = 0; i < count; ++i) {
           this.addWave(waveDuration);
       }
    }

    getWavData() {
        return this.wavBuilder.getWavData();
    }
}

// Returns a wav file corresponding to the program.
function getProgramAsWav(program) {
    // Basicode uses CR to terminate lines.
    const prog = program.trim().replace(/\r\n/g, "\r").replace(/\n/g, "\r") + "\r";

    const shortWaveDuration = 1.0/2400.0;
    const longWaveDuration = 1.0/1200.0;

    const byteDuration = (1 + 8 + 2) * longWaveDuration;

    const leaderDuration = 5.0;
    const startByteDuration = byteDuration;
    const programDuration = prog.length * byteDuration;
    const endByteDuration = byteDuration;
    const checksumDuration = byteDuration;
    const trailerDuration = 5.0;

    const totalDuration = leaderDuration + startByteDuration + programDuration + endByteDuration + checksumDuration + trailerDuration;
    
    const sampleRate = 44100;
    var wavBuilder = new PulseWavBuilder(sampleRate, totalDuration);

    var checkSum = 0;

    function addByte(b) {
        checkSum = checkSum ^ b
        b = (1 << 10) | (1 << 9) | (b << 1);
        for (var i = 0; i < 11; ++i) {
            if (b & 1) {
                wavBuilder.addWave(shortWaveDuration);
                wavBuilder.addWave(shortWaveDuration);
            } else {
                wavBuilder.addWave(longWaveDuration);
            }
            b = b >> 1;
        }
    }

    wavBuilder.addRepeatedWaves(shortWaveDuration, Math.floor(leaderDuration / shortWaveDuration));
    addByte(0x82);
    for (var i = 0; i < prog.length; ++i) {
        var b = 0x80 | prog.charCodeAt(i);
        addByte(b);
    }
    addByte(0x83);
    addByte(checkSum);
    wavBuilder.addRepeatedWaves(shortWaveDuration, Math.floor(trailerDuration / shortWaveDuration));

    return wavBuilder.getWavData();
}

// Download data from the browser to a local file.
function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    var a = document.createElement("a"),
            url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);  
    }, 0); 
}

// Convert the listing to a wav file and download it.
function exportAsWav() {
    var element = document.getElementById("listing0");
    if (element.value.length == 0) {
        return;
    }
    var wav = getProgramAsWav(element.value);
    download(wav, "basicode.wav", "audio/wav");
}
