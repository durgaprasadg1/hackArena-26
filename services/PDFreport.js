import PDFDocument from "pdfkit";
import fs from "fs";

export function generateReport(data, path) {

  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(path));

  doc.fontSize(20).text("NutriSync Report");

  doc.moveDown();

  doc.text(`Calories Intake: ${data.intake}`);
  doc.text(`Calories Burned: ${data.burn}`);

  doc.end();

}