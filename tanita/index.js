const path = require(`path`);
const config = require(`dotenv`).config();
const express = require(`express`);
const app = express();

const port = process.env.PORT;
const gateway = {
  host: encodeURIComponent(process.env.GATEWAY_HOST),
  jwt: encodeURIComponent(process.env.GATEWAY_JWT),
};

const paramKeys = Object.keys(process.env)
  .filter(e => e.startsWith(`GATEWAY_PARAMS`));
const paramString = paramKeys.map(e => process.env[e]).join(`&`);

app.use(`/static`, express.static(`static`))
app.use(`/home`, express.static(`index.html`))

app.get(`/`, (req, res) => {
  // res.sendFile(path.join(__dirname, `index.html`));
  // res.redirect(`/home?url=${gateway.host}&jwt=${gateway.jwt}&${paramString}`);
  res.redirect(`/home?${paramString}`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
