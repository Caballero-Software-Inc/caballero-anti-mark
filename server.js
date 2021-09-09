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

const useAWS = true;






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


const recoveryTime = 86400000; // time from one recovery of code to another
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



const AWS = require('aws-sdk');
// https://github.com/aws/aws-sdk-js/blob/master/LICENSE.txt


const ID = process.env.AWSAccessKeyId;
const SECRET = process.env.AWSSecretKey;
const BUCKET_NAME = process.env.BUCKET_NAME;
const region = process.env.BUCKET_REGION;

const accessKeyId = process.env.AccessKeyID;
const secretAccessKey = process.env.SecretAccessKey;

const s3 = new AWS.S3({
    accessKeyId,
    secretAccessKey,
    region
});


function uploadFile(fileName) {
    if (useAWS) {
        const fileContent = fs.readFileSync(fileName);

        const params = {
            Bucket: BUCKET_NAME,
            Key: fileName,
            Body: fileContent
        };

        // Uploading files to the bucket
        s3.upload(params, function (err, data) {
            if (err) {
                throw err;
            }
            console.log(`File uploaded successfully. ${data.Location}`);
        });
    } else {
        console.log(`File not uploaded.`);
    }
}


function downloadFile(fileName, code) {
    if (useAWS) {
        const params = {
            Bucket: BUCKET_NAME,
            Key: fileName
        };

        s3.getObject(params, (err, data) => {
            if (err) {
                throw err
            }
            fs.writeFileSync('./' + fileName, data.Body);
            console.log('File downloaded successfully.');
            code()
        })
    } else {
        console.log('File not downloaded.');
        code()
    }
}



function getUsers(code) {
    downloadFile('userdb.csv', () => {
        fs.readFile('userdb.csv', async (err, data) => {
            let users = await neatCsv(data);
            users = users.map(value => {
                value.recovery = parseInt(value.recovery);
                return value
            });
            code(users)
        });
    });
}


async function getOffers(code) {
    downloadFile('offerdb.csv', () => {
        fs.readFile('offerdb.csv', async (err, data) => {
            let offers = await neatCsv(data);
            offers = offers.map(offer => {
                offer.lat = parseFloat(offer.lat);
                offer.lon = parseFloat(offer.lon);
                return offer
            });
            code(offers)
        });
    });
}

function getHashes(code) {
    downloadFile('hashdb.csv', () => {
        fs.readFile('hashdb.csv', async (err, data) => {
            let hList = await neatCsv(data);
            code(hList)
        });
    });
}

function getJobs(code) {
    downloadFile('jobdb.csv', () => {
        fs.readFile('jobdb.csv', async (err, data) => {
            let jobs = await neatCsv(data);
            code(jobs)
        });
    });
}


function save(path, header, data) {
    const createCsvWriter = writeCsv.createObjectCsvWriter;
    const csvWriter = createCsvWriter({ path, header });
    csvWriter
        .writeRecords(data)
        .then(() => {
            uploadFile(path);
            console.log('Saved')
        });
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
        origin: "https://caballero.software"
    })
);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('listening at ' + port));

app.disable('etag');//to guarantee that res.statusCode = 200, unless there is an error

app.use(express.static('public'));
app.use(express.json({ limit: '5mb' }));





//init
/*
save('userdb.csv',
    [
        { id: 'email', title: 'email' },
        { id: 'id', title: 'id' },
        { id: 'recovery', title: 'recovery' },
        { id: 'credits', title: 'credits' }
    ], []);


save('hashdb.csv',
    [
        { id: 'hash', title: 'hash' }
    ], []);

save('offerdb.csv',
    [
        { id: 'email', title: 'email' },
        { id: 'kind', title: 'kind' },
        { id: 'web', title: 'web' },
        { id: 'lat', title: 'lat' },
        { id: 'lon', title: 'lon' },
        { id: 'description', title: 'description' }
    ], []);

    save('jobdb.csv',
    [
        { id: 'email', title: 'email' },
        { id: 'kind', title: 'kind' },
        { id: 'web', title: 'web' },
        { id: 'skills', title: 'skills' },
        { id: 'country', title: 'country' }
    ], []);
*/



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
    getUsers(async users => {
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
                const {
                    createHash
                } = await import('crypto');

                const hash = createHash('sha256');

                hash.update(userEmail);

                const emailHash = hash.digest('hex');

                getHashes(hList => {
                    const i = hList.findIndex(value => value.hash === emailHash);

                    let credits;
                    if (i === -1) {
                        hList.push({ hash: emailHash });
                        save('hashdb.csv',
                            [
                                { id: 'hash', title: 'hash' }
                            ], hList);
                        credits = 100
                    } else {
                        credits = 0
                    }

                    const newUser = {
                        email: userEmail,
                        id: id,
                        recovery: Date.now(),
                        credits: credits
                    };
                    users.push(newUser);
                    save('userdb.csv',
                        [
                            { id: 'email', title: 'email' },
                            { id: 'id', title: 'id' },
                            { id: 'recovery', title: 'recovery' },
                            { id: 'credits', title: 'credits' }
                        ], users);
                });

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
});

