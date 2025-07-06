import type { AudioFile } from "@prisma/client";

const getMimeType = (filename: string): string => {
  const ext = filename.split(".").pop();
  switch (ext) {
    case "mp3":
      return "audio/mpeg";
    case "wav":
      return "audio/wav";
    case "webm":
      return "audio/webm";
    case "ogg":
      return "audio/ogg";
    case "m4a":
      return "audio/mp4";
    default:
      return "audio/*";
  }
};

const SideBar = ({ audioFiles }: { audioFiles: AudioFile[] }) => {
  console.log(audioFiles);
  JSON.stringify(audioFiles);

  return (
    <div className="w-1/3 bg-gray-50 p-4">
      <h2 className="font-bold mb-2">🎵 Твої аудіофайли</h2>
      <ul className="space-y-3">
        {audioFiles.map((file, index) => (
          <li key={file.id} className="flex items-center gap-2">
            <span>📁 AudioFile {index + 1}</span>
            <audio controls className="w-full">
              <source src={file.url} type={getMimeType(file.url)} />
              Твій браузер не підтримує програвач
            </audio>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;
