const { jsPDF } = window.jspdf;

// bacord 기본값
document.querySelectorAll(".barcode-text").forEach(e => {
  e.value = "GK" + new Date().toISOString().slice(2,7).replace("-","");
})


// start
document.querySelector("#start").addEventListener("click", async function(){
  const datas = [];
  const productNames = document.querySelectorAll(".product-code");
  const barcodeTexts = document.querySelectorAll(".barcode-text");
  
  productNames.forEach((element, cnt) => {
    const productName = element.value.trim();
    const barcodeText = barcodeTexts[cnt]?.value.trim();
    if (productName && barcodeText) datas.push({ productName, barcodeText });
  });
  
  // filter
  if(datas.length==0){ return alert("값을 입력해주세요.") }
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: [210, 297] });

  // create
  for (const target of ["small", "medium", "large"]) {
    let startIndex = Number(document.querySelector(`#${target}-idx`).value);
    let count = Number(document.querySelector(`#${target}-cnt`).value);
    
    if (startIndex > 0) {
      // addPage
      if(target != "small" && count > 0){ pdf.addPage(); }
      
      // addLabel
      for (const { productName, barcodeText } of datas) {
        await window[`${target}Label`](pdf, startIndex, count, barcodeText, productName);
        startIndex += count;
      }
    }
  }

  // save
  pdf.save(`${datas[0].productName}.pdf`);
})


// smallLabel
async function smallLabel(pdf, startIndex, count, barcodeText) {
  const templateImg = await imageToBase64("./template/small.png");
  const workspace = { 
    pdf: { top: 23.3, left: 9.7 },
    label: { width: 30, height: 14, cols: 6, rows: 16, gap: 2 },
    bacrod: { x: 10, y: 2, w: 18, h:6 },
    serial: { x: 1.5, y: 8.5, w: 27, h:3 }
  };

  // create bacord
  JsBarcode("#barcode", barcodeText, { format: "CODE128", width: workspace.bacrod.w, height: workspace.bacrod.h, displayValue: false, margin: 0 });
  const barcodeImg = await svgToPng( document.querySelector("#barcode") );

  for (let i = 0; i < count; i++) {
    const index = startIndex + i;
    if (index >= workspace.label.cols * workspace.label.rows) break;

    const row = Math.floor(index / workspace.label.cols);
    const col = index % workspace.label.cols;
    const x = workspace.pdf.left + col * (workspace.label.width + workspace.label.gap);
    const y = workspace.pdf.top + row * (workspace.label.height + workspace.label.gap);

    // template & bacord
    pdf.addImage( templateImg, "PNG", x, y, workspace.label.width, workspace.label.height );
    pdf.addImage( barcodeImg, "PNG", x + workspace.bacrod.x, y + workspace.bacrod.y, workspace.bacrod.w, workspace.bacrod.h );

    // serial
    pdf.setFontSize(7);
    pdf.text(`Serial No. ${barcodeText}`, x + workspace.serial.x + workspace.serial.w / 2, y + workspace.serial.y + workspace.serial.h, { align: "center", maxWidth: workspace.serial.w });
  }
}


// mediumLabel
async function mediumLabel(pdf, startIndex, count, barcodeText) {
  const templateImg = await imageToBase64("./template/medium.png");
  const workspace = { 
    pdf: { top: 14.5, left: 6.5 },
    label: { width: 64, height: 33.86, cols: 3, rows: 8, gap: 2.4 },
    bacrod: { x: 6, y: 18, w: 52, h:6 },
    serial: { x: 3, y: 27, w: 58, h:3 }
  };

  // create bacord
  JsBarcode("#barcode", barcodeText, { format: "CODE128", width: workspace.bacrod.w, height: workspace.bacrod.h, displayValue: false, margin: 0 });
  const barcodeImg = await svgToPng( document.querySelector("#barcode") );

  for (let i = 0; i < count; i++) {
    const index = startIndex + i;
    if (index >= workspace.label.cols * workspace.label.rows) break;

    const row = Math.floor(index / workspace.label.cols);
    const col = index % workspace.label.cols;
    const x = workspace.pdf.left + col * (workspace.label.width + workspace.label.gap);
    const y = workspace.pdf.top + row * (workspace.label.height);

    // template & bacord
    pdf.addImage( templateImg, "PNG", x, y, workspace.label.width, workspace.label.height );
    pdf.addImage( barcodeImg, "PNG", x + workspace.bacrod.x, y + workspace.bacrod.y, workspace.bacrod.w, workspace.bacrod.h );

    // serial
    pdf.setFontSize(10);
    pdf.text(`Serial No. ${barcodeText}`, x + workspace.serial.x + workspace.serial.w / 2, y + workspace.serial.y + workspace.serial.h, { align: "center", maxWidth: workspace.serial.w });
  }
}


// largeLabel 
async function largeLabel(pdf, startIndex, count, barcodeText, productName) {
  const templateImg = await imageToBase64("./template/large.png");
  const workspace = { 
    pdf: { top: 9.8, left: 4.5 },
    label: { width: 98.73, height: 138.94, cols: 2, rows: 2, gap: 2.5 },
    product: { x: 7, y: 53, w: 85, h: 15 },
    bacrod: { x: 7, y: 105, w: 85, h: 15 },
    serial: { x: 7, y: 125, w: 85, h: 3 }
  };

  // create bacord
  JsBarcode("#barcode", barcodeText, { format: "CODE128", width: workspace.bacrod.w, height: workspace.bacrod.h, displayValue: false, margin: 0 });
  const barcodeImg = await svgToPng( document.querySelector("#barcode") );

  for (let i = 0; i < count; i++) {
    const index = startIndex + i;
    if (index >= workspace.label.cols * workspace.label.rows) break;

    const row = Math.floor(index / workspace.label.cols);
    const col = index % workspace.label.cols;
    const x = workspace.pdf.left + col * (workspace.label.width + workspace.label.gap);
    const y = workspace.pdf.top + row * (workspace.label.height);

    // template & bacord
    pdf.addImage( templateImg, "PNG", x, y, workspace.label.width, workspace.label.height );
    pdf.addImage( barcodeImg, "PNG", x + workspace.bacrod.x, y + workspace.bacrod.y, workspace.bacrod.w, workspace.bacrod.h );

    // serial
    pdf.setFontSize(15);
    pdf.text(productName, x + workspace.product.x + workspace.product.w / 2, y + workspace.product.y + workspace.product.h, { align: "center", maxWidth: workspace.product.w });
    pdf.text(`Serial No. ${barcodeText}`, x + workspace.serial.x + workspace.serial.w / 2, y + workspace.serial.y + workspace.serial.h, { align: "center", maxWidth: workspace.serial.w });
  }
}


// image
async function imageToBase64(src) {
  const res = await fetch(src);
  const blob = await res.blob();

  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

function svgToPng(svgEl) {
  return new Promise(resolve => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const data = new XMLSerializer().serializeToString(svgEl);
    const url = URL.createObjectURL( new Blob([data], { type: "image/svg+xml;charset=utf-8" }) );

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png"));
    };

    img.src = url;
  });
}