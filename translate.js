let info, theme, src, dst, div
let words_en, words_fr;
let cookies = {"src": "fr", "dst": "en", "theme": "dark"};
let langText = {"fr": "Français", "en": "English"}

function bestMatch(string, words) {
	let scores = [];
	for (let i = 0; i < words.length; i++) {
		scores.push(difference(string, words[i]));
	}
	return words[scores.indexOf(Math.min(...scores))];
}

function difference(a, b) {
	a = a.split(" ");
	b = b.split(" ");
	let diff = Math.abs(a.length - b.length);

	for (let i = 0; i < Math.min(a.length, b.length); i++) {
		diff += Math.abs(a[i].length - b[i].length);
		for (let j = 0; j < Math.min(a[i].length, b[i].length); j++) {
			if (a[i][j] !== b[i][j]) {
				diff += 1;
			}
		}
	}
	return diff;
}

function replace(str, prev, new_) {
	for (let i = 0; i < prev.length; i++) {
		str = str.replace(prev[i], new_[i]);
	}
	return str;
}

function translate() {
	if (src.value.length == 0) {
		dst.value = "";
		return;
	}

	let a, b;
	if (cookies.src == "fr") {
		a = words_fr;
		b = words_en;
	} else {
		a = words_en;
		b = words_fr;
	}

	let current = "";
	let type = ""; // type of previous character; 0: text, 1: symbols
	let currenttype, char;
	dst.value = "";
	for (let i = 0; i <= src.value.length; i++) {
		if (i == src.value.length) { // don't forget the last word
			currenttype = -1;
		} else {
			char = src.value[i].toLowerCase();
			if (/^[a-zA-Z]+$/.test(char)) {
				currenttype = 0;
			} else {
				currenttype = 1;
			}
		}
		if (type == currenttype) {
			current += char;
		} else {
			if (type == 0) {
				dst.value += b[a.indexOf(bestMatch(current, a))];
			} else {
				dst.value += current;
			}
			current = char;
		}
		type = currenttype;
	}
}

function switchLang() {
	let buffer = cookies.src;
	cookies.src = cookies.dst;
	cookies.dst = buffer;
	updateInfo();

	// switch content and translate again
	src.value = dst.value;
	translate();
}

function switchTheme() {
	if (cookies.theme == "dark") {
		cookies.theme = "light";
	} else {
		cookies.theme = "dark";
	}
	updateInfo();
}

function updateInfo() {
	// update language info
	info.innerHTML = langText[cookies.src] + " -> " + langText[cookies.dst];

	// update theme and info
	if (cookies.theme == "dark") {
		document.body.className = "dark";
		theme.innerHTML = "Dark theme";
	} else {
		document.body.className = "light";
		theme.innerHTML = "Light theme";
	}

	saveCookies();
}

function deleteAllCookies() {
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
    document.cookie = cookies[i].split("=")[0] + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  }
}

function saveCookies() {
	deleteAllCookies(); // prevent duplicate cookies

	let date = new Date(Date.now() + 2592000000).toGMTString();
	let end = "; expires="+date+"; path=/";

	let keys = Object.keys(cookies); // get all cookies names
	for (let i = 0; i < keys.length; i++) {
		document.cookie = keys[i]+"="+cookies[keys[i]]+end;
	}
	document.cookie = "theme="+cookies.theme+end;
}

function openCookies() {
	let allCookies = document.cookie.split("; ");
	for (let i = 0; i < allCookies.length; i++) {
		let current = allCookies[i].split("=");
		if (current[0].length) {
			cookies[current[0]] = current[1];
			console.log(current);
		}
	}
}

function initTranslate(en, fr) {
	words_en = en;
	words_fr = fr;

	info = document.getElementById("info");
	theme = document.getElementById("theme");
	src = document.getElementById("src");
	dst = document.getElementById("dst");
	div = document.getElementById("translation");

	openCookies();
	updateInfo();
}