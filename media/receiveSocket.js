/* eslint-disable no-throw-literal */
async function initSocket() {
    console.log('Socket initialized');
    const messagesArea = document.getElementById('messages-area');
    const Status = document.getElementById('dm-status');

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    while (true) {
        try {
            let msg = document.getElementsByClassName('msg');
            if (msg.length == 0) {
                throw "empty array";
            } else {
                window.scrollTo(0, document.body.scrollHeight);
                console.log('success');
                break;
            }
        } catch (err) {
            console.log(err);
            await sleep(500);
        }
    }

    function dateToString(date) {
        return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    }

    function isUrl(s) {
        var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        return regexp.test(s);
    }

    function isImageUrl(url) {
        return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
    }

    function messageInflator(message) {
        date = dateToString(new Date(message.date));
        message.message = message.message.replace(/\\n/g, '<br/>').replace(/\\r/g, '').replace(/\\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;').replace(/\\'/g, "\'").replace(/\\"/g, '\"');
        if (isUrl(message.message)) {
            if (isImageUrl(message.message)) {
                // render the image
                return `<div class="msg"><div class="message-inline"><img src="https://github.com/${message.sender}.png" alt=${message.sender} class="msg-img"><h3 class="dm-name">${message.sender}<span class="date">${date}</span> </h3></div><a href="${message.message}"><img class="image-content" src="${message.message}"></a></div><br>`;
            } else {
                // hyperlink message
                return `<div class="msg"><div class="message-inline"><img src="https://github.com/${message.sender}.png" alt=${message.sender} class="msg-img"><h3 class="dm-name">${message.sender}<span class="date">${date}</span> </h3></div><div class="msg-container"><a href="${message.message}" style="text-decoration: none;"><h4 class="msg-content">${message.message}</h4></a></div></div><br>`;
            }
        } else {
            // standard text message
            return `<div class="msg"><div class="message-inline"><img src="https://github.com/${message.sender}.png" alt=${message.sender} class="msg-img"><h3 class="dm-name">${message.sender}<span class="date">${date}</span> </h3></div><div class="msg-container"><h4 class="msg-content">${message.message}</h4></div></div><br>`;
        }
    }

    function imageInflator(message) {
        date = dateToString(new Date(message.date));
        return `<div class="msg"><div class="message-inline"><img src="https://github.com/${message.sender}.png" alt=${message.sender} class="msg-img"><h3 class="dm-name">${message.sender}<span class="date">${date}</span> </h3></div><a href="${message.message}"><img class="image-content" src="${message.message}"></a></div><br>`;
    }

    function codeInflator(message) {
        date = dateToString(new Date(message.date));
        message.message = message.message.replace(/\\n/g, '<br/>').replace(/\\r/g, '').replace(/\\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;').replace(/\\'/g, "\'").replace(/\\"/g, '\"');
        return `<div class="msg"><div class="message-inline"><img src="https://github.com/${message.sender}.png" alt=${message.sender} class="msg-img"><h3 class="dm-name">${message.sender}<span class="date">${date}</span> </h3></div><div class="code">${message.message}</div></div><br>`;
    }

    socket.on("receive-message", msg => {
        if (msg.group && msg.receiver == name && msg.sender != clientUsername) {
            if (msg.type == "text") {
                messagesArea.innerHTML = messagesArea.innerHTML + messageInflator(msg);
            }
            if (msg.type == "image") {
                messagesArea.innerHTML = messagesArea.innerHTML + imageInflator(msg);
            }
            if (msg.type == "code") {
                messagesArea.innerHTML = messagesArea.innerHTML + codeInflator(msg);
            }
            window.scrollTo(0, document.body.scrollHeight);
        } else if (!msg.group && msg.sender == name) {
            if (msg.type == "text") {
                messagesArea.innerHTML = messagesArea.innerHTML + messageInflator(msg);
            }
            if (msg.type == "image") {
                messagesArea.innerHTML = messagesArea.innerHTML + imageInflator(msg);
            }
            if (msg.type == "code") {
                messagesArea.innerHTML = messagesArea.innerHTML + codeInflator(msg);
            }
            window.scrollTo(0, document.body.scrollHeight);
        } else if (msg.sender != clientUsername) {
            if (msg.group && msg.receiver != name) {
                tsvscode.postMessage({ type: 'notificationMessage', value: msg });
                tsvscode.postMessage({ type: 'sendUnread', value: msg });
                tsvscode.postMessage({type: "refreshSidebar"});
            } else if (!msg.group && msg.receiver != name) {
                tsvscode.postMessage({ type: 'notificationMessage', value: msg });
                tsvscode.postMessage({ type: 'sendUnread', value: msg });
                tsvscode.postMessage({type: "refreshSidebar"});
            }
        }
    });
    socket.on("status", status => {
        console.log(status);
        if (status.user == username) {
            Status.innerHTML = status.status;
        }
    });
}