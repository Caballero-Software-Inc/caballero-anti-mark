'use strict';
/*
Node.js is licensed for use as follows:

"""
Copyright Node.js contributors. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
*/

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


const recoveryTime = 10 //86400000; // time from one recovery of code to another
const lKey = 50;/* length of the key */



const appLogin = 'caballerosoftwareinc@gmail.com';
const appPassword = process.env.APPPASSWORD;

// it is cryptographically secure
function makeId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    const result = [...Array(charactersLength)]
        .map(value => characters.charAt(crypto.randomInt(charactersLength)))
        .join('');
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
const fs = require('fs');
const neatCsv = require('neat-csv');
/*
MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

const writeCsv = require('csv-writer');
/*   
MIT License

Copyright (c) 2020 Ryuichi Inagaki

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
*/

const createCsvWriter = writeCsv.createObjectCsvWriter;

let users;
let offers;

fs.readFile('userdb.csv', async (err, data) => {
    if (err) {
        const csvWriter = createCsvWriter({
            path: 'userdb.csv',
            header: [
                        { id: 'email', title: 'email' },
                        { id: 'id', title: 'id' },
                        { id: 'recovery', title: 'recovery' }
                    ]
        });
        users = [];
        return
    }
    users = await neatCsv(data);
    users = users.map(value => {
        value.recovery = parseInt(value.recovery);
        return value
    });
});

fs.readFile('offerdb.csv', async (err, data) => {
    if (err) {
        const csvWriter = createCsvWriter({
            path: 'offerdb.csv',
            header: [
                        { id: 'email', title: 'email' },
                        { id: 'kind', title: 'kind' },
                        { id: 'web', title: 'web' },
                        { id: 'lat', title: 'lat' },
                        { id: 'lon', title: 'lon' },
                        { id: 'description', title: 'description' }
                    ]
        })
        offers = [];
        return
    }
    offers = await neatCsv(data);
    offers = offers.map(offer => {
        offer.lat = parseFloat(offer.lat);
        offer.lon = parseFloat(offer.lon);
        return offer
    });
});


function save(path, header, data) {
    const csvWriter = createCsvWriter({ path, header });
    csvWriter
        .writeRecords(data)
        .then(() => console.log('Saved'));
}


/* creating app */
const app = express();

const cors = require("cors");
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
app.use(
    cors({
        origin: "*"
    })
);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('listening at ' + port));

app.disable('etag');//to guarantee that res.statusCode = 200, unless there is an error

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
    response.json({ ok: true, nonce: nonces[crypto.randomInt(nonces.length)] });
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
        const j = users.findIndex(value => value.email === userEmail);
        if (j === -1) {
            const id = makeId(lKey);
            const newUser = {
                email: userEmail,
                id: id,
                recovery: Date.now()
            };
            users.push(newUser);
            save('userdb.csv',
                [
                    { id: 'email', title: 'email' },
                    { id: 'id', title: 'id' },
                    { id: 'recovery', title: 'recovery' }
                ], users);

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
    }
});

