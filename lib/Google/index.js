const {
  PRIVATE_KEY_ID: key,
  CLIENT_ID: serviceAccountId,
  BOYNBLAT: keyId,
  SERVICE_EMAIL: email
} = process.env;

const { google } = require('googleapis');

class Gapi {
  constructor() {
    this.auth = null;
    this.calendarId = this.calendarId;
  }

  get getAuth() {
    return this._auth;
  }

  set setAuth(t) {
    this._auth = t;
  }

  async connect() {
    try {
      this.setAuth = await await new google.auth.JWT(email, null, key, [
        'https://www.googleapis.com/auth/calendar'
      ]);
    } catch (e) {
      console.error(e);
    }
  }

  async calendarApi() {
    return await google.calendar({
      version: 'v3',
      auth: this.getAuth,
      calendarId
    });
  }

  async getEvents() {
    const cal = await this.calendarApi();
    return await cal.events.list();
  }
}

module.exports = Gapi;
