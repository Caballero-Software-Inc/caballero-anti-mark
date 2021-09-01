'use strict';

let crypto;
try {
  crypto = require('crypto');
} catch (err) {
  console.log('crypto support is disabled!');
}
/* License

[The MIT License (MIT)](http://opensource.org/licenses/MIT)

Copyright (c) 2009-2013 Jeff Mott  
Copyright (c) 2013-2016 Evan Vosberg

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
*/


require('dotenv').config();
/*Copyright (c) 2015, Scott Motte
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

*/

const recoveryTime = 86400000; // time from one recovery of code to another
const lKey = 50;/* length of the key */



const appLogin = 'caballerosoftwareinc@gmail.com';
const appPassword = process.env.APPPASSWORD;

// it is cryptographically secure
function makeId(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt( crypto.randomInt(charactersLength) );
    }
    return result;
}


let tempSeed = makeId(50); // initialization

const express = require('express');
/* 
Copyright (c) 2009-2014 TJ Holowaychuk <tj@vision-media.ca>
Copyright (c) 2013-2014 Roman Shtylman <shtylman+expressjs@gmail.com>
Copyright (c) 2014-2015 Douglas Christopher Wilson <doug@somethingdoug.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.
*/


const nodemailer = require("nodemailer");
/*

Copyright (c) 2011-2019 Andris Reinman
Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.
*/

/* Chapter: before interaction */

/* reading the information about the users from the providers */
const Datastore = require('nedb');
/* 
Copyright (c) 2013 Louis Chatriot &lt;louis.chatriot@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.
*/

const providers = new Datastore({ filename: 'providers.txt', autoload: true });

let users = [];
providers.find({}).exec(function (err, docs) {
    docs.forEach(function (d) {
        users.push(d)
    })
});

/* creating app */
const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('listening at ' + port));
app.use(express.static('public'));
app.use(express.json({ limit: '5mb' }));


/* Chapter: new user */

async function sendEmail(emailSubject, firstText, emailAddress, userIdentifier) {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: appLogin,
            pass: appPassword // app-password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Caballero Software Inc." <caballerosoftwareinc@gmail.com>', // sender address
        to: emailAddress, // list of receivers
        subject: emailSubject, // Subject line
        text: firstText + userIdentifier, // plain text body
        html: "<b>" + firstText + userIdentifier + "</b>" // html body
    });
}

// new account

app.post('/newaccount', (request, response) => {
    providers.find({ email: request.body.email }, function (err, docs) {
        if (docs.length == 0) {
            response.json({ ok: true });
            request.body.identifier = makeId(lKey);
            request.body.recovery = Date.now();
            users.push(request.body);
            autoSave();

            switch (parseInt(request.body.language)) {
                case 0:
                    sendEmail("Identifier (Caballero Software Inc.)", "Your identifier for Caballero Software Inc. is: ", request.body.email, request.body.identifier);
                    break;
                case 1:
                    sendEmail("Identifiant (Caballero Software Inc.)", "Votre identifiant pour Caballero Software Inc. est : ", request.body.email, request.body.identifier);
                    break;
                default:
                    console.log('Problem in language data.');
                    break;
            };
        } else {
            response.json({ ok: false });
        }
    })
});

app.post('/apiretrieveidentifier', (request, response) => {

    providers.find({ email: request.body.email }, function (err, docs) {
        if (docs.length == 0) {
            response.json({ ok: false }) /* email not found */
        } else {
            if (Date.now() - docs[0].recovery > recoveryTime) {
                let j = 0;
                while (j < users.length ? users[j].identifier != docs[0].identifier : false) {
                    j++
                }
                users[j].recovery = Date.now();
                autoSave();
                response.json({ ok: true });
                switch (parseInt(users[j].language)) {
                    case 0:
                        sendEmail("Identifier (Caballero Software Inc.)", "Your identifier for Caballero Software Inc. is: ", request.body.email, docs[0].identifier);
                        break;
                    case 1:
                        sendEmail("Identifiant (Caballero Software Inc.)", "Votre identifiant pour Caballero Software Inc. est : ", request.body.email, docs[0].identifier);
                        break;
                    default:
                        console.log('Problem in language data.');
                        break;
                };

            } else {
                response.json({ ok: false }) /* only after a day, recovery of the identifier is allowed */
            }
        }
    })
});

/* authentication */

app.post('/apiauthentication', (request, response) => {
    let j = 0;
    while (j < users.length ? users[j].identifier != request.body.userId : false) {
        j++
    };
    if (j == users.length) {
        response.json({ ok: false }) /* the identifier provided by the user was not found */
    } else {
        if (users[j].email == request.body.email) {
            if (users[j].email == "caballero@caballero.software") {
                response.json({ ok: true, providers: users }) /* the identifier provided by the user was found */
            } else {
                response.json({ ok: true, new: (users[j].minor == undefined) }) /* the identifier provided by the user was found */
            }

        } else {
            response.json({ ok: false }) /* the identifier provided by the user was not found */
        }
    }
});

/* delete account */

app.post('/apidelete', (request, response) => {
    let j = 0;
    while (j < users.length ? users[j].identifier != request.body.userId : false) {
        j++
    };

    if (users[j].email == request.body.userEmail) {
        users.splice(j, 1);
        response.json({ ok: true });
        autoSave();
    }
});



/* Chapter: save in the dababase */

function autoSave() {
    providers.remove({}, { multi: true }, (err, n) => { });
    providers.loadDatabase();
    providers.insert(users);
    console.log("Update of providers, Date.now() = " + Date.now() + ".")
}


// offers

app.post('/newoffer', (request, response) => {
    let j = 0;
    while (j < users.length ? users[j].email != request.body.userEmail : false) {
        j++
    };

    users[j].offers.push(request.body.newOffer);
    autoSave();
});

app.post('/seealloffers', (request, response) => {
    let offers = [];
    for (let j = 0; j < users.length; j++) {
        offers = offers.concat(users[j].offers);
    };
    response.json({ ok: true, offers });
});

app.post('/seeoffers', (request, response) => {
    let j = 0;
    while (j < users.length ? users[j].email != request.body.userEmail : false) {
        j++
    };
    response.json({ ok: true, offers: users[j].offers });
});

app.post('/deloffer', (request, response) => {
    let j = 0;
    while (j < users.length ? users[j].email != request.body.userEmail : false) {
        j++
    };
    users[j].offers.splice(request.body.index, 1);
    autoSave();
    response.json({ ok: true, offers: users[j].offers });
});


// admin
app.post('/apiupdatedata', (request, response) => {
    users = request.body.file.split('\n').filter(x => x != '').map(x => JSON.parse(x));
    response.json({ ok: true });
});


