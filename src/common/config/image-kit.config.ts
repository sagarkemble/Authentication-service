import ImageKit from "@imagekit/nodejs";
import fs from "fs";

export const imageKit = new ImageKit({
  privateKey: process.env["IMAGE_KIT_PRIVATE_KEY"],
});