app.get('/retrieve', (request, response) => {
    const email = request.query.email;
    const userLang = parseInt(request.query.lang);
    const userNonce = request.query.nonce;
    const i = nonces.findIndex(value => value === userNonce);

    if (i === -1) {
        response.json({ ok: 2 })
    } else {
        nonces.splice(i, 1);
        nonces.push(makeId(lKey));

        const j = users.findIndex(value => value.email === email);

        if (j === -1) {
            response.json({ ok: 0 }) /* email not found */
        } else {
            if (Date.now() - users[j].recovery > recoveryTime) {
                const id = users[j].id;
                users[j].recovery = Date.now();
                save('userdb.csv',
                    [
                        { id: 'email', title: 'email' },
                        { id: 'id', title: 'id' },
                        { id: 'recovery', title: 'recovery' }
                    ], users);
                switch (userLang) {
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
    }
});


/* authentication */
app.get('/auth', (request, response) => {
    const id = request.query.id;
    const email = request.query.email;

    const j = users.findIndex(value => value.id === id);

    if (j === -1) {
        response.json({ ok: false })
    } else {
        if (users[j].email == email) {
            if (users[j].email == "caballero@caballero.software") {
                response.json({ ok: true, providers: users })
            } else {
                response.json({ ok: true })
            }
        } else {
            response.json({ ok: false })
        }
    }
});

/* delete account */
app.post('/del', (request, response) => {
    const id = request.body.userId;
    const j = users.findIndex(value => value.id === id);
    const email = request.body.userEmail;

    if (users[j].email == email) {
        users.splice(j, 1);
        response.json({ ok: true });
        // del user
        save('userdb.csv',
            [
                { id: 'email', title: 'email' },
                { id: 'id', title: 'id' },
                { id: 'recovery', title: 'recovery' }
            ], users);

        //del offer
        offers = offers.filter(offer => offer.email != email);
        save('offerdb.csv',
            [
                { id: 'email', title: 'email' },
                { id: 'kind', title: 'kind' },
                { id: 'web', title: 'web' },
                { id: 'lat', title: 'lat' },
                { id: 'lon', title: 'lon' },
                { id: 'description', title: 'description' }
            ], offers);

    } else {
        response.json({ ok: false });
    }
});


// offers
app.post('/newoffer', (request, response) => {
    const id = request.body.userId;
    const email = request.body.userEmail;
    const j = users.findIndex(value => value.email === email);


    if (users[j].id === id) {
        let newOffer = request.body.newOffer;
        newOffer.email = email;
        offers.push(newOffer);
        save('offerdb.csv',
            [
                { id: 'email', title: 'email' },
                { id: 'kind', title: 'kind' },
                { id: 'web', title: 'web' },
                { id: 'lat', title: 'lat' },
                { id: 'lon', title: 'lon' },
                { id: 'description', title: 'description' }
            ], offers);
        response.json({ ok: true });
    } else {
        response.json({ ok: false });
    }
});



app.get('/seealloffers', (request, response) => {
    const point1 = { lat: parseFloat(request.query.lat), lon: parseFloat(request.query.lon) };
    const dist = parseFloat(request.query.dist);
    const nearOffers = offers.filter(offer => {
        const point2 = { lat: offer.lat, lon: offer.lon };
        if (distance(point1, point2) <= dist) {
            return true
        } else {
            return false
        }
    }).flat()
        .map(offer => {
            const noemail = {
                kind: offer.kind,
                web: offer.web,
                lat: offer.lat,
                lon: offer.lon,
                description: offer.description
            }
            return noemail
        });
    response.json({ ok: true, offers: nearOffers });
});

function withoutEmail(offer) {
    const noEmail = {
        kind: offer.kind,
        web: offer.web,
        lat: offer.lat,
        lon: offer.lon,
        description: offer.description
    };
    return noEmail
}

app.post('/seeoffers', (request, response) => {
    const email = request.body.userEmail;
    const id = request.body.userId;

    const j = users.findIndex(value => value.id === id);

    if (users[j].email === email) {
        let myOffers = offers.filter(offer => {
            return offer.email === email
        }).map(offer => {
            return withoutEmail(offer)
        });
        response.json({ ok: true, offers: myOffers });
    } else {
        response.json({ ok: false });
    }
});

app.post('/deloffer', (request, response) => {
    const email = request.body.userEmail;
    const id = request.body.userId;
    const str = JSON.stringify(request.body.str);

    const j = users.findIndex(value => value.id === id);

    if (users[j].email === email) {

        offers = offers.filter(offer => {
            const b = (JSON.stringify(withoutEmail(offer)) != str);
            console.log(str);
            console.log(JSON.stringify(withoutEmail(offer)));
            console.log(b);
            return b
        });
        response.json({ ok: true });

        save('offerdb.csv',
            [
                { id: 'email', title: 'email' },
                { id: 'kind', title: 'kind' },
                { id: 'web', title: 'web' },
                { id: 'lat', title: 'lat' },
                { id: 'lon', title: 'lon' },
                { id: 'description', title: 'description' }
            ], offers);
    } else {
        response.json({ ok: false });
    }
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