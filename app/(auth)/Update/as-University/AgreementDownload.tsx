import { Button } from "antd";
import { AiOutlineDownload } from "react-icons/ai";

const DownloadButton: React.FC = () => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/files/university_agreement.pdf";
    link.download = "/files/university_agreement.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <Button type="primary" icon={<AiOutlineDownload className="text-xl" />} size="large" onClick={handleDownload}>
        Download agreement
      </Button>
    </div>
  );
};

export default DownloadButton;