app.get('/retrieve', (request, response) => {
    getUsers(users => {
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
                            { id: 'recovery', title: 'recovery' },
                            { id: 'credits', title: 'credits' }
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
});


/* authentication */
app.get('/auth', (request, response) => {
    getUsers(users => {
        const id = request.query.id;
        const email = request.query.email;

        const j = users.findIndex(value => value.id === id);

        if (j === -1) {
            response.json({ ok: false })
        } else {
            if (users[j].email === email) {
                response.json({ ok: true })
            } else {
                response.json({ ok: false })
            }
        }
    });
});

/* credits */
app.get('/credits', (request, response) => {
    getUsers(users => {
        const id = request.query.id;
        const email = request.query.email;

        const j = users.findIndex(value => value.id === id);

        if (j === -1) {
            response.json({ ok: false })
        } else {
            if (users[j].email == email) {
                response.json({ ok: true, credits: users[j].credits })
            } else {
                response.json({ ok: false })
            }
        }
    });
});

/* delete account */
app.post('/del', (request, response) => {
    getUsers(users => {
        const id = request.body.userId;
        const j = users.findIndex(value => value.id === id);
        const email = request.body.userEmail;

        if (users[j].email === email) {
            users.splice(j, 1);
            response.json({ ok: true });
            // del user
            save('userdb.csv',
                [
                    { id: 'email', title: 'email' },
                    { id: 'id', title: 'id' },
                    { id: 'recovery', title: 'recovery' },
                    { id: 'credits', title: 'credits' }
                ], users);

            //del offer
            getOffers(offers => {
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
            })
        } else {
            response.json({ ok: false });
        }
    });
});


// offers
app.post('/newoffer', (request, response) => {
    getUsers(users => {
        const id = request.body.userId;
        const email = request.body.userEmail;
        const j = users.findIndex(value => value.email === email);
        if (users[j].id === id) {
            getOffers(offers => {
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
            });
            response.json({ ok: true });
        } else {
            response.json({ ok: false });
        }
    });
});

app.post('/newjob', (request, response) => {
    getUsers(users => {
        const id = request.body.userId;
        const email = request.body.userEmail;
        const j = users.findIndex(value => value.email === email);
        if (users[j].id === id) {
            getJobs(jobs => {
                let newJob = request.body.newJob;
                newJob.email = email;
                jobs.push(newJob);
                save('jobdb.csv',
                    [
                        { id: 'email', title: 'email' },
                        { id: 'kind', title: 'kind' },
                        { id: 'web', title: 'web' },
                        { id: 'skills', title: 'skills' },
                        { id: 'country', title: 'country' }
                    ], jobs);
            });
            response.json({ ok: true });
        } else {
            response.json({ ok: false });
        }
    });
});



app.get('/seealloffers', (request, response) => {
    getOffers(offers => {
        getUsers(users => {
            const point1 = { lat: parseFloat(request.query.lat), lon: parseFloat(request.query.lon) };
            const dist = parseFloat(request.query.dist);
            const nearOffers = offers.filter(offer => {
                const point2 = { lat: offer.lat, lon: offer.lon };
                if (distance(point1, point2) <= dist) {
                    const i = users.findIndex(user => user.email === offer.email);
                    return (users[i].credits > 0)
                } else {
                    return false
                }
            }).flat()
                .map(offer => withoutEmail(offer));
            response.json({ ok: true, offers: nearOffers });
        });
    });
});



app.get('/seealljobs', (request, response) => {
    getJobs(jobs => {
        getUsers(users => {
            const validJobs = jobs.filter(job => {
                const i = users.findIndex(user => user.email === job.email);
                return (users[i].credits > 0)
            }).flat()
                .map(job => withoutEmailJob(job));
            response.json({ ok: true, jobs: validJobs });
        });
    });
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

function withoutEmailJob(job) {
    const noEmail = {
        kind: job.kind,
        web: job.web,
        skills: job.skills,
        country: job.country
    };
    return noEmail
}



app.post('/seeoffers', (request, response) => {
    getUsers(users => {
        const email = request.body.userEmail;
        const id = request.body.userId;

        const j = users.findIndex(value => value.id === id);

        if (users[j].email === email) {
            getOffers(offers => {
                const myOffers = offers.filter(offer => {
                    return offer.email === email
                }).map(offer => {
                    return withoutEmail(offer)
                });
                response.json({ ok: true, offers: myOffers });
            })
        } else {
            response.json({ ok: false });
        }
    });
});

app.post('/seejobs', (request, response) => {
    getUsers(users => {
        const email = request.body.userEmail;
        const id = request.body.userId;

        const j = users.findIndex(value => value.id === id);

        if (users[j].email === email) {
            getJobs(jobs => {
                const myJobs = jobs.filter(job => {
                    return job.email === email
                }).map(job => {
                    return withoutEmailJob(job)
                });
                response.json({ ok: true, jobs: myJobs });
            })
        } else {
            response.json({ ok: false });
        }
    });
});



app.post('/deloffer', (request, response) => {
    getUsers(users => {

        const email = request.body.userEmail;
        const id = request.body.userId;
        const str = JSON.stringify(request.body.str);

        const j = users.findIndex(value => value.id === id);

        if (users[j].email === email) {
            getOffers(offers => {
                offers = offers.filter(offer => {
                    return (JSON.stringify(withoutEmail(offer)) != str)
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
            })
        } else {
            response.json({ ok: false });
        }
    });
});



app.post('/deljob', (request, response) => {
    getUsers(users => {

        const email = request.body.userEmail;
        const id = request.body.userId;
        const str = JSON.stringify(request.body.str);

        const j = users.findIndex(value => value.id === id);

        if (users[j].email === email) {
            getJobs(jobs => {
                jobs = jobs.filter(job => {
                    return (JSON.stringify(withoutEmailJob(job)) != str)
                });
                response.json({ ok: true });

                save('jobdb.csv',
                    [
                        { id: 'email', title: 'email' },
                        { id: 'kind', title: 'kind' },
                        { id: 'web', title: 'web' },
                        { id: 'skills', title: 'skills' },
                        { id: 'country', title: 'country' }
                    ], jobs);
            })
        } else {
            response.json({ ok: false });
        }
    });
});

app.post('/deccredits', async (request, response) => {
    let web = await request.body.web;
    getOffers(offers => {
        const i = offers.findIndex(value => value.web === web);
        const email = offers[i].email;
        getUsers(users => {
            const j = users.findIndex(value => value.email === email);
            users[j].credits = users[j].credits - 1;
            save('userdb.csv',
                [
                    { id: 'email', title: 'email' },
                    { id: 'id', title: 'id' },
                    { id: 'recovery', title: 'recovery' },
                    { id: 'credits', title: 'credits' }
                ], users);
        })
    });
    response.json({ ok: true });
});

app.post('/deccreditsjobs', async (request, response) => {
    let web = await request.body.web;
    getJobs(jobs => {
        const i = jobs.findIndex(job => job.web === web);
        const email = jobs[i].email;
        getUsers(users => {
            const j = users.findIndex(user => user.email === email);
            users[j].credits = users[j].credits - 1;
            save('userdb.csv',
                [
                    { id: 'email', title: 'email' },
                    { id: 'id', title: 'id' },
                    { id: 'recovery', title: 'recovery' },
                    { id: 'credits', title: 'credits' }
                ], users);
        })
    });
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