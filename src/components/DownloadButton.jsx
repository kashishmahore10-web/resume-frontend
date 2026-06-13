const DownloadButton = () => {
  const handlePrint = () => {
    const printContents = document.getElementById("resume-preview").innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = `
      <html>
        <head>
          <title>Resume</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            @page { size: A4; margin: 10mm; }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `;

    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <button
      onClick={handlePrint}
      className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
    >
      📄 Download PDF
    </button>
  );
};

export default DownloadButton;