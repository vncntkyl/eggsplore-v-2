/* eslint-disable react/prop-types */
import jsPDF from "jspdf";
import "jspdf-autotable";
import { format, toDate } from "date-fns";
import Button from "./Button";
import { AiFillPrinter } from "react-icons/ai";

export default function GenerateReport({
  record,
  tableHeader,
  fileTitle,
  fileName,
}) {
  const generate = () => {
    const doc = new jsPDF({ orientation: "landscape", format: "legal" });

    const width =
      doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    const height =
      doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    let margin;
    doc.autoTable({
      startY: 30,
      styles: { halign: "center" },
      margin: { top: 30 },
      head: [tableHeader],
      body: record,
      didDrawPage: (data) => {
        margin = data.settings.margin.left;

        doc.text("Edwin and Lina Poultry Farm", width / 2, 10, {
          align: "center",
          baseline: "top",
        });

        doc.setFontSize(12);
        doc.text(fileTitle, width / 2, 20, { align: "center" });

        const str = "Page " + doc.internal.getNumberOfPages();
        doc.text(str, margin, height - 10);
      },
    });
    const lastPage = doc.internal.getNumberOfPages();
    const currentDate = toDate(new Date());
    const date = format(currentDate, "MM/dd/yyyy hh:mm:ss a");
    const dateFormatted = "Printed on " + date;
    const dateWidth = doc.getTextWidth(dateFormatted);

    doc.setPage(lastPage);
    doc.setFontSize(11);

    doc.text("Noted by: ", margin, height - 40, {
      align: "left",
      baseline: "bottom",
    });
    doc.text(dateFormatted, width - dateWidth + margin, height - 10, {
      align: "left",
      baseline: "bottom",
    });
    doc.save(fileName);
  };
  return (
    <>
      <Button
        onClick={() => generate()}
        value={
          <div className="flex items-center gap-1">
            <AiFillPrinter />
            <span>Generate Report</span>
          </div>
        }
        className={
          "bg-main text-white p-1 px-2 rounded-full text-[.9rem] transition-all hover:bg-tertiary hover:text-main"
        }
      />
    </>
  );
}
