'use strict';

const recoveryTime = 86400000; // time from one recovery of the identifier to another
const lKey = 50;/* length of the key */


const crypto = require('crypto');
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


const dotenv = require('dotenv');
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

dotenv.config();

const appLogin = 'caballerosoftwareinc@gmail.com';
const appPassword = process.env.APPPASSWORD;

// it is cryptographically secure
function makeId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    const result = [...Array(length).keys()]
        .map(value => characters.charAt(crypto.randomInt(charactersLength)))
        .join('');
    return result;
}


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

//read the data about the users
let users = [];
providers.find({}).exec(function (err, docs) {
    docs.forEach(function (d) {
        users.push(d)
    })
});

/* creating app */
const app = express();


//const cors = require("cors");
/* 
(The MIT License)

Copyright (c) 2013 Troy Goode <troygoode@gmail.com>

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

/* to fetch the api from every origin */
/*
app.use(
    cors({
        origin: "*"
    })
<<<<<<< HEAD
<<<<<<< HEAD
);
=======
)
>>>>>>> parent of d7d3efc (Update server.js)

=======
)
*/
>>>>>>> parent of a3bdd5f (Update server.js)



<<<<<<< HEAD
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('listening at ' + port));
=======
app.disable('etag');//to guarantee that res.statusCode = 200, unless there is an error

<<<<<<< HEAD
>>>>>>> parent of 9db4b64 (back)
app.use(express.static('public'));
=======
//app.use(express.static('public'));
>>>>>>> parent of a3bdd5f (Update server.js)
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


/* Register the email and send the identifier to the user.

Attack 1: Someone call the api using random email addresses to create spam.

Solution 1: 
- The client sends the request the email address and the time.
- A nonce is sent to back to the client, one minute later. This nonce
depends on the email address.
- After the client receives the nonce, it sends it back to the server.
- The server compare both nonces, if they are the same, then proceed to
identify the client.
*/

//500 nonces
let nonces = [...Array(500)].map(value => makeId(lKey));

app.get('/nonce', async (request, response) => {
    await new Promise(resolve => setTimeout(resolve, 1000));//wait 1 min
    response.json({ ok: true, nonce: nonces[crypto.randomInt( nonces.length )] });
});

app.get('/account', async (request, response) => {

    const userNonce = request.query.nonce;
    const i = nonces.findIndex(value => value === userNonce);

    if (i === -1) {
        response.json({ ok: 2 })
    } else {
        nonces.splice(i, 1);
        nonces.push(makeId(lKey));

        const userEmail = request.query.email;
        const userLang = parseInt(request.query.lang);
        providers.find({ email: userEmail }, function (err, docs) {
            const id = makeId(lKey);
            if (docs.length == 0) {
                const newUser = {
                    identifier: id,
                    email: userEmail,
                    language: userLang,
                    recovery: Date.now(),
                    offers: []
                };
                users.push(newUser);
                autoSave();

                switch (userLang) {
                    case 0:
                        sendEmail("Identifier (Caballero Software Inc.)", "Your identifier for Caballero Software Inc. is: ", userEmail, id);
                        break;
                    case 1:
                        sendEmail("Identifiant (Caballero Software Inc.)", "Votre identifiant pour Caballero Software Inc. est : ", userEmail, id);
                        break;
                    default:
                        console.log('Problem in language data.');
                        break;
                };
                response.json({ ok: 1 })
            } else {
                response.json({ ok: 0 })
            }
        });
    }
});




app.get('/retrieve', (request, response) => {
    const email = request.query.email;

    const userNonce = request.query.nonce;
    const i = nonces.findIndex(value => value === userNonce);

    if (i === -1) {
        response.json({ ok: 2 })
    } else {
        nonces.splice(i, 1);
        nonces.push(makeId(lKey));

        providers.find({ email }, function (err, docs) {
            if (docs.length == 0) {
                response.json({ ok: 0 }) /* email not found */
            } else {
                if (Date.now() - docs[0].recovery > recoveryTime) {
                    const id = docs[0].identifier;
                    const j = users.findIndex(value => value.identifier === id);
                    users[j].recovery = Date.now();
                    autoSave();
                    switch (parseInt(users[j].language)) {
                        case 0:
                            sendEmail("Identifier (Caballero Software Inc.)", "Your identifier for Caballero Software Inc. is: ", email, id);
                            break;
                        case 1:
                            sendEmail("Identifiant (Caballero Software Inc.)", "Votre identifiant pour Caballero Software Inc. est : ", email, id);
                            break;
                        default:
                            console.log('Problem in language data.');
                            break;
                    };
                    response.json({ ok: 1 })
                } else {
                    response.json({ ok: 0 }) /* only after a day, recovery of the identifier is allowed */
                }
            }
        })
    }
});

/* authentication */

app.post('/auth', (request, response) => {
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

app.post('/del', (request, response) => {
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



app.get('/seealloffers', (request, response) => {
    let offers = [];
    let nearOffers;
    const point1 = { lat: parseFloat(request.query.lat), lon: parseFloat(request.query.lon) };
    const dist = parseFloat(request.query.dist);
    for (let j = 0; j < users.length; j++) {
        nearOffers = users[j].offers.filter(offer => {
            const point2 = offer.location;
            if (distance(point1, point2) <= dist) {
                return true
            } else {
                return false
            }
        });
        offers = offers.concat(nearOffers);
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
app.post('/upload', (request, response) => {
    users = request.body.file.split('\n').filter(x => x != '').map(x => JSON.parse(x));
    response.json({ ok: true });
});


function toRad(x) {
    return x * Math.PI / 180;
}

function distance(x, y) {
    // Haversine formula 
    // https://www.wikiwand.com/en/Haversine_formula
    const lat1 = x.lat;
    const lat2 = y.lat;
    const lon1 = x.lon;
    const lon2 = y.lon;

    let R = 6371; // km
    let x1 = lat2 - lat1;
    let dLat = toRad(x1);
    let x2 = lon2 - lon1;
    let dLon = toRad(x2);
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c // in km
}