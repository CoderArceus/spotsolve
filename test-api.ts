import fs from "fs";

async function run() {
  const fd = new FormData();
  // Create a 1x1 png image
  const dummyImage = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64");
  fd.append("image", new Blob([dummyImage], { type: "image/png" }), "dummy.png");
  fd.append("latitude", "0");
  fd.append("longitude", "0");

  const res = await fetch("http://localhost:3000/api/analyze-issue", {
    method: "POST",
    body: fd
  });
  
  console.log("STATUS:", res.status);
  const text = await res.text();
  console.log("RESPONSE:", text);
}

run();
