import express, { Request, Response } from "express";
import cors from "cors";
import { UrlModel } from "./db";
import * as dotenv from "dotenv";
import QRCode from "qrcode";
dotenv.config();
const BACKEND_URL = process.env.BACKEND_URL;

const app = express();
app.use(cors());
app.use(express.json());

function random(len: number) {
  let options = "mnbvcguioqwertyuiopqadlksjhcv09876543145vhsda9382";
  let length = options.length;

  let ans = "";

  for (let i = 0; i < len; i++) {
    ans += options[Math.floor(Math.random() * length)];
  }

  return ans;
}

app.get("/api", (req: Request, res: Response) => {
  res.status(200).json({
    message: "OK",
  });
});

app.post("/api/shorten", async (req: Request, res: Response) => {
  try {
    const { originalUrl } = req.body;
    const urlHash = random(9);
    const url = new UrlModel({
      originalUrl,
      urlHash,
      visits: 0,
    });
    const newUrl = `${BACKEND_URL}/${urlHash}`;
    const qrCode = await QRCode.toDataURL(newUrl);
    await url.save();
    res.status(200).json({
      message: "URL generated.",
      urlHash,
      qrCode,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.get("/:urlHash", async (req: Request, res: Response) => {
  try {
    const urlHash = req.params.urlHash;
    const url = await UrlModel.findOne({ urlHash });
    if (url) {
      url.visits++;
      await url.save();
      res.redirect(url.originalUrl);
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.get("/stats/:urlHash", async (req: Request, res: Response) => {
  try {
    const urlHash = req.params.urlHash;
    const url = await UrlModel.findOne({ urlHash });
    res.status(200).json({
      message: "Link found",
      visits: url?.visits,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.listen(3000);
