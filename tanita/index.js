const os = require(`os`);
const path = require(`path`);
const fs = require(`fs`);
const config = require(`dotenv`).config();
const express = require(`express`);
const multer  = require('multer');
// const upload = multer({ dest: path.resolve(process.env.UPLOAD_DIR) });

// Create Home Directory
const homeDir = process.env[`HOME_DIR`];
if (!fs.existsSync(homeDir)){
  fs.mkdirSync(homeDir, { recursive: true });
}

console.log(`upload dir: `, process.env[`UPLOAD_DIR`]);

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    // Create Upload Directory
    const uploadDir = process.env[`UPLOAD_DIR`];
    if (!fs.existsSync(uploadDir)){
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    callback(null, uploadDir);
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});
const upload = multer({ storage });
// const upload = multer({ dest: process.env[`UPLOAD_DIR`] });
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
  res.redirect(`/home?${paramString}`);
});

app.post('/upload', upload.array('file'), function (req, res) {
  console.log(req.files, req.body);
  res.status(201).json(req.files);
});

app.post('/uploadpdf', upload.single('file'), function (req, res) {
  console.log(req.file, req.body);
  res.status(201).json(req.file);
});

app.post('/uploadjson', upload.single('file'), function (req, res) {
  console.log(`req: `, req.path);
  res.status(201).json(req.file);
});

app.get(`/list`, (req, res) => {
  const queryPath = req.query.path || `custom/json`;
  // console.log(`params: `, req.query);
  const dir = path.join(`./static`, queryPath);
  fs.readdir(dir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading directory' });
    }
    res.json({ files });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
