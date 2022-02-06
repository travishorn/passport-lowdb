# Passport.js lowdb

Web form authentication using Passport.js and lowdb.

## Installation

Clone this repository

```bash
git clone https://github.com/travishorn/passport-lowdb
```

Change into the directory

```bash
cd passport-lowdb
```

Install dependencies

```bash
npm install
```

## Run the Server

Set environment variables. You can set them manually or create a `.env` file.

```bash
KEY_LEN=64 # Key length for password hashing using scrypt
PORT=3000 # Port that web server will listen on
SALT_LEN=64 # Salt length for password hashing using scrypt
SESSION_SECRET=secret # Secret used to sign the session ID cookie
```

Start the server

```bash
npm start
```

By default, the server will be listening at http://localhost:3000

Users and sessions are stored in `db.json`. If it doesn't exist, it will be
created when the server is first run.

## License

The MIT License (MIT)
Copyright © 2022 Travis Horn

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the “Software”), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
