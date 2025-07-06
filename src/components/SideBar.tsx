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
  JSON.stringify(audioFiles);

  return (
    <div className="">
      <h2 className="text-lg font-semibold text-purple-700 mb-4 text-center md:text-center">
        Your audio files
      </h2>
      <ul className="space-y-4">
        {audioFiles.map((file, index) => (
          <li key={file.id} className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <span>📁 AudioFile {index + 1}</span>
            </div>
            <audio controls className="w-full">
              <source src={file.url} type={getMimeType(file.url)} />
              Your browser does not support the audio player
            </audio>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;
