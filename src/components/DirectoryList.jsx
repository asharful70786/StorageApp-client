// DirectoryList.js
import { useDirectoryContext } from "../context/DirectoryContext";
import DirectoryItem from "./DirectoryItem";

function DirectoryList({ items }) {
  const { progressMap } = useDirectoryContext();

  return (
    <div>
      {items.map((item) => {
        const uploadProgress = progressMap[item.id] || 0;
        return (
          <DirectoryItem
            key={item.id}
            item={item}
            uploadProgress={uploadProgress}
          />
        );
      })}
    </div>
  );
}

export default DirectoryList;
