
// Import the discord.js module
const Discord = require('discord.js');
const { Client } = require('discord.js');
const yt = require('ytdl-core');
const tokens = require('./config.json');
const client = new Client();
const token = 'NDIzNzg1NzEwMjQwMTM3MjI3.DYvdzQ.sYv_4Y_vf-dkzGoVn9ru70o2nvA';
var ffmpeg = require('ffmpeg');
var fs = require('fs');
var path = require('path');
var readStream = fs.createReadStream(path.join(__dirname, '') + '/help.txt', 'utf8');


const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', socket => {
	console.log('connection')
	require('./api/socket').connection(io, socket)
})

// API ROUTES
app.use('/', express.static('website'))

//website start
http.listen(3000, err => {
	if (err) throw err;
	console.log('The server is running on port: 3000')
})

let data = ''
readStream.on('data', function (chunk) {
	data += chunk;
}).on('end', function () {

});

var fs = require('fs');
//bot commands
const commands = {
	queue: {
	},
	//play command open command
	'play': (message) => {
		
		if (commands.queue[message.guild.id] === undefined) return message.channel.sendMessage(`ey Jood Voeg eerst ff wat liedjes toe met  ${tokens.prefix}add en als je niet weet hoe dit werkt, vraag om hulp met bot.help!`), console.log('PLay.ErrorCode=101');
		if (!message.guild.voiceConnection) return commands.join(message).then(() => commands.play(message)), console.log('iemand speelt iets af');
		if (commands.queue[message.guild.id].playing) return message.channel.sendMessage('Ik speel al Jood'),console.log('ErrorCode=102');
		let dispatcher;
		commands.queue[message.guild.id].playing = true;

		(function play(song) {
			if (song === undefined) return message.channel.sendMessage('Je hebt nog geen muziek joden snuifer').then(() => {
				commands.queue[message.guild.id].playing = false;
				message.member.voiceChannel.leave();k
			});
			message.channel.sendMessage(`Ik ga nu: **${song.title}** voor je Spelen: **${song.requester}**`);
			dispatcher = message.guild.voiceConnection.playStream(yt(song.url, { audioonly: true }), { passes: tokens.passes });
			let collector = message.channel.createCollector(m => m);
			collector.on('message', m => {
				if (m.content.startsWith(tokens.prefix + 'pause')) {
					message.channel.sendMessage('paused').then(() => { dispatcher.pause(); });
				} else if (m.content.startsWith(tokens.prefix + 'resume')) {
					message.channel.sendMessage('resumed').then(() => { dispatcher.resume(); });
				} else if (m.content.startsWith(tokens.prefix + 'skip')) {
					message.channel.sendMessage('skip').then(() => { dispatcher.end(); });
				}
			});
			dispatcher.on('end', () => {
				collector.stop();
				play(commands.queue[message.guild.id].songs.shift());
			});
			dispatcher.on('error', (err) => {
				return message.channel.sendMessage('error: ' + err).then(() => {
					collector.stop();
					play(commands.queue[message.guild.id].songs.shift());
				});
			});
		})(commands.queue[message.guild.id].songs.shift());
	},
	// bot.leave privat command
	'leave': (message) =>{
		return new Prommis((resolve, reject) => {
			message.member.voiceChannel.leave();
			return message.reply('Crash error 401');
			console.log('ga uit de chat')
		}
		)},
//bot.join privat command
	'join': (message) => {
		return new Promise((resolve, reject) => {
			const voiceChannel = message.member.voiceChannel;
			if (!voiceChannel || voiceChannel.type !== 'voice') return message.reply('Je zit niet in een voice channel...');
			voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
		});
	},
	//bot.add command
	'add': (message, website) => {
		console.log('iemand voegt iets toe')
		let url = message.content.split('')[1];
		if (url == '' || url === undefined) return message.channel.send(`je moet wel en link geven anders ik geen muziek hebben dus geef en link na de ${tokens.prefix}add`);
		yt.getInfo(url, (err, info) => {
			if (err || message.channel) return message.channel.send('Error 601 kan youtube link niet vinden!: ' + err + console.log('hij kand de video niet vinden Error 601'));
			if (!commands.queue.hasOwnProperty(message.guild.id)) commands.queue[message.guild.id] = {}, commands.queue[message.guild.id].playing = false, commands.queue[message.guild.id].songs = [];
			commands.queue[message.guild.id].songs.push({ url: url, title: info.title, requester: message.author.username });
			if (message.channel) message.channel.send(`hij is toegevoegt hoor **${info.title}** `);

			io.emit('songAdded', { title: info.title, requester: message.author.username })
		});
	},
	//queue command
	'showQueue': (message) => {
		if (commands.queue[message.guild.id] === undefined) return message.channel.sendMessage(`Voeg eers ff wat Liedjes toe aan je wachtrij door ${tokens.prefix}add te gebruiken.`);
		let tosend = [];
		commands.queue[message.guild.id].songs.forEach((song, i) => { tosend.push(`${i + 1}. ${song.title} - Requested by: ${song.requester}`); });
		if (message.channel) message.channel.sendMessage(`__**${message.guild.name}'s Music Queue:**__ Currently **${tosend.length}** songs queued ${(tosend.length > 15 ? '*[Only next 15 shown]*' : '')}\n\`\`\`${tosend.slice(0, 15).join('\n')}\`\`\``);
	},
	//reboot command
	'reboot': (message) => {
		console.log('Error 501')
		message.channel.send('reboot is geen command voor joden!!')
		if (message.author.id == tokens.adminID) process.exit();
	}
};


client.on('ready', () => {
	console.log('ik ben opgestart');
})



// Create an event listener for messages
client.on('message', message => {
	if (message.content === 'reich.fuhrer'){
		message.reply(': ');
	}
	//random code uitgeschreven gewoon voor de lol!
	if (message.content === '!gamecode') {
		function randomString(length, chars) { var result = ''; for (var i = length; i > 0; --i)result += chars[Math.round(Math.random() * (chars.length - 1))]; return result; } message.reply(randomString(5, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ')), message.reply("-"), message.reply(randomString(5, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ')), message.reply("-"), message.reply(randomString(5, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ')), message.reply("-"), message.reply(randomString(5, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'));
		console.log("Ieamnd wil en game code hahah");
	}
	if (message.content === '!walletcode') {
		console.log("wallet code")
		function randomString(length, chars) { var result = ''; for (var i = length; i > 0; --i)result += chars[Math.round(Math.random() * (chars.length - 1))]; return result; } message.reply(randomString(4, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ')), message.reply("-"), message.reply(randomString(4, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ')), message.reply("-"), message.reply(randomString(4, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'));
	}
	if (message.content === 'reich.error') {
		message.reply('er zijn geen errors     Error message is W.I.P')
	}
	//annoying as shit bot
	if (message.content === 'hello.bot') {
		console.log('Zeg Hallo');
		message.reply('');
		
	}
	if (message.content === 'hallo und welkomen'){
		console.log('sendt message back for maximum irrotation');
		message.reply('GHello my friend')
	}
	if (message.content === 'Ghello my friend'){
		console.log('ask how the bot is doing');
		message.reply('How are you my friend')
	}



	if (message.content === 'bot.help') {
		fs.readFile('help.txt', 'utf8', function (err, data) {
			if (err) throw err;
			message.reply(data);
		});
	};
	if (message.content === 'reich.help') {
		fs.readFile('help.txt', 'utf8', function (err, data) {
			if (err) throw err;
			message.reply(data);
			console.log('')
		});
	}
	if (!message.content.startsWith(tokens.prefix)) return;
	if (commands.hasOwnProperty(message.content.toLowerCase().slice(tokens.prefix.length).split(' ')[0])) commands[message.content.toLowerCase().slice(tokens.prefix.length).split(' ')[0]](message);


});


// Log our bot in
client.login(token);


module.exports = commands